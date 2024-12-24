import { create } from "zustand";
import { Link } from "@/types/link";
import { getLinks } from "@/actions/getLinks";
import { addLink, deleteLink, updateLink } from "@/actions/link-actions";

interface LinkStore {
  links: Link[];
  isOpen: boolean;
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
  setIsOpen: (isOpen) => set({ isOpen }),
  refreshLinks: async (collectionId) => {
    try {
      const data = await getLinks(collectionId);
      if ("error" in data) {
        console.error(data.error);
        set({ links: [] });
      } else {
        set({ links: data.data });
      }
    } catch (error) {
      console.error("Failed to refresh links:", error);
    }
  },
  addLink: async (newLink, collectionId) => {
    try {
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
    }
  },
  deleteLink: async (id) => {
    try {
      await deleteLink(id);
      set((state) => ({
        links: state.links.filter((link) => link.id !== id),
      }));
    } catch (error) {
      console.error("Failed to delete link:", error);
    }
  },
  updateLink: async (id, data) => {
    try {
      await updateLink(id, data);
      set((state) => ({
        links: state.links.map((link) =>
          link.id === id ? { ...link, ...data, updatedAt: new Date() } : link
        ),
      }));
    } catch (error) {
      console.error("Failed to update link:", error);
    }
  },
}));
