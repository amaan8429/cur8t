"use client";

import React, { useEffect, useState } from "react";
import {
  Star,
  Calendar,
  User,
  TrendingUp,
  Clock,
  Link2,
  Plus,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  fetchPublicCollections,
  PublicCollection,
} from "@/actions/collection/fetchPublicCollections";
import {
  fetchSavedCollections,
  SavedCollection,
} from "@/actions/collection/fetchSavedCollections";
import {
  getHomepageCollections,
  HomepageCollection,
} from "@/actions/platform/homepageCollections";
import { getUserInfoAction } from "@/actions/user/getUserInfo";
import { Collection } from "@/types/types";
import Link from "next/link";
import { ModeToggle } from "@/components/layout/ModeToggle";
import { Footer } from "@/components/layout/Footer";
import { useUser } from "@clerk/nextjs";

// Union type for collections that include author info
type CollectionWithAuthor = {
  id: string;
  title: string;
  author: string;
  authorUsername: string | null;
  likes: number;
  description: string;
  userId: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  visibility: string;
  sharedEmails: string[];
  totalLinks: number;
};

export default function ExplorePage() {
  const { user, isLoaded } = useUser();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [trendingCollections, setTrendingCollections] = useState<
    PublicCollection[]
  >([]);
  const [recentCollections, setRecentCollections] = useState<
    PublicCollection[]
  >([]);
  const [savedCollections, setSavedCollections] = useState<SavedCollection[]>(
    []
  );
  const [newCollections, setNewCollections] = useState<HomepageCollection[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"explore" | "events">("explore");
  const [userStats, setUserStats] = useState({
    totalSavedCollections: 0,
  });
  const [databaseUser, setDatabaseUser] = useState<{
    id: string;
    name: string;
    email: string;
    username: string | null;
    totalCollections: number;
  } | null>(null);

  const loadExploreData = async () => {
    setIsLoading(true);
    try {
      // Always fetch public data
      const [trendingResponse, recentResponse, homepageResponse] =
        await Promise.all([
          fetchPublicCollections({ page: 1, limit: 5, sortBy: "likes" }),
          fetchPublicCollections({ page: 1, limit: 6, sortBy: "recent" }),
          getHomepageCollections(),
        ]);

      setTrendingCollections(trendingResponse.data);
      setRecentCollections(recentResponse.data);

      // Only fetch user-specific data if authenticated
      if (user) {
        try {
          // Fetch database user info to get the proper username
          const databaseUserInfo = await getUserInfoAction();
          if (databaseUserInfo) {
            setDatabaseUser(databaseUserInfo);
          }

          const savedResponse = await fetchSavedCollections({
            page: 1,
            limit: 5,
            sortBy: "recent",
          });
          if (savedResponse.data) {
            setSavedCollections(savedResponse.data);
            setUserStats({
              totalSavedCollections: savedResponse.pagination.total,
            });
          }
        } catch (error) {
          console.error("Failed to fetch saved collections:", error);
          // Don't fail the whole page if saved collections fail
        }
      }

      // Handle new collections for events timeline
      if (homepageResponse.success && homepageResponse.data) {
        setNewCollections(homepageResponse.data.new);
      }
    } catch (error) {
      console.error("Failed to fetch collections:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isLoaded) {
      loadExploreData();
    }
  }, [isLoaded, user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCollectionClick = (collectionId: string) => {
    window.open(`/collection/${collectionId}`, "_blank", "noopener,noreferrer");
  };

  const handleProfileClick = (
    e: React.MouseEvent,
    authorUsername: string | null
  ) => {
    e.stopPropagation();
    if (authorUsername) {
      window.open(
        `/profile/${authorUsername}`,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const CollectionCard = ({
    collection,
    isLarge = false,
  }: {
    collection: CollectionWithAuthor;
    isLarge?: boolean;
  }) => (
    <TooltipProvider>
      <Card
        className="group hover:bg-muted/50 transition-colors cursor-pointer border border-border/50 hover:border-border"
        onClick={() => handleCollectionClick(collection.id)}
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-10 w-10 mt-0.5">
              <AvatarFallback className="text-sm bg-primary/10 text-primary font-medium">
                {collection.author?.charAt(0)?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={(e) =>
                        handleProfileClick(e, collection.authorUsername)
                      }
                      className="text-sm text-muted-foreground hover:text-primary transition-colors truncate max-w-[100px]"
                    >
                      {truncateText(collection.author || "Anonymous", 12)}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{collection.author || "Anonymous"}</p>
                  </TooltipContent>
                </Tooltip>
                <span className="text-muted-foreground">/</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate max-w-[200px]">
                      {truncateText(collection.title, 25)}
                    </h3>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{collection.title}</p>
                  </TooltipContent>
                </Tooltip>
                <Badge variant="outline" className="text-xs px-2 py-0.5">
                  Public
                </Badge>
              </div>

              {collection.description && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {collection.description}
                </p>
              )}

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span>collection</span>
                </div>

                {collection.likes > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Star className="h-3 w-3" />
                    <span>{collection.likes}</span>
                  </div>
                )}

                <div className="flex items-center gap-1.5">
                  <Link2 className="h-3 w-3" />
                  <span>{collection.totalLinks}</span>
                </div>

                <span>
                  Updated {formatDate(collection.updatedAt.toString())}
                </span>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );

  const TimelineCard = ({
    collection,
  }: {
    collection: CollectionWithAuthor;
  }) => (
    <TooltipProvider>
      <div className="flex gap-4 pb-6">
        <div className="flex flex-col items-center">
          <div className="w-2 h-2 bg-primary rounded-full mt-3"></div>
          <div className="w-px bg-border flex-1 mt-2"></div>
        </div>
        <div className="flex-1">
          <Card
            className="group hover:bg-muted/50 transition-colors cursor-pointer border border-border/50 hover:border-border"
            onClick={() => handleCollectionClick(collection.id)}
          >
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary font-medium">
                    {collection.author?.charAt(0)?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={(e) =>
                            handleProfileClick(e, collection.authorUsername)
                          }
                          className="text-sm font-medium text-foreground hover:text-primary transition-colors truncate max-w-[120px]"
                        >
                          {truncateText(collection.author, 15)}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{collection.author}</p>
                      </TooltipContent>
                    </Tooltip>
                    <span className="text-xs text-muted-foreground">
                      created
                    </span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate max-w-[150px]">
                          {truncateText(collection.title, 20)}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{collection.title}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  {collection.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                      {collection.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Link2 className="h-3 w-3" />
                      <span>{collection.totalLinks} links</span>
                    </div>
                    <span>
                      {formatFullDate(collection.createdAt.toString())}
                    </span>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );

  const FeaturedSection = () => (
    <Card className="mb-8 border border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">
            Recently Updated Collections
          </CardTitle>
        </div>
        <CardDescription>
          Discover collections that have been recently updated by the community.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {isLoading
            ? [...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))
            : recentCollections
                .slice(0, 3)
                .map((collection) => (
                  <CollectionCard key={collection.id} collection={collection} />
                ))}
        </div>
      </CardContent>
    </Card>
  );

  const TrendingSection = () => (
    <TooltipProvider>
      <Card className="border border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Trending collections</h3>
              <span className="text-xs text-muted-foreground">today</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading
            ? [...Array(5)].map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="h-4 w-4 rounded-full flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <Skeleton className="h-3 w-3/4 mb-1" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-4 w-4 flex-shrink-0" />
                </div>
              ))
            : trendingCollections.map((collection, index) => (
                <div
                  key={collection.id}
                  className="flex items-start gap-3 p-3 -m-3 rounded-lg hover:bg-muted/50 transition-colors group cursor-pointer"
                  onClick={() => handleCollectionClick(collection.id)}
                >
                  <div className="flex items-center justify-center h-4 w-4 bg-primary text-primary-foreground rounded-full text-xs font-medium flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 text-xs mb-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={(e) =>
                              handleProfileClick(e, collection.authorUsername)
                            }
                            className="text-muted-foreground hover:text-primary truncate max-w-[80px]"
                          >
                            {truncateText(collection.author, 10)}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{collection.author}</p>
                        </TooltipContent>
                      </Tooltip>
                      <span className="text-muted-foreground">/</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="font-medium text-foreground group-hover:text-primary transition-colors truncate max-w-[120px]">
                            {truncateText(collection.title, 15)}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{collection.title}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {collection.description || "Collection of curated links"}
                    </p>
                  </div>
                  <Star className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </div>
              ))}

          <div className="pt-3 border-t border-border/50">
            <Link
              href="/explore"
              className="text-xs text-primary hover:underline"
            >
              See more trending collections →
            </Link>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );

  const SavedCollectionsSection = () => {
    // Show loading state while Clerk is determining authentication status
    if (!isLoaded) {
      return (
        <Card className="border border-border/50">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-32" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-3 w-3/4 mb-1" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      );
    }

    // Don't show this section if user is not authenticated
    if (!user) {
      return (
        <Card className="border border-border/50">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Join Cur8t</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <User className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-3">
                Sign up to save collections and track your favorites
              </p>
              <Link href="/sign-up">
                <Button size="sm" className="w-full">
                  Sign Up
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <TooltipProvider>
        <Card className="border border-border/50">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Your saved collections</h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-3 w-3/4 mb-1" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))
            ) : savedCollections.length > 0 ? (
              savedCollections.slice(0, 5).map((collection) => (
                <div
                  key={collection.id}
                  className="flex items-center gap-3 p-3 -m-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => handleCollectionClick(collection.id)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {collection.author?.charAt(0)?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-xs font-medium text-foreground truncate max-w-[180px]">
                          {truncateText(collection.title, 22)}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{collection.title}</p>
                      </TooltipContent>
                    </Tooltip>
                    <div className="text-xs text-muted-foreground">
                      {collection.totalLinks} links
                    </div>
                  </div>
                  <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Star className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-xs text-muted-foreground">
                  No saved collections yet
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </TooltipProvider>
    );
  };

  const EventsTimelineSection = () => (
    <Card className="border border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">New Collections Timeline</CardTitle>
        </div>
        <CardDescription>
          Recently created collections from the community (past week)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {isLoading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="flex gap-4 pb-6">
                <div className="flex flex-col items-center">
                  <Skeleton className="h-2 w-2 rounded-full mt-3" />
                  <div className="w-px bg-border flex-1 mt-2"></div>
                </div>
                <div className="flex-1">
                  <Card className="border border-border/50">
                    <CardContent className="p-5">
                      <div className="flex gap-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))
          ) : newCollections.length > 0 ? (
            newCollections.map((collection) => (
              <TimelineCard key={collection.id} collection={collection} />
            ))
          ) : (
            <div className="text-center py-12">
              <Plus className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-sm font-medium text-foreground mb-2">
                No new collections this week
              </h3>
              <p className="text-xs text-muted-foreground">
                Check back later for fresh content!
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const UserProfileSection = () => {
    // Show loading state while Clerk is determining authentication status
    if (!isLoaded) {
      return (
        <Card className="border border-border/50">
          <CardContent className="p-8 text-center">
            <Skeleton className="h-24 w-24 rounded-full mx-auto mb-6" />
            <Skeleton className="h-6 w-32 mx-auto mb-2" />
            <Skeleton className="h-4 w-24 mx-auto mb-6" />
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      );
    }

    if (!user) {
      return (
        <Card className="border border-border/50">
          <CardContent className="p-8 text-center">
            <Avatar className="h-24 w-24 mx-auto mb-6">
              <AvatarFallback className="text-3xl bg-muted text-muted-foreground">
                ?
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold mb-2">Welcome to Cur8t</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Discover amazing bookmark collections
            </p>

            <div className="space-y-3">
              <Link href="/sign-up">
                <Button className="w-full">Sign Up</Button>
              </Link>
              <Link href="/sign-in">
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Use database user info if available, fallback to Clerk user info
    const displayName =
      databaseUser?.name || user.firstName || user.username || "User";
    const profileUsername = databaseUser?.username;

    return (
      <Card className="border border-border/50">
        <CardContent className="p-8 text-center">
          {/* Make avatar and name clickable if user has username */}
          {profileUsername ? (
            <Link href={`/profile/${profileUsername}`} className="block group">
              <Avatar className="h-24 w-24 mx-auto mb-6 group-hover:ring-2 group-hover:ring-primary transition-all">
                <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                  {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                {truncateText(displayName, 20)}
              </h2>
              <p className="text-muted-foreground text-sm mb-6 group-hover:text-primary/80 transition-colors">
                @{truncateText(profileUsername, 20)}
              </p>
            </Link>
          ) : (
            <>
              <Avatar className="h-24 w-24 mx-auto mb-6">
                <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                  {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold mb-2">
                {truncateText(displayName, 20)}
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                Setup username in settings
              </p>
            </>
          )}

          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-border/30">
              <span className="text-muted-foreground">saved collections</span>
              <span className="text-primary font-medium">
                {userStats.totalSavedCollections}
              </span>
            </div>
            {databaseUser?.totalCollections !== undefined && (
              <div className="flex justify-between py-2 border-b border-border/30">
                <span className="text-muted-foreground">
                  public collections
                </span>
                <span className="text-primary font-medium">
                  {databaseUser.totalCollections}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <div className="border-b bg-background sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <nav className="flex space-x-8">
              <Button
                variant="ghost"
                className={`font-medium rounded-none ${
                  activeTab === "explore"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground"
                }`}
                onClick={() => setActiveTab("explore")}
              >
                Explore
              </Button>
              <Button
                variant="ghost"
                className={`font-medium rounded-none ${
                  activeTab === "events"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground"
                }`}
                onClick={() => setActiveTab("events")}
              >
                Events
              </Button>
            </nav>
            <ModeToggle />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar - User Profile */}
          <div className="w-80 flex-shrink-0">
            <UserProfileSection />
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-3xl">
            {activeTab === "explore" ? (
              <div className="space-y-8">
                <FeaturedSection />
              </div>
            ) : (
              <div className="space-y-8">
                <EventsTimelineSection />
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="w-80 flex-shrink-0 space-y-8">
            <TrendingSection />
            <SavedCollectionsSection />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
