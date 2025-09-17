import { TIER_HIERARCHY } from '@/consts/tier';
import { TSubscriptionTier } from '@/types/tier.types';

export function isTierSufficient(
  currentTier: TSubscriptionTier,
  requiredTier: TSubscriptionTier
): boolean {
  const currentIndex = TIER_HIERARCHY.indexOf(currentTier);
  const requiredIndex = TIER_HIERARCHY.indexOf(requiredTier);
  return currentIndex >= requiredIndex;
}
