"use server";

import { db } from "@/db";
import { auth } from "@clerk/nextjs/server";

export async function getLinks(linkCollectionId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  const links = await db.query.linkTable.findMany({
    with: {
      linkCollectionId,
    },
  });

  return links;
}
