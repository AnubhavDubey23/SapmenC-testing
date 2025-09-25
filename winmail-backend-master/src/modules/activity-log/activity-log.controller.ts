import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import * as ActivityLogService from './activity-log.service';

export const getActivity = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id: userId } = req.user;
    const activity = await ActivityLogService.getActivity(userId);
    res.status(200).json({
      status: true,
      message: 'Activity fetched',
      data: activity,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};
