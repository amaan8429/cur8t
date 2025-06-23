"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusIcon, X, Info } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { actionsData as data, ActionType } from "./actions-data";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useCollectionStore } from "@/store/collection-store";
import { useActiveState } from "@/store/activeStateStore";
import { useToast } from "@/hooks/use-toast";
import { createCollectionAction } from "@/actions/collection/createCollection";
import { getLinksAction } from "@/actions/linkActions/getLinks";
import { createLinkAction } from "@/actions/linkActions/createLink";
import { exportColletion } from "@/lib/export";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Interface for the ActionItem
export interface ActionItem {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  type: ActionType;
}

const ActionItems: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedAction, setSelectedAction] = React.useState<ActionItem | null>(
    null
  );
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);

  // Form states for different dialogs
  const [pageTitle, setPageTitle] = React.useState("");
  const [visibilityOption, setVisibilityOption] = React.useState("public");
  const [emails, setEmails] = React.useState<string[]>([]);
  const [newEmail, setNewEmail] = React.useState("");
  const [duplicateName, setDuplicateName] = React.useState("");
  const [includeContents, setIncludeContents] = React.useState(true);
  const [copyPermissions, setCopyPermissions] = React.useState(false);
  const [isDuplicating, setIsDuplicating] = React.useState(false);
  const [isExporting, setIsExporting] = React.useState(false);
  const [copyLink, setCopyLink] = React.useState(
    "https://example.com/your-page"
  );
  const [analyticsTab, setAnalyticsTab] = React.useState("views");
  const [exportFormat, setExportFormat] = React.useState("json");
  const [includeImages, setIncludeImages] = React.useState(true);
  const [includeComments, setIncludeComments] = React.useState(false);

  const {
    updateCollectionName,
    updateCollectionVisibility,
    collections,
    createACollection,
  } = useCollectionStore();
  const { setActiveCollectionName, activeCollectionId } = useActiveState();
  const { toast } = useToast();

  const getActiveCollection = () =>
    collections?.find((c) => c.id === activeCollectionId);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const addEmail = () => {
    if (!isValidEmail(newEmail)) {
      toast({
        title: "Invalid email format",
        variant: "destructive",
      });
      return;
    }
    if (emails.includes(newEmail)) {
      toast({
        title: "Email already added",
        variant: "destructive",
      });
      return;
    }
    setEmails([...emails, newEmail]);
    setNewEmail("");
  };

  const removeEmail = (emailToRemove: string) => {
    setEmails(emails.filter((email) => email !== emailToRemove));
  };

  const handleUpdateCollectionName = () => {
    if (!pageTitle) {
      console.error("Page title cannot be empty");
      return;
    }

    if (!activeCollectionId) {
      console.error("No active collection ID found");
      return;
    }

    if (selectedAction && selectedAction.type === "customize") {
      updateCollectionName(activeCollectionId, pageTitle);
      setActiveCollectionName(pageTitle);
      console.log("Updated collection name to:", pageTitle);
      setDialogOpen(false);
    }
  };

  const handleActionClick = (item: ActionItem) => {
    setIsOpen(false);
    setSelectedAction(item);
    if (item.type === "visibility") {
      // Set initial visibility to current collection's visibility
      const active = getActiveCollection();
      setVisibilityOption(active?.visibility || "public");
      setEmails(active?.sharedEmails || []);
    }
    if (item.type === "copy-link") {
      // Generate the collection link
      setCopyLink(
        `https://bukmarks.vercel.app/collection/${activeCollectionId}`
      );
    }
    if (item.type === "duplicate") {
      // Set initial duplicate name
      const active = getActiveCollection();
      setDuplicateName(`Copy of ${active?.title || "Collection"}`);
      setIncludeContents(true);
      setCopyPermissions(false);
    }
    setDialogOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedAction) return;

    switch (selectedAction.type) {
      case "customize":
        console.log("Saving customization with title:", pageTitle);
        break;
      case "visibility": {
        if (!activeCollectionId) {
          console.error("No active collection ID found");
          return;
        }

        const active = getActiveCollection();
        if (
          active?.visibility === visibilityOption &&
          visibilityOption !== "protected"
        ) {
          toast({
            title: "No changes made",
          });
          return;
        }

        try {
          // Include emails array when updating to protected visibility
          await updateCollectionVisibility(
            activeCollectionId,
            visibilityOption,
            visibilityOption === "protected" ? emails : []
          );

          toast({
            title: "Collection visibility updated",
          });
        } catch (error) {
          console.error(error);
          toast({
            title: "An error occurred",
            variant: "destructive",
          });
        }
        break;
      }
      case "copy-link":
        navigator.clipboard.writeText(copyLink);
        console.log("Copied link to clipboard");
        break;
      case "duplicate": {
        if (!activeCollectionId || !duplicateName.trim()) {
          toast({
            title: "Collection name is required",
            variant: "destructive",
          });
          return;
        }

        setIsDuplicating(true);
        try {
          const active = getActiveCollection();
          if (!active) {
            toast({
              title: "Original collection not found",
              variant: "destructive",
            });
            return;
          }

          // Determine visibility and emails for the duplicate
          let duplicateVisibility = "private";
          let duplicateEmails: string[] = [];

          if (copyPermissions) {
            duplicateVisibility = active.visibility;
            duplicateEmails = active.sharedEmails || [];
          }

          // Create the duplicate collection
          const result = await createCollectionAction(
            duplicateName,
            duplicateVisibility
          );

          if (!result.success) {
            toast({
              title: "Failed to duplicate collection",
              variant: "destructive",
            });
            return;
          }

          const newCollection = result.data;

          // Update the collection store with the new collection
          await createACollection(newCollection);

          // Copy links if includeContents is true
          if (includeContents) {
            const linksResult = await getLinksAction(activeCollectionId);
            if (linksResult.success && linksResult.data) {
              // Copy each link to the new collection
              for (const link of linksResult.data) {
                await createLinkAction(newCollection.id, link.title, link.url);
              }
            }
          }

          // Update visibility with emails if needed (for protected collections)
          if (
            copyPermissions &&
            duplicateVisibility === "protected" &&
            duplicateEmails.length > 0
          ) {
            await updateCollectionVisibility(
              newCollection.id,
              duplicateVisibility,
              duplicateEmails
            );
          }

          toast({
            title: "Collection duplicated successfully",
          });

          // Don't trigger confirmation dialog for duplicate
          setDialogOpen(false);
          return;
        } catch (error) {
          console.error(error);
          toast({
            title: "An error occurred while duplicating",
            variant: "destructive",
          });
          return;
        } finally {
          setIsDuplicating(false);
        }
      }
      case "analytics":
        console.log("Analytics tab selected:", analyticsTab);
        break;
      case "export": {
        if (!activeCollectionId) {
          toast({
            title: "No collection selected",
            variant: "destructive",
          });
          return;
        }

        setIsExporting(true);
        try {
          const active = getActiveCollection();
          if (!active) {
            toast({
              title: "Collection not found",
              variant: "destructive",
            });
            return;
          }

          // Get collection links
          const linksResult = await getLinksAction(activeCollectionId);
          if (!linksResult.success) {
            toast({
              title: "Failed to fetch collection data",
              variant: "destructive",
            });
            return;
          }

          const links = linksResult.data || [];
          const exportData = {
            collection: {
              id: active.id,
              title: active.title,
              description: active.description,
              author: active.author,
              visibility: active.visibility,
              createdAt: active.createdAt,
              totalLinks: active.totalLinks,
            },
            links: links.map((link) => ({
              title: link.title,
              url: link.url,
              createdAt: link.createdAt,
            })),
            exportedAt: new Date().toISOString(),
          };

          let fileContent: string;
          let fileName: string;
          let mimeType: string;

          switch (exportFormat) {
            case "json":
              fileContent = JSON.stringify(exportData, null, 2);
              fileName = `${active.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_collection.json`;
              mimeType = "application/json";
              break;
            case "csv":
              const csvHeader = "Title,URL,Created At\n";
              const csvRows = links
                .map(
                  (link) =>
                    `"${link.title.replace(/"/g, '""')}","${link.url}","${link.createdAt}"`
                )
                .join("\n");
              fileContent = csvHeader + csvRows;
              fileName = `${active.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_links.csv`;
              mimeType = "text/csv";
              break;
            case "txt":
              fileContent = `${active.title}\n${"=".repeat(active.title.length)}\n\n`;
              fileContent += `Description: ${active.description}\n`;
              fileContent += `Total Links: ${active.totalLinks}\n`;
              fileContent += `Created: ${active.createdAt}\n\n`;
              fileContent += "Links:\n";
              fileContent += links
                .map(
                  (link, index) =>
                    `${index + 1}. ${link.title}\n   ${link.url}\n`
                )
                .join("\n");
              fileName = `${active.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_collection.txt`;
              mimeType = "text/plain";
              break;
            default:
              fileContent = JSON.stringify(exportData, null, 2);
              fileName = `${active.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_collection.json`;
              mimeType = "application/json";
          }

          // Create and download file
          const blob = new Blob([fileContent], { type: mimeType });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          toast({
            title: "Collection exported successfully",
          });
        } catch (error) {
          console.error(error);
          toast({
            title: "An error occurred while exporting",
            variant: "destructive",
          });
        } finally {
          setIsExporting(false);
        }
        break;
      }
      default:
        console.log("Action executed:", selectedAction.label);
    }

    setDialogOpen(false);
  };

  const renderDialogContent = () => {
    if (!selectedAction) return null;

    switch (selectedAction.type) {
      case "customize":
        return (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="page-title" className="text-right">
                  Page Title
                </Label>
                <Input
                  id="page-title"
                  value={pageTitle}
                  onChange={(e) => setPageTitle(e.target.value)}
                  className="col-span-3"
                  placeholder="Enter page title"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateCollectionName}>Save Changes</Button>
            </DialogFooter>
          </>
        );

      case "visibility":
        return (
          <>
            <div className="space-y-6">
              <div className="space-y-4">
                <Label>Visibility</Label>
                <Select
                  onValueChange={setVisibilityOption}
                  value={visibilityOption}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="protected">Protected</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Choose who can view this collection
                </p>
              </div>

              {visibilityOption === "protected" && (
                <div className="space-y-4">
                  <Label>Shared With</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter email address"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      size="icon"
                      onClick={addEmail}
                      disabled={!newEmail}
                    >
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {emails.map((email) => (
                      <Badge
                        key={email}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {email}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => removeEmail(email)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  {emails.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Add email addresses to share this collection with specific
                      people
                    </p>
                  )}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={
                  visibilityOption === "protected" && emails.length === 0
                }
              >
                Apply
              </Button>
            </DialogFooter>
          </>
        );

      case "copy-link":
        return (
          <>
            <div className="py-4">
              <div className="flex space-x-2">
                <Input value={copyLink} readOnly className="flex-1" />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(copyLink);
                    toast({
                      title: "Link copied to clipboard!",
                    });
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setDialogOpen(false)}>Done</Button>
            </DialogFooter>
          </>
        );

      case "duplicate":
        return (
          <>
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="duplicate-name" className="text-right">
                  New Name
                </Label>
                <Input
                  id="duplicate-name"
                  value={duplicateName}
                  onChange={(e) => setDuplicateName(e.target.value)}
                  className="col-span-3"
                  placeholder="Enter collection name"
                  disabled={isDuplicating}
                />
              </div>
              <div className="space-y-3">
                <TooltipProvider>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="duplicate-contents"
                      checked={includeContents}
                      onCheckedChange={(checked) =>
                        setIncludeContents(checked === true)
                      }
                      disabled={isDuplicating}
                    />
                    <Label
                      htmlFor="duplicate-contents"
                      className="flex items-center gap-1"
                    >
                      Include all contents
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Copy all links and bookmarks from the original
                            collection
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="duplicate-permissions"
                      checked={copyPermissions}
                      onCheckedChange={(checked) =>
                        setCopyPermissions(checked === true)
                      }
                      disabled={isDuplicating}
                    />
                    <Label
                      htmlFor="duplicate-permissions"
                      className="flex items-center gap-1"
                    >
                      Copy permissions
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Copy visibility settings and shared email addresses
                            from the original collection
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                  </div>
                </TooltipProvider>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="secondary"
                onClick={() => setDialogOpen(false)}
                disabled={isDuplicating}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={!duplicateName.trim() || isDuplicating}
              >
                {isDuplicating ? "Duplicating..." : "Duplicate"}
              </Button>
            </DialogFooter>
          </>
        );

      case "analytics":
        return (
          <>
            <div className="py-4">
              <Tabs defaultValue="views" onValueChange={setAnalyticsTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="views">Views</TabsTrigger>
                  <TabsTrigger value="engagement">Engagement</TabsTrigger>
                  <TabsTrigger value="sources">Sources</TabsTrigger>
                </TabsList>
                <TabsContent value="views" className="py-2">
                  <div className="h-48 bg-muted rounded flex items-center justify-center">
                    <p className="text-muted-foreground">
                      Page views chart would appear here
                    </p>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="font-medium text-2xl">245</p>
                      <p className="text-xs text-muted-foreground">
                        Total Views
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-2xl">15.2</p>
                      <p className="text-xs text-muted-foreground">
                        Avg. Daily
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-2xl">+12%</p>
                      <p className="text-xs text-muted-foreground">
                        vs. Last Week
                      </p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="engagement" className="py-2">
                  <div className="h-48 bg-muted rounded flex items-center justify-center">
                    <p className="text-muted-foreground">
                      Engagement metrics would appear here
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="sources" className="py-2">
                  <div className="h-48 bg-muted rounded flex items-center justify-center">
                    <p className="text-muted-foreground">
                      Traffic sources chart would appear here
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Close
              </Button>
              <Button>Export Report</Button>
            </DialogFooter>
          </>
        );

      case "export":
        return (
          <>
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="export-format" className="text-right">
                  Format
                </Label>
                <Select
                  value={exportFormat}
                  onValueChange={setExportFormat}
                  disabled={isExporting}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON (Complete Data)</SelectItem>
                    <SelectItem value="csv">CSV (Links Only)</SelectItem>
                    <SelectItem value="txt">Text (Human Readable)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="secondary"
                onClick={() => setDialogOpen(false)}
                disabled={isExporting}
              >
                Cancel
              </Button>
              <Button onClick={handleConfirm} disabled={isExporting}>
                {isExporting ? "Exporting..." : "Export"}
              </Button>
            </DialogFooter>
          </>
        );

      default:
        return (
          <>
            <div className="py-4">
              <p>This is the dialog content for {selectedAction.label}.</p>
              <p className="text-sm text-muted-foreground mt-2">
                You can implement specific functionality for this action here.
              </p>
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirm}>Confirm</Button>
            </DialogFooter>
          </>
        );
    }
  };

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 data-[state=open]:bg-accent"
          >
            <MoreHorizontal size={24} />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-56 overflow-hidden rounded-lg p-0"
          align="end"
        >
          <Sidebar collapsible="none" className="bg-transparent">
            <SidebarContent>
              {data.map((group, groupIndex) => (
                <SidebarGroup
                  key={groupIndex}
                  className="border-b last:border-none"
                >
                  <SidebarGroupContent className="gap-0">
                    <SidebarMenu>
                      {group.map((item, itemIndex) => (
                        <SidebarMenuItem key={itemIndex}>
                          <SidebarMenuButton
                            onClick={() => handleActionClick(item)}
                          >
                            <item.icon className="h-4 w-4 mr-2" />
                            <span>{item.label}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ))}
            </SidebarContent>
          </Sidebar>
        </PopoverContent>
      </Popover>

      {selectedAction && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <selectedAction.icon className="h-5 w-5 mr-2" />
                {selectedAction.label}
              </DialogTitle>
              <DialogDescription>
                {selectedAction.type === "customize" &&
                  "Customize the appearance and settings of your page."}
                {selectedAction.type === "visibility" &&
                  "Choose who can see your page."}
                {selectedAction.type === "copy-link" &&
                  "Copy a link to share this page with others."}
                {selectedAction.type === "duplicate" &&
                  "Create a copy of this page with customizable settings."}
                {selectedAction.type === "analytics" &&
                  "View detailed analytics for this page."}
                {selectedAction.type === "export" &&
                  "Export this page in various formats."}
              </DialogDescription>
            </DialogHeader>
            {renderDialogContent()}
          </DialogContent>
        </Dialog>
      )}

      {/* Confirmation Dialog for actions that need it */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedAction?.type === "duplicate" &&
                "Are you sure you want to duplicate this page? This will create a new copy with the settings you specified."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setConfirmDialogOpen(false);
                setDialogOpen(false);
                console.log("Confirmed action:", selectedAction?.label);
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ActionItems;
