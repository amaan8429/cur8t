"use server";

import { db } from "@/db";
import { linkCollectionTable } from "@/schema";
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

  try {
    const deletedCollection = await db
      .delete(linkCollectionTable)
      .where(
        and(
          eq(linkCollectionTable.id, collectionId),
          eq(linkCollectionTable.userId, userId)
        )
      );

    return { success: true };
  } catch (error) {
    return { error: error };
  }
}
