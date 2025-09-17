import { Response } from 'express';
import  TemplateService from './template.service';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

interface ITemplateController {
  createTemplate(req: AuthenticatedRequest, res: Response): Promise<void>;
  getAllTemplates(req: AuthenticatedRequest, res: Response): Promise<any>;
  getTemplateById(req: AuthenticatedRequest, res: Response): Promise<any>;
  updateTemplate(req: AuthenticatedRequest, res: Response): Promise<any>;
  deleteTemplate(req: AuthenticatedRequest, res: Response):Promise<any>;
}

class TemplateController implements ITemplateController {

  private static instance: TemplateController;

  static getInstance(): TemplateController{
    if (!TemplateController.instance) {
      TemplateController.instance = new TemplateController();
      Object.freeze(TemplateController.instance)
    }
    return TemplateController.instance;
  }


  async createTemplate(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.user;
      const template = await TemplateService.createTemplate(req.body, id);
      res.status(201).json({
        status: true,
        message: 'Template created',
        data: template,
      });
    } catch (err) {
      res.status(400).json(err);
    }
  };

  async getAllTemplates(req: AuthenticatedRequest, res: Response): Promise<any> {
    try {
      const { id } = req.user;
      const templates = await TemplateService.getAllTemplates(id);
      res.status(200).json({
        status: true,
        message: 'All templates fetched successfully!',
        data: templates,
      });
    } catch (err) {
      res.status(400).json(err);
    }
  };

 async getTemplateById(req: AuthenticatedRequest, res: Response): Promise<any> {
    try {
      const { id } = req.user;
      const template = await TemplateService.getTemplateById(req.params.id, id);
      res.status(200).json({
        status: true,
        message: 'Template fetched successfully!',
        data: template,
      });
    } catch (err: any) {
      res.status(400).json({
        status: false,
        message: err.message,
        data: null,
      });
    }
  };

  async updateTemplate(req: AuthenticatedRequest, res: Response): Promise<any> {
    try {
      const template = await TemplateService.updateTemplate(
        req.params.id,
        req.body,
        req.user.id
      );
      res.status(200).json({
        status: true,
        message: 'Template updated successfully!',
        data: template,
      });
    } catch (err: any) {
      res.status(500).json({
        status: false,
        message: err.message,
        data: null,
      });
    }
  };

  async deleteTemplate(req: AuthenticatedRequest, res: Response): Promise<any> {
    try {
      const template = await TemplateService.deleteTemplate(
        req.params.id,
        req.user.id
      );
      res.status(204).json(template);
    } catch (err: any) {
      res.status(500).json({
        status: false,
        message: err.message,
        data: null,
      });
    }
  };
}

export default TemplateController.getInstance();
