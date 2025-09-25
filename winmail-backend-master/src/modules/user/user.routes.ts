import express, { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import UserController from './user.controllers';

const router = express.Router();

router.get('/', (req: Request, res: Response) =>
  UserController.fetchAllUsers(req as AuthenticatedRequest, res)
);
router.get('/:id', (req: Request, res: Response) =>
  UserController.fetchUserById(req as AuthenticatedRequest, res)
);
router.patch('/:id', (req: Request, res: Response) =>
  UserController.updateUser(req as AuthenticatedRequest, res)
);
router.get('/plan/details', (req: Request, res: Response) =>
  UserController.getUserPlanDetails(req as AuthenticatedRequest, res)
);
router.delete('/:id', (req: Request, res: Response) =>
  UserController.deleteProfile(req as AuthenticatedRequest, res)
);

export default router;
