import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscription extends Document {
  email: string;
  is_active: boolean;
  user: any;
}

const SubscriptionSchema: Schema<ISubscription> = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export const SubscriptionModel = mongoose.model<ISubscription>(
  'Subscription',
  SubscriptionSchema
);
