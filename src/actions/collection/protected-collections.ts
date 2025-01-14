"use server";

import { db } from "@/db";
import { linkCollectionTable } from "@/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

export async function getProtectedCollectionsAction() {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not found" };
  }

  const collections = await db
    .select()
    .from(linkCollectionTable)
    .where(
      and(
        eq(linkCollectionTable.userId, userId),
        eq(linkCollectionTable.visibility, "protected")
      )
    );

  return { sucesss: true, data: collections };
}
