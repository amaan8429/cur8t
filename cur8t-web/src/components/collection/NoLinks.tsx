import React from "react";
import { PiLink, PiPlus } from "react-icons/pi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useLinkStore } from "@/store/link-store";

interface EmptyStatesProps {
  view: "grid" | "table" | "list";
}

const EmptyStates = ({ view }: EmptyStatesProps) => {
  const { setIsOpen } = useLinkStore();

  const EmptyContent = () => (
    <div className="text-center p-8">
      <PiLink className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">No links found</h3>
      <p className="text-sm text-muted-foreground mt-2 mb-4">
        Add your first link to get started
      </p>
      <Button onClick={() => setIsOpen(true)} className="mt-2">
        <PiPlus className="h-4 w-4 mr-2" />
        Add Your First Link
      </Button>
    </div>
  );

  // Return the same centered empty content for all views
  return (
    <div className="flex items-center justify-center min-h-[400px] w-full">
      <EmptyContent />
    </div>
  );
};

export default EmptyStates;
