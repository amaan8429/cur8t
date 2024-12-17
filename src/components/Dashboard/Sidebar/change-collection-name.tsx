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
import { EditIcon } from "lucide-react";
import React from "react";

const ChangeCollectionName = () => {
  const [newTitle, setNewTitle] = React.useState("");

  const handleUpdateConfirm = () => {
    // Update the collection title
    // dispatchCollectionUpdatedEvent(collectionId);
  };

  return (
    <>
      <Dialog>
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
            <Button onClick={handleUpdateConfirm}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChangeCollectionName;
