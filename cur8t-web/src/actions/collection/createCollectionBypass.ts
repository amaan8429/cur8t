'use server';

import { db } from '@/db';
import { totalCollectionsCount } from '@/lib/totalCollectionCount';
import { CollectionsTable, UsersTable } from '@/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { FrontendCollectionSchema } from '@/types/types';
import {
  checkRateLimit,
  getClientIdFromHeaders,
  rateLimiters,
} from '@/lib/ratelimit';

export async function createCollectionBypassAction(
  collectionName: string,
  description: string,
  visiblity: string
) {
  const { userId } = await auth();

  if (!userId) {
    return { error: 'User not found' };
  }

  const identifier = await getClientIdFromHeaders(userId);
  const rateLimitResult = await checkRateLimit(
    rateLimiters.createCollectionLimiter,
    identifier,
    'Too many requests to create collection. Please try again later.'
  );
  if (!rateLimitResult.success) {
    const retryAfter = rateLimitResult.retryAfter ?? 60;
    return { error: rateLimitResult.error, retryAfter };
  }

  // Validate input using schema
  const validationResult = FrontendCollectionSchema.safeParse({
    title: collectionName,
    description: description,
  });

  if (!validationResult.success) {
    const errorMessage =
      validationResult.error.errors[0]?.message || 'Invalid input data';
    return { error: errorMessage };
  }

  if (!visiblity) {
    return { error: 'Visibility is required' };
  }

  // BYPASS: No subscription limit check for tools and agents

  try {
    const createdCollection = await db
      .insert(CollectionsTable)
      .values({
        title: collectionName,
        description: description,
        userId: userId,
        url: '',
        visibility: visiblity,
      })
      .returning();

    const totalCollections = await totalCollectionsCount({ userId });
    await db
      .update(UsersTable)
      .set({
        totalCollections: totalCollections + 1,
      })
      .where(eq(UsersTable.id, userId));

    console.log('Collection created:', createdCollection);

    return { success: true, data: createdCollection[0] };
  } catch (error) {
    console.error('Error creating collection:', error);
    return { error: 'Failed to create collection. Please try again.' };
  }
}
