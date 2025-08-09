import { db } from '@/db';
import { PlansTable, SubscriptionsTable } from '@/schema';
import { and, eq, inArray } from 'drizzle-orm';
import { redis } from '@/lib/ratelimit';

export type PlanLimits = {
  collections: number;
  linksPerCollection: number;
  totalLinks: number;
  favorites: number;
  topCollections: number;
};

export type SubscriptionSnapshot = {
  planId: string;
  planName: string;
  planSlug: string;
  interval: 'none' | 'month' | 'year';
  priceCents: number;
  limits: PlanLimits;
};

const ACTIVE_SUB_STATUSES = ['active', 'trialing'] as const;

function isValidLimits(limits: unknown): limits is PlanLimits {
  if (!limits || typeof limits !== 'object') return false;
  const l = limits as Record<string, unknown>;
  return [
    'collections',
    'linksPerCollection',
    'totalLinks',
    'favorites',
    'topCollections',
  ].every((k) => typeof l[k] === 'number');
}

export async function getSubscriptionSnapshot(
  userId: string
): Promise<SubscriptionSnapshot> {
  const cacheKey = `subsnap:${userId}`;

  try {
    const cached = await redis.get<string>(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached) as SubscriptionSnapshot;
      if (parsed && parsed.planId && parsed.limits) return parsed;
    }
  } catch {
    /* ignore cache errors */
  }

  // Find active subscription (if any)
  const subs = await db
    .select({
      productId: SubscriptionsTable.productId,
      variantId: SubscriptionsTable.variantId,
      status: SubscriptionsTable.status,
    })
    .from(SubscriptionsTable)
    .where(eq(SubscriptionsTable.userId, userId))
    .limit(1);

  let plan;

  if (subs.length && ACTIVE_SUB_STATUSES.includes(subs[0].status as any)) {
    const { productId, variantId } = subs[0];
    if (variantId) {
      const plans = await db
        .select()
        .from(PlansTable)
        .where(eq(PlansTable.variantId, variantId))
        .limit(1);
      plan = plans[0];
    } else if (productId) {
      const plans = await db
        .select()
        .from(PlansTable)
        .where(eq(PlansTable.productId, productId))
        .limit(1);
      plan = plans[0];
    }
  }

  if (!plan) {
    // Fallback to Free by slug
    const free = await db
      .select()
      .from(PlansTable)
      .where(eq(PlansTable.slug, 'free'))
      .limit(1);
    plan = free[0];
  }

  if (!plan || !isValidLimits(plan.limits)) {
    // Hard fallback to prevent runtime errors
    const fallback: SubscriptionSnapshot = {
      planId: 'free',
      planName: 'Free',
      planSlug: 'free',
      interval: 'none',
      priceCents: 0,
      limits: {
        collections: 5,
        linksPerCollection: 50,
        totalLinks: 250,
        favorites: 3,
        topCollections: 3,
      },
    };
    return fallback;
  }

  const snapshot: SubscriptionSnapshot = {
    planId: plan.id,
    planName: plan.name,
    planSlug: plan.slug,
    interval: plan.interval as SubscriptionSnapshot['interval'],
    priceCents: plan.priceCents,
    limits: plan.limits as PlanLimits,
  };

  try {
    await redis.set(cacheKey, JSON.stringify(snapshot), { ex: 300 });
  } catch {
    /* ignore cache errors */
  }

  return snapshot;
}
