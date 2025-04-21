"use server";

import { db } from "@/db";
import { totalLinksCount } from "@/lib/totalLinksCount";
import { CollectionsTable, LinksTable } from "@/schema";
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
    .insert(LinksTable)
    .values({
      title: data.title,
      url: data.url,
      linkCollectionId: collectionId,
      userId,
    })
    .returning();

  const totalLinks = await totalLinksCount({
    userId,
    collectionId,
  });

  await db
    .update(CollectionsTable)
    .set({
      totalLinks: totalLinks + 1,
    })
    .where(
      and(
        eq(CollectionsTable.userId, userId),
        eq(CollectionsTable.id, collectionId)
      )
    );

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

  // Retrieve the link's collectionId before deleting it
  const link = await db
    .select({ linkCollectionId: LinksTable.linkCollectionId })
    .from(LinksTable)
    .where(and(eq(LinksTable.id, id), eq(LinksTable.userId, userId)))
    .limit(1);

  if (!link || !link[0]?.linkCollectionId) {
    console.error("Invalid collectionId for link:", id);
    return { error: "Invalid collectionId" };
  }

  const collectionId = link[0].linkCollectionId;

  // Delete the link
  const deletedLink = await db
    .delete(LinksTable)
    .where(and(eq(LinksTable.id, id), eq(LinksTable.userId, userId)));

  const totalLinks = await totalLinksCount({
    userId,
    collectionId,
  });

  await db
    .update(CollectionsTable)
    .set({
      totalLinks: totalLinks - 1,
    })
    .where(
      and(
        eq(CollectionsTable.userId, userId),
        eq(CollectionsTable.id, collectionId)
      )
    );

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
      .update(LinksTable)
      .set({
        title: data.title,
        url: data.url,
      })
      .where(and(eq(LinksTable.id, id), eq(LinksTable.userId, userId)))
      .returning();

    console.log("Link updated:", updatedLink);

    return { success: true, data: updatedLink };
  } catch (error) {
    console.error("Failed to update link:", error);
    return { error: "Failed to update" };
  }
}
