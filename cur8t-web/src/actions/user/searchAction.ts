"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { CollectionsTable, LinksTable } from "@/schema";
import { eq, and, or, ilike, sql, inArray } from "drizzle-orm";
import { checkRateLimit, getClientIdFromHeaders, rateLimiters } from "@/lib/ratelimit";

export interface SearchResult {
  id: string;
  title: string;
  type: "collection" | "link";
  description?: string;
  url?: string;
  collectionTitle?: string;
}

export async function searchAction(query: string): Promise<SearchResult[]> {
  const { userId } = await auth();

  if (!userId) {
    return [];
  }

  const identifier = await getClientIdFromHeaders(userId);
  const rateLimitResult = await checkRateLimit(
    rateLimiters.searchLimiter,
    identifier,
    "Too many search requests. Please try again later."
  );
  if (!rateLimitResult.success) {
    throw new Error(rateLimitResult.error);
  }

  if (!query || query.trim().length === 0) {
    return [];
  }

  const searchTerm = `%${query.toLowerCase()}%`;

  try {
    // Search collections
    const collections = await db
      .select({
        id: CollectionsTable.id,
        title: CollectionsTable.title,
        description: CollectionsTable.description,
      })
      .from(CollectionsTable)
      .where(
        and(
          eq(CollectionsTable.userId, userId),
          or(
            ilike(CollectionsTable.title, searchTerm),
            ilike(CollectionsTable.description, searchTerm)
          )
        )
      )
      .limit(10);

    // Search links
    const links = await db
      .select({
        id: LinksTable.id,
        title: LinksTable.title,
        url: LinksTable.url,
        collectionId: LinksTable.linkCollectionId,
      })
      .from(LinksTable)
      .where(
        and(
          eq(LinksTable.userId, userId),
          or(
            ilike(LinksTable.title, searchTerm),
            ilike(LinksTable.url, searchTerm)
          )
        )
      )
      .limit(10);

    // Get collection titles for links
    const collectionIds = links.map((link) => link.collectionId);
    const collectionTitles =
      collectionIds.length > 0
        ? await db
            .select({
              id: CollectionsTable.id,
              title: CollectionsTable.title,
            })
            .from(CollectionsTable)
            .where(inArray(CollectionsTable.id, collectionIds))
        : [];

    const collectionTitleMap = new Map(
      collectionTitles.map((col) => [col.id, col.title])
    );

    // Combine and format results
    const results: SearchResult[] = [
      ...collections.map((col) => ({
        id: col.id,
        title: col.title,
        type: "collection" as const,
        description: col.description || undefined,
      })),
      ...links.map((link) => ({
        id: link.id,
        title: link.title,
        type: "link" as const,
        url: link.url,
        collectionTitle: collectionTitleMap.get(link.collectionId),
      })),
    ];

    return results;
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
}
