import { Document, ObjectId } from 'mongoose';
import TemplateModel, { ITemplate } from './template.model';
import { getEmailLogsByTemplateId } from '../email-logs/email-logs.repository';
import userModel from '../user/user.model';

interface ITemplateRepository {
  createTemplate(template: any, userId: string | ObjectId): Promise<ITemplate>;
  getAllTemplates(userId: string | ObjectId): Promise<ITemplate[]>;
  findTemplateById(
    id: string | ObjectId,
    userId: string | ObjectId
  ): Promise<ITemplate>;
  updateTemplate(
    id: string,
    body: any,
    userId: string | ObjectId
  ): Promise<ITemplate>;
  deleteTemplate(id: string): Promise<ITemplate>;
}

class TemplateRepository implements ITemplateRepository {

  private static instance: TemplateRepository;

  static getInstance(): TemplateRepository{
    if (!TemplateRepository.instance) {
      TemplateRepository.instance = new TemplateRepository();
      Object.freeze(TemplateRepository.instance)
    }
    return TemplateRepository.instance;
  }

 async createTemplate(template: any, userId: string | ObjectId): Promise<ITemplate> {
    try {
      const newTemplate = await TemplateModel.create({
        ...template,
        created_by: userId,
      });
      return newTemplate;
    } catch (err: any) {
      return err;
    }
  };

  async getAllTemplates(userId: string | ObjectId): Promise<ITemplate[]> {
    try {
      const templates: (Document<unknown, {}, ITemplate> &
        ITemplate &
        Required<{
          _id: unknown;
        }>)[] = await TemplateModel.find({
        created_by: userId,
      })
        .populate('segments_used')
        .sort({ createdAt: -1 });

      return templates;
    } catch (err) {
      console.log(err);
      throw new Error('Failed to retrieve templates');
    }
  };

  async findTemplateById(id: string | ObjectId, userId: string | ObjectId): Promise<ITemplate> {
    try {
      const template = await TemplateModel.findById(id)
        .populate('created_by', 'name email')
        .populate('updated_by', 'name email');

      if (!template) {
        throw new Error('Template not found');
      }

      const createdBy = template?.created_by?._id.toString();
      const isAuthorized = createdBy === userId.toString();
      if (!isAuthorized) {
        throw new Error('Not authorized to view this template');
      }
      
      return template;
    } catch (err: any) {
      throw new Error(err);
    }
  };

 async updateTemplate(id: string, body: any, userId: string | ObjectId): Promise<ITemplate> {
    try {
      const template = await TemplateModel.findByIdAndUpdate(
        id,
        {
          ...body,
          updated_by: userId,
        },
        {
          new: true,
        }
      );

      if (!template) {
        throw new Error('Template not found');
      }

      return template;
    } catch (err: any) {
      return err;
    }
  };

 async deleteTemplate(id: string): Promise<ITemplate> {
    try {
      const template = await TemplateModel.findById(id);

      if (!template) {
        throw new Error('Template not found');
      }

      template.is_active = false;
      await template.save();
      return template;
    } catch (err: any) {
      return err;
    }
  };
}

export default TemplateRepository.getInstance();
