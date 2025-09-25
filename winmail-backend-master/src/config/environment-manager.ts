import dotenv from 'dotenv';
dotenv.config();

export const envConfig = {
  APP_ENV: process.env.APP_ENV,
  APP_NAME: process.env.APP_NAME,
  PORT: Number(process.env.PORT),
  JWT_SECRET: process.env.JWT_SECRET,
  MONGODB_URI: process.env.MONGODB_URI,
  SMTP_EMAIL: process.env.SMTP_EMAIL,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  FRONTEND_BASE_URL: process.env.FRONTEND_BASE_URL,
  CRYPTR_SECRET_KEY: process.env.CRYPTR_SECRET_KEY,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET,
};
