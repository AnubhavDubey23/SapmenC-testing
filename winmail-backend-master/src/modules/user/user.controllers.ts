import { Response } from 'express';

import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import authLogModel from '../auth-log/auth-log.model';

import userModel from './user.model';
import UserRepository from './user.repository';
import UserService from './user.service';
import { logger } from '../../classes/Logger';

interface IUserController {
  logout(req: AuthenticatedRequest, res: Response): Promise<void>;
  logoutAllDevices(req: AuthenticatedRequest, res: Response): Promise<void>;
  changePassword(req: AuthenticatedRequest, res: Response): Promise<void>;
  updateProfile(req: AuthenticatedRequest, res: Response): Promise<void>;
  deleteProfile(req: AuthenticatedRequest, res: Response): Promise<void>;
  fetchAllUsers(req: AuthenticatedRequest, res: Response): Promise<void>;
  fetchUserById(req: AuthenticatedRequest, res: Response): Promise<any>;
  updateUser(req: AuthenticatedRequest, res: Response): Promise<void>;
  getUserPlanDetails(req: AuthenticatedRequest, res: Response): Promise<any>;
}

class UserController implements IUserController {
  private static instance: UserController;

  static getInstance(): UserController {
    if (!UserController.instance) {
      UserController.instance = new UserController();
      Object.freeze(UserController.instance);
    }
    return UserController.instance;
  }

  async logout(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user.id;
      // const logoutServiceResponse = await UserService.logoutUser(userId);
      // if (!logoutServiceResponse) {
      //   throw new Error('User not found');
      // }
      await UserService.logoutUser(userId);

      res.status(200).json({
        status: true,
        message: 'User logged out successfully',
        data: null,
      });
    } catch (err: any) {
      res.status(500).json({
        status: false,
        message: err.message,
        data: null,
      });
    }
  }

  async logoutAllDevices(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
    } catch (err) {
      console.error('Error in logoutAllDevices', err);
    }
  }

  async changePassword(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id: userId } = req.user;
    } catch (err) {
      console.error('Error in changePassword', err);
    }
  }

  async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id: userId } = req.user;

      const user = await UserService.updateUser(userId, req.body);

      res.status(200).json({
        status: true,
        message: 'User updated successfully',
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

  async deleteProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id: userId } = req.user;
      const user = await UserService.deleteUser(userId);

      res.status(200).json({
        status: true,
        message: 'User deleted successfully',
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

  async fetchAllUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json({
        status: true,
        message: 'All users fetched successfully',
        data: users,
      });
    } catch (err: any) {
      res.status(500).json({
        status: false,
        message: err.message,
        data: null,
      });
    }
  }

  async fetchUserById(req: AuthenticatedRequest, res: Response): Promise<any> {
    try {
      if (req.params.id == 'me') {
        const { id: userId } = req.user;
        const user = await userModel
          .findById(userId)
          .select('-password')
          .populate('role');
        if (!user) {
          throw new Error('User not found');
        }
        const device = await authLogModel
          .find({ user: userId })
          .sort({ lastLogin: -1 });

        return res.status(200).json({
          status: true,
          message: 'User fetched successfully',
          data: user,
          device: device,
        });
      }
      const user = await userModel.findById(req.params.id);
      if (!user) {
        throw new Error('User not found');
      }

      res.status(200).json({
        status: true,
        message: 'User fetched successfully',
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

  async updateUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const updatedUser = await UserService.updateUser(req.params.id, req.body);
      res.status(200).json({
        status: true,
        message: 'User updated successfully',
        data: updatedUser,
      });
    } catch (err: any) {
      res.status(500).json({
        status: false,
        message: err.message,
        data: null,
      });
    }
  }

  async getUserPlanDetails(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<any> {
    try {
      const { id: userId } = req.user;
      const planDetails = await UserRepository.getPlanDetailsByUserId(userId);
      return res.status(200).json({
        status: true,
        message: 'Plan details fetched successfully for the user' + userId,
        data: planDetails,
      });
    } catch (err: any) {
      logger.error(`Failed to get user plan details: ${err.message}`, {
        origin: 'controllers/user',
      });
      return res.status(500).json({
        status: false,
        message: err.message,
        data: null,
      });
    }
  }
}

export default UserController.getInstance();
