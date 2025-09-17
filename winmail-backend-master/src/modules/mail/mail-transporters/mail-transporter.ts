import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { envConfig } from '../../../config/environment-manager';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: envConfig.SMTP_EMAIL,
    pass: envConfig.SMTP_PASSWORD,
  },
});

export default transporter;
