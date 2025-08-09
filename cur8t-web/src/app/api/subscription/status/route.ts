import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSubscriptionSnapshot } from '@/lib/subscription';
import { checkRateLimit, getClientId, rateLimiters } from '@/lib/ratelimit';

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limit using an existing conservative limiter
    const identifier = getClientId(req, userId);
    const rateResult = await checkRateLimit(
      rateLimiters.getUserInfoLimiter,
      identifier,
      'Too many requests for subscription status. Please try again later.'
    );
    if (!rateResult.success) {
      const retryAfter = rateResult.retryAfter ?? 60;
      return NextResponse.json(
        { error: rateResult.error, retryAfter },
        { status: 429, headers: { 'Retry-After': retryAfter.toString() } }
      );
    }

    const snapshot = await getSubscriptionSnapshot(userId);

    return NextResponse.json(
      {
        planId: snapshot.planId,
        planSlug: snapshot.planSlug,
        planName: snapshot.planName,
        interval: snapshot.interval,
        priceCents: snapshot.priceCents,
        limits: snapshot.limits,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error getting subscription status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
