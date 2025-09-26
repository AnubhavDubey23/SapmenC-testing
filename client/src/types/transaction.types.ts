export type TTransaction = {
  user: string;
  createdAt: Date;
  updatedAt: Date;
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
};

export const TransactionType = {
  CREATE_SUBSCRIPTION: 'CREATE_SUBSCRIPTION',
  RENEW_SUBSCRIPTION: 'RENEW_SUBSCRIPTION',
  CANCEL_SUBSCRIPTION: 'CANCEL_SUBSCRIPTION',
  PURCHASE_CREDITS: 'PURCHASE_CREDITS',
  REFUND: 'REFUND',
} as const;
