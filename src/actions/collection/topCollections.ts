"use server";

import { db } from "@/db";
import { auth } from "@clerk/nextjs/server";
import { UsersTable, CollectionsTable } from "@/schema";
import { eq, and, inArray } from "drizzle-orm";

export async function getTopCollections() {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not authenticated" };
  }

  try {
    // Get user's top collections array
    const user = await db
      .select({ topCollections: UsersTable.topCollections })
      .from(UsersTable)
      .where(eq(UsersTable.id, userId))
      .limit(1);

    if (!user.length) {
      return { error: "User not found" };
    }

    const topCollectionIds = user[0].topCollections;

    if (!topCollectionIds.length) {
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
          inArray(CollectionsTable.id, topCollectionIds)
        )
      );

    // Maintain the order from topCollectionIds
    const orderedCollections = topCollectionIds
      .map((id) => collections.find((col) => col.id === id))
      .filter((col): col is NonNullable<typeof col> => col !== undefined);

    return { data: orderedCollections };
  } catch (error) {
    console.error("Error fetching top collections:", error);
    return { error: "Failed to fetch top collections" };
  }
}

export async function getUserCollections() {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not authenticated" };
  }

  try {
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
      .where(eq(CollectionsTable.userId, userId));

    return { data: collections };
  } catch (error) {
    console.error("Error fetching user collections:", error);
    return { error: "Failed to fetch collections" };
  }
}

export async function setTopCollections(collectionIds: string[]) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not authenticated" };
  }

  if (collectionIds.length > 5) {
    return { error: "Cannot set more than 5 top collections" };
  }

  try {
    // Verify that all collections belong to the user
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

    // Update user's top collections
    await db
      .update(UsersTable)
      .set({ topCollections: collectionIds })
      .where(eq(UsersTable.id, userId));

    return { success: true };
  } catch (error) {
    console.error("Error setting top collections:", error);
    return { error: "Failed to update top collections" };
  }
}
