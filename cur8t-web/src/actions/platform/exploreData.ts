"use server";

import { db } from "@/db";
import { CollectionsTable, UsersTable, SavedCollectionsTable } from "@/schema";
import { eq, desc, gte, and } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { Collection } from "@/types/types";
import { auth } from "@clerk/nextjs/server";
import {
  checkRateLimit,
  getClientIdFromHeaders,
  rateLimiters,
} from "@/lib/ratelimit";

export interface ExploreCollection extends Collection {
  author: string;
  authorUsername: string | null;
}

export interface ExploreDataResponse {
  trending: ExploreCollection[];
  recent: ExploreCollection[];
  newCollections: ExploreCollection[];
  savedCollections?: ExploreCollection[];
  userStats?: {
    totalSavedCollections: number;
  };
}

export async function getExploreData(): Promise<
  | { success: true; data: ExploreDataResponse }
  | { error: string; retryAfter?: number }
> {
  // Rate limiting
  const { userId } = await auth();
  const identifier = await getClientIdFromHeaders(userId);
  const rateLimitResult = await checkRateLimit(
    rateLimiters.getPlatformStatsLimiter,
    identifier,
    "Too many requests to get explore data. Please try again later."
  );

  if (!rateLimitResult.success) {
    const retryAfter = rateLimitResult.retryAfter ?? 60;
    return { error: rateLimitResult.error, retryAfter };
  }

  try {
    // Define the base select fields
    const selectFields = {
      id: CollectionsTable.id,
      title: CollectionsTable.title,
      author: UsersTable.name,
      authorUsername: UsersTable.username,
      likes: CollectionsTable.likes,
      description: CollectionsTable.description,
      userId: CollectionsTable.userId,
      url: CollectionsTable.url,
      createdAt: CollectionsTable.createdAt,
      updatedAt: CollectionsTable.updatedAt,
      visibility: CollectionsTable.visibility,
      sharedEmails: CollectionsTable.sharedEmails,
      totalLinks: CollectionsTable.totalLinks,
    };

    // Run all public queries in parallel
    const [trendingCollections, recentCollections, newCollections] =
      await Promise.all([
        // Trending collections (most liked)
        db
          .select(selectFields)
          .from(CollectionsTable)
          .leftJoin(UsersTable, eq(CollectionsTable.userId, UsersTable.id))
          .where(eq(CollectionsTable.visibility, "public"))
          .orderBy(desc(CollectionsTable.likes))
          .limit(6),

        // Recent collections (recently updated)
        db
          .select(selectFields)
          .from(CollectionsTable)
          .leftJoin(UsersTable, eq(CollectionsTable.userId, UsersTable.id))
          .where(eq(CollectionsTable.visibility, "public"))
          .orderBy(desc(CollectionsTable.updatedAt))
          .limit(6),

        // New collections (created in last 7 days)
        (() => {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

          return db
            .select(selectFields)
            .from(CollectionsTable)
            .leftJoin(UsersTable, eq(CollectionsTable.userId, UsersTable.id))
            .where(
              and(
                eq(CollectionsTable.visibility, "public"),
                gte(CollectionsTable.createdAt, oneWeekAgo)
              )
            )
            .orderBy(desc(CollectionsTable.createdAt))
            .limit(6);
        })(),
      ]);

    const response: ExploreDataResponse = {
      trending: trendingCollections as ExploreCollection[],
      recent: recentCollections as ExploreCollection[],
      newCollections: newCollections as ExploreCollection[],
    };

    // If user is authenticated, fetch saved collections and stats
    if (userId) {
      try {
        const [savedCollections, savedCount] = await Promise.all([
          // Saved collections
          db
            .select(selectFields)
            .from(SavedCollectionsTable)
            .innerJoin(
              CollectionsTable,
              eq(SavedCollectionsTable.collectionId, CollectionsTable.id)
            )
            .leftJoin(UsersTable, eq(CollectionsTable.userId, UsersTable.id))
            .where(eq(SavedCollectionsTable.userId, userId))
            .orderBy(desc(CollectionsTable.updatedAt))
            .limit(5),

          // Count of saved collections
          db
            .select({ count: sql<number>`count(*)` })
            .from(SavedCollectionsTable)
            .where(eq(SavedCollectionsTable.userId, userId))
            .then((result) => result[0].count),
        ]);

        response.savedCollections = savedCollections as ExploreCollection[];
        response.userStats = {
          totalSavedCollections: savedCount,
        };
      } catch (error) {
        // Don't fail the entire request if saved collections fail
        console.warn("Failed to fetch saved collections:", error);
      }
    }

    return { success: true, data: response };
  } catch (error) {
    console.error("Error fetching explore data:", error);
    return { error: "Failed to fetch explore data" };
  }
}
