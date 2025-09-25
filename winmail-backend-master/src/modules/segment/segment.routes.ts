import express, { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import SegmentController from './segment.controllers';

const router = express.Router();

router.post('/', (req: Request, res: Response) =>
  SegmentController.createSegment(req as AuthenticatedRequest, res)
);
router.get('/', (req: Request, res: Response) =>
  SegmentController.getAllSegments(req as AuthenticatedRequest, res)
);
router.get('/:id', (req: Request, res: Response) =>
  SegmentController.getSegmentById(req as AuthenticatedRequest, res)
);
router.patch('/:id', (req: Request, res: Response) =>
  SegmentController.updateSegment(req as AuthenticatedRequest, res)
);
router.delete('/:id', (req: Request, res: Response) =>
  SegmentController.deleteSegment(req as AuthenticatedRequest, res)
);

export default router;
