import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PiPlus } from "react-icons/pi";

interface AddFavoriteFormProps {
  newTitle: string;
  newUrl: string;
  setNewTitle: (title: string) => void;
  setNewUrl: (url: string) => void;
  onAdd: () => void;
  addingFavorite: boolean;
  favoritesCount: number;
  favoritesLimit: number;
  VALIDATION_LIMITS: {
    LINK_TITLE_MAX: number;
    LINK_URL_MAX: number;
  };
}

const AddFavoriteForm: React.FC<AddFavoriteFormProps> = ({
  newTitle,
  newUrl,
  setNewTitle,
  setNewUrl,
  onAdd,
  addingFavorite,
  favoritesCount,
  favoritesLimit,
  VALIDATION_LIMITS,
}) => {
  const isLimitReached = favoritesCount >= favoritesLimit;

  return (
    <Card className="border-dashed border-2 border-muted-foreground/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <PiPlus className="h-5 w-5" />
          Add New Favorite
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              placeholder="Enter a descriptive title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onAdd()}
              maxLength={VALIDATION_LIMITS.LINK_TITLE_MAX}
              disabled={isLimitReached}
            />
            <div className="text-xs text-muted-foreground">
              {newTitle.length}/{VALIDATION_LIMITS.LINK_TITLE_MAX} characters
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="url" className="text-sm font-medium">
              URL
            </label>
            <Input
              id="url"
              placeholder="https://example.com"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onAdd()}
              maxLength={VALIDATION_LIMITS.LINK_URL_MAX}
              disabled={isLimitReached}
            />
            <div className="text-xs text-muted-foreground">
              {newUrl.length}/{VALIDATION_LIMITS.LINK_URL_MAX} characters
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button
            onClick={onAdd}
            disabled={
              addingFavorite ||
              !newTitle.trim() ||
              !newUrl.trim() ||
              isLimitReached
            }
            className="w-full md:w-auto"
          >
            {addingFavorite ? "Adding..." : "Add Favorite"}
          </Button>
          <div className="text-sm text-muted-foreground">
            {favoritesCount}/{favoritesLimit} favorites
          </div>
        </div>

        {isLimitReached && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            You&apos;ve reached the maximum limit of {favoritesLimit} favorites.
            Please delete some before adding new ones.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AddFavoriteForm;
