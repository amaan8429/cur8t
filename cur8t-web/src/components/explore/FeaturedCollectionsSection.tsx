import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CollectionWithAuthor } from './types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  PiBookOpen,
  PiUsers,
  PiCode,
  PiBuildings,
  PiHeart,
  PiCube,
  PiLightbulb,
  PiSparkle,
  PiBrain,
  PiPalette,
  PiLink,
  PiCalendar,
} from 'react-icons/pi';
import Link from 'next/link';

interface FeaturedCollectionsSectionProps {
  collections: CollectionWithAuthor[];
  isLoading: boolean;
}

// Function to get appropriate icon for a collection
function getCollectionIcon(collection: CollectionWithAuthor) {
  const text = `${collection.title} ${collection.description}`.toLowerCase();

  if (text.includes('ai') || text.includes('machine learning'))
    return { icon: PiBrain, bg: 'bg-pink-500' };
  if (text.includes('art') || text.includes('design'))
    return { icon: PiPalette, bg: 'bg-yellow-500' };
  if (text.includes('community') || text.includes('meetup'))
    return { icon: PiUsers, bg: 'bg-purple-500' };
  if (text.includes('tech') || text.includes('software'))
    return { icon: PiCode, bg: 'bg-green-500' };
  if (text.includes('business') || text.includes('career'))
    return { icon: PiBuildings, bg: 'bg-rose-500' };
  if (text.includes('startup') || text.includes('entrepreneur'))
    return { icon: PiCube, bg: 'bg-indigo-500' };
  if (text.includes('education') || text.includes('learn'))
    return { icon: PiBookOpen, bg: 'bg-blue-500' };
  if (text.includes('innovation') || text.includes('future'))
    return { icon: PiLightbulb, bg: 'bg-amber-500' };

  return { icon: PiSparkle, bg: 'bg-gray-500' };
}

// Function to get category for a collection
function getCollectionCategory(collection: CollectionWithAuthor): string {
  const text = `${collection.title} ${collection.description}`.toLowerCase();

  if (text.includes('ai') || text.includes('machine learning')) return 'AI';
  if (text.includes('art') || text.includes('design')) return 'Design';
  if (text.includes('community')) return 'Community';
  if (text.includes('tech') || text.includes('software')) return 'Technology';
  if (text.includes('business') || text.includes('career')) return 'Career';
  if (text.includes('startup') || text.includes('entrepreneur'))
    return 'Startups';
  if (text.includes('education') || text.includes('learn')) return 'Education';
  if (text.includes('innovation')) return 'Innovation';

  return 'General';
}

// Function to format date
function formatDate(date: Date): string {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
  return `${Math.ceil(diffDays / 365)} years ago`;
}

export function FeaturedCollectionsSection({
  collections,
  isLoading,
}: FeaturedCollectionsSectionProps) {
  if (isLoading) {
    return (
      <section className="space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </section>
    );
  }

  // Take the first 9 collections or all if less than 9
  const featuredCollections = collections.slice(0, 9);

  return (
    <section className="space-y-8">
      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredCollections.map((collection) => {
          const { icon: IconComponent, bg: iconBg } =
            getCollectionIcon(collection);
          const category = getCollectionCategory(collection);

          return (
            <Link
              key={collection.id}
              href={`/collection/${collection.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Card className="group cursor-pointer transition-all duration-200 border-border h-full">
                <CardContent className="p-6 space-y-4 h-full flex flex-col">
                  {/* Header with Icon and Category */}
                  <div className="flex items-start justify-between">
                    <div
                      className={`p-3 rounded-lg ${iconBg} transition-transform duration-200`}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {category}
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="space-y-3 flex-1">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground text-lg leading-tight transition-colors">
                        {collection.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {collection.description ||
                          'A curated collection of interesting links and resources.'}
                      </p>
                    </div>
                  </div>

                  {/* Footer with Stats */}
                  <div className="space-y-3 pt-2 border-t border-border">
                    {/* Author Info */}
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">
                          {collection.authorUsername
                            ? collection.authorUsername.charAt(0).toUpperCase()
                            : collection.author.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">
                        {collection.authorUsername || collection.author}
                      </span>
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <PiHeart className="w-3 h-3" />
                          <span>{collection.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <PiLink className="w-3 h-3" />
                          <span>{collection.totalLinks}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <PiCalendar className="w-3 h-3" />
                        <span>{formatDate(collection.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
