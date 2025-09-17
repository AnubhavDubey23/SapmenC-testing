import { Request, Response, Router } from 'express';
import PlanController from './plan.controllers';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', (req: Request, res: Response) =>
  PlanController.getAllPlans(req as AuthenticatedRequest, res)
);

export default router;
