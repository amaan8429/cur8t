'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { FavoritesTable } from '@/schema';
import { revalidatePath } from 'next/cache';
import { eq, and } from 'drizzle-orm';
import {
  checkRateLimit,
  getClientIdFromHeaders,
  rateLimiters,
} from '@/lib/ratelimit';

export async function createFavorite(title: string, url: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error('Unauthorized');
    }

    // Apply rate limiting
    const identifier = await getClientIdFromHeaders(userId);
    const rateLimitResult = await checkRateLimit(
      rateLimiters.createFavoriteLimiter,
      identifier,
      'Too many requests to create favorites. Please try again later.'
    );
    if (!rateLimitResult.success) {
      const retryAfter = rateLimitResult.retryAfter ?? 60;
      return { error: rateLimitResult.error, retryAfter };
    }

    // Validate URL format
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      throw new Error('Invalid URL format');
    }

    // Check if favorite already exists for this user and URL
    const existingFavorite = await db
      .select()
      .from(FavoritesTable)
      .where(
        and(eq(FavoritesTable.userId, userId), eq(FavoritesTable.url, url))
      )
      .limit(1);

    if (existingFavorite.length > 0) {
      throw new Error('This URL is already in your favorites');
    }

    // Create new favorite
    const [newFavorite] = await db
      .insert(FavoritesTable)
      .values({
        title: title.trim(),
        url: url.trim(),
        userId: userId,
      })
      .returning();

    revalidatePath('/settings');
    revalidatePath('/dashboard');

    return { success: true, data: newFavorite };
  } catch (error) {
    console.error('Error creating favorite:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to create favorite',
    };
  }
}
