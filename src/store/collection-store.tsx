import { create } from "zustand";
import { getCollectionsAction } from "@/actions/collection/getCollections";
import { DeleteCollectionAction } from "@/actions/collection/deleteCollection";
import { ChangeCollectionAction } from "@/actions/collection/changeCollectionName";
import { Collection } from "@/types/types";
import { ChangeCollectionVisibilityAction } from "@/actions/collection/changeCollectionVisi";

interface CollectionStore {
  collections: Collection[] | null;
  fetchCollections: () => Promise<void>;
  createACollection: (collectionData: Collection) => Promise<void>;
  updateCollectionVisibility: (
    collectionId: string,
    visibility: string
  ) => Promise<void>;
  deleteCollection: (collectionId: string) => Promise<void>;
  updateCollectionName: (
    collectionId: string,
    newName: string
  ) => Promise<void>;
}

export const useCollectionStore = create<CollectionStore>((set) => ({
  collections: null,
  createACollection: async (collectionData) => {
    try {
      set((state) => ({
        collections: state.collections
          ? [...state.collections, collectionData]
          : [collectionData],
      }));
    } catch (error) {
      console.error("Failed to create collection:", error);
    }
  },

  // Fetch all collections
  fetchCollections: async () => {
    try {
      const data = await getCollectionsAction();
      if ("error" in data) {
        console.error(data.error);
        set({ collections: [] });
      } else {
        set({ collections: data.data });
      }
    } catch (error) {
      console.error("Failed to fetch collections:", error);
      set({ collections: [] });
    }
  },

  // Update collection visibility
  updateCollectionVisibility: async (collectionId, visibility) => {
    try {
      const response = await ChangeCollectionVisibilityAction(
        collectionId,
        visibility
      );

      if (response.success) {
        set((state) => ({
          collections:
            state.collections?.map((collection) =>
              collection.id === collectionId
                ? { ...collection, visibility }
                : collection
            ) || [],
        }));
      }
    } catch (error) {
      console.error("Failed to update collection visibility:", error);
    }
  },

  // Delete a collection
  deleteCollection: async (collectionId) => {
    try {
      const result = await DeleteCollectionAction(collectionId);
      if ("error" in result) {
        return;
      }
      set((state) => ({
        collections:
          state.collections?.filter(
            (collection) => collection.id !== collectionId
          ) || [],
      }));
    } catch (error) {
      console.error("Failed to delete collection:", error);
    }
  },

  // Update collection name
  updateCollectionName: async (collectionId, newName) => {
    try {
      const response = await ChangeCollectionAction(collectionId, newName);
      if (response.success) {
        set((state) => ({
          collections:
            state.collections?.map((collection) =>
              collection.id === collectionId
                ? { ...collection, name: newName }
                : collection
            ) || [],
        }));
      }
    } catch (error) {
      console.error("Failed to update collection name:", error);
    }
  },
}));
