import React from "react";
import {PiStar, PiLink, PiArrowSquareOut} from "react-icons/pi";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  truncateText,
  handleCollectionClick,
  handleProfileClick,
  formatDate,
  formatFullDate,
  getAuthorInitial,
  formatLinkCount,
} from "@/lib/exploreUtils";

// Define collection interface that works with all collection types
interface BaseCollection {
  id: string;
  title: string;
  description?: string | null;
  author: string;
  authorUsername: string | null;
  likes: number;
  totalLinks: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  visibility?: string;
}

type CardVariant = "featured" | "trending" | "timeline" | "saved";

interface UnifiedCollectionCardProps {
  collection: BaseCollection;
  variant: CardVariant;
  index?: number; // For trending numbers
  showCreateDate?: boolean; // For timeline
}

export const UnifiedCollectionCard: React.FC<UnifiedCollectionCardProps> = ({
  collection,
  variant,
  index,
  showCreateDate = false,
}) => {
  const renderTrendingCard = () => (
    <div
      className="flex items-start gap-3 p-3 -m-3 rounded-lg hover:bg-muted/50 transition-colors group cursor-pointer"
      onClick={() => handleCollectionClick(collection.id)}
    >
      <div className="flex items-center justify-center h-4 w-4 bg-primary text-primary-foreground rounded-full text-xs font-medium flex-shrink-0 mt-0.5">
        {(index ?? 0) + 1}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 text-xs mb-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={(e) =>
                  handleProfileClick(e, collection.authorUsername)
                }
                className="text-muted-foreground hover:text-primary truncate max-w-[80px]"
              >
                {truncateText(collection.author, 10)}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{collection.author}</p>
            </TooltipContent>
          </Tooltip>
          <span className="text-muted-foreground">/</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="font-medium text-foreground group-hover:text-primary transition-colors truncate max-w-[120px]">
                {truncateText(collection.title, 15)}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{collection.title}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1">
          {truncateText(
            collection.description || "Collection of curated links",
            50
          )}
        </p>
      </div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
        <PiStar className="h-3 w-3" />
        <span>{collection.likes}</span>
      </div>
    </div>
  );

  const renderSavedCard = () => (
    <div
      className="flex items-center gap-3 p-3 -m-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
      onClick={() => handleCollectionClick(collection.id)}
    >
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback className="text-xs bg-primary/10 text-primary">
          {getAuthorInitial(collection.author)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="text-xs font-medium text-foreground truncate max-w-[180px] group-hover:text-primary transition-colors">
              {truncateText(collection.title, 25)}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{collection.title}</p>
          </TooltipContent>
        </Tooltip>
        <div className="text-xs text-muted-foreground">
          {formatLinkCount(collection.totalLinks)}
        </div>
      </div>
      <PiArrowSquareOut className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
    </div>
  );

  const renderTimelineCard = () => (
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
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className="text-xs bg-primary/10 text-primary font-medium">
                  {getAuthorInitial(collection.author)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
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
                      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate max-w-[200px]">
                        {truncateText(collection.title, 30)}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{collection.title}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                {collection.description && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2 cursor-help">
                        {truncateText(collection.description, 120)}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{collection.description}</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <PiLink className="h-3 w-3" />
                    <span>{formatLinkCount(collection.totalLinks)}</span>
                  </div>
                  <span>
                    {formatFullDate(
                      showCreateDate
                        ? collection.createdAt.toString()
                        : collection.updatedAt.toString()
                    )}
                  </span>
                </div>
              </div>
              <PiArrowSquareOut className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderFeaturedCard = () => (
    <Card
      className="group hover:bg-muted/50 transition-colors cursor-pointer border border-border/50 hover:border-border"
      onClick={() => handleCollectionClick(collection.id)}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10 mt-0.5 flex-shrink-0">
            <AvatarFallback className="text-sm bg-primary/10 text-primary font-medium">
              {getAuthorInitial(collection.author)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={(e) =>
                      handleProfileClick(e, collection.authorUsername)
                    }
                    className="text-sm text-muted-foreground hover:text-primary transition-colors truncate max-w-[120px]"
                  >
                    {truncateText(collection.author || "Anonymous", 15)}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{collection.author || "Anonymous"}</p>
                </TooltipContent>
              </Tooltip>
              <span className="text-muted-foreground">/</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate max-w-[250px]">
                    {truncateText(collection.title, 35)}
                  </h3>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{collection.title}</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {collection.description && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2 cursor-help">
                    {truncateText(collection.description, 120)}
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{collection.description}</p>
                </TooltipContent>
              </Tooltip>
            )}

            <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span>collection</span>
              </div>

              {collection.likes > 0 && (
                <div className="flex items-center gap-1.5">
                  <PiStar className="h-3 w-3" />
                  <span>{collection.likes}</span>
                </div>
              )}

              <div className="flex items-center gap-1.5">
                <PiLink className="h-3 w-3" />
                <span>{formatLinkCount(collection.totalLinks)}</span>
              </div>

              <span>Updated {formatDate(collection.updatedAt.toString())}</span>
            </div>
          </div>
          <PiArrowSquareOut className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <TooltipProvider>
      {variant === "trending" && renderTrendingCard()}
      {variant === "saved" && renderSavedCard()}
      {variant === "timeline" && renderTimelineCard()}
      {variant === "featured" && renderFeaturedCard()}
    </TooltipProvider>
  );
};
