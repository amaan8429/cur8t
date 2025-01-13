import { db } from "@/db";
import { usersTable } from "@/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
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

    // Fetch the user's GitHub connection status from the database
    const userStatus = await db
      .select({
        githubConnected: usersTable.githubConnected,
      })
      .from(usersTable)
      .where(eq(usersTable.id, userId));

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
