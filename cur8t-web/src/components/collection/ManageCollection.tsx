"use client";

import React from "react";
import { useLinkStore } from "@/store/link-store";
import { useToast } from "@/hooks/use-toast";
import { FrontendLink, FrontendLinkSchema } from "@/types/types";
import { LinkGrid } from "./LinkGrid";
import LinkTable from "./LinkTable";
import ManageLinksHeader, { FilterOptions } from "./LinkHeader";
import { PiPlusCircle } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddLinkForm } from "./AddLinkForm";

export function ManageCollectionLinks({
  collectionId,
}: {
  collectionId: string;
}) {
  const {
    isOpen,
    setIsOpen,
    refreshLinks,
    addLink,
    deleteLink,
    updateLink,
    isLoading,
    links,
  } = useLinkStore();
  const { toast } = useToast();
  const [view, setView] = React.useState<"grid" | "table">("grid");
  const fetchedLinks = React.useRef(new Set());
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterOptions, setFilterOptions] = React.useState<FilterOptions>({
    sortBy: "newest",
    dateRange: "all",
    domains: [],
  });

  React.useEffect(() => {
    if (fetchedLinks.current.has(collectionId)) return;
    refreshLinks(collectionId);
    fetchedLinks.current.add(collectionId);
  }, [collectionId]);

  const handleLinkAdded = async (newLink: {
    id: string;
    title: string;
    url: string;
  }) => {
    // Validate the URL
    const linkToValidate = {
      title: newLink.title.trim() || undefined, // Convert empty string to undefined
      url: newLink.url,
    };

    const parsedLink = FrontendLinkSchema.safeParse(linkToValidate);
    if (!parsedLink.success) {
      return toast({
        title: "Failed to add link",
        description:
          parsedLink.error.errors.length > 0
            ? parsedLink.error.errors[0].message
            : "Unknown error",
      });
    }

    // Pass the data that addLinkAction expects with error callback
    const linkData = {
      title: newLink.title.trim() || undefined, // Let backend handle empty titles
      url: parsedLink.data.url,
    };

    // Use optimistic updates - dialog closes immediately and link appears
    await addLink(linkData, collectionId, (error) => {
      toast({
        title: "Failed to add link",
        description: error,
        variant: "destructive",
      });
    });
  };

  const handleDeleteLink = async (id: string) => {
    if (!id) return;
    try {
      await deleteLink(id);
    } catch (error) {
      console.error("Failed to delete link:", error);
    }
  };

  const handleUpdateLink = async (
    id: string,
    data: { title?: string; url?: string }
  ) => {
    try {
      await updateLink(id, data);
    } catch (error) {
      console.error("Failed to update link:", error);
    }
  };

  // Get available domains from links
  const availableDomains = React.useMemo(() => {
    const domains = new Set<string>();
    links.forEach((link) => {
      try {
        const domain = new URL(link.url).hostname.replace("www.", "");
        domains.add(domain);
      } catch {
        // Skip invalid URLs
      }
    });
    return Array.from(domains).sort();
  }, [links]);

  // Filter and sort links based on search query and filter options
  const filteredLinks = React.useMemo(() => {
    const filtered = links.filter((link) => {
      const searchLower = searchQuery.toLowerCase().trim();
      const matchesSearch =
        link.title.toLowerCase().includes(searchLower) ||
        link.url.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;

      // Date range filter
      if (filterOptions.dateRange !== "all") {
        const linkDate = new Date(link.createdAt);
        const now = new Date();
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );

        switch (filterOptions.dateRange) {
          case "today":
            if (linkDate < today) return false;
            break;
          case "week":
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            if (linkDate < weekAgo) return false;
            break;
          case "month":
            const monthAgo = new Date(
              today.getTime() - 30 * 24 * 60 * 60 * 1000
            );
            if (linkDate < monthAgo) return false;
            break;
        }
      }

      // Domain filter
      if (filterOptions.domains.length > 0) {
        try {
          const linkDomain = new URL(link.url).hostname.replace("www.", "");
          if (!filterOptions.domains.includes(linkDomain)) return false;
        } catch {
          return false; // Skip invalid URLs
        }
      }

      return true;
    });

    // Sort links
    switch (filterOptions.sortBy) {
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "domain":
        filtered.sort((a, b) => {
          try {
            const domainA = new URL(a.url).hostname.replace("www.", "");
            const domainB = new URL(b.url).hostname.replace("www.", "");
            return domainA.localeCompare(domainB);
          } catch {
            return 0;
          }
        });
        break;
      case "newest":
      default:
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    return filtered;
  }, [links, searchQuery, filterOptions]);

  return (
    <div className="space-y-4">
      <ManageLinksHeader
        view={view}
        setView={setView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterOptions={filterOptions}
        setFilterOptions={setFilterOptions}
        availableDomains={availableDomains}
      />

      {view === "grid" ? (
        <LinkGrid
          collectionId={collectionId}
          onDeleteLink={handleDeleteLink}
          onUpdateLink={handleUpdateLink}
          isLoading={isLoading}
          links={filteredLinks} // Pass filtered links
        />
      ) : (
        <LinkTable
          collectionId={collectionId}
          onDeleteLink={handleDeleteLink}
          onUpdateLink={handleUpdateLink}
          isLoading={isLoading}
          links={filteredLinks} // Pass filtered links
        />
      )}

      {/* Floating Action Button */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="fixed bottom-8 right-8 z-50">
            {/* Pulsing Ring Animation */}
            <div className="absolute inset-0 h-16 w-16 rounded-full bg-primary/30 animate-ping"></div>
            <div className="absolute inset-0 h-16 w-16 rounded-full bg-primary/20 animate-pulse"></div>

            {/* Main Button */}
            <Button
              size="icon"
              className="relative h-16 w-16 rounded-full bg-gradient-to-br from-primary via-primary to-primary/80 hover:from-primary/90 hover:via-primary hover:to-primary shadow-2xl hover:shadow-primary/50 transition-all duration-500 hover:scale-125 hover:rotate-90 group border-2 border-white/20 backdrop-blur-sm"
            >
              {/* Sparkle Effect */}
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-bounce"></div>
              <div className="absolute -bottom-1 -left-1 h-2 w-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-bounce delay-150"></div>

              <PiPlusCircle className="h-7 w-7 text-white transition-all duration-500 group-hover:scale-110 drop-shadow-lg" />
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Link</DialogTitle>
          </DialogHeader>
          <AddLinkForm onLinkAdded={handleLinkAdded} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
