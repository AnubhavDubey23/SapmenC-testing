import { Request, Response } from 'express';
import AuthService from './auth.service';
import {
  ForgotPasswordPayload,
  LoginPayload,
  ResetPasswordPayload,
  VerifyEmailPayload,
} from './auth.dto';
import PlanService from '../plan/plan.service';
import { CreateUserDTO } from '../user/user.dto';
import {
  getDeviceDetectorResult,
} from '../../utils/deviceDetector';
import { UserError } from './auth.consts';

interface IAuthController {
  signUp(req: Request, res: Response): Promise<void>;
  login(req: Request, res: Response): Promise<void>;
  forgotPassword(req: Request, res: Response): Promise<void>;
  resetPassword(req: Request, res: Response): Promise<void>;
  verifyEmail(req: Request, res: Response): Promise<void>;
  verifyOTP(req: Request, res: Response): Promise<void>;
}

class AuthController implements IAuthController {
  private static instance: AuthController;

  public static getInstance(): AuthController {
    if (!AuthController.instance) {
      AuthController.instance = new AuthController();
      Object.freeze(AuthController.instance);
    }

    return AuthController.instance;
  }

  async signUp(req: Request, res: Response): Promise<void> {
    try {
      const { isExisting, user } = await AuthService.signUp(
        req.body as CreateUserDTO
      );

      const statusCode = isExisting ? 403 : 201;
      const data = isExisting ? null : user;

      res.status(statusCode).json({
        status: true,
        message: 'OTP sent to your email',
        data,
      });

      return;
    } catch (err: any) {
      res.status(500).json({
        status: false,
        message: err.message,
        data: null,
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body as LoginPayload;
    try {
      const deviceResult = getDeviceDetectorResult(req);
      const user = await AuthService.loginUser(email, password, deviceResult);

      res.status(200).json({
        status: true,
        message: 'User logged in successfully',
        data: user,
      });
    } catch (err: any) {
      switch (err.message) {
        case UserError.VERIFY_EMAIL_ERROR:
          res.status(403).json({
            status: false,
            message: 'Please verify your email',
            data: null,
          });
          return;
        case UserError.USER_NOT_FOUND:
          res.status(404).json({
            status: false,
            message: 'User not found',
            data: null,
          });
          return;
        default:
          res.status(500).json({
            status: false,
            message: err.message,
            data: null,
          });
          return;
      }
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const payload = req.body as ForgotPasswordPayload;
      const data = await AuthService.forgotPassword(payload);

      res.status(200).json({
        status: true,
        message: 'Password reset successfully',
        data: data,
      });
    } catch (err: any) {
      res.status(500).json({
        status: false,
        message: err.message,
        data: null,
      });
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const payload = req.body as ResetPasswordPayload;
      const data = await AuthService.resetPassword(payload);

      res.status(200).json({
        status: true,
        message: 'Password reset successfully',
        data: data,
      });
    } catch (err: any) {
      res.status(500).json({
        status: false,
        message: err.message,
        data: null,
      });
    }
  }

  async verifyEmail(req: Request, res: Response): Promise<void> {
    try {
      const payload = req.body as VerifyEmailPayload;
      const user = await AuthService.verifyEmail(payload);

      await PlanService.startFreePlan(user._id as string);

      res.status(200).json({
        status: true,
        message: 'Email verified successfully',
        data: user,
      });
    } catch (err: any) {
      res.status(500).json({
        status: false,
        message: err.message,
        data: null,
      });
    }
  }

  async verifyOTP(req: Request, res: Response): Promise<void> {
    try {
      const payload: VerifyEmailPayload = req.body;
      const data = await AuthService.verifyOTP(payload);

      res.status(200).json({
        status: true,
        message: 'OTP verified successfully',
        data: data,
      });
    } catch (err: any) {
      res.status(500).json({
        status: false,
        message: err.message,
        data: null,
      });
    }
  }
}

export default AuthController.getInstance();
