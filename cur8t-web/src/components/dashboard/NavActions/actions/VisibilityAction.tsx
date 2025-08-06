import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { DialogFooter } from '@/components/ui/dialog';
import { PiPlus, PiX } from 'react-icons/pi';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCollectionStore } from '@/store/collection-store';
import { useActiveState } from '@/store/activeStateStore';
import { useToast } from '@/hooks/use-toast';

interface VisibilityActionProps {
  visibilityOption: string;
  setVisibilityOption: (visibility: string) => void;
  emails: string[];
  setEmails: (emails: string[]) => void;
  newEmail: string;
  setNewEmail: (email: string) => void;
  onClose: () => void;
}

export const VisibilityAction: React.FC<VisibilityActionProps> = ({
  visibilityOption,
  setVisibilityOption,
  emails,
  setEmails,
  newEmail,
  setNewEmail,
  onClose,
}) => {
  const { updateCollectionVisibility, collections } = useCollectionStore();
  const { activeCollectionId } = useActiveState();
  const { toast } = useToast();

  const getActiveCollection = () =>
    collections?.find((c) => c.id === activeCollectionId);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const addEmail = () => {
    if (!isValidEmail(newEmail)) {
      toast({
        title: 'Invalid email format',
        variant: 'destructive',
      });
      return;
    }
    if (emails.includes(newEmail)) {
      toast({
        title: 'Email already added',
        variant: 'destructive',
      });
      return;
    }
    setEmails([...emails, newEmail]);
    setNewEmail('');
  };

  const removeEmail = (emailToRemove: string) => {
    setEmails(emails.filter((email) => email !== emailToRemove));
  };

  const handleConfirm = async () => {
    if (!activeCollectionId) {
      console.error('No active collection ID found');
      return;
    }

    const active = getActiveCollection();
    if (
      active?.visibility === visibilityOption &&
      visibilityOption !== 'protected'
    ) {
      toast({
        title: 'No changes made',
      });
      return;
    }

    try {
      // Include emails array when updating to protected visibility
      await updateCollectionVisibility(
        activeCollectionId,
        visibilityOption,
        visibilityOption === 'protected' ? emails : []
      );

      toast({
        title: 'Collection visibility updated',
      });
      onClose();
    } catch (error) {
      console.error(error);
      toast({
        title: 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="space-y-4">
          <Label>Visibility</Label>
          <Select onValueChange={setVisibilityOption} value={visibilityOption}>
            <SelectTrigger>
              <SelectValue placeholder="Select visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="protected">Protected</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Choose who can view this collection
          </p>
        </div>

        {visibilityOption === 'protected' && (
          <div className="space-y-4">
            <Label>Shared With</Label>
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
              <p className="text-sm text-muted-foreground">
                Add email addresses to share this collection with specific
                people
              </p>
            )}
          </div>
        )}
      </div>
      <DialogFooter>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={visibilityOption === 'protected' && emails.length === 0}
        >
          Apply
        </Button>
      </DialogFooter>
    </>
  );
};
