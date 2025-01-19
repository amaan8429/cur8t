import React, { useEffect } from "react";
import { Button } from "../../ui/button";
import { Star } from "lucide-react";
import { saveCollection } from "@/actions/collection/saveCollection";

const SavedCollection = ({ collectionId }: { collectionId: string }) => {
  const [isSaved, setIsSaved] = React.useState(false);

  useEffect(() => {
    setIsSaved(true);
  }, []);

  const handleSave = async () => {
    const saveResponse = await saveCollection(collectionId);
    console.log(saveResponse);
    if (saveResponse.sucess) {
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
      <Star />
    </Button>
  );
};

export default SavedCollection;
