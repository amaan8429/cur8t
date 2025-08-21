'use client';

import { useQuery } from '@tanstack/react-query';

export type UsageData = {
  collections: number;
  totalLinks: number;
  favorites: number;
  topCollections: number;
};

async function fetchUsageData(): Promise<UsageData> {
  const res = await fetch('/api/user/usage', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Failed to fetch usage data');
  return (await res.json()) as UsageData;
}

export function useUsage() {
  return useQuery({
    queryKey: ['user-usage'],
    queryFn: fetchUsageData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
