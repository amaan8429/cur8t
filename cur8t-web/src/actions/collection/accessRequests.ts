'use server';

import { db } from '@/db';
import { AccessRequestsTable, CollectionsTable, UsersTable } from '@/schema';
import { auth } from '@clerk/nextjs/server';
import { eq, and } from 'drizzle-orm';
import {
  checkRateLimit,
  getClientIdFromHeaders,
  rateLimiters,
} from '@/lib/ratelimit';

export async function requestAccessAction(
  collectionId: string,
  message: string = ''
) {
  const { userId } = await auth();

  if (!userId) {
    return { error: 'Authentication required to request access' };
  }

  // Rate limiting
  const identifier = await getClientIdFromHeaders(userId);
  const rateLimitResult = await checkRateLimit(
    rateLimiters.accessRequestLimiter,
    identifier,
    'Too many access requests. Please try again later.'
  );
  if (!rateLimitResult.success) {
    const retryAfter = rateLimitResult.retryAfter ?? 60;
    return { error: rateLimitResult.error, retryAfter };
  }

  if (!collectionId) {
    return { error: 'Collection ID is required' };
  }

  try {
    // Get collection info and owner
    const collection = await db
      .select({
        id: CollectionsTable.id,
        ownerId: CollectionsTable.userId,
        title: CollectionsTable.title,
        visibility: CollectionsTable.visibility,
      })
      .from(CollectionsTable)
      .where(eq(CollectionsTable.id, collectionId))
      .limit(1);

    if (!collection || collection.length === 0) {
      return { error: 'Collection not found' };
    }

    const collectionData = collection[0];

    // Check if user is the owner
    if (collectionData.ownerId === userId) {
      return { error: 'You cannot request access to your own collection' };
    }

    // Check if collection allows access requests (private or protected)
    if (collectionData.visibility === 'public') {
      return {
        error: "This collection is public and doesn't need access requests",
      };
    }

    // Check if user already has a pending or approved request
    const existingRequest = await db
      .select()
      .from(AccessRequestsTable)
      .where(
        and(
          eq(AccessRequestsTable.requesterId, userId),
          eq(AccessRequestsTable.collectionId, collectionId)
        )
      )
      .limit(1);

    if (existingRequest && existingRequest.length > 0) {
      const request = existingRequest[0];
      if (request.status === 'pending') {
        return {
          error: 'You have already requested access to this collection',
        };
      }
      if (request.status === 'approved') {
        return { error: 'You already have access to this collection' };
      }
      // If denied, allow to request again (will update existing record)
    }

    // Create or update access request
    const result = await db
      .insert(AccessRequestsTable)
      .values({
        requesterId: userId,
        collectionId,
        ownerId: collectionData.ownerId,
        message: message.trim(),
        status: 'pending',
      })
      .onConflictDoUpdate({
        target: [
          AccessRequestsTable.requesterId,
          AccessRequestsTable.collectionId,
        ],
        set: {
          message: message.trim(),
          status: 'pending',
          requestedAt: new Date(),
          respondedAt: null,
        },
      })
      .returning();

    return {
      success: true,
      message: 'Access request sent successfully',
      data: result[0],
    };
  } catch (error) {
    console.error('Error requesting access:', error);
    return { error: 'Failed to send access request' };
  }
}

export async function getAccessRequestsAction() {
  const { userId } = await auth();

  if (!userId) {
    return { error: 'Authentication required' };
  }

  try {
    // Get access requests for collections owned by this user
    const requests = await db
      .select({
        id: AccessRequestsTable.id,
        requesterId: AccessRequestsTable.requesterId,
        collectionId: AccessRequestsTable.collectionId,
        message: AccessRequestsTable.message,
        status: AccessRequestsTable.status,
        requestedAt: AccessRequestsTable.requestedAt,
        respondedAt: AccessRequestsTable.respondedAt,
        requesterName: UsersTable.name,
        requesterEmail: UsersTable.email,
        collectionTitle: CollectionsTable.title,
      })
      .from(AccessRequestsTable)
      .leftJoin(UsersTable, eq(AccessRequestsTable.requesterId, UsersTable.id))
      .leftJoin(
        CollectionsTable,
        eq(AccessRequestsTable.collectionId, CollectionsTable.id)
      )
      .where(eq(AccessRequestsTable.ownerId, userId))
      .orderBy(AccessRequestsTable.requestedAt);

    return {
      success: true,
      data: requests,
    };
  } catch (error) {
    console.error('Error fetching access requests:', error);
    return { error: 'Failed to fetch access requests' };
  }
}

