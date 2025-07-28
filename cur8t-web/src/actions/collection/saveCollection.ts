"use server";

import { db } from "@/db";
import { SavedCollectionsTable } from "@/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import {
  checkRateLimit,
  getClientIdFromHeaders,
  rateLimiters,
} from "@/lib/ratelimit";

export async function saveCollectionAction(collectionId: string) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Authentication required" };
  }

  const identifier = await getClientIdFromHeaders(userId);
  const rateLimitResult = await checkRateLimit(
    rateLimiters.likeCollectionLimiter, // Using like limiter as it's similar action
    identifier,
    "Too many requests to save collection. Please try again later."
  );
  if (!rateLimitResult.success) {
    const retryAfter = rateLimitResult.retryAfter ?? 60;
    return { error: rateLimitResult.error, retryAfter };
  }

  if (!collectionId) {
    return { error: "Collection ID is required" };
  }

  try {
    // Use upsert to handle race conditions and duplicate saves gracefully
    const result = await db.insert(SavedCollectionsTable)
      .values({
        userId,
        collectionId,
      })
      .onConflictDoNothing()
      .returning({ id: SavedCollectionsTable.id });

    // If result is empty, it means the collection was already saved
    if (result.length === 0) {
      return { success: true, message: "Collection already saved" };
    }

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

  const identifier = await getClientIdFromHeaders(userId);
  const rateLimitResult = await checkRateLimit(
    rateLimiters.likeCollectionLimiter, // Using like limiter as it's similar action
    identifier,
    "Too many requests to unsave collection. Please try again later."
  );
  if (!rateLimitResult.success) {
    const retryAfter = rateLimitResult.retryAfter ?? 60;
    return { error: rateLimitResult.error, retryAfter };
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

  const identifier = await getClientIdFromHeaders(userId);
  const rateLimitResult = await checkRateLimit(
    rateLimiters.getCollectionsLimiter, // Using get limiter for read operation
    identifier,
    "Too many requests to check save status. Please try again later."
  );
  if (!rateLimitResult.success) {
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
