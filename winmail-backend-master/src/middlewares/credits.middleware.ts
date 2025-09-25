import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import userModel from '../modules/user/user.model';

export const checkCredits = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: userId } = req.user;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(400).json({
        status: false,
        message: 'User not found',
        data: null,
      });
    }

    if (user.credits <= 0) {
      return res.status(403).json({
        status: false,
        message: 'No credits available. Purchase credits to perform actions.',
        data: null,
      });
    }

    next();
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
