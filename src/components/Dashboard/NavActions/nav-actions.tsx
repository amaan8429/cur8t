"use client";

import * as React from "react";
import UpdatedAt from "./updated-at";
import SavedCollection from "./save-collection";
import ActionItems from "./action-items";
import { useLinkStore } from "@/store/link-store";
import { useCollectionStore } from "@/store/collection-store";

export function NavActions({ collectionId }: { collectionId: string }) {
  const { links } = useLinkStore();
  const collectionLinks = links.filter(
    (link) => link.linkCollectionId === collectionId
  );

  return (
    <div className="flex items-center gap-2 text-sm">
      <UpdatedAt collectionId={collectionId} />
      <ActionItems />
    </div>
  );
}
