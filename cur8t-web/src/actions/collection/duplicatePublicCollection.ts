"use server";

import { db } from "@/db";
import { totalCollectionsCount } from "@/lib/totalCollectionCount";
import { CollectionsTable, UsersTable, LinksTable } from "@/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function duplicatePublicCollectionAction(
  sourceCollectionId: string,
  options: {
    includeLinks?: boolean;
    visibility?: "private" | "public" | "protected";
  } = {}
) {
  const { userId } = await auth();

  if (!userId) {
    return {
      error:
        "Authentication required. Please sign in to duplicate this collection.",
    };
  }

  if (!sourceCollectionId) {
    return { error: "Source collection ID is required" };
  }

  const { includeLinks = true, visibility = "private" } = options;

  try {
    // Get the source collection
    const sourceCollection = await db
      .select()
      .from(CollectionsTable)
      .where(eq(CollectionsTable.id, sourceCollectionId));

    if (!sourceCollection || sourceCollection.length === 0) {
      return { error: "Source collection not found" };
    }

    const source = sourceCollection[0];

    // Check if source collection is accessible (public or protected with access)
    if (source.visibility === "private") {
      return { error: "Cannot duplicate private collections" };
    }

    // Get current user info
    const userResult = await db
      .select({ name: UsersTable.name })
      .from(UsersTable)
      .where(eq(UsersTable.id, userId));

    if (!userResult || userResult.length === 0) {
      return { error: "User not found" };
    }

    const userName = userResult[0].name;

    // Create duplicate collection
    const duplicateName = `Copy of ${source.title}`;
    const duplicateCollection = await db
      .insert(CollectionsTable)
      .values({
        title: duplicateName,
        description: source.description,
        author: userName,
        userId: userId,
        url: "",
        visibility: visibility,
        sharedEmails: [], // Reset shared emails for new collection
      })
      .returning();

    const newCollection = duplicateCollection[0];

    // Copy links if requested
    if (includeLinks) {
      const sourceLinks = await db
        .select()
        .from(LinksTable)
        .where(eq(LinksTable.linkCollectionId, sourceCollectionId));

      if (sourceLinks.length > 0) {
        await db.insert(LinksTable).values(
          sourceLinks.map((link) => ({
            title: link.title,
            url: link.url,
            linkCollectionId: newCollection.id,
            userId: userId,
          }))
        );

        // Update total links count
        await db
          .update(CollectionsTable)
          .set({
            totalLinks: sourceLinks.length,
          })
          .where(eq(CollectionsTable.id, newCollection.id));
      }
    }

    // Update user's total collections count
    const totalCollections = await totalCollectionsCount({ userId });
    await db
      .update(UsersTable)
      .set({
        totalCollections: totalCollections + 1,
      })
      .where(eq(UsersTable.id, userId));

    return {
      success: true,
      data: newCollection,
      message: "Collection duplicated successfully",
    };
  } catch (error) {
    console.error("Error duplicating collection:", error);
    return { error: "Failed to duplicate collection" };
  }
}
