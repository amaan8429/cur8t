import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

const LoadingLinks = () => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default LoadingLinks;
