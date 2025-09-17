import { Request, Response, Router } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import * as ActivityLogController from './activity-log.controller';

const router = Router();

router.get('/', (req: Request, res: Response) =>
  ActivityLogController.getActivity(req as AuthenticatedRequest, res)
);

export default router;
