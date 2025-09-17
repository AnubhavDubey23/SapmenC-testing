import { ObjectId } from 'mongoose';
import ActivityLog from './activity-log.model';

export const getActivity = async (userId: string | ObjectId) => {
  try {
    const activity = await ActivityLog.find({ user: userId }).sort({
      createdAt: -1,
    });
    return activity;
  } catch (err) {
    throw err;
  }
};
