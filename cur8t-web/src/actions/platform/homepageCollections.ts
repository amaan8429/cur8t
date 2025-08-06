'use server';

import { db } from '@/db';
import { CollectionsTable, UsersTable } from '@/schema';
import { eq, desc, gte, and } from 'drizzle-orm';
import { Collection } from '@/types/types';
import {
  checkRateLimit,
  getClientIdFromHeaders,
  rateLimiters,
} from '@/lib/ratelimit';

// Type for homepage collection that includes author info from the join
export interface HomepageCollection extends Collection {
  author: string;
  authorUsername: string | null;
}

export async function getHomepageCollections() {
  // IP-based rate limiting for public platform endpoint
  const identifier = await getClientIdFromHeaders(); // no userId, uses IP
  const rateLimitResult = await checkRateLimit(
    rateLimiters.getPlatformStatsLimiter,
    identifier,
    'Too many requests to get homepage collections. Please try again later.'
  );
  if (!rateLimitResult.success) {
    const retryAfter = rateLimitResult.retryAfter ?? 60;
    return { error: rateLimitResult.error, retryAfter };
  }

  try {
    // Get trending collections (most liked public collections)
    const trendingCollections = await db
      .select({
        id: CollectionsTable.id,
        title: CollectionsTable.title,
        author: UsersTable.name,
        authorUsername: UsersTable.username,
        likes: CollectionsTable.likes,
        description: CollectionsTable.description,
        userId: CollectionsTable.userId,
        url: CollectionsTable.url,
        createdAt: CollectionsTable.createdAt,
        updatedAt: CollectionsTable.updatedAt,
        visibility: CollectionsTable.visibility,
        sharedEmails: CollectionsTable.sharedEmails,
        totalLinks: CollectionsTable.totalLinks,
      })
      .from(CollectionsTable)
      .leftJoin(UsersTable, eq(CollectionsTable.userId, UsersTable.id))
      .where(eq(CollectionsTable.visibility, 'public'))
      .orderBy(desc(CollectionsTable.likes))
      .limit(6);

    // Get recently updated collections
    const recentCollections = await db
      .select({
        id: CollectionsTable.id,
        title: CollectionsTable.title,
        author: UsersTable.name,
        authorUsername: UsersTable.username,
        likes: CollectionsTable.likes,
        description: CollectionsTable.description,
        userId: CollectionsTable.userId,
        url: CollectionsTable.url,
        createdAt: CollectionsTable.createdAt,
        updatedAt: CollectionsTable.updatedAt,
        visibility: CollectionsTable.visibility,
        sharedEmails: CollectionsTable.sharedEmails,
        totalLinks: CollectionsTable.totalLinks,
      })
      .from(CollectionsTable)
      .leftJoin(UsersTable, eq(CollectionsTable.userId, UsersTable.id))
      .where(eq(CollectionsTable.visibility, 'public'))
      .orderBy(desc(CollectionsTable.updatedAt))
      .limit(6);

    // Get collections created this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const newCollections = await db
      .select({
        id: CollectionsTable.id,
        title: CollectionsTable.title,
        author: UsersTable.name,
        authorUsername: UsersTable.username,
        likes: CollectionsTable.likes,
        description: CollectionsTable.description,
        userId: CollectionsTable.userId,
        url: CollectionsTable.url,
        createdAt: CollectionsTable.createdAt,
        updatedAt: CollectionsTable.updatedAt,
        visibility: CollectionsTable.visibility,
        sharedEmails: CollectionsTable.sharedEmails,
        totalLinks: CollectionsTable.totalLinks,
      })
      .from(CollectionsTable)
      .leftJoin(UsersTable, eq(CollectionsTable.userId, UsersTable.id))
      .where(
        and(
          eq(CollectionsTable.visibility, 'public'),
          gte(CollectionsTable.createdAt, oneWeekAgo)
        )
      )
      .orderBy(desc(CollectionsTable.createdAt))
      .limit(6);

    return {
      success: true,
      data: {
        trending: trendingCollections as HomepageCollection[],
        recent: recentCollections as HomepageCollection[],
        new: newCollections as HomepageCollection[],
      },
    };
  } catch (error) {
    console.error('Error fetching homepage collections:', error);
    return {
      error: 'Failed to fetch homepage collections',
    };
  }
}
