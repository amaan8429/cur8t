import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/ratelimit";

// Middleware-specific rate limiters using existing Redis connection
const middlewareRateLimiters = {
  // Global rate limit: 1000 requests per hour per IP (very generous for normal use)
  globalLimiter: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(1000, "1 h"),
    analytics: true,
    prefix: "middleware:global",
  }),

  // API routes: 500 requests per hour per IP
  apiLimiter: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(500, "1 h"),
    analytics: true,
    prefix: "middleware:api",
  }),

  // Auth routes: 50 requests per hour per IP (sign-in, sign-up)
  authLimiter: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(50, "1 h"),
    analytics: true,
    prefix: "middleware:auth",
  }),

  // Public pages: 2000 requests per hour per IP (higher for browsing)
  publicPagesLimiter: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(2000, "1 h"),
    analytics: true,
    prefix: "middleware:public",
  }),

  // Webhooks: 100 requests per hour per IP
  webhookLimiter: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "1 h"),
    analytics: true,
    prefix: "middleware:webhook",
  }),
};

// Helper function to get client IP
function getClientIP(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const clientIp = forwardedFor?.split(",")[0] || realIp || "unknown";
  return clientIp;
}

// Helper function to create rate limit response
function createRateLimitResponse(retryAfter: number = 60): NextResponse {
  return new NextResponse(
    JSON.stringify({
      error: "Too many requests. Please try again later.",
      retryAfter,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": retryAfter.toString(),
        "X-RateLimit-Limit": "Rate limit exceeded",
        "X-RateLimit-Remaining": "0",
      },
    }
  );
}

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/",
  "/explore(.*)",
  "/api/webhooks(.*)",
  "/api/profile(.*)",
  "/collection(.*)",
  "/profile(.*)",
  "/onboarding(.*)",
]);

const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

const isApiRoute = createRouteMatcher(["/api(.*)"]);

const isWebhookRoute = createRouteMatcher(["/api/webhooks(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  const clientIP = getClientIP(request);
  const pathname = request.nextUrl.pathname;

  try {
    // Apply global rate limiting first
    const globalResult =
      await middlewareRateLimiters.globalLimiter.limit(clientIP);
    if (!globalResult.success) {
      console.warn(
        `Global rate limit exceeded for IP: ${clientIP}, Path: ${pathname}`
      );
      return createRateLimitResponse(
        Math.round((globalResult.reset - Date.now()) / 1000)
      );
    }

    // Apply specific rate limiting based on route type
    if (isWebhookRoute(request)) {
      const webhookResult =
        await middlewareRateLimiters.webhookLimiter.limit(clientIP);
      if (!webhookResult.success) {
        console.warn(
          `Webhook rate limit exceeded for IP: ${clientIP}, Path: ${pathname}`
        );
        return createRateLimitResponse(
          Math.round((webhookResult.reset - Date.now()) / 1000)
        );
      }
    } else if (isApiRoute(request)) {
      const apiResult = await middlewareRateLimiters.apiLimiter.limit(clientIP);
      if (!apiResult.success) {
        console.warn(
          `API rate limit exceeded for IP: ${clientIP}, Path: ${pathname}`
        );
        return createRateLimitResponse(
          Math.round((apiResult.reset - Date.now()) / 1000)
        );
      }
    } else if (isAuthRoute(request)) {
      const authResult =
        await middlewareRateLimiters.authLimiter.limit(clientIP);
      if (!authResult.success) {
        console.warn(
          `Auth rate limit exceeded for IP: ${clientIP}, Path: ${pathname}`
        );
        return createRateLimitResponse(
          Math.round((authResult.reset - Date.now()) / 1000)
        );
      }
    } else if (isPublicRoute(request)) {
      const publicResult =
        await middlewareRateLimiters.publicPagesLimiter.limit(clientIP);
      if (!publicResult.success) {
        console.warn(
          `Public page rate limit exceeded for IP: ${clientIP}, Path: ${pathname}`
        );
        return createRateLimitResponse(
          Math.round((publicResult.reset - Date.now()) / 1000)
        );
      }
    }

    // Proceed with Clerk authentication
    if (!isPublicRoute(request)) {
      await auth.protect();
    }
  } catch (error) {
    // Only log actual errors, not expected redirects or not found responses
    if (
      error instanceof Error &&
      !error.message.includes("NEXT_REDIRECT") &&
      !error.message.includes("NEXT_NOT_FOUND")
    ) {
      console.error("Rate limiting error in middleware:", error);
    }
    // Continue without rate limiting if Redis fails (graceful degradation)
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
