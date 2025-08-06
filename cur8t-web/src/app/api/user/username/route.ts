import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { UsersTable } from '@/schema';
import { eq } from 'drizzle-orm';
// Import our rate limiting utilities
import { rateLimiters, getClientId, checkRateLimit } from '@/lib/ratelimit';

export async function POST(request: NextRequest) {
  try {
    // Step 1: Authenticate user first
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Step 2: Apply rate limiting BEFORE processing the request
    // This prevents abuse and protects your database from spam requests
    const clientId = getClientId(request, userId); // Creates unique ID like "user:clerk_123"
    const rateLimitResult = await checkRateLimit(
      rateLimiters.usernameChangeLimiter, // Using our username-specific rate limiter (5 req/15min)
      clientId,
      'Too many username change attempts. Please try again later.'
    );

    // Step 3: Handle rate limit exceeded
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: rateLimitResult.error,
          rateLimitInfo: {
            limit: rateLimitResult.limit,
            remaining: rateLimitResult.remaining,
            resetAt: rateLimitResult.resetDate.toISOString(),
            retryAfterMinutes: rateLimitResult.retryAfter,
          },
        },
        {
          status: 429, // Too Many Requests
          headers: {
            // Standard rate limiting headers
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
            'Retry-After': (rateLimitResult.timeUntilReset || 0).toString(),
          },
        }
      );
    }

    // Step 4: Parse and validate request body
    const { username } = await request.json();

    if (!username || typeof username !== 'string') {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Validate username format
    if (username.length < 3 || username.length > 20) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters long' },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json(
        {
          error: 'Username can only contain letters, numbers, and underscores',
        },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUser = await db
      .select()
      .from(UsersTable)
      .where(eq(UsersTable.username, username))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 409 }
      );
    }

    // Update user with username
    await db
      .update(UsersTable)
      .set({ username })
      .where(eq(UsersTable.id, userId));

    // Step 5: Return success response with rate limit info
    return NextResponse.json(
      {
        success: true,
        message: 'Username set successfully',
        rateLimitInfo: {
          limit: rateLimitResult.limit,
          remaining: rateLimitResult.remaining - 1, // Subtract 1 since this request consumed one
          resetAt: rateLimitResult.resetDate.toISOString(),
        },
      },
      {
        status: 200,
        headers: {
          // Include rate limit info in successful responses too
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': (rateLimitResult.remaining - 1).toString(),
          'X-RateLimit-Reset': rateLimitResult.reset.toString(),
        },
      }
    );
  } catch (error) {
    console.error('Error setting username:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
