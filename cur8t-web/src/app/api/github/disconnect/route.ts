import { db } from "@/db";
import { UsersTable, GitHubSettingsTable } from "@/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { rateLimiters, checkRateLimit, getClientId } from "@/lib/ratelimit";

export async function POST(request: Request) {
  try {
    // Authenticate the user and get their ID
    const { userId } = await auth();

    // Check if the user ID is present
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized: Missing user ID" },
        { status: 401 }
      );
    }

    // Rate limiting: use userId as identifier
    const identifier = getClientId(request, userId);
    const rateLimitResult = await checkRateLimit(
      rateLimiters.getGithubStatusLimiter,
      identifier,
      "Too many requests to GitHub disconnect. Please try again later."
    );
    if (!rateLimitResult.success) {
      const retryAfter = rateLimitResult.retryAfter ?? 60;
      return NextResponse.json(
        { error: rateLimitResult.error, retryAfter },
        { status: 429, headers: { "Retry-After": retryAfter.toString() } }
      );
    }

    // Update user's GitHub connection status to false
    await db
      .update(UsersTable)
      .set({
        githubConnected: false,
        githubUsername: null,
      })
      .where(eq(UsersTable.id, userId));

    // Delete GitHub settings for the user
    await db
      .delete(GitHubSettingsTable)
      .where(eq(GitHubSettingsTable.userId, userId));

    return NextResponse.json({
      message: "GitHub account disconnected successfully",
      githubConnected: false,
    });
  } catch (error) {
    console.error("Error disconnecting GitHub account:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
