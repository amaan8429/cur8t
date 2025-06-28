"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Heart, BookOpen, Calendar, User } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { getPersonalRecommendations } from "@/actions/platform/personalRecommendations";

interface RecommendedCollection {
  id: string;
  title: string;
  author: string;
  description: string;
  likes: number;
  totalLinks: number;
  updatedAt: Date;
  userId: string;
}

export default function PersonalRecommendations() {
  const { isSignedIn, isLoaded } = useUser();
  const [collections, setCollections] = useState<RecommendedCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadRecommendations() {
      if (!isLoaded) return;

      try {
        const response = await getPersonalRecommendations();
        if (response.success && response.data) {
          setCollections(response.data);
          setMessage(response.message || "");
        }
      } catch (error) {
        console.error("Error loading recommendations:", error);
      } finally {
        setLoading(false);
      }
    }

    loadRecommendations();
  }, [isLoaded]);

  // Don't show anything if user is not signed in
  if (!isLoaded || !isSignedIn) {
    return null;
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Recommended for You</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
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
        <Sparkles className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Recommendations Yet</h3>
        <p className="text-muted-foreground mb-4">
          Save some collections to get personalized recommendations!
        </p>
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Explore Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-6 h-6" />
        <h2 className="text-2xl font-bold">Recommended for You</h2>
        {message && (
          <Badge variant="outline" className="text-xs">
            {message}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <Card
            key={collection.id}
            className="hover:shadow-lg transition-shadow group"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <Badge variant="secondary" className="text-xs mb-2">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Recommended
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
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <User className="w-3 h-3" />
                    <span>by {collection.author}</span>
                  </div>
                )}
              </div>

              <Link href={`/collection/${collection.id}`}>
                <div className="mt-4 p-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded text-center text-sm text-blue-700 hover:from-blue-100 hover:to-purple-100 transition-colors">
                  View Collection →
                </div>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {collections.length >= 6 && (
        <div className="text-center mt-8">
          <Link href="/explore">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors">
              <Sparkles className="w-4 h-4" />
              Discover More Collections
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
