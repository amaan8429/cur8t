import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {PiSpinner, PiBrain} from "react-icons/pi";
import { useBookmarkImporter } from "./useBookmarkImporter";

interface Props {
  importer: ReturnType<typeof useBookmarkImporter>;
}

export function BookmarkAnalyzeStep({ importer }: Props) {
  const { uploadResult, analyzeBookmarks, isLoading } = importer;
  if (!uploadResult) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PiBrain className="h-4 w-4" />
          Analyze Bookmarks
        </CardTitle>
        <CardDescription>
          Using AI to categorize your {uploadResult.total_bookmarks} bookmarks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-muted/50 rounded">
            <div className="text-lg font-semibold">
              {uploadResult.total_bookmarks}
            </div>
            <div className="text-sm text-muted-foreground">Total Bookmarks</div>
          </div>
          <div className="p-3 bg-muted/50 rounded">
            <div className="text-lg font-semibold capitalize">
              {uploadResult.browser_detected}
            </div>
            <div className="text-sm text-muted-foreground">
              Browser Detected
            </div>
          </div>
        </div>
        {Object.keys(uploadResult.folder_structure).length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Bookmark Folders:</h4>
            <div className="space-y-1">
              {(
                Object.entries(uploadResult.folder_structure) as [
                  string,
                  number,
                ][]
              ).map(([folder, count]) => (
                <div key={folder} className="flex justify-between text-sm">
                  <span>{folder}</span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
        <Button
          onClick={analyzeBookmarks}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <PiSpinner className="h-4 w-4 mr-2 animate-spin" />
              Analyzing with AI...
            </>
          ) : (
            <>
              <PiBrain className="h-4 w-4 mr-2" />
              Start AI Analysis
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
