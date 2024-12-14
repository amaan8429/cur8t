"use server";

import { db } from "@/db";
import { linkCollectionTable } from "@/schema";
import { auth } from "@clerk/nextjs/server";

export async function createCollection(collectionName: string) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not found" };
  }

  if (!collectionName) {
    return { error: "Collection name is required" };
  }

  const collection = {
    id: Date.now().toString(),
    name: collectionName,
    userId: userId,
    url: "",
  };

  await db.insert(linkCollectionTable).values(collection);

  console.log("Collection created:", collection);

  return { success: true, data: collection };
}
