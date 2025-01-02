import { create } from "zustand";
import { Link } from "@/types/types";
import { getLinksAction } from "@/actions/linkActions/getLinks";
import {
  addLinkAction,
  deleteLinkAction,
  updateLinkAction,
} from "@/actions/linkActions/link-actions";

interface LinkStore {
  links: Link[];
  isOpen: boolean;
  isLoading: boolean;
  setIsOpen: (isOpen: boolean) => void;
  refreshLinks: (collectionId: string) => Promise<void>;
  addLink: (
    newLink: Omit<
      Link,
      "id" | "userId" | "createdAt" | "updatedAt" | "linkCollectionId"
    >,
    collectionId: string
  ) => Promise<void>;
  deleteLink: (id: string) => Promise<void>;
  updateLink: (
    id: string,
    data: Partial<Pick<Link, "title" | "url">>
  ) => Promise<void>;
}

export const useLinkStore = create<LinkStore>((set) => ({
  links: [],
  isOpen: false,
  isLoading: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  refreshLinks: async (collectionId) => {
    try {
      set({ isLoading: true });
      const data = await getLinksAction(collectionId);
      if ("error" in data) {
        console.error(data.error);
      } else {
        set((state) => ({
          links: [
            ...state.links.filter(
              (link) => link.linkCollectionId !== collectionId
            ),
            ...data.data,
          ],
        }));
      }
    } catch (error) {
      console.error("Failed to refresh links:", error);
    } finally {
      set({ isLoading: false });
    }
  },
  addLink: async (newLink, collectionId) => {
    try {
      set({ isLoading: true });
      const createdLink = await addLinkAction(newLink, collectionId);
      if ("error" in createdLink) {
        console.error(createdLink.error);
      }
      if (createdLink.success) {
        set((state) => {
          const links = [...state.links, createdLink.data].length;
          console.log("Links:", links);
          return {
            links: [...state.links, createdLink.data],
          };
        });
      }
    } catch (error) {
      console.error("Failed to add link:", error);
    } finally {
      set({ isLoading: false });
    }
  },
  deleteLink: async (id) => {
    try {
      set({ isLoading: true });
      await deleteLinkAction(id);
      set((state) => ({
        links: state.links.filter((link) => link.id !== id),
      }));
    } catch (error) {
      console.error("Failed to delete link:", error);
    } finally {
      set({ isLoading: false });
    }
  },
  updateLink: async (id, data) => {
    try {
      // set({ isLoading: true });
      await updateLinkAction(id, data);
      set((state) => ({
        links: state.links.map((link) =>
          link.id === id ? { ...link, ...data, updatedAt: new Date() } : link
        ),
      }));
    } catch (error) {
      console.error("Failed to update link:", error);
    } finally {
      // set({ isLoading: false });
    }
  },
}));
