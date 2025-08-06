'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  PiFileText,
  PiPlus,
  PiCheck,
  PiX,
  PiGlobe,
  PiCalendar,
  PiPencilSimple,
  PiArrowSquareOut,
  PiTrash,
  PiSpinner,
} from 'react-icons/pi';
import { toast, useToast } from '@/hooks/use-toast';
import {
  agentsApi,
  AgentsApiError,
  type ExtractedLink,
  type ArticleExtractionResponse,
} from '@/lib/api/agents';
import { saveExtractedCollectionAction } from '@/actions/collection/saveExtractedCollection';

interface ArticleExtractorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ArticleExtractorDialog({
  open,
  onOpenChange,
}: ArticleExtractorDialogProps) {
  const [step, setStep] = useState<'input' | 'results'>('input');
  const [loading, setLoading] = useState(false);
  const [articleUrl, setArticleUrl] = useState('');
  const [collectionName, setCollectionName] = useState('');
  const [isEditingCollectionName, setIsEditingCollectionName] = useState(false);
  const [tempCollectionName, setTempCollectionName] = useState('');

  // Results state
  const [extractedData, setExtractedData] =
    useState<ArticleExtractionResponse | null>(null);

  // New link form state
  const [showAddLinkForm, setShowAddLinkForm] = useState(false);
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [savingCollection, setSavingCollection] = useState(false);

  const {
    toast: useToastToast,
    success: toastSuccess,
    error: toastError,
    warning: toastWarning,
    info: toastInfo,
  } = useToast();

  const resetDialog = () => {
    setStep('input');
    setArticleUrl('');
    setCollectionName('');
    setExtractedData(null);
    setShowAddLinkForm(false);
    setNewLinkUrl('');
    setNewLinkTitle('');
    setIsEditingCollectionName(false);
    setTempCollectionName('');
    setSavingCollection(false);
  };

  const handleExtractLinks = async () => {
    if (!articleUrl.trim()) {
      toastWarning({
        title: 'Missing URL',
        description: 'Please enter an article URL to extract links from.',
      });
      return;
    }

    setLoading(true);

    try {
      const data = await agentsApi.extractArticleLinks({
        article_url: articleUrl,
        collection_name: collectionName || undefined,
      });

      setExtractedData(data);
      setStep('results');
      toastSuccess({
        title: 'Links extracted successfully!',
        description: `Found ${data.total_links_found} links from the article.`,
      });
    } catch (error) {
      console.error('Error extracting links:', error);

      if (error instanceof AgentsApiError) {
        toastError({
          title: 'Extraction failed',
          description: error.details || error.message,
        });
      } else {
        toastError({
          title: 'Unexpected error',
          description: 'An unexpected error occurred. Please try again.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLink = (urlToDelete: string) => {
    if (!extractedData) return;

    const updatedLinks = extractedData.extracted_links.filter(
      (link) => link.url !== urlToDelete
    );
    setExtractedData({
      ...extractedData,
      extracted_links: updatedLinks,
      total_links_found: updatedLinks.length,
    });

    toastInfo({
      title: 'Link removed',
      description: 'The link has been removed from your collection.',
    });
  };

  const handleAddNewLink = () => {
    if (!newLinkUrl.trim()) {
      toastWarning({
        title: 'Missing URL',
        description: 'Please enter a URL for the new link.',
      });
      return;
    }

    if (!extractedData) return;

    // Check for duplicates
    const isDuplicate = extractedData.extracted_links.some(
      (link) => link.url === newLinkUrl
    );
    if (isDuplicate) {
      toastWarning({
        title: 'Duplicate link',
        description: 'This link is already in your collection.',
      });
      return;
    }

    try {
      const domain = new URL(newLinkUrl).hostname;

      const newLink: ExtractedLink = {
        url: newLinkUrl,
        title: newLinkTitle || 'Manually added link',
        description: newLinkTitle || undefined,
        domain: domain,
      };

      const updatedLinks = [...extractedData.extracted_links, newLink];
      setExtractedData({
        ...extractedData,
        extracted_links: updatedLinks,
        total_links_found: updatedLinks.length,
      });

      setNewLinkUrl('');
      setNewLinkTitle('');
      setShowAddLinkForm(false);

      toastInfo({
        title: 'Link added',
        description: 'The new link has been added to your collection.',
      });
    } catch (error) {
      toastError({
        title: 'Invalid URL',
        description: 'Please enter a valid URL.',
      });
    }
  };

  const handleCollectionNameEdit = () => {
    setTempCollectionName(extractedData?.collection_name || '');
    setIsEditingCollectionName(true);
  };

  const handleCollectionNameSave = () => {
    if (!extractedData || !tempCollectionName.trim()) return;

    setExtractedData({
      ...extractedData,
      collection_name: tempCollectionName.trim(),
    });
    setIsEditingCollectionName(false);

    toastInfo({
      title: 'Collection name updated',
      description: 'Your collection name has been changed.',
    });
  };

  const handleCollectionNameCancel = () => {
    setIsEditingCollectionName(false);
    setTempCollectionName('');
  };

  const handleSaveCollection = async () => {
    if (!extractedData) return;

    setSavingCollection(true);

    try {
      const result = await saveExtractedCollectionAction({
        collection_name: extractedData.collection_name,
        extracted_links: extractedData.extracted_links.map((link) => ({
          ...link,
          title: link.title || `Link from ${link.domain || 'unknown'}`,
          domain: link.domain || new URL(link.url).hostname,
        })),
        article_url: extractedData.article_url,
        article_title: extractedData.article_title,
      });

      // Check for rate limiting
      if (result.error && result.retryAfter) {
        const { showRateLimitToast } = await import(
          '@/components/ui/rate-limit-toast'
        );
        showRateLimitToast({
          retryAfter: result.retryAfter * 60,
          message: 'Too many save attempts. Please try again later.',
        });
        return;
      }

      if (result.error) {
        toastError({
          title: 'Save Failed',
          description: result.error,
        });
        return;
      }

      toastSuccess({
        title: 'Collection Saved!',
        description: `Saved "${result.data?.collection.title}" with ${result.data?.totalLinks} links.`,
      });

      resetDialog();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving collection:', error);
      toastError({
        title: 'Save Failed',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setSavingCollection(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        onOpenChange(newOpen);
        if (!newOpen) resetDialog();
      }}
    >
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col mx-4 sm:mx-6 lg:mx-8">
        <DialogHeader className="px-1 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <PiFileText className="h-5 w-5" />
            Article Link Extractor
          </DialogTitle>
          <DialogDescription>
            Extract all links from an article and create a collection
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto px-1">
          {step === 'input' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="article-url" className="text-sm font-medium">
                  Article URL
                </Label>
                <Input
                  id="article-url"
                  placeholder="https://example.com/article"
                  value={articleUrl}
                  onChange={(e) => setArticleUrl(e.target.value)}
                  className="w-full border-border/50 focus:border-border"
                />
                <p className="text-sm text-muted-foreground">
                  Enter the URL of the article you want to extract links from
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="collection-name"
                  className="text-sm font-medium"
                >
                  Collection Name (Optional)
                </Label>
                <Input
                  id="collection-name"
                  placeholder="My Article Links"
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                  className="w-full border-border/50 focus:border-border"
                />
                <p className="text-sm text-muted-foreground">
                  Leave empty to auto-generate based on article title
                </p>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg border border-border/30">
                <h4 className="font-medium mb-2 text-sm">
                  What this agent does:
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Fetches and analyzes the article content</li>
                  <li>• Extracts all valid links from the article</li>
                  <li>• Filters out social sharing and duplicate links</li>
                  <li>• Creates a organized collection ready for saving</li>
                </ul>
              </div>
            </div>
          )}

          {step === 'results' && extractedData && (
            <div className="space-y-6">
              {/* Article Info */}
              <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <h3 className="font-medium">
                      {extractedData.article_title || 'Article'}
                    </h3>
                    <a
                      href={extractedData.article_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-blue-600 flex items-center gap-1 transition-colors"
                    >
                      <PiGlobe className="h-3 w-3" />
                      {extractedData.article_url}
                    </a>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <PiCalendar className="h-3 w-3" />
                      Extracted{' '}
                      {new Date(extractedData.created_at).toLocaleString()}
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-background/50 border-0"
                  >
                    {extractedData.total_links_found} links
                  </Badge>
                </div>
              </div>

              {/* Collection Name */}
              <div className="space-y-2">
                <Label>Collection Name</Label>
                {isEditingCollectionName ? (
                  <div className="flex gap-2">
                    <Input
                      value={tempCollectionName}
                      onChange={(e) => setTempCollectionName(e.target.value)}
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCollectionNameSave();
                        if (e.key === 'Escape') handleCollectionNameCancel();
                      }}
                    />
                    <Button size="sm" onClick={handleCollectionNameSave}>
                      <PiCheck className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCollectionNameCancel}
                    >
                      <PiX className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Input
                      value={extractedData.collection_name}
                      readOnly
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCollectionNameEdit}
                    >
                      <PiPencilSimple className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Links List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Extracted Links</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowAddLinkForm(!showAddLinkForm)}
                  >
                    <PiPlus className="h-4 w-4 mr-2" />
                    Add Link
                  </Button>
                </div>

                {/* Add New Link Form */}
                {showAddLinkForm && (
                  <div className="p-4 rounded-lg border border-dashed border-border/50 bg-muted/20 space-y-3">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">URL</Label>
                      <Input
                        placeholder="https://example.com"
                        value={newLinkUrl}
                        onChange={(e) => setNewLinkUrl(e.target.value)}
                        className="border-border/50 focus:border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Title (Optional)
                      </Label>
                      <Input
                        placeholder="Link title"
                        value={newLinkTitle}
                        onChange={(e) => setNewLinkTitle(e.target.value)}
                        className="border-border/50 focus:border-border"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleAddNewLink}>
                        Add Link
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowAddLinkForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Links Grid */}
                <div className="space-y-2 max-h-96 overflow-auto pr-2">
                  {extractedData.extracted_links.map((link, index) => (
                    <div
                      key={index}
                      className="group p-3 rounded-lg border border-border/50 hover:border-border hover:bg-muted/20 transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-medium text-sm truncate">
                              {link.title &&
                              link.title !== link.domain &&
                              link.title.toLowerCase() !== 'untitled link' &&
                              !link.title.toLowerCase().includes('sitemap')
                                ? link.title
                                : `Link from ${link.domain}`}
                            </h5>
                            <Badge
                              variant="secondary"
                              className="text-xs px-2 py-0 h-5 bg-muted/50 border-0"
                            >
                              {link.domain}
                            </Badge>
                          </div>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-muted-foreground hover:text-blue-600 truncate block transition-colors"
                          >
                            {link.url}
                          </a>
                          {link.description &&
                            link.description !== link.title &&
                            link.description.toLowerCase() !==
                              'untitled link' &&
                            !link.description
                              .toLowerCase()
                              .includes('sitemap') && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {link.description}
                              </p>
                            )}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => window.open(link.url, '_blank')}
                            className="h-8 w-8 p-0"
                          >
                            <PiArrowSquareOut className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteLink(link.url)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600 hover:bg-red-50"
                          >
                            <PiTrash className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="px-1 pt-4">
          {step === 'input' && (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleExtractLinks} disabled={loading}>
                {loading && <PiSpinner className="mr-2 h-4 w-4 animate-spin" />}
                Extract Links
              </Button>
            </>
          )}

          {step === 'results' && (
            <>
              <Button variant="outline" onClick={() => setStep('input')}>
                Back
              </Button>
              <Button
                onClick={handleSaveCollection}
                disabled={savingCollection}
              >
                {savingCollection && (
                  <PiSpinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Collection
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
