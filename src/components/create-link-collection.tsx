"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { createCollection } from "@/actions/createCollection";

export function CreateLinkCollection() {
  const [collectionName, setCollectionName] = React.useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (collectionName.trim()) {
      const collectionCreated = await createCollection(collectionName);
      if (collectionCreated) {
        router.push(`?list=${encodeURIComponent(collectionName)}`);
      }
      console.log("Creating new collection:", collectionName);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create a New Link Collection</CardTitle>
        <CardDescription>
          Start organizing your links by creating a new collection.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="collection-name">Collection Name</Label>
            <Input
              id="collection-name"
              placeholder="Enter collection name"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Collection
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
