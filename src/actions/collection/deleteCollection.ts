"use server";

import { db } from "@/db";
import { totalCollectionsCount } from "@/lib/totalCollectionCount";
import { CollectionsTable, UsersTable } from "@/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

export async function deleteCollectionAction(collectionId: string) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not found" };
  }

  if (!collectionId) {
    return { error: "Collection ID is required" };
  }

  const totalCollections = await totalCollectionsCount({ userId });

  try {
    await db
      .delete(CollectionsTable)
      .where(
        and(
          eq(CollectionsTable.id, collectionId),
          eq(CollectionsTable.userId, userId)
        )
      );

    await db
      .update(UsersTable)
      .set({
        totalCollections: totalCollections - 1,
      })
      .where(eq(UsersTable.id, userId));

    return { success: true };
  } catch (error) {
    return { error: error };
  }
}
