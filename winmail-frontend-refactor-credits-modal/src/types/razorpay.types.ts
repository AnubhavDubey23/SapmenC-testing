export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpaySubscriptionSuccessResponse {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
}
export interface RazorpayErrorResponse {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: {
      order_id: string;
      payment_id: string;
    };
  };
}

export interface RazorpayOpts {
  key: string;
  amount?: number; // Subscriptions don't need an amount
  currency: 'INR';
  name?: string;
  description?: string;
  image?: string;
  handler: (response: RazorpaySuccessResponse) => Promise<void>;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
}

export type RazorpayPaymentOpts = RazorpayOpts & {
  order_id?: string;
  subscription_id?: string;
  modal?: {
    confirm_close?: boolean;
    escape?: boolean;
    animation?: boolean;
    backdropclose?: boolean;
    ondismiss?: () => void;
  };
};
