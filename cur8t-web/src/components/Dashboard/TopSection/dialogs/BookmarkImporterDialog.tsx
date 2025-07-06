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
  Edit2,
  Trash2,
  GripVertical,
  ExternalLink,
  Save,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  agentsApi,
  type BookmarkUploadResponse,
  type BookmarkAnalysisResponse,
  type BookmarkCategory,
} from "@/lib/api/agents";
import { createCollectionAction } from "@/actions/collection/createCollection";
import { createLinkAction } from "@/actions/linkActions/createLink";

interface BookmarkImporterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Use the types from the API service
type UploadResult = BookmarkUploadResponse;
type AnalysisResult = BookmarkAnalysisResponse;

type Step = "upload" | "analyze" | "preview" | "create" | "complete";

interface BookmarkLink {
  url: string;
  title: string;
  description?: string;
  favicon?: string;
  added_date?: string;
  folder_path?: string[];
}

interface EnhancedCategory extends Omit<BookmarkCategory, "bookmarks"> {
  bookmarks: BookmarkLink[];
}

interface CreatedCollection {
  id: string;
  title: string;
  linksCount: number;
}

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
  const [enhancedCategories, setEnhancedCategories] = useState<
    EnhancedCategory[]
  >([]);
  const [editingLink, setEditingLink] = useState<{
    categoryIndex: number;
    linkIndex: number;
  } | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedUrl, setEditedUrl] = useState("");
  const [createdCollections, setCreatedCollections] = useState<
    CreatedCollection[]
  >([]);
  const { toast } = useToast();
  const router = useRouter();

  const resetDialog = useCallback(() => {
    setCurrentStep("upload");
    setIsLoading(false);
    setSelectedFile(null);
    setUploadResult(null);
    setAnalysisResult(null);
    setSelectedCategories([]);
    setCustomNames({});
    setEnhancedCategories([]);
    setEditingLink(null);
    setEditedTitle("");
    setEditedUrl("");
    setCreatedCollections([]);
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

      // Convert to enhanced categories for better manipulation
      const enhanced: EnhancedCategory[] = result.categories.map(
        (category) => ({
          ...category,
          bookmarks: category.bookmarks.map((bookmark) => ({
            url: bookmark.url,
            title: bookmark.title,
            description: bookmark.description,
            favicon: bookmark.favicon,
            added_date: bookmark.added_date,
            folder_path: bookmark.folder_path,
          })),
        })
      );
      setEnhancedCategories(enhanced);

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

  // Helper functions for link manipulation
  const startEditingLink = (categoryIndex: number, linkIndex: number) => {
    const link = enhancedCategories[categoryIndex].bookmarks[linkIndex];
    setEditingLink({ categoryIndex, linkIndex });
    setEditedTitle(link.title);
    setEditedUrl(link.url);
  };

  const saveEditedLink = () => {
    if (!editingLink) return;

    const updatedCategories = [...enhancedCategories];
    updatedCategories[editingLink.categoryIndex].bookmarks[
      editingLink.linkIndex
    ] = {
      ...updatedCategories[editingLink.categoryIndex].bookmarks[
        editingLink.linkIndex
      ],
      title: editedTitle,
      url: editedUrl,
    };

    setEnhancedCategories(updatedCategories);
    setEditingLink(null);
    setEditedTitle("");
    setEditedUrl("");
  };

  const cancelEditingLink = () => {
    setEditingLink(null);
    setEditedTitle("");
    setEditedUrl("");
  };

  const deleteLink = (categoryIndex: number, linkIndex: number) => {
    const updatedCategories = [...enhancedCategories];
    updatedCategories[categoryIndex].bookmarks.splice(linkIndex, 1);
    setEnhancedCategories(updatedCategories);
  };

  const reorderLinksInCategory = (
    categoryIndex: number,
    newBookmarks: BookmarkLink[]
  ) => {
    const updatedCategories = [...enhancedCategories];
    updatedCategories[categoryIndex].bookmarks = newBookmarks;
    setEnhancedCategories(updatedCategories);
  };

  const moveLink = (
    fromCategoryIndex: number,
    fromLinkIndex: number,
    toCategoryIndex: number
  ) => {
    const updatedCategories = [...enhancedCategories];
    const [movedLink] = updatedCategories[fromCategoryIndex].bookmarks.splice(
      fromLinkIndex,
      1
    );
    updatedCategories[toCategoryIndex].bookmarks.push(movedLink);
    setEnhancedCategories(updatedCategories);
  };

  const createCollections = async () => {
    if (!enhancedCategories || selectedCategories.length === 0) return;

    setIsLoading(true);
    const createdCollectionsData: CreatedCollection[] = [];

    try {
      // Create collections and add links for selected categories
      for (const category of enhancedCategories) {
        if (!selectedCategories.includes(category.name)) continue;

        const collectionName =
          customNames[category.name] ||
          category.suggested_collection_name ||
          category.name;

        // Create the collection
        const collectionResult = await createCollectionAction(
          collectionName,
          category.description,
          "private"
        );

        if (collectionResult.error) {
          throw new Error(
            `Failed to create collection "${collectionName}": ${collectionResult.error}`
          );
        }

        const collection = collectionResult.data!;
        let successfulLinks = 0;

        // Add all links to the collection
        for (const bookmark of category.bookmarks) {
          try {
            const linkResult = await createLinkAction(
              collection.id,
              bookmark.title,
              bookmark.url
            );

            if (linkResult.success) {
              successfulLinks++;
            }
          } catch (linkError) {
            console.warn(
              `Failed to add link "${bookmark.title}" to collection "${collectionName}":`,
              linkError
            );
          }
        }

        createdCollectionsData.push({
          id: collection.id,
          title: collectionName,
          linksCount: successfulLinks,
        });
      }

      setCreatedCollections(createdCollectionsData);
      setCurrentStep("complete");

      toast({
        title: "Collections created!",
        description: `Successfully created ${createdCollectionsData.length} collections with ${createdCollectionsData.reduce((sum, col) => sum + col.linksCount, 0)} links`,
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

          {currentStep === "preview" && enhancedCategories.length > 0 && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Interactive Preview & Editor
                  </CardTitle>
                  <CardDescription>
                    Review, edit, and organize your bookmarks. Drag links
                    between categories, edit titles/URLs, or delete unwanted
                    links.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="p-3 bg-muted/50 rounded">
                      <div className="text-lg font-semibold">
                        {enhancedCategories.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Categories
                      </div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded">
                      <div className="text-lg font-semibold">
                        {enhancedCategories.reduce(
                          (sum, cat) => sum + cat.bookmarks.length,
                          0
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Links
                      </div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded">
                      <div className="text-lg font-semibold">
                        {selectedCategories.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Selected
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {enhancedCategories.map((category, categoryIndex) => (
                  <motion.div
                    key={category.name}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      className={`border-l-4 ${
                        selectedCategories.includes(category.name)
                          ? "border-l-primary bg-primary/5"
                          : "border-l-muted"
                      }`}
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={selectedCategories.includes(
                                category.name
                              )}
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
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-4"
                          >
                            <div>
                              <Label htmlFor={`custom-name-${category.name}`}>
                                Custom Collection Name
                              </Label>
                              <Input
                                id={`custom-name-${category.name}`}
                                placeholder={category.suggested_collection_name}
                                value={customNames[category.name] || ""}
                                onChange={(e) =>
                                  updateCustomName(
                                    category.name,
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            <div className="flex flex-wrap gap-1 mb-3">
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

                            <div className="border rounded-lg p-4 bg-muted/20">
                              <h5 className="font-medium mb-3 flex items-center gap-2">
                                <GripVertical className="h-4 w-4" />
                                Links ({category.bookmarks.length})
                              </h5>

                              <Reorder.Group
                                axis="y"
                                values={category.bookmarks}
                                onReorder={(newBookmarks) =>
                                  reorderLinksInCategory(
                                    categoryIndex,
                                    newBookmarks
                                  )
                                }
                                className="space-y-2"
                              >
                                <AnimatePresence>
                                  {category.bookmarks.map(
                                    (bookmark, linkIndex) => (
                                      <Reorder.Item
                                        key={bookmark.url}
                                        value={bookmark}
                                        className="group"
                                      >
                                        <motion.div
                                          layout
                                          initial={{ opacity: 0, scale: 0.8 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          exit={{ opacity: 0, scale: 0.8 }}
                                          className="p-3 bg-background border rounded-lg cursor-move hover:shadow-sm transition-all"
                                        >
                                          {editingLink?.categoryIndex ===
                                            categoryIndex &&
                                          editingLink?.linkIndex ===
                                            linkIndex ? (
                                            <div className="space-y-2">
                                              <div>
                                                <Label>Title</Label>
                                                <Input
                                                  value={editedTitle}
                                                  onChange={(e) =>
                                                    setEditedTitle(
                                                      e.target.value
                                                    )
                                                  }
                                                  placeholder="Link title"
                                                />
                                              </div>
                                              <div>
                                                <Label>URL</Label>
                                                <Input
                                                  value={editedUrl}
                                                  onChange={(e) =>
                                                    setEditedUrl(e.target.value)
                                                  }
                                                  placeholder="Link URL"
                                                />
                                              </div>
                                              <div className="flex gap-2">
                                                <Button
                                                  size="sm"
                                                  onClick={saveEditedLink}
                                                  className="flex-1"
                                                >
                                                  <Save className="h-3 w-3 mr-1" />
                                                  Save
                                                </Button>
                                                <Button
                                                  size="sm"
                                                  variant="outline"
                                                  onClick={cancelEditingLink}
                                                >
                                                  <X className="h-3 w-3 mr-1" />
                                                  Cancel
                                                </Button>
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <div className="flex-1 min-w-0">
                                                  <div className="font-medium truncate">
                                                    {bookmark.title}
                                                  </div>
                                                  <div className="text-xs text-muted-foreground truncate">
                                                    {bookmark.url}
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                  size="sm"
                                                  variant="ghost"
                                                  onClick={() =>
                                                    window.open(
                                                      bookmark.url,
                                                      "_blank"
                                                    )
                                                  }
                                                  title="Open link"
                                                >
                                                  <ExternalLink className="h-3 w-3" />
                                                </Button>
                                                <Button
                                                  size="sm"
                                                  variant="ghost"
                                                  onClick={() =>
                                                    startEditingLink(
                                                      categoryIndex,
                                                      linkIndex
                                                    )
                                                  }
                                                  title="Edit link"
                                                >
                                                  <Edit2 className="h-3 w-3" />
                                                </Button>
                                                <Button
                                                  size="sm"
                                                  variant="ghost"
                                                  onClick={() =>
                                                    deleteLink(
                                                      categoryIndex,
                                                      linkIndex
                                                    )
                                                  }
                                                  title="Delete link"
                                                  className="text-destructive hover:text-destructive"
                                                >
                                                  <Trash2 className="h-3 w-3" />
                                                </Button>
                                              </div>
                                            </div>
                                          )}
                                        </motion.div>
                                      </Reorder.Item>
                                    )
                                  )}
                                </AnimatePresence>
                              </Reorder.Group>

                              {category.bookmarks.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                  <p>No links in this category</p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
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
            <div className="space-y-4">
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
                        {createdCollections.length} smart collections.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {createdCollections.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FolderOpen className="h-4 w-4" />
                      Created Collections
                    </CardTitle>
                    <CardDescription>
                      Click on any collection to view and manage its links
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {createdCollections.map((collection) => (
                        <motion.div
                          key={collection.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Card
                            className="cursor-pointer hover:shadow-md transition-all border-l-4 border-l-green-500 bg-green-50/50 hover:bg-green-50"
                            onClick={() => {
                              router.push(`/collection/${collection.id}`);
                              onOpenChange(false);
                            }}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <FolderOpen className="h-5 w-5 text-green-600" />
                                  <div>
                                    <h4 className="font-medium">
                                      {collection.title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                      {collection.linksCount} links imported
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="secondary"
                                    className="bg-green-100 text-green-700"
                                  >
                                    {collection.linksCount} links
                                  </Badge>
                                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="flex-1"
                >
                  <FolderOpen className="h-4 w-4 mr-2" />
                  View Dashboard
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
