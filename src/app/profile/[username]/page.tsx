import { notFound } from "next/navigation";
import { db } from "@/db";
import { UsersTable, CollectionsTable } from "@/schema";
import { eq, and } from "drizzle-orm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

async function getUserByUsername(username: string) {
  const users = await db
    .select()
    .from(UsersTable)
    .where(eq(UsersTable.username, username))
    .limit(1);

  return users[0] || null;
}

async function getUserPublicCollections(userId: string) {
  const collections = await db
    .select()
    .from(CollectionsTable)
    .where(
      and(
        eq(CollectionsTable.userId, userId),
        eq(CollectionsTable.visibility, "public")
      )
    );

  return collections;
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const user = await getUserByUsername(username);

  if (!user) {
    notFound();
  }

  const publicCollections = await getUserPublicCollections(user.id);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8 text-center">
          <Avatar className="mx-auto h-20 w-20 mb-4">
            <AvatarFallback className="text-lg">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            @{user.username}
          </p>
          <div className="flex justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>{publicCollections.length} Public Collections</span>
          </div>
        </div>

        {/* Collections Grid */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Public Collections</h2>

          {publicCollections.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">
                  This user hasn&apos;t made any collections public yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicCollections.map((collection) => (
                <Link key={collection.id} href={`/collection/${collection.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg line-clamp-2">
                            {collection.title}
                          </CardTitle>
                          <CardDescription className="mt-2 line-clamp-3">
                            {collection.description ||
                              "No description provided"}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>{collection.totalLinks} links</span>
                        <div className="flex items-center gap-2">
                          {collection.likes > 0 && (
                            <Badge variant="secondary">
                              ❤️ {collection.likes}
                            </Badge>
                          )}
                          <Badge variant="outline">Public</Badge>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Updated{" "}
                        {new Date(collection.updatedAt).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
