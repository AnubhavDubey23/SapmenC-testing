import { API_URL } from '.';

const PAYMENT_LOG_API_ENPOINTS = {
  CREATE_PAYMENT__LOG: `${API_URL}/payment-log`,
} as const;

export default PAYMENT_LOG_API_ENPOINTS;
