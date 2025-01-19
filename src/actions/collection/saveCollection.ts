"use server";

import { db } from "@/db";
import { SavedCollectionsTable } from "@/schema";
import { auth } from "@clerk/nextjs/server";

export async function saveCollection(collectionId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { error: "User not found" };
    }

    await db.insert(SavedCollectionsTable).values({
      userId,
      collectionId,
    });

    return { sucess: true };
  } catch (error) {
    return { error: "failed to save collection" };
  }
}
