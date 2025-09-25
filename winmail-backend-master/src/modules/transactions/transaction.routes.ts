import { Request, Response, Router } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { TransactionController } from './transaction.controller';

const router = Router();

router.get('/', (req: Request, res: Response) =>
  TransactionController.getTransactions(req as AuthenticatedRequest, res)
);

export default router;
