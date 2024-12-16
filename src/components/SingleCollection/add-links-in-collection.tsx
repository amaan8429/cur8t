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
import { addLink, deleteLink } from "@/actions/link-actions";
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
        setLinks([]); // Clear links if there’s an error
      } else {
        setLinks(data.data); // Update state with the new list of links
      }
    } catch (error) {
      console.error("Failed to refresh links:", error);
    }
  };

  useEffect(() => {
    refreshLinks(); // Load links when the component mounts
  }, [collectionId]);

  interface handleLinkProps {
    title: string;
    url: string;
  }

  const handleLinkAdded = async (newLink: handleLinkProps) => {
    try {
      await addLink(newLink, collectionId); // Add link to the database
      refreshLinks(); // Refresh the links in the grid
      setIsOpen(false); // Close the dialog
    } catch (error) {
      console.error("Failed to add link:", error);
      alert("Could not add the link. Please try again."); // Notify the user
    }
  };

  const handleDeleteLink = async (id: string) => {
    try {
      await deleteLink(id); // Delete the link from the database
      refreshLinks(); // Refresh the links in the grid
    } catch (error) {
      console.error("Failed to delete link:", error);
      alert("Could not delete the link. Please try again.");
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
        <EnhancedLinkGrid links={links} onDeleteLink={handleDeleteLink} />
      </div>
    </main>
  );
}
