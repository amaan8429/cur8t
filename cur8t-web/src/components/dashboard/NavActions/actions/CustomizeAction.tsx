import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';
import { useCollectionStore } from '@/store/collection-store';
import { useActiveState } from '@/store/activeStateStore';
import { PiSpinner } from 'react-icons/pi';
import { VALIDATION_LIMITS } from '@/types/types';

interface CustomizeActionProps {
  pageTitle: string;
  setPageTitle: (title: string) => void;
  pageDescription: string;
  setPageDescription: (description: string) => void;
  onClose: () => void;
}

export const CustomizeAction: React.FC<CustomizeActionProps> = ({
  pageTitle,
  setPageTitle,
  pageDescription,
  setPageDescription,
  onClose,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const { updateCollectionName, updateCollectionDescription } =
    useCollectionStore();
  const { setActiveCollectionName, activeCollectionId } = useActiveState();

  const handleUpdateCollection = async () => {
    if (!pageTitle.trim()) {
      console.error('Page title cannot be empty');
      return;
    }

    if (!activeCollectionId) {
      console.error('No active collection ID found');
      return;
    }

    setIsSaving(true);

    try {
      // Update collection name
      await updateCollectionName(activeCollectionId, pageTitle);
      setActiveCollectionName(pageTitle);

      // Update collection description
      await updateCollectionDescription(activeCollectionId, pageDescription);

      console.log('Updated collection name to:', pageTitle);
      console.log('Updated collection description to:', pageDescription);
      onClose();
    } catch (error) {
      console.error('Failed to update collection:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="grid gap-6 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="page-title" className="text-right">
            Collection Title
          </Label>
          <Input
            id="page-title"
            value={pageTitle}
            onChange={(e) => setPageTitle(e.target.value)}
            className="col-span-3"
            placeholder="Enter collection title"
            maxLength={VALIDATION_LIMITS.COLLECTION_NAME_MAX}
          />
        </div>

        <div className="grid grid-cols-4 items-start gap-4">
          <Label htmlFor="page-description" className="text-right pt-2">
            Description
          </Label>
          <div className="col-span-3 relative">
            <Textarea
              id="page-description"
              value={pageDescription}
              onChange={(e) => setPageDescription(e.target.value)}
              placeholder="Enter collection description (optional)"
              className="min-h-[100px] resize-none"
              maxLength={VALIDATION_LIMITS.COLLECTION_DESCRIPTION_MAX}
            />
            <span className="absolute right-3 bottom-3 text-muted-foreground text-sm">
              {pageDescription.length}/
              {VALIDATION_LIMITS.COLLECTION_DESCRIPTION_MAX}
            </span>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="secondary" onClick={onClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button onClick={handleUpdateCollection} disabled={isSaving}>
          {isSaving ? (
            <>
              <PiSpinner className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </DialogFooter>
    </>
  );
};
