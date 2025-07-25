"use server";

import { db } from "@/db";
import { totalLinksCount } from "@/lib/totalLinksCount";
import { CollectionsTable, LinksTable } from "@/schema";
import { extractTitleFromUrl, generateFallbackTitle } from "@/lib/extractTitle";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  checkRateLimit,
  getClientIdFromHeaders,
  rateLimiters,
} from "@/lib/ratelimit";

interface AddLinkData {
  title?: string;
  url: string;
}

export async function addLinkAction(data: AddLinkData, collectionId: string) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not found" };
  }

  const identifier = await getClientIdFromHeaders(userId);
  const rateLimitResult = await checkRateLimit(
    rateLimiters.createLinkLimiter,
    identifier,
    "Too many requests to add link. Please try again later."
  );
  if (!rateLimitResult.success) {
    const retryAfter = rateLimitResult.retryAfter ?? 60;
    return { error: rateLimitResult.error, retryAfter };
  }

  if (!collectionId) {
    return { error: "Collection Id is required" };
  }

  if (!data.url) {
    return { error: "URL is required" };
  }

  // Extract title if not provided
  let finalTitle: string = data.title?.trim() || "";
  if (!finalTitle) {
    try {
      finalTitle = await extractTitleFromUrl(data.url);
    } catch (error) {
      console.warn("Failed to extract title, using fallback:", error);
      finalTitle = generateFallbackTitle(data.url);
    }
  }

  const newLink = await db
    .insert(LinksTable)
    .values({
      title: finalTitle,
      url: data.url,
      linkCollectionId: collectionId,
      userId,
    })
    .returning();

  const totalLinks = await totalLinksCount({
    userId,
    collectionId,
  });

  await db
    .update(CollectionsTable)
    .set({
      totalLinks: totalLinks + 1,
    })
    .where(
      and(
        eq(CollectionsTable.userId, userId),
        eq(CollectionsTable.id, collectionId)
      )
    );

  return { success: true, data: newLink[0] };
}

export async function deleteLinkAction(id: string) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not found" };
  }

  const identifier = await getClientIdFromHeaders(userId);
  const rateLimitResult = await checkRateLimit(
    rateLimiters.deleteLinkLimiter,
    identifier,
    "Too many requests to delete link. Please try again later."
  );
  if (!rateLimitResult.success) {
    const retryAfter = rateLimitResult.retryAfter ?? 60;
    return { error: rateLimitResult.error, retryAfter };
  }

  if (!id) {
    return { error: "Link ID is required" };
  }

  // Retrieve the link's collectionId before deleting it
  const link = await db
    .select({ linkCollectionId: LinksTable.linkCollectionId })
    .from(LinksTable)
    .where(and(eq(LinksTable.id, id), eq(LinksTable.userId, userId)))
    .limit(1);

  if (!link || !link[0]?.linkCollectionId) {
    console.error("Invalid collectionId for link:", id);
    return { error: "Invalid collectionId" };
  }

  const collectionId = link[0].linkCollectionId;

  // Delete the link
  const deletedLink = await db
    .delete(LinksTable)
    .where(and(eq(LinksTable.id, id), eq(LinksTable.userId, userId)));

  const totalLinks = await totalLinksCount({
    userId,
    collectionId,
  });

  await db
    .update(CollectionsTable)
    .set({
      totalLinks: totalLinks - 1,
    })
    .where(
      and(
        eq(CollectionsTable.userId, userId),
        eq(CollectionsTable.id, collectionId)
      )
    );

  console.log("Link deleted:", deletedLink);

  return { success: true };
}

export async function updateLinkAction(
  id: string,
  data: {
    title?: string;
    url?: string;
  }
) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not found" };
  }

  const identifier = await getClientIdFromHeaders(userId);
  const rateLimitResult = await checkRateLimit(
    rateLimiters.userUpdateLimiter, // Using user update limiter for modification operations
    identifier,
    "Too many requests to update link. Please try again later."
  );
  if (!rateLimitResult.success) {
    const retryAfter = rateLimitResult.retryAfter ?? 60;
    return { error: rateLimitResult.error, retryAfter };
  }

  if (!id) {
    return { error: "Link ID is required" };
  }

  try {
    const updatedLink = await db
      .update(LinksTable)
      .set({
        title: data.title,
        url: data.url,
      })
      .where(and(eq(LinksTable.id, id), eq(LinksTable.userId, userId)))
      .returning();

    console.log("Link updated:", updatedLink);

    return { success: true, data: updatedLink };
  } catch (error) {
    console.error("Failed to update link:", error);
    return { error: "Failed to update" };
  }
}
