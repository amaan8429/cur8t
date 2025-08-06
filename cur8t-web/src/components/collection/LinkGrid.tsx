'use client';

import * as React from 'react';
import { PiTrash, PiGlobe, PiPencilSimple } from 'react-icons/pi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';

import { Link } from '@/types/types';
import { truncateUrl } from '@/lib/truncate';
import { useLinkStore } from '@/store/link-store';
import LoadingStates from './Loading';
import EmptyStates from './NoLinks';

interface LinkGridProps {
  collectionId: string;
  onDeleteLink: (id: string) => void;
  onUpdateLink: (id: string, data: { title?: string; url?: string }) => void;
  isLoading?: boolean;
  links: Link[];
}

export function LinkGrid({
  collectionId,
  onDeleteLink,
  onUpdateLink,
  isLoading = false,
  links,
}: LinkGridProps) {
  const [linkToDelete, setLinkToDelete] = React.useState<string | null>(null);
  const [editingLink, setEditingLink] = React.useState<Link | null>(null);
  const [newTitle, setNewTitle] = React.useState('');
  const [newUrl, setNewUrl] = React.useState('');
  const [open, setOpen] = React.useState(false);

  // Filter links for this collection first
  const collectionLinks = links.filter(
    (link) => link.linkCollectionId === collectionId
  );

  if (isLoading) {
    return <LoadingStates view="grid" />;
  }

  if (collectionLinks.length === 0) {
    return <EmptyStates view="grid" />;
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
      setNewTitle('');
      setNewUrl('');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {collectionLinks.map((link) => {
        return (
          <Card
            key={link.id}
            className="flex flex-col hover:shadow-sm transition-shadow"
          >
            <CardHeader className="flex-grow">
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={`https://www.google.com/s2/favicons?domain=${link.url}&sz=64`}
                    alt={link.title}
                  />
                  <AvatarFallback>
                    <PiGlobe className="h-6 w-6" />
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
                  onClick={() => window.open(link.url, '_blank')}
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
                      <PiPencilSimple className="h-4 w-4" />
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
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setLinkToDelete(link.id)}
                  >
                    <PiTrash className="h-4 w-4" />
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
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
