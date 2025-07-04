"use client";

import { useState, useEffect } from "react";
import { ModeToggle } from "@/components/layout/ModeToggle";
import { Footer } from "@/components/layout/Footer";
import { fetchPublicCollections } from "@/actions/collection/fetchPublicCollections";
import { Collection } from "@/types/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Search,
  Grid,
  List,
  TrendingUp,
  Clock,
  Star,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Link2,
  Heart,
  Calendar,
  Sparkles,
  Users,
  SortAsc,
} from "lucide-react";
import { useMemo } from "react";

interface FilterState {
  minLikes: number;
  minLinks: number;
  dateRange: "all" | "week" | "month" | "year";
  author: string;
}

export default function ExplorePage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"trending" | "recent" | "likes">(
    "trending"
  );
  const [collections, setCollections] = useState<Collection[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    minLikes: 0,
    minLinks: 0,
    dateRange: "all",
    author: "",
  });

  const ITEMS_PER_PAGE = 12;

  const loadCollections = async () => {
    setIsLoading(true);
    try {
      const response = await fetchPublicCollections({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        sortBy,
      });
      setCollections(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch collections:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadCollections();
  }, [currentPage, sortBy]);

  const filteredCollections = useMemo(() => {
    return collections.filter((collection) => {
      const matchesSearch =
        collection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        collection.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        collection.author.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLikes = collection.likes >= filters.minLikes;
      const matchesLinks = collection.totalLinks >= filters.minLinks;
      const matchesAuthor =
        !filters.author ||
        collection.author.toLowerCase().includes(filters.author.toLowerCase());

      const matchesDate = (() => {
        if (filters.dateRange === "all") return true;
        const now = new Date();
        const collectionDate = new Date(collection.updatedAt);
        const diffTime = now.getTime() - collectionDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        switch (filters.dateRange) {
          case "week":
            return diffDays <= 7;
          case "month":
            return diffDays <= 30;
          case "year":
            return diffDays <= 365;
          default:
            return true;
        }
      })();

      return (
        matchesSearch &&
        matchesLikes &&
        matchesLinks &&
        matchesAuthor &&
        matchesDate
      );
    });
  }, [collections, searchQuery, filters]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetFilters = () => {
    setFilters({
      minLikes: 0,
      minLinks: 0,
      dateRange: "all",
      author: "",
    });
    setSearchQuery("");
  };

  const hasActiveFilters = useMemo(() => {
    return (
      filters.minLikes > 0 ||
      filters.minLinks > 0 ||
      filters.dateRange !== "all" ||
      filters.author !== "" ||
      searchQuery !== ""
    );
  }, [filters, searchQuery]);

  const CollectionCard = ({ collection }: { collection: Collection }) => (
    <Link href={`/collection/${collection.id}`}>
      <Card className="group hover:shadow-sm transition-all duration-300 cursor-pointer border-border/30 hover:border-border/50 h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                {collection.title}
              </CardTitle>
              <CardDescription className="line-clamp-3 text-muted-foreground">
                {collection.description || "No description provided"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
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

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>
                  Updated {formatDate(collection.updatedAt.toString())}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {collection.author.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground truncate max-w-[100px]">
                  {collection.author}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  const CollectionListItem = ({ collection }: { collection: Collection }) => (
    <Link href={`/collection/${collection.id}`}>
      <Card className="group hover:shadow-sm transition-all duration-300 cursor-pointer border-border/30 hover:border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                {collection.title}
              </CardTitle>
              <CardDescription className="line-clamp-3 text-muted-foreground">
                {collection.description || "No description provided"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
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

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>
                  Updated {formatDate(collection.updatedAt.toString())}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {collection.author.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                {collection.author}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  const LoadingCards = () => (
    <div
      className={cn(
        viewMode === "grid"
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
      )}
    >
      {[...Array(8)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-16 w-full mb-4" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const EmptyState = () => (
    <Card className="border-dashed border-border/30">
      <CardContent className="text-center py-16">
        <div className="p-4 rounded-full bg-muted/50 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Sparkles className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No Collections Found
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto mb-4">
          {hasActiveFilters
            ? "Try adjusting your search filters to find more collections."
            : "No public collections available at the moment. Check back later!"}
        </p>
        {hasActiveFilters && (
          <Button variant="outline" onClick={resetFilters}>
            Clear all filters
          </Button>
        )}
      </CardContent>
    </Card>
  );

  const Pagination = () => (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      <div className="flex items-center gap-1">
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const page = i + 1;
          return (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(page)}
              className="w-10"
            >
              {page}
            </Button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header with Theme Toggle */}
        <div className="flex justify-end mb-6">
          <ModeToggle />
        </div>

        <div className="space-y-8">
          {/* Page Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Explore Collections
                </h1>
                <p className="text-muted-foreground">
                  Discover amazing bookmark collections from the community
                </p>
              </div>
            </div>
          </div>

          {/* Search and Controls */}
          <div className="space-y-4 mb-8">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Search collections, authors, or descriptions..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 h-12 text-base"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Controls Row */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <Select
                  value={sortBy}
                  onValueChange={(value: "trending" | "recent" | "likes") =>
                    setSortBy(value)
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SortAsc className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trending">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Trending
                      </div>
                    </SelectItem>
                    <SelectItem value="recent">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Recently Updated
                      </div>
                    </SelectItem>
                    <SelectItem value="likes">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Most Liked
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* Filters Toggle */}
                <Button
                  variant={showFilters ? "default" : "outline"}
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-1">
                      {Object.values(filters).filter(
                        (v) => v !== "" && v !== 0 && v !== "all"
                      ).length + (searchQuery ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 px-3"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 px-3"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Advanced Filters Panel */}
            {showFilters && (
              <Card className="p-6 border-dashed border-border/30">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Min Likes
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={filters.minLikes}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          minLikes: parseInt(e.target.value) || 0,
                        }))
                      }
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Min Links
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={filters.minLinks}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          minLinks: parseInt(e.target.value) || 0,
                        }))
                      }
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Updated
                    </label>
                    <Select
                      value={filters.dateRange}
                      onValueChange={(
                        value: "all" | "week" | "month" | "year"
                      ) =>
                        setFilters((prev) => ({ ...prev, dateRange: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All time</SelectItem>
                        <SelectItem value="week">This week</SelectItem>
                        <SelectItem value="month">This month</SelectItem>
                        <SelectItem value="year">This year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Author
                    </label>
                    <Input
                      value={filters.author}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          author: e.target.value,
                        }))
                      }
                      placeholder="Filter by author"
                    />
                  </div>
                </div>

                {hasActiveFilters && (
                  <div className="flex justify-end mt-4">
                    <Button variant="outline" onClick={resetFilters} size="sm">
                      <X className="h-4 w-4 mr-2" />
                      Clear all filters
                    </Button>
                  </div>
                )}
              </Card>
            )}
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>
                {isLoading
                  ? "Loading..."
                  : `${filteredCollections.length} collection${filteredCollections.length !== 1 ? "s" : ""} found`}
              </span>
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <LoadingCards />
          ) : filteredCollections.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Collections Grid/List - Reduced to 2 columns max */}
              <div
                className={cn(
                  "transition-all duration-300",
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                )}
              >
                {filteredCollections.map((collection) =>
                  viewMode === "grid" ? (
                    <CollectionCard
                      key={collection.id}
                      collection={collection}
                    />
                  ) : (
                    <CollectionListItem
                      key={collection.id}
                      collection={collection}
                    />
                  )
                )}
              </div>

              {/* Pagination */}
              {filteredCollections.length > 0 && <Pagination />}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
