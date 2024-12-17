"use server";

import { db } from "@/db";
import { linkCollectionTable } from "@/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

export async function ChangeCollectionVisiblity(
  collectionId: string,
  visibility: string
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  if (!collectionId) {
    throw new Error("Collection ID is required");
  }

  const targetCollection = await db
    .update(linkCollectionTable)
    .set({
      visiblity: visibility,
    })
    .where(
      and(
        eq(linkCollectionTable.userId, userId),
        eq(linkCollectionTable.id, collectionId)
      )
    );

  if (!targetCollection) {
    return {
      error: "Collection not found",
    };
  }

  return {
    success: true,
  };
}
