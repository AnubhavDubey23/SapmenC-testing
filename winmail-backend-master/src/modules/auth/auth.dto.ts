export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  email: string;
  //    otp: string;
  newPassword: string;
};

export type VerifyEmailPayload = {
  email: string;
  otp: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type VerifyOTPPayload = {
  email: string;
  otp: string;
};
