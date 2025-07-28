"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, BookOpen, Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getCategorizedCollections } from "@/actions/platform/categoryCollections";
import { Collection } from "@/types/types";

interface CategoryData {
  name: string;
  keywords: string[];
  description: string;
}

interface CategorizedData {
  categories: Record<string, CategoryData>;
  collections: Record<string, Collection[]>;
}

export default function CategorySections() {
  const [data, setData] = useState<CategorizedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    async function loadCategorizedCollections() {
      try {
        const response = await getCategorizedCollections();

        // Check for rate limiting
        if (response.error && response.retryAfter) {
          const { showRateLimitToast } = await import(
            "@/components/ui/rate-limit-toast"
          );
          showRateLimitToast({
            retryAfter: response.retryAfter * 60,
            message: "Too many category requests. Please try again later.",
          });
          setLoading(false);
          return;
        }

        if (response.success && response.data) {
          setData(response.data);
          // Auto-expand first category if it has collections
          const firstCategoryWithData = Object.keys(
            response.data.collections
          )[0];
          if (firstCategoryWithData) {
            setExpandedCategories(new Set([firstCategoryWithData]));
          }
        }
      } catch (error) {
        console.error("Error loading categorized collections:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCategorizedCollections();
  }, []);

  const toggleCategory = (categoryKey: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryKey)) {
      newExpanded.delete(categoryKey);
    } else {
      newExpanded.add(categoryKey);
    }
    setExpandedCategories(newExpanded);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 bg-muted rounded animate-pulse" />
          <div className="h-8 bg-muted rounded w-48 animate-pulse" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-32" />
              <div className="h-4 bg-muted rounded w-64" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div
                    key={j}
                    className="border border-border/30 rounded-lg p-4 space-y-3"
                  >
                    <div className="h-5 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="flex gap-2">
                      <div className="h-5 bg-muted rounded w-16" />
                      <div className="h-5 bg-muted rounded w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data || Object.keys(data.collections).length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Categories Available</h3>
        <p className="text-muted-foreground">
          Collections will be automatically categorized as they are created.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-6 h-6" />
        <h2 className="text-2xl font-bold">Browse by Category</h2>
        <p className="text-muted-foreground ml-2">
          Discover collections organized by topic
        </p>
      </div>

      {Object.entries(data.collections).map(([categoryKey, collections]) => {
        const category = data.categories[categoryKey];
        const isExpanded = expandedCategories.has(categoryKey);
        const displayCollections = isExpanded
          ? collections
          : collections.slice(0, 3);

        return (
          <Card key={categoryKey} className="overflow-hidden">
            <CardHeader
              className="cursor-pointer"
              onClick={() => toggleCategory(categoryKey)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {category.name}
                    <Badge variant="outline" className="text-xs">
                      {collections.length} collections
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {category.description}
                  </p>
                </div>
                <ChevronRight
                  className={`w-5 h-5 transition-transform ${
                    isExpanded ? "rotate-90" : ""
                  }`}
                />
              </div>
            </CardHeader>

            {(isExpanded || collections.length <= 3) && (
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayCollections.map((collection) => (
                    <Link
                      key={collection.id}
                      href={`/collection/${collection.id}`}
                    >
                      <div className="border border-border/30 rounded-lg p-4 hover:shadow-sm transition-shadow group">
                        <h3 className="font-medium line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {collection.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {collection.description}
                        </p>
                        <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            {collection.totalLinks} links
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {collection.likes} likes
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(
                              collection.updatedAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        {collection.author && (
                          <p className="text-xs text-muted-foreground mt-2">
                            by {collection.author}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>

                {collections.length > 3 && !isExpanded && (
                  <div className="mt-4 text-center">
                    <Button
                      variant="outline"
                      onClick={() => toggleCategory(categoryKey)}
                      className="text-sm"
                    >
                      Show {collections.length - 3} more collections
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
