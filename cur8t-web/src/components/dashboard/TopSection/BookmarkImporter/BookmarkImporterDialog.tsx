"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { BookmarkImporterDialogProps } from "./types";
import { useBookmarkImporter } from "./useBookmarkImporter";
import { BookmarkUploadStep } from "./BookmarkUploadStep";
import { BookmarkAnalyzeStep } from "./BookmarkAnalyzeStep";
import { BookmarkPreviewStep } from "./BookmarkPreviewStep";
import { BookmarkCompleteStep } from "./BookmarkCompleteStep";
import { BookmarkImporterSteps } from "./BookmarkImporterSteps";

export function BookmarkImporterDialog({
  open,
  onOpenChange,
}: BookmarkImporterDialogProps) {
  const importer = useBookmarkImporter();

  React.useEffect(() => {
    if (!open) importer.resetDialog();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bookmark Importer</DialogTitle>
          <DialogDescription>
            Import your browser bookmarks and organize them into smart
            collections
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <BookmarkImporterSteps currentStep={importer.currentStep} />
          {importer.currentStep === "upload" && (
            <BookmarkUploadStep importer={importer} />
          )}
          {importer.currentStep === "analyze" && (
            <BookmarkAnalyzeStep importer={importer} />
          )}
          {importer.currentStep === "preview" && (
            <BookmarkPreviewStep importer={importer} />
          )}
          {importer.currentStep === "complete" && (
            <BookmarkCompleteStep
              importer={importer}
              onOpenChange={onOpenChange}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
