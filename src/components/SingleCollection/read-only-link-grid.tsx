"use client";

import * as React from "react";
import { Globe, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "@/types/types";
import { truncateUrl } from "@/lib/truncate";
import LoadingStates from "./loading";
import EmptyStates from "./no-links";

interface ReadOnlyLinkGridProps {
  links: Link[];
  isLoading?: boolean;
}

export function ReadOnlyLinkGrid({
  links,
  isLoading = false,
}: ReadOnlyLinkGridProps) {
  if (isLoading) {
    return <LoadingStates view="grid" />;
  }

  if (links.length === 0) {
    return <EmptyStates view="grid" />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {links.map((link) => {
        return (
          <Card
            key={link.id}
            className="flex flex-col hover:shadow-md transition-shadow"
          >
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
            <CardFooter>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => window.open(link.url, "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Link
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
