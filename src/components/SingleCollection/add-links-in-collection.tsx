"use client";

import { PlusCircle } from "lucide-react";
import React from "react";
import { VisuallyHidden } from "@/components/ui/visually-hidden";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LinkGrid } from "@/components/SingleCollection/enhanced-link-grid";
import { useLinkStore } from "@/store/link-store";
import { useToast } from "@/hooks/use-toast";
import { FrontendLink, FrontendLinkSchema } from "@/types/types";
import { AddLinkForm } from "./add-link-form";

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

  const fetchedLinks = React.useRef(new Set<string>());

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
          collectionId={collectionId}
          onDeleteLink={handleDeleteLink}
          onUpdateLink={handleUpdateLink}
          isLoading={isLoading}
        />
      </div>
    </main>
  );
}
