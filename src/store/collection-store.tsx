import { create } from "zustand";
import { getCollectionsAction } from "@/actions/collection/getCollections";
import { deleteCollectionAction } from "@/actions/collection/deleteCollection";
import { ChangeCollectionAction } from "@/actions/collection/changeCollectionName";
import { Collection } from "@/types/types";
import { ChangeCollectionVisibilityAction } from "@/actions/collection/changeCollectionVisi";

interface CollectionStore {
  collections: Collection[] | null;
  fetchCollections: () => Promise<void>;
  createACollection: (collectionData: Collection) => Promise<void>;
  updateCollectionVisibility: (
    collectionId: string,
    visibility: string,
    sharedEmails?: string[]
  ) => Promise<void>;
  deleteCollection: (
    collectionId: string
  ) => Promise<{ error?: string; success?: boolean } | undefined>;
  updateCollectionName: (
    collectionId: string,
    newName: string
  ) => Promise<void>;
  updateCollectionDescription: (
    collectionId: string,
    newDescription: string
  ) => Promise<void>;
}

export const useCollectionStore = create<CollectionStore>((set) => ({
  collections: null,
  createACollection: async (collectionData) => {
    try {
      set((state) => ({
        collections: state.collections
          ? [collectionData, ...state.collections]
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
        set({
          collections: data.data
            .map((item) => ({
              ...item,
              sharedEmails: item.sharedEmails || [],
            }))
            .reverse(),
        });
      }
    } catch (error) {
      console.error("Failed to fetch collections:", error);
      set({ collections: [] });
    }
  },

  // Update collection visibility
  updateCollectionVisibility: async (
    collectionId,
    visibility,
    sharedEmails
  ) => {
    try {
      const response = await ChangeCollectionVisibilityAction(
        collectionId,
        visibility,
        sharedEmails
      );

      if (response.success) {
        set((state) => ({
          collections:
            state.collections?.map((collection) =>
              collection.id === collectionId
                ? {
                    ...collection,
                    visibility,
                    sharedEmails:
                      visibility === "protected" ? sharedEmails || [] : [],
                  }
                : collection
            ) || [],
        }));
      }
    } catch (error) {
      console.error("Failed to update collection visibility:", error);
      throw error;
    }
  },

  // Delete a collection
  deleteCollection: async (collectionId) => {
    try {
      const result = await deleteCollectionAction(collectionId);
      if ("error" in result) {
        console.log(result.error);
        return { error: result.error as string };
      }
      set((state) => ({
        collections:
          state.collections?.filter(
            (collection) => collection.id !== collectionId
          ) || [],
      }));
      return { success: true };
    } catch (error) {
      console.error("Failed to delete collection:", error);
      return;
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
                ? { ...collection, title: newName }
                : collection
            ) || [],
        }));
      }
    } catch (error) {
      console.error("Failed to update collection name:", error);
    }
  },

  // Update collection description
  updateCollectionDescription: async (collectionId, newDescription) => {
    try {
      set((state) => ({
        collections:
          state.collections?.map((collection) =>
            collection.id === collectionId
              ? { ...collection, description: newDescription }
              : collection
          ) || [],
      }));
    } catch (error) {
      console.error("Failed to update collection description:", error);
    }
  },
}));
