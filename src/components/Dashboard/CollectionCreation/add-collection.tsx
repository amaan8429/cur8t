"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Folder, X } from "lucide-react";

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
import { useCollectionStore } from "@/store/collection-store";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function CreateCollectionComponent() {
  const [collectionName, setCollectionName] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const router = useRouter();
  const { createACollection } = useCollectionStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!collectionName.trim()) {
      setError("Please enter a collection name");
      return;
    }

    setIsLoading(true);
    try {
      const collectionCreated = await createCollection(collectionName);
      if (collectionCreated.success) {
        createACollection(collectionCreated.data);
        router.push(
          `?collectionId=${encodeURIComponent(collectionCreated.data.id)}`
        );
      } else {
        setError("Failed to create collection. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 ">
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-4">
            <div className="flex items-center space-x-2">
              <Folder className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Create Collection</CardTitle>
            </div>
            <CardDescription className="text-base">
              Organize your links in a new collection to keep them easily
              accessible
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription className="flex items-center">
                      <X className="h-4 w-4 mr-2" />
                      {error}
                    </AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="collection-name" className="text-base">
                    Collection Name
                  </Label>
                  <Input
                    id="collection-name"
                    placeholder="e.g., Work Resources, Reading List"
                    value={collectionName}
                    onChange={(e) => setCollectionName(e.target.value)}
                    className="h-12"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full h-12 text-base font-medium"
                disabled={isLoading}
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                {isLoading ? "Creating..." : "Create Collection"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
