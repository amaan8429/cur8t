//do coming soon on this page

import { Button } from '@/components/ui/button';
import { useCheckout } from '@/hooks/useCheckout';
import { useSubscriptionStatus } from '@/hooks/useSubscription';

export default function ManageSubscription() {
  const { startCheckout, loading } = useCheckout();
  const { data } = useSubscriptionStatus();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Subscription</h2>
      <p className="text-sm text-muted-foreground">
        Current plan:{' '}
        <span className="font-medium">{data?.planName ?? 'Free'}</span>
      </p>
      <div className="flex gap-2">
        <Button onClick={() => startCheckout('pro-monthly')} disabled={loading}>
          {loading ? 'Processing…' : 'Upgrade to Pro'}
        </Button>
        <Button
          variant="outline"
          onClick={async () => {
            try {
              const res = await fetch('/api/billing/portal');
              const { url } = await res.json();
              if (url) window.location.href = url;
            } catch {}
          }}
        >
          Open Billing Portal
        </Button>
      </div>
    </div>
  );
}
