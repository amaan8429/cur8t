"use server";

import { db } from "@/db";
import { linkCollectionTable } from "@/schema";
import { eq } from "drizzle-orm";

async function getExistingEmails(collectionId: string) {
  const data = await db
    .select({
      sharedEmails: linkCollectionTable.sharedEmails,
    })
    .from(linkCollectionTable)
    .where(eq(linkCollectionTable.id, collectionId));

  const existingEmails = data[0]?.sharedEmails;

  if (!existingEmails) {
    return [];
  }

  return existingEmails;
}

export async function addEmails(collectionId: string, newEmail: string) {
  //also check if the email is valid
  if (!collectionId || !newEmail) {
    return "Collection id and email are required";
  }

  const existingEmails = await getExistingEmails(collectionId);

  await db
    .update(linkCollectionTable)
    .set({
      sharedEmails: [...existingEmails, newEmail],
    })
    .where(eq(linkCollectionTable.id, collectionId));
}

// function to remove emails from a collection
export async function removeEmails(
  collectionId: string,
  emailToRemove: string
) {
  //also check if the email is valid
  if (!collectionId || !emailToRemove) {
    return "Collection id and email are required";
  }

  const existingEmails = await getExistingEmails(collectionId);

  await db
    .update(linkCollectionTable)
    .set({
      sharedEmails: existingEmails.filter((email) => email !== emailToRemove),
    })
    .where(eq(linkCollectionTable.id, collectionId));

  return { success: true, message: "Email removed successfully" };
}

async function fetchSharedEmails(collectionId: string) {
  const data = await db
    .select({
      sharedEmails: linkCollectionTable.sharedEmails,
    })
    .from(linkCollectionTable)
    .where(eq(linkCollectionTable.id, collectionId));

  const sharedEmailsEmails = data[0]?.sharedEmails;

  if (!sharedEmailsEmails) {
    return [];
  }

  return sharedEmailsEmails;
}
