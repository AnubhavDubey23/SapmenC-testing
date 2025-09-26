//import { FEATURES } from '@/consts/features';
//import { TSubscriptionTier } from '@/types/tier.types';
//import { isTierSufficient } from '@/utils/tierUtils';
//import { useContext, useMemo } from 'react';
//
//
//interface IFeatureState {
//  isAvailable: boolean;
//  reason?: 'tier' | 'limit';
//  currentTier: TSubscriptionTier;
//  requiredTier?: TSubscriptionTier;
//  limit?: number;
//  usage?: number;
//  remainingUsage?: number;
//}
//
//export function useFeature(featureId: string): IFeatureState {
//  const { currentTier, usage } = useContext(SubscriptionContext);
//
//  return useMemo(() => {
//    const feature = FEATURES.find((f) => f.id === featureId);
//
//    if (!feature) {
//      return {
//        isAvailable: false,
//        currentTier,
//      };
//    }
//
//    if (feature.access.type === 'tier') {
//      const isAvailable = isTierSufficient(
//        currentTier,
//        feature.access.minimumTier,
//      );
//      return {
//        isAvailable,
//        reason: 'tier',
//        currentTier,
//        requiredTier: feature.access.minimumTier,
//      };
//    }
//
//    if (feature.access.type === 'limit') {
//      const limit = feature.access.limits[currentTier] ?? 0;
//      const currentUsage = usage[featureId] ?? 0;
//      const remainingUsage = Math.max(0, limit - currentUsage);
//
//      return {
//        isAvailable: limit > 0,
//        reason: 'limit',
//        currentTier,
//        limit,
//        usage: currentUsage,
//        remainingUsage,
//      };
//    }
//  }, [featureId, currentTier, usage]);
//}
