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
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
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
import { ReadOnlyLinkGrid } from "@/components/collection/ReadOnlyLinkGrid";
import { AccessDenied } from "@/components/collection/AccessDenied";
import { Link as LinkType } from "@/types/types";
import { Footer } from "@/components/layout/Footer";

interface Collection {
  id: string;
  title: string;
  description: string;
  author: string | null;
  likes: number;
  totalLinks: number;
  userId: string;
  visibility: string;
  sharedEmails: string[];
  createdAt: Date;
  updatedAt: Date;
  authorUsername?: string | null;
}

export default function CollectionPage() {
  const params = useParams();
  const { userId, isSignedIn, isLoaded } = useAuth();
  const {
    toast,
    success: toastSuccess,
    error: toastError,
    info: toastInfo,
  } = useToast();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [links, setLinks] = useState<LinkType[]>([]);
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

  // Loading states for buttons to prevent flash
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  const collectionId = params.id as string;

  useEffect(() => {
    const fetchCollection = async () => {
      if (!collectionId) return;

      setIsLoading(true);
      try {
        const result = await getSingleCollectionAction(collectionId);

        // Check for rate limiting
        if (result.error && result.retryAfter) {
          const { showRateLimitToast } = await import(
            "@/components/ui/rate-limit-toast"
          );
          showRateLimitToast({
            retryAfter: result.retryAfter * 60,
            message: "Too many collection requests. Please try again later.",
          });
          setIsLoading(false);
          return;
        }

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

          // Check for rate limiting
          if (linksResult.error && linksResult.retryAfter) {
            const { showRateLimitToast } = await import(
              "@/components/ui/rate-limit-toast"
            );
            showRateLimitToast({
              retryAfter: linksResult.retryAfter * 60,
              message: "Too many link requests. Please try again later.",
            });
            setIsLinksLoading(false);
            return;
          }

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
        setIsCheckingStatus(true);
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
        } finally {
          setIsCheckingStatus(false);
        }
      } else if (isLoaded && !userId) {
        console.log(
          "Auth loaded but no user, setting isLiked and isSaved to false"
        );
        setIsLiked(false);
        setIsSaved(false);
        setIsCheckingStatus(false);
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
          color: "bg-primary/10 text-primary border-primary/20",
        };
      case "private":
        return {
          icon: <Lock className="h-4 w-4" />,
          label: "Private",
          description: "Only you can view",
          color: "bg-destructive/10 text-destructive border-destructive/20",
        };
      case "protected":
        return {
          icon: <Shield className="h-4 w-4" />,
          label: "Protected",
          description: "Only you and invited people can view",
          color: "bg-secondary/50 text-secondary-foreground border-secondary",
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

    // Optimistic update
    const previousIsLiked = isLiked;
    const previousLikes = collection?.likes || 0;
    setIsLiked(!isLiked);
    setCollection((prev) =>
      prev
        ? { ...prev, likes: isLiked ? prev.likes - 1 : prev.likes + 1 }
        : null
    );
    setIsLiking(true);

    try {
      if (isLiked) {
        const result = await unlikeCollectionAction(collectionId);

        // Check for rate limiting
        if (result.error && result.retryAfter) {
          setIsLiked(previousIsLiked);
          setCollection((prev) =>
            prev ? { ...prev, likes: previousLikes } : null
          );
          const { showRateLimitToast } = await import(
            "@/components/ui/rate-limit-toast"
          );
          showRateLimitToast({
            retryAfter: result.retryAfter * 60,
            message: "Too many unlike attempts. Please try again later.",
          });
          return;
        }

        if (!result.success) {
          // Revert optimistic update
          setIsLiked(previousIsLiked);
          setCollection((prev) =>
            prev ? { ...prev, likes: previousLikes } : null
          );
          toastError({
            title: "Unlike Failed",
            description: result.error || "Failed to unlike collection",
          });
        }
      } else {
        const result = await likeCollectionAction(collectionId);

        // Check for rate limiting
        if (result.error && result.retryAfter) {
          setIsLiked(previousIsLiked);
          setCollection((prev) =>
            prev ? { ...prev, likes: previousLikes } : null
          );
          const { showRateLimitToast } = await import(
            "@/components/ui/rate-limit-toast"
          );
          showRateLimitToast({
            retryAfter: result.retryAfter * 60,
            message: "Too many like attempts. Please try again later.",
          });
          return;
        }

        if (!result.success) {
          // Revert optimistic update
          setIsLiked(previousIsLiked);
          setCollection((prev) =>
            prev ? { ...prev, likes: previousLikes } : null
          );
          toastError({
            title: "Like Failed",
            description: result.error || "Failed to like collection",
          });
        }
      }
    } catch (error) {
      // Revert optimistic update
      setIsLiked(previousIsLiked);
      setCollection((prev) =>
        prev ? { ...prev, likes: previousLikes } : null
      );
      toastError({
        title: "Action Failed",
        description: "Something went wrong. Please try again.",
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

      // Check for rate limiting
      if (result.error && result.retryAfter) {
        const { showRateLimitToast } = await import(
          "@/components/ui/rate-limit-toast"
        );
        showRateLimitToast({
          retryAfter: result.retryAfter * 60,
          message: "Too many duplicate attempts. Please try again later.",
        });
        return;
      }

      if (result.success) {
        toastSuccess({
          title: "Collection Duplicated!",
          description: "The collection has been added to your account.",
        });
        setDuplicateDialogOpen(false);

        // Redirect to dashboard with new collection
        window.open(`/dashboard?collectionId=${result.data.id}`, "_blank");
      } else {
        toastError({
          title: "Duplicate Failed",
          description: result.error || "Failed to duplicate collection",
        });
      }
    } catch (error) {
      toastError({
        title: "Duplicate Failed",
        description: "Something went wrong. Please try again.",
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

    // Optimistic update
    const previousIsSaved = isSaved;
    setIsSaved(!isSaved);
    setIsSaving(true);

    try {
      if (previousIsSaved) {
        console.log("About to call unsaveCollectionAction");
        const result = await unsaveCollectionAction(collectionId);
        console.log("Unsave action result:", result);

        // Check for rate limiting
        if (result.error && result.retryAfter) {
          setIsSaved(previousIsSaved);
          const { showRateLimitToast } = await import(
            "@/components/ui/rate-limit-toast"
          );
          showRateLimitToast({
            retryAfter: result.retryAfter * 60,
            message: "Too many unsave attempts. Please try again later.",
          });
          return;
        }

        if (!result.success) {
          // Revert optimistic update
          setIsSaved(previousIsSaved);
          console.log("Unsave failed:", result.error);
          toastError({
            title: "Unsave Failed",
            description: result.error || "Failed to unsave collection",
          });
        } else {
          console.log("Unsave successful");
          toastInfo({
            title: "Collection Removed",
            description: "Collection removed from saved collections.",
          });
        }
      } else {
        console.log("About to call saveCollectionAction");
        const result = await saveCollectionAction(collectionId);
        console.log("Save action result:", result);

        // Check for rate limiting
        if (result.error && result.retryAfter) {
          setIsSaved(previousIsSaved);
          const { showRateLimitToast } = await import(
            "@/components/ui/rate-limit-toast"
          );
          showRateLimitToast({
            retryAfter: result.retryAfter * 60,
            message: "Too many save attempts. Please try again later.",
          });
          return;
        }

        if (!result.success) {
          // Revert optimistic update
          setIsSaved(previousIsSaved);
          console.log("Save failed:", result.error);
          toastError({
            title: "Save Failed",
            description: result.error || "Failed to save collection",
          });
        } else {
          console.log("Save successful");
          toastSuccess({
            title: "Collection Saved!",
            description: "You can find it in your saved collections.",
          });
        }
      }
    } catch (error) {
      // Revert optimistic update
      setIsSaved(previousIsSaved);
      console.error("Error in handleSave:", error);
      toastError({
        title: "Save Failed",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Simple Navigation Header */}
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
          <div className="container mx-auto px-4 flex h-14 items-center justify-between">
            <Link href="/" className="font-bold text-xl">
              Cur8t
            </Link>
            <nav className="flex items-center space-x-6">
              <Link
                href="/add-extension"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Add Extension
              </Link>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
            </nav>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="space-y-8">
            {/* Header skeleton */}
            <div className="space-y-6">
              <div className="space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-5 w-1/2" />
              </div>
              <div className="flex flex-wrap gap-3">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-18" />
                <Skeleton className="h-9 w-16" />
              </div>
              <div className="flex flex-wrap gap-3">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-22" />
                <Skeleton className="h-5 w-28" />
              </div>
            </div>

            {/* Content skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-56 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state (access denied, not found, etc.)
  if (error) {
    return (
      <AccessDenied
        error={error}
        collectionTitle={collection?.title}
        collectionId={collectionId}
      />
    );
  }

  // Show not found if no collection
  if (!collection) {
    return (
      <AccessDenied error="Collection not found" collectionId={collectionId} />
    );
  }

  const visibilityInfo = getVisibilityInfo();

  return (
    <div className="min-h-screen bg-background">
      {/* Simple Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
        <div className="container mx-auto px-4 flex h-14 items-center justify-between">
          <Link href="/" className="font-bold text-xl">
            Cur8t
          </Link>
          <nav className="flex items-center space-x-6">
            <Link
              href="/add-extension"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Add Extension
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Collection Header */}
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="space-y-4 flex-1">
                <div className="space-y-3">
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    {collection.title}
                  </h1>
                  {collection.description && (
                    <p className="text-base text-muted-foreground leading-relaxed max-w-4xl">
                      {collection.description}
                    </p>
                  )}
                </div>

                {/* Collection Metadata */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {collection.authorUsername ? (
                      <button
                        onClick={() =>
                          window.open(
                            `/profile/${collection.authorUsername}`,
                            "_blank"
                          )
                        }
                        className="flex items-center gap-2 hover:text-foreground transition-colors group"
                      >
                        <Avatar className="h-5 w-5 group-hover:ring-1 group-hover:ring-primary/20 transition-all">
                          <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                            {collection.author?.charAt(0)?.toUpperCase() || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">By {collection.author}</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded-full bg-muted">
                          <User className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-sm">By {collection.author}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="p-1 rounded-full bg-muted">
                      <Link2 className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-sm">
                      {collection.totalLinks} links
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="p-1 rounded-full bg-muted">
                      <Heart className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-sm">{collection.likes} likes</span>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="p-1 rounded-full bg-muted">
                      <Clock className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-sm">
                      Updated {collection.updatedAt.toLocaleDateString()}
                    </span>
                  </div>

                  {visibilityInfo && (
                    <Badge
                      variant="secondary"
                      className={`flex items-center gap-1.5 px-2.5 py-1 text-xs ${visibilityInfo.color}`}
                    >
                      {visibilityInfo.icon}
                      <span className="text-xs">{visibilityInfo.label}</span>
                    </Badge>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyLink}
                  className="flex items-center gap-2 hover:bg-muted transition-colors text-sm"
                  disabled={linkCopied}
                >
                  {linkCopied ? (
                    <Check className="h-3.5 w-3.5 text-primary" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  {linkCopied ? "Copied!" : "Copy Link"}
                </Button>

                {/* Save Button - Show skeleton while checking status */}
                {isCheckingStatus ? (
                  <Skeleton className="h-9 w-16" />
                ) : (
                  <Button
                    variant={isSaved ? "default" : "outline"}
                    size="sm"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 transition-colors text-sm"
                  >
                    <Bookmark
                      className="h-3.5 w-3.5 transition-colors"
                      style={{
                        fill: isSaved ? "currentColor" : "none",
                      }}
                    />
                    {isSaving ? "..." : isSaved ? "Unsave" : "Save"}
                  </Button>
                )}

                {!isOwner && (
                  <>
                    {/* Like Button - Show skeleton while checking status */}
                    {isCheckingStatus ? (
                      <Skeleton className="h-9 w-16" />
                    ) : (
                      <Button
                        variant={isLiked ? "default" : "outline"}
                        size="sm"
                        onClick={handleLike}
                        disabled={isLiking}
                        className="flex items-center gap-2 transition-colors text-sm"
                      >
                        <Heart
                          className="h-3.5 w-3.5 transition-colors"
                          style={{
                            fill: isLiked ? "currentColor" : "none",
                          }}
                        />
                        {isLiking ? "..." : isLiked ? "Unlike" : "Like"}
                      </Button>
                    )}

                    {isSignedIn ? (
                      <Dialog
                        open={duplicateDialogOpen}
                        onOpenChange={setDuplicateDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2 hover:bg-muted transition-colors text-sm"
                          >
                            <Download className="h-3.5 w-3.5" />
                            Duplicate
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="text-lg">
                              Duplicate Collection
                            </DialogTitle>
                            <DialogDescription className="text-sm leading-relaxed">
                              This will create a copy of &ldquo;
                              {collection?.title}
                              &rdquo; in your account with all its links.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter className="gap-3">
                            <Button
                              variant="outline"
                              onClick={() => setDuplicateDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleDuplicate}
                              disabled={isDuplicating}
                              className="bg-primary hover:bg-primary/90"
                            >
                              {isDuplicating
                                ? "Duplicating..."
                                : "Duplicate to My Account"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDuplicate}
                        className="flex items-center gap-2 hover:bg-muted transition-colors text-sm"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Duplicate
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Collection Content */}
          <div className="space-y-8">
            {/* Owner Actions */}
            {isOwner && (
              <div className="flex flex-col sm:flex-row gap-4 p-4 border border-border rounded-lg bg-muted/50">
                <div className="flex-1 space-y-1">
                  <h3 className="font-semibold text-base flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" />
                    Collection Owner
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Manage this collection in your dashboard to add links,
                    change settings, and more.
                  </p>
                </div>
                <Button
                  asChild
                  className="shrink-0 transition-colors"
                  size="sm"
                >
                  <a
                    href={`/dashboard?collectionId=${encodeURIComponent(collectionId)}`}
                    className="flex items-center gap-2"
                  >
                    <Settings className="h-3.5 w-3.5" />
                    Manage in Dashboard
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            )}

            {/* Collection Links */}
            <ReadOnlyLinkGrid links={links} isLoading={isLinksLoading} />
          </div>
        </div>
      </div>

      <Footer />

      {/* Authentication Dialog */}
      <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Sign in required</DialogTitle>
            <DialogDescription className="text-base leading-relaxed">
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
              <Button className="flex-1 bg-primary hover:bg-primary/90">
                Sign Up
              </Button>
            </SignUpButton>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
