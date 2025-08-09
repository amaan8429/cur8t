'use server';

import { db } from '@/db';
import {
  checkRateLimit,
  getClientIdFromHeaders,
  rateLimiters,
} from '@/lib/ratelimit';
import { APIKeysTable, UsersTable } from '@/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';

// HMAC-SHA256 hashing with pepper for enhanced security
async function hashKeyWithPepper(key: string): Promise<string> {
  const pepper = process.env.API_KEY_PEPPER;

  if (!pepper) {
    throw new Error('API_KEY_PEPPER environment variable is not set');
  }

  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);
  const pepperData = encoder.encode(pepper);

  // Import the pepper as a crypto key for HMAC
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    pepperData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  // Sign the API key with the pepper
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, keyData);

  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function generateToken(): string {
  const token =
    'cur8t_api_' +
    Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  return token;
}

export async function CreateApiKey(name: string) {
  if (!name) {
    return { error: 'Name is required' };
  }
  const { userId } = await auth();

  if (!userId) {
    return { error: 'User not found' };
  }

  const identifier = await getClientIdFromHeaders(userId);
  const rateLimitResult = await checkRateLimit(
    rateLimiters.createApiKeyLimiter,
    identifier,
    'Too many requests to create API key. Please try again later.'
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
    return { error: 'You have reached the maximum number of API keys' };
  }

  // Generate a new API token (plaintext) and store only its HMAC hash in DB
  const plaintextToken = generateToken();
  const tokenHash = await hashKeyWithPepper(plaintextToken);

  const inserted = await db
    .insert(APIKeysTable)
    .values({
      name,
      userId,
      // Store HMAC hash in the existing `key` column
      key: tokenHash,
    })
    .returning();

  await db
    .update(UsersTable)
    .set({
      APIKeysCount: userAPICount[0].APIKeysCount + 1,
    })
    .where(eq(UsersTable.id, userId));

  // Return the plaintext token ONCE to the client; do not store it
  return {
    success: true,
    data: {
      id: inserted[0].id,
      name: inserted[0].name,
      key: plaintextToken,
      createdAt: inserted[0].createdAt,
    },
  };
}

export async function DeleteApiKey(id: string) {
  const { userId } = await auth();

  if (!userId) {
    return { error: 'User not found' };
  }

  if (!id) {
    return { error: 'Key ID is required' };
  }

  const identifier = await getClientIdFromHeaders(userId);

  const rateLimitResult = await checkRateLimit(
    rateLimiters.deleteApiKeyLimiter,
    identifier,
    'Too many requests to delete API key. Please try again later.'
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
    return { error: 'You do not have any API keys' };
  }

  await db.delete(APIKeysTable).where(eq(APIKeysTable.id, id)).returning();
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
    return { error: 'User not found' };
  }

  const identifier = await getClientIdFromHeaders(userId);

  const rateLimitResult = await checkRateLimit(
    rateLimiters.getApiKeysLimiter,
    identifier,
    'Too many requests to get API keys. Please try again later.'
  );
  if (!rateLimitResult.success) {
    const retryAfter = rateLimitResult.retryAfter ?? 60;
    return { error: rateLimitResult.error, retryAfter };
  }

  const keys = await db
    .select({
      id: APIKeysTable.id,
      name: APIKeysTable.name,
      // Do NOT return the stored hash or plaintext key
      createdAt: APIKeysTable.createdAt,
    })
    .from(APIKeysTable)
    .where(eq(APIKeysTable.userId, userId));

  return { success: true, data: keys };
}
