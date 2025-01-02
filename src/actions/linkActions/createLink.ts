"use server";

import { db } from "@/db";
import { linkTable } from "@/schema";
import { FrontendLinkSchema } from "@/types/types";
import { auth } from "@clerk/nextjs/server";

export async function createLinkAction(
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

  const parsedLink = FrontendLinkSchema.safeParse({
    title: linkName,
    url: linkUrl,
  });

  if (!parsedLink.success) {
    return {
      error: "Invalid link data",
    };
  }

  const link = {
    title: parsedLink.data.title,
    url: parsedLink.data.url,
    linkCollectionId,
    userId,
  };

  const createdLink = await db.insert(linkTable).values(link).returning();

  console.log("Link created:", createdLink);

  return { success: true, data: createdLink };
}
