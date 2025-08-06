"use client";

import React, { useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PiLink, PiCheck, PiTwitterLogo, PiLinkedinLogo } from "react-icons/pi";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const CopyCollectionLink = ({ collectionId }: { collectionId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const shareLink = `https://bukmarks.com/collection/${collectionId}`;
  const { toast, success: toastSuccess, error: toastError } = useToast();

  const handleCopyLink = async () => {
    try {
      const collectionUrl = `${window.location.origin}/collection/${collectionId}`;
      await navigator.clipboard.writeText(collectionUrl);
      toastSuccess({
        title: "Link Copied!",
        description: "Collection link has been copied to clipboard.",
      });
    } catch (error) {
      console.error("Failed to copy link:", error);
      toastError({
        title: "Copy Failed",
        description: "Failed to copy the link. Please try again.",
      });
    }
  };

  const shareToSocialMedia = (platform: string) => {
    let url = "";
    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          shareLink
        )}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          shareLink
        )}`;
        break;
    }
    window.open(url, "_blank");
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <div className="flex items-center">
              <PiLink className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Copy Link</span>
            </div>
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share link</DialogTitle>
            <DialogDescription>
              Anyone with this link will be able to view this collection.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 mt-4">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input
                id="link"
                defaultValue={shareLink}
                readOnly
                className="w-full"
              />
            </div>
            <Button
              type="submit"
              size="sm"
              className="px-3 relative"
              onClick={handleCopyLink}
            >
              <span className={isCopied ? "opacity-0" : "opacity-100"}>
                Copy
              </span>
              {isCopied && (
                <motion.span
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <PiCheck className="h-4 w-4" />
                </motion.span>
              )}
            </Button>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => shareToSocialMedia("twitter")}
            >
              <PiTwitterLogo className="h-4 w-4" />
              <span className="sr-only">Share on Twitter</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => shareToSocialMedia("linkedin")}
            >
              <PiLinkedinLogo className="h-4 w-4" />
              <span className="sr-only">Share on LinkedIn</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CopyCollectionLink;
