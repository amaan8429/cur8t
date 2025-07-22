import { NextRequest, NextResponse } from "next/server";
import {
  rateLimiters,
  getClientId,
  checkRateLimit,
  createRateLimitMiddleware,
} from "./index";

// Example 1: Simple IP-based rate limiting for public endpoints
export async function publicApiRateLimit(request: NextRequest) {
  const clientId = getClientId(request); // Uses IP since no userId
  const result = await checkRateLimit(
    rateLimiters.publicApi,
    clientId,
    "API rate limit exceeded. Please slow down."
  );

  if (!result.success) {
    return NextResponse.json(
      {
        error: result.error,
        retryAfter: result.retryAfter,
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": result.limit.toString(),
          "X-RateLimit-Remaining": result.remaining.toString(),
          "Retry-After": (result.timeUntilReset || 0).toString(),
        },
      }
    );
  }

  return null; // No rate limit hit, continue processing
}

// Example 2: Authentication-specific rate limiting
export async function authRateLimit(request: NextRequest) {
  // For failed login attempts, use IP to prevent brute force
  const clientId = getClientId(request);

  return await checkRateLimit(
    rateLimiters.auth,
    clientId,
    "Too many authentication attempts. Please try again later."
  );
}

// Example 3: User-specific rate limiting with fallback to IP
export async function userSpecificRateLimit(
  request: NextRequest,
  userId?: string
) {
  const clientId = getClientId(request, userId);

  return await checkRateLimit(
    rateLimiters.userUpdate,
    clientId,
    userId
      ? "Too many requests from your account. Please slow down."
      : "Too many requests from your IP. Please slow down."
  );
}

// Example 4: Middleware-style rate limiter
export const usernameRateLimitMiddleware = createRateLimitMiddleware(
  rateLimiters.username,
  (req, userId) => getClientId(req, userId),
  "Username changes are limited. Please try again later."
);

// Example 5: Custom rate limiting with different algorithms
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./index";

// Token bucket: Allows bursts but limits sustained usage
export const burstLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.tokenBucket(5, "10 s", 20), // 5 tokens per 10s, max 20 tokens
  analytics: true,
  prefix: "ratelimit:burst",
});

// Fixed window: Simple, resets at fixed intervals
export const simpleFixedLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(10, "1 m"), // 10 requests per minute
  analytics: true,
  prefix: "ratelimit:fixed",
});

// Example 6: Rate limiting with custom Redis operations
export async function customRateLimit(
  key: string,
  limit: number,
  windowMs: number
) {
  const now = Date.now();
  const window = Math.floor(now / windowMs);
  const redisKey = `custom:${key}:${window}`;

  const count = await redis.incr(redisKey);

  if (count === 1) {
    // Set expiration for the first request in this window
    await redis.expire(redisKey, Math.ceil(windowMs / 1000));
  }

  return {
    success: count <= limit,
    count,
    limit,
    remaining: Math.max(0, limit - count),
    resetTime: (window + 1) * windowMs,
  };
}

// Example 7: Rate limiting based on request size/complexity
export function getComplexityScore(
  request: NextRequest,
  data?: unknown
): number {
  let score = 1; // Base score

  // Add complexity based on request method
  if (request.method === "POST" || request.method === "PUT") score += 2;
  if (request.method === "DELETE") score += 3;

  // Add complexity based on data size
  if (data) {
    const size = JSON.stringify(data).length;
    score += Math.ceil(size / 1000); // 1 point per KB
  }

  return Math.min(score, 10); // Cap at 10
}

// Example 8: Distributed rate limiting with multiple Redis instances
export async function distributedRateLimit(identifier: string) {
  // This would be used with multiple Redis instances for high availability
  try {
    return await rateLimiters.publicApi.limit(identifier);
  } catch (error) {
    console.error("Primary rate limiter failed:", error);
    // Fallback to in-memory or secondary Redis instance
    return {
      success: true,
      limit: 100,
      remaining: 100,
      reset: Date.now() + 3600000,
    };
  }
}

// Example 9: Rate limiting with custom headers and responses
export function createRateLimitResponse(
  result: {
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
    timeUntilReset?: number;
    error?: string;
  },
  customHeaders: Record<string, string> = {}
) {
  const headers: Record<string, string> = {
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": result.reset.toString(),
    "Cache-Control": "no-cache",
    ...customHeaders,
  };

  if (!result.success) {
    headers["Retry-After"] = (result.timeUntilReset || 0).toString();

    return NextResponse.json(
      {
        error: "Rate limit exceeded",
        message: result.error,
        rateLimitInfo: {
          limit: result.limit,
          remaining: result.remaining,
          resetAt: new Date(result.reset).toISOString(),
          retryAfterSeconds: result.timeUntilReset || 0,
        },
      },
      { status: 429, headers }
    );
  }

  return { headers, rateLimitInfo: result };
}
