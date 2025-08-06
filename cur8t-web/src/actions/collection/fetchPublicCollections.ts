'use server';

import { db } from '@/db';
import { CollectionsTable, UsersTable } from '@/schema';
import { Collection } from '@/types/types';
import { eq, desc } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import {
  checkRateLimit,
  getClientIdFromHeaders,
  rateLimiters,
} from '@/lib/ratelimit';

export type PaginationParams = {
  page: number;
  limit: number;
  sortBy: 'trending' | 'recent' | 'likes';
};

// Type for public collection that includes author info from the join
export interface PublicCollection extends Collection {
  author: string;
  authorUsername: string | null;
}

export async function fetchPublicCollections({
  page = 1,
  limit = 9,
  sortBy = 'trending',
}: PaginationParams) {
  // IP-based rate limiting for public endpoint
  const identifier = await getClientIdFromHeaders(); // no userId, uses IP
  const rateLimitResult = await checkRateLimit(
    rateLimiters.getPublicProfileLimiter, // Using public profile limiter for public endpoints
    identifier,
    'Too many requests to fetch public collections. Please try again later.'
  );
  if (!rateLimitResult.success) {
    const retryAfter = rateLimitResult.retryAfter ?? 60;
    return { error: rateLimitResult.error, retryAfter };
  }

  // Calculate offset
  const offset = (page - 1) * limit;

  // Get sort column based on sortBy parameter
  const getSortColumn = () => {
    switch (sortBy) {
      case 'recent':
        return CollectionsTable.updatedAt;
      case 'likes':
        return CollectionsTable.likes;
      case 'trending':
      default:
        return CollectionsTable.likes; // You might want to implement a more sophisticated trending algorithm
    }
  };

  // Get total count
  const totalCountResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(CollectionsTable)
    .where(eq(CollectionsTable.visibility, 'public'));

  const totalCount = totalCountResult[0].count;

  // Fetch paginated data
  const collections = await db
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
    .orderBy(desc(getSortColumn()))
    .limit(limit)
    .offset(offset);

  return {
    data: collections as PublicCollection[],
    pagination: {
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      limit,
    },
  };
}
