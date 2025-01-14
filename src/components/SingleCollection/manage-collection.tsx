"use client";

import React from "react";
import { PlusCircle, LayoutGrid, Table } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLinkStore } from "@/store/link-store";
import { useToast } from "@/hooks/use-toast";
import { FrontendLink, FrontendLinkSchema } from "@/types/types";
import { AddLinkForm } from "./add-link-form";
import { LinkGrid } from "./link-grid";
import { LinkTable } from "./link-table";

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
  } = useLinkStore();
  const { toast } = useToast();
  const [view, setView] = React.useState<"grid" | "table">("grid"); // State for toggling views

  const fetchedLinks = React.useRef(new Set());

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

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setView("grid")}
            disabled={view === "grid"}
          >
            <LayoutGrid className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            onClick={() => setView("table")}
            disabled={view === "table"}
          >
            <Table className="h-5 w-5" />
          </Button>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-5 w-5 mr-2" />
              Add New Link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Link</DialogTitle>
            </DialogHeader>
            <AddLinkForm onLinkAdded={handleLinkAdded} />
          </DialogContent>
        </Dialog>
      </div>

      {/* View Section */}
      {view === "grid" ? (
        <LinkGrid
          collectionId={collectionId}
          onDeleteLink={handleDeleteLink}
          onUpdateLink={handleUpdateLink}
          isLoading={isLoading}
        />
      ) : (
        <LinkTable
          collectionId={collectionId}
          onDeleteLink={handleDeleteLink}
          onUpdateLink={handleUpdateLink}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
