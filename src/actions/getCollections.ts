"use server";

import { db } from "@/db";
import { auth } from "@clerk/nextjs/server";

export async function getCollections() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  const collections = await db.query.linkCollectionTable.findMany({
    with: {
      userId,
    },
  });

  return collections;
}
