import { ObjectId } from 'mongoose';
import ActivityLog, { IActivityLog } from './activity-log.model';
import * as ActivityLogRepository from './activity-log.repository';
import { logger } from '../../classes/Logger';

export const logActivity = async (logData: Partial<IActivityLog>) => {
  try {
    const activity = new ActivityLog(logData);
    await activity.save();
    return activity;
  } catch (error: any) {
    logger.error(`Failed to save activity log: ${error.message}`, {
      origin: 'services/activity-log',
    });
    throw error;
  }
};

export const getActivity = async (userId: string | ObjectId) => {
  try {
    const activity = await ActivityLogRepository.getActivity(userId);

    if (!activity) {
      throw new Error('No activity with this user');
    }

    return activity;
  } catch (error: any) {
    logger.error(`Failed to get activity log: ${error.message}`, {
      origin: 'services/activity-log',
    });
    throw error;
  }
};
