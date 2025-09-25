import mongoose, { Schema } from 'mongoose';
import {
  PaymentProvider,
  TransactionStatus,
  TransactionType,
} from './transaction.utils';

export interface ITransaction {
  user: Schema.Types.ObjectId;
  amount: number;
  currency: string;
  transactionType: string;
  status: string;
  paymentProvider: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySubscriptionId?: string;
  razorpaySignature?: string;
  metadata?: Record<string, any>;
  credits?: number;
  subscriptionPlan?: {
    name: string;
    duration: number;
    features: string[];
  };
}

const TransactionSchema: Schema<ITransaction> = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: 'INR',
    },
    transactionType: {
      type: String,
      required: true,
      enum: Object.values(TransactionType),
      index: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(TransactionStatus),
      index: true,
      default: TransactionStatus.PENDING,
    },
    paymentProvider: {
      type: String,
      required: true,
      enum: Object.values(PaymentProvider),
      default: PaymentProvider.RAZORPAY,
    },
    razorpayOrderId: {
      type: String,
      sparse: true,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      sparse: true,
      index: true,
    },
    razorpaySubscriptionId: {
      type: String,
      sparse: true,
      index: true,
    },
    razorpaySignature: {
      type: String,
    },
    metadata: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {},
    },
    credits: {
      type: Number,
    },
    subscriptionPlan: {
      name: {
        type: String,
      },
      duration: {
        type: Number, // in days
      },
      features: [
        {
          type: String,
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model<ITransaction>(
  'Transaction',
  TransactionSchema
);

export default Transaction;
