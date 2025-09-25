import { Request, Response, Router } from 'express';
import * as PaymentController from './payment.controller';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
const router = Router();

router.post('/subscribe/:planId', (req: Request, res: Response) =>
  PaymentController.createSubscription(req as AuthenticatedRequest, res)
);

router.post('/credits', (req: Request, res: Response) =>
  PaymentController.purchaseCredits(req as AuthenticatedRequest, res)
);

router.post('/credits/verify', (req: Request, res: Response) =>
  PaymentController.verifyPurchaseCredits(req as AuthenticatedRequest, res)
);

router.post('/verify', (req: Request, res: Response) =>
  PaymentController.verifySubscription(req as AuthenticatedRequest, res)
);

export default router;
