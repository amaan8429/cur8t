"use server";

import { db } from "@/db";
import { CollectionsTable, UsersTable } from "@/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function getSingleCollectionAction(collectionId: string) {
  const { userId } = await auth();

  if (!collectionId) {
    return { error: "Collection ID is required" };
  }

  // Fetch the collection with author information
  const collectionResult = await db
    .select({
      id: CollectionsTable.id,
      title: CollectionsTable.title,
      description: CollectionsTable.description,
      author: CollectionsTable.author,
      likes: CollectionsTable.likes,
      totalLinks: CollectionsTable.totalLinks,
      userId: CollectionsTable.userId,
      visibility: CollectionsTable.visibility,
      sharedEmails: CollectionsTable.sharedEmails,
      createdAt: CollectionsTable.createdAt,
      updatedAt: CollectionsTable.updatedAt,
    })
    .from(CollectionsTable)
    .where(eq(CollectionsTable.id, collectionId));

  if (!collectionResult || collectionResult.length === 0) {
    return { error: "Collection not found" };
  }

  const collection = collectionResult[0];

  // Check visibility permissions
  if (collection.visibility === "private") {
    // Private: Only the owner can view
    if (!userId || collection.userId !== userId) {
      return {
        error:
          "This collection is private. Please sign in to view if you're the owner.",
      };
    }
  } else if (collection.visibility === "protected") {
    // Protected: Owner and people in shared emails can view
    if (!userId) {
      return { error: "This collection is protected. Please sign in to view." };
    }

    // Get current user's email to check if they're in shared emails
    const userResult = await db
      .select({ email: UsersTable.email })
      .from(UsersTable)
      .where(eq(UsersTable.id, userId));

    const userEmail = userResult[0]?.email;
    const isOwner = collection.userId === userId;
    const isSharedWith =
      userEmail && collection.sharedEmails?.includes(userEmail);

    if (!isOwner && !isSharedWith) {
      return {
        error: "You don't have permission to view this protected collection.",
      };
    }
  }
  // For public collections, no authentication required - anyone can view

  return {
    success: true,
    data: collection,
  };
}
