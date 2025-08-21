import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import {
  CollectionsTable,
  LinksTable,
  FavoritesTable,
  UsersTable,
} from '@/schema';
import { eq, sql } from 'drizzle-orm';
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
      'Too many requests for usage data. Please try again later.'
    );
    if (!rateResult.success) {
      const retryAfter = rateResult.retryAfter ?? 60;
      return NextResponse.json(
        { error: rateResult.error, retryAfter },
        { status: 429, headers: { 'Retry-After': retryAfter.toString() } }
      );
    }

    // Get collections count
    const [{ value: collectionsCount } = { value: 0 }] = await db
      .select({ value: sql<number>`count(*)` })
      .from(CollectionsTable)
      .where(eq(CollectionsTable.userId, userId));

    // Get total links count
    const [{ value: totalLinksCount } = { value: 0 }] = await db
      .select({ value: sql<number>`count(*)` })
      .from(LinksTable)
      .where(eq(LinksTable.userId, userId));

    // Get favorites count
    const [{ value: favoritesCount } = { value: 0 }] = await db
      .select({ value: sql<number>`count(*)` })
      .from(FavoritesTable)
      .where(eq(FavoritesTable.userId, userId));

    // Get top collections count
    const user = await db
      .select({ topCollections: UsersTable.topCollections })
      .from(UsersTable)
      .where(eq(UsersTable.id, userId))
      .limit(1);

    const topCollectionsCount = user[0]?.topCollections?.length || 0;

    return NextResponse.json(
      {
        collections: collectionsCount || 0,
        totalLinks: totalLinksCount || 0,
        favorites: favoritesCount || 0,
        topCollections: topCollectionsCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error getting usage data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
