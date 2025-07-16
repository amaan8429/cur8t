"use client";

import React from "react";
import { ManageCollectionLinks } from "@/components/collection/ManageCollection";
import SecondaryPage from "@/components/secondary/SecondaryPage";
import { CreateCollectionComponent } from "../TopSection/CreateCollection";
import { useActiveState } from "@/store/activeStateStore";
import ExploreCollections from "../TopSection/ExploreCollections";
import { Home } from "lucide-react";
import SavedCollections from "../TopSection/SavedCollections";
import ToolsAndAgents from "../TopSection/ToolsAndAgents";
import { DashboardOverview } from "../Overview/DashboardOverview";

export function ContentArea() {
  // Use the hook to subscribe to state changes, not .getState()
  const activeItem = useActiveState((state) => state.activeItem);
  const activeCollectionId = useActiveState(
    (state) => state.activeCollectionId
  );
  const activeSecondary = useActiveState((state) => state.activeSecondary);

  return (
    <div className="p-6">
      {activeItem === "Overview" && <DashboardOverview />}
      {activeItem === "New" && <CreateCollectionComponent />}
      {activeItem === "Explore Collections" && <ExploreCollections />}
      {activeItem === "Saved" && <SavedCollections />}
      {activeItem === "Tools and Agents" && <ToolsAndAgents />}

      {activeCollectionId && (
        <ManageCollectionLinks collectionId={activeCollectionId} />
      )}
      {activeSecondary &&
        typeof SecondaryPage === "function" &&
        (() => {
          const result = SecondaryPage();
          // Only render if result is a valid React element (not a Window object)
          if (React.isValidElement(result)) {
            return result;
          }
          return null;
        })()}
    </div>
  );
}
