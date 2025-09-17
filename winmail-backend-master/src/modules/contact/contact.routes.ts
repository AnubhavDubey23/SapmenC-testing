import express, { Request, Response } from 'express';
import {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
} from './contact.controllers';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

const router = express.Router();

router.post('/', (req: Request, res: Response) =>
  createContact(req as AuthenticatedRequest, res)
);
router.get('/:segmentId', (req: Request, res: Response) =>
  getAllContacts(req as AuthenticatedRequest, res)
);
router.get('/:id', (req: Request, res: Response) =>
  getContactById(req as AuthenticatedRequest, res)
);
router.patch('/:id', (req: Request, res: Response) =>
  updateContact(req as AuthenticatedRequest, res)
);
router.delete('/:id', (req: Request, res: Response) =>
  deleteContact(req as AuthenticatedRequest, res)
);

export default router;
