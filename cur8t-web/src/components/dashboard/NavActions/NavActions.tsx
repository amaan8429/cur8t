'use client';

import * as React from 'react';
import UpdatedAt from './UpdatedAt';
import SavedCollection from './SaveCollection';
import ActionItems from './ActionItems';
import { useLinkStore } from '@/store/link-store';
import { useCollectionStore } from '@/store/collection-store';
import { useActiveState } from '@/store/activeStateStore';

export function NavActions({
  activeCollectionId,
}: {
  activeCollectionId: string;
}) {
  const { links } = useLinkStore();
  const collectionLinks = links.filter(
    (link) => link.linkCollectionId === activeCollectionId
  );

  console.log('Active collection ID:', activeCollectionId);

  return (
    <div className="flex items-center gap-2 text-sm">
      <UpdatedAt collectionId={activeCollectionId} />
      <ActionItems />
    </div>
  );
}
