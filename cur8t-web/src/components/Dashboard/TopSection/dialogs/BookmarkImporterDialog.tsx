"use client";

import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Upload,
  FileText,
  Brain,
  Eye,
  CheckCircle,
  AlertCircle,
  Loader2,
  FolderOpen,
  Plus,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  agentsApi,
  type BookmarkUploadResponse,
  type BookmarkAnalysisResponse,
  type BookmarkCategory,
} from "@/lib/api/agents";

interface BookmarkImporterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Use the types from the API service
type UploadResult = BookmarkUploadResponse;
type AnalysisResult = BookmarkAnalysisResponse;

type Step = "upload" | "analyze" | "preview" | "create" | "complete";

export function BookmarkImporterDialog({
  open,
  onOpenChange,
}: BookmarkImporterDialogProps) {
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [customNames, setCustomNames] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const resetDialog = useCallback(() => {
    setCurrentStep("upload");
    setIsLoading(false);
    setSelectedFile(null);
    setUploadResult(null);
    setAnalysisResult(null);
    setSelectedCategories([]);
    setCustomNames({});
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "text/html" || file.name.endsWith(".html")) {
        setSelectedFile(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select an HTML bookmark file.",
          variant: "destructive",
        });
      }
    }
  };

  const uploadBookmarks = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    try {
      const result = await agentsApi.uploadBookmarks(selectedFile);
      setUploadResult(result);
      setCurrentStep("analyze");

      toast({
        title: "Upload successful!",
        description: `Found ${result.total_bookmarks} bookmarks from ${result.browser_detected}`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeBookmarks = async () => {
    if (!uploadResult) return;

    setIsLoading(true);
    try {
      const result = await agentsApi.analyzeBookmarks({
        session_id: uploadResult.session_id,
        max_categories: 5,
        min_bookmarks_per_category: 3,
        merge_similar_categories: true,
      });

      setAnalysisResult(result);
      setSelectedCategories(result.categories.map((cat) => cat.name));
      setCurrentStep("preview");

      toast({
        title: "Analysis complete!",
        description: `Created ${result.categories.length} smart categories`,
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createCollections = async () => {
    if (!analysisResult || selectedCategories.length === 0) return;

    setIsLoading(true);
    try {
      const result = await agentsApi.createBookmarkCollections({
        session_id: analysisResult.session_id,
        selected_categories: selectedCategories,
        custom_category_names: customNames,
      });

      setCurrentStep("complete");

      toast({
        title: "Collections created!",
        description: `Successfully created ${result.total_collections_created} collections with ${result.total_links_imported} links`,
      });
    } catch (error) {
      toast({
        title: "Creation failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryToggle = (categoryName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((name) => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  const updateCustomName = (categoryName: string, customName: string) => {
    setCustomNames((prev) => ({
      ...prev,
      [categoryName]: customName,
    }));
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) resetDialog();
      }}
    >
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Bookmark Importer
          </DialogTitle>
          <DialogDescription>
            Import your browser bookmarks and organize them into smart
            collections
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-4">
            {["upload", "analyze", "preview", "create", "complete"].map(
              (step, index) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                      currentStep === step
                        ? "bg-primary text-primary-foreground"
                        : index <
                            [
                              "upload",
                              "analyze",
                              "preview",
                              "create",
                              "complete",
                            ].indexOf(currentStep)
                          ? "bg-green-500 text-white"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {index <
                    [
                      "upload",
                      "analyze",
                      "preview",
                      "create",
                      "complete",
                    ].indexOf(currentStep) ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < 4 && (
                    <div
                      className={`h-0.5 w-16 ${
                        index <
                        [
                          "upload",
                          "analyze",
                          "preview",
                          "create",
                          "complete",
                        ].indexOf(currentStep)
                          ? "bg-green-500"
                          : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              )
            )}
          </div>

          {/* Step Content */}
          {currentStep === "upload" && (
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
                      <strong>Chrome:</strong> Settings → Bookmarks → Bookmark
                      Manager → Export
                    </li>
                    <li>
                      <strong>Firefox:</strong> Library → Bookmarks → Export
                      Bookmarks to HTML
                    </li>
                    <li>
                      <strong>Safari:</strong> File → Export Bookmarks
                    </li>
                    <li>
                      <strong>Edge:</strong> Settings → Profiles → Export
                      bookmarks
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
          )}

          {currentStep === "analyze" && uploadResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Analyze Bookmarks
                </CardTitle>
                <CardDescription>
                  Using AI to categorize your {uploadResult.total_bookmarks}{" "}
                  bookmarks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded">
                    <div className="text-lg font-semibold">
                      {uploadResult.total_bookmarks}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Bookmarks
                    </div>
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
                      {Object.entries(uploadResult.folder_structure).map(
                        ([folder, count]) => (
                          <div
                            key={folder}
                            className="flex justify-between text-sm"
                          >
                            <span>{folder}</span>
                            <Badge variant="secondary">{count}</Badge>
                          </div>
                        )
                      )}
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
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Start AI Analysis
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {currentStep === "preview" && analysisResult && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Preview Categories
                  </CardTitle>
                  <CardDescription>
                    Review and customize your smart collections before creating
                    them
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="p-3 bg-muted/50 rounded">
                      <div className="text-lg font-semibold">
                        {analysisResult.categories.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Categories
                      </div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded">
                      <div className="text-lg font-semibold">
                        {analysisResult.categories.reduce(
                          (sum, cat) => sum + cat.bookmarks.length,
                          0
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Categorized
                      </div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded">
                      <div className="text-lg font-semibold">
                        {(analysisResult.ai_confidence_score * 100).toFixed(0)}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        AI Confidence
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                {analysisResult.categories.map((category) => (
                  <Card
                    key={category.name}
                    className="border-l-4 border-l-primary/20"
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={selectedCategories.includes(category.name)}
                            onCheckedChange={() =>
                              handleCategoryToggle(category.name)
                            }
                          />
                          <div>
                            <h4 className="font-medium">{category.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {category.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            {category.bookmarks.length} links
                          </Badge>
                          <Badge variant="outline">
                            {(category.confidence_score * 100).toFixed(0)}%
                            confidence
                          </Badge>
                        </div>
                      </div>

                      {selectedCategories.includes(category.name) && (
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor={`custom-name-${category.name}`}>
                              Custom Collection Name
                            </Label>
                            <Input
                              id={`custom-name-${category.name}`}
                              placeholder={category.suggested_collection_name}
                              value={customNames[category.name] || ""}
                              onChange={(e) =>
                                updateCustomName(category.name, e.target.value)
                              }
                            />
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {category.keywords.map((keyword) => (
                              <Badge
                                key={keyword}
                                variant="outline"
                                className="text-xs"
                              >
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep("analyze")}
                >
                  Back to Analysis
                </Button>
                <Button
                  onClick={createCollections}
                  disabled={selectedCategories.length === 0 || isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Collections...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create {selectedCategories.length} Collections
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {currentStep === "complete" && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Collections Created Successfully!
                    </h3>
                    <p className="text-muted-foreground">
                      Your bookmarks have been imported and organized into{" "}
                      {selectedCategories.length} smart collections.
                    </p>
                  </div>
                  <Button onClick={() => onOpenChange(false)}>
                    <FolderOpen className="h-4 w-4 mr-2" />
                    View Collections
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
