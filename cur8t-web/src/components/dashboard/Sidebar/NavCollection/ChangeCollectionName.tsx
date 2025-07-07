import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useCollectionStore } from "@/store/collection-store";
import { EditIcon } from "lucide-react";
import React from "react";

const ChangeCollectionName = ({
  collectionId,
  collectionName,
}: {
  collectionId: string;
  collectionName: string;
}) => {
  const [newTitle, setNewTitle] = React.useState(collectionName);
  const [open, setOpen] = React.useState(false);
  const { updateCollectionName } = useCollectionStore();
  const [loading, setLoading] = React.useState(false);
  const {
    toast,
    success: toastSuccess,
    error: toastError,
    warning: toastWarning,
  } = useToast();

  const handleUpdateConfirm = async (data: { title: string }) => {
    if (!data.title.trim()) {
      toastWarning({
        title: "Title Required",
        description: "Please enter a collection name.",
      });
      return;
    }

    if (data.title === collectionName) {
      toastWarning({
        title: "No Changes",
        description: "Collection name is the same.",
      });
      return;
    }

    if (data.title.length > 50) {
      toastWarning({
        title: "Name Too Long",
        description: "Please enter a title with 50 characters or less",
      });
      return;
    }

    try {
      setLoading(true);
      await updateCollectionName(collectionId, data.title);
      toastSuccess({
        title: "Collection Updated",
        description: "Collection name has been successfully updated.",
      });
    } catch (error) {
      toastError({
        title: "Update Failed",
        description: "Failed to update collection name. Please try again.",
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <DialogTrigger asChild>
            <div className="flex items-center">
              <EditIcon className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Change Title</span>
            </div>
          </DialogTrigger>
        </DropdownMenuItem>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Collection Name</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title">New Title</label>
              <Input
                id="title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={() => handleUpdateConfirm({ title: newTitle })}
              disabled={
                !newTitle.trim() || newTitle === collectionName || loading
              }
            >
              {loading ? "Saving" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChangeCollectionName;
