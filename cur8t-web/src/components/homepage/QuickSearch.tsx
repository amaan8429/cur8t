"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Link2,
  Heart,
  User,
  ArrowRight,
  X,
  Loader2,
} from "lucide-react";
import { quickSearch } from "@/actions/platform/quickSearch";
import Link from "next/link";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchResult {
  collections: Array<{
    id: string;
    title: string;
    author: string;
    likes: number;
    description: string;
    totalLinks: number;
    visibility: string;
    updatedAt: Date;
  }>;
  users: Array<{
    id: string;
    name: string;
    username: string | null;
    totalCollections: number;
  }>;
}

const QuickSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const performSearch = async () => {
      if (debouncedQuery.trim().length < 2) {
        setResults(null);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await quickSearch(debouncedQuery);

        // Check for rate limiting
        if (response.error && response.retryAfter) {
          const { showRateLimitToast } = await import(
            "@/components/ui/rate-limit-toast"
          );
          showRateLimitToast({
            retryAfter: response.retryAfter * 60,
            message: "Too many search requests. Please try again later.",
          });
          setIsLoading(false);
          return;
        }

        if (response.success && response.data) {
          setResults(response.data);
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Search failed:", error);
      }
      setIsLoading(false);
    };

    performSearch();
  }, [debouncedQuery]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const clearSearch = () => {
    setQuery("");
    setResults(null);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleInputFocus = () => {
    if (results && query.trim().length >= 2) {
      setIsOpen(true);
    }
  };

  const CollectionResult = ({
    collection,
  }: {
    collection: SearchResult["collections"][0];
  }) => (
    <Link
      href={`/collection/${collection.id}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => setIsOpen(false)}
    >
      <div className="flex items-center gap-3 p-3 hover:bg-accent rounded-lg transition-colors cursor-pointer">
        <div className="p-2 rounded-full bg-primary/10">
          <Link2 className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium line-clamp-1">{collection.title}</div>
          <div className="text-sm text-muted-foreground line-clamp-1">
            {collection.description || "No description"}
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <span>by {collection.author}</span>
            <span>{collection.totalLinks} links</span>
            {collection.likes > 0 && (
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                {collection.likes}
              </span>
            )}
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          Collection
        </Badge>
      </div>
    </Link>
  );

  const UserResult = ({ user }: { user: SearchResult["users"][0] }) => {
    // Since quickSearch filters out users without usernames, this should always be truthy
    if (!user.username) return null;

    return (
      <Link
        href={`/profile/${user.username}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setIsOpen(false)}
      >
        <div className="flex items-center gap-3 p-3 hover:bg-accent rounded-lg transition-colors cursor-pointer">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-medium">{user.name}</div>
            <div className="text-sm text-muted-foreground">
              @{user.username}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {user.totalCollections} public collections
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            User
          </Badge>
        </div>
      </Link>
    );
  };

  const hasResults =
    results && (results.collections.length > 0 || results.users.length > 0);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Quick Search</h2>
        <p className="text-muted-foreground">
          Find collections and users instantly
        </p>
      </div>

      <div className="max-w-2xl mx-auto" ref={searchRef}>
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search collections, users, or topics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleInputFocus}
            className="pl-10 pr-10 h-12 text-base"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            {isLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
            {query && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="h-6 w-6 p-0 hover:bg-transparent"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </Button>
            )}
          </div>
        </div>

        {/* Search Results Dropdown */}
        {isOpen && (
          <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto">
            <CardContent className="p-0">
              {!hasResults && !isLoading && query.trim().length >= 2 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No results found for &quot;{query}&quot;</p>
                  <p className="text-sm">
                    Try different keywords or check spelling
                  </p>
                </div>
              ) : (
                <div className="py-2">
                  {/* Collections Section */}
                  {results?.collections && results.collections.length > 0 && (
                    <div>
                      <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide border-b">
                        Collections ({results.collections.length})
                      </div>
                      {results.collections.map((collection) => (
                        <CollectionResult
                          key={collection.id}
                          collection={collection}
                        />
                      ))}
                    </div>
                  )}

                  {/* Users Section */}
                  {results?.users && results.users.length > 0 && (
                    <div>
                      <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide border-b">
                        Users ({results.users.length})
                      </div>
                      {results.users.map((user) => (
                        <UserResult key={user.id} user={user} />
                      ))}
                    </div>
                  )}

                  {/* View All Results */}
                  {hasResults && (
                    <div className="border-t p-3">
                      <Link
                        href={`/explore?search=${encodeURIComponent(query)}`}
                      >
                        <Button variant="outline" className="w-full group">
                          View All Results
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuickSearch;
