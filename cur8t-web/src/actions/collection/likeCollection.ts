'use server';

import { db } from '@/db';
import { CollectionsTable, CollectionLikesTable } from '@/schema';
import { auth } from '@clerk/nextjs/server';
import { eq, and, sql } from 'drizzle-orm';
import {
  checkRateLimit,
  getClientIdFromHeaders,
  rateLimiters,
} from '@/lib/ratelimit';

export async function likeCollectionAction(collectionId: string) {
  const { userId } = await auth();

  if (!userId) {
    return { error: 'Authentication required' };
  }

  const identifier = await getClientIdFromHeaders(userId);
  const rateLimitResult = await checkRateLimit(
    rateLimiters.likeCollectionLimiter,
    identifier,
    'Too many requests to like collection. Please try again later.'
  );
  if (!rateLimitResult.success) {
    const retryAfter = rateLimitResult.retryAfter ?? 60;
    return { error: rateLimitResult.error, retryAfter };
  }

  if (!collectionId) {
    return { error: 'Collection ID is required' };
  }

  try {
    // Check if already liked
    const existingLike = await db
      .select()
      .from(CollectionLikesTable)
      .where(
        and(
          eq(CollectionLikesTable.userId, userId),
          eq(CollectionLikesTable.collectionId, collectionId)
        )
      );

    if (existingLike.length > 0) {
      return { error: 'Collection already liked' };
    }

    // Add like
    await db.insert(CollectionLikesTable).values({
      userId,
      collectionId,
    });

    // Increment likes count
    await db
      .update(CollectionsTable)
      .set({
        likes: sql`${CollectionsTable.likes} + 1`,
      })
      .where(eq(CollectionsTable.id, collectionId));

    return { success: true, message: 'Collection liked successfully' };
  } catch (error) {
    console.error('Error liking collection:', error);
    return { error: 'Failed to like collection' };
  }
}

export async function unlikeCollectionAction(collectionId: string) {
  const { userId } = await auth();

  if (!userId) {
    return { error: 'Authentication required' };
  }

  const identifier = await getClientIdFromHeaders(userId);
  const rateLimitResult = await checkRateLimit(
    rateLimiters.likeCollectionLimiter,
    identifier,
    'Too many requests to unlike collection. Please try again later.'
  );
  if (!rateLimitResult.success) {
    const retryAfter = rateLimitResult.retryAfter ?? 60;
    return { error: rateLimitResult.error, retryAfter };
  }

  if (!collectionId) {
    return { error: 'Collection ID is required' };
  }

  try {
    // Check if like exists
    const existingLike = await db
      .select()
      .from(CollectionLikesTable)
      .where(
        and(
          eq(CollectionLikesTable.userId, userId),
          eq(CollectionLikesTable.collectionId, collectionId)
        )
      );

    if (existingLike.length === 0) {
      return { error: 'Collection not liked yet' };
    }

    // Remove like
    await db
      .delete(CollectionLikesTable)
      .where(
        and(
          eq(CollectionLikesTable.userId, userId),
          eq(CollectionLikesTable.collectionId, collectionId)
        )
      );

    // Decrement likes count
    await db
      .update(CollectionsTable)
      .set({
        likes: sql`GREATEST(${CollectionsTable.likes} - 1, 0)`,
      })
      .where(eq(CollectionsTable.id, collectionId));

    return { success: true, message: 'Collection unliked successfully' };
  } catch (error) {
    console.error('Error unliking collection:', error);
    return { error: 'Failed to unlike collection' };
  }
}

export async function checkIfLikedAction(collectionId: string) {
  const { userId } = await auth();

  if (!userId) {
    return { isLiked: false };
  }

  const identifier = await getClientIdFromHeaders(userId);
  const rateLimitResult = await checkRateLimit(
    rateLimiters.getCollectionsLimiter, // Using get limiter for read operation
    identifier,
    'Too many requests to check like status. Please try again later.'
  );
  if (!rateLimitResult.success) {
    return { isLiked: false }; // Fail silently for status checks
  }

  if (!collectionId) {
    return { error: 'Collection ID is required' };
  }

  try {
    const existingLike = await db
      .select()
      .from(CollectionLikesTable)
      .where(
        and(
          eq(CollectionLikesTable.userId, userId),
          eq(CollectionLikesTable.collectionId, collectionId)
        )
      );

    return { isLiked: existingLike.length > 0 };
  } catch (error) {
    console.error('Error checking like status:', error);
    return { isLiked: false };
  }
}
