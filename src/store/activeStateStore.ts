import { create } from "zustand";

interface ActiveState {
  activeItem: string;
  activeCollectionId: string;
  activeSecondary: string;
  activeCollectionName: string;
  setActiveItem: (item: string) => void;
  setActiveCollectionId: (collectionId: string) => void;
  setActiveSecondary: (secondary: string) => void;
  setActiveCollectionName: (collectionName: string) => void;
}

export const useActiveState = create<ActiveState>((set) => ({
  activeItem: "",
  activeCollectionId: "",
  activeSecondary: "",
  activeCollectionName: "",
  setActiveItem: (item) => set({ activeItem: item }),
  setActiveCollectionId: (collectionId) =>
    set({ activeCollectionId: collectionId }),
  setActiveSecondary: (secondary) => set({ activeSecondary: secondary }),
  setActiveCollectionName: (collectionName) =>
    set({ activeCollectionName: collectionName }),
}));
