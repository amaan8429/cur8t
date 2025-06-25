"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Globe2, Lock, Users, PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCollectionStore } from "@/store/collection-store";
import { useToast } from "@/hooks/use-toast";
import { createCollectionAction } from "@/actions/collection/createCollection";

export function CreateCollectionComponent() {
  const [collectionName, setCollectionName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [visibility, setVisibility] = React.useState("private");
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const { createACollection } = useCollectionStore();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!collectionName.trim()) {
      toast({
        description: "Please enter a collection name",
        variant: "destructive",
      });
      return;
    }

    if (collectionName.length > 50) {
      toast({
        description:
          "Please enter a collection name with 50 characters or less",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const collectionCreated = await createCollectionAction(
        collectionName,
        description,
        visibility
      );
      if (collectionCreated.success) {
        createACollection(collectionCreated.data);
        router.push(
          `?collectionId=${encodeURIComponent(collectionCreated.data.id)}`
        );
      } else {
        toast({
          description: "Failed to create collection. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const visibilityOptions = [
    {
      id: "private",
      icon: Lock,
      title: "Private",
      description: "Only you can access this collection",
    },
    {
      id: "public",
      icon: Globe2,
      title: "Public",
      description: "Anyone can view this collection",
    },
    {
      id: "protected",
      icon: Users,
      title: "Protected",
      description: "Only selected people can access",
    },
  ];

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Create New Collection</h1>
          <p className="text-muted-foreground">
            Start organizing your content in one place
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <div className="relative">
              <Input
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                className="h-16 text-lg px-6 rounded-xl"
                placeholder="Collection name"
                disabled={isLoading}
              />
              <span className="absolute right-4 top-5 text-muted-foreground text-sm">
                {collectionName.length}/50
              </span>
            </div>

            <div className="relative">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px] text-lg px-6 py-4 rounded-xl resize-none"
                placeholder="Collection description (optional)"
                disabled={isLoading}
                maxLength={200}
              />
              <span className="absolute right-4 bottom-3 text-muted-foreground text-sm">
                {description.length}/200
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium mb-4">
              Choose visibility
            </label>
            <div className="grid gap-4 md:grid-cols-3">
              {visibilityOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setVisibility(option.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all hover:border-primary ${
                    visibility === option.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-accent"
                  }`}
                >
                  <option.icon className="h-6 w-6 mb-2" />
                  <div className="font-medium">{option.title}</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {option.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-16 text-lg rounded-xl"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            {isLoading ? "Creating..." : "Create Collection"}
          </Button>
        </form>
      </div>
    </div>
  );
}
