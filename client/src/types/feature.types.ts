import { TSubscriptionTier } from './tier.types';

export type TFeatureAccessType =
  | { type: 'limit'; limits: { [key in TSubscriptionTier]?: number } }
  | { type: 'tier'; minimumTier: TSubscriptionTier };

export type TFeature = {
  id: string;
  name: string;
  description: string;
  access: TFeatureAccessType;
};
