"use client";

import * as React from "react";
import UpdatedAt from "./updated-at";
import SavedCollection from "./save-collection";
import ActionItems from "./action-items";
import { useLinkStore } from "@/store/link-store";
import { useCollectionStore } from "@/store/collection-store";
import { useActiveState } from "@/store/activeStateStore";

export function NavActions() {
  const { links } = useLinkStore();
  const { activeCollectionId } = useActiveState();
  const collectionLinks = links.filter(
    (link) => link.linkCollectionId === activeCollectionId
  );

  return (
    <div className="flex items-center gap-2 text-sm">
      <UpdatedAt collectionId={activeCollectionId} />
      <ActionItems />
    </div>
  );
}
