"use client";

import React, { useEffect, useState } from "react";
import {
  Search,
  Grid,
  List,
  TrendingUp,
  Clock,
  Star,
  ChevronLeft,
  ChevronRight,
  Link2,
  Heart,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Collection } from "@/types/types";
import { fetchSavedCollections } from "@/actions/collection/fetchSavedCollections";
import Link from "next/link";

const SavedCollections = () => {
  const [isGridView, setIsGridView] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"trending" | "recent" | "likes">(
    "trending"
  );
  const [collections, setCollections] = useState<Collection[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const ITEMS_PER_PAGE = 9;

  const loadCollections = async () => {
    setIsLoading(true);
    try {
      const response = await fetchSavedCollections({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        sortBy,
      });
      if (response.error) {
        console.error("Failed to fetch collections:", response.error);
        return;
      }
      setCollections(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch collections:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadCollections();
  }, [currentPage, sortBy]);

  const filteredCollections = collections.filter(
    (collection) =>
      collection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const CollectionCard = ({ collection }: { collection: Collection }) => (
    <Link
      href={`/collection/${collection.id}`}
      target="_blank"
      rel="noopener noreferrer"
    >
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
                Saved
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
    <Link
      href={`/collection/${collection.id}`}
      target="_blank"
      rel="noopener noreferrer"
    >
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
                Saved
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

  const Pagination = () => (
    <div className="flex justify-center items-center gap-2 mt-8">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto py-4 px-4">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search saved collections..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={sortBy}
            onValueChange={(value) =>
              setSortBy(value as "trending" | "recent" | "likes")
            }
          >
            <SelectTrigger className="w-[180px]">
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

          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsGridView(!isGridView)}
          >
            {isGridView ? (
              <Grid className="h-4 w-4" />
            ) : (
              <List className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading saved collections...</p>
        </div>
      )}

      {/* Collections Grid/List */}
      {!isLoading && (
        <>
          {filteredCollections.length > 0 ? (
            <>
              {isGridView ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCollections.map((collection: Collection) => (
                    <CollectionCard
                      key={collection.id}
                      collection={collection}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCollections.map((collection) => (
                    <CollectionListItem
                      key={collection.id}
                      collection={collection}
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              <Pagination />
            </>
          ) : (
            <Card className="border-dashed border-border/30">
              <CardContent className="text-center py-16">
                <div className="p-4 rounded-full bg-muted/50 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No Saved Collections Found
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-4">
                  You haven&apos;t saved any collections yet. Browse the explore
                  page to discover and save interesting collections.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default SavedCollections;
