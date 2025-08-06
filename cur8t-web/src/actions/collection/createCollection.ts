'use server';

import { db } from '@/db';
import { totalCollectionsCount } from '@/lib/totalCollectionCount';
import { CollectionsTable, UsersTable } from '@/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import {
  checkRateLimit,
  getClientIdFromHeaders,
  rateLimiters,
} from '@/lib/ratelimit';
import { FrontendCollectionSchema } from '@/types/types';

export async function createCollectionAction(
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
}
