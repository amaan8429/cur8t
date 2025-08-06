import { db } from '@/db';
import { CollectionsTable } from '@/schema';
import { and, eq } from 'drizzle-orm';

export async function totalLinksCount({
  userId,
  collectionId,
}: {
  userId: string;
  collectionId: string;
}): Promise<number> {
  if (!userId) {
    throw new Error('User ID is required');
  }

  if (!collectionId) {
    throw new Error('Collection ID is required');
  }

  const totalLinks = await db
    .select({
      totalLinksCount: CollectionsTable.totalLinks,
    })
    .from(CollectionsTable)
    .where(
      and(
        eq(CollectionsTable.userId, userId),
        eq(CollectionsTable.id, collectionId)
      )
    );

  return totalLinks.length > 0 ? totalLinks[0].totalLinksCount : 0;
}
