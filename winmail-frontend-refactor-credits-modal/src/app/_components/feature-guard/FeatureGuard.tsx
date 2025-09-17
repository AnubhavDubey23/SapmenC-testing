//import { useFeature } from '@/hooks/features/useFeature';
//import React from 'react';
//
//
//interface FeatureGuardProps {
//  featureId: string;
//  children: React.ReactNode;
//  fallback?: React.ReactNode;
//}
//
//export default function FeatureGuard({
//  featureId,
//  children,
//  fallback,
//}: FeatureGuardProps) {
//  const feature = useFeature(featureId);
//
//  if (!feature.isAvailable) {
//    return fallback ?? null;
//  }
//
//  return <>{children}</>;
//}
