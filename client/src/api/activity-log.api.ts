import { API_URL } from '.';

const ACTIVITY_LOG_API_ENDPOINTS = {
  GET_ACTIVITY: `${API_URL}/activity-log`,
} as const;

export default ACTIVITY_LOG_API_ENDPOINTS;
