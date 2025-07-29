import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { headers } from "next/headers";

// Initialize Redis connection
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Rate limiting configurations for different endpoints
export const rateLimiters = {
  // Username changes: 5 attempts per 15 minutes per user
  usernameChangeLimiter: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "15 m"),
    analytics: true,
    prefix: "ratelimit:username",
  }),

  // General user updates: 10 attempts per 5 minutes per user
  userUpdateLimiter: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "5 m"),
    analytics: true,
    prefix: "ratelimit:user-update",
  }),

  // Profile updates: 10 attempts per 5 minutes per user
  profileUpdateLimiter: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "5 m"),
    analytics: true,
    prefix: "ratelimit:profile-update",
  }),

  // Social media updates: 10 attempts per 5 minutes per user
  socialMediaUpdateLimiter: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "5 m"),
    analytics: true,
    prefix: "ratelimit:social-media-update",
  }),

  // GitHub sync
  githubSyncLimiter: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "10 m"),
    analytics: true,
    prefix: "ratelimit:github-sync",
  }),

  // Create collection
  createCollectionLimiter: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "1 h"),
    analytics: true,
    prefix: "ratelimit:create-collection-action",
  }),

  // Create link
  createLinkLimiter: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(50, "10 m"),
    analytics: true,
    prefix: "ratelimit:create-link-action",
  }),

  // Access requests: 5 attempts per hour per user to prevent spam
  accessRequestLimiter: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 h"),
    analytics: true,
    prefix: "ratelimit:access-request",
  }),

  // Save extracted collection
  saveExtractedCollectionLimiter: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 h"),
    analytics: true,
    prefix: "ratelimit:save-extracted-collection-action",
  }),

  // Delete collection
  deleteCollectionLimiter: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, "1 h"),
    analytics: true,
    prefix: "ratelimit:delete-collection-action",
  }),

  // Delete link
  deleteLinkLimiter: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "1 h"),
    analytics: true,
    prefix: "ratelimit:delete-link-action",
  }),

  // Like collection
  likeCollectionLimiter: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "1 h"),
    analytics: true,
    prefix: "ratelimit:like-collection-action",
  }),

  // Save extracted link
  saveExtractedLinkLimiter: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(50, "1 h"),
    analytics: true,
    prefix: "ratelimit:save-extracted-link-action",
  }),

  // Duplicate public link
  duplicatePublicLinkLimiter: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "1 h"),
    analytics: true,
    prefix: "ratelimit:duplicate-public-link-action",
  }),

  // Change collection name
  changeCollectionNameLimiter: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "1 h"),
    analytics: true,
    prefix: "ratelimit:change-collection-name-action",
  }),

  // Change collection description
  changeCollectionDescriptionLimiter: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, "1 h"),
    analytics: true,
    prefix: "ratelimit:change-collection-description-action",
  }),

  // Change collection visibility
  changeCollectionVisibilityLimiter: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "1 h"),
    analytics: true,
    prefix: "ratelimit:change-collection-visibility-action",
  }),

  // Search
  searchLimiter: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "1 h"),
    analytics: true,
    prefix: "ratelimit:search-action",
  }),

  // Get user info
  getUserInfoLimiter: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "1 h"),
    analytics: true,
    prefix: "ratelimit:get-user-info",
  }),

  // Get social media info
  getSocialMediaInfoLimiter: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "1 h"),
    analytics: true,
    prefix: "ratelimit:get-social-media-info",
  }),

  // Get GitHub status
  getGithubStatusLimiter: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(50, "1 h"),
    analytics: true,
    prefix: "ratelimit:get-github-status",
  }),

  // Get public profile
  getPublicProfileLimiter: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(200, "1 h"),
    analytics: true,
    prefix: "ratelimit:get-public-profile",
  }),

  // Get collections
  getCollectionsLimiter: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(200, "1 h"),
    analytics: true,
    prefix: "ratelimit:get-collections-action",
  }),

  // Get links
  getLinksLimiter: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(200, "1 h"),
    analytics: true,
    prefix: "ratelimit:get-links-action",
  }),

  // Get single collection
  getSingleCollectionLimiter: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(200, "1 h"),
    analytics: true,
    prefix: "ratelimit:get-single-collection-action",
  }),

  // Get platform stats
  getPlatformStatsLimiter: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "1 h"),
    analytics: true,
    prefix: "ratelimit:get-platform-stats-action",
  }),

  // Public API: 100 requests per hour per IP
  publicApiLimiter: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "1 h"),
    analytics: true,
    prefix: "ratelimit:public-api",
  }),

  // Authentication: 5 failed attempts per 15 minutes per IP
  authLimiter: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "15 m"),
    analytics: true,
    prefix: "ratelimit:auth",
  }),

  // Create API key
  createApiKeyLimiter: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 h"),
    analytics: true,
    prefix: "ratelimit:create-api-key",
  }),

  // Delete API key
  deleteApiKeyLimiter: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 h"),
    analytics: true,
    prefix: "ratelimit:delete-api-key",
  }),

  // Get API keys
  getApiKeysLimiter: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 h"),
    analytics: true,
    prefix: "ratelimit:get-api-keys",
  }),
};

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

// Helper function to get client identifier from Next.js headers (for server actions)
export async function getClientIdFromHeaders(userId?: string): Promise<string> {
  // Prefer authenticated user ID, fallback to IP
  if (userId) {
    return `user:${userId}`;
  }

  // Get IP from headers using Next.js headers() function
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");
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
