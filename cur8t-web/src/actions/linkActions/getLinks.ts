"use server";

import { db } from "@/db";
import { LinksTable } from "@/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

export async function getLinksAction(linkCollectionId: string) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not found" };
  }

  if (!linkCollectionId) {
    return { error: "Link collection ID is required" };
  }

  const links = await db
    .select()
    .from(LinksTable)
    .where(
      and(
        eq(LinksTable.linkCollectionId, linkCollectionId),
        eq(LinksTable.userId, userId)
      )
    );

  return {
    success: true,
    data: links,
  };
}
