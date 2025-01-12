import { db } from "@/db";
import { usersTable } from "@/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }
  const userStatus = await db
    .select({
      githubConnected: usersTable.githubConnected,
    })
    .from(usersTable)
    .where(eq(usersTable.id, userId));

  return NextResponse.json({ githubConnected: userStatus[0].githubConnected });
}
