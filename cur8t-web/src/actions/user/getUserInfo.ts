"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { UsersTable } from "@/schema";
import { eq } from "drizzle-orm";
import {
  checkRateLimit,
  getClientIdFromHeaders,
  rateLimiters,
} from "@/lib/ratelimit";

export async function getUserInfoAction() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return null;
    }

    const identifier = await getClientIdFromHeaders(userId);
    const rateLimitResult = await checkRateLimit(
      rateLimiters.getUserInfoLimiter,
      identifier,
      "Too many requests to get user info. Please try again later."
    );
    if (!rateLimitResult.success) {
      const retryAfter = rateLimitResult.retryAfter ?? 60;
      return { error: rateLimitResult.error, retryAfter };
    }

    const users = await db
      .select()
      .from(UsersTable)
      .where(eq(UsersTable.id, userId))
      .limit(1);

    return users[0] || null;
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
}
