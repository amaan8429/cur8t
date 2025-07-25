"use server";

import { db } from "@/db";
import { CollectionsTable, UsersTable } from "@/schema";
import { eq, desc, sql, and } from "drizzle-orm";
import {
  checkRateLimit,
  getClientIdFromHeaders,
  rateLimiters,
} from "@/lib/ratelimit";

export async function getFeaturedUsers() {
  // IP-based rate limiting for public platform endpoint
  const identifier = await getClientIdFromHeaders(); // no userId, uses IP
  const rateLimitResult = await checkRateLimit(
    rateLimiters.getPlatformStatsLimiter,
    identifier,
    "Too many requests to get featured users. Please try again later."
  );
  if (!rateLimitResult.success) {
    const retryAfter = rateLimitResult.retryAfter ?? 60;
    return { error: rateLimitResult.error, retryAfter };
  }

  try {
    // Get users with the most public collections and total likes
    const featuredUsers = await db
      .select({
        id: UsersTable.id,
        name: UsersTable.name,
        username: UsersTable.username,
        totalCollections: UsersTable.totalCollections,
        publicCollections: sql<number>`COUNT(${CollectionsTable.id})`,
        totalLikes: sql<number>`SUM(${CollectionsTable.likes})`,
      })
      .from(UsersTable)
      .leftJoin(
        CollectionsTable,
        and(
          eq(UsersTable.id, CollectionsTable.userId),
          eq(CollectionsTable.visibility, "public")
        )
      )
      .where(eq(CollectionsTable.visibility, "public"))
      .groupBy(
        UsersTable.id,
        UsersTable.name,
        UsersTable.username,
        UsersTable.totalCollections
      )
      .having(sql`COUNT(${CollectionsTable.id}) > 0`)
      .orderBy(desc(sql`SUM(${CollectionsTable.likes})`))
      .limit(6);

    // Get top collections for each featured user
    const usersWithCollections = await Promise.all(
      featuredUsers.map(async (user) => {
        const topCollections = await db
          .select({
            id: CollectionsTable.id,
            title: CollectionsTable.title,
            description: CollectionsTable.description,
            likes: CollectionsTable.likes,
            totalLinks: CollectionsTable.totalLinks,
            updatedAt: CollectionsTable.updatedAt,
          })
          .from(CollectionsTable)
          .where(
            and(
              eq(CollectionsTable.userId, user.id),
              eq(CollectionsTable.visibility, "public")
            )
          )
          .orderBy(desc(CollectionsTable.likes))
          .limit(3);

        return {
          ...user,
          topCollections,
        };
      })
    );

    return {
      success: true,
      data: usersWithCollections.filter((user) => user.username), // Only users with usernames
    };
  } catch (error) {
    console.error("Error fetching featured users:", error);
    return {
      error: "Failed to fetch featured users",
    };
  }
}
