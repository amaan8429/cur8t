import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Initialize Redis connection
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Rate limiting configurations for different endpoints
export const rateLimiters = {
  // Username changes: 5 attempts per 15 minutes per user
  username: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "15 m"),
    analytics: true,
    prefix: "ratelimit:username",
  }),

  // General user updates: 10 attempts per 5 minutes per user
  userUpdate: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "5 m"),
    analytics: true,
    prefix: "ratelimit:user-update",
  }),

  // Public API: 100 requests per hour per IP
  publicApi: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "1 h"),
    analytics: true,
    prefix: "ratelimit:public-api",
  }),

  // Authentication: 5 failed attempts per 15 minutes per IP
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "15 m"),
    analytics: true,
    prefix: "ratelimit:auth",
  }),
};

// Rate limiting algorithm explanations:
// 1. slidingWindow(limit, window) - Most accurate, prevents burst attacks
// 2. fixedWindow(limit, window) - Simple, resets at fixed intervals
// 3. tokenBucket(refillRate, interval, bucketSize) - Allows bursts up to bucket size

// Helper function to get client identifier
export function getClientId(request: Request, userId?: string): string {
  // Prefer authenticated user ID, fallback to IP
  if (userId) {
    return `user:${userId}`;
  }

  // Get IP from headers (handles proxies/load balancers)
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const clientIp = forwardedFor?.split(",")[0] || realIp || "unknown";

  return `ip:${clientIp}`;
}

// Enhanced rate limiting with custom error messages
export async function checkRateLimit(
  limiter: Ratelimit,
  identifier: string,
  customMessage?: string
) {
  const result = await limiter.limit(identifier);

  if (!result.success) {
    const resetDate = new Date(result.reset);
    const timeUntilReset = Math.ceil((result.reset - Date.now()) / 1000);

    return {
      success: false,
      error: customMessage || "Rate limit exceeded",
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
      resetDate,
      timeUntilReset,
      retryAfter: Math.ceil(timeUntilReset / 60), // minutes
    };
  }

  return {
    success: true,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
    resetDate: new Date(result.reset),
  };
}

// Middleware-style rate limiter
export function createRateLimitMiddleware(
  limiter: Ratelimit,
  getIdentifier: (req: Request, userId?: string) => string,
  customMessage?: string
) {
  return async (request: Request, userId?: string) => {
    const identifier = getIdentifier(request, userId);
    return checkRateLimit(limiter, identifier, customMessage);
  };
}

export { redis };
