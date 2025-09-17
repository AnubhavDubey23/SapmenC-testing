import DeviceDetector, { DeviceDetectorResult } from 'device-detector-js';
import mongoose, { Document, Schema } from 'mongoose';

export interface IAuthLog extends Document {
  user: Schema.Types.ObjectId;
  details: DeviceDetectorResult;
  lastLogin: Date;
}

const AuthLogSchema: Schema<IAuthLog> = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    details: {
      type: Schema.Types.Mixed,
      required: true,
    },
    lastLogin: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IAuthLog>('AuthLog', AuthLogSchema);
