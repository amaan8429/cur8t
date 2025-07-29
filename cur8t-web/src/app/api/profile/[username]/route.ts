import { NextResponse } from "next/server";
import { db } from "@/db";
import { UsersTable, CollectionsTable } from "@/schema";
import { eq, and } from "drizzle-orm";
import { getClientId, checkRateLimit, rateLimiters } from "@/lib/ratelimit";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  // IP-based rate limiting
  const identifier = getClientId(request); // uses IP
  const rateLimitResult = await checkRateLimit(
    rateLimiters.getPublicProfileLimiter,
    identifier,
    "Too many requests to get public profile. Please try again later."
  );
  if (!rateLimitResult.success) {
    const retryAfter = rateLimitResult.retryAfter ?? 60;
    return NextResponse.json(
      { error: rateLimitResult.error, retryAfter },
      { status: 429, headers: { "Retry-After": retryAfter.toString() } }
    );
  }

  try {
    // Await the params in Next.js 15
    const { username } = await params;

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // Fetch user by username
    const users = await db
      .select({
        id: UsersTable.id,
        name: UsersTable.name,
        email: UsersTable.email,
        username: UsersTable.username,
        bio: UsersTable.bio,
        twitterUsername: UsersTable.twitterUsername,
        linkedinUsername: UsersTable.linkedinUsername,
        githubUsername: UsersTable.githubUsername,
        instagramUsername: UsersTable.instagramUsername,
        personalWebsite: UsersTable.personalWebsite,
        showSocialLinks: UsersTable.showSocialLinks,
        pinnedCollections: UsersTable.pinnedCollections,
        totalCollections: UsersTable.totalCollections,
      })
      .from(UsersTable)
      .where(eq(UsersTable.username, username))
      .limit(1);

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = users[0];

    // Fetch user's public collections
    const collections = await db
      .select({
        id: CollectionsTable.id,
        title: CollectionsTable.title,
        description: CollectionsTable.description,
        author: UsersTable.name,
        likes: CollectionsTable.likes,
        totalLinks: CollectionsTable.totalLinks,
        userId: CollectionsTable.userId,
        visibility: CollectionsTable.visibility,
        sharedEmails: CollectionsTable.sharedEmails,
        createdAt: CollectionsTable.createdAt,
        updatedAt: CollectionsTable.updatedAt,
      })
      .from(CollectionsTable)
      .leftJoin(UsersTable, eq(CollectionsTable.userId, UsersTable.id))
      .where(
        and(
          eq(CollectionsTable.userId, user.id),
          eq(CollectionsTable.visibility, "public")
        )
      );

    return NextResponse.json(
      {
        user,
        collections,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
