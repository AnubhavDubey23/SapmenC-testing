import mongoose, { Document, ObjectId, Schema } from 'mongoose';

export interface ISegment extends Document {
  name: string;
  description?: string;
  recipients: any;
  created_by: string | ObjectId;
  updated_by: string | ObjectId;
  is_active?: boolean;
}

const SegmentSchema: Schema<ISegment> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    recipients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact',
      },
    ],
    created_by: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISegment>('Segment', SegmentSchema, 'segments');
