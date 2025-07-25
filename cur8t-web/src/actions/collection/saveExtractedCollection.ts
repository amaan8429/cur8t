"use server";

import { db } from "@/db";
import { totalCollectionsCount } from "@/lib/totalCollectionCount";
import { totalLinksCount } from "@/lib/totalLinksCount";
import { CollectionsTable, LinksTable, UsersTable } from "@/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { checkRateLimit, getClientIdFromHeaders, rateLimiters } from "@/lib/ratelimit";

interface ExtractedLink {
  title: string;
  url: string;
  domain: string;
  description?: string;
}

interface SaveExtractedCollectionData {
  collection_name: string;
  extracted_links: ExtractedLink[];
  article_url?: string;
  article_title?: string;
}

export async function saveExtractedCollectionAction(
  data: SaveExtractedCollectionData
) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not found" };
  }

  const identifier = await getClientIdFromHeaders(userId);
  const rateLimitResult = await checkRateLimit(
    rateLimiters.saveExtractedCollectionLimiter,
    identifier,
    "Too many requests to save extracted collection. Please try again later."
  );
  if (!rateLimitResult.success) {
    const retryAfter = rateLimitResult.retryAfter ?? 60;
    return { error: rateLimitResult.error, retryAfter };
  }

  if (!data.collection_name?.trim()) {
    return { error: "Collection name is required" };
  }

  if (!data.extracted_links?.length) {
    return { error: "No links to save" };
  }

  try {
    // Create collection
    const createdCollection = await db
      .insert(CollectionsTable)
      .values({
        title: data.collection_name.trim(),
        description: data.article_title
          ? `Links extracted from: ${data.article_title}`
          : "Links extracted from article",
        userId: userId,
        url: data.article_url || "",
        visibility: "private", // Default to private
        totalLinks: data.extracted_links.length,
      })
      .returning();

    const collectionId = createdCollection[0].id;

    // Create all links in the collection
    const linkInserts = data.extracted_links.map((link) => ({
      title: link.title || `Link from ${link.domain}`,
      url: link.url,
      linkCollectionId: collectionId,
      userId: userId,
    }));

    const createdLinks = await db
      .insert(LinksTable)
      .values(linkInserts)
      .returning();

    // Update user's total collections count
    const totalCollections = await totalCollectionsCount({ userId });
    await db
      .update(UsersTable)
      .set({
        totalCollections: totalCollections + 1,
      })
      .where(eq(UsersTable.id, userId));

    console.log("Collection and links created:", {
      collection: createdCollection[0],
      linksCount: createdLinks.length,
    });

    return {
      success: true,
      data: {
        collection: createdCollection[0],
        links: createdLinks,
        totalLinks: createdLinks.length,
      },
    };
  } catch (error) {
    console.error("Error saving extracted collection:", error);
    return { error: "Failed to save collection. Please try again." };
  }
}
