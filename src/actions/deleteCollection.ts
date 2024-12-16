"use server";

import { db } from "@/db";
import { linkCollectionTable } from "@/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

export async function DeleteCollection(collectionId: string) {
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

    console.log("Collection deleted:", deletedCollection);

    return { success: true };
  } catch (error) {
    console.error("Failed to delete collection:", error);
    return { error: "Failed to delete collection" };
  }
}
