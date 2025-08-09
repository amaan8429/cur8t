'use client';

import { ReactNode } from 'react';
import { useSubscriptionStatus } from '@/hooks/useSubscription';

type Props = {
  requirePlan?: 'free' | 'pro' | 'business';
  fallback?: ReactNode;
  children: ReactNode;
};

function planMeets(requirePlan: Props['requirePlan'], planSlug: string) {
  if (!requirePlan) return true;
  if (requirePlan === 'free') return true;
  if (requirePlan === 'pro')
    return planSlug.startsWith('pro') || planSlug.startsWith('business');
  if (requirePlan === 'business') return planSlug.startsWith('business');
  return false;
}

export function FeatureGate({ requirePlan, fallback = null, children }: Props) {
  const { data, isLoading, isError } = useSubscriptionStatus();

  if (isLoading || isError || !data) return <>{fallback}</>;

  const allowed = planMeets(requirePlan, data.planSlug);
  return <>{allowed ? children : fallback}</>;
}
