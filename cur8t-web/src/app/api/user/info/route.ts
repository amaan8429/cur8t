import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { UsersTable } from "@/schema";
import { eq } from "drizzle-orm";
import { checkRateLimit, getClientId, rateLimiters } from "@/lib/ratelimit";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const identifier = getClientId(req, userId);
    const rateLimitResult = await checkRateLimit(
      rateLimiters.getUserInfoLimiter,
      identifier,
      "Too many requests to get user info. Please try again later."
    );
    if (!rateLimitResult.success) {
      const retryAfter = rateLimitResult.retryAfter ?? 60;
      return NextResponse.json(
        { error: rateLimitResult.error, retryAfter },
        { status: 429, headers: { "Retry-After": retryAfter.toString() } }
      );
    }

    const users = await db
      .select()
      .from(UsersTable)
      .where(eq(UsersTable.id, userId))
      .limit(1);

    const user = users[0];

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        githubConnected: user.githubConnected,
        totalCollections: user.totalCollections,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user info:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
