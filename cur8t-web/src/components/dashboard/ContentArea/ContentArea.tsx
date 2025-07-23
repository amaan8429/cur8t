"use client";

import React from "react";
import { ManageCollectionLinks } from "@/components/collection/ManageCollection";
import SecondaryPage from "@/components/secondary/SecondaryPage";
import { CreateCollectionComponent } from "../TopSection/CreateCollection";
import { useActiveState } from "@/store/activeStateStore";
import SavedCollections from "../TopSection/SavedCollections";
import ToolsAndAgents from "../TopSection/ToolsAndAgents";
import { DashboardOverview } from "../Overview/DashboardOverview";
import ExplorePage from "@/app/explore/page";

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
      {activeItem === "Explore Collections" && <ExplorePage />}
      {activeItem === "Saved" && <SavedCollections />}
      {activeItem === "Tools and Agents" && <ToolsAndAgents />}

      {activeCollectionId && (
        <ManageCollectionLinks collectionId={activeCollectionId} />
      )}
      {activeSecondary && <SecondaryPage />}
    </div>
  );
}
