import express, { Request, Response } from 'express';

import * as PaymentLogController from './payment-log.controllers';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

const router = express.Router();

router.post('/', (req: Request, res: Response) =>
  PaymentLogController.createPaymentLog(req as AuthenticatedRequest, res)
);
router.get('/', PaymentLogController.getPaymentLogs);
router.get('/:id', PaymentLogController.getPaymentLogById);
router.put('/:id', PaymentLogController.updatePaymentLog);
router.delete('/:id', PaymentLogController.deletePaymentLog);

export default router;
