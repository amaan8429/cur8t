import React from "react";
import { Star, Link2, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CollectionWithAuthor } from "./types";
import {
  truncateText,
  handleCollectionClick,
  handleProfileClick,
  formatDate,
} from "@/lib/exploreUtils";

interface CollectionCardProps {
  collection: CollectionWithAuthor;
  isLarge?: boolean;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  isLarge = false,
}) => (
  <TooltipProvider>
    <Card
      className="group hover:bg-muted/50 transition-colors cursor-pointer border border-border/50 hover:border-border"
      onClick={() => handleCollectionClick(collection.id)}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10 mt-0.5">
            <AvatarFallback className="text-sm bg-primary/10 text-primary font-medium">
              {collection.author?.charAt(0)?.toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={(e) =>
                      handleProfileClick(e, collection.authorUsername)
                    }
                    className="text-sm text-muted-foreground hover:text-primary transition-colors truncate max-w-[100px]"
                  >
                    {truncateText(collection.author || "Anonymous", 12)}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{collection.author || "Anonymous"}</p>
                </TooltipContent>
              </Tooltip>
              <span className="text-muted-foreground">/</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate max-w-[200px]">
                    {truncateText(collection.title, 25)}
                  </h3>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{collection.title}</p>
                </TooltipContent>
              </Tooltip>
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                Public
              </Badge>
            </div>

            {collection.description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {collection.description}
              </p>
            )}

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span>collection</span>
              </div>

              {collection.likes > 0 && (
                <div className="flex items-center gap-1.5">
                  <Star className="h-3 w-3" />
                  <span>{collection.likes}</span>
                </div>
              )}

              <div className="flex items-center gap-1.5">
                <Link2 className="h-3 w-3" />
                <span>{collection.totalLinks}</span>
              </div>

              <span>Updated {formatDate(collection.updatedAt.toString())}</span>
            </div>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </CardContent>
    </Card>
  </TooltipProvider>
);
