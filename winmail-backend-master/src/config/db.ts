import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { logger } from '../classes/Logger';
import { envConfig } from './environment-manager';

dotenv.config();

export interface DBConfig {
  explicitClose?: boolean;
}

export const connectDB = async ({
  explicitClose = false,
}: DBConfig): Promise<void | typeof mongoose.connection> => {
  try {
    logger.info('Connecting to MongoDB...');
    await mongoose.connect(envConfig.MONGODB_URI as string, {});
    if (explicitClose) {
      // return the connection instance
      return mongoose.connection;
    }
    logger.info('Connected to MongoDB Successfully');
  } catch (err: any) {
    logger.error(err, { origin: 'config/db' });
    process.exit(1);
  }
};
