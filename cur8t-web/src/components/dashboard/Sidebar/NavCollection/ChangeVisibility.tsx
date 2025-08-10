import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PiPlus, PiStar, PiX, PiLink } from 'react-icons/pi';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCollectionStore } from '@/store/collection-store';
import { useToast } from '@/hooks/use-toast';

const ChangeVisibility = ({
  collectionId,
  collectionVisibility,
  sharedEmails = [],
}: {
  collectionId: string;
  collectionVisibility: string;
  sharedEmails?: string[];
}) => {
  const { updateCollectionVisibility } = useCollectionStore();
  const [open, setOpen] = React.useState(false);
  const [emails, setEmails] = React.useState(sharedEmails);
  const [newEmail, setNewEmail] = React.useState('');
  const [collectionLink] = React.useState(
    `https://cur8t.com/collection/${collectionId}`
  );
  const {
    toast,
    success: toastSuccess,
    error: toastError,
    warning: toastWarning,
  } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      visibility: collectionVisibility,
    },
  });

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const addEmail = () => {
    if (!isValidEmail(newEmail)) {
      toastWarning({
        title: 'Invalid email format',
      });
      return;
    }
    if (emails.includes(newEmail)) {
      toastWarning({
        title: 'Email already added',
      });
      return;
    }
    setEmails([...emails, newEmail]);
    setNewEmail('');
  };

  const removeEmail = (emailToRemove: string) => {
    setEmails(emails.filter((email) => email !== emailToRemove));
  };

  const copyCollectionLink = () => {
    navigator.clipboard.writeText(collectionLink);
    toast({
      title: 'Collection link copied to clipboard!',
    });
  };

  const handleUpdateConfirm = async (data: { visibility: string }) => {
    if (data.visibility === 'protected' && emails.length === 0) {
      toastWarning({
        title: 'Email Required',
        description: 'Please add at least one email for protected visibility.',
      });
      return;
    }

    const emailsToSend = data.visibility === 'protected' ? emails : [];

    if (
      data.visibility === collectionVisibility &&
      JSON.stringify(emailsToSend) === JSON.stringify(sharedEmails)
    ) {
      toastWarning({
        title: 'No Changes',
        description: 'Visibility settings are the same.',
      });
      return;
    }

    try {
      setLoading(true);
      await updateCollectionVisibility(
        collectionId,
        data.visibility,
        emailsToSend
      );

      toastSuccess({
        title: 'Visibility Updated',
        description: 'Collection visibility has been successfully updated.',
      });
    } catch (error) {
      console.error('Failed to update visibility:', error);
      toastError({
        title: 'Update Failed',
        description: 'Failed to update visibility. Please try again.',
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
        <DialogTrigger asChild>
          <div className="flex items-center">
            <PiStar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Visibility</span>
          </div>
        </DialogTrigger>
      </DropdownMenuItem>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Want to change the visibility of your collection?
          </DialogTitle>
          <DialogDescription>
            Select the preferred visibility of your collection.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdateConfirm)}
            className="space-y-6"
          >
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

            {form.watch('visibility') === 'protected' && (
              <div className="space-y-4">
                <FormLabel>Shared With</FormLabel>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter email address"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    size="icon"
                    onClick={addEmail}
                    disabled={!newEmail}
                  >
                    <PiPlus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {emails.map((email) => (
                    <Badge
                      key={email}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {email}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => removeEmail(email)}
                      >
                        <PiX className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                {emails.length === 0 && (
                  <FormDescription>
                    Add email addresses to share this collection with specific
                    people
                  </FormDescription>
                )}
              </div>
            )}

            <div className="space-y-4">
              <FormLabel className="flex items-center gap-2">
                <PiLink className="h-4 w-4" />
                Collection Link
              </FormLabel>
              <div className="flex space-x-2">
                <Input value={collectionLink} readOnly className="flex-1" />
                <Button type="button" onClick={copyCollectionLink}>
                  Copy
                </Button>
              </div>
              <FormDescription>
                Share this link to give others access to your collection
              </FormDescription>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={
                  form.formState.isSubmitting ||
                  (form.watch('visibility') === 'protected' &&
                    emails.length === 0) ||
                  (form.watch('visibility') === collectionVisibility &&
                    form.watch('visibility') !== 'protected')
                }
              >
                {loading ? 'Updating...' : 'Update'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeVisibility;
