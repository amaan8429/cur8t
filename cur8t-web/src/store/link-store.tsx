import { create } from "zustand";
import { Link } from "@/types/types";
import { getLinksAction } from "@/actions/linkActions/getLinks";
import {
  addLinkAction,
  deleteLinkAction,
  updateLinkAction,
} from "@/actions/linkActions/link-actions";
import { generateFallbackTitle } from "@/lib/extractTitle";

interface LinkStore {
  links: Link[];
  isOpen: boolean;
  isLoading: boolean;
  setIsOpen: (isOpen: boolean) => void;
  refreshLinks: (collectionId: string) => Promise<void>;
  addLink: (
    newLink: {
      title?: string;
      url: string;
    },
    collectionId: string,
    onError?: (error: string) => void
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
  addLink: async (newLink, collectionId, onError) => {
    // Generate optimistic link data
    const optimisticId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const trimmedTitle = newLink.title?.trim();
    const optimisticTitle: string =
      trimmedTitle && trimmedTitle.length > 0
        ? trimmedTitle
        : generateFallbackTitle(newLink.url) || "Untitled Link";

    const optimisticLink: Link = {
      id: optimisticId,
      title: optimisticTitle,
      url: newLink.url,
      linkCollectionId: collectionId,
      userId: "temp-user", // Will be replaced by real data
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add optimistically to UI immediately
    set((state) => ({
      links: [...state.links, optimisticLink],
      isOpen: false, // Close dialog immediately
    }));

    try {
      // Make the actual API call in the background
      const createdLink = await addLinkAction(newLink, collectionId);

      // Check for rate limiting
      if (createdLink.error && createdLink.retryAfter) {
        // Remove optimistic link and show rate limit toast
        set((state) => ({
          links: state.links.filter((link) => link.id !== optimisticId),
        }));

        const { showRateLimitToast } = await import(
          "@/components/ui/rate-limit-toast"
        );
        showRateLimitToast({
          retryAfter: createdLink.retryAfter * 60,
          message: "Too many link creation attempts. Please try again later.",
        });
        return;
      }

      if ("error" in createdLink) {
        // Remove optimistic link and show error
        set((state) => ({
          links: state.links.filter((link) => link.id !== optimisticId),
        }));
        onError?.(createdLink.error || "An unknown error occurred");
        return;
      }

      if (createdLink.success) {
        // Replace optimistic link with real data
        set((state) => ({
          links: state.links.map((link) =>
            link.id === optimisticId ? createdLink.data : link
          ),
        }));
      }
    } catch (error) {
      // Remove optimistic link on error
      set((state) => ({
        links: state.links.filter((link) => link.id !== optimisticId),
      }));
      console.error("Failed to add link:", error);
      onError?.("Failed to add link. Please try again.");
    }
  },
  deleteLink: async (id) => {
    try {
      set({ isLoading: true });
      const result = await deleteLinkAction(id);

      // Check for rate limiting
      if (result && result.error && result.retryAfter) {
        const { showRateLimitToast } = await import(
          "@/components/ui/rate-limit-toast"
        );
        showRateLimitToast({
          retryAfter: result.retryAfter * 60,
          message: "Too many delete attempts. Please try again later.",
        });
        return;
      }

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
      const result = await updateLinkAction(id, data);

      // Check for rate limiting
      if (result && result.error && result.retryAfter) {
        const { showRateLimitToast } = await import(
          "@/components/ui/rate-limit-toast"
        );
        showRateLimitToast({
          retryAfter: result.retryAfter * 60,
          message: "Too many update attempts. Please try again later.",
        });
        return;
      }

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
