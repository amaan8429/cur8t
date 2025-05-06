"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
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
import { useCollectionStore } from "@/store/collection-store";
import { useActiveState } from "@/store/activeStateStore";

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
  const [copyLink, setCopyLink] = React.useState(
    "https://example.com/your-page"
  );
  const [analyticsTab, setAnalyticsTab] = React.useState("views");
  const [exportFormat, setExportFormat] = React.useState("pdf");
  const [includeImages, setIncludeImages] = React.useState(true);
  const [includeComments, setIncludeComments] = React.useState(false);

  const { updateCollectionName } = useCollectionStore();
  const { setActiveCollectionName, activeCollectionId } = useActiveState();

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
    setDialogOpen(true);
  };

  const handleConfirm = () => {
    if (!selectedAction) return;

    // Handle logic based on action type
    switch (selectedAction.type) {
      case "customize":
        console.log("Saving customization with title:", pageTitle);
        break;
      case "visibility":
        console.log("Changed visibility to:", visibilityOption);
        break;
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
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <Label htmlFor="public-option">Public</Label>
                  </div>
                  <input
                    type="radio"
                    id="public-option"
                    name="visibility"
                    value="public"
                    checked={visibilityOption === "public"}
                    onChange={() => setVisibilityOption("public")}
                  />
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  Anyone on the internet can see this page
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                    <Label htmlFor="team-option">Team</Label>
                  </div>
                  <input
                    type="radio"
                    id="team-option"
                    name="visibility"
                    value="team"
                    checked={visibilityOption === "team"}
                    onChange={() => setVisibilityOption("team")}
                  />
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  Only team members can view this page
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-gray-500"></div>
                    <Label htmlFor="private-option">Private</Label>
                  </div>
                  <input
                    type="radio"
                    id="private-option"
                    name="visibility"
                    value="private"
                    checked={visibilityOption === "private"}
                    onChange={() => setVisibilityOption("private")}
                  />
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  Only you can view this page
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirm}>Apply</Button>
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
                    alert("Link copied to clipboard!");
                  }}
                >
                  Copy
                </Button>
              </div>
              <div className="mt-4">
                <Label className="block mb-2">Link settings</Label>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Include tracking parameters</span>
                  <Switch id="tracking" />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm">Generate short URL</span>
                  <Switch id="short-url" />
                </div>
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
