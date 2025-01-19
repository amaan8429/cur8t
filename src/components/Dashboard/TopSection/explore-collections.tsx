"use client";

import React, { useEffect, useState } from "react";
import {
  Search,
  Grid,
  List,
  TrendingUp,
  Clock,
  Star,
  Filter,
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchPublicCollections } from "@/actions/collection/fetchPublicCollections";
import { Collection } from "@/types/types";

const ExploreCollections = () => {
  const [isGridView, setIsGridView] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("trending");
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    fetchPublicCollections().then((data) => {
      setCollections(data.data);
    });
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const CollectionCard = ({ collection }: { collection: Collection }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl font-semibold line-clamp-1">
          {collection.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">by {collection.author}</p>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-2 mb-4">
          {collection.description}
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="h-4 w-4" />
            {collection.likes}
          </span>
          <span>{collection.totalLinks} items</span>
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Updated {formatDate(collection.updatedAt.toString())}
      </CardFooter>
    </Card>
  );

  const CollectionListItem = ({ collection }: { collection: Collection }) => (
    <div className="border-b py-4 hover:bg-accent/50 px-4 -mx-4 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold">{collection.title}</h3>
          <p className="text-sm text-muted-foreground">
            by {collection.author}
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="h-4 w-4" />
            {collection.likes}
          </span>
          <span>{collection.totalLinks} items</span>
        </div>
      </div>
      <p className="text-muted-foreground line-clamp-1 text-sm">
        {collection.description}
      </p>
      <p className="text-sm text-muted-foreground mt-2">
        Updated {formatDate(collection.updatedAt.toString())}
      </p>
    </div>
  );

  return (
    <div className="container mx-auto py-4 px-4">
      {/* Header */}
      {/* <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold">Explore Collections</h1>
        <p className="text-muted-foreground">
          Discover public collections shared by the community
        </p>
      </div> */}
      <div className="mb-8">
        <h3 className="text-3xl font-bold">
          Discover public collections shared by the community
        </h3>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search collections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
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

      {/* Collections Grid/List */}
      {isGridView ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {collections.map((collection) => (
            <CollectionListItem key={collection.id} collection={collection} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {collections.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No collections found</p>
        </div>
      )}
    </div>
  );
};

export default ExploreCollections;
