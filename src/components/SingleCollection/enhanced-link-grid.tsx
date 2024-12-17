"use client";

import * as React from "react";
import { Trash2, Globe, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

interface Link {
  id: string;
  userId: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  linkCollectionId: string;
}

interface EnhancedLinkGridProps {
  links: Link[];
  onDeleteLink: (id: string) => void;
  onUpdateLink: (id: string, data: { title?: string; url?: string }) => void;
}

function truncateUrl(url: string, maxLength: number = 30): string {
  if (url.length <= maxLength) return url;
  return url.substring(0, maxLength - 3) + "...";
}

export function EnhancedLinkGrid({
  links,
  onDeleteLink,
  onUpdateLink,
}: EnhancedLinkGridProps) {
  const [linkToDelete, setLinkToDelete] = React.useState<string | null>(null);
  const [editingLink, setEditingLink] = React.useState<Link | null>(null);
  const [newTitle, setNewTitle] = React.useState("");
  const [newUrl, setNewUrl] = React.useState("");
  const [open, setOpen] = React.useState(false);

  if (!links) {
    return <div>Loading...</div>;
  }

  if (links.length === 0) {
    return <div>No links found</div>;
  }

  const handleDeleteConfirm = () => {
    if (linkToDelete) {
      onDeleteLink(linkToDelete);
      setLinkToDelete(null);
    }
  };

  const handleEditClick = (link: Link) => {
    setEditingLink(link);
    setNewTitle(link.title);
    setNewUrl(link.url);
  };

  const handleUpdateConfirm = () => {
    if (editingLink) {
      const updates: { title?: string; url?: string } = {};
      if (newTitle !== editingLink.title) updates.title = newTitle;
      if (newUrl !== editingLink.url) updates.url = newUrl;

      if (Object.keys(updates).length > 0) {
        onUpdateLink(editingLink.id, updates);
      }
      setEditingLink(null);
      setOpen(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((link) => (
          <Card key={link.id} className="flex flex-col">
            <CardHeader className="flex-grow">
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={`https://www.google.com/s2/favicons?domain=${link.url}&sz=64`}
                    alt={link.title}
                  />
                  <AvatarFallback>
                    <Globe className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="truncate">{link.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm"
              >
                {truncateUrl(link.url)}
              </a>
            </CardContent>
            <CardFooter className="justify-between">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(link.url, "_blank")}
                >
                  Visit
                </Button>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(link)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Link</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <label htmlFor="title">Title</label>
                        <Input
                          id="title"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="url">URL</label>
                        <Input
                          id="url"
                          value={newUrl}
                          onChange={(e) => setNewUrl(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button onClick={handleUpdateConfirm}>
                        Save Changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setLinkToDelete(link.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the link from your collection.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteConfirm}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
