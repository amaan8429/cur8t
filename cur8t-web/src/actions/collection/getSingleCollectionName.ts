'use server';

import { db } from '@/db';
import { CollectionsTable } from '@/schema';
import { eq } from 'drizzle-orm';
import {
  checkRateLimit,
  getClientIdFromHeaders,
  rateLimiters,
} from '@/lib/ratelimit';

export async function getSingleCollectionNameAction(collectionId: string) {
  // IP-based rate limiting for public endpoint
  const identifier = await getClientIdFromHeaders(); // no userId, uses IP
  const rateLimitResult = await checkRateLimit(
    rateLimiters.getSingleCollectionLimiter,
    identifier,
    'Too many requests to get collection name. Please try again later.'
  );
  if (!rateLimitResult.success) {
    const retryAfter = rateLimitResult.retryAfter ?? 60;
    return { error: rateLimitResult.error, retryAfter };
  }

  if (!collectionId) {
    return { error: 'Collection ID is required' };
  }

  try {
    const collection = await db
      .select()
      .from(CollectionsTable)
      .where(eq(CollectionsTable.id, collectionId));

    if (!collection || collection.length === 0) {
      console.log('Collection not found for ID:', collectionId);
      return { error: 'Collection not found' };
    }

    console.log('Collection name:', collection[0].title);
    return { success: true, data: collection[0].title };
  } catch (error) {
    console.error('Error fetching collection name:', error);
    return { error: 'Failed to fetch collection name' };
  }
}
