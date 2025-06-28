"use server";

import { db } from "@/db";
import { LinksTable } from "@/schema";
import { eq } from "drizzle-orm";

export async function getCollectionLinksAction(linkCollectionId: string) {
  if (!linkCollectionId) {
    return { error: "Link collection ID is required" };
  }

  const links = await db
    .select()
    .from(LinksTable)
    .where(eq(LinksTable.linkCollectionId, linkCollectionId));

  return {
    success: true,
    data: links,
  };
}