export async function approveAccessRequestAction(requestId: string) {
  const { userId } = await auth();

  if (!userId) {
    return { error: 'Authentication required' };
  }

  try {
    // Get the request and verify ownership
    const request = await db
      .select()
      .from(AccessRequestsTable)
      .where(
        and(
          eq(AccessRequestsTable.id, requestId),
          eq(AccessRequestsTable.ownerId, userId)
        )
      )
      .limit(1);

    if (!request || request.length === 0) {
      return { error: 'Access request not found' };
    }

    const requestData = request[0];

    if (requestData.status !== 'pending') {
      return { error: 'This request has already been responded to' };
    }

    // Update request status
    await db
      .update(AccessRequestsTable)
      .set({
        status: 'approved',
        respondedAt: new Date(),
      })
      .where(eq(AccessRequestsTable.id, requestId));

    // Add user to collection's shared emails and handle visibility conversion
    const collection = await db
      .select({
        sharedEmails: CollectionsTable.sharedEmails,
        visibility: CollectionsTable.visibility,
      })
      .from(CollectionsTable)
      .where(eq(CollectionsTable.id, requestData.collectionId))
      .limit(1);

    if (collection && collection.length > 0) {
      // Get requester's email
      const requester = await db
        .select({ email: UsersTable.email })
        .from(UsersTable)
        .where(eq(UsersTable.id, requestData.requesterId))
        .limit(1);

      if (requester && requester.length > 0) {
        const currentEmails = collection[0].sharedEmails || [];
        const requesterEmail = requester[0].email;
        const currentVisibility = collection[0].visibility;

        if (!currentEmails.includes(requesterEmail)) {
          const newEmails = [...currentEmails, requesterEmail];

          // If collection is private, convert it to protected when granting access
          const newVisibility =
            currentVisibility === 'private' ? 'protected' : currentVisibility;

          await db
            .update(CollectionsTable)
            .set({
              sharedEmails: newEmails,
              visibility: newVisibility,
            })
            .where(eq(CollectionsTable.id, requestData.collectionId));

          // Return different success messages based on whether visibility was changed
          const wasConverted =
            currentVisibility === 'private' && newVisibility === 'protected';
          return {
            success: true,
            message: wasConverted
              ? 'Access request approved successfully. Collection converted from private to protected.'
              : 'Access request approved successfully',
            visibilityChanged: wasConverted,
          };
        }
      }
    }

    return {
      success: true,
      message: 'Access request approved successfully',
    };
  } catch (error) {
    console.error('Error approving access request:', error);
    return { error: 'Failed to approve access request' };
  }
}

export async function denyAccessRequestAction(requestId: string) {
  const { userId } = await auth();

  if (!userId) {
    return { error: 'Authentication required' };
  }

  try {
    // Get the request and verify ownership
    const request = await db
      .select()
      .from(AccessRequestsTable)
      .where(
        and(
          eq(AccessRequestsTable.id, requestId),
          eq(AccessRequestsTable.ownerId, userId)
        )
      )
      .limit(1);

    if (!request || request.length === 0) {
      return { error: 'Access request not found' };
    }

    const requestData = request[0];

    if (requestData.status !== 'pending') {
      return { error: 'This request has already been responded to' };
    }

    // Update request status
    await db
      .update(AccessRequestsTable)
      .set({
        status: 'denied',
        respondedAt: new Date(),
      })
      .where(eq(AccessRequestsTable.id, requestId));

    return {
      success: true,
      message: 'Access request denied',
    };
  } catch (error) {
    console.error('Error denying access request:', error);
    return { error: 'Failed to deny access request' };
  }
}

export async function checkAccessRequestStatus(collectionId: string) {
  const { userId } = await auth();

  if (!userId) {
    return { hasRequest: false };
  }

  try {
    const request = await db
      .select({
        status: AccessRequestsTable.status,
        requestedAt: AccessRequestsTable.requestedAt,
      })
      .from(AccessRequestsTable)
      .where(
        and(
          eq(AccessRequestsTable.requesterId, userId),
          eq(AccessRequestsTable.collectionId, collectionId)
        )
      )
      .limit(1);

    if (!request || request.length === 0) {
      return { hasRequest: false };
    }

    return {
      hasRequest: true,
      status: request[0].status,
      requestedAt: request[0].requestedAt,
    };
  } catch (error) {
    console.error('Error checking access request status:', error);
    return { hasRequest: false };
  }
}
