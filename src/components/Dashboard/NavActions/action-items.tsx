"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusIcon, X } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
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
  const [copyLink, setCopyLink] = React.useState(
    "https://example.com/your-page"
  );
  const [analyticsTab, setAnalyticsTab] = React.useState("views");
  const [exportFormat, setExportFormat] = React.useState("pdf");
  const [includeImages, setIncludeImages] = React.useState(true);
  const [includeComments, setIncludeComments] = React.useState(false);

  const { updateCollectionName, updateCollectionVisibility, collections } =
    useCollectionStore();
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
      case "duplicate":
        console.log("Duplicating page");
        setConfirmDialogOpen(true);
        return; // Don't close dialog yet
      case "analytics":
        console.log("Analytics tab selected:", analyticsTab);
        break;
      case "export":
        console.log(
          "Exporting in format:",
          exportFormat,
          "with images:",
          includeImages,
          "and comments:",
          includeComments
        );
        break;
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
                  defaultValue="Copy of Current Page"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="duplicate-location" className="text-right">
                  Location
                </Label>
                <Select defaultValue="same">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="same">Same folder</SelectItem>
                    <SelectItem value="root">Root folder</SelectItem>
                    <SelectItem value="other">Other location...</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox id="duplicate-contents" defaultChecked />
                <Label htmlFor="duplicate-contents">Include all contents</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="duplicate-permissions" />
                <Label htmlFor="duplicate-permissions">Copy permissions</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirm}>Duplicate</Button>
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
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                    <SelectItem value="docx">Word Document</SelectItem>
                    <SelectItem value="html">HTML File</SelectItem>
                    <SelectItem value="md">Markdown</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="block">Export Options</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-images"
                    checked={includeImages}
                    onCheckedChange={(checked) =>
                      setIncludeImages(checked === true)
                    }
                  />
                  <Label htmlFor="include-images">Include images</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-comments"
                    checked={includeComments}
                    onCheckedChange={(checked) =>
                      setIncludeComments(checked === true)
                    }
                  />
                  <Label htmlFor="include-comments">Include comments</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-metadata" />
                  <Label htmlFor="include-metadata">Include metadata</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirm}>Export</Button>
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
