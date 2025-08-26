'use server';

import { db } from '@/db';
import { CollectionsTable, UsersTable } from '@/schema';
import { sql } from 'drizzle-orm';
import {
  checkRateLimit,
  getClientIdFromHeaders,
  rateLimiters,
} from '@/lib/ratelimit';

export interface LandingPageStats {
  totalUsers: number;
  totalCollections: number;
  totalLinks: number;
}

export async function getLandingPageStats(): Promise<
  | { success: true; data: LandingPageStats }
  | { error: string; retryAfter?: number }
> {
  // IP-based rate limiting for public landing page endpoint
  const identifier = await getClientIdFromHeaders(); // no userId, uses IP
  const rateLimitResult = await checkRateLimit(
    rateLimiters.getPlatformStatsLimiter,
    identifier,
    'Too many requests for landing page stats. Please try again later.'
  );

  if (!rateLimitResult.success) {
    const retryAfter = rateLimitResult.retryAfter ?? 60;
    return { error: rateLimitResult.error ?? 'Unknown error', retryAfter };
  }

  try {
    // Get total users count - only count, no user data
    const totalUsersResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(UsersTable);

    // Get total collections count - only count, no collection data
    const totalCollectionsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(CollectionsTable);

    // Get total links count - only sum, no link data
    const totalLinksResult = await db
      .select({
        sum: sql<number>`COALESCE(sum(${CollectionsTable.totalLinks}), 0)`,
      })
      .from(CollectionsTable);

    return {
      success: true,
      data: {
        totalUsers: Number(totalUsersResult[0]?.count) || 26,
        totalCollections: Number(totalCollectionsResult[0]?.count) || 43,
        totalLinks: Number(totalLinksResult[0]?.sum) || 212,
      },
    };
  } catch (error) {
    console.error('Error fetching landing page stats:', error);
    return {
      error: 'Failed to fetch landing page statistics',
    };
  }
}
