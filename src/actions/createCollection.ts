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
    name: collectionName,
    userId: userId,
    url: "",
  };

  const createdCollection = await db
    .insert(linkCollectionTable)
    .values(collection);

  console.log("Collection created:", createdCollection);

  return { success: true, data: createdCollection };
}
