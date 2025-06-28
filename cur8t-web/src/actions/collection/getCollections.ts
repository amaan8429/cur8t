"use server";

import { db } from "@/db";
import { auth } from "@clerk/nextjs/server";
import { CollectionsTable } from "@/schema";
import { and, eq } from "drizzle-orm";

export async function getCollectionsAction() {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not found" };
  }

  const collections = await db
    .select()
    .from(CollectionsTable)
    .where(and(eq(CollectionsTable.userId, userId)));

  console.log(collections);

  return { data: collections };
}
