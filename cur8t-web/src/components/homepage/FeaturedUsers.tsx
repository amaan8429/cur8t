'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { PiUsers, PiHeart, PiBookOpen } from 'react-icons/pi';
import Link from 'next/link';
import { getFeaturedUsers } from '@/actions/platform/featuredUsers';

interface FeaturedUser {
  id: string;
  name: string;
  username: string | null;
  totalCollections: number;
  publicCollections: number;
  totalLikes: number;
  topCollections: Array<{
    id: string;
    title: string;
    description: string;
    likes: number;
    totalLinks: number;
    updatedAt: Date;
  }>;
}

export default function FeaturedUsers() {
  const [users, setUsers] = useState<FeaturedUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeaturedUsers() {
      try {
        const response = await getFeaturedUsers();

        // Check for rate limiting
        if (response.error && response.retryAfter) {
          const { showRateLimitToast } = await import(
            '@/components/ui/rate-limit-toast'
          );
          showRateLimitToast({
            retryAfter: response.retryAfter * 60,
            message:
              'Too many featured users requests. Please try again later.',
          });
          setLoading(false);
          return;
        }

        if (response.success && response.data) {
          setUsers(response.data);
        }
      } catch (error) {
        console.error('Error loading featured users:', error);
      } finally {
        setLoading(false);
      }
    }

    loadFeaturedUsers();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <PiUsers className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Featured Creators</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full" />
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-24" />
                    <div className="h-3 bg-muted rounded w-16" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="h-6 bg-muted rounded w-16" />
                    <div className="h-6 bg-muted rounded w-16" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <PiUsers className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Featured Users Yet</h3>
        <p className="text-muted-foreground">
          Check back soon to see our top content creators!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <PiUsers className="w-6 h-6" />
        <h2 className="text-2xl font-bold">Featured Creators</h2>
        <p className="text-muted-foreground ml-2">
          Top content creators in our community
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card key={user.id} className="hover:shadow-sm transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="text-lg font-semibold">
                    {user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">
                    <Link
                      href={`/profile/${user.username || 'no-username'}`}
                      className="hover:underline"
                    >
                      {user.name}
                    </Link>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    @{user.username || 'no-username'}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Stats */}
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary" className="text-xs">
                  <PiBookOpen className="w-3 h-3 mr-1" />
                  {user.publicCollections} collections
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  <PiHeart className="w-3 h-3 mr-1" />
                  {user.totalLikes} likes
                </Badge>
              </div>

              {/* Top Collections */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Top Collections:
                </h4>
                {user.topCollections.slice(0, 2).map((collection) => (
                  <Link
                    key={collection.id}
                    href={`/collection/${collection.id}`}
                    className="block"
                  >
                    <div className="border border-border/30 rounded-lg p-3 hover:bg-muted/50 transition-colors">
                      <h5 className="text-sm font-medium line-clamp-1">
                        {collection.title}
                      </h5>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {collection.totalLinks} links
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {collection.likes} likes
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {user.topCollections.length > 2 && (
                <Link
                  href={`/profile/${user.username || 'no-username'}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  +{user.topCollections.length - 2} more collections
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
