import React from "react";
import { Link2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface EmptyStatesProps {
  view: "grid" | "table";
}

const EmptyStates = ({ view }: EmptyStatesProps) => {
  const EmptyContent = () => (
    <div className="text-center p-8">
      <Link2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">No links found</h3>
      <p className="text-sm text-muted-foreground mt-2">
        Add your first link to get started
      </p>
    </div>
  );

  if (view === "table") {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Title</TableHead>
              <TableHead>URL</TableHead>
              <TableHead className="w-[150px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={3} className="h-48">
                <EmptyContent />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="col-span-full h-48 flex items-center justify-center">
        <EmptyContent />
      </Card>
    </div>
  );
};

export default EmptyStates;
