"use server";

import { db } from "@/db";
import { auth } from "@clerk/nextjs/server";
import { CollectionsTable } from "@/schema";
import { and, eq } from "drizzle-orm";
import {
  checkRateLimit,
  getClientIdFromHeaders,
  rateLimiters,
} from "@/lib/ratelimit";

export async function getCollectionsAction() {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not found" };
  }

  const identifier = await getClientIdFromHeaders(userId);
  const rateLimitResult = await checkRateLimit(
    rateLimiters.getCollectionsLimiter,
    identifier,
    "Too many requests to get collections. Please try again later."
  );
  if (!rateLimitResult.success) {
    const retryAfter = rateLimitResult.retryAfter ?? 60;
    return { error: rateLimitResult.error, retryAfter };
  }

  const collections = await db
    .select()
    .from(CollectionsTable)
    .where(and(eq(CollectionsTable.userId, userId)));

  console.log(collections);

  return { data: collections };
}
