import { create } from "zustand";
import { Link } from "@/types/link";
import { getLinks } from "@/actions/getLinks";
import { addLink, deleteLink, updateLink } from "@/actions/link-actions";

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
      const data = await getLinks(collectionId);
      if ("error" in data) {
        console.error(data.error);
        set({ links: [] });
      } else {
        set({ links: data.data });
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
      const createdLink = await addLink(newLink, collectionId);
      if ("error" in createdLink) {
        console.error(createdLink.error);
      }
      if (createdLink.success) {
        set((state) => ({
          links: [...state.links, createdLink.data],
        }));
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
      await deleteLink(id);
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
      set({ isLoading: true });
      await updateLink(id, data);
      set((state) => ({
        links: state.links.map((link) =>
          link.id === id ? { ...link, ...data, updatedAt: new Date() } : link
        ),
      }));
    } catch (error) {
      console.error("Failed to update link:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
