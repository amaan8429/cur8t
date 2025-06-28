"use server";

import { db } from "@/db";
import { SavedCollectionsTable } from "@/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";

export async function saveCollectionAction(collectionId: string) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Authentication required" };
  }

  if (!collectionId) {
    return { error: "Collection ID is required" };
  }

  try {
    // Check if already saved
    const existingSave = await db
      .select()
      .from(SavedCollectionsTable)
      .where(
        and(
          eq(SavedCollectionsTable.userId, userId),
          eq(SavedCollectionsTable.collectionId, collectionId)
        )
      );

    if (existingSave.length > 0) {
      return { error: "Collection already saved" };
    }

    // Save collection
    await db.insert(SavedCollectionsTable).values({
      userId,
      collectionId,
    });

    return { success: true, message: "Collection saved successfully" };
  } catch (error) {
    console.error("Error saving collection:", error);
    return { error: "Failed to save collection" };
  }
}

export async function unsaveCollectionAction(collectionId: string) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Authentication required" };
  }

  if (!collectionId) {
    return { error: "Collection ID is required" };
  }

  try {
    // Check if save exists
    const existingSave = await db
      .select()
      .from(SavedCollectionsTable)
      .where(
        and(
          eq(SavedCollectionsTable.userId, userId),
          eq(SavedCollectionsTable.collectionId, collectionId)
        )
      );

    if (existingSave.length === 0) {
      return { error: "Collection not saved yet" };
    }

    // Remove save
    await db
      .delete(SavedCollectionsTable)
      .where(
        and(
          eq(SavedCollectionsTable.userId, userId),
          eq(SavedCollectionsTable.collectionId, collectionId)
        )
      );

    return { success: true, message: "Collection unsaved successfully" };
  } catch (error) {
    console.error("Error unsaving collection:", error);
    return { error: "Failed to unsave collection" };
  }
}

export async function checkIfSavedAction(collectionId: string) {
  const { userId } = await auth();

  if (!userId) {
    return { isSaved: false };
  }

  if (!collectionId) {
    return { error: "Collection ID is required" };
  }

  try {
    const existingSave = await db
      .select()
      .from(SavedCollectionsTable)
      .where(
        and(
          eq(SavedCollectionsTable.userId, userId),
          eq(SavedCollectionsTable.collectionId, collectionId)
        )
      );

    return { isSaved: existingSave.length > 0 };
  } catch (error) {
    console.error("Error checking save status:", error);
    return { isSaved: false };
  }
}
