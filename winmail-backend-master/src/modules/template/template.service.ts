import { ObjectId } from 'mongoose';
import  TemplateRepository from './template.repository';
import { logActivity } from '../activity-log/activity-log.service';
import {
  ActionType,
  ActivityStatus,
  ResourceType,
} from '../activity-log/activity-log.utils';
import { logger } from '../../classes/Logger';
import { ITemplate } from './template.model';
import UserService from '../user/user.service';

interface ITemplateService {
  createTemplate(template: any, userId: string | ObjectId): Promise<ITemplate>;
  getAllTemplates(userId: string | ObjectId): Promise<ITemplate[]>;
  getTemplateById(id: string, userId: string | ObjectId): Promise<ITemplate>;
  updateTemplate(
    id: string,
    updatedTemplate: any,
    userId: string | ObjectId
  ): Promise<ITemplate>;
  deleteTemplate(id: string, userId: string | ObjectId): Promise<ITemplate>;
}

class TemplateService implements ITemplateService {
  private static instance: TemplateService;

  static getInstance(): TemplateService{
    if (!TemplateService.instance) {
      TemplateService.instance = new TemplateService();
      Object.freeze(TemplateService.instance)
    }
    return TemplateService.instance;
  }
  
  async createTemplate(template: any, userId: string | ObjectId): Promise<ITemplate> {
    try {
      const user = await UserService.isUserExistById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      const newTemplate = await TemplateRepository.createTemplate(
        template,
        userId
      );

      await UserService.incrementTemplateCount(user.id as string);

      await logActivity({
        user: userId as ObjectId,
        actionType: ActionType.CREATE,
        resourceType: ResourceType.TEMPLATE,
        resourceId: newTemplate._id as ObjectId,
        status: ActivityStatus.SUCCESS,
      });

      logger.info(`Created template`, { userId, templateId: newTemplate._id });

      return newTemplate;
    } catch (err: any) {
      logger.error(`Failed to create template: ${err.message}`, {
        origin: 'services/template',
      });

      await logActivity({
        user: userId as ObjectId,
        actionType: ActionType.CREATE,
        resourceType: ResourceType.TEMPLATE,
        status: ActivityStatus.FAILURE,
      });

      return err;
    }
  };

 async getAllTemplates(userId: string | ObjectId): Promise<ITemplate[]> {
    try {
      const templates = await TemplateRepository.getAllTemplates(userId);

      logger.info(`Fetched all templates`, { userId });

      return templates;
    } catch (err: any) {
      logger.error(`${err.message}`, { origin: 'services/template' });
      return err;
    }
  };

  async getTemplateById(id: string, userId: string | ObjectId): Promise<ITemplate> {
    try {
      const template = await TemplateRepository.findTemplateById(id, userId);
      logger.info(`Fetched template`, { userId, templateId: template._id });

      return template;
    } catch (err: any) {
      logger.error(`Failed to get template with id-${id}: ${err.message}`, {
        origin: 'services/template',
      });

      await logActivity({
        user: userId as ObjectId,
        actionType: ActionType.VIEW,
        resourceType: ResourceType.TEMPLATE,
        status: ActivityStatus.FAILURE,
      });

      return err;
    }
  };

  async updateTemplate(id: string, updatedTemplate: any, userId: string | ObjectId): Promise<ITemplate> {
    try {
      const template = await TemplateRepository.updateTemplate(
        id,
        updatedTemplate,
        userId
      );

      await logActivity({
        user: userId as ObjectId,
        actionType: ActionType.UPDATE,
        resourceType: ResourceType.TEMPLATE,
        resourceId: template._id as ObjectId,
        status: ActivityStatus.SUCCESS,
      });

      logger.info(`Updated template`, { userId, templateId: template._id });

      return template;
    } catch (err: any) {
      logger.error(`Failed to update template with id-${id}: ${err.message}`, {
        origin: 'services/template',
      });

      await logActivity({
        user: userId as ObjectId,
        actionType: ActionType.UPDATE,
        resourceType: ResourceType.TEMPLATE,
        status: ActivityStatus.FAILURE,
      });

      return err;
    }
  };

  async deleteTemplate(id: string, userId: string | ObjectId): Promise<ITemplate> {
    try {
      const user = await UserService.isUserExistById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      const template = await TemplateRepository.deleteTemplate(id);

      await UserService.decrementTemplateCount(user.id as string);

      await logActivity({
        user: userId as ObjectId,
        actionType: ActionType.DELETE,
        resourceType: ResourceType.TEMPLATE,
        resourceId: template._id as ObjectId,
        status: ActivityStatus.SUCCESS,
      });

      logger.info(`Deleted template`, { userId, templateId: template._id });

      return template;
    } catch (err: any) {
      logger.error(`Failed to delete template with id-${id}: ${err.message}`, {
        origin: 'services/template',
      });

      await logActivity({
        user: userId as ObjectId,
        actionType: ActionType.DELETE,
        resourceType: ResourceType.TEMPLATE,
        status: ActivityStatus.FAILURE,
      });

      return err;
    }
  };
}

export default TemplateService.getInstance();