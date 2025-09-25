import mongoose, { Document, ObjectId, Schema } from 'mongoose';

export interface IPaymentLog extends Document {
  user_id: ObjectId;
  error_code: string;
  error_description: string;
  error_source: string;
  error_step: string;
  error_reason: string;
  order_id: string;
  payment_id: string;
}

const PaymentLogSchema: Schema<IPaymentLog> = new mongoose.Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  error_code: {
    type: String,
    required: true,
  },
  error_description: {
    type: String,
    required: true,
  },
  error_source: {
    type: String,
    required: true,
  },
  error_step: {
    type: String,
    required: true,
  },
  error_reason: {
    type: String,
    required: true,
  },
  order_id: {
    type: String,
    required: true,
  },
  payment_id: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IPaymentLog>('PaymentLog', PaymentLogSchema);
