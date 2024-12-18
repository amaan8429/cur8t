"use server";

import { db } from "@/db";
import { linkCollectionTable } from "@/schema";
import { eq } from "drizzle-orm";

export async function getSingleCollectionName(collectionId: string) {
  const collection = await db
    .select()
    .from(linkCollectionTable)
    .where(eq(linkCollectionTable.id, collectionId));

  console.log("Collection name:", collection[0].name);

  return collection[0].name;
}
