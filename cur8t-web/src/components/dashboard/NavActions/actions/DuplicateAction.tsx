import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogFooter } from "@/components/ui/dialog";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCollectionStore } from "@/store/collection-store";
import { useActiveState } from "@/store/activeStateStore";
import { useToast } from "@/hooks/use-toast";
import { createCollectionAction } from "@/actions/collection/createCollection";
import { getLinksAction } from "@/actions/linkActions/getLinks";
import { createLinkAction } from "@/actions/linkActions/createLink";

interface DuplicateActionProps {
  duplicateName: string;
  setDuplicateName: (name: string) => void;
  includeContents: boolean;
  setIncludeContents: (include: boolean) => void;
  copyPermissions: boolean;
  setCopyPermissions: (copy: boolean) => void;
  isDuplicating: boolean;
  setIsDuplicating: (loading: boolean) => void;
  onClose: () => void;
}

export const DuplicateAction: React.FC<DuplicateActionProps> = ({
  duplicateName,
  setDuplicateName,
  includeContents,
  setIncludeContents,
  copyPermissions,
  setCopyPermissions,
  isDuplicating,
  setIsDuplicating,
  onClose,
}) => {
  const { updateCollectionVisibility, collections, createACollection } =
    useCollectionStore();
  const { activeCollectionId } = useActiveState();
  const {
    toast,
    success: toastSuccess,
    error: toastError,
    warning: toastWarning,
  } = useToast();

  const getActiveCollection = () =>
    collections?.find((c) => c.id === activeCollectionId);

  const handleConfirm = async () => {
    if (!activeCollectionId || !duplicateName.trim()) {
      toastWarning({
        title: "Name Required",
        description: "Please enter a collection name.",
      });
      return;
    }

    setIsDuplicating(true);
    try {
      const active = getActiveCollection();
      if (!active) {
        toastError({
          title: "Source Not Found",
          description: "Original collection not found.",
        });
        return;
      }

      // Determine visibility and emails for the duplicate
      let duplicateVisibility = "private";
      let duplicateEmails: string[] = [];

      if (copyPermissions) {
        duplicateVisibility = active.visibility;
        duplicateEmails = active.sharedEmails || [];
      }

      // Create the duplicate collection
      const result = await createCollectionAction(
        duplicateName,
        active.description || "",
        duplicateVisibility
      );

      // Check for rate limiting
      if (result.error && result.retryAfter) {
        const { showRateLimitToast } = await import(
          "@/components/ui/rate-limit-toast"
        );
        showRateLimitToast({
          retryAfter: result.retryAfter * 60,
          message: "Too many duplicate attempts. Please try again later.",
        });
        return;
      }

      if (!result.success) {
        toastError({
          title: "Duplicate Failed",
          description: "Failed to duplicate collection. Please try again.",
        });
        return;
      }

      const newCollection = result.data;

      // Update the collection store with the new collection
      await createACollection(newCollection);

      // Copy links if includeContents is true
      if (includeContents) {
        const linksResult = await getLinksAction(activeCollectionId);

        // Check for rate limiting on getLinksAction
        if (linksResult.error && linksResult.retryAfter) {
          const { showRateLimitToast } = await import(
            "@/components/ui/rate-limit-toast"
          );
          showRateLimitToast({
            retryAfter: linksResult.retryAfter * 60,
            message: "Too many link fetch attempts. Please try again later.",
          });
          return;
        }

        if (linksResult.success && linksResult.data) {
          // Copy each link to the new collection
          for (const link of linksResult.data) {
            const linkResult = await createLinkAction(newCollection.id, link.title, link.url);
            
            // Check for rate limiting on createLinkAction
            if (linkResult.error && linkResult.retryAfter) {
              const { showRateLimitToast } = await import(
                "@/components/ui/rate-limit-toast"
              );
              showRateLimitToast({
                retryAfter: linkResult.retryAfter * 60,
                message: "Too many link creation attempts. Please try again later.",
              });
              return;
            }
          }
        }
      }

      // Update visibility with emails if needed (for protected collections)
      if (
        copyPermissions &&
        duplicateVisibility === "protected" &&
        duplicateEmails.length > 0
      ) {
        await updateCollectionVisibility(
          newCollection.id,
          duplicateVisibility,
          duplicateEmails
        );
      }

      toastSuccess({
        title: "Collection Duplicated!",
        description: "Your collection has been successfully duplicated.",
      });

      onClose();
    } catch (error) {
      console.error(error);
      toastError({
        title: "An error occurred while duplicating",
        description:
          "An error occurred while duplicating the collection. Please try again later.",
      });
    } finally {
      setIsDuplicating(false);
    }
  };

  return (
    <>
      <div className="py-4 space-y-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="duplicate-name" className="text-right">
            New Name
          </Label>
          <Input
            id="duplicate-name"
            value={duplicateName}
            onChange={(e) => setDuplicateName(e.target.value)}
            className="col-span-3"
            placeholder="Enter collection name"
            disabled={isDuplicating}
          />
        </div>
        <div className="space-y-3">
          <TooltipProvider>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="duplicate-contents"
                checked={includeContents}
                onCheckedChange={(checked) =>
                  setIncludeContents(checked === true)
                }
                disabled={isDuplicating}
              />
              <Label
                htmlFor="duplicate-contents"
                className="flex items-center gap-1"
              >
                Include all contents
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Copy all links and bookmarks from the original collection
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="duplicate-permissions"
                checked={copyPermissions}
                onCheckedChange={(checked) =>
                  setCopyPermissions(checked === true)
                }
                disabled={isDuplicating}
              />
              <Label
                htmlFor="duplicate-permissions"
                className="flex items-center gap-1"
              >
                Copy permissions
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Copy visibility settings and shared email addresses from
                      the original collection
                    </p>
                  </TooltipContent>
                </Tooltip>
              </Label>
            </div>
          </TooltipProvider>
        </div>
      </div>
      <DialogFooter>
        <Button variant="secondary" onClick={onClose} disabled={isDuplicating}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={!duplicateName.trim() || isDuplicating}
        >
          {isDuplicating ? "Duplicating..." : "Duplicate"}
        </Button>
      </DialogFooter>
    </>
  );
};
