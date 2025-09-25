import mongoose, { Document, ObjectId, Schema } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email: string;
  created_by: ObjectId | object;
  updated_by: ObjectId | object;
  assigned_segment: any;
}

const ContactSchema: Schema<IContact> = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    assigned_segment: {
      type: Schema.Types.ObjectId,
      ref: 'Segment',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IContact>('Contact', ContactSchema);
