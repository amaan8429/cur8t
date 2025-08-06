import { create } from 'zustand';

interface ActiveState {
  activeItem: string;
  activeUserId: string;
  activeCollectionId: string;
  activeSecondary: string;
  activeCollectionName: string;
  setActiveItem: (item: string) => void;
  setActiveUserId: (userId: string) => void;
  setActiveCollectionId: (collectionId: string) => void;
  setActiveSecondary: (secondary: string) => void;
  setActiveCollectionName: (collectionName: string) => void;
}

export const useActiveState = create<ActiveState>((set) => ({
  activeItem: '',
  activeUserId: '',
  activeCollectionId: '',
  activeSecondary: '',
  activeCollectionName: '',
  setActiveItem: (item) => set({ activeItem: item }),
  setActiveUserId: (userId) => set({ activeUserId: userId }),
  setActiveCollectionId: (collectionId) =>
    set({ activeCollectionId: collectionId }),
  setActiveSecondary: (secondary) => set({ activeSecondary: secondary }),
  setActiveCollectionName: (collectionName) =>
    set({ activeCollectionName: collectionName }),
}));
