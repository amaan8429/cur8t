'use server';

import { db } from '@/db';
import { LinksTable } from '@/schema';
import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import {
  checkRateLimit,
  getClientIdFromHeaders,
  rateLimiters,
} from '@/lib/ratelimit';

export async function getLinksAction(linkCollectionId: string) {
  const { userId } = await auth();

  if (!userId) {
    return { error: 'User not found' };
  }

  const identifier = await getClientIdFromHeaders(userId);
  const rateLimitResult = await checkRateLimit(
    rateLimiters.getLinksLimiter,
    identifier,
    'Too many requests to get links. Please try again later.'
  );
  if (!rateLimitResult.success) {
    const retryAfter = rateLimitResult.retryAfter ?? 60;
    return { error: rateLimitResult.error, retryAfter };
  }

  if (!linkCollectionId) {
    return { error: 'Link collection ID is required' };
  }

  const links = await db
    .select()
    .from(LinksTable)
    .where(
      and(
        eq(LinksTable.linkCollectionId, linkCollectionId),
        eq(LinksTable.userId, userId)
      )
    );

  return {
    success: true,
    data: links,
  };
}
