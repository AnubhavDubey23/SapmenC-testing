export type ForgotPasswordPayload = {
  email: string;
};

export type VerifyEmailPayload = {
  email: string;
  otp: string;
};

export type ResetPasswordPayload = {
  email: string;
  //    otp: string;
  newPassword: string;
  reEnterPassword: string;
};

export type VerifyOTPPayload = VerifyEmailPayload;
