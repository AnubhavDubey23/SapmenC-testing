import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { DeviceDetectorResult } from 'device-detector-js';
import {
  sendEmailVerificationMail,
  sendForgotPasswordMail,
} from '../mail/mail.service';
import { encryptPassword, generateOtp } from '../../utils/helper';
import { createAuthLog } from '../auth-log/auth-log.service';
import { createToken } from '../token/token.service';
import {
  ForgotPasswordPayload,
  ResetPasswordPayload,
  VerifyEmailPayload,
  VerifyOTPPayload,
} from './auth.dto';
import UserService from '../user/user.service';
import { logger } from '../../classes/Logger';
import { CreateUserDTO } from '../user/user.dto';
import { UserError } from './auth.consts';

dotenv.config();

const { JWT_SECRET } = process.env;

type UserResponse = {
  _id: string;
  name: string;
  email: string;
  activeTokens: string[];
  currentToken?: string;
  password?: string;
};

type UserWithoutPassword = Omit<UserResponse, 'password'>;

interface IAuthService {
  signUp(
    body: CreateUserDTO
  ): Promise<{ isExisting: boolean; user: UserWithoutPassword }>;
  loginUser(
    email: string,
    password: string,
    device: DeviceDetectorResult
  ): Promise<UserWithoutPassword>;
  forgotPassword(body: ForgotPasswordPayload): Promise<{ message: string }>;
  resetPassword(body: ResetPasswordPayload): Promise<{ message: string }>;
  verifyOTP(body: VerifyOTPPayload): Promise<{ message: string }>;
  verifyEmail(body: VerifyEmailPayload): Promise<UserWithoutPassword>;
}

class AuthService implements IAuthService {
  private static instance: AuthService;

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
      Object.freeze(AuthService.instance);
    }

    return AuthService.instance;
  }

  async signUp(
    body: CreateUserDTO
  ): Promise<{ isExisting: boolean; user: UserWithoutPassword }> {
    try {
      const existingUser = await UserService.isUserExist(body.email);

      if (existingUser && existingUser.is_verified) {
        throw new Error('User already exists');
      }

      if (existingUser && !existingUser.is_verified) {
        const otp = generateOtp();
        existingUser.otp = otp;
        await existingUser.save();
        await sendEmailVerificationMail(existingUser.email, otp);

        const user: UserWithoutPassword = {
          _id: existingUser._id as string,
          name: existingUser.name,
          email: existingUser.email,
          activeTokens: existingUser.activeTokens,
        };

        return {
          isExisting: true,
          user,
        };
      }

      const user = await UserService.createUser(body);

      const newUser: UserWithoutPassword = {
        _id: user._id as string,
        name: user.name,
        email: user.email,
        activeTokens: user.activeTokens,
      };

      return {
        isExisting: false,
        user: newUser,
      };
    } catch (err) {
      logger.error(`Failed to sign up user for ${body.email}: ${err}`, {
        origin: 'services/auth',
      });
      throw err;
    }
  }

  async loginUser(
    email: string,
    password: string,
    device: DeviceDetectorResult
  ): Promise<UserWithoutPassword> {
    try {
      const user = await UserService.isUserExist(email);

      if (!user) {
        throw new Error('User not found');
      }

      const passwordMatched = await UserService.isPasswordMatched(
        password,
        user
      );
      if (!passwordMatched) {
        throw new Error('Invalid email or password');
      }

      if (!user.is_verified) {
        const otp = generateOtp();
        user.otp = otp;
        await user.save();
        await sendEmailVerificationMail(user?.email, otp);
        throw new Error(UserError.VERIFY_EMAIL_ERROR);
      }

      // generate token
      const newToken = jwt.sign({ userId: user._id }, JWT_SECRET!, {
        expiresIn: '7h',
      });
      const token = await createToken(newToken, user);
      user.activeTokens.push(token._id as string);
      await user.save();

      await createAuthLog(user._id as string, device);

      const userResponse = user.toObject() as UserResponse;
      userResponse.currentToken = newToken;
      delete userResponse.password;
      return userResponse;
    } catch (err: any) {
      logger.error(`Failed to login user for ${email}: ${err.message}`, {
        origin: 'services/auth',
      });
      throw err;
    }
  }

  async forgotPassword(body: ForgotPasswordPayload) {
    try {
      // generate otp
      const otp = generateOtp();
      // send email to user
      const user = await UserService.isUserExist(body.email);
      if (!user) {
        throw new Error(UserError.USER_NOT_FOUND);
      }
      user.otp = otp;
      await user.save();
      await sendForgotPasswordMail(body.email, otp);

      return {
        message: 'OTP sent to your email',
      };
    } catch (err: any) {
      logger.error(
        `Failed to perform forgot password for ${body.email}: ${err.message}`,
        {
          origin: 'services/auth',
        }
      );
      throw err;
    }
  }

  async resetPassword(
    body: ResetPasswordPayload
  ): Promise<{ message: string }> {
    try {
      const user = await UserService.isUserExist(body.email);

      if (!user) {
        throw new Error(UserError.USER_NOT_FOUND);
      }

      const encryptedPassword = encryptPassword(body.newPassword);
      user.password = encryptedPassword;
      user.otp = ''; // Clear OTP after password reset

      await user.save();

      return { message: 'Password reset successfully' };
    } catch (err: any) {
      logger.error(
        `Failed to reset password for ${body.email}: ${err.message}`,
        {
          origin: 'services/auth',
        }
      );
      throw err;
    }
  }

  async verifyOTP(body: VerifyOTPPayload): Promise<{ message: string }> {
    try {
      const user = await UserService.isUserExist(body.email);
      if (!user) {
        throw new Error(UserError.USER_NOT_FOUND);
      }

      if (user.otp !== body.otp) {
        throw new Error('Invalid OTP');
      }

      user.otp = '';
      await user.save();

      return { message: 'OTP verified successfully' };
    } catch (err: any) {
      logger.error(`Failed to verify OTP for ${body.email}: ${err.message}`, {
        origin: 'services/auth',
      });
      throw err;
    }
  }
  async verifyEmail(body: VerifyEmailPayload): Promise<UserWithoutPassword> {
    try {
      const { email, otp } = body;
      const existingUser = await UserService.isUserExist(email);
      if (!existingUser) {
        throw new Error('User not found');
      }

      if (existingUser.otp !== otp) {
        throw new Error('Invalid OTP');
      }

      existingUser.otp = '';
      existingUser.is_verified = true;
      await existingUser.save();

      const verifiedUser: UserWithoutPassword = {
        _id: existingUser._id as string,
        name: existingUser.name,
        email: existingUser.email,
        activeTokens: existingUser.activeTokens,
      };

      return verifiedUser;
    } catch (err) {
      throw err;
    }
  }
}

export default AuthService.getInstance();
