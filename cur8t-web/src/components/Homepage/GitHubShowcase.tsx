"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Heart, BookOpen, Calendar } from "lucide-react";
import Link from "next/link";
import { getGitHubShowcase } from "@/actions/platform/githubShowcase";

interface GitHubCollection {
  id: string;
  title: string;
  author: string;
  description: string;
  likes: number;
  totalLinks: number;
  updatedAt: Date;
  userId: string;
}

export default function GitHubShowcase() {
  const [collections, setCollections] = useState<GitHubCollection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGitHubShowcase() {
      try {
        const response = await getGitHubShowcase();
        if (response.success && response.data) {
          setCollections(response.data);
        }
      } catch (error) {
        console.error("Error loading GitHub showcase:", error);
      } finally {
        setLoading(false);
      }
    }

    loadGitHubShowcase();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <Github className="w-6 h-6" />
          <h2 className="text-2xl font-bold">GitHub Collections</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-5 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                  <div className="flex gap-2">
                    <div className="h-5 bg-muted rounded w-16" />
                    <div className="h-5 bg-muted rounded w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="text-center py-12">
        <Github className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          No GitHub Collections Yet
        </h3>
        <p className="text-muted-foreground">
          Collections with GitHub repositories will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Github className="w-6 h-6" />
        <h2 className="text-2xl font-bold">GitHub Collections</h2>
        <p className="text-muted-foreground ml-2">
          Collections featuring GitHub repositories and development resources
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {collections.map((collection) => (
          <Card
            key={collection.id}
            className="hover:shadow-lg transition-shadow group"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <Badge variant="secondary" className="text-xs mb-2">
                  <Github className="w-3 h-3 mr-1" />
                  GitHub
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Heart className="w-3 h-3" />
                  {collection.likes}
                </div>
              </div>
              <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                <Link href={`/collection/${collection.id}`}>
                  {collection.title}
                </Link>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {collection.description}
              </p>

              <div className="space-y-2">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    {collection.totalLinks} links
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(collection.updatedAt).toLocaleDateString()}
                  </span>
                </div>

                {collection.author && (
                  <p className="text-xs text-muted-foreground">
                    by {collection.author}
                  </p>
                )}
              </div>

              <Link href={`/collection/${collection.id}`}>
                <div className="mt-4 p-2 bg-muted/50 rounded text-center text-sm text-blue-600 hover:bg-muted transition-colors">
                  View Collection →
                </div>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {collections.length >= 8 && (
        <div className="text-center mt-8">
          <Link href="/explore">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Github className="w-4 h-4" />
              Explore More GitHub Collections
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
