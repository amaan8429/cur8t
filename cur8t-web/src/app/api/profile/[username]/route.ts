import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { UsersTable, CollectionsTable } from "@/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
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
        author: CollectionsTable.author,
        likes: CollectionsTable.likes,
        totalLinks: CollectionsTable.totalLinks,
        userId: CollectionsTable.userId,
        visibility: CollectionsTable.visibility,
        sharedEmails: CollectionsTable.sharedEmails,
        createdAt: CollectionsTable.createdAt,
        updatedAt: CollectionsTable.updatedAt,
      })
      .from(CollectionsTable)
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
