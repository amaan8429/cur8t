import { db } from '@/db';
import { UsersTable } from '@/schema';
import { eq } from 'drizzle-orm';

export async function totalCollectionsCount({
  userId,
}: {
  userId: string;
}): Promise<number> {
  const totalCollections = await db
    .select({
      totalCollectionsCount: UsersTable.totalCollections,
    })
    .from(UsersTable)
    .where(eq(UsersTable.id, userId));

  return totalCollections[0].totalCollectionsCount;
}
