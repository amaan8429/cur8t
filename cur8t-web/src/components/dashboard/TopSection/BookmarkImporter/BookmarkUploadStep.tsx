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
import { Loader2, Upload, FileText, Download, Sparkles } from "lucide-react";
import { useBookmarkImporter } from "./useBookmarkImporter";

interface Props {
  importer: ReturnType<typeof useBookmarkImporter>;
}

export function BookmarkUploadStep({ importer }: Props) {
  const { selectedFile, handleFileSelect, uploadBookmarks, isLoading } =
    importer;

  const handleDownloadSample = () => {
    const link = document.createElement("a");
    link.href = "/test-bookmarks.html";
    link.download = "sample-bookmarks.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLoadSample = async () => {
    try {
      const response = await fetch("/test-bookmarks.html");
      const content = await response.text();
      const blob = new Blob([content], { type: "text/html" });
      const file = new File([blob], "sample-bookmarks.html", {
        type: "text/html",
      });

      // Create a synthetic file input event
      const event = {
        target: {
          files: [file],
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      handleFileSelect(event);
    } catch (error) {
      console.error("Failed to load sample file:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Upload Bookmark File
          </CardTitle>
          <CardDescription>
            Select your exported bookmark HTML file from Chrome, Firefox,
            Safari, or Edge
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
                <strong>Chrome:</strong> Settings → Bookmarks → Bookmark Manager
                → Export
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

      {/* Sample Data Section */}
      <Card className="border-dashed border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Sparkles className="h-4 w-4" />
            Try Sample Data
          </CardTitle>
          <CardDescription>
            Test the bookmark importer with our curated sample data containing
            60+ bookmarks across 10 categories
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={handleLoadSample}
              className="flex-1 border-primary/30 hover:bg-primary/10"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Load Sample Data
            </Button>
            <Button
              variant="outline"
              onClick={handleDownloadSample}
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Sample
            </Button>
          </div>
          <div className="p-3 bg-background/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Sample includes:</strong> Web Development, AI/ML, News,
              Productivity, Education, Entertainment, Finance, Health, Shopping,
              Travel, Social Media, and Tools
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
