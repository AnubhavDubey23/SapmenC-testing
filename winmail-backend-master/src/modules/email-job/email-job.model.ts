import mongoose, { Document, Schema } from 'mongoose';
import { EEmailJobStatus } from '../../data/EMAIL_JOBS_DATA';

export interface IEmailJob extends Document {
  templateId: string;
  segmentId: string;
  userId: string;
  status: EEmailJobStatus;
}

const EmailJobSchema: Schema<IEmailJob> = new mongoose.Schema(
  {
    templateId: {
      type: String,
      required: true,
    },
    segmentId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: EEmailJobStatus.PENDING,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IEmailJob>('EmailJob', EmailJobSchema);
