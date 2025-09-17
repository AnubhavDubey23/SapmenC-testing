import express, { NextFunction, Request, Response } from 'express';
const router = express.Router();
import TemplateController from './template.controller';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { createTemplateMiddleware } from '../../middlewares/features.middleware';

router.post(
  '/',
  (req: Request, res: Response, next: NextFunction) =>
    createTemplateMiddleware(req as AuthenticatedRequest, res, next),
  (req: Request, res: Response) =>
    TemplateController.createTemplate(req as AuthenticatedRequest, res)
);
router.get('/', (req: Request, res: Response) =>
  TemplateController.getAllTemplates(req as AuthenticatedRequest, res)
);
router.get('/:id', (req: Request, res: Response) =>
  TemplateController.getTemplateById(req as AuthenticatedRequest, res)
);
router.patch('/:id', (req: Request, res: Response) =>
  TemplateController.updateTemplate(req as AuthenticatedRequest, res)
);
router.delete('/:id', (req: Request, res: Response) =>
  TemplateController.deleteTemplate(req as AuthenticatedRequest, res)
);

export default router;
