"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import {
  Globe,
  ExternalLink,
  Search,
  LayoutGrid,
  List,
  Table as TableIcon,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/types/types";
import { truncateUrl } from "@/lib/truncate";
import LoadingStates from "./loading";
import EmptyStates from "./no-links";

type ViewMode = "grid" | "list" | "table";

interface ReadOnlyLinkGridProps {
  links: Link[];
  isLoading?: boolean;
}

export function ReadOnlyLinkGrid({
  links,
  isLoading = false,
}: ReadOnlyLinkGridProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter links based on search query
  const filteredLinks = useMemo(() => {
    if (!searchQuery.trim()) return links;

    const query = searchQuery.toLowerCase();
    return links.filter(
      (link) =>
        link.title.toLowerCase().includes(query) ||
        link.url.toLowerCase().includes(query)
    );
  }, [links, searchQuery]);

  const clearSearch = () => setSearchQuery("");

  if (isLoading) {
    return <LoadingStates view={viewMode} />;
  }

  const renderViewToggle = () => (
    <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
      <Button
        variant={viewMode === "grid" ? "default" : "ghost"}
        size="sm"
        onClick={() => setViewMode("grid")}
        className="h-8 px-3"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === "list" ? "default" : "ghost"}
        size="sm"
        onClick={() => setViewMode("list")}
        className="h-8 px-3"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === "table" ? "default" : "ghost"}
        size="sm"
        onClick={() => setViewMode("table")}
        className="h-8 px-3"
      >
        <TableIcon className="h-4 w-4" />
      </Button>
    </div>
  );

  const renderSearchBar = () => (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        placeholder="Search links..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-9 pr-10"
      />
      {searchQuery && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearSearch}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredLinks.map((link) => (
        <Card
          key={link.id}
          className="flex flex-col hover:shadow-sm transition-all duration-200 border border-border/30 hover:border-border/50"
        >
          <CardHeader className="flex-grow pb-3">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12 ring-2 ring-background shadow-sm">
                <AvatarImage
                  src={`https://www.google.com/s2/favicons?domain=${link.url}&sz=64`}
                  alt={link.title}
                />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
                  <Globe className="h-6 w-6 text-primary" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg truncate leading-tight">
                  {link.title}
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm font-medium break-all"
            >
              {truncateUrl(link.url)}
            </a>
          </CardContent>
          <CardFooter className="pt-3">
            <Button
              variant="outline"
              size="sm"
              className="w-full hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => window.open(link.url, "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit Link
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-4">
      {filteredLinks.map((link) => (
        <Card key={link.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={`https://www.google.com/s2/favicons?domain=${link.url}&sz=64`}
                    alt={link.title}
                  />
                  <AvatarFallback>
                    <Globe className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{link.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm truncate"
                    >
                      {truncateUrl(link.url)}
                    </a>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(link.url, "_blank")}
                className="ml-4 shrink-0"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderTableView = () => (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="hidden md:table-cell">URL</TableHead>
            <TableHead className="hidden lg:table-cell">Description</TableHead>
            <TableHead className="w-24">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLinks.map((link) => (
            <TableRow key={link.id} className="hover:bg-muted/50">
              <TableCell>
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={`https://www.google.com/s2/favicons?domain=${link.url}&sz=64`}
                    alt={link.title}
                  />
                  <AvatarFallback>
                    <Globe className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">
                <div className="truncate max-w-xs">{link.title}</div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm truncate block max-w-xs"
                >
                  {truncateUrl(link.url)}
                </a>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <div className="truncate max-w-sm text-sm text-muted-foreground">
                  -
                </div>
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(link.url, "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );

  if (links.length === 0) {
    return <EmptyStates view={viewMode} />;
  }

  return (
    <div className="space-y-6">
      {/* Controls Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold">Links</h2>
          <Badge variant="outline" className="text-sm">
            {filteredLinks.length} of {links.length}
          </Badge>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-80">{renderSearchBar()}</div>
          {renderViewToggle()}
        </div>
      </div>

      {/* Results Section */}
      {filteredLinks.length === 0 && searchQuery ? (
        <Card className="p-12 text-center">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <Search className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No links found</h3>
          <p className="text-muted-foreground mb-4">
            No links match your search for &ldquo;{searchQuery}&rdquo;
          </p>
          <Button variant="outline" onClick={clearSearch}>
            Clear search
          </Button>
        </Card>
      ) : (
        <>
          {viewMode === "grid" && renderGridView()}
          {viewMode === "list" && renderListView()}
          {viewMode === "table" && renderTableView()}
        </>
      )}
    </div>
  );
}
