import { ObjectId } from 'mongoose';

export type TMarketingMailDTO = {
  segmentIds: string;
  templateId: string | ObjectId;
  userId: string | ObjectId;
};
