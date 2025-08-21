'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useCheckout } from '@/hooks/useCheckout';
import { useSubscriptionStatus } from '@/hooks/useSubscription';
import { useUsage } from '@/hooks/useUsage';
import {
  PiLightning,
  PiShield,
  PiStar,
  PiCrown,
  PiArrowRight,
  PiCheck,
  PiX,
} from 'react-icons/pi';
import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import { getPaidPlans, formatPrice } from '@/lib/plans';
import { useSearchParams } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ManageSubscription() {
  const { startCheckout, loading } = useCheckout();
  const {
    data: subscription,
    isLoading: subscriptionLoading,
    refetch,
  } = useSubscriptionStatus();
  const { data: usage, isLoading: usageLoading } = useUsage();
  const searchParams = useSearchParams();
  const [showBillingMessage, setShowBillingMessage] = useState(false);
  const [billingMessage, setBillingMessage] = useState({
    type: 'default' as 'default' | 'destructive',
    message: '',
  });

  // Handle billing success/canceled messages
  useEffect(() => {
    const billing = searchParams.get('billing');
    if (billing === 'success') {
      setBillingMessage({
        type: 'default',
        message:
          'Payment completed successfully! Your subscription is now active.',
      });
      setShowBillingMessage(true);
      // Refetch subscription data to show updated status
      refetch();
      // Clear the URL parameter
      window.history.replaceState({}, '', '/settings?tab=subscription');
    } else if (billing === 'canceled') {
      setBillingMessage({
        type: 'destructive',
        message: 'Payment was canceled. Your subscription was not activated.',
      });
      setShowBillingMessage(true);
      // Clear the URL parameter
      window.history.replaceState({}, '', '/settings?tab=subscription');
    }
  }, [searchParams, refetch]);

  // Auto-hide billing message after 5 seconds
  useEffect(() => {
    if (showBillingMessage) {
      const timer = setTimeout(() => {
        setShowBillingMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showBillingMessage]);

  if (subscriptionLoading || usageLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
        <div className="h-10 w-32 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  const currentPlan = subscription?.planName || 'Free';
  const limits = subscription?.limits;
  const isFree = currentPlan === 'Free';
  const isPro = currentPlan.includes('Pro');
  const isBusiness = currentPlan.includes('Business');

  const getPlanIcon = () => {
    if (isBusiness) return PiShield;
    if (isPro) return PiLightning;
    return PiStar;
  };

  const getPlanColor = () => {
    if (isBusiness) return 'text-purple-600';
    if (isPro) return 'text-blue-600';
    return 'text-gray-600';
  };

  const getPlanBadgeVariant = () => {
    if (isBusiness) return 'default';
    if (isPro) return 'secondary';
    return 'outline';
  };

  // Transform paid plans into upgrade options with UI-specific properties
  const upgradeOptions = getPaidPlans()
    .map((plan) => {
      // Type guard to ensure priceCents exists and is a number
      if (typeof plan.priceCents !== 'number') {
        return null;
      }

      const priceInfo = formatPrice(plan.priceCents, plan.interval);
      const isPopular = plan.slug === 'pro-yearly'; // Pro yearly is most popular

      // Type guard to ensure limits exist and are properly typed
      if (typeof plan.limits !== 'object' || plan.limits === null) {
        return null;
      }

      const limits = plan.limits as {
        collections: number;
        totalLinks: number;
        favorites: number;
        topCollections: number;
      };

      return {
        ...plan,
        price:
          typeof priceInfo === 'string' ? priceInfo : `$${priceInfo.amount}`,
        period: plan.interval,
        popular: isPopular,
        savings: plan.interval === 'year' ? 'Save 17%' : undefined,
        features: [
          `${limits.collections} collections`,
          `${limits.totalLinks.toLocaleString()} total links`,
          `${limits.favorites} favorites`,
          `${limits.topCollections} pinned collections`,
        ],
      };
    })
    .filter(Boolean); // Remove any null entries

  // Get all plans for comparison
  const allPlans = getPaidPlans().filter((plan) => plan.slug !== 'free');

  return (
    <div className="space-y-6">
      {/* Current Plan Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Subscription Management</h2>

        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'p-2 rounded-full bg-primary/10',
                    getPlanColor()
                  )}
                >
                  {React.createElement(getPlanIcon(), { className: 'h-5 w-5' })}
                </div>
                <div>
                  <CardTitle className="text-xl">
                    Current Plan: {currentPlan}
                  </CardTitle>
                  <CardDescription>
                    {isFree
                      ? 'You are currently on the free plan with basic features'
                      : `Active subscription with enhanced features and higher limits`}
                  </CardDescription>
                </div>
              </div>
              <Badge variant={getPlanBadgeVariant()} className="text-sm">
                {isFree ? 'Free Tier' : 'Active'}
              </Badge>
            </div>
          </CardHeader>

          {limits && usage && (
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {usage.collections}/{limits.collections}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Collections
                  </div>
                  <Progress
                    value={(usage.collections / limits.collections) * 100}
                    className="mt-2 h-2"
                  />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {usage.totalLinks.toLocaleString()}/
                    {limits.totalLinks.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Links
                  </div>
                  <Progress
                    value={(usage.totalLinks / limits.totalLinks) * 100}
                    className="mt-2 h-2"
                  />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {usage.favorites}/{limits.favorites}
                  </div>
                  <div className="text-sm text-muted-foreground">Favorites</div>
                  <Progress
                    value={(usage.favorites / limits.favorites) * 100}
                    className="mt-2 h-2"
                  />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {usage.topCollections}/{limits.topCollections}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Pinned Collections
                  </div>
                  <Progress
                    value={(usage.topCollections / limits.topCollections) * 100}
                    className="mt-2 h-2"
                  />
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Billing Status Messages */}
      {showBillingMessage && (
        <Alert variant={billingMessage.type}>
          <AlertDescription>{billingMessage.message}</AlertDescription>
        </Alert>
      )}

      {/* Upgrade Options */}
      {isFree && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Upgrade Your Plan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upgradeOptions.map((plan) => {
              if (!plan) return null;

              return (
                <Card
                  key={plan.slug}
                  className={cn(
                    'relative transition-all hover:shadow-md',
                    plan.popular && 'ring-2 ring-primary/50'
                  )}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                      <PiCrown className="mr-1 h-3 w-3" />
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader className={cn('pb-3', plan.popular && 'pt-6')}>
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">
                        /{plan.period}
                      </span>
                      {plan.savings && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {plan.savings}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <ul className="space-y-2">
                      {plan.features.map((feature: string, index: number) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <PiCheck className="h-4 w-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardContent className="pt-0">
                    <Button
                      className="w-full"
                      onClick={() => startCheckout(plan.slug)}
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : 'Upgrade Now'}
                      <PiArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Billing Management */}
      {!isFree && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Billing Management</h3>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Manage Your Subscription
              </CardTitle>
              <CardDescription>
                Update payment methods, view invoices, or cancel your
                subscription
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={async () => {
                  try {
                    const res = await fetch('/api/billing/portal');
                    const { url } = await res.json();
                    if (url) window.location.href = url;
                  } catch (error) {
                    console.error('Failed to open billing portal:', error);
                  }
                }}
              >
                <PiShield className="mr-2 h-4 w-4" />
                Open Billing Portal
              </Button>
              <p className="text-xs text-muted-foreground">
                Access your billing portal to manage subscriptions, view
                invoices, and update payment methods.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Plan Comparison */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Plan Comparison</h3>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Feature</th>
                    <th className="text-center p-4 font-medium">Free</th>
                    <th className="text-center p-4 font-medium">Pro</th>
                    <th className="text-center p-4 font-medium">Business</th>
                    <th className="text-center p-4 font-medium">Your Usage</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4">Collections</td>
                    <td className="text-center p-4">3</td>
                    <td className="text-center p-4">10</td>
                    <td className="text-center p-4">25</td>
                    <td className="text-center p-4">
                      {usage ? (
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-medium">
                            {usage.collections}
                          </span>
                          <Progress
                            value={
                              (usage.collections / (limits?.collections || 3)) *
                              100
                            }
                            className="w-16 h-2"
                          />
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">Links per Collection</td>
                    <td className="text-center p-4">50</td>
                    <td className="text-center p-4">100</td>
                    <td className="text-center p-4">200</td>
                    <td className="text-center p-4">
                      <span className="text-muted-foreground">-</span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">Total Links</td>
                    <td className="text-center p-4">150</td>
                    <td className="text-center p-4">1,000</td>
                    <td className="text-center p-4">5,000</td>
                    <td className="text-center p-4">
                      {usage ? (
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-medium">
                            {usage.totalLinks.toLocaleString()}
                          </span>
                          <Progress
                            value={
                              (usage.totalLinks / (limits?.totalLinks || 150)) *
                              100
                            }
                            className="w-16 h-2"
                          />
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">Favorites</td>
                    <td className="text-center p-4">5</td>
                    <td className="text-center p-4">10</td>
                    <td className="text-center p-4">20</td>
                    <td className="text-center p-4">
                      {usage ? (
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-medium">{usage.favorites}</span>
                          <Progress
                            value={
                              (usage.favorites / (limits?.favorites || 5)) * 100
                            }
                            className="w-16 h-2"
                          />
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4">Pinned Collections</td>
                    <td className="text-center p-4">3</td>
                    <td className="text-center p-4">5</td>
                    <td className="text-center p-4">10</td>
                    <td className="text-center p-4">
                      {usage ? (
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-medium">
                            {usage.topCollections}
                          </span>
                          <Progress
                            value={
                              (usage.topCollections /
                                (limits?.topCollections || 3)) *
                              100
                            }
                            className="w-16 h-2"
                          />
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Support */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Need Help?</h3>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-3">
              Have questions about your subscription or need help upgrading?
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Contact Support
              </Button>
              <Button variant="outline" size="sm">
                View Documentation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
