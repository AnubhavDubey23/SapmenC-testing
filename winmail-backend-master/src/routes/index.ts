import { Router, RequestHandler, Request, Response } from 'express';
import {
  AuthenticatedRequest,
  validateToken,
} from '../middlewares/auth.middleware';

import userRoutes from '../modules/user/user.routes';
import authRoutes from '../modules/auth/auth.routes';
import permissionRoutes from '../modules/permission/permission.routes';
import roleRoutes from '../modules/role/role.routes';
import segmentRoutes from '../modules/segment/segment.routes';
import templateRoutes from '../modules/template/template.routes';
import swaggerRoutes from '../modules/swagger/swagger.routes';
import mailRoutes from '../modules/mail/mail.routes';
import contactRoutes from '../modules/contact/contact.routes';
import paymentRoutes from '../modules/payment/payment.routes';
import planRoutes from '../modules/plan/plan.routes';
import paymentLogRoutes from '../modules/payment-log/payment-log.routes';
import activityLogRoutes from '../modules/activity-log/activity-log.routes';
import transactionRoutes from '../modules/transactions/transaction.routes';
import webhookRoutes from '../modules/webhooks/webhook.route';
import { checkPlan } from '../middlewares/features.middleware';
import * as MailController from '../modules/mail/mail.controller';

const router = Router();

router.use('/docs', swaggerRoutes);
router.use('/auth', authRoutes);
router.get('/mails/tracking-pixel', (req: Request, res: Response) =>
  MailController.trackOpenStatus(req, res)
);
router.use('/webhooks', webhookRoutes);

router.use(
  validateToken as unknown as RequestHandler<
    {},
    any,
    any,
    any,
    AuthenticatedRequest
  >
);

router.use('/mails', mailRoutes);
router.use('/users', userRoutes);

router.use(
  checkPlan as unknown as RequestHandler<
    {},
    any,
    any,
    any,
    AuthenticatedRequest
  >
);

router.use('/segments', segmentRoutes);      
router.use('/templates', templateRoutes);
router.use('/permissions', permissionRoutes);
router.use('/roles', roleRoutes);
router.use('/contacts', contactRoutes);
router.use('/payments', paymentRoutes);
router.use('/plans', planRoutes);
router.use('/payment-log', paymentLogRoutes);
router.use('/activity-log', activityLogRoutes);
router.use('/transactions', transactionRoutes);

export default router;
