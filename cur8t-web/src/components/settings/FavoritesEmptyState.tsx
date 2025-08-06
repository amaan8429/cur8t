import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PiPlus, PiBookmark } from "react-icons/pi";

const FavoritesEmptyState: React.FC = () => {
  return (
    <Card className="border-dashed border-2 border-muted-foreground/20">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="text-muted-foreground text-center">
          <div className="relative mb-4">
            <PiBookmark className="h-12 w-12 mx-auto opacity-50" />
            <PiPlus className="h-6 w-6 absolute -top-1 -right-1 bg-background rounded-full p-1" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
          <p className="text-sm max-w-md">
            Add your first favorite link above to get started. Your favorites
            will appear here for quick access.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FavoritesEmptyState;
