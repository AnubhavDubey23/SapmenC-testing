import { API_URL } from '.';

const PAYMENT_API_ENPOINTS = {
  CREATE_SUBSCRIPTION: (planId: string) =>
    `${API_URL}/payments/subscribe/${planId}`,
  CREATE_HYBRID_SUBSCRIPTION: (planId: string) =>
    `${API_URL}/payments/subscribe-hybrid/${planId}`,
  VERIFY_SUBSCRIPTION: `${API_URL}/payments/verify`,
  VERIFY_HYBRID_SUBSCRIPTION: `${API_URL}/payments/verify-hybrid`,
  CREATE_BETA_SUBSCRIPTION: `${API_URL}/payments/subscribe-beta`,

  PURCHASE_CREDITS: `${API_URL}/payments/credits`,
  VERIFY_PURCHASE_CREDITS: `${API_URL}/payments/credits/verify`,
} as const;

export default PAYMENT_API_ENPOINTS;
