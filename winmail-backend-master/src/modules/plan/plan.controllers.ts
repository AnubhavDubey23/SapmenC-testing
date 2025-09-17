import { Response } from 'express';
import PlanService from './plan.service';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

interface IPlanController {
  getAllPlans(req: AuthenticatedRequest, res: Response):Promise<Response>;
}

class PlanController implements IPlanController {
  private static instance: PlanController;

  static getInstance(): PlanController {
    if (!PlanController.instance) {
      PlanController.instance = new PlanController();
      Object.freeze(PlanController.instance);
    }
    return PlanController.instance;
  }

  async getAllPlans(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const plan_type = req.query.plan_type as 'prod' | 'test';
      if (!plan_type) {
        return res.status(400).json({
          status: false,
          message: 'plan_type is required',
        });
      }
      const plans = await PlanService.getAllPlans(plan_type);
      return res.status(200).json({
        status: true,
        message: 'Plans fetched successfully',
        data: plans,
      });
    } catch (err: any) {
      return res.status(400).json({
        status: false,
        message: 'Error while fetching plan details',
        data: err,
      });
    }
  };
}

export default PlanController.getInstance();