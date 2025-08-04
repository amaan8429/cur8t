"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { FavoritesTable } from "@/schema";
import { desc, eq } from "drizzle-orm";
import {
  checkRateLimit,
  getClientIdFromHeaders,
  rateLimiters,
} from "@/lib/ratelimit";

export async function getFavorites() {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Apply rate limiting
    const identifier = await getClientIdFromHeaders(userId);
    const rateLimitResult = await checkRateLimit(
      rateLimiters.getFavoritesLimiter,
      identifier,
      "Too many requests to fetch favorites. Please try again later."
    );
    if (!rateLimitResult.success) {
      const retryAfter = rateLimitResult.retryAfter ?? 60;
      return { error: rateLimitResult.error, retryAfter };
    }

    const favorites = await db
      .select()
      .from(FavoritesTable)
      .where(eq(FavoritesTable.userId, userId))
      .orderBy(desc(FavoritesTable.createdAt));

    return { success: true, data: favorites };
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch favorites",
    };
  }
}
