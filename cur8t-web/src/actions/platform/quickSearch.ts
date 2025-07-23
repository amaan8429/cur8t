"use server";

import { db } from "@/db";
import { CollectionsTable, UsersTable } from "@/schema";
import { eq, ilike, or, and } from "drizzle-orm";

export async function quickSearch(query: string) {
  try {
    if (!query || query.trim().length < 2) {
      return {
        success: true,
        data: {
          collections: [],
          users: [],
        },
      };
    }

    const searchTerm = `%${query.trim()}%`;

    // Search collections
    const collections = await db
      .select({
        id: CollectionsTable.id,
        title: CollectionsTable.title,
        author: UsersTable.name,
        likes: CollectionsTable.likes,
        description: CollectionsTable.description,
        totalLinks: CollectionsTable.totalLinks,
        visibility: CollectionsTable.visibility,
        updatedAt: CollectionsTable.updatedAt,
      })
      .from(CollectionsTable)
      .leftJoin(UsersTable, eq(CollectionsTable.userId, UsersTable.id))
      .where(
        and(
          or(
            ilike(CollectionsTable.title, searchTerm),
            ilike(CollectionsTable.description, searchTerm),
            ilike(UsersTable.name, searchTerm)
          ),
          eq(CollectionsTable.visibility, "public")
        )
      )
      .limit(8);

    // Search users
    const users = await db
      .select({
        id: UsersTable.id,
        name: UsersTable.name,
        username: UsersTable.username,
        totalCollections: UsersTable.totalCollections,
      })
      .from(UsersTable)
      .where(
        or(
          ilike(UsersTable.name, searchTerm),
          ilike(UsersTable.username, searchTerm)
        )
      )
      .limit(6);

    return {
      success: true,
      data: {
        collections,
        users: users.filter((user) => user.username), // Only return users with usernames
      },
    };
  } catch (error) {
    console.error("Error in quick search:", error);
    return {
      error: "Failed to perform search",
    };
  }
}
