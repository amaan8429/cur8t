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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useCollectionStore } from "@/store/collection-store";
import { ChangeCollectionDescriptionAction } from "@/actions/collection/changeCollectionDescription";
import { FileText } from "lucide-react";
import React from "react";

const ChangeCollectionDescription = ({
  collectionId,
  collectionDescription,
}: {
  collectionId: string;
  collectionDescription: string;
}) => {
  const [newDescription, setNewDescription] = React.useState(
    collectionDescription || ""
  );
  const [open, setOpen] = React.useState(false);
  const { updateCollectionDescription } = useCollectionStore();
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  const handleUpdateConfirm = async (data: { description: string }) => {
    if (data.description === collectionDescription) {
      toast({
        title: "Description is the same",
      });
      return;
    }

    if (data.description.length > 200) {
      toast({
        title: "Description is too long",
        description: "Please enter a description with 200 characters or less",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const result = await ChangeCollectionDescriptionAction(
        collectionId,
        data.description
      );

      if (result.success) {
        await updateCollectionDescription(collectionId, data.description);
        toast({
          title: "Collection description updated successfully",
        });
      } else {
        toast({
          title: "Failed to update collection description",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to update collection description",
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
              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Change Description</span>
            </div>
          </DialogTrigger>
        </DropdownMenuItem>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Collection Description</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="description">New Description</label>
              <div className="relative">
                <Textarea
                  id="description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Enter a description for your collection..."
                  className="min-h-[100px] resize-none"
                  maxLength={200}
                />
                <span className="absolute right-3 bottom-3 text-muted-foreground text-sm">
                  {newDescription.length}/200
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={() =>
                handleUpdateConfirm({ description: newDescription })
              }
              disabled={newDescription === collectionDescription || loading}
            >
              {loading ? "Saving" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChangeCollectionDescription;
