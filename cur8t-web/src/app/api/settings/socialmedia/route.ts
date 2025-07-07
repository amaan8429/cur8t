import { db } from "@/db";
import { UsersTable } from "@/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const socialMediaSettings = await db
    .select({
      twitterUsername: UsersTable.twitterUsername,
      linkedinUsername: UsersTable.linkedinUsername,
      githubUsername: UsersTable.githubUsername,
      instagramUsername: UsersTable.instagramUsername,
      personalWebsite: UsersTable.personalWebsite,
      bio: UsersTable.bio,
      showSocialLinks: UsersTable.showSocialLinks,
    })
    .from(UsersTable)
    .where(eq(UsersTable.id, userId));

  if (!socialMediaSettings[0]) {
    return new NextResponse("Social media settings not found", { status: 404 });
  }

  return NextResponse.json(socialMediaSettings[0]);
}

export async function PUT(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const {
    twitterUsername,
    linkedinUsername,
    githubUsername,
    instagramUsername,
    personalWebsite,
    bio,
    showSocialLinks,
  } = body;

  const updatedUser = await db
    .update(UsersTable)
    .set({
      twitterUsername,
      linkedinUsername,
      githubUsername,
      instagramUsername,
      personalWebsite,
      bio,
      showSocialLinks,
    })
    .where(eq(UsersTable.id, userId));

  if (!updatedUser) {
    return new NextResponse("Failed to update social media settings", {
      status: 500,
    });
  }

  return NextResponse.json(updatedUser);
}
