'use client';

import { useActiveState } from '@/store/activeStateStore';
import { useCollectionStore } from '@/store/collection-store';

const UpdatedAt = ({ collectionId }: { collectionId: string }) => {
  const { collections } = useCollectionStore();
  const collection = collections?.find((c) => c.id === collectionId);

  console.log('UpdatedAt collectionId:', collectionId);
  console.log('UpdatedAt collection:', collection);
  const updatedAt = collection?.updatedAt.toLocaleString() || '';

  console.log('UpdatedAt collectionId:', updatedAt);

  return (
    <div className="hidden font-medium text-muted-foreground md:inline-block">
      Updated {updatedAt}
    </div>
  );
};

export default UpdatedAt;
