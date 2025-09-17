import { Request, Response, Router } from 'express';
import WebhookController from './webhook.controller';

const router = Router();

router.post('/razorpay', (req: Request, res: Response) =>
  WebhookController.handleRazorpayWebhook(req, res)
);

export default router;
