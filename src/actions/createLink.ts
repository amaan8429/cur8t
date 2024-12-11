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
  if (!linkCollectionId) {
    throw new Error("Collection ID is required");
  }
  if (!linkName) {
    throw new Error("Link name is required");
  }

  if (!linkUrl) {
    throw new Error("Link URL is required");
  }

  await db.insert(linkTable).values({
    title: linkName,
    url: linkUrl,
    linkCollectionId,
  });

  console.log("Link created:", linkName);

  return true;
}
