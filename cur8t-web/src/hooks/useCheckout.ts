'use client';

import { useState, useCallback } from 'react';

async function createCheckout(planSlug: string): Promise<string> {
  const res = await fetch('/api/subscription/create-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planSlug }),
  });
  if (!res.ok) throw new Error('Failed to create checkout');
  const data = (await res.json()) as { url: string };
  if (!data?.url) throw new Error('Checkout URL missing');
  return data.url;
}

export function useCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = useCallback(async (planSlug: string) => {
    try {
      setError(null);
      setLoading(true);
      const url = await createCheckout(planSlug);
      window.location.href = url;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Checkout failed');
    } finally {
      setLoading(false);
    }
  }, []);

  return { startCheckout, loading, error } as const;
}
