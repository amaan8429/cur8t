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
import { Collection } from "@/types/types";
import { useCollectionStore } from "@/store/collection-store";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useActiveState } from "@/store/activeStateStore";

const DeleteCollectionOption = ({ collection }: { collection: Collection }) => {
  const [loading, setLoading] = React.useState(false);
  const { deleteCollection } = useCollectionStore();
  const { toast, success: toastSuccess, error: toastError } = useToast();
  const router = useRouter();
  const { activeCollectionId } = useActiveState();

  const handleDeleteCollection = async () => {
    try {
      setLoading(true);
      const result = await deleteCollection(collection.id);
      if (result?.error) {
        console.log(result.error);
        toastError({
          title: "Delete Failed",
          description: "Failed to delete collection. Please try again.",
        });
        return;
      }
      toastSuccess({
        title: "Collection Deleted",
        description: "Your collection has been successfully deleted.",
      });

      // Redirect to overview if the deleted collection was currently active
      if (activeCollectionId === collection.id) {
        router.push("/dashboard?item=Overview");
      }
    } catch (error) {
      console.error("Failed to delete collection: ", error);
      toastError({
        title: "Delete Failed",
        description: "Failed to delete collection. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={(e: Event) => e.preventDefault()}>
          <div className="flex items-center">
            <Trash2 className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Delete</span>
          </div>
        </DropdownMenuItem>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Collection</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the collection &quot;
            {collection.title}&quot;? This action cannot be undone and will
            remove all links in this collection.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteCollection}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCollectionOption;
