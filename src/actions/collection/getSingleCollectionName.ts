"use server";

import { db } from "@/db";
import { CollectionsTable } from "@/schema";
import { eq } from "drizzle-orm";

export async function getSingleCollectionNameAction(collectionId: string) {
  const collection = await db
    .select()
    .from(CollectionsTable)
    .where(eq(CollectionsTable.id, collectionId));

  console.log("Collection name:", collection[0].title);

  return collection[0].title;
}
