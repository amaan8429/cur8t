"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  Clock,
  Eye,
  Link2,
  User,
  Heart,
  Share,
  Lock,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getSingleCollectionAction } from "@/actions/collection/getSingleCollection";
import { getCollectionLinksAction } from "@/actions/linkActions/getCollectionLinks";
import { ReadOnlyLinkGrid } from "@/components/SingleCollection/read-only-link-grid";
import { AccessDenied } from "@/components/SingleCollection/access-denied";
import { ManageCollectionLinks } from "@/components/SingleCollection/manage-collection";
import { Link } from "@/types/types";

interface Collection {
  id: string;
  title: string;
  description: string;
  author: string;
  likes: number;
  totalLinks: number;
  userId: string;
  visibility: string;
  sharedEmails: string[];
  createdAt: Date;
  updatedAt: Date;
}

export default function CollectionPage() {
  const params = useParams();
  const { userId } = useAuth();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isLinksLoading, setIsLinksLoading] = useState(false);

  const collectionId = params.id as string;

  useEffect(() => {
    const fetchCollection = async () => {
      if (!collectionId) return;

      setIsLoading(true);
      try {
        const result = await getSingleCollectionAction(collectionId);

        if (result.error) {
          setError(result.error);
          setIsLoading(false);
          return;
        }

        if (result.success && result.data) {
          setCollection({
            ...result.data,
            createdAt: new Date(result.data.createdAt),
            updatedAt: new Date(result.data.updatedAt),
          });

          // Fetch links if we have access to the collection
          setIsLinksLoading(true);
          const linksResult = await getCollectionLinksAction(collectionId);
          if (linksResult.success && linksResult.data) {
            setLinks(linksResult.data);
          }
          setIsLinksLoading(false);
        }
      } catch (error) {
        console.error("Error fetching collection:", error);
        setError("Failed to load collection");
      }
      setIsLoading(false);
    };

    fetchCollection();
  }, [collectionId]);

  const isOwner = userId && collection && collection.userId === userId;

  const getVisibilityInfo = () => {
    switch (collection?.visibility) {
      case "public":
        return {
          icon: <Eye className="h-4 w-4" />,
          label: "Public",
          description: "Anyone with the link can view",
        };
      case "private":
        return {
          icon: <Lock className="h-4 w-4" />,
          label: "Private",
          description: "Only you can view",
        };
      case "protected":
        return {
          icon: <Shield className="h-4 w-4" />,
          label: "Protected",
          description: "Only you and invited people can view",
        };
      default:
        return null;
    }
  };

  const copyLink = () => {
    const url = `${window.location.origin}/collection/${collectionId}`;
    navigator.clipboard.writeText(url);
    // You could add a toast notification here
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="space-y-6">
          {/* Header skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-4">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>

          {/* Content skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show error state (access denied, not found, etc.)
  if (error) {
    return <AccessDenied error={error} collectionTitle={collection?.title} />;
  }

  // Show not found if no collection
  if (!collection) {
    return <AccessDenied error="Collection not found" />;
  }

  const visibilityInfo = getVisibilityInfo();

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="space-y-6">
        {/* Collection Header */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                {collection.title}
              </h1>
              {collection.description && (
                <p className="text-lg text-muted-foreground">
                  {collection.description}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyLink}
                className="flex items-center gap-2"
              >
                <Share className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Collection Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>By {collection.author}</span>
            </div>

            <div className="flex items-center gap-1">
              <Link2 className="h-4 w-4" />
              <span>{collection.totalLinks} links</span>
            </div>

            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>{collection.likes} likes</span>
            </div>

            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Updated {collection.updatedAt.toLocaleDateString()}</span>
            </div>

            {visibilityInfo && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {visibilityInfo.icon}
                {visibilityInfo.label}
              </Badge>
            )}
          </div>
        </div>

        {/* Collection Content */}
        <div>
          {isOwner ? (
            // Owner can manage the collection (edit, add links, etc.)
            <ManageCollectionLinks collectionId={collectionId} />
          ) : (
            // Non-owners get read-only view
            <ReadOnlyLinkGrid links={links} isLoading={isLinksLoading} />
          )}
        </div>
      </div>
    </div>
  );
}
