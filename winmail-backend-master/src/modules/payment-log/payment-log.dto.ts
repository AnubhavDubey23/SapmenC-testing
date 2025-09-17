import { ObjectId } from 'mongoose';

export type CreatePaymentLogDTO = {
  user_id: ObjectId;
  error_code: string;
  error_description: string;
  error_source: string;
  error_step: string;
  error_reason: string;
  order_id: string;
  payment_id: string;
};
