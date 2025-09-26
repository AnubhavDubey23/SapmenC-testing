import { API_URL } from '.';

const AUTH_API_ENPOINTS = {
  LOGIN: `${API_URL}/auth/login`,
  SIGNUP: `${API_URL}/auth/signup`,
  FORGOT_PASSWORD: `${API_URL}/auth/forgot-password`,
  RESET_PASSWORD: `${API_URL}/auth/reset-password`,
  VERIFY_EMAIL: `${API_URL}/auth/verify-email`,
  VERIFY_OTP: `${API_URL}/auth/verify-otp`,
} as const;

export default AUTH_API_ENPOINTS;
