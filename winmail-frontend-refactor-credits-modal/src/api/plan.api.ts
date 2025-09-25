import { API_URL } from '.';

const PLAN_API_ENPOINTS = {
  GET_ALL_PLANS: (plan_type: 'prod' | 'test') =>
    `${API_URL}/plans?plan_type=${plan_type}`,
} as const;

export default PLAN_API_ENPOINTS;
