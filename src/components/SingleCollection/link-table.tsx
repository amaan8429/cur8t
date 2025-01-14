import React, { useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Link } from "@/types/types";
import { useLinkStore } from "@/store/link-store";

interface LinkTableProps {
  collectionId: string;
  onDeleteLink: (id: string) => void;
  onUpdateLink: (id: string, data: { title?: string; url?: string }) => void;
  isLoading?: boolean;
}

export function LinkTable({
  collectionId,
  onDeleteLink,
  onUpdateLink,
  isLoading = false,
}: LinkTableProps) {
  const { links } = useLinkStore();

  // State for editing links
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");

  // State for confirming delete
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null);

  // Handlers
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
      setEditingLink(null); // Reset the editing state
      setNewTitle("");
      setNewUrl("");
    }
  };

  const handleDeleteConfirm = () => {
    if (linkToDelete) {
      onDeleteLink(linkToDelete);
      setLinkToDelete(null);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (links.length === 0) return <p>No links found</p>;

  return (
    <table className="table-auto w-full text-left border">
      <thead>
        <tr>
          <th className="border px-4 py-2">Title</th>
          <th className="border px-4 py-2">URL</th>
          <th className="border px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {links
          .filter((link) => link.linkCollectionId === collectionId)
          .map((link) => (
            <tr key={link.id}>
              <td className="border px-4 py-2">{link.title}</td>
              <td className="border px-4 py-2">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {link.url}
                </a>
              </td>
              <td className="border px-4 py-2 flex gap-2">
                {/* Edit Button */}
                <Dialog
                  open={editingLink?.id === link.id}
                  onOpenChange={() => setEditingLink(null)}
                >
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
                      <Button
                        disabled={!newTitle || !newUrl}
                        onClick={handleUpdateConfirm}
                      >
                        Save Changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Delete Button */}
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
                      <AlertDialogTitle>Delete Link</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this link? This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteConfirm}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
