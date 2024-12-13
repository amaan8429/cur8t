"use server";

import { db } from "@/db";
import { auth } from "@clerk/nextjs/server";
import { linkCollectionTable } from "@/schema";
import { and, eq } from "drizzle-orm";

export async function getCollections() {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not found" };
  }

  const collections = await db
    .select()
    .from(linkCollectionTable)
    .where(and(eq(linkCollectionTable.userId, userId)));

  console.log(collections);

  return collections;
}
