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
  Github,
  Instagram,
  Globe,
  Pin,
  Book,
  MapPin,
  Mail,
} from "lucide-react";
import { Footer } from "@/components/layout/Footer";

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  bio?: string;
  twitterUsername?: string;
  linkedinUsername?: string;
  githubUsername?: string;
  instagramUsername?: string;
  personalWebsite?: string;
  showSocialLinks?: boolean;
  pinnedCollections?: string[];
  totalCollections?: number;
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

const ITEMS_PER_PAGE = 6;

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

  // Apply sorting whenever unpinned collections or sortBy changes
  useEffect(() => {
    const sorted = [...unpinnedCollections].sort((a, b) => {
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
  }, [unpinnedCollections, sortBy]);

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

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "twitter":
        return <Twitter className="h-4 w-4" />;
      case "linkedin":
        return <Linkedin className="h-4 w-4" />;
      case "github":
        return <Github className="h-4 w-4" />;
      case "instagram":
        return <Instagram className="h-4 w-4" />;
      case "website":
        return <Globe className="h-4 w-4" />;
      default:
        return <ExternalLink className="h-4 w-4" />;
    }
  };

  const getSocialUrl = (platform: string, username: string) => {
    switch (platform) {
      case "twitter":
        return `https://twitter.com/${username}`;
      case "linkedin":
        return `https://linkedin.com/in/${username}`;
      case "github":
        return `https://github.com/${username}`;
      case "instagram":
        return `https://instagram.com/${username}`;
      case "website":
        return username.startsWith("http") ? username : `https://${username}`;
      default:
        return username;
    }
  };

  const renderCollectionCard = (collection: Collection, isPinned = false) => (
    <div
      key={collection.id}
      className={`p-4 border border-border rounded-md hover:bg-muted/50 transition-colors min-h-[120px] flex flex-col ${
        isPinned ? "border-l-4 border-l-primary" : ""
      }`}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          {isPinned && (
            <Pin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          )}
          <Link
            href={`/collection/${collection.id}`}
            className="font-semibold text-foreground hover:text-primary transition-colors truncate"
          >
            {collection.title}
          </Link>
          <Badge variant="outline" className="text-xs flex-shrink-0">
            Public
          </Badge>
        </div>

        <div className="mb-3 min-h-[40px] flex items-start">
          {collection.description ? (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {collection.description}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground/60 italic">
              No description provided
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto">
        <div className="flex items-center gap-1 flex-shrink-0">
          <Link2 className="h-3 w-3" />
          <span>{collection.totalLinks} links</span>
        </div>

        {collection.likes > 0 && (
          <div className="flex items-center gap-1 flex-shrink-0">
            <Heart className="h-3 w-3" />
            <span>{collection.likes}</span>
          </div>
        )}

        <div className="flex items-center gap-1 flex-shrink-0 ml-auto">
          <Calendar className="h-3 w-3" />
          <span className="truncate">
            Updated {new Date(collection.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );

  if (loading) {
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
          <div className="animate-pulse">
            <div className="flex gap-6">
              <div className="w-72 space-y-4">
                <div className="w-20 h-20 bg-muted rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-6 bg-muted rounded w-32"></div>
                  <div className="h-4 bg-muted rounded w-24"></div>
                  <div className="h-3 bg-muted rounded w-40"></div>
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-[120px] bg-muted rounded-md"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    notFound();
  }

  const socialLinks = [];
  if (user.showSocialLinks) {
    if (user.twitterUsername)
      socialLinks.push({ platform: "twitter", username: user.twitterUsername });
    if (user.linkedinUsername)
      socialLinks.push({
        platform: "linkedin",
        username: user.linkedinUsername,
      });
    if (user.githubUsername)
      socialLinks.push({ platform: "github", username: user.githubUsername });
    if (user.instagramUsername)
      socialLinks.push({
        platform: "instagram",
        username: user.instagramUsername,
      });
    if (user.personalWebsite)
      socialLinks.push({ platform: "website", username: user.personalWebsite });
  }

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
        <div className="flex gap-6">
          {/* Left Sidebar - Profile Info */}
          <div className="w-72 flex-shrink-0">
            <div className="sticky top-8">
              {/* Avatar and Name */}
              <div className="mb-6">
                <Avatar className="h-20 w-20 mb-3">
                  <AvatarFallback className="text-lg bg-muted text-muted-foreground font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <h1 className="text-2xl font-bold mb-1 text-foreground">
                  {user.name}
                </h1>

                <p className="text-lg text-muted-foreground mb-3">
                  {user.username}
                </p>

                {/* Bio */}
                {user.bio && (
                  <p className="text-sm text-foreground mb-4 leading-relaxed">
                    {user.bio}
                  </p>
                )}

                {/* Social Links */}
                {socialLinks.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {socialLinks.map((link, index) => (
                      <a
                        key={index}
                        href={getSocialUrl(link.platform, link.username)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-md hover:bg-muted transition-colors"
                        aria-label={`${link.platform} profile`}
                      >
                        {getSocialIcon(link.platform)}
                      </a>
                    ))}
                  </div>
                )}

                {/* Share Profile Buttons */}
                <div className="space-y-2 mb-6">
                  <Button
                    variant="outline"
                    onClick={handleShareProfile}
                    disabled={copied}
                    className="w-full justify-start gap-2 h-8 text-sm"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    {copied ? "Copied!" : "Copy Profile Link"}
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2 h-8 text-sm"
                      >
                        <Share className="h-3.5 w-3.5" />
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

                {/* Stats */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Book className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <strong>{collections.length}</strong> public repositories
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <strong>
                        {collections.reduce(
                          (total, collection) => total + collection.likes,
                          0
                        )}
                      </strong>{" "}
                      total likes
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link2 className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <strong>
                        {collections.reduce(
                          (total, collection) => total + collection.totalLinks,
                          0
                        )}
                      </strong>{" "}
                      total links
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Pinned Collections */}
            {pinnedCollections.length > 0 && (
              <section className="mb-8">
                <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Pin className="h-4 w-4" />
                  Pinned
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {pinnedCollections.map((collection) =>
                    renderCollectionCard(collection, true)
                  )}
                </div>
              </section>
            )}

            {/* Collections Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-foreground">
                  Repositories
                </h2>

                {/* Sort Options */}
                <Select
                  value={sortBy}
                  onValueChange={(value: SortOption) => setSortBy(value)}
                >
                  <SelectTrigger className="w-36 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Recently updated</SelectItem>
                    <SelectItem value="likes">Most liked</SelectItem>
                    <SelectItem value="links">Most links</SelectItem>
                    <SelectItem value="alphabetical">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {filteredCollections.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="text-center py-12">
                    <User className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-base font-medium text-foreground mb-2">
                      No public repositories
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      This user hasn&apos;t made any collections public yet.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Collections List */}
                  <div className="space-y-4">
                    {paginatedCollections.map((collection) =>
                      renderCollectionCard(collection)
                    )}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
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
                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((page) => (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="w-8 h-8"
                          >
                            {page}
                          </Button>
                        ))}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
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
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
