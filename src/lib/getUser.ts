import { auth } from "@clerk/nextjs/server";

export async function getUser() {
  const { userId }: { userId: string | null } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  return Number(userId);
}
