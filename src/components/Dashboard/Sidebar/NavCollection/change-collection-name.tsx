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
  const { toast } = useToast();

  const handleUpdateConfirm = async (data: { title: string }) => {
    if (!data.title.trim()) {
      toast({
        title: "Title cannot be empty",
      });
      return;
    }

    if (data.title === collectionName) {
      toast({
        title: "Collection name is the same",
      });
      return;
    }

    if (data.title.length > 50) {
      toast({
        title: "Title is too long",
        description: "Please enter a title with 50 characters or less",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await updateCollectionName(collectionId, data.title);
      toast({
        title: "Collection name updated successfully",
      });
    } catch (error) {
      toast({
        title: "Failed to update collection name",
        variant: "destructive",
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
