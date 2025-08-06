import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  PiPlus,
  PiX,
  PiPencilSimple,
  PiTrash,
  PiFileText,
  PiFolderOpen,
  PiSpinner,
  PiArrowSquareOut,
  PiCaretRight,
  PiFlipVertical,
  PiBookmark,
} from 'react-icons/pi';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { useBookmarkImporter } from './useBookmarkImporter';

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

  const [selectedCategoryForDetail, setSelectedCategoryForDetail] = useState<
    string | null
  >(enhancedCategories.length > 0 ? enhancedCategories[0].name : null);

  if (!enhancedCategories.length) return null;

  const selectedCategory = enhancedCategories.find(
    (cat) => cat.name === selectedCategoryForDetail
  );
  const selectedCategoryIndex = enhancedCategories.findIndex(
    (cat) => cat.name === selectedCategoryForDetail
  );

  return (
    <div className="space-y-4">
      {/* Main Content - Split View */}
      <div className="grid grid-cols-5 gap-6 min-h-[600px]">
        {/* Left Panel - Categories Master List */}
        <div className="col-span-2 space-y-4">
          {/* Stats Summary */}
          <Card>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                  <span className="text-sm text-muted-foreground">
                    Categories
                  </span>
                  <span className="font-semibold">
                    {enhancedCategories.length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                  <span className="text-sm text-muted-foreground">
                    Total Links
                  </span>
                  <span className="font-semibold">
                    {enhancedCategories.reduce(
                      (sum, cat) => sum + cat.bookmarks.length,
                      0
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                  <span className="text-sm text-muted-foreground">
                    Selected
                  </span>
                  <span className="font-semibold">
                    {selectedCategories.length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categories List */}
          <Card className="flex-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <CardDescription className="text-xs">
                Select categories to create collections
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {enhancedCategories.map((category) => (
                  <div
                    key={category.name}
                    className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                      selectedCategoryForDetail === category.name
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border hover:border-border/60 hover:bg-muted/30'
                    }`}
                    onClick={() => setSelectedCategoryForDetail(category.name)}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedCategories.includes(category.name)}
                        onCheckedChange={() =>
                          handleCategoryToggle(category.name)
                        }
                        onClick={(e) => e.stopPropagation()}
                        className="mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm truncate">
                            {category.name}
                          </h4>
                          <PiCaretRight
                            className={`h-4 w-4 text-muted-foreground transition-transform ${
                              selectedCategoryForDetail === category.name
                                ? 'rotate-90'
                                : ''
                            }`}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {category.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {category.bookmarks.length} links
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {(category.confidence_score * 100).toFixed(0)}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Category Detail View */}
        <div className="col-span-3">
          {selectedCategory ? (
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PiFolderOpen className="h-4 w-4" />
                  {selectedCategory.name}
                </CardTitle>
                <CardDescription>
                  {selectedCategory.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Custom Collection Name */}
                <div>
                  <Label htmlFor={`custom-name-${selectedCategory.name}`}>
                    Custom Collection Name
                  </Label>
                  <Input
                    id={`custom-name-${selectedCategory.name}`}
                    placeholder={selectedCategory.suggested_collection_name}
                    value={customNames[selectedCategory.name] || ''}
                    onChange={(e) =>
                      updateCustomName(selectedCategory.name, e.target.value)
                    }
                    className="mt-1"
                  />
                </div>

                {/* Keywords */}
                <div>
                  <Label className="text-sm font-medium">Keywords</Label>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedCategory.keywords.map((keyword) => (
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

                {/* Bookmarks Section */}
                <div className="border-2 border-dashed border-muted-foreground/20 rounded-xl p-4 bg-muted/10">
                  <h5 className="font-semibold mb-4 flex items-center gap-2">
                    <PiFlipVertical className="h-4 w-4 text-muted-foreground" />
                    Links ({selectedCategory.bookmarks.length})
                  </h5>

                  <div className="max-h-[300px] overflow-y-auto">
                    {selectedCategory.bookmarks.length > 0 ? (
                      <Reorder.Group
                        axis="y"
                        values={selectedCategory.bookmarks}
                        onReorder={(newBookmarks) =>
                          reorderLinksInCategory(
                            selectedCategoryIndex,
                            newBookmarks
                          )
                        }
                        className="space-y-2"
                      >
                        <AnimatePresence>
                          {selectedCategory.bookmarks.map(
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
                                  className="p-3 bg-card border border-border rounded-lg cursor-move hover:shadow-sm hover:border-primary/30 transition-all duration-200"
                                >
                                  {editingLink?.categoryIndex ===
                                    selectedCategoryIndex &&
                                  editingLink?.linkIndex === linkIndex ? (
                                    <div className="space-y-3">
                                      <div>
                                        <Label className="text-sm font-semibold">
                                          Title
                                        </Label>
                                        <Input
                                          value={editedTitle}
                                          onChange={(e) =>
                                            setEditedTitle(e.target.value)
                                          }
                                          placeholder="Enter link title"
                                          className="mt-1"
                                        />
                                      </div>
                                      <div>
                                        <Label className="text-sm font-semibold">
                                          URL
                                        </Label>
                                        <Input
                                          value={editedUrl}
                                          onChange={(e) =>
                                            setEditedUrl(e.target.value)
                                          }
                                          placeholder="Enter link URL"
                                          className="mt-1 font-mono text-sm"
                                        />
                                      </div>
                                      <div className="flex gap-2">
                                        <Button
                                          size="sm"
                                          onClick={saveEditedLink}
                                          className="flex-1"
                                        >
                                          <PiBookmark className="h-4 w-4 mr-2" />
                                          Save
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={cancelEditingLink}
                                        >
                                          <PiX className="h-4 w-4 mr-2" />
                                          Cancel
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <PiFlipVertical className="h-4 w-4 text-muted-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="flex-1 min-w-0">
                                          <div className="font-medium text-sm truncate">
                                            {bookmark.title}
                                          </div>
                                          <div className="text-xs text-muted-foreground truncate mt-1 font-mono">
                                            {bookmark.url}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() =>
                                            window.open(bookmark.url, '_blank')
                                          }
                                          title="Open link"
                                          className="h-8 w-8 p-0"
                                        >
                                          <PiArrowSquareOut className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() =>
                                            startEditingLink(
                                              selectedCategoryIndex,
                                              linkIndex
                                            )
                                          }
                                          title="Edit link"
                                          className="h-8 w-8 p-0"
                                        >
                                          <PiPencilSimple className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() =>
                                            deleteLink(
                                              selectedCategoryIndex,
                                              linkIndex
                                            )
                                          }
                                          title="Delete link"
                                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                        >
                                          <PiTrash className="h-4 w-4" />
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
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <PiFileText className="h-8 w-8 mx-auto mb-2 opacity-30" />
                        <p className="text-sm font-medium">
                          No links in this category
                        </p>
                        <p className="text-xs mt-1 opacity-70">
                          All links have been removed or moved
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent>
                <div className="text-center text-muted-foreground">
                  <PiFolderOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">
                    Select a category to view details
                  </p>
                  <p className="text-sm mt-1 opacity-70">
                    Choose a category from the left to preview and edit its
                    bookmarks
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setCurrentStep('analyze')}>
          Back to Analysis
        </Button>
        <Button
          onClick={createCollections}
          disabled={selectedCategories.length === 0 || isLoading}
          className="flex-1"
        >
          {isLoading ? (
            <>
              <PiSpinner className="h-5 w-5 mr-2 animate-spin" />
              Creating Collections...
            </>
          ) : (
            <>
              <PiPlus className="h-5 w-5 mr-2" />
              Create {selectedCategories.length} Collection
              {selectedCategories.length !== 1 ? 's' : ''}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
