"use client";

import { useCollectionStore } from "@/store/collection-store";

const UpdatedAt = ({ collectionId }: { collectionId: string }) => {
  const { collections } = useCollectionStore();
  const collection = collections?.find((c) => c.id === collectionId);
  const updatedAt = collection?.updatedAt.toLocaleString() || "";

  return (
    <div className="hidden font-medium text-muted-foreground md:inline-block">
      Updated {updatedAt}
    </div>
  );
};

export default UpdatedAt;
