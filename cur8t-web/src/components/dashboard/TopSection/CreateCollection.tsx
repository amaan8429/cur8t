"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Globe2, Lock, Users, PlusCircle, Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useCollectionStore } from "@/store/collection-store";
import { useToast } from "@/hooks/use-toast";
import { createCollectionAction } from "@/actions/collection/createCollection";
import { useActiveState } from "@/store/activeStateStore";

interface CreateCollectionComponentProps {
  onSuccess?: (collectionId: string) => void;
  isDialog?: boolean;
}

export function CreateCollectionComponent({
  onSuccess,
  isDialog = false,
}: CreateCollectionComponentProps = {}) {
  const [collectionName, setCollectionName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("private");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("");
  const router = useRouter();
  const { createACollection } = useCollectionStore();
  const {
    toast,
    success: toastSuccess,
    error: toastError,
    warning: toastWarning,
  } = useToast();
  const { activeCollectionId, setActiveCollectionId } = useActiveState();
  const [newCollectionTitle, setNewCollectionTitle] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (collectionName.trim().length === 0) {
      toastWarning({
        title: "Collection Name Required",
        description: "Please enter a name for your collection.",
      });
      return;
    }

    if (collectionName.length > 50) {
      toastWarning({
        title: "Name Too Long",
        description: "Collection name must be 50 characters or less.",
      });
      return;
    }

    setIsLoading(true);
    setLoadingProgress(10);
    setLoadingMessage("Creating collection...");

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
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
        setActiveCollectionId(collectionCreated.data.id);

        setLoadingProgress(100);
        setLoadingMessage("Collection created successfully!");

        // Reset form
        setCollectionName("");
        setDescription("");
        setVisibility("private");

        toastSuccess({
          title: "Collection Created!",
          description: `"${collectionName}" has been successfully created.`,
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
        toastError({
          title: "Creation Failed",
          description:
            collectionCreated.error ||
            "Failed to create collection. Please try again.",
        });
      }
    } catch (err) {
      console.error("Error creating collection:", err);
      toastError({
        title: "Creation Failed",
        description: "Something went wrong. Please try again.",
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

  const handleCreateCollection = async () => {
    if (!newCollectionTitle.trim()) {
      toastWarning({
        title: "Collection Name Required",
        description: "Please enter a name for your collection.",
      });
      return;
    }

    if (newCollectionTitle.length > 50) {
      toastWarning({
        title: "Name Too Long",
        description: "Collection name must be 50 characters or less.",
      });
      return;
    }

    try {
      setLoading(true);
      const result = await createCollectionAction(
        newCollectionTitle,
        "",
        "private"
      );

      // Check for rate limiting
      if (result.error && result.retryAfter) {
        const { showRateLimitToast } = await import(
          "@/components/ui/rate-limit-toast"
        );
        showRateLimitToast({
          retryAfter: result.retryAfter * 60,
          message:
            "Too many collection creation attempts. Please try again later.",
        });
        return;
      }

      if (result.success) {
        const newCollection = result.data;
        await createACollection(newCollection);
        setActiveCollectionId(newCollection.id);

        toastSuccess({
          title: "Collection Created!",
          description: `"${newCollectionTitle}" has been successfully created.`,
        });

        setNewCollectionTitle("");
        setOpen(false);
      } else {
        toastError({
          title: "Creation Failed",
          description:
            result.error || "Failed to create collection. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error creating collection:", error);
      toastError({
        title: "Creation Failed",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

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
