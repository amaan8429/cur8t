'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { UsersTable, CollectionsTable, LinksTable } from '@/schema';
import { eq, and, desc, sql, inArray } from 'drizzle-orm';
import {
  checkRateLimit,
  getClientIdFromHeaders,
  rateLimiters,
} from '@/lib/ratelimit';

export interface DashboardStats {
  totalCollections: number;
  totalLinks: number;
  pinnedCollections: string[];
  recentCollections: Array<{
    id: string;
    title: string;
    totalLinks: number;
    createdAt: string;
  }>;
  githubConnected: boolean;
  apiKeysCount: number;
}

export async function getDashboardStatsAction(): Promise<DashboardStats | null> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return null;
    }

    const identifier = await getClientIdFromHeaders(userId);
    const rateLimitResult = await checkRateLimit(
      rateLimiters.getUserInfoLimiter,
      identifier,
      'Too many requests to get dashboard stats. Please try again later.'
    );
    if (!rateLimitResult.success) {
      console.warn(
        'Rate limit exceeded for dashboard stats:',
        rateLimitResult.error
      );
      return null; // Fail silently for dashboard stats
    }

    // Get user info
    const user = await db
      .select()
      .from(UsersTable)
      .where(eq(UsersTable.id, userId))
      .limit(1);

    if (!user[0]) {
      return null;
    }

    // Get total collections count
    const collectionsCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(CollectionsTable)
      .where(eq(CollectionsTable.userId, userId));

    // Get total links count
    const linksCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(LinksTable)
      .where(eq(LinksTable.userId, userId));

    // Get recent collections
    const recentCollections = await db
      .select({
        id: CollectionsTable.id,
        title: CollectionsTable.title,
        totalLinks: CollectionsTable.totalLinks,
        createdAt: CollectionsTable.createdAt,
      })
      .from(CollectionsTable)
      .where(eq(CollectionsTable.userId, userId))
      .orderBy(desc(CollectionsTable.createdAt))
      .limit(5);

    // Get pinned collections names
    const pinnedCollectionNames: string[] = [];
    if (
      user[0].pinnedCollections &&
      Array.isArray(user[0].pinnedCollections) &&
      user[0].pinnedCollections.length > 0
    ) {
      // Filter out any null/undefined values and ensure they're valid UUIDs
      const validPinnedIds = user[0].pinnedCollections.filter(
        (id) => id && typeof id === 'string' && id.trim() !== ''
      );

      if (validPinnedIds.length > 0) {
        try {
          const pinnedCollections = await db
            .select({ title: CollectionsTable.title })
            .from(CollectionsTable)
            .where(
              and(
                eq(CollectionsTable.userId, userId),
                inArray(CollectionsTable.id, validPinnedIds)
              )
            );

          pinnedCollectionNames.push(...pinnedCollections.map((c) => c.title));
        } catch (error) {
          console.error('Error fetching pinned collections:', error);
          // Continue without pinned collections if there's an error
        }
      }
    }

    return {
      totalCollections: collectionsCount[0]?.count || 0,
      totalLinks: linksCount[0]?.count || 0,
      pinnedCollections: pinnedCollectionNames,
      recentCollections: recentCollections.map((collection) => ({
        id: collection.id,
        title: collection.title,
        totalLinks: collection.totalLinks,
        createdAt: collection.createdAt.toISOString(),
      })),
      githubConnected: user[0].githubConnected,
      apiKeysCount: user[0].APIKeysCount,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return null;
  }
}
