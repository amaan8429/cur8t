import React from "react";
import { Link2, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLinkStore } from "@/store/link-store";

interface EmptyStatesProps {
  view: "grid" | "table" | "list";
}

const EmptyStates = ({ view }: EmptyStatesProps) => {
  const { setIsOpen } = useLinkStore();

  const EmptyContent = () => (
    <div className="text-center p-8">
      <Link2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">No links found</h3>
      <p className="text-sm text-muted-foreground mt-2 mb-4">
        Add your first link to get started
      </p>
      <Button onClick={() => setIsOpen(true)} className="mt-2">
        <Plus className="h-4 w-4 mr-2" />
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
