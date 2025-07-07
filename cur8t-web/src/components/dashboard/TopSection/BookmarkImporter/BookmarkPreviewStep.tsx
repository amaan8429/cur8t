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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Loader2,
  Eye,
  Plus,
  Save,
  X,
  Edit2,
  Trash2,
  ExternalLink,
  GripVertical,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { useBookmarkImporter } from "./useBookmarkImporter";

interface Props {
  importer: ReturnType<typeof useBookmarkImporter>;
}

export function BookmarkPreviewStep({ importer }: Props) {
  const {
    enhancedCategories,
    selectedCategories,
    customNames,
    updateCustomName,
    handleCategoryToggle,
    reorderLinksInCategory,
    startEditingLink,
    editingLink,
    editedTitle,
    setEditedTitle,
    editedUrl,
    setEditedUrl,
    saveEditedLink,
    cancelEditingLink,
    deleteLink,
    isLoading,
    createCollections,
    setCurrentStep,
  } = importer;

  if (!enhancedCategories.length) return null;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Interactive Preview & Editor
          </CardTitle>
          <CardDescription>
            Review, edit, and organize your bookmarks. Drag links between
            categories, edit titles/URLs, or delete unwanted links.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="p-3 bg-muted/50 rounded">
              <div className="text-lg font-semibold">
                {enhancedCategories.length}
              </div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="p-3 bg-muted/50 rounded">
              <div className="text-lg font-semibold">
                {enhancedCategories.reduce(
                  (sum, cat) => sum + cat.bookmarks.length,
                  0
                )}
              </div>
              <div className="text-sm text-muted-foreground">Total Links</div>
            </div>
            <div className="p-3 bg-muted/50 rounded">
              <div className="text-lg font-semibold">
                {selectedCategories.length}
              </div>
              <div className="text-sm text-muted-foreground">Selected</div>
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
              className={`border-l-4 transition-all duration-200 ${selectedCategories.includes(category.name) ? "border-l-primary bg-primary/5 shadow-md hover:shadow-lg" : "border-l-muted-foreground/30 hover:border-l-primary/50 hover:bg-muted/30"}`}
            >
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-4">
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
                      {(category.confidence_score * 100).toFixed(0)}% confidence
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
                          updateCustomName(category.name, e.target.value)
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
                    <div className="border-2 border-dashed border-muted-foreground/20 rounded-xl p-4 bg-muted/10 hover:bg-muted/20 transition-colors duration-200">
                      <h5 className="font-semibold mb-4 flex items-center gap-2 text-foreground">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        Links ({category.bookmarks.length})
                      </h5>
                      <Reorder.Group
                        axis="y"
                        values={category.bookmarks}
                        onReorder={(newBookmarks) =>
                          reorderLinksInCategory(categoryIndex, newBookmarks)
                        }
                        className="space-y-2"
                      >
                        <AnimatePresence>
                          {category.bookmarks.map((bookmark, linkIndex) => (
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
                                className="p-4 bg-card border border-border rounded-xl cursor-move hover:shadow-md hover:border-primary/30 transition-all duration-200 group-hover:bg-accent/50"
                              >
                                {editingLink?.categoryIndex === categoryIndex &&
                                editingLink?.linkIndex === linkIndex ? (
                                  <div className="space-y-3">
                                    <div>
                                      <Label className="text-sm font-semibold text-foreground">
                                        Title
                                      </Label>
                                      <Input
                                        value={editedTitle}
                                        onChange={(e) =>
                                          setEditedTitle(e.target.value)
                                        }
                                        placeholder="Enter link title"
                                        className="mt-1 border-primary/20 focus:border-primary/50 bg-background"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-sm font-semibold text-foreground">
                                        URL
                                      </Label>
                                      <Input
                                        value={editedUrl}
                                        onChange={(e) =>
                                          setEditedUrl(e.target.value)
                                        }
                                        placeholder="Enter link URL"
                                        className="mt-1 border-primary/20 focus:border-primary/50 bg-background font-mono text-sm"
                                      />
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        onClick={saveEditedLink}
                                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                                      >
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Changes
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={cancelEditingLink}
                                        className="border-muted-foreground/30 hover:bg-muted/50"
                                      >
                                        <X className="h-4 w-4 mr-2" />
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                      <GripVertical className="h-5 w-5 text-muted-foreground/60 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                                      <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-foreground truncate text-sm">
                                          {bookmark.title}
                                        </div>
                                        <div className="text-xs text-muted-foreground/80 truncate mt-1 font-mono">
                                          {bookmark.url}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() =>
                                          window.open(bookmark.url, "_blank")
                                        }
                                        title="Open link"
                                        className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                                      >
                                        <ExternalLink className="h-4 w-4" />
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
                                        className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:text-blue-400"
                                      >
                                        <Edit2 className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() =>
                                          deleteLink(categoryIndex, linkIndex)
                                        }
                                        title="Delete link"
                                        className="h-8 w-8 p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </motion.div>
                            </Reorder.Item>
                          ))}
                        </AnimatePresence>
                      </Reorder.Group>
                      {category.bookmarks.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                          <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                          <p className="text-sm font-medium">
                            No links in this category
                          </p>
                          <p className="text-xs mt-1 opacity-70">
                            All links have been removed or moved
                          </p>
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
          className="border-muted-foreground/30 hover:bg-muted/50"
        >
          Back to Analysis
        </Button>
        <Button
          onClick={createCollections}
          disabled={selectedCategories.length === 0 || isLoading}
          className="flex-1 h-11 bg-primary hover:bg-primary/90 text-primary-foreground disabled:bg-muted disabled:text-muted-foreground"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Creating Collections...
            </>
          ) : (
            <>
              <Plus className="h-5 w-5 mr-2" />
              Create {selectedCategories.length} Collection
              {selectedCategories.length !== 1 ? "s" : ""}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
