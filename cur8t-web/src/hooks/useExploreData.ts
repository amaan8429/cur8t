import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import {
  fetchPublicCollections,
  PublicCollection,
} from "@/actions/collection/fetchPublicCollections";
import {
  fetchSavedCollections,
  SavedCollection,
} from "@/actions/collection/fetchSavedCollections";
import {
  getHomepageCollections,
  HomepageCollection,
} from "@/actions/platform/homepageCollections";
import { getUserInfoAction } from "@/actions/user/getUserInfo";

export interface UseExploreDataReturn {
  trendingCollections: PublicCollection[];
  recentCollections: PublicCollection[];
  savedCollections: SavedCollection[];
  newCollections: HomepageCollection[];
  isLoading: boolean;
  userStats: {
    totalSavedCollections: number;
  };
  databaseUser: {
    id: string;
    name: string;
    email: string;
    username: string | null;
    totalCollections: number;
  } | null;
  error: string | null;
  refetch: () => void;
}

export const useExploreData = (): UseExploreDataReturn => {
  const { user, isLoaded } = useUser();

  // Query for trending collections
  const {
    data: trendingData,
    isLoading: trendingLoading,
    error: trendingError,
  } = useQuery({
    queryKey: ["trending-collections"],
    queryFn: async () => {
      const response = await fetchPublicCollections({
        page: 1,
        limit: 5,
        sortBy: "likes",
      });

      if ("error" in response) {
        throw new Error(response.error);
      }

      return response;
    },
    enabled: isLoaded,
    retry: (failureCount, error) => {
      // Don't retry on rate limit errors
      if (error?.message?.includes("Too many requests")) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Query for recent collections
  const {
    data: recentData,
    isLoading: recentLoading,
    error: recentError,
  } = useQuery({
    queryKey: ["recent-collections"],
    queryFn: async () => {
      const response = await fetchPublicCollections({
        page: 1,
        limit: 6,
        sortBy: "recent",
      });

      if ("error" in response) {
        throw new Error(response.error);
      }

      return response;
    },
    enabled: isLoaded,
    retry: (failureCount, error) => {
      if (error?.message?.includes("Too many requests")) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Query for homepage collections (new collections)
  const {
    data: homepageData,
    isLoading: homepageLoading,
    error: homepageError,
  } = useQuery({
    queryKey: ["homepage-collections"],
    queryFn: getHomepageCollections,
    enabled: isLoaded,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Query for user info (only when authenticated)
  const {
    data: databaseUser,
    isLoading: userInfoLoading,
    error: userInfoError,
  } = useQuery({
    queryKey: ["user-info", user?.id],
    queryFn: getUserInfoAction,
    enabled: isLoaded && !!user,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Query for saved collections (only when authenticated)
  const {
    data: savedData,
    isLoading: savedLoading,
    error: savedError,
  } = useQuery({
    queryKey: ["saved-collections", user?.id],
    queryFn: async () => {
      const response = await fetchSavedCollections({
        page: 1,
        limit: 5,
        sortBy: "recent",
      });

      if ("error" in response) {
        throw new Error(response.error);
      }

      return response;
    },
    enabled: isLoaded && !!user,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Combine loading states
  const isLoading =
    trendingLoading ||
    recentLoading ||
    homepageLoading ||
    (!!user && (userInfoLoading || savedLoading));

  // Combine errors
  const error =
    trendingError?.message ||
    recentError?.message ||
    homepageError?.message ||
    userInfoError?.message ||
    savedError?.message ||
    null;

  // Refetch function for manual refresh
  const refetch = () => {
    // Note: Individual query refetch functions would be used here
    // This is a simplified version
    window.location.reload();
  };

  return {
    trendingCollections: trendingData?.data || [],
    recentCollections: recentData?.data || [],
    savedCollections: savedData?.data || [],
    newCollections: homepageData?.success ? homepageData.data?.new || [] : [],
    isLoading,
    userStats: {
      totalSavedCollections: savedData?.pagination?.total || 0,
    },
    databaseUser: databaseUser || null,
    error,
    refetch,
  };
};
