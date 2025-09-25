import mongoose, { Document, Schema } from 'mongoose';
import { IRole } from '../role/role.model';

export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
  is_deleted: boolean;
  is_product_tour_seen: boolean;
  gender: string;
  activeTokens: any;
  profilePicture: string;
  role: IRole;
  nodemailer_config: object;
  subscription: {
    id: string;
    status: string;
    startDate: Date;
    expiryDate: Date;
    plan: string;
  };
  otp: string;
  is_verified: boolean;
  total_segment_count: number;
  total_template_count: number;
  total_triggered_email_count: number;
  total_imported_contacts_count: number;
  credits: number;
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      default: null,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    activeTokens: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Token',
      },
    ],
    is_active: {
      type: Boolean,
      default: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    is_product_tour_seen: {
      type: Boolean,
      default: false,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
    },
    nodemailer_config: {
      type: Object,
      default: null,
    },
    subscription: {
      id: String,
      status: String,
      startDate: Date,
      expiryDate: Date,
      plan: String,
    },
    otp: {
      type: String,
      default: null,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    total_segment_count: {
      type: Number,
      default: 0,
    },
    total_template_count: {
      type: Number,
      default: 0,
    },
    total_triggered_email_count: {
      type: Number,
      default: 0,
    },
    total_imported_contacts_count: {
      type: Number,
      default: 0,
    },
    credits: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>('User', UserSchema);
