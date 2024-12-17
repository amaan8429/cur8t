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
import { EnhancedLinkGrid } from "@/components/SingleCollection/enhanced-link-grid";
import { addLink, deleteLink, updateLink } from "@/actions/link-actions";
import { getLinks } from "@/actions/getLinks";
import { useState, useEffect } from "react";

interface Link {
  id: string;
  userId: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  linkCollectionId: string;
}

export function AddLinksToCollection({
  collectionId,
}: {
  collectionId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [links, setLinks] = useState<Link[]>([]);
  const searchParams = useSearchParams();
  const pageId = searchParams.get("page");

  const refreshLinks = async () => {
    try {
      const data = await getLinks(collectionId);
      if ("error" in data) {
        console.error(data.error);
        setLinks([]);
      } else {
        setLinks(data.data);
      }
    } catch (error) {
      console.error("Failed to refresh links:", error);
    }
  };

  useEffect(() => {
    refreshLinks();
  }, [collectionId]);

  interface handleLinkProps {
    title: string;
    url: string;
  }

  const handleLinkAdded = async (newLink: handleLinkProps) => {
    try {
      await addLink(newLink, collectionId);
      refreshLinks();
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to add link:", error);
      alert("Could not add the link. Please try again.");
    }
  };

  const handleDeleteLink = async (id: string) => {
    try {
      await deleteLink(id);
      refreshLinks();
    } catch (error) {
      console.error("Failed to delete link:", error);
      alert("Could not delete the link. Please try again.");
    }
  };

  const handleUpdateLink = async (
    id: string,
    data: { title?: string; url?: string }
  ) => {
    try {
      await updateLink(id, data);
      refreshLinks();
    } catch (error) {
      console.error("Failed to update link:", error);
      alert("Could not update the link. Please try again.");
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
        <EnhancedLinkGrid
          links={links}
          onDeleteLink={handleDeleteLink}
          onUpdateLink={handleUpdateLink}
        />
      </div>
    </main>
  );
}
