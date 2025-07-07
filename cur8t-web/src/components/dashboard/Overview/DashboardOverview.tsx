"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bookmark,
  Plus,
  TrendingUp,
  Users,
  Link as LinkIcon,
  Star,
  ExternalLink,
  Settings,
  Workflow,
} from "lucide-react";
import { useActiveState } from "@/store/activeStateStore";
import {
  getDashboardStatsAction,
  type DashboardStats,
} from "@/actions/user/getDashboardStats";
import { searchAction } from "@/actions/user/searchAction";
import { useEffect, useState } from "react";
import { DashboardStatsCard } from "./DashboardStatsCard";
import { SearchCommand } from "./Search/SearchCommand";
import { QuickActions } from "./QuickActions";
import { RecentCollections } from "./RecentCollections";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { CreateCollectionComponent } from "../TopSection/CreateCollection";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function DashboardOverview() {
  const { setActiveItem } = useActiveState();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const router = useRouter();
  const { userId } = useAuth();

  useEffect(() => {
    async function fetchStats() {
      try {
        const dashboardStats = await getDashboardStatsAction();
        setStats(dashboardStats);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const quickActions = [
    {
      title: "Create Collection",
      description: "Start organizing your bookmarks",
      icon: Plus,
      action: () => setIsCreateDialogOpen(true),
      variant: "primary" as const,
    },
    {
      title: "Explore Collections",
      description: "Discover public collections",
      icon: ExternalLink,
      action: () => setActiveItem("Explore Collections"),
      variant: "secondary" as const,
    },
    {
      title: "Tools & Agents",
      description: "Use AI-powered features",
      icon: Workflow,
      action: () => setActiveItem("Tools and Agents"),
      variant: "accent" as const,
    },
    {
      title: "Settings",
      description: "Manage your account",
      icon: Settings,
      action: () => setActiveItem("Settings"),
      variant: "neutral" as const,
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Loading...</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Error loading dashboard
          </h1>
          <p className="text-muted-foreground">
            Unable to load your dashboard data. Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your bookmarks and
            collections.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md">
          <SearchCommand onSearch={searchAction} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardStatsCard
          title="Total Collections"
          value={stats.totalCollections}
          subtitle="+2 from last month"
          icon={Bookmark}
          trend="up"
        />
        <DashboardStatsCard
          title="Total Links"
          value={stats.totalLinks}
          subtitle="+12 from last week"
          icon={LinkIcon}
          trend="up"
        />
        <DashboardStatsCard
          title="Pinned Collections"
          value={stats.pinnedCollections.length}
          subtitle="Quick access collections"
          icon={Star}
        />
        <DashboardStatsCard
          title="API Keys"
          value={stats.apiKeysCount}
          subtitle="Active integrations"
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Actions */}
        <QuickActions actions={quickActions} />

        {/* Recent Collections */}
        <RecentCollections
          collections={stats.recentCollections}
          onViewAll={() => {
            // Navigate to profile page
            if (userId) {
              router.push(`/profile/${userId}`);
            }
          }}
          onViewCollection={(id) => {
            // Open collection in new tab
            window.open(`/collection/${id}`, "_blank");
          }}
        />
      </div>

      {/* Account Status */}
      <Card>
        <CardHeader>
          <CardTitle>Account Status</CardTitle>
          <CardDescription>
            Your account integrations and settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="text-sm">GitHub Integration</span>
            </div>
            <Badge variant={stats.githubConnected ? "default" : "secondary"}>
              {stats.githubConnected ? "Connected" : "Not Connected"}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">API Access</span>
            </div>
            <Badge variant="outline">{stats.apiKeysCount} keys active</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Create Collection Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Collection</DialogTitle>
          </DialogHeader>
          <CreateCollectionComponent
            onSuccess={(collectionId) => {
              setIsCreateDialogOpen(false);
              // Navigate to the new collection using Next.js router (no page reload)
              router.push(`?collectionId=${encodeURIComponent(collectionId)}`);
            }}
            isDialog={true}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
