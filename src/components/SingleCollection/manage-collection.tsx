"use client";

import React from "react";
import { useLinkStore } from "@/store/link-store";
import { useToast } from "@/hooks/use-toast";
import { FrontendLink, FrontendLinkSchema } from "@/types/types";
import { LinkGrid } from "./link-grid";
import LinkTable from "./link-table";
import ManageLinksHeader from "./link-header";

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

  React.useEffect(() => {
    if (fetchedLinks.current.has(collectionId)) return;
    refreshLinks(collectionId);
    fetchedLinks.current.add(collectionId);
  }, [collectionId]);

  const handleLinkAdded = async (newLink: FrontendLink) => {
    const parsedLink = FrontendLinkSchema.safeParse(newLink);
    if (!parsedLink.success) {
      return toast({
        title: "Failed to add link",
        description:
          parsedLink.error.errors.length > 0
            ? parsedLink.error.errors[0].message
            : "Unknown error",
      });
    }
    try {
      await addLink(parsedLink.data, collectionId);
    } catch (error) {
      console.error("Failed to add link:", error);
    } finally {
      setIsOpen(false);
    }
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

  // Filter links based on search query
  const filteredLinks = React.useMemo(() => {
    return links.filter((link) => {
      const searchLower = searchQuery.toLowerCase().trim();
      return (
        link.title.toLowerCase().includes(searchLower) ||
        link.url.toLowerCase().includes(searchLower)
      );
    });
  }, [links, searchQuery]);

  return (
    <div className="space-y-4">
      <ManageLinksHeader
        view={view}
        setView={setView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onLinkAdded={handleLinkAdded}
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
    </div>
  );
}
