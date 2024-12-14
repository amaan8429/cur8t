"use server";

import { db } from "@/db";
import { linkTable } from "@/schema";
import { auth } from "@clerk/nextjs/server";

export async function createLink(
  linkCollectionId: string,
  linkName: string,
  linkUrl: string
) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not found" };
  }

  if (!linkCollectionId) {
    return { error: "Link collection ID is required" };
  }
  if (!linkName) {
    return { error: "Link name is required" };
  }

  if (!linkUrl) {
    return { error: "Link URL is required" };
  }

  const link = {
    title: linkName,
    url: linkUrl,
    linkCollectionId,
    userId,
  };

  const createdLink = await db.insert(linkTable).values(link);

  console.log("Link created:", createdLink);

  return { success: true, data: createdLink };
}
