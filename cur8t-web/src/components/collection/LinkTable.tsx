/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { PiTrash, PiPencilSimple, PiArrowSquareOut } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { truncateUrl } from "@/lib/truncate";
import LoadingStates from "./Loading";
import EmptyStates from "./NoLinks";

interface LinkTableProps {
  collectionId: string;
  onDeleteLink: (id: string) => void;
  onUpdateLink: (id: string, data: { title?: string; url?: string }) => void;
  isLoading?: boolean;
  links: Link[];
}

const LinkTable = ({
  collectionId,
  onDeleteLink,
  onUpdateLink,
  isLoading = false,
  links,
}: LinkTableProps) => {
  const [editingLink, setEditingLink] = React.useState<Link | null>(null);
  const [newTitle, setNewTitle] = React.useState("");
  const [newUrl, setNewUrl] = React.useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  const filteredLinks = links.filter(
    (link) => link.linkCollectionId === collectionId
  );

  const handleEditClick = (link: Link) => {
    setEditingLink(link);
    setNewTitle(link.title);
    setNewUrl(link.url);
    setIsEditDialogOpen(true);
  };

  const handleUpdateConfirm = () => {
    if (
      editingLink &&
      (newTitle !== editingLink.title || newUrl !== editingLink.url)
    ) {
      const updates: { title?: string; url?: string } = {};
      if (newTitle !== editingLink.title) updates.title = newTitle;
      if (newUrl !== editingLink.url) updates.url = newUrl;
      onUpdateLink(editingLink.id, updates);
    }
    setIsEditDialogOpen(false);
    setEditingLink(null);
    setNewTitle("");
    setNewUrl("");
  };

  if (isLoading) {
    return <LoadingStates view="table" />;
  }

  if (filteredLinks.length === 0) {
    return <EmptyStates view="table" />;
  }

  return (
    <div className="rounded-md border border-border/30">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Title</TableHead>
            <TableHead>URL</TableHead>
            <TableHead className="w-[150px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLinks.map((link) => (
            <TableRow key={link.id}>
              <TableCell className="font-medium">{link.title}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">
                    {truncateUrl(link.url)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(link.url, "_blank")}
                  >
                    <PiArrowSquareOut className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditClick(link)}
                  >
                    <PiPencilSimple className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <PiTrash className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Link</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{link.title}"? This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDeleteLink(link.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Link</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter link title"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="url" className="text-sm font-medium">
                URL
              </label>
              <Input
                id="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="Enter URL"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={handleUpdateConfirm}
              disabled={!newTitle || !newUrl}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LinkTable;
