import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, z } from "zod";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { StarOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCollectionStore } from "@/store/collection-store";
import { useToast } from "@/hooks/use-toast";

const ChangeVisibility = ({
  collectionId,
  collectionVisibility,
}: {
  collectionId: string;
  collectionVisibility: string;
}) => {
  const { updateCollectionVisibility } = useCollectionStore();
  const [open, setOpen] = React.useState(false);
  const FormSchema = z.object({
    visibility: z.string().nonempty({
      message: "Please select a visibility option",
    }),
  });
  const { toast } = useToast();

  // Initialize the form
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      visibility: collectionVisibility,
    },
  });

  // Handle form submission
  const onSubmit = async (data: { visibility: string }) => {
    try {
      if (collectionVisibility === data.visibility) {
        toast({
          title: "No changes made",
        });
        return;
      }
      await updateCollectionVisibility(collectionId, data.visibility);
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
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
        <DialogTrigger asChild>
          <div className="flex items-center">
            <StarOff className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Visibility</span>
          </div>
        </DialogTrigger>
      </DropdownMenuItem>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Want to change the visibility of your collection?
          </DialogTitle>
          <DialogDescription>
            Select the preferred visibility of your collection.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visibility</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="protected">Protected</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose who can view this collection
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={
                  !form.formState.isValid ||
                  form.formState.isSubmitting ||
                  form.formState.defaultValues?.visibility ===
                    form.getValues("visibility")
                }
              >
                {form.formState.isSubmitting ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeVisibility;
