"use client";

import { create } from "zustand";
import { getPinnedCollections } from "@/actions/collection/pinnedCollections";

interface PinnedCollection {
  id: string;
  title: string;
  description: string;
  visibility: string;
  totalLinks: number;
  createdAt: Date;
}

interface PinnedCollectionsStore {
  pinnedCollections: PinnedCollection[];
  pinnedCollectionIds: string[];
  isLoading: boolean;
  fetchPinnedCollections: () => Promise<void>;
  refreshPinnedCollections: () => Promise<void>;
  optimisticAddPin: (collectionId: string) => void;
  optimisticRemovePin: (collectionId: string) => void;
  revertOptimisticUpdate: () => void;
}

export const usePinnedCollectionsStore = create<PinnedCollectionsStore>(
  (set, get) => ({
    pinnedCollections: [],
    pinnedCollectionIds: [],
    isLoading: false,

    fetchPinnedCollections: async () => {
      set({ isLoading: true });
      try {
        const result = await getPinnedCollections();
        if (result.data) {
          const collections = result.data as PinnedCollection[];
          set({
            pinnedCollections: collections,
            pinnedCollectionIds: collections.map((col) => col.id),
          });
        } else {
          set({
            pinnedCollections: [],
            pinnedCollectionIds: [],
          });
        }
      } catch (error) {
        console.error("Error fetching pinned collections:", error);
        set({
          pinnedCollections: [],
          pinnedCollectionIds: [],
        });
      } finally {
        set({ isLoading: false });
      }
    },

    refreshPinnedCollections: async () => {
      const { fetchPinnedCollections } = get();
      await fetchPinnedCollections();
    },

    optimisticAddPin: (collectionId: string) => {
      const state = get();
      // Add to the pinned list optimistically
      if (!state.pinnedCollectionIds.includes(collectionId)) {
        set({
          pinnedCollectionIds: [...state.pinnedCollectionIds, collectionId],
        });
      }
    },

    optimisticRemovePin: (collectionId: string) => {
      const state = get();
      // Remove from the pinned list optimistically
      set({
        pinnedCollections: state.pinnedCollections.filter(
          (col) => col.id !== collectionId
        ),
        pinnedCollectionIds: state.pinnedCollectionIds.filter(
          (id) => id !== collectionId
        ),
      });
    },

    revertOptimisticUpdate: async () => {
      // Simply refetch the real data from server
      const { fetchPinnedCollections } = get();
      await fetchPinnedCollections();
    },
  })
);
