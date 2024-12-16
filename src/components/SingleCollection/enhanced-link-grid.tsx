"use client";

import * as React from "react";
import { Trash2, Globe } from "lucide-react";

import { Button } from "@/components/ui/button";
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
}

function truncateUrl(url: string, maxLength: number = 30): string {
  if (url.length <= maxLength) return url;
  return url.substring(0, maxLength - 3) + "...";
}

export function EnhancedLinkGrid({
  links,
  onDeleteLink,
}: EnhancedLinkGridProps) {
  const [linkToDelete, setLinkToDelete] = React.useState<string | null>(null);

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
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(link.url, "_blank")}
              >
                Visit
              </Button>
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
