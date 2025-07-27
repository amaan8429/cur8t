import React from "react";
import { Link2, ExternalLink } from "lucide-react";
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
  formatFullDate,
} from "@/lib/exploreUtils";

interface TimelineCardProps {
  collection: CollectionWithAuthor;
}

export const TimelineCard: React.FC<TimelineCardProps> = ({ collection }) => (
  <TooltipProvider>
    <div className="flex gap-4 pb-6">
      <div className="flex flex-col items-center">
        <div className="w-2 h-2 bg-primary rounded-full mt-3"></div>
        <div className="w-px bg-border flex-1 mt-2"></div>
      </div>
      <div className="flex-1">
        <Card
          className="group hover:bg-muted/50 transition-colors cursor-pointer border border-border/50 hover:border-border"
          onClick={() => handleCollectionClick(collection.id)}
        >
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs bg-primary/10 text-primary font-medium">
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
                        className="text-sm font-medium text-foreground hover:text-primary transition-colors truncate max-w-[120px]"
                      >
                        {truncateText(collection.author, 15)}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{collection.author}</p>
                    </TooltipContent>
                  </Tooltip>
                  <span className="text-xs text-muted-foreground">created</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate max-w-[150px]">
                        {truncateText(collection.title, 20)}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{collection.title}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                {collection.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                    {collection.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Link2 className="h-3 w-3" />
                    <span>{collection.totalLinks} links</span>
                  </div>
                  <span>{formatFullDate(collection.createdAt.toString())}</span>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </TooltipProvider>
);
