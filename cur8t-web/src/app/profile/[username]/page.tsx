"use client";

import { useState, useEffect, use } from "react";
import { notFound } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Footer } from "@/components/layout/Footer";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileLoadingSkeleton } from "@/components/profile/ProfileLoadingSkeleton";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { CollectionsSection } from "@/components/profile/CollectionsSection";
import { type User, type Collection, type SortOption } from "@/types/profile";

export default function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const [user, setUser] = useState<User | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [pinnedCollections, setPinnedCollections] = useState<Collection[]>([]);
  const [unpinnedCollections, setUnpinnedCollections] = useState<Collection[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await fetch(`/api/profile/${username}`);

        // Check for rate limiting first
        if (userResponse.status === 429) {
          const data = await userResponse.json().catch(() => ({}));
          const retryAfter =
            userResponse.headers.get("retry-after") || data.retryAfter || 60;

          const { showRateLimitToast } = await import(
            "@/components/ui/rate-limit-toast"
          );
          showRateLimitToast({
            retryAfter:
              typeof retryAfter === "string"
                ? parseInt(retryAfter) * 60
                : retryAfter * 60,
            message: "Too many profile requests. Please try again later.",
          });
          return;
        }

        if (!userResponse.ok) {
          if (userResponse.status === 404) {
            notFound();
          }
          throw new Error("Failed to fetch user");
        }
        const userData = await userResponse.json();
        setUser(userData.user);

        // Set collections and apply initial sorting
        const collectionsData = userData.collections.map(
          (
            collection: Collection & { createdAt: string; updatedAt: string }
          ) => ({
            ...collection,
            createdAt: new Date(collection.createdAt),
            updatedAt: new Date(collection.updatedAt),
          })
        );

        setCollections(collectionsData);

        // Separate pinned and unpinned collections
        const pinnedIds = userData.user.pinnedCollections || [];
        const pinned = collectionsData.filter((c: Collection) =>
          pinnedIds.includes(c.id)
        );
        const unpinned = collectionsData.filter(
          (c: Collection) => !pinnedIds.includes(c.id)
        );

        setPinnedCollections(pinned);
        setUnpinnedCollections(unpinned);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username, toast]);

  if (loading) {
    return <ProfileLoadingSkeleton />;
  }

  if (!user) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <ProfileHeader />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex gap-6">
          <ProfileSidebar user={user} collections={collections} />
          <CollectionsSection
            pinnedCollections={pinnedCollections}
            unpinnedCollections={unpinnedCollections}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
