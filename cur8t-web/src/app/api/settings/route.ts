import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { UsersTable } from "@/schema";
import { eq } from "drizzle-orm";

async function upsertUserProfile(
  userId: string,
  data: {
    firstName: string;
    lastName: string;
  }
) {
  try {
    const result = db
      .update(UsersTable)
      .set({
        name: `${data.firstName} ${data.lastName}`,
      })
      .where(eq(UsersTable.id, userId));

    return result;
  } catch (error) {
    console.error("Error upserting user profile:", error);
    throw error;
  }
}

export async function PUT(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { firstName, lastName } = body;

    const updatedUser = await upsertUserProfile(userId, {
      firstName,
      lastName,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user settings:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
