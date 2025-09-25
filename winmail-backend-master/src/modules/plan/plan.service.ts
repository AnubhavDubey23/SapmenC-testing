import PlanRepository from './plan.repository';
import { EPlanIds, PLAN_IDS } from '../../data/PLANS_DATA';
import { ESubscriptionStatus } from '../../data/SUBSCRIPTIONS_DATA';
import { logger } from '../../classes/Logger';
import UserService from '../user/user.service';
import { MAX_TIMESTAMP } from '../../consts/rate';
import { envConfig } from '../../config/environment-manager';


export type PlanType = 'prod' | 'test';

interface IPlanService {
  getAllPlans(plan_type: PlanType): Promise<any>;
  startFreePlan(userId: string): Promise<void>;
}

const env = envConfig.APP_ENV === 'production' ? 'production' : 'development';
const planIds = PLAN_IDS[env];

class PlanService implements IPlanService {

  private static instance: PlanService;

  static getInstance(): PlanService{
    if (!PlanService.instance) {
      PlanService.instance = new PlanService;
      Object.freeze(PlanService.instance);
    }
    return PlanService.instance;
  }

  async getAllPlans(plan_type: PlanType): Promise<any> {
    try {
      if (plan_type === 'prod') {
        const plans = await PlanRepository.findAllPlans();
        return plans;
      } else {
        const plans = await PlanRepository.findAllTestingPlans();
        return plans;
      }
    } catch (err: any) {
      logger.error(`Failed to get all plans: ${err.message}`, {
        origin: 'services/plan',
      });
      return err;
    }
  };

  async startFreePlan(userId: string): Promise<void> {
    try {
      // Finding the user based on the ID
      const user = await UserService.isUserExistById(userId);
      if (user) {
        user.subscription.id = EPlanIds.FREE;
        user.subscription.status = ESubscriptionStatus.ACTIVE;
        user.subscription.plan = planIds.free;
        user.subscription.startDate = new Date(Date.now());
        user.subscription.expiryDate = new Date(MAX_TIMESTAMP);
        user.nodemailer_config = {
          display_name: '',
        };
        await user.save();
      }
    } catch (err: any) {
      logger.error(
        `Failed to start free plan for user with id=${userId}: ${err.message}`,
        {
          origin: 'services/plan',
        }
      );
      return err;
    }
  };
}

export default PlanService.getInstance();

