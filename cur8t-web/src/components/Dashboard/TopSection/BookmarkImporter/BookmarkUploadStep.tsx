import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, FileText } from "lucide-react";
import { useBookmarkImporter } from "./useBookmarkImporter";

interface Props {
  importer: ReturnType<typeof useBookmarkImporter>;
}

export function BookmarkUploadStep({ importer }: Props) {
  const { selectedFile, handleFileSelect, uploadBookmarks, isLoading } =
    importer;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Upload Bookmark File
        </CardTitle>
        <CardDescription>
          Select your exported bookmark HTML file from Chrome, Firefox, Safari,
          or Edge
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="bookmark-file">Bookmark File</Label>
          <Input
            id="bookmark-file"
            type="file"
            accept=".html,text/html"
            onChange={handleFileSelect}
          />
          {selectedFile && (
            <p className="text-sm text-muted-foreground">
              Selected: {selectedFile.name} (
              {(selectedFile.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>
        <div className="p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">How to export bookmarks:</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>
              <strong>Chrome:</strong> Settings → Bookmarks → Bookmark Manager →
              Export
            </li>
            <li>
              <strong>Firefox:</strong> Library → Bookmarks → Export Bookmarks
              to HTML
            </li>
            <li>
              <strong>Safari:</strong> File → Export Bookmarks
            </li>
            <li>
              <strong>Edge:</strong> Settings → Profiles → Export bookmarks
            </li>
          </ul>
        </div>
        <Button
          onClick={uploadBookmarks}
          disabled={!selectedFile || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload & Parse Bookmarks
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
