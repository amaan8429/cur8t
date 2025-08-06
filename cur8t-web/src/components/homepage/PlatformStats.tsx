"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PiUsers,
  PiFolderOpen,
  PiLink,
  PiStar,
  PiTrendUp,
  PiBookmark,
  PiCalendar,
} from "react-icons/pi";
import { getPlatformStats } from "@/actions/platform/platformStats";

interface PlatformStatsData {
  totalCollections: number;
  publicCollections: number;
  totalUsers: number;
  totalLinks: number;
  collectionsThisWeek: number;
  mostLikedCollection: number;
  totalSaves: number;
}

const PlatformStats = () => {
  const [stats, setStats] = useState<PlatformStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const response = await getPlatformStats();

        // Check for rate limiting
        if (response.error && response.retryAfter) {
          const { showRateLimitToast } = await import(
            "@/components/ui/rate-limit-toast"
          );
          showRateLimitToast({
            retryAfter: response.retryAfter * 60,
            message:
              "Too many platform stats requests. Please try again later.",
          });
          setIsLoading(false);
          return;
        }

        if (response.success && response.data) {
          setStats(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch platform stats:", error);
      }
      setIsLoading(false);
    };

    fetchStats();
  }, []);

  const StatCard = ({
    title,
    value,
    icon: Icon,
    description,
    badge,
  }: {
    title: string;
    value: number;
    icon: React.ElementType;
    description: string;
    badge?: string;
  }) => (
    <Card className="hover:shadow-sm transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-1">
          <div className="text-2xl font-bold">
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              value.toLocaleString()
            )}
          </div>
          {badge && (
            <Badge variant="secondary" className="text-xs">
              {badge}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Platform at a Glance
        </h2>
        <p className="text-muted-foreground">
          Real-time statistics from our growing community
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={PiUsers}
          description="Active community members"
          badge="Growing"
        />

        <StatCard
          title="Public Collections"
          value={stats?.publicCollections || 0}
          icon={PiFolderOpen}
          description="Shared with the community"
        />

        <StatCard
          title="Links Bookmarked"
          value={stats?.totalLinks || 0}
          icon={PiLink}
          description="Total links across all collections"
        />

        <StatCard
          title="Collections Saved"
          value={stats?.totalSaves || 0}
          icon={PiBookmark}
          description="Times collections were saved"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="New This Week"
          value={stats?.collectionsThisWeek || 0}
          icon={PiCalendar}
          description="Fresh collections created"
          badge="Recent"
        />

        <StatCard
          title="Most Liked Collection"
          value={stats?.mostLikedCollection || 0}
          icon={PiStar}
          description="Highest likes on a single collection"
        />

        <StatCard
          title="Total Collections"
          value={stats?.totalCollections || 0}
          icon={PiTrendUp}
          description="Public and private combined"
        />
      </div>
    </div>
  );
};

export default PlatformStats;
