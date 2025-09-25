import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import router from './routes';
import cors from 'cors';
import { getBackendBaseUrl } from './utils/helper';
import morgan from 'morgan';
import limiter from './config/rate-limiter';
import { envConfig } from './config/environment-manager';
import { corsOptions } from './config/cors';
import multer from 'multer';
import { logger } from './classes/Logger';

dotenv.config();

const app: Express = express();
const upload = multer();

const PORT = envConfig.PORT || 5000;

app.use(limiter);

app.use(express.json());

app.use(upload.array('attachments'));

app.use(morgan('tiny'));

app.use(cors(corsOptions));

app.use('/api/v1', router);

app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    status: true,
    message: envConfig.APP_NAME,
    documentation: getBackendBaseUrl(false) + '/api/v1/docs',
  });
});

app.use('*', (_req: Request, res: Response) => {
  res.status(404).json({
    status: false,
    message: 'Resource not found',
    documentation: getBackendBaseUrl(false) + '/api/v1/docs',
  });
});

app.listen(PORT, async () => {
  await connectDB({});
  logger.info(`Server Running on port ${PORT} in ${envConfig.APP_ENV} mode`);
});
