'use server';

import { db } from '@/db';
import { totalLinksCount } from '@/lib/totalLinksCount';
import { CollectionsTable, LinksTable } from '@/schema';
import { FrontendLinkSchema } from '@/types/types';
import { extractTitleFromUrl, generateFallbackTitle } from '@/lib/extractTitle';
import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import {
  checkRateLimit,
  getClientIdFromHeaders,
  rateLimiters,
} from '@/lib/ratelimit';
import { getSubscriptionSnapshot } from '@/lib/subscription';

export async function createLinkAction(
  linkCollectionId: string,
  linkName: string | undefined,
  linkUrl: string
) {
  const { userId } = await auth();

  if (!userId) {
    return { error: 'User not found' };
  }

  const identifier = await getClientIdFromHeaders(userId);
  const rateLimitResult = await checkRateLimit(
    rateLimiters.createLinkLimiter,
    identifier,
    'Too many requests to create link. Please try again later.'
  );
  if (!rateLimitResult.success) {
    const retryAfter = rateLimitResult.retryAfter ?? 60;
    return { error: rateLimitResult.error, retryAfter };
  }

  if (!linkCollectionId) {
    return { error: 'Link collection ID is required' };
  }

  const parsedLink = FrontendLinkSchema.safeParse({
    title: linkName,
    url: linkUrl,
  });

  if (!parsedLink.success) {
    return {
      error: 'Invalid link data',
    };
  }

  // Extract title if not provided
  let finalTitle: string = parsedLink.data.title || '';
  if (!finalTitle.trim()) {
    try {
      finalTitle = await extractTitleFromUrl(parsedLink.data.url);
    } catch (error) {
      console.warn('Failed to extract title, using fallback:', error);
      finalTitle = generateFallbackTitle(parsedLink.data.url);
    }
  }

  // Gating: enforce per-plan link limits
  const snapshot = await getSubscriptionSnapshot(userId);
  const perCollectionMax = snapshot.limits.linksPerCollection;
  const totalMax = snapshot.limits.totalLinks;

  const currentCollectionLinks = await totalLinksCount({
    userId,
    collectionId: linkCollectionId,
  });

  if (currentCollectionLinks >= perCollectionMax) {
    return {
      error: `This collection already has ${currentCollectionLinks} links. Your plan allows ${perCollectionMax} per collection.`,
      plan: snapshot.planSlug,
    };
  }

  // Compute total links across all collections for the user
  // Using a light query on collections sum to avoid race with stale totalLinks
  const totalLinksForUser = await db
    .select({ count: CollectionsTable.totalLinks })
    .from(CollectionsTable)
    .where(eq(CollectionsTable.userId, userId));
  const overall = totalLinksForUser.reduce((sum, r) => sum + (r.count ?? 0), 0);

  if (overall >= totalMax) {
    return {
      error: `You have ${overall} total links. Your plan allows up to ${totalMax}.`,
      plan: snapshot.planSlug,
    };
  }

  const link = {
    title: finalTitle,
    url: parsedLink.data.url,
    linkCollectionId,
    userId,
  };

  const createdLink = await db.insert(LinksTable).values(link).returning();

  const totalLinks = await totalLinksCount({
    userId,
    collectionId: linkCollectionId,
  });

  await db
    .update(CollectionsTable)
    .set({
      totalLinks: totalLinks + 1,
    })
    .where(
      and(
        eq(CollectionsTable.userId, userId),
        eq(CollectionsTable.id, linkCollectionId)
      )
    );

  console.log('Link created:', createdLink);

  return { success: true, data: createdLink };
}
