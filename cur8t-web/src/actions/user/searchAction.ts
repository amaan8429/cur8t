"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { CollectionsTable, LinksTable } from "@/schema";
import { eq, and, or, ilike, sql, inArray } from "drizzle-orm";

export interface SearchResult {
  id: string;
  title: string;
  type: "collection" | "link";
  description?: string;
  url?: string;
  collectionTitle?: string;
}

export async function searchAction(query: string): Promise<SearchResult[]> {
  try {
    const { userId } = await auth();

    if (!userId || !query.trim()) {
      return [];
    }

    const searchTerm = `%${query.trim()}%`;

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
      .limit(15);

    // Get collection titles for links
    const collectionIds = [
      ...new Set(links.map((link) => link.collectionId).filter(Boolean)),
    ];
    const collectionTitles = new Map<string, string>();

    if (collectionIds.length > 0) {
      const collectionsForLinks = await db
        .select({
          id: CollectionsTable.id,
          title: CollectionsTable.title,
        })
        .from(CollectionsTable)
        .where(
          and(
            eq(CollectionsTable.userId, userId),
            inArray(CollectionsTable.id, collectionIds)
          )
        );

      collectionsForLinks.forEach((collection) => {
        collectionTitles.set(collection.id, collection.title);
      });
    }

    const results: SearchResult[] = [
      ...collections.map((collection) => ({
        id: collection.id,
        title: collection.title,
        type: "collection" as const,
        description: collection.description || undefined,
      })),
      ...links.map((link) => ({
        id: link.id,
        title: link.title,
        type: "link" as const,
        url: link.url,
        collectionTitle: link.collectionId
          ? collectionTitles.get(link.collectionId)
          : undefined,
      })),
    ];

    return results;
  } catch (error) {
    console.error("Error searching:", error);
    return [];
  }
}
