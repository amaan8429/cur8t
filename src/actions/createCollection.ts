"use server";

import { db } from "@/db";
import { linkCollectionTable } from "@/schema";
import { auth } from "@clerk/nextjs/server";

export async function createCollection(collectionName: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  if (!collectionName) {
    throw new Error("Collection name is required");
  }

  await db.insert(linkCollectionTable).values({
    name: collectionName,
    userId: userId,
    url: "",
  });

  console.log("Collection created:", collectionName);

  return true;
}
