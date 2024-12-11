"use server";

import { db } from "@/db";
import { linkTable } from "@/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

export async function getLinks(linkCollectionId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  if (!linkCollectionId) {
    throw new Error("Link collection ID is required");
  }

  const links = await db
    .select()
    .from(linkTable)
    .where(
      and(
        eq(linkTable.linkCollectionId, linkCollectionId),
        eq(linkTable.userId, userId)
      )
    );
  return links;
}
