"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PiBookmark,
  PiPlus,
  PiTrendUp,
  PiLink,
  PiMagnifyingGlass,
  PiFunnel,
  PiArrowSquareOut,
  PiPushPin,
  PiGlobe,
  PiFolder,
  PiCaretLeft,
  PiCaretRight,
  PiDotsThreeThin,
  PiEyeClosed,
  PiLock,
} from "react-icons/pi";
import { useActiveState } from "@/store/activeStateStore";
import {
  getDashboardStatsAction,
  type DashboardStats,
} from "@/actions/user/getDashboardStats";
import { useEffect, useState } from "react";
import { DashboardStatsCard } from "./DashboardStatsCard";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { CreateCollectionComponent } from "../TopSection/CreateCollection";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCollectionStore } from "@/store/collection-store";
import { usePinnedCollectionsStore } from "@/store/pinned-collections-store";

type FilterState = {
  visibility: "all" | "public" | "private" | "protected";
  dateRange: "all" | "today" | "week" | "month" | "year";
  minLinks: number;
};

const ITEMS_PER_PAGE = 10;

export function DashboardOverview() {
  const { setActiveItem } = useActiveState();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    visibility: "all",
    dateRange: "all",
    minLinks: 0,
  });
  const router = useRouter();
  const setActiveUserId = useActiveState((state) => state.setActiveUserId);
  const { userId } = useAuth();

  // Get collections from store (already fetched in sidebar)
  const { collections, fetchCollections } = useCollectionStore();
  const {
    pinnedCollectionIds,
    fetchPinnedCollections,
    isLoading: pinnedLoading,
  } = usePinnedCollectionsStore();

  // Track whether we've initiated the fetch to prevent duplicates
  const [hasFetchedCollections, setHasFetchedCollections] = useState(false);

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

    if (userId) {
      setActiveUserId(userId);
    }

    fetchStats();
  }, [userId, setActiveUserId]);

  // Separate effect for handling collections fetching
  useEffect(() => {
    async function initializeCollections() {
      // Only fetch if collections are null AND we haven't already initiated a fetch
      if (collections === null && !hasFetchedCollections) {
        setHasFetchedCollections(true);
        try {
          await Promise.all([fetchCollections(), fetchPinnedCollections()]);
        } catch (error) {
          console.error("Error fetching collections:", error);
        }
      }
    }

    initializeCollections();
  }, [
    collections,
    fetchCollections,
    fetchPinnedCollections,
    hasFetchedCollections,
  ]);

  // Filter collections based on search query and filters
  const filteredCollections =
    collections
      ?.filter((collection) => {
        // Search filter
        const matchesSearch =
          collection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          collection.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

        // Visibility filter
        const matchesVisibility =
          filters.visibility === "all" ||
          collection.visibility === filters.visibility;

        // Date filter
        let matchesDate = true;
        if (filters.dateRange !== "all") {
          const now = new Date();
          const createdAt = new Date(collection.createdAt);
          const daysDiff =
            (now.getTime() - createdAt.getTime()) / (1000 * 3600 * 24);

          switch (filters.dateRange) {
            case "today":
              matchesDate = daysDiff <= 1;
              break;
            case "week":
              matchesDate = daysDiff <= 7;
              break;
            case "month":
              matchesDate = daysDiff <= 30;
              break;
            case "year":
              matchesDate = daysDiff <= 365;
              break;
          }
        }

        // Links filter
        const matchesLinks = collection.totalLinks >= filters.minLinks;

        return (
          matchesSearch && matchesVisibility && matchesDate && matchesLinks
        );
      })
      // Sort to show latest collections first
      ?.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ) || [];

  // Pagination calculations
  const totalPages = Math.ceil(filteredCollections.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedCollections = filteredCollections.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  // Get visibility icon and text
  const getVisibilityInfo = (visibility: string) => {
    switch (visibility) {
      case "public":
        return { icon: PiGlobe, text: "Public", variant: "default" as const };
      case "protected":
        return {
          icon: PiLock,
          text: "Protected",
          variant: "secondary" as const,
        };
      default:
        return { icon: PiLock, text: "Private", variant: "outline" as const };
    }
  };

  // Get time ago string
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080)
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const resetFilters = () => {
    setFilters({
      visibility: "all",
      dateRange: "all",
      minLinks: 0,
    });
    setShowFilters(false);
  };

  // Show loading if stats are loading OR collections are not yet loaded
  if (loading || collections === null || pinnedLoading) {
    return (
      <div className="space-y-8 p-6 bg-muted/30 min-h-screen">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-9 w-48 bg-muted animate-pulse rounded-lg" />
            <div className="h-4 w-80 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-10 w-36 bg-muted animate-pulse rounded-md" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid gap-0 md:grid-cols-4 rounded-2xl overflow-hidden bg-card shadow-sm border border-border/20">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`p-6 ${i < 3 ? "border-r border-border/10" : ""}`}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <div className="h-3 w-20 bg-muted animate-pulse rounded" />
                  <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                </div>
                <div className="h-12 w-12 bg-muted animate-pulse rounded-xl" />
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filter Skeleton */}
        <div className="flex items-center justify-between gap-4">
          <div className="h-9 w-72 bg-muted animate-pulse rounded-md" />
          <div className="h-9 w-20 bg-muted animate-pulse rounded-md" />
        </div>

        {/* Table Skeleton */}
        <div className="shadow-sm border border-border/20 bg-card rounded-xl overflow-hidden">
          {/* Table Header */}
          <div className="border-b border-border/10 p-4">
            <div className="grid grid-cols-8 gap-4">
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
              <div className="h-4 w-16 bg-muted animate-pulse rounded" />
              <div className="h-4 w-12 bg-muted animate-pulse rounded" />
              <div className="h-4 w-8 bg-muted animate-pulse rounded" />
              <div className="h-4 w-14 bg-muted animate-pulse rounded" />
              <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              <div className="h-4 w-12 bg-muted animate-pulse rounded" />
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-border/5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="p-4">
                <div className="grid grid-cols-8 gap-4 items-center">
                  {/* Pin column */}
                  <div className="flex justify-center">
                    <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                  </div>

                  {/* Name column */}
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-muted animate-pulse rounded-xl" />
                    <div className="space-y-1">
                      <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                      <div className="h-3 w-48 bg-muted animate-pulse rounded" />
                    </div>
                  </div>

                  {/* Author column */}
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 bg-muted animate-pulse rounded-full" />
                    <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                  </div>

                  {/* Links column */}
                  <div className="h-4 w-6 bg-muted animate-pulse rounded" />

                  {/* Visibility column */}
                  <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />

                  {/* Last Updated column */}
                  <div className="h-4 w-12 bg-muted animate-pulse rounded" />

                  {/* Created column */}
                  <div className="h-4 w-16 bg-muted animate-pulse rounded" />

                  {/* Actions column */}
                  <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-border/10">
            <div className="h-4 w-48 bg-muted animate-pulse rounded" />
            <div className="flex items-center gap-2">
              <div className="h-8 w-20 bg-muted animate-pulse rounded-md" />
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-8 w-8 bg-muted animate-pulse rounded-md"
                  />
                ))}
              </div>
              <div className="h-8 w-16 bg-muted animate-pulse rounded-md" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-6 p-6">
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
    <div className="space-y-8 p-6 bg-muted/30 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Oll&aacute;, Larry!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s an overview of your collections. Manage or create new
            ones with ease!
          </p>
        </div>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="shadow-lg px-6"
        >
          <PiPlus className="h-4 w-4 mr-2" />
          Add Collection
        </Button>
      </div>

      {/* Modern Stats Cards - Joined Layout */}
      <div className="grid gap-0 md:grid-cols-4 rounded-2xl overflow-hidden bg-card shadow-sm border border-border/20">
        <div className="p-6 border-r border-border/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                COLLECTIONS
              </p>
              <p className="text-3xl font-bold mt-1">
                {stats.totalCollections.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <span className="text-primary font-medium">↗ +12%</span> vs
                last week
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <PiBookmark className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="p-6 border-r border-border/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                TOTAL LINKS
              </p>
              <p className="text-3xl font-bold mt-1">
                {stats.totalLinks.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <span className="text-primary font-medium">↗ +42%</span> vs
                last week
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <PiLink className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="p-6 border-r border-border/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                PUBLIC
              </p>
              <p className="text-3xl font-bold mt-1">
                {collections?.filter((c) => c.visibility === "public").length ||
                  0}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <span className="text-primary font-medium">↗ +37%</span> vs
                last week
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <PiGlobe className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                API KEYS
              </p>
              <p className="text-3xl font-bold mt-1">{stats.apiKeysCount}</p>
              <p className="text-sm text-muted-foreground mt-1">
                <span className="text-destructive font-medium">↘ -17%</span> vs
                last week
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <PiTrendUp className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar - Filters moved to right */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <PiMagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 border-border/30"
          />
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu open={showFilters} onOpenChange={setShowFilters}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="border-border/30">
                <PiFunnel className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 p-4 border-border/20"
            >
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Visibility
                  </label>
                  <Select
                    value={filters.visibility}
                    onValueChange={(value: FilterState["visibility"]) =>
                      setFilters((prev) => ({ ...prev, visibility: value }))
                    }
                  >
                    <SelectTrigger className="border-border/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-border/20">
                      <SelectItem value="all">All Visibility</SelectItem>
                      <SelectItem value="public">Public Only</SelectItem>
                      <SelectItem value="private">Private Only</SelectItem>
                      <SelectItem value="protected">Protected Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Date Range
                  </label>
                  <Select
                    value={filters.dateRange}
                    onValueChange={(value: FilterState["dateRange"]) =>
                      setFilters((prev) => ({ ...prev, dateRange: value }))
                    }
                  >
                    <SelectTrigger className="border-border/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-border/20">
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Minimum Links
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={filters.minLinks}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        minLinks: parseInt(e.target.value) || 0,
                      }))
                    }
                    placeholder="0"
                    className="border-border/20"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={() => setShowFilters(false)}
                    className="flex-1"
                  >
                    Apply Filters
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={resetFilters}
                    className="border-border/30"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Collections Table */}
      <Card className="shadow-sm border border-border/20 bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border/10">
              <TableHead className="w-12"></TableHead>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Links</TableHead>
              <TableHead className="font-semibold">Visibility</TableHead>
              <TableHead className="font-semibold">Last Updated</TableHead>
              <TableHead className="font-semibold">Created</TableHead>
              <TableHead className="w-8"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCollections.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <PiFolder className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground font-medium">
                      {searchQuery ||
                      filters.visibility !== "all" ||
                      filters.dateRange !== "all" ||
                      filters.minLinks > 0
                        ? "No collections found matching your filters."
                        : "No collections yet. Create your first one!"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedCollections.map((collection) => {
                const isPinned = pinnedCollectionIds.includes(collection.id);
                const visibilityInfo = getVisibilityInfo(collection.visibility);

                return (
                  <TableRow
                    key={collection.id}
                    className="cursor-pointer hover:bg-muted/40 group border-border/5 transition-colors"
                    onClick={() =>
                      router.push(
                        `?collectionId=${encodeURIComponent(collection.id)}`
                      )
                    }
                  >
                    <TableCell>
                      <div className="flex items-center justify-center">
                        {isPinned && (
                          <PiPushPin className="h-4 w-4 text-primary fill-current" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors">
                          <PiFolder className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold group-hover:text-primary transition-colors">
                            {collection.title}
                          </div>
                          {collection.description && (
                            <div className="text-sm text-muted-foreground line-clamp-1 max-w-xs">
                              {collection.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-semibold">
                        {collection.totalLinks}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={visibilityInfo.variant} className="gap-1">
                        <PiEyeClosed className="h-3 w-3" />
                        {collection.visibility}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {getTimeAgo(new Date(collection.updatedAt))}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(collection.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <PiDotsThreeThin className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 border-border/20"
                        >
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(
                                `?collectionId=${encodeURIComponent(collection.id)}`
                              );
                            }}
                          >
                            <PiEyeClosed className="h-4 w-4 mr-2" />
                            View Collection
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(
                                `/collection/${collection.id}`,
                                "_blank"
                              );
                            }}
                          >
                            <PiArrowSquareOut className="h-4 w-4 mr-2" />
                            Open in new tab
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {filteredCollections.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border/10">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredCollections.length)} of{" "}
              {filteredCollections.length} results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="border-border/20"
              >
                <PiCaretLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                  )
                  .map((page, index, array) => (
                    <React.Fragment key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="px-2 text-muted-foreground">...</span>
                      )}
                      <Button
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 p-0 ${currentPage === page ? "" : "border-border/20"}`}
                      >
                        {page}
                      </Button>
                    </React.Fragment>
                  ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="border-border/20"
              >
                Next
                <PiCaretRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
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
