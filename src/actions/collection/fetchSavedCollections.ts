"use server";

import { db } from "@/db";
import { CollectionsTable, SavedCollectionsTable } from "@/schema";
import { Collection } from "@/types/types";
import { auth } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";
import { sql } from "drizzle-orm";

export type PaginationParams = {
  page: number;
  limit: number;
  sortBy: "trending" | "recent" | "likes";
};

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

  // Get total count
  const totalCountResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(SavedCollectionsTable);

  const totalCount = totalCountResult[0].count;

  // Fetch paginated data
  const savedCollections = await db
    .select()
    .from(SavedCollectionsTable)
    .orderBy(desc(getSortColumn()))
    .limit(limit)
    .offset(offset)
    .leftJoin(
      CollectionsTable,
      eq(SavedCollectionsTable.collectionId, CollectionsTable.id)
    )
    .where(eq(SavedCollectionsTable.userId, userId));

  return {
    data: (savedCollections[0]?.collections ?? []) as Collection[],
    pagination: {
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      limit,
    },
  };
}
