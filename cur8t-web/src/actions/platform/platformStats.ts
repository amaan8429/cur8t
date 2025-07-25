"use server";

import { db } from "@/db";
import {
  CollectionsTable,
  UsersTable,
  LinksTable,
  SavedCollectionsTable,
} from "@/schema";
import { eq, gte, sql } from "drizzle-orm";
import {
  checkRateLimit,
  getClientIdFromHeaders,
  rateLimiters,
} from "@/lib/ratelimit";

export async function getPlatformStats() {
  // IP-based rate limiting for public platform endpoint
  const identifier = await getClientIdFromHeaders(); // no userId, uses IP
  const rateLimitResult = await checkRateLimit(
    rateLimiters.getPlatformStatsLimiter,
    identifier,
    "Too many requests to get platform stats. Please try again later."
  );
  if (!rateLimitResult.success) {
    const retryAfter = rateLimitResult.retryAfter ?? 60;
    return { error: rateLimitResult.error, retryAfter };
  }

  try {
    // Get total collections count
    const totalCollectionsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(CollectionsTable);

    // Get total public collections count
    const publicCollectionsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(CollectionsTable)
      .where(eq(CollectionsTable.visibility, "public"));

    // Get total users count
    const totalUsersResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(UsersTable);

    // Get total links count (sum of totalLinks from all collections)
    const totalLinksResult = await db
      .select({
        sum: sql<number>`COALESCE(sum(${CollectionsTable.totalLinks}), 0)`,
      })
      .from(CollectionsTable);

    // Get collections created this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const collectionsThisWeekResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(CollectionsTable)
      .where(gte(CollectionsTable.createdAt, oneWeekAgo));

    // Get most liked collection count
    const mostLikedResult = await db
      .select({ maxLikes: sql<number>`MAX(${CollectionsTable.likes})` })
      .from(CollectionsTable)
      .where(eq(CollectionsTable.visibility, "public"));

    // Get total saves count
    const totalSavesResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(SavedCollectionsTable);

    return {
      success: true,
      data: {
        totalCollections: totalCollectionsResult[0].count,
        publicCollections: publicCollectionsResult[0].count,
        totalUsers: totalUsersResult[0].count,
        totalLinks: totalLinksResult[0].sum,
        collectionsThisWeek: collectionsThisWeekResult[0].count,
        mostLikedCollection: mostLikedResult[0].maxLikes || 0,
        totalSaves: totalSavesResult[0].count,
      },
    };
  } catch (error) {
    console.error("Error fetching platform stats:", error);
    return {
      error: "Failed to fetch platform statistics",
    };
  }
}
