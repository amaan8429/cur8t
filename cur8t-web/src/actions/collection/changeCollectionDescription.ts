'use server';

import { db } from '@/db';
import { CollectionsTable } from '@/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import {
  checkRateLimit,
  getClientIdFromHeaders,
  rateLimiters,
} from '@/lib/ratelimit';
import { FrontendCollectionSchema } from '@/types/types';

export async function ChangeCollectionDescriptionAction(
  collectionId: string,
  newDescription: string
) {
  const { userId } = await auth();

  if (!userId) {
    return { error: 'User not found' };
  }

  const identifier = await getClientIdFromHeaders(userId);
  const rateLimitResult = await checkRateLimit(
    rateLimiters.changeCollectionDescriptionLimiter,
    identifier,
    'Too many requests to change collection description. Please try again later.'
  );
  if (!rateLimitResult.success) {
    const retryAfter = rateLimitResult.retryAfter ?? 60;
    return { error: rateLimitResult.error, retryAfter };
  }

  if (!collectionId) {
    return { error: 'Collection Id is required' };
  }

  // Validate the new description using schema
  const validationResult = FrontendCollectionSchema.safeParse({
    title: 'placeholder', // Required field but not being changed
    description: newDescription,
  });

  if (!validationResult.success) {
    const errorMessage =
      validationResult.error.errors.find((e) => e.path.includes('description'))
        ?.message || 'Invalid description';
    return { error: errorMessage };
  }

  const collection = await db
    .update(CollectionsTable)
    .set({
      description: newDescription,
    })
    .where(eq(CollectionsTable.id, collectionId))
    .returning();

  return { success: true, data: collection[0].description };
}
