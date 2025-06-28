import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface LoadingStatesProps {
  view: "grid" | "table" | "list";
}

const LoadingStates = ({ view }: LoadingStatesProps) => {
  if (view === "table") {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">
                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              </TableHead>
              <TableHead>
                <div className="h-4 w-16 bg-muted rounded animate-pulse" />
              </TableHead>
              <TableHead className="text-right">
                <div className="h-4 w-20 bg-muted rounded animate-pulse ml-auto" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="h-4 w-48 bg-muted rounded animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-64 bg-muted rounded animate-pulse" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <div className="h-8 w-8 bg-muted rounded animate-pulse" />
                    <div className="h-8 w-8 bg-muted rounded animate-pulse" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (view === "list") {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="h-10 w-10 rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-48 bg-muted rounded" />
                    <div className="h-3 w-64 bg-muted rounded" />
                  </div>
                </div>
                <div className="h-8 w-8 bg-muted rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="flex flex-col animate-pulse">
          <CardHeader className="flex-grow">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-muted" />
              <div className="h-4 w-32 bg-muted rounded" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-4 w-48 bg-muted rounded" />
          </CardContent>
          <CardFooter className="justify-between">
            <div className="flex gap-2">
              <div className="h-8 w-16 bg-muted rounded" />
              <div className="h-8 w-8 bg-muted rounded" />
            </div>
            <div className="h-8 w-8 bg-muted rounded" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default LoadingStates;
