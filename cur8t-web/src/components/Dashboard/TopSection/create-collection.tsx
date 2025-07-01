"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Globe2, Lock, Users, PlusCircle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useCollectionStore } from "@/store/collection-store";
import { useToast } from "@/hooks/use-toast";
import { createCollectionAction } from "@/actions/collection/createCollection";

interface CreateCollectionComponentProps {
  onSuccess?: (collectionId: string) => void;
  isDialog?: boolean;
}

export function CreateCollectionComponent({
  onSuccess,
  isDialog = false,
}: CreateCollectionComponentProps = {}) {
  const [collectionName, setCollectionName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [visibility, setVisibility] = React.useState("private");
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingProgress, setLoadingProgress] = React.useState(0);
  const [loadingMessage, setLoadingMessage] = React.useState("");
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
      setLoadingProgress(0);
      setLoadingMessage("Validating collection details...");

      // Simulate progress steps for better UX
      setLoadingProgress(20);

      setLoadingMessage("Creating collection...");
      setLoadingProgress(40);

      const collectionCreated = await createCollectionAction(
        collectionName,
        description,
        visibility
      );

      setLoadingProgress(70);
      setLoadingMessage("Setting up collection...");

      if (collectionCreated.success) {
        setLoadingProgress(90);
        setLoadingMessage("Finalizing...");

        await createACollection(collectionCreated.data);

        setLoadingProgress(100);
        setLoadingMessage("Collection created successfully!");

        // Reset form
        setCollectionName("");
        setDescription("");
        setVisibility("private");

        toast({
          description: "Collection created successfully!",
        });

        // Small delay to show completion
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (onSuccess) {
          onSuccess(collectionCreated.data.id);
        } else {
          router.push(
            `?collectionId=${encodeURIComponent(collectionCreated.data.id)}`
          );
        }
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
      setLoadingProgress(0);
      setLoadingMessage("");
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
    <div
      className={
        isDialog ? "space-y-6" : "flex items-center justify-center p-4"
      }
    >
      <div className={isDialog ? "w-full" : "w-full max-w-xl space-y-8"}>
        {!isDialog && (
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Create New Collection</h1>
            <p className="text-muted-foreground">
              Start organizing your content in one place
            </p>
          </div>
        )}

        {isLoading && (
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border/30">
            <div className="flex items-center space-x-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-sm font-medium">{loadingMessage}</span>
            </div>
            <div className="space-y-2">
              <Progress value={loadingProgress} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">
                {loadingProgress}% complete
              </p>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className={isDialog ? "space-y-6" : "space-y-8"}
        >
          <div className="space-y-4">
            <div className="relative">
              <Input
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                className={
                  isDialog ? "h-12 px-4" : "h-16 text-lg px-6 rounded-xl"
                }
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
                className={
                  isDialog
                    ? "min-h-[80px] px-4 py-3 resize-none"
                    : "min-h-[100px] text-lg px-6 py-4 rounded-xl resize-none"
                }
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
            <div
              className={
                isDialog
                  ? "grid gap-3 grid-cols-1 sm:grid-cols-3"
                  : "grid gap-4 md:grid-cols-3"
              }
            >
              {visibilityOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setVisibility(option.id)}
                  className={`${isDialog ? "p-3" : "p-4"} rounded-xl border border-border/30 text-left transition-all hover:border-border/50 ${
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
            className={
              isDialog ? "w-full h-12" : "w-full h-16 text-lg rounded-xl"
            }
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <PlusCircle className="mr-2 h-5 w-5" />
            )}
            {isLoading ? loadingMessage || "Creating..." : "Create Collection"}
          </Button>
        </form>
      </div>
    </div>
  );
}
