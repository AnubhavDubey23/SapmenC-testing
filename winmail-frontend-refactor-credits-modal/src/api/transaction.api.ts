import { API_URL } from '.';

const TRANSACTION_API_ENDPOINTS = {
  GET_TRANSACTIONS: `${API_URL}/transactions`,
} as const;

export default TRANSACTION_API_ENDPOINTS;
