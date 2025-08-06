'use server';

import { db } from '@/db';
import { CollectionsTable, SavedCollectionsTable, UsersTable } from '@/schema';
import { eq, and, ne, inArray, desc } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';
import {
  checkRateLimit,
  getClientIdFromHeaders,
  rateLimiters,
} from '@/lib/ratelimit';

export async function getPersonalRecommendations() {
  const { userId } = await auth();

  // Rate limiting - use IP-based for unauthenticated, user-based for authenticated
  const identifier = await getClientIdFromHeaders(userId || undefined);
  const rateLimitResult = await checkRateLimit(
    rateLimiters.getPlatformStatsLimiter,
    identifier,
    'Too many requests to get personal recommendations. Please try again later.'
  );
  if (!rateLimitResult.success) {
    const retryAfter = rateLimitResult.retryAfter ?? 60;
    return { error: rateLimitResult.error, retryAfter };
  }

  try {
    if (!userId) {
      return {
        success: true,
        data: [],
        message: 'User not authenticated',
      };
    }

    // Get user's saved collections to understand their interests
    const savedCollections = await db
      .select({
        collectionId: SavedCollectionsTable.collectionId,
      })
      .from(SavedCollectionsTable)
      .where(eq(SavedCollectionsTable.userId, userId));

    if (savedCollections.length === 0) {
      // If no saved collections, return popular collections
      const popularCollections = await db
        .select({
          id: CollectionsTable.id,
          title: CollectionsTable.title,
          author: UsersTable.name,
          description: CollectionsTable.description,
          likes: CollectionsTable.likes,
          totalLinks: CollectionsTable.totalLinks,
          updatedAt: CollectionsTable.updatedAt,
          userId: CollectionsTable.userId,
        })
        .from(CollectionsTable)
        .leftJoin(UsersTable, eq(CollectionsTable.userId, UsersTable.id))
        .where(
          and(
            eq(CollectionsTable.visibility, 'public'),
            ne(CollectionsTable.userId, userId)
          )
        )
        .orderBy(desc(CollectionsTable.likes))
        .limit(6);

      return {
        success: true,
        data: popularCollections,
        message: 'Popular collections',
      };
    }

    // Get details of saved collections to analyze interests
    const savedCollectionDetails = await db
      .select({
        title: CollectionsTable.title,
        description: CollectionsTable.description,
        userId: CollectionsTable.userId,
      })
      .from(CollectionsTable)
      .where(
        inArray(
          CollectionsTable.id,
          savedCollections.map((sc) => sc.collectionId)
        )
      );

    // Get users who created the saved collections (similar creators)
    const similarCreators = [
      ...new Set(savedCollectionDetails.map((c) => c.userId)),
    ]
      .filter((creatorId) => creatorId !== userId)
      .slice(0, 5);

    // Find recommendations based on similar creators
    const creatorRecommendations =
      similarCreators.length > 0
        ? await db
            .select({
              id: CollectionsTable.id,
              title: CollectionsTable.title,
              author: UsersTable.name,
              description: CollectionsTable.description,
              likes: CollectionsTable.likes,
              totalLinks: CollectionsTable.totalLinks,
              updatedAt: CollectionsTable.updatedAt,
              userId: CollectionsTable.userId,
            })
            .from(CollectionsTable)
            .leftJoin(UsersTable, eq(CollectionsTable.userId, UsersTable.id))
            .where(
              and(
                inArray(CollectionsTable.userId, similarCreators),
                eq(CollectionsTable.visibility, 'public'),
                ne(CollectionsTable.userId, userId)
              )
            )
            .orderBy(desc(CollectionsTable.likes))
            .limit(8)
        : [];

    // Get popular collections excluding already saved ones
    const savedCollectionIds = savedCollections.map((sc) => sc.collectionId);
    const popularRecommendations = await db
      .select({
        id: CollectionsTable.id,
        title: CollectionsTable.title,
        author: UsersTable.name,
        description: CollectionsTable.description,
        likes: CollectionsTable.likes,
        totalLinks: CollectionsTable.totalLinks,
        updatedAt: CollectionsTable.updatedAt,
        userId: CollectionsTable.userId,
      })
      .from(CollectionsTable)
      .leftJoin(UsersTable, eq(CollectionsTable.userId, UsersTable.id))
      .where(
        and(
          eq(CollectionsTable.visibility, 'public'),
          ne(CollectionsTable.userId, userId)
        )
      )
      .orderBy(desc(CollectionsTable.likes))
      .limit(8);

    // Combine recommendations and remove duplicates
    const allRecommendations = [
      ...creatorRecommendations,
      ...popularRecommendations,
    ];
    const uniqueRecommendations = allRecommendations.filter(
      (collection, index, self) =>
        index === self.findIndex((c) => c.id === collection.id) &&
        !savedCollectionIds.includes(collection.id)
    );

    // Sort by likes and limit
    const finalRecommendations = uniqueRecommendations
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 6);

    return {
      success: true,
      data: finalRecommendations,
      message: 'Personalized recommendations',
    };
  } catch (error) {
    console.error('Error fetching personal recommendations:', error);
    return {
      error: 'Failed to fetch personal recommendations',
    };
  }
}
