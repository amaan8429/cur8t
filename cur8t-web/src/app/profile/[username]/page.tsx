"use client";

import { useState, useEffect, use } from "react";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";
import {
  Heart,
  Link2,
  Calendar,
  User,
  Share,
  Copy,
  Check,
  Grid3X3,
  List,
  SortAsc,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Twitter,
  Facebook,
  Linkedin,
} from "lucide-react";
import { Footer } from "@/components/ui/footer";

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
}

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

type SortOption = "recent" | "likes" | "links" | "alphabetical";
type ViewMode = "grid" | "list";

const ITEMS_PER_PAGE = 9;

export default function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const [user, setUser] = useState<User | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<Collection[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await fetch(`/api/profile/${username}`);
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

  // Apply sorting whenever collections or sortBy changes
  useEffect(() => {
    const sorted = [...collections].sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        case "likes":
          return b.likes - a.likes;
        case "links":
          return b.totalLinks - a.totalLinks;
        case "alphabetical":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
    setFilteredCollections(sorted);
    setCurrentPage(1); // Reset to first page when sorting changes
  }, [collections, sortBy]);

  const totalPages = Math.ceil(filteredCollections.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCollections = filteredCollections.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleShareProfile = async () => {
    const profileUrl = `${window.location.origin}/profile/${user?.username}`;
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      toast({
        title: "Profile link copied!",
        description: "Share this link to let others view this profile.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy link",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSocialShare = (platform: string) => {
    const profileUrl = `${window.location.origin}/profile/${user?.username}`;
    const text = `Check out ${user?.name}'s bookmark collections on Bukmarks!`;

    let shareUrl = "";
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(profileUrl)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="animate-pulse space-y-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-6"></div>
              <div className="h-8 bg-muted rounded w-48 mx-auto mb-3"></div>
              <div className="h-6 bg-muted rounded w-32 mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-48 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header with Theme Toggle */}
        <div className="flex justify-end mb-6">
          <ModeToggle />
        </div>

        {/* Profile Header */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <Avatar className="mx-auto h-24 w-24 mb-6 ring-4 ring-border shadow-lg">
              <AvatarFallback className="text-2xl bg-primary/10 text-primary font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <h1 className="text-4xl font-bold mb-3 text-foreground">
              {user.name}
            </h1>

            <p className="text-xl text-muted-foreground mb-6">
              @{user.username}
            </p>

            <div className="flex justify-center items-center gap-6 text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-muted">
                  <Link2 className="h-4 w-4" />
                </div>
                <span className="font-medium">
                  {collections.length} Public Collections
                </span>
              </div>

              <Separator orientation="vertical" className="h-6" />

              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-muted">
                  <Heart className="h-4 w-4" />
                </div>
                <span className="font-medium">
                  {collections.reduce(
                    (total, collection) => total + collection.likes,
                    0
                  )}{" "}
                  Total Likes
                </span>
              </div>
            </div>

            {/* Share Profile Button */}
            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                onClick={handleShareProfile}
                disabled={copied}
                className="flex items-center gap-2"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? "Copied!" : "Copy Profile Link"}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Share className="h-4 w-4" />
                    Share Profile
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => handleSocialShare("twitter")}
                  >
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSocialShare("facebook")}
                  >
                    <Facebook className="h-4 w-4 mr-2" />
                    Facebook
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSocialShare("linkedin")}
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Collections Section */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-semibold text-foreground">
                Public Collections
              </h2>
              <Badge variant="secondary" className="text-sm">
                {collections.length}
              </Badge>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Sort Options */}
              <Select
                value={sortBy}
                onValueChange={(value: SortOption) => setSortBy(value)}
              >
                <SelectTrigger className="w-40">
                  <SortAsc className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="likes">Most Liked</SelectItem>
                  <SelectItem value="links">Most Links</SelectItem>
                  <SelectItem value="alphabetical">A-Z</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none border-l"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {collections.length === 0 ? (
            <Card className="border-dashed border-border/30">
              <CardContent className="text-center py-16">
                <div className="p-4 rounded-full bg-muted/50 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No Public Collections Yet
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  This user hasn&apos;t made any collections public yet. Check
                  back later to see their awesome bookmarks!
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Collections Grid/List */}
              <div
                className={`${
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }`}
              >
                {paginatedCollections.map((collection) => (
                  <Link
                    key={collection.id}
                    href={`/collection/${collection.id}`}
                  >
                    <Card
                      className={`group hover:shadow-sm transition-all duration-300 cursor-pointer border-border/30 hover:border-border/50 ${
                        viewMode === "list" ? "flex flex-row" : "h-full"
                      }`}
                    >
                      <CardHeader
                        className={`${viewMode === "list" ? "flex-1" : "pb-3"}`}
                      >
                        <div className="flex items-start justify-between">
                          <div
                            className={`flex-1 ${viewMode === "grid" ? "space-y-2" : ""}`}
                          >
                            <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                              {collection.title}
                            </CardTitle>
                            <CardDescription className="line-clamp-3 text-muted-foreground">
                              {collection.description ||
                                "No description provided"}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent
                        className={`${viewMode === "list" ? "flex items-center" : "pt-0"}`}
                      >
                        <div
                          className={`${
                            viewMode === "list"
                              ? "flex items-center gap-6"
                              : "space-y-3"
                          }`}
                        >
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Link2 className="h-3.5 w-3.5" />
                              <span>{collection.totalLinks}</span>
                            </div>

                            {collection.likes > 0 && (
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Heart className="h-3.5 w-3.5" />
                                <span>{collection.likes}</span>
                              </div>
                            )}

                            <Badge variant="outline" className="text-xs">
                              Public
                            </Badge>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>
                              Updated{" "}
                              {new Date(
                                collection.updatedAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-10"
                        >
                          {page}
                        </Button>
                      )
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
