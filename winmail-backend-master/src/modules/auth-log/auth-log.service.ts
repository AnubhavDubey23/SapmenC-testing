import { DeviceDetectorResult } from 'device-detector-js';
import mongoose from 'mongoose';
import authLogModel from './auth-log.model';

export const createAuthLog = async (
  userId: string,
  device: DeviceDetectorResult
) => {
  try {
    const now = new Date();
    await authLogModel.create({
      user: new mongoose.Types.ObjectId(userId),
      details: device,
      lastLogin: now,
    });
  } catch (err: any) {
    console.log(err);
    throw new Error(err.message);
  }
};
