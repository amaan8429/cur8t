import { db } from "@/db";
import { UsersTable } from "@/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { rateLimiters, checkRateLimit, getClientId } from "@/lib/ratelimit";

export async function GET(request: Request) {
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
      "Too many requests to GitHub status. Please try again later."
    );
    if (!rateLimitResult.success) {
      const retryAfter = rateLimitResult.retryAfter ?? 60;
      return NextResponse.json(
        { error: rateLimitResult.error, retryAfter },
        { status: 429, headers: { "Retry-After": retryAfter.toString() } }
      );
    }

    // Fetch the user's GitHub connection status from the database
    const userStatus = await db
      .select({
        githubConnected: UsersTable.githubConnected,
      })
      .from(UsersTable)
      .where(eq(UsersTable.id, userId));

    // Check if the user exists in the database
    if (!userStatus || userStatus.length === 0) {
      return NextResponse.json(
        { error: "User not found in the database" },
        { status: 404 }
      );
    }

    // Return the GitHub connection status
    return NextResponse.json({
      githubConnected: userStatus[0].githubConnected,
    });
  } catch (error) {
    console.error("Error fetching GitHub connection status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
