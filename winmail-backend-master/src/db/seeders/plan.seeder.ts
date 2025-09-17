import { Connection, ObjectId } from 'mongoose';
import { connectDB } from '../../config/db';

const PLANS_DATA = [
  {
    period: 'monthly',
    interval: 1,
    item: {
      planName: '',
      amount: '',
      currency: 'INR',
      description: '',
    },
  },
];
