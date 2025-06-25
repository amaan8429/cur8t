"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth, SignInButton, SignUpButton } from "@clerk/nextjs";
import {
  Clock,
  Eye,
  Link2,
  User,
  Heart,
  Share,
  Lock,
  Shield,
  Settings,
  Copy,
  Download,
  Check,
  Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getSingleCollectionAction } from "@/actions/collection/getSingleCollection";
import { getCollectionLinksAction } from "@/actions/linkActions/getCollectionLinks";
import {
  likeCollectionAction,
  unlikeCollectionAction,
  checkIfLikedAction,
} from "@/actions/collection/likeCollection";
import { duplicatePublicCollectionAction } from "@/actions/collection/duplicatePublicCollection";
import {
  saveCollectionAction,
  unsaveCollectionAction,
  checkIfSavedAction,
} from "@/actions/collection/saveCollection";
import { ReadOnlyLinkGrid } from "@/components/SingleCollection/read-only-link-grid";
import { AccessDenied } from "@/components/SingleCollection/access-denied";
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
  const { userId, isSignedIn, isLoaded } = useAuth();
  const { toast } = useToast();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isLinksLoading, setIsLinksLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authDialogAction, setAuthDialogAction] = useState<
    "like" | "save" | "duplicate"
  >("like");

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

  // Separate effect to check like status when user auth loads
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (isLoaded && userId && collectionId) {
        console.log("Auth loaded, checking like status. UserId:", userId);
        try {
          const likeStatus = await checkIfLikedAction(collectionId);
          console.log("Like status check result:", likeStatus);
          setIsLiked(likeStatus.isLiked || false);
          console.log("Set isLiked state to:", likeStatus.isLiked || false);

          const saveStatus = await checkIfSavedAction(collectionId);
          console.log("Save status check result:", saveStatus);
          setIsSaved(saveStatus.isSaved || false);
          console.log("Set isSaved state to:", saveStatus.isSaved || false);
        } catch (error) {
          console.error("Error checking like/save status:", error);
          setIsLiked(false);
          setIsSaved(false);
        }
      } else if (isLoaded && !userId) {
        console.log(
          "Auth loaded but no user, setting isLiked and isSaved to false"
        );
        setIsLiked(false);
        setIsSaved(false);
      }
    };

    checkLikeStatus();
  }, [isLoaded, userId, collectionId]);

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

  const copyLink = async () => {
    const url = `${window.location.origin}/collection/${collectionId}`;
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      toast({
        title: "Link copied!",
        description: "Collection link has been copied to your clipboard.",
      });
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy link",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLike = async () => {
    if (!isSignedIn) {
      setAuthDialogAction("like");
      setAuthDialogOpen(true);
      return;
    }

    console.log("HandleLike called. Current isLiked state:", isLiked);
    setIsLiking(true);
    try {
      if (isLiked) {
        const result = await unlikeCollectionAction(collectionId);
        if (result.success) {
          setIsLiked(false);
          setCollection((prev) =>
            prev ? { ...prev, likes: prev.likes - 1 } : null
          );
          toast({
            title: "Collection unliked",
          });
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to unlike collection",
            variant: "destructive",
          });
        }
      } else {
        console.log("About to call likeCollectionAction");
        const result = await likeCollectionAction(collectionId);
        console.log("Like action result:", result);
        if (result.success) {
          console.log("Like successful, updating state to true");
          setIsLiked(true);
          setCollection((prev) =>
            prev ? { ...prev, likes: prev.likes + 1 } : null
          );
          toast({
            title: "Collection liked!",
          });
        } else {
          console.log("Like failed:", result.error);
          toast({
            title: "Error",
            description: result.error || "Failed to like collection",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLiking(false);
    }
  };

  const handleDuplicate = async () => {
    if (!isSignedIn) {
      setAuthDialogAction("duplicate");
      setAuthDialogOpen(true);
      return;
    }

    setIsDuplicating(true);
    try {
      const result = await duplicatePublicCollectionAction(collectionId, {
        includeLinks: true,
        visibility: "private",
      });

      if (result.success) {
        toast({
          title: "Collection duplicated!",
          description: "The collection has been added to your account.",
        });
        setDuplicateDialogOpen(false);

        // Redirect to dashboard with new collection
        window.open(`/dashboard?collectionId=${result.data.id}`, "_blank");
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to duplicate collection",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDuplicating(false);
    }
  };

  const handleSave = async () => {
    if (!isSignedIn) {
      setAuthDialogAction("save");
      setAuthDialogOpen(true);
      return;
    }

    console.log("HandleSave called. Current isSaved state:", isSaved);
    setIsSaving(true);
    try {
      if (isSaved) {
        console.log("About to call unsaveCollectionAction");
        const result = await unsaveCollectionAction(collectionId);
        console.log("Unsave action result:", result);
        if (result.success) {
          console.log("Unsave successful, updating state to false");
          setIsSaved(false);
          toast({
            title: "Collection removed from saved",
          });
        } else {
          console.log("Unsave failed:", result.error);
          toast({
            title: "Error",
            description: result.error || "Failed to unsave collection",
            variant: "destructive",
          });
        }
      } else {
        console.log("About to call saveCollectionAction");
        const result = await saveCollectionAction(collectionId);
        console.log("Save action result:", result);
        if (result.success) {
          console.log("Save successful, updating state to true");
          setIsSaved(true);
          toast({
            title: "Collection saved!",
            description: "You can find it in your saved collections.",
          });
        } else {
          console.log("Save failed:", result.error);
          toast({
            title: "Error",
            description: result.error || "Failed to save collection",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
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
              <ModeToggle />

              <Button
                variant="outline"
                size="sm"
                onClick={copyLink}
                className="flex items-center gap-2"
                disabled={linkCopied}
              >
                {linkCopied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {linkCopied ? "Copied!" : "Copy Link"}
              </Button>

              <Button
                variant={isSaved ? "default" : "outline"}
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className={`flex items-center gap-2 transition-all ${
                  isSaved
                    ? "bg-blue-500 hover:bg-blue-600 text-white border-blue-500 hover:border-blue-600"
                    : "hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-950"
                }`}
              >
                <Bookmark
                  className={`h-4 w-4 transition-all ${
                    isSaved
                      ? "text-white fill-white"
                      : "hover:text-blue-500 fill-none"
                  }`}
                  style={{
                    fill: isSaved ? "currentColor" : "none",
                  }}
                />
                {isSaving ? "..." : isSaved ? "Unsave" : "Save"}
              </Button>

              {!isOwner && (
                <>
                  <Button
                    variant={isLiked ? "default" : "outline"}
                    size="sm"
                    onClick={handleLike}
                    disabled={isLiking}
                    className={`flex items-center gap-2 transition-all ${
                      isLiked
                        ? "bg-red-500 hover:bg-red-600 text-white border-red-500 hover:border-red-600"
                        : "hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-950"
                    }`}
                  >
                    <Heart
                      className={`h-4 w-4 transition-all ${
                        isLiked
                          ? "text-white fill-white"
                          : "hover:text-red-500 fill-none"
                      }`}
                      style={{
                        fill: isLiked ? "currentColor" : "none",
                      }}
                    />
                    {isLiking ? "..." : isLiked ? "Unlike" : "Like"}
                  </Button>

                  <Dialog
                    open={duplicateDialogOpen}
                    onOpenChange={setDuplicateDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Duplicate
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Duplicate Collection</DialogTitle>
                        <DialogDescription>
                          This will create a copy of &ldquo;{collection?.title}
                          &rdquo; in your account with all its links.
                          {!isSignedIn && " You need to sign in first."}
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="secondary"
                          onClick={() => setDuplicateDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleDuplicate}
                          disabled={isDuplicating || !isSignedIn}
                        >
                          {isDuplicating
                            ? "Duplicating..."
                            : "Duplicate to My Account"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              )}
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
        <div className="space-y-6">
          {/* Owner Actions */}
          {isOwner && (
            <div className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg bg-accent/50">
              <div className="flex-1">
                <h3 className="font-semibold text-sm">Collection Owner</h3>
                <p className="text-sm text-muted-foreground">
                  Manage this collection in your dashboard to add links, change
                  settings, and more.
                </p>
              </div>
              <Button asChild className="shrink-0">
                <a
                  href={`/dashboard?collectionId=${encodeURIComponent(collectionId)}`}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Manage in Dashboard
                </a>
              </Button>
            </div>
          )}

          {/* Collection Links */}
          <ReadOnlyLinkGrid links={links} isLoading={isLinksLoading} />
        </div>
      </div>

      {/* Authentication Dialog */}
      <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in required</DialogTitle>
            <DialogDescription>
              You need to sign in to {authDialogAction} this collection.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row gap-3">
            <SignInButton mode="modal">
              <Button variant="outline" className="flex-1">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className="flex-1">Sign Up</Button>
            </SignUpButton>
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setAuthDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
