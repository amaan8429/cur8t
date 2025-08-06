'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { FavoritesTable } from '@/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import {
  checkRateLimit,
  getClientIdFromHeaders,
  rateLimiters,
} from '@/lib/ratelimit';

export async function updateFavorite(favoriteId: string, title: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error('Unauthorized');
    }

    // Apply rate limiting
    const identifier = await getClientIdFromHeaders(userId);
    const rateLimitResult = await checkRateLimit(
      rateLimiters.updateFavoriteLimiter,
      identifier,
      'Too many requests to update favorites. Please try again later.'
    );
    if (!rateLimitResult.success) {
      const retryAfter = rateLimitResult.retryAfter ?? 60;
      return { error: rateLimitResult.error, retryAfter };
    }

    // Update the favorite (only if it belongs to the user)
    const updatedFavorites = await db
      .update(FavoritesTable)
      .set({
        title: title.trim(),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(FavoritesTable.id, favoriteId),
          eq(FavoritesTable.userId, userId)
        )
      )
      .returning();

    if (updatedFavorites.length === 0) {
      throw new Error(
        "Favorite not found or you don't have permission to update it"
      );
    }

    revalidatePath('/settings');
    revalidatePath('/dashboard');

    return { success: true, data: updatedFavorites[0] };
  } catch (error) {
    console.error('Error updating favorite:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to update favorite',
    };
  }
}
