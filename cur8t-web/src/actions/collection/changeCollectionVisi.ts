"use server";

import { db } from "@/db";
import { CollectionsTable } from "@/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { checkRateLimit, getClientIdFromHeaders, rateLimiters } from "@/lib/ratelimit";

export async function ChangeCollectionVisibilityAction(
  collectionId: string,
  visibility: string,
  sharedEmails?: string[]
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const identifier = await getClientIdFromHeaders(userId);
  const rateLimitResult = await checkRateLimit(
    rateLimiters.changeCollectionVisibilityLimiter,
    identifier,
    "Too many requests to change collection visibility. Please try again later."
  );
  if (!rateLimitResult.success) {
    const retryAfter = rateLimitResult.retryAfter ?? 60;
    return { error: rateLimitResult.error, retryAfter };
  }

  if (!collectionId) {
    throw new Error("Collection ID is required");
  }

  const targetCollection = await db
    .update(CollectionsTable)
    .set({
      visibility: visibility,
      sharedEmails: visibility === "protected" ? sharedEmails : [],
    })
    .where(
      and(
        eq(CollectionsTable.userId, userId),
        eq(CollectionsTable.id, collectionId)
      )
    );

  if (!targetCollection) {
    return {
      error: "Collection not found",
    };
  }

  return {
    success: true,
  };
}
