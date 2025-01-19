import { db } from "@/db";
import { CollectionsTable } from "@/schema";
import { and, eq } from "drizzle-orm";

export async function totalLinksCount({
  userId,
  collectionId,
}: {
  userId: string;
  collectionId: string;
}): Promise<number> {
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

  return totalLinks[0].totalLinksCount;
}
