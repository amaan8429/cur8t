"use server";

import { db } from "@/db";
import { CollectionsTable } from "@/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

export async function getProtectedCollectionsAction() {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not found" };
  }

  const collections = await db
    .select()
    .from(CollectionsTable)
    .where(
      and(
        eq(CollectionsTable.userId, userId),
        eq(CollectionsTable.visibility, "protected")
      )
    );

  return { sucesss: true, data: collections };
}
