import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { showRateLimitToast } from "@/components/ui/rate-limit-toast";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Checks if a response or result indicates rate limiting and shows appropriate toast
 * @param result - Response from API call or server action
 * @param defaultMessage - Default message to show if no specific rate limit message
 * @returns boolean indicating if rate limited
 */
export function handleRateLimitResponse(
  result: any,
  defaultMessage: string = "Something went wrong, please try again later"
): boolean {
  // Check for rate limit in server action responses
  if (result && typeof result === "object") {
    // Server actions return { error: string, retryAfter?: number }
    if (result.error && result.retryAfter) {
      showRateLimitToast({
        retryAfter: result.retryAfter * 60, // Convert minutes to seconds
        message: defaultMessage,
      });
      return true;
    }

    // Some rate limit errors might not have retryAfter
    if (
      result.error &&
      (result.error.includes("rate limit") ||
        result.error.includes("Too many requests") ||
        result.error.includes("please try again later"))
    ) {
      showRateLimitToast({
        retryAfter: 60, // Default 1 minute
        message: defaultMessage,
      });
      return true;
    }
  }

  return false;
}

/**
 * Handles rate limiting for fetch responses
 * @param response - Fetch Response object
 * @param defaultMessage - Default message to show
 * @returns Promise<boolean> indicating if rate limited
 */
export async function handleFetchRateLimitResponse(
  response: Response,
  defaultMessage: string = "Something went wrong, please try again later"
): Promise<boolean> {
  if (response.status === 429) {
    try {
      const data = await response.json();
      const retryAfter =
        response.headers.get("retry-after") ||
        response.headers.get("x-ratelimit-reset") ||
        data.retryAfter ||
        60;

      showRateLimitToast({
        retryAfter:
          typeof retryAfter === "string" ? parseInt(retryAfter) : retryAfter,
        message: data.error || defaultMessage,
      });
      return true;
    } catch {
      showRateLimitToast({
        retryAfter: 60,
        message: defaultMessage,
      });
      return true;
    }
  }

  return false;
}

/**
 * Wrapper for server actions that automatically handles rate limiting
 * @param actionFn - Server action function to execute
 * @param defaultMessage - Default rate limit message
 * @returns Promise with action result or null if rate limited
 */
export async function executeServerActionWithRateLimit<T>(
  actionFn: () => Promise<T>,
  defaultMessage: string = "Something went wrong, please try again later"
): Promise<T | null> {
  try {
    const result = await actionFn();

    if (handleRateLimitResponse(result, defaultMessage)) {
      return null;
    }

    return result;
  } catch (error) {
    console.error("Server action error:", error);
    throw error;
  }
}

/**
 * Wrapper for fetch calls that automatically handles rate limiting
 * @param fetchFn - Fetch function to execute
 * @param defaultMessage - Default rate limit message
 * @returns Promise with fetch result or null if rate limited
 */
export async function executeFetchWithRateLimit(
  fetchFn: () => Promise<Response>,
  defaultMessage: string = "Something went wrong, please try again later"
): Promise<Response | null> {
  try {
    const response = await fetchFn();

    const isRateLimited = await handleFetchRateLimitResponse(
      response,
      defaultMessage
    );
    if (isRateLimited) {
      return null;
    }

    return response;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
