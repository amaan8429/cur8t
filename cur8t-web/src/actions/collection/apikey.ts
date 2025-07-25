"use server";

import { db } from "@/db";
import {
  checkRateLimit,
  getClientIdFromHeaders,
  rateLimiters,
} from "@/lib/ratelimit";
import { APIKeysTable, UsersTable } from "@/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

function generateKey() {
  const key =
    "cur8t_api_" +
    Array.from(crypto.getRandomValues(new Uint8Array(32)))
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

  const identifier = await getClientIdFromHeaders(userId);
  const rateLimitResult = await checkRateLimit(
    rateLimiters.createApiKeyLimiter,
    identifier,
    "Too many requests to create API key. Please try again later."
  );
  if (!rateLimitResult.success) {
    const retryAfter = rateLimitResult.retryAfter ?? 60;
    return { error: rateLimitResult.error, retryAfter };
  }

  const userAPICount = await db
    .select({
      APIKeysCount: UsersTable.APIKeysCount,
    })
    .from(UsersTable)
    .where(eq(UsersTable.id, userId));

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
    .update(UsersTable)
    .set({
      APIKeysCount: userAPICount[0].APIKeysCount + 1,
    })
    .where(eq(UsersTable.id, userId));

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

  const identifier = await getClientIdFromHeaders(userId);

  const rateLimitResult = await checkRateLimit(
    rateLimiters.deleteApiKeyLimiter,
    identifier,
    "Too many requests to delete API key. Please try again later."
  );
  if (!rateLimitResult.success) {
    const retryAfter = rateLimitResult.retryAfter ?? 60;
    return { error: rateLimitResult.error, retryAfter };
  }

  const userAPICount = await db
    .select({
      APIKeysCount: UsersTable.APIKeysCount,
    })
    .from(UsersTable)
    .where(eq(UsersTable.id, userId));

  if (userAPICount[0].APIKeysCount <= 0) {
    return { error: "You do not have any API keys" };
  }

  await db.delete(APIKeysTable).where(eq(APIKeysTable.key, key)).returning();
  await db
    .update(UsersTable)
    .set({
      APIKeysCount: userAPICount[0].APIKeysCount - 1,
    })
    .where(eq(UsersTable.id, userId));

  return { success: true };
}

export async function GetAPIKeys() {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not found" };
  }

  const identifier = await getClientIdFromHeaders(userId);

  const rateLimitResult = await checkRateLimit(
    rateLimiters.getApiKeysLimiter,
    identifier,
    "Too many requests to get API keys. Please try again later."
  );
  if (!rateLimitResult.success) {
    const retryAfter = rateLimitResult.retryAfter ?? 60;
    return { error: rateLimitResult.error, retryAfter };
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
