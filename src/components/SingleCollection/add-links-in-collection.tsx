"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { PlusCircle } from "lucide-react";
import { VisuallyHidden } from "@/components/ui/visually-hidden";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddLinkForm } from "@/components/add-link-form";
import { LinkGrid } from "@/components/SingleCollection/enhanced-link-grid";
import { useLinkStore } from "@/store/link-store";
import { useToast } from "@/hooks/use-toast";

export function AddLinksToCollection({
  collectionId,
}: {
  collectionId: string;
}) {
  const {
    links,
    isOpen,
    setIsOpen,
    refreshLinks,
    addLink,
    deleteLink,
    updateLink,
    isLoading,
  } = useLinkStore();

  const { toast } = useToast();

  React.useEffect(() => {
    refreshLinks(collectionId);
  }, [collectionId, refreshLinks]);

  const handleLinkAdded = async (newLink: { title: string; url: string }) => {
    if (!newLink.title.trim() || !newLink.url.trim()) {
      toast({
        title: "Title and URL cannot be empty",
        variant: "destructive",
      });
      return;
    }
    try {
      await addLink(newLink, collectionId);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to add link:", error);
    }
  };

  const handleDeleteLink = async (id: string) => {
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
      refreshLinks(collectionId);
    } catch (error) {
      console.error("Failed to update link:", error);
    }
  };

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="mb-8">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <VisuallyHidden>
                <DialogTitle>Add New Link</DialogTitle>
              </VisuallyHidden>
            </DialogHeader>
            <AddLinkForm onLinkAdded={handleLinkAdded} />
          </DialogContent>
        </Dialog>
        <LinkGrid
          links={links}
          onDeleteLink={handleDeleteLink}
          onUpdateLink={handleUpdateLink}
          isLoading={isLoading}
        />
      </div>
    </main>
  );
}
