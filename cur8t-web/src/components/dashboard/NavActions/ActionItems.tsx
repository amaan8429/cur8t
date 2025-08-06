"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PiDotsThreeThin } from "react-icons/pi";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { actionsData as data, ActionType } from "./actions-data";
import { useCollectionStore } from "@/store/collection-store";
import { useActiveState } from "@/store/activeStateStore";

// Import individual action components
import { CustomizeAction } from "./actions/CustomizeAction";
import { VisibilityAction } from "./actions/VisibilityAction";
import { CopyLinkAction } from "./actions/CopyLinkAction";
import { DuplicateAction } from "./actions/DuplicateAction";
import { ExportAction } from "./actions/ExportAction";

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

  // Form states for different dialogs
  const [pageTitle, setPageTitle] = React.useState("");
  const [pageDescription, setPageDescription] = React.useState("");
  const [visibilityOption, setVisibilityOption] = React.useState("public");
  const [emails, setEmails] = React.useState<string[]>([]);
  const [newEmail, setNewEmail] = React.useState("");
  const [duplicateName, setDuplicateName] = React.useState("");
  const [includeContents, setIncludeContents] = React.useState(true);
  const [copyPermissions, setCopyPermissions] = React.useState(false);
  const [isDuplicating, setIsDuplicating] = React.useState(false);
  const [isExporting, setIsExporting] = React.useState(false);
  const [copyLink, setCopyLink] = React.useState("");
  const [exportFormat, setExportFormat] = React.useState("json");

  const { collections } = useCollectionStore();
  const { activeCollectionId } = useActiveState();

  const getActiveCollection = () =>
    collections?.find((c) => c.id === activeCollectionId);

  const handleActionClick = (item: ActionItem) => {
    setIsOpen(false);
    setSelectedAction(item);

    // Initialize states based on action type
    if (item.type === "customize") {
      const active = getActiveCollection();
      setPageTitle(active?.title || "");
      setPageDescription(active?.description || "");
    }

    if (item.type === "visibility") {
      const active = getActiveCollection();
      setVisibilityOption(active?.visibility || "public");
      setEmails(active?.sharedEmails || []);
    }

    if (item.type === "copy-link") {
      setCopyLink(
        `https://bukmarks.vercel.app/collection/${activeCollectionId}`
      );
    }

    if (item.type === "duplicate") {
      const active = getActiveCollection();
      setDuplicateName(`Copy of ${active?.title || "Collection"}`);
      setIncludeContents(true);
      setCopyPermissions(false);
    }

    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setSelectedAction(null);
  };

  const renderDialogContent = () => {
    if (!selectedAction) return null;

    switch (selectedAction.type) {
      case "customize":
        return (
          <CustomizeAction
            pageTitle={pageTitle}
            setPageTitle={setPageTitle}
            pageDescription={pageDescription}
            setPageDescription={setPageDescription}
            onClose={handleClose}
          />
        );

      case "visibility":
        return (
          <VisibilityAction
            visibilityOption={visibilityOption}
            setVisibilityOption={setVisibilityOption}
            emails={emails}
            setEmails={setEmails}
            newEmail={newEmail}
            setNewEmail={setNewEmail}
            onClose={handleClose}
          />
        );

      case "copy-link":
        return <CopyLinkAction copyLink={copyLink} onClose={handleClose} />;

      case "duplicate":
        return (
          <DuplicateAction
            duplicateName={duplicateName}
            setDuplicateName={setDuplicateName}
            includeContents={includeContents}
            setIncludeContents={setIncludeContents}
            copyPermissions={copyPermissions}
            setCopyPermissions={setCopyPermissions}
            isDuplicating={isDuplicating}
            setIsDuplicating={setIsDuplicating}
            onClose={handleClose}
          />
        );

      case "export":
        return (
          <ExportAction
            exportFormat={exportFormat}
            setExportFormat={setExportFormat}
            isExporting={isExporting}
            setIsExporting={setIsExporting}
            onClose={handleClose}
          />
        );

      default:
        return (
          <div className="py-4">
            <p>This action is not implemented yet.</p>
          </div>
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
            <PiDotsThreeThin size={24} />
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
                  "Customize the title and description of your collection."}
                {selectedAction.type === "visibility" &&
                  "Choose who can see your page."}
                {selectedAction.type === "copy-link" &&
                  "Copy a link to share this page with others."}
                {selectedAction.type === "duplicate" &&
                  "Create a copy of this page with customizable settings."}
                {selectedAction.type === "export" &&
                  "Export this page in various formats."}
              </DialogDescription>
            </DialogHeader>
            {renderDialogContent()}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ActionItems;
