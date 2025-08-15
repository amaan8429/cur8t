'use client';

import { ManageCollectionLinks } from '@/components/collection/ManageCollection';
import SecondaryPage from '@/components/secondary/SecondaryPage';
import { useActiveState } from '@/store/activeStateStore';
import { DashboardOverview } from '../Overview/DashboardOverview';

export function ContentArea() {
  // Use the hook to subscribe to state changes, not .getState()
  const activeItem = useActiveState((state) => state.activeItem);
  const activeCollectionId = useActiveState(
    (state) => state.activeCollectionId
  );
  const activeSecondary = useActiveState((state) => state.activeSecondary);

  return (
    <div className="p-4 sm:p-6">
      {activeItem === 'Overview' && <DashboardOverview />}

      {activeCollectionId && (
        <ManageCollectionLinks collectionId={activeCollectionId} />
      )}
      {activeSecondary && <SecondaryPage />}
    </div>
  );
}
