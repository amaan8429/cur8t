"use client";

import React from "react";
import { ManageCollectionLinks } from "@/components/SingleCollection/manage-collection";
import SecondaryPage from "@/components/Secondary/secondary-page";
import { CreateCollectionComponent } from "../TopSection/create-collection";
import ExploreCollections from "../TopSection/explore-collections";
import Home from "../TopSection/home";
import SavedCollections from "../TopSection/saved-collections";
import { useActiveState } from "@/store/activeStateStore";

export function ContentArea() {
  // Use the hook to subscribe to state changes, not .getState()
  const activeItem = useActiveState((state) => state.activeItem);
  const activeCollectionId = useActiveState(
    (state) => state.activeCollectionId
  );
  const activeSecondary = useActiveState((state) => state.activeSecondary);

  return (
    <div className="p-6">
      {activeItem === "Home" && <Home />}
      {activeItem === "New" && <CreateCollectionComponent />}
      {activeItem === "Explore Collections" && <ExploreCollections />}
      {activeItem === "Saved" && <SavedCollections />}

      {activeItem === "Ask AI" && (
        <div>
          <p>How can I assist you today? Ask me anything!</p>
        </div>
      )}
      {activeItem === "Inbox" && (
        <div>
          <p>You have 10 unread messages. Here are the latest:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>Project update from Sarah</li>
            <li>New task assigned by John</li>
            <li>Team lunch reminder</li>
          </ul>
        </div>
      )}
      {activeCollectionId && (
        <ManageCollectionLinks collectionId={activeCollectionId} />
      )}
      {activeSecondary && <SecondaryPage />}
    </div>
  );
}
