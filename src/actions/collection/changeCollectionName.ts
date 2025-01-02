"use server";

import { db } from "@/db";
import { linkCollectionTable } from "@/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function ChangeCollectionAction(
  collectionId: string,
  newName: string
) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not found" };
  }

  if (!collectionId) {
    return { error: "Collection Id is required" };
  }

  if (!newName) {
    return { error: "New name is required" };
  }

  const collection = await db
    .update(linkCollectionTable)
    .set({
      name: newName,
    })
    .where(eq(linkCollectionTable.id, collectionId))
    .returning();

  return { success: true, data: collection[0].name };
}
