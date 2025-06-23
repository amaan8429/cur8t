import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { useCollectionStore } from "@/store/collection-store";
import { useActiveState } from "@/store/activeStateStore";

interface CustomizeActionProps {
  pageTitle: string;
  setPageTitle: (title: string) => void;
  onClose: () => void;
}

export const CustomizeAction: React.FC<CustomizeActionProps> = ({
  pageTitle,
  setPageTitle,
  onClose,
}) => {
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

    updateCollectionName(activeCollectionId, pageTitle);
    setActiveCollectionName(pageTitle);
    console.log("Updated collection name to:", pageTitle);
    onClose();
  };

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
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleUpdateCollectionName}>Save Changes</Button>
      </DialogFooter>
    </>
  );
};
