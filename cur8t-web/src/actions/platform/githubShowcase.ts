"use server";

import { db } from "@/db";
import { CollectionsTable, LinksTable, UsersTable } from "@/schema";
import { eq, and, ilike, desc } from "drizzle-orm";

export async function getGitHubShowcase() {
  try {
    // Get collections that have GitHub-related content
    const githubCollections = await db
      .select({
        id: CollectionsTable.id,
        title: CollectionsTable.title,
        author: UsersTable.name,
        description: CollectionsTable.description,
        likes: CollectionsTable.likes,
        totalLinks: CollectionsTable.totalLinks,
        updatedAt: CollectionsTable.updatedAt,
        userId: CollectionsTable.userId,
      })
      .from(CollectionsTable)
      .leftJoin(UsersTable, eq(CollectionsTable.userId, UsersTable.id))
      .where(
        and(
          eq(CollectionsTable.visibility, "public"),
          ilike(CollectionsTable.description, "%github%")
        )
      )
      .orderBy(desc(CollectionsTable.likes))
      .limit(6);

    // Get collections with GitHub links
    const collectionsWithGitHubLinks = await db
      .select({
        id: CollectionsTable.id,
        title: CollectionsTable.title,
        author: UsersTable.name,
        description: CollectionsTable.description,
        likes: CollectionsTable.likes,
        totalLinks: CollectionsTable.totalLinks,
        updatedAt: CollectionsTable.updatedAt,
        userId: CollectionsTable.userId,
      })
      .from(CollectionsTable)
      .leftJoin(UsersTable, eq(CollectionsTable.userId, UsersTable.id))
      .innerJoin(
        LinksTable,
        eq(CollectionsTable.id, LinksTable.linkCollectionId)
      )
      .where(
        and(
          eq(CollectionsTable.visibility, "public"),
          ilike(LinksTable.url, "%github.com%")
        )
      )
      .groupBy(
        CollectionsTable.id,
        CollectionsTable.title,
        UsersTable.name,
        CollectionsTable.description,
        CollectionsTable.likes,
        CollectionsTable.totalLinks,
        CollectionsTable.updatedAt,
        CollectionsTable.userId
      )
      .orderBy(desc(CollectionsTable.likes))
      .limit(6);

    // Combine and deduplicate
    const allCollections = [
      ...githubCollections,
      ...collectionsWithGitHubLinks,
    ];
    const uniqueCollections = allCollections.filter(
      (collection, index, self) =>
        index === self.findIndex((c) => c.id === collection.id)
    );

    // Sort by likes and limit
    const sortedCollections = uniqueCollections
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 8);

    return {
      success: true,
      data: sortedCollections,
    };
  } catch (error) {
    console.error("Error fetching GitHub showcase:", error);
    return {
      error: "Failed to fetch GitHub showcase",
    };
  }
}
