"use server";

import { db } from "@/db";
import { CollectionsTable } from "@/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import {
  checkRateLimit,
  getClientIdFromHeaders,
  rateLimiters,
} from "@/lib/ratelimit";
import { FrontendCollectionSchema } from "@/types/types";

export async function ChangeCollectionAction(
  collectionId: string,
  newName: string
) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not found" };
  }

  const identifier = await getClientIdFromHeaders(userId);
  const rateLimitResult = await checkRateLimit(
    rateLimiters.changeCollectionNameLimiter,
    identifier,
    "Too many requests to change collection name. Please try again later."
  );
  if (!rateLimitResult.success) {
    const retryAfter = rateLimitResult.retryAfter ?? 60;
    return { error: rateLimitResult.error, retryAfter };
  }

  if (!collectionId) {
    return { error: "Collection Id is required" };
  }

  // Validate the new name using schema
  const validationResult = FrontendCollectionSchema.safeParse({
    title: newName,
    description: "", // Only validating title here
  });

  if (!validationResult.success) {
    const errorMessage =
      validationResult.error.errors.find((e) => e.path.includes("title"))
        ?.message || "Invalid collection name";
    return { error: errorMessage };
  }

  const collection = await db
    .update(CollectionsTable)
    .set({
      title: newName,
    })
    .where(eq(CollectionsTable.id, collectionId))
    .returning();

  return { success: true, data: collection[0].title };
}
