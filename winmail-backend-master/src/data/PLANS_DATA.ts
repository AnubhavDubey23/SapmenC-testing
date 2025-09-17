import { envConfig } from "../config/environment-manager";

// Free plan duration in days
export const FREE_PLAN_DURATION = 30;

export enum EPlanTypes {
  TRIAL = 'trial',
  FREE = 'free',
  PAID = 'paid',
}

export enum EPlanNames {
  FREE = 'free',
  STARTER = 'starter',
  PRO = 'pro',
  PREMIUM = 'premium',
}

export enum EPlanIds {
  FREE = 'plan_free',
  STARTER = 'plan_Onen7e85ChsIEf',
  PRO = 'plan_OneooTq4vScZ6M',
  PREMIUM = 'plan_premium',
}

export enum EPlanNamessegments {
  FREE = 'Free',
  STARTER = 'Starter',
  PRO = 'Pro',
  PREMIUM = 'Premium',
}

export enum EPlanPrices {
  FREE = 0,
  STARTER = 699,
  PRO = 2999,
  PREMIUM = 2999,
}

export interface IPlanDetails {
  name: EPlanNames;
  id: EPlanIds | string;
  price?: number;
  type: EPlanTypes;
  segment: EPlanNamessegments;
}

export const PLAN_IDS = {
  production: {
    test: 'plan_PA8gxuXS8RzNxx',
    free: 'plan_free',
    starter: 'plan_PvUnveHWOD0vom',
    pro: 'plan_RDEigy32DgCYg3',
    premium: 'plan_PpZyeK2mm6nx4I',
  },
  development: {
    test: 'plan_PvUnveHWOD0vom',
    free: 'plan_free',
    starter: 'plan_PvUnveHWOD0vom',
    pro: 'plan_RDEigy32DgCYg3',
    premium: 'plan_PvUnveHWOD0vom',
  },
} as const;

const createPlansData = (
  environment: 'production' | 'development'
): IPlanDetails[] => {
  const ids = PLAN_IDS[environment];

  return [
    {
      name: EPlanNames.FREE,
      id: ids.free,
      type: EPlanTypes.FREE,
      segment: EPlanNamessegments.FREE,
    },
    {
      name: EPlanNames.STARTER,
      id: ids.starter,
      price: EPlanPrices.STARTER,
      type: EPlanTypes.PAID,
      segment: EPlanNamessegments.STARTER,
    },
    {
      name: EPlanNames.PRO,
      id: ids.pro,
      price: EPlanPrices.PRO,
      type: EPlanTypes.PAID,
      segment: EPlanNamessegments.PRO,
    },
    {
      name: EPlanNames.PREMIUM,
      id: ids.premium,
      type: EPlanTypes.PAID,
      segment: EPlanNamessegments.PREMIUM,
    },
  ];
};

const env = envConfig.APP_ENV === 'production' ? 'production' : 'development';

export const PLANS_DATA = createPlansData(env);
