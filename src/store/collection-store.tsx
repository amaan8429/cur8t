import { create } from "zustand";
import { getCollections } from "@/actions/getCollections";
import { DeleteCollection } from "@/actions/deleteCollection";
import { ChangeCollection } from "@/actions/changeCollectionName";
import { Collection } from "@/types/types";
import { ChangeCollectionVisibility } from "@/actions/changeCollectionVisi";

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
      const data = await getCollections();
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
      const response = await ChangeCollectionVisibility(
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
      const result = await DeleteCollection(collectionId);
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
      const response = await ChangeCollection(collectionId, newName);
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
