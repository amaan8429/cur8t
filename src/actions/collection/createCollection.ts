"use server";

import { db } from "@/db";
import { totalCollectionsCount } from "@/lib/totalCollectionCount";
import { CollectionsTable, UsersTable } from "@/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function createCollectionAction(
  collectionName: string,
  description: string,
  visiblity: string
) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not found" };
  }

  if (!collectionName) {
    return { error: "Collection name is required" };
  }

  if (!visiblity) {
    return { error: "Visibility is required" };
  }

  const author = await db
    .select({
      author: UsersTable.name,
    })
    .from(UsersTable)
    .where(eq(UsersTable.id, userId));

  const createdCollection = await db
    .insert(CollectionsTable)
    .values({
      title: collectionName,
      description: description,
      userId: userId,
      url: "",
      visibility: visiblity,
      author: author[0].author,
    })
    .returning();

  const totalCollections = await totalCollectionsCount({ userId });
  await db
    .update(UsersTable)
    .set({
      totalCollections: totalCollections + 1,
    })
    .where(eq(UsersTable.id, userId));

  console.log("Collection created:", createdCollection);

  return { success: true, data: createdCollection[0] };
}
