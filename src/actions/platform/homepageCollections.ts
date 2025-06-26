"use server";

import { db } from "@/db";
import { CollectionsTable } from "@/schema";
import { eq, desc, gte, and } from "drizzle-orm";
import { Collection } from "@/types/types";

export async function getHomepageCollections() {
  try {
    // Get trending collections (most liked public collections)
    const trendingCollections = await db
      .select({
        id: CollectionsTable.id,
        title: CollectionsTable.title,
        author: CollectionsTable.author,
        likes: CollectionsTable.likes,
        description: CollectionsTable.description,
        userId: CollectionsTable.userId,
        url: CollectionsTable.url,
        createdAt: CollectionsTable.createdAt,
        updatedAt: CollectionsTable.updatedAt,
        visibility: CollectionsTable.visibility,
        sharedEmails: CollectionsTable.sharedEmails,
        totalLinks: CollectionsTable.totalLinks,
      })
      .from(CollectionsTable)
      .where(eq(CollectionsTable.visibility, "public"))
      .orderBy(desc(CollectionsTable.likes))
      .limit(6);

    // Get recently updated collections
    const recentCollections = await db
      .select({
        id: CollectionsTable.id,
        title: CollectionsTable.title,
        author: CollectionsTable.author,
        likes: CollectionsTable.likes,
        description: CollectionsTable.description,
        userId: CollectionsTable.userId,
        url: CollectionsTable.url,
        createdAt: CollectionsTable.createdAt,
        updatedAt: CollectionsTable.updatedAt,
        visibility: CollectionsTable.visibility,
        sharedEmails: CollectionsTable.sharedEmails,
        totalLinks: CollectionsTable.totalLinks,
      })
      .from(CollectionsTable)
      .where(eq(CollectionsTable.visibility, "public"))
      .orderBy(desc(CollectionsTable.updatedAt))
      .limit(6);

    // Get collections created this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const newCollections = await db
      .select({
        id: CollectionsTable.id,
        title: CollectionsTable.title,
        author: CollectionsTable.author,
        likes: CollectionsTable.likes,
        description: CollectionsTable.description,
        userId: CollectionsTable.userId,
        url: CollectionsTable.url,
        createdAt: CollectionsTable.createdAt,
        updatedAt: CollectionsTable.updatedAt,
        visibility: CollectionsTable.visibility,
        sharedEmails: CollectionsTable.sharedEmails,
        totalLinks: CollectionsTable.totalLinks,
      })
      .from(CollectionsTable)
      .where(
        and(
          eq(CollectionsTable.visibility, "public"),
          gte(CollectionsTable.createdAt, oneWeekAgo)
        )
      )
      .orderBy(desc(CollectionsTable.createdAt))
      .limit(6);

    return {
      success: true,
      data: {
        trending: trendingCollections as Collection[],
        recent: recentCollections as Collection[],
        new: newCollections as Collection[],
      },
    };
  } catch (error) {
    console.error("Error fetching homepage collections:", error);
    return {
      error: "Failed to fetch homepage collections",
    };
  }
}
