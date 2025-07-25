"use server";

import { db } from "@/db";
import { LinksTable } from "@/schema";
import { eq } from "drizzle-orm";
import {
  checkRateLimit,
  getClientIdFromHeaders,
  rateLimiters,
} from "@/lib/ratelimit";

export async function getCollectionLinksAction(linkCollectionId: string) {
  // IP-based rate limiting for public endpoint
  const identifier = await getClientIdFromHeaders(); // no userId, uses IP
  const rateLimitResult = await checkRateLimit(
    rateLimiters.getLinksLimiter,
    identifier,
    "Too many requests to get collection links. Please try again later."
  );
  if (!rateLimitResult.success) {
    const retryAfter = rateLimitResult.retryAfter ?? 60;
    return { error: rateLimitResult.error, retryAfter };
  }

  if (!linkCollectionId) {
    return { error: "Link collection ID is required" };
  }

  const links = await db
    .select()
    .from(LinksTable)
    .where(eq(LinksTable.linkCollectionId, linkCollectionId));

  return {
    success: true,
    data: links,
  };
}
