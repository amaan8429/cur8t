import React, { useEffect } from 'react';
import { Button } from '../../ui/button';
import { PiStar } from 'react-icons/pi';
import { saveCollectionAction } from '@/actions/collection/saveCollection';

const SavedCollection = ({ collectionId }: { collectionId: string }) => {
  const [isSaved, setIsSaved] = React.useState(false);

  useEffect(() => {
    setIsSaved(true);
  }, []);

  const handleSave = async () => {
    const saveResponse = await saveCollectionAction(collectionId);
    console.log(saveResponse);

    // Check for rate limiting
    if (saveResponse.error && saveResponse.retryAfter) {
      const { showRateLimitToast } = await import(
        '@/components/ui/rate-limit-toast'
      );
      showRateLimitToast({
        retryAfter: saveResponse.retryAfter * 60,
        message: 'Too many save attempts. Please try again later.',
      });
      return;
    }

    if (saveResponse.success) {
      setIsSaved(true);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7"
      onClick={handleSave}
    >
      <PiStar />
    </Button>
  );
};

export default SavedCollection;
