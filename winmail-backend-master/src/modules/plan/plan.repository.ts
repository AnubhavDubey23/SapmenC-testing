import {Plans}  from 'razorpay/dist/types/plans';
import razorpay from '../../config/payment.config';
import { PLAN_IDS } from '../../data/PLANS_DATA';

interface IPlanRepository {
  findAllPlans(): Promise<any>;
  findAllTestingPlans(): Promise<any>;
}

class PlanRepository implements IPlanRepository {
  private static instance: PlanRepository;

  static getInstance(): PlanRepository {
    if (!PlanRepository.instance) {
      PlanRepository.instance = new PlanRepository();
      Object.freeze(PlanRepository.instance);
    }
    return PlanRepository.instance;
  }
   async findAllPlans(): Promise<any> {
    try {
      const test_plan_id = PLAN_IDS.production.test;
      const starterplan_id = PLAN_IDS.production.starter;
      const pro_plan_id = PLAN_IDS.production.pro;
      const premium_plan_id = PLAN_IDS.production.premium;

      const planIds = [
        test_plan_id,
        starterplan_id,
        pro_plan_id,
        premium_plan_id,
      ]

      const plans_res = await Promise.all(
        planIds.map((id) => razorpay.plans.fetch(id))
      )

      return plans_res;
    } catch (err) {
      return err
    }
  };

  async findAllTestingPlans(): Promise<any> {
    try {
      const test_plan_id = PLAN_IDS.development.test;

      const test_plan = await razorpay.plans.fetch(test_plan_id);

      return [test_plan];
    } catch (err) {
      return err;
    }
  };
}

export default PlanRepository.getInstance();

