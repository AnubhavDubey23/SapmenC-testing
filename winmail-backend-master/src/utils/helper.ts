import Cryptr from 'cryptr';
import dotenv from 'dotenv';
import userModel from '../modules/user/user.model';
import { BACKEND_BASE_URL } from '../consts/defaults';
import { envConfig } from '../config/environment-manager';
dotenv.config();

const cryptr = new Cryptr(envConfig.CRYPTR_SECRET_KEY as string);

export const generateUniqueUsername: (name: string) => Promise<string> = async (
  name: string
) => {
  try {
    let username = name.replace(/\s/g, '').toLowerCase();
    const user = await userModel.findOne({ username: username }).exec();
    if (user) {
      username = username + Math.floor(Math.random() * 1000);
    }
    return username;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export const encryptPassword = (password: string): string => {
  return cryptr.encrypt(password);
};

export const decryptPassword = (password: string): string => {
  return cryptr.decrypt(password);
};

export const getBackendBaseUrl: (dev?: boolean) => string = (
  dev = true
): string => {
  if (dev) {
    return 'http://localhost:5003';
  } else {
    return 'https://api.mailerone.in';
  }
};

export const generateOtp = (digits: number = 4) => {
  let otp = '';
  for (let i = 0; i < digits; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};

export const generateSubscriptionId = (planId: string) => {
  return planId + Math.floor(1000 + Math.random() * 9000).toString();
};

export const isPlanExpired: (expiryDate: Date) => boolean = (
  expiryDate: Date
) => {
  const currentDate = new Date();
  const currentTimestamp = Math.floor(currentDate.getTime() / 1000);
  const expiryTimestamp = Math.floor(expiryDate.getTime() / 1000);

  return currentTimestamp > expiryTimestamp;
};

export const getRemainingDays: (
  startDate: Date,
  duration?: number
) => number = (startDate: Date, duration: number = 7) => {
  const currentDate = new Date();
  const diffInTime = currentDate.getTime() - startDate.getTime();
  const diffInDays = duration - diffInTime / (1000 * 3600 * 24);

  // round of 6.76 to 6 because plan is expired on 7th day

  let remainingDays = diffInDays;
  if (remainingDays < 0) {
    return 0;
  }

  return remainingDays;
};

export const generateTrackingPixelURL = (
  recipient_email: string,
  template_id: string,
  segment_id: string,
  pixel_id: string
) => {
  return `${BACKEND_BASE_URL}/mails/tracking-pixel?recipient_email=${encodeURIComponent(recipient_email)}&template_id=${template_id}&segment_id=${segment_id}&pixel_id=${pixel_id}`;
};
