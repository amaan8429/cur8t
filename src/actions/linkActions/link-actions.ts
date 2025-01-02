"use server";

import { db } from "@/db";
import { linkTable } from "@/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

interface AddLinkData {
  title: string;
  url: string;
}

export async function addLinkAction(data: AddLinkData, collectionId: string) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not found" };
  }

  if (!collectionId) {
    return { error: "Collection Id is required" };
  }

  if (!data.title || !data.url) {
    return { error: "Title and URL are required" };
  }

  const newLink = await db
    .insert(linkTable)
    .values({
      title: data.title,
      url: data.url,
      linkCollectionId: collectionId,
      userId,
    })
    .returning();

  return { success: true, data: newLink[0] };
}

export async function deleteLinkAction(id: string) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not found" };
  }

  if (!id) {
    return { error: "Link ID is required" };
  }

  const deletedLink = await db
    .delete(linkTable)
    .where(and(eq(linkTable.id, id), eq(linkTable.userId, userId)));

  console.log("Link deleted:", deletedLink);

  return { success: true };
}

export async function updateLinkAction(
  id: string,
  data: {
    title?: string;
    url?: string;
  }
) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not found" };
  }

  if (!id) {
    return { error: "Link ID is required" };
  }

  try {
    const updatedLink = await db
      .update(linkTable)
      .set({
        title: data.title,
        url: data.url,
      })
      .where(and(eq(linkTable.id, id), eq(linkTable.userId, userId)))
      .returning();

    console.log("Link updated:", updatedLink);

    return { success: true, data: updatedLink };
  } catch (error) {
    console.error("Failed to update link:", error);
    return { error: "Failed to update" };
  }
}
