'use client';

import { useQuery } from '@tanstack/react-query';

export type SubscriptionStatus = {
  planId: string;
  planSlug: string;
  planName: string;
  interval: 'none' | 'month' | 'year';
  priceCents: number;
  limits: {
    collections: number;
    linksPerCollection: number;
    totalLinks: number;
    favorites: number;
    topCollections: number;
  };
};

async function fetchSubscriptionStatus(): Promise<SubscriptionStatus> {
  const res = await fetch('/api/subscription/status', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch subscription status');
  return (await res.json()) as SubscriptionStatus;
}

export function useSubscriptionStatus() {
  return useQuery({
    queryKey: ['subscription-status'],
    queryFn: fetchSubscriptionStatus,
    staleTime: 1000 * 60 * 2,
  });
}
