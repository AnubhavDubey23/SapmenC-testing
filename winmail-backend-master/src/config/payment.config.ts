import Razorpay from 'razorpay';
import { envConfig } from './environment-manager';

const razorpay = new Razorpay({
  key_id: envConfig.RAZORPAY_KEY_ID!,
  key_secret: envConfig.RAZORPAY_KEY_SECRET!,
});

export default razorpay;
