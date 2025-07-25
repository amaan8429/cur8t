"use server";

import { db } from "@/db";
import { auth } from "@clerk/nextjs/server";
import { UsersTable, CollectionsTable } from "@/schema";
import { eq, and, inArray } from "drizzle-orm";
import {
  checkRateLimit,
  getClientIdFromHeaders,
  rateLimiters,
} from "@/lib/ratelimit";

export async function getPinnedCollections() {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not authenticated" };
  }

  const identifier = await getClientIdFromHeaders(userId);
  const rateLimitResult = await checkRateLimit(
    rateLimiters.getCollectionsLimiter,
    identifier,
    "Too many requests to get pinned collections. Please try again later."
  );
  if (!rateLimitResult.success) {
    const retryAfter = rateLimitResult.retryAfter ?? 60;
    return { error: rateLimitResult.error, retryAfter };
  }

  try {
    // Get user's pinned collections array
    const user = await db
      .select({ pinnedCollections: UsersTable.pinnedCollections })
      .from(UsersTable)
      .where(eq(UsersTable.id, userId))
      .limit(1);

    if (!user.length) {
      return { error: "User not found" };
    }

    const pinnedCollectionIds = user[0].pinnedCollections;

    if (!pinnedCollectionIds.length) {
      return { data: [] };
    }

    // Get the actual collection details
    const collections = await db
      .select({
        id: CollectionsTable.id,
        title: CollectionsTable.title,
        description: CollectionsTable.description,
        visibility: CollectionsTable.visibility,
        totalLinks: CollectionsTable.totalLinks,
        createdAt: CollectionsTable.createdAt,
      })
      .from(CollectionsTable)
      .where(
        and(
          eq(CollectionsTable.userId, userId),
          inArray(CollectionsTable.id, pinnedCollectionIds)
        )
      );

    // Maintain the order from pinnedCollectionIds
    const orderedCollections = pinnedCollectionIds
      .map((id) => collections.find((col) => col.id === id))
      .filter((col): col is NonNullable<typeof col> => col !== undefined);

    return { data: orderedCollections };
  } catch (error) {
    console.error("Error fetching pinned collections:", error);
    return { error: "Failed to fetch pinned collections" };
  }
}

export async function addPinnedCollection(collectionId: string) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not authenticated" };
  }

  const identifier = await getClientIdFromHeaders(userId);
  const rateLimitResult = await checkRateLimit(
    rateLimiters.userUpdateLimiter, // Using user update limiter for modification operations
    identifier,
    "Too many requests to pin collection. Please try again later."
  );
  if (!rateLimitResult.success) {
    const retryAfter = rateLimitResult.retryAfter ?? 60;
    return { error: rateLimitResult.error, retryAfter };
  }

  try {
    // Get current pinned collections
    const user = await db
      .select({ pinnedCollections: UsersTable.pinnedCollections })
      .from(UsersTable)
      .where(eq(UsersTable.id, userId))
      .limit(1);

    if (!user.length) {
      return { error: "User not found" };
    }

    const currentPinned = user[0].pinnedCollections;

    // Check if already pinned
    if (currentPinned.includes(collectionId)) {
      return { error: "Collection is already pinned" };
    }

    // Check limit
    if (currentPinned.length >= 3) {
      return { error: "Cannot pin more than 3 collections" };
    }

    // Verify collection belongs to user
    const collection = await db
      .select({ id: CollectionsTable.id })
      .from(CollectionsTable)
      .where(
        and(
          eq(CollectionsTable.userId, userId),
          eq(CollectionsTable.id, collectionId)
        )
      )
      .limit(1);

    if (!collection.length) {
      return { error: "Collection not found or does not belong to you" };
    }

    // Add to pinned collections
    const newPinned = [...currentPinned, collectionId];
    await db
      .update(UsersTable)
      .set({ pinnedCollections: newPinned })
      .where(eq(UsersTable.id, userId));

    return { success: true };
  } catch (error) {
    console.error("Error pinning collection:", error);
    return { error: "Failed to pin collection" };
  }
}

export async function removePinnedCollection(collectionId: string) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not authenticated" };
  }

  const identifier = await getClientIdFromHeaders(userId);
  const rateLimitResult = await checkRateLimit(
    rateLimiters.userUpdateLimiter, // Using user update limiter for modification operations
    identifier,
    "Too many requests to unpin collection. Please try again later."
  );
  if (!rateLimitResult.success) {
    const retryAfter = rateLimitResult.retryAfter ?? 60;
    return { error: rateLimitResult.error, retryAfter };
  }

  try {
    // Get current pinned collections
    const user = await db
      .select({ pinnedCollections: UsersTable.pinnedCollections })
      .from(UsersTable)
      .where(eq(UsersTable.id, userId))
      .limit(1);

    if (!user.length) {
      return { error: "User not found" };
    }

    const currentPinned = user[0].pinnedCollections;

    // Remove from pinned collections
    const newPinned = currentPinned.filter((id) => id !== collectionId);
    await db
      .update(UsersTable)
      .set({ pinnedCollections: newPinned })
      .where(eq(UsersTable.id, userId));

    return { success: true };
  } catch (error) {
    console.error("Error unpinning collection:", error);
    return { error: "Failed to unpin collection" };
  }
}

export async function setPinnedCollections(collectionIds: string[]) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not authenticated" };
  }

  const identifier = await getClientIdFromHeaders(userId);
  const rateLimitResult = await checkRateLimit(
    rateLimiters.userUpdateLimiter, // Using user update limiter for modification operations
    identifier,
    "Too many requests to set pinned collections. Please try again later."
  );
  if (!rateLimitResult.success) {
    const retryAfter = rateLimitResult.retryAfter ?? 60;
    return { error: rateLimitResult.error, retryAfter };
  }

  if (collectionIds.length > 3) {
    return { error: "Cannot pin more than 3 collections" };
  }

  try {
    // Verify that all collections belong to the user
    if (collectionIds.length > 0) {
      const userCollections = await db
        .select({ id: CollectionsTable.id })
        .from(CollectionsTable)
        .where(
          and(
            eq(CollectionsTable.userId, userId),
            inArray(CollectionsTable.id, collectionIds)
          )
        );

      if (userCollections.length !== collectionIds.length) {
        return { error: "One or more collections do not belong to you" };
      }
    }

    // Update user's pinned collections
    await db
      .update(UsersTable)
      .set({ pinnedCollections: collectionIds })
      .where(eq(UsersTable.id, userId));

    return { success: true };
  } catch (error) {
    console.error("Error setting pinned collections:", error);
    return { error: "Failed to update pinned collections" };
  }
}
