import React from "react";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Collection } from "@/types/link";

interface DeleteCollectionOptionProps {
  collection: Collection;
  setCollectionToDelete: (collectionId: string) => void;
  handleDeleteCollection: () => void;
}

const DeleteCollectionOption: React.FC<DeleteCollectionOptionProps> = ({
  collection,
  setCollectionToDelete,
  handleDeleteCollection,
}) => {
  return (
    <>
      <AlertDialog>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            setCollectionToDelete(collection.id);
          }}
        >
          <AlertDialogTrigger asChild>
            <div className="flex items-center">
              <Trash2 className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Delete</span>
            </div>
          </AlertDialogTrigger>
        </DropdownMenuItem>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Collection</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the collection &quot;
              {collection.name}&quot;? This action cannot be undone and will
              remove all links in this collection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCollection}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteCollectionOption;
