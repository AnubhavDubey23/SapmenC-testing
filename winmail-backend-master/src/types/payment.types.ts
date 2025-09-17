export enum PaymentStatus {
  CREATED = 'created',
  AUTHORIZED = 'authorized',
  CAPTURED = 'captured',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum EPaymentEvent {
  SUBSCRIPTION_AUTHENTICATED = 'subscription.authenticated',
  SUBSCRIPTION_ACTIVATED = 'subscription.activated',
  SUBSCRIPTION_CHARGED = 'subscription.charged',
  SUBSCRIPTION_COMPLETED = 'subscription.completed',
  SUBSCRIPTION_UPDATED = 'subscription.updated',
  SUBSCRIPTION_PENDING = 'subscription.pending',
  SUBSCRIPTION_HALTED = 'subscription.halted',
  SUBSCRIPTION_CANCELLED = 'subscription.cancelled',
  SUBSCRIPTION_PAUSED = 'subscription.paused',
  SUBSCRIPTION_RESUMED = 'subscription.resumed',
  ORDER_PAID = 'order.paid',
}

export type TCurrency = 'INR' | 'USD';

export type TWebhookOrderPayload = {
  entity: {
    id: string;
    entity: 'order';
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: TCurrency;
    receipt: string;
    offer_id: string | null;
    status: string;
    attempts: number;
    notes: Record<string, string>;
    created_at: number;
  };
};

export type TWebhookSubscriptionPayload = {
  entity: {
    id: string;
    entity: 'subscription';
    plan_id: string;
    customer_id: string;
    status: string;
    current_start: number | null;
    current_end: number | null;
    ended_at: number | null;
    quantity: number;
    notes: Record<string, string>;
    charge_at: number;
    start_at: number;
    end_at: number;
    auth_attempts: number;
    total_count: number;
    paid_count: number;
    customer_notify: boolean;
    created_at: number;
    expire_by: number | null;
    short_url: string | null;
    has_scheduled_changes: boolean;
    change_scheduled_at: number | null;
    source: string;
    offer_id: string | null;
    remaining_count: number;
  };
};

export type TWebhookPaymentPayload = {
  entity: {
    id: string;
    entity: 'payment';
    amount: number;
    currency: TCurrency;
    status: string;
    order_id: string;
    invoice_id: string | null;
    international: boolean;
    method: string;
    amount_refunded: number;
    refund_status: string | null;
    captured: boolean;
    description: string | null;
    card_id: string | null;
    bank: string;
    wallet: string | null;
    vpa: string | null;
    email: string;
    contact: string;
    notes: Record<string, string>;
    fee: number | null;
    tax: number | null;
    error_code: number | null;
    error_description: string | null;
    error_source: string | null;
    error_step: number | null;
    error_reason: string | null;
    acquirer_data: {
      bank_transaction_id: string;
    };
    created_at: number;
  };
};
