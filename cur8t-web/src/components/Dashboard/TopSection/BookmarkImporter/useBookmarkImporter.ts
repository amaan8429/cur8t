import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  agentsApi,
  type BookmarkUploadResponse,
  type BookmarkAnalysisResponse,
} from "@/lib/api/agents";
import { createCollectionAction } from "@/actions/collection/createCollection";
import { createLinkAction } from "@/actions/linkActions/createLink";
import {
  Step,
  BookmarkLink,
  EnhancedCategory,
  CreatedCollection,
} from "./types";

export function useBookmarkImporter() {
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] =
    useState<BookmarkUploadResponse | null>(null);
  const [analysisResult, setAnalysisResult] =
    useState<BookmarkAnalysisResponse | null>(null);
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

  // Link manipulation helpers
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
      for (const category of enhancedCategories) {
        if (!selectedCategories.includes(category.name)) continue;
        const collectionName =
          customNames[category.name] ||
          category.suggested_collection_name ||
          category.name;
        const collectionResult = await createCollectionAction(
          collectionName,
          category.description || "",
          "private"
        );
        if (collectionResult.error) {
          throw new Error(
            `Failed to create collection "${collectionName}": ${collectionResult.error}`
          );
        }
        const collection = collectionResult.data!;
        let successfulLinks = 0;
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

  return {
    currentStep,
    setCurrentStep,
    isLoading,
    setIsLoading,
    selectedFile,
    setSelectedFile,
    uploadResult,
    setUploadResult,
    analysisResult,
    setAnalysisResult,
    selectedCategories,
    setSelectedCategories,
    customNames,
    setCustomNames,
    enhancedCategories,
    setEnhancedCategories,
    editingLink,
    setEditingLink,
    editedTitle,
    setEditedTitle,
    editedUrl,
    setEditedUrl,
    createdCollections,
    setCreatedCollections,
    resetDialog,
    handleFileSelect,
    uploadBookmarks,
    analyzeBookmarks,
    startEditingLink,
    saveEditedLink,
    cancelEditingLink,
    deleteLink,
    reorderLinksInCategory,
    moveLink,
    createCollections,
    handleCategoryToggle,
    updateCustomName,
  };
}
