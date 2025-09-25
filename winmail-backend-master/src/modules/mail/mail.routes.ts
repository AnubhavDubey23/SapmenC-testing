import { Request, RequestHandler, Response, Router } from 'express';
import * as MailController from './mail.controller';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { checkCredits } from '../../middlewares/credits.middleware';

const router = Router();

/**
  Check credits before sending mails
**/
router.use(
  checkCredits as unknown as RequestHandler<
    {},
    any,
    any,
    any,
    AuthenticatedRequest
  >
);

router.post('/', (req: Request, res: Response) =>
  MailController.sendMarketingMail(req as AuthenticatedRequest, res)
);
router.post('/queue', (req: Request, res: Response) =>
  MailController.sendMailsInQueue(req as AuthenticatedRequest, res)
);

export default router;
