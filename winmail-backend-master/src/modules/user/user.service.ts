import { CreateUserDTO } from './user.dto';
import userModel, { IUser } from './user.model';
import UserRepository from '../user/user.repository';
import { encryptPassword, generateUniqueUsername } from '../../utils/helper';
import { logger } from '../../classes/Logger';
import { decryptPassword } from '../../utils/helper';
import { ObjectId } from 'mongoose';

interface IUserService {
  isUserExist(email: string): Promise<IUser | null>;
  isUserExistById(email: string): Promise<IUser | null>;
  isPasswordMatched(password: string, user: any): Promise<boolean>;
  createUser(body: CreateUserDTO): Promise<IUser>;
  logoutUser(userId: string): Promise<boolean>;
  logoutUserFromAllDevices(userId: string): Promise<boolean>;
  getAllUsers(): Promise<IUser[]>;
  updateUser(id: string, body: any): Promise<IUser | null>;
  deleteUser(id: string): Promise<IUser | null>;
  incrementSegmentCount(userId: string): Promise<void>;
  decrementSegmentCount(userId: string): Promise<void>;
  incrementTemplateCount(userId: string): Promise<void>;
  decrementTemplateCount(userId: string): Promise<void>;
}

class UserService implements IUserService {
  private static instance: UserService;

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
      Object.freeze(UserService.instance);
    }
    return UserService.instance;
  }

  async isUserExist(email: string): Promise<IUser | null> {
    try {
      return await userModel
        .findOne({
          email: email.toLowerCase().trim(),
          is_active: true,
          is_deleted: false,
        })
        .select('+password');
    } catch (err: any) {
      logger.error(`Failed to check if user exists: ${err.message}`, {
        origin: 'services/user',
      });
      throw new Error(err.message);
    }
  }

  async isUserExistById(userId: string | ObjectId): Promise<IUser | null> {
    try {
      return await userModel.findById(userId);
    } catch (err: any) {
      logger.error(`Failed to check if user exists: ${err.message}`, {
        origin: 'services/user',
      });
      throw new Error(err.message);
    }
  }

  async isPasswordMatched(password: string, user: any): Promise<boolean> {
    try {
      const unhashedPassword = decryptPassword(user.password);
      const isMatched = password === unhashedPassword;
      return isMatched;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async createUser(body: CreateUserDTO): Promise<IUser> {
    try {
      const username = await generateUniqueUsername(body.name);
      const hashedPassword = encryptPassword(body.password);
      
      // Normalize email before creating user
      const normalizedEmail = body.email.toLowerCase().trim();
      
      return await UserRepository.createUser({
        name: body.name,
        email: normalizedEmail,
        password: hashedPassword,
        username: username,
        role: body.role,
      });
    } catch (err: any) {
      logger.error(`Failed to check if passwords matched: ${err.message}`, {
        origin: 'services/user',
      });
      throw new Error(err.message);
    }
  }

  async logoutUser(userId: string): Promise<boolean> {
    try {
      const user = await userModel.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      user.activeTokens = [];
      await user.save();
      return true;
    } catch (err: any) {
      logger.error(`Failed to logout user: ${err.message}`, {
        origin: 'services/user',
      });
      throw new Error(err.message);
    }
  }

  async logoutUserFromAllDevices(userId: string): Promise<boolean> {
    try {
      const user = await userModel.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      user.activeTokens = [];
      await user.save();
      return true;
    } catch (err: any) {
      logger.error(`Failed to logout user from all devices: ${err.message}`, {
        origin: 'services/user',
      });
      throw new Error(err.message);
    }
  }

  async getAllUsers(): Promise<IUser[]> {
    try {
      const users = await UserRepository.findAllUsers();
      return users;
    } catch (err: any) {
      logger.error(`Failed to get all users: ${err.message}`, {
        origin: 'services/user',
      });
      throw new Error(err.message);
    }
  }

  async updateUser(id: string, body: any): Promise<IUser | null> {
    try {
      const updatedUser = await UserRepository.updateUser(id, body);
      return updatedUser;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async deleteUser(id: string): Promise<IUser | null> {
    try {
      const deletedUser = await UserRepository.deleteUser(id);
      return deletedUser;
    } catch (err: any) {
      logger.error(`Failed to delete users: ${err.message}`, {
        origin: 'services/user',
      });
      throw new Error(err.message);
    }
  }

  async incrementSegmentCount(userId: string): Promise<void> {
    try {
      await UserRepository.updateUser(userId, {
        $inc: { total_segment_count: 1 },
      });
    } catch (err: any) {
      logger.error(
        `Failed to increment segment count for user: ${err.message}`,
        {
          origin: 'services/user',
        }
      );
      throw new Error(err.message);
    }
  }

  async decrementSegmentCount(userId: string): Promise<void> {
    try {
      await UserRepository.updateUser(userId, {
        $inc: { total_segment_count: -1 },
      });
    } catch (err: any) {
      logger.error(
        `Failed to increment template count for user: ${err.message}`,
        {
          origin: 'services/user',
        }
      );
      throw new Error(err.message);
    }
  }

  async incrementTemplateCount(userId: string): Promise<void> {
    try {
      await UserRepository.updateUser(userId, {
        $inc: { total_template_count: 1 },
      });
    } catch (err: any) {
      logger.error(
        `Failed to increment template count for user: ${err.message}`,
        {
          origin: 'services/user',
        }
      );
      throw new Error(err.message);
    }
  }

  async decrementTemplateCount(userId: string): Promise<void> {
    try {
      await UserRepository.updateUser(userId, {
        $inc: { total_template_count: -1 },
      });
    } catch (err: any) {
      logger.error(
        `Failed to increment template count for user: ${err.message}`,
        {
          origin: 'services/user',
        }
      );
      throw new Error(err.message);
    }
  }
}

const userService = UserService.getInstance();
export default userService;
