import { redis } from "./index";
import { Ratelimit } from "@upstash/ratelimit";

// Type definitions
interface RateLimitResult {
  attempt: number;
  success: boolean;
  remaining: number;
  limit: number;
  reset: string;
}

interface RateLimitStatus {
  key: string;
  value: unknown;
  ttl: number;
  expiresAt: string | null;
}

interface AnalyticsData {
  totalRequests: number;
  blockedRequests: number;
  uniqueIdentifiers: Set<string>;
  timeRange: string;
}

interface HealthCheckDetails {
  redis?: string;
  rateLimiter?: string;
  testResult?: {
    success: boolean;
    remaining: number;
    limit: number;
  };
  error?: string;
}

// Test utilities for rate limiting
export class RateLimitTester {
  constructor(private prefix: string = "test") {}

  // Clean up test data
  async cleanup(pattern: string = `${this.prefix}:*`) {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
    console.log(`Cleaned up ${keys.length} test keys`);
  }

  // Simulate multiple requests to test rate limiting
  async simulateRequests(
    rateLimiter: Ratelimit,
    identifier: string,
    count: number,
    delayMs: number = 0
  ): Promise<RateLimitResult[]> {
    const results = [];

    for (let i = 0; i < count; i++) {
      if (delayMs > 0 && i > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }

      const result = await rateLimiter.limit(identifier);
      results.push({
        attempt: i + 1,
        success: result.success,
        remaining: result.remaining,
        limit: result.limit,
        reset: new Date(result.reset).toISOString(),
      });

      console.log(
        `Attempt ${i + 1}: ${result.success ? "✅" : "❌"} (${result.remaining}/${result.limit} remaining)`
      );
    }

    return results;
  }

  // Test rate limit recovery
  async testRecovery(
    rateLimiter: Ratelimit,
    identifier: string,
    windowMs: number
  ) {
    console.log("Testing rate limit recovery...");

    // Exhaust the rate limit
    let result;
    do {
      result = await rateLimiter.limit(identifier);
    } while (result.success);

    console.log("Rate limit exhausted, waiting for recovery...");

    // Wait for window to reset
    await new Promise((resolve) => setTimeout(resolve, windowMs + 1000));

    // Test recovery
    const recoveryResult = await rateLimiter.limit(identifier);
    console.log(`Recovery test: ${recoveryResult.success ? "✅" : "❌"}`);

    return recoveryResult;
  }
}

// Monitoring utilities
export class RateLimitMonitor {
  // Get current rate limit status
  async getStatus(prefix: string): Promise<RateLimitStatus[]> {
    const keys = await redis.keys(`${prefix}:*`);
    const statuses = [];

    for (const key of keys) {
      const ttl = await redis.ttl(key);
      const value = await redis.get(key);

      statuses.push({
        key,
        value,
        ttl,
        expiresAt:
          ttl > 0 ? new Date(Date.now() + ttl * 1000).toISOString() : null,
      });
    }

    return statuses;
  }

  // Monitor rate limiting in real-time
  async monitor(prefix: string, intervalMs: number = 5000) {
    console.log(`🔍 Monitoring rate limits with prefix: ${prefix}`);

    const interval = setInterval(async () => {
      const statuses = await this.getStatus(prefix);

      console.clear();
      console.log(`📊 Rate Limit Monitor - ${new Date().toISOString()}`);
      console.log("=".repeat(60));

      if (statuses.length === 0) {
        console.log("No active rate limits");
      } else {
        statuses.forEach((status) => {
          const identifier = status.key.split(":").pop();
          console.log(
            `${identifier}: ${status.value} requests (TTL: ${status.ttl}s)`
          );
        });
      }

      console.log("=".repeat(60));
    }, intervalMs);

    // Return cleanup function
    return () => clearInterval(interval);
  }

  // Get analytics data (if analytics are enabled)
  async getAnalytics(prefix: string, days: number = 7): Promise<AnalyticsData> {
    // This would integrate with Upstash's analytics if available
    // For now, we'll simulate basic analytics

    const keys = await redis.keys(`${prefix}:analytics:*`);
    const analytics = {
      totalRequests: 0,
      blockedRequests: 0,
      uniqueIdentifiers: new Set<string>(),
      timeRange: `${days} days`,
    };

    // In a real implementation, you'd fetch actual analytics data
    // from Upstash or implement your own analytics collection

    return analytics;
  }
}

// Health check for rate limiting system
export async function rateLimitHealthCheck(): Promise<{
  status: "healthy" | "degraded" | "unhealthy";
  details: HealthCheckDetails;
}> {
  try {
    // Test Redis connectivity
    const testKey = "health-check";
    await redis.set(testKey, "test", { ex: 5 });
    const value = await redis.get(testKey);
    await redis.del(testKey);

    if (value !== "test") {
      return {
        status: "unhealthy",
        details: { error: "Redis read/write test failed" },
      };
    }

    // Test rate limiter functionality
    const { rateLimiters } = await import("./index");
    const testResult = await rateLimiters.publicApi.limit("health-check");

    return {
      status: "healthy",
      details: {
        redis: "connected",
        rateLimiter: "functional",
        testResult: {
          success: testResult.success,
          remaining: testResult.remaining,
          limit: testResult.limit,
        },
      },
    };
  } catch (error) {
    return {
      status: "unhealthy",
      details: {
        error: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
}
