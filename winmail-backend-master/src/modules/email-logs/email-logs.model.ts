import mongoose, { Document, ObjectId, Schema } from 'mongoose';

export interface IEmailLog extends Document {
  templateId: any;
  segmentId: any;
  open_count: number;
  recipient_email: string;
  recipient_name: string;
  pixel_id: string;
  tracking_pixel_url: string;
  bounce: boolean;
}

const EmailLogSchema: Schema<IEmailLog> = new mongoose.Schema(
  {
    pixel_id: {
      type: String,
      required: true,
    },
    templateId: {
      type: Schema.Types.ObjectId,
      ref: 'Template',
      required: true,
    },
    segmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Segment',
      required: true,
    },
    open_count: {
      type: Number,
      default: 0,
    },
    recipient_email: {
      type: String,
      required: true,
    },
    recipient_name: {
      type: String,
      required: true,
    },
    tracking_pixel_url: {
      type: String,
      required: true,
    },
    bounce: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IEmailLog>('EmailLog', EmailLogSchema);
