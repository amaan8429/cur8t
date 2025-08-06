'use server';

import { db } from '@/db';
import { CollectionsTable } from '@/schema';
import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import {
  checkRateLimit,
  getClientIdFromHeaders,
  rateLimiters,
} from '@/lib/ratelimit';

export async function getProtectedCollectionsAction() {
  const { userId } = await auth();

  if (!userId) {
    return { error: 'User not found' };
  }

  const identifier = await getClientIdFromHeaders(userId);
  const rateLimitResult = await checkRateLimit(
    rateLimiters.getCollectionsLimiter,
    identifier,
    'Too many requests to get protected collections. Please try again later.'
  );
  if (!rateLimitResult.success) {
    const retryAfter = rateLimitResult.retryAfter ?? 60;
    return { error: rateLimitResult.error, retryAfter };
  }

  const collections = await db
    .select()
    .from(CollectionsTable)
    .where(
      and(
        eq(CollectionsTable.userId, userId),
        eq(CollectionsTable.visibility, 'protected')
      )
    );

  return { sucesss: true, data: collections };
}
