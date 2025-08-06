'use client';

import { useEffect } from 'react';
import { useActiveState } from '@/store/activeStateStore';

interface ClientStateManagerProps {
  activeItem?: string;
  activeCollectionId?: string;
  activeSecondary?: string;
  activeCollectionName?: string;
}

export function ClientStateManager({
  activeItem,
  activeCollectionId,
  activeSecondary,
  activeCollectionName,
}: ClientStateManagerProps) {
  const setActiveItem = useActiveState((state) => state.setActiveItem);
  const setActiveCollectionId = useActiveState(
    (state) => state.setActiveCollectionId
  );
  const setActiveSecondary = useActiveState(
    (state) => state.setActiveSecondary
  );
  const setActiveCollectionName = useActiveState(
    (state) => state.setActiveCollectionName
  );

  useEffect(() => {
    setActiveItem(activeItem || '');
    setActiveCollectionId(activeCollectionId || '');
    setActiveSecondary(activeSecondary || '');
    setActiveCollectionName(activeCollectionName || '');
  }, [
    activeItem,
    activeCollectionId,
    activeSecondary,
    activeCollectionName,
    setActiveItem,
    setActiveCollectionId,
    setActiveSecondary,
    setActiveCollectionName,
  ]);

  return null; // This component doesn't render anything
}
