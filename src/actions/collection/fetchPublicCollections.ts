"use server";

import { db } from "@/db";
import { CollectionsTable } from "@/schema";
import { eq } from "drizzle-orm";

export async function fetchPublicCollections() {
  const collections = await db.query.CollectionsTable.findMany({
    where: eq(CollectionsTable.visibility, "public"),
  });

  return { data: collections };
}
