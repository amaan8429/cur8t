"use server";

import { db } from "@/db";
import { APIKeysTable, usersTable } from "@/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

function generateKey() {
  const key =
    "pk_" +
    Array.from(crypto.getRandomValues(new Uint8Array(24)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  return key;
}

export async function CreateApiKey(name: string) {
  if (!name) {
    return { error: "Name is required" };
  }
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not found" };
  }

  const userAPICount = await db
    .select({
      APIKeysCount: usersTable.APIKeysCount,
    })
    .from(usersTable)
    .where(eq(usersTable.id, userId));

  if (userAPICount[0].APIKeysCount >= 3) {
    return { error: "You have reached the maximum number of API keys" };
  }

  const key = await db
    .insert(APIKeysTable)
    .values({
      name: name,
      userId: userId,
      key: generateKey(),
    })
    .returning();

  await db
    .update(usersTable)
    .set({
      APIKeysCount: userAPICount[0].APIKeysCount + 1,
    })
    .where(eq(usersTable.id, userId));

  return { success: true, data: key[0] };
}

export async function DeleteApiKey(key: string) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not found" };
  }

  if (!key) {
    return { error: "Key ID is required" };
  }

  const userAPICount = await db
    .select({
      APIKeysCount: usersTable.APIKeysCount,
    })
    .from(usersTable)
    .where(eq(usersTable.id, userId));

  if (userAPICount[0].APIKeysCount <= 0) {
    return { error: "You do not have any API keys" };
  }

  await db.delete(APIKeysTable).where(eq(APIKeysTable.key, key)).returning();
  await db
    .update(usersTable)
    .set({
      APIKeysCount: userAPICount[0].APIKeysCount - 1,
    })
    .where(eq(usersTable.id, userId));

  return { success: true };
}

export async function GetAPIKeys() {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not found" };
  }

  const keys = await db
    .select({
      id: APIKeysTable.id,
      name: APIKeysTable.name,
      key: APIKeysTable.key,
      createdAt: APIKeysTable.createdAt,
    })
    .from(APIKeysTable)
    .where(eq(APIKeysTable.userId, userId));

  return { success: true, data: keys };
}
