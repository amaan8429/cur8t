"use server";

import { db } from "@/db";
import { CollectionsTable, SavedCollectionsTable, UsersTable } from "@/schema";
import { Collection } from "@/types/types";
import { auth } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";
import { sql } from "drizzle-orm";

export type PaginationParams = {
  page: number;
  limit: number;
  sortBy: "trending" | "recent" | "likes";
};

// Type for saved collection that includes author info from the join
export interface SavedCollection extends Collection {
  author: string;
}

export async function fetchSavedCollections({
  page = 1,
  limit = 9,
  sortBy = "trending",
}: PaginationParams) {
  // Calculate offset
  const offset = (page - 1) * limit;

  const { userId } = await auth();

  if (!userId) {
    return {
      error: "User not found",
    };
  }

  // Get sort column based on sortBy parameter
  const getSortColumn = () => {
    switch (sortBy) {
      case "recent":
        return CollectionsTable.updatedAt;
      case "likes":
        return CollectionsTable.likes;
      case "trending":
      default:
        return CollectionsTable.likes;
    }
  };

  // Get total count of saved collections for this user
  const totalCountResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(SavedCollectionsTable)
    .where(eq(SavedCollectionsTable.userId, userId));

  const totalCount = totalCountResult[0].count;

  // Fetch paginated saved collections with their collection data
  const savedCollections = await db
    .select({
      id: CollectionsTable.id,
      title: CollectionsTable.title,
      author: UsersTable.name,
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
    .from(SavedCollectionsTable)
    .innerJoin(
      CollectionsTable,
      eq(SavedCollectionsTable.collectionId, CollectionsTable.id)
    )
    .leftJoin(UsersTable, eq(CollectionsTable.userId, UsersTable.id))
    .where(eq(SavedCollectionsTable.userId, userId))
    .orderBy(desc(getSortColumn()))
    .limit(limit)
    .offset(offset);

  return {
    data: savedCollections as SavedCollection[],
    pagination: {
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      limit,
    },
  };
}
