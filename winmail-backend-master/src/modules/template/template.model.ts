import mongoose, { Document, ObjectId, Schema } from 'mongoose';

export interface ITemplate extends Document {
  name: string;
  description?: string;
  email_data: any;
  created_by: any;
  updated_by: any;
  is_active?: boolean;
  subject: string;
  is_triggered?: boolean;
  segments_used: Array<string | ObjectId>;
}

const TemplateSchema: Schema<ITemplate> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    email_data: {
      type: Object,
      required: true,
    },
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
    is_triggered: {
      type: Boolean,
      default: false,
    },
    subject: {
      type: String,
      required: true,
    },
    // add reference to segments
    segments_used: {
      type: [Schema.Types.ObjectId],
      ref: 'Segment',
      default: [],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITemplate>(
  'Template',
  TemplateSchema,
  'templates'
);
