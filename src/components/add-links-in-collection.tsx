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
import { EnhancedLinkGrid } from "@/components/enhanced-link-grid";

interface Link {
  id: string;
  title: string;
  url: string;
}

export function AddLinksToCollection() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [links, setLinks] = React.useState<Link[]>([]);
  const searchParams = useSearchParams();
  const pageId = searchParams.get("page");

  const handleLinkAdded = (newLink: Link) => {
    setLinks((prevLinks) => [...prevLinks, newLink]);
    setIsOpen(false);
  };

  const handleDeleteLink = (id: string) => {
    setLinks((prevLinks) => prevLinks.filter((link) => link.id !== id));
  };

  const refreshLinks = () => {
    // In a real application, you would fetch the links from an API here
    console.log("Refreshing links for page:", pageId);
  };

  React.useEffect(() => {
    refreshLinks();
  }, [pageId]);

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
          initialLinks={links}
          refreshLinks={refreshLinks}
          onDeleteLink={handleDeleteLink}
        />
      </div>
    </main>
  );
}
