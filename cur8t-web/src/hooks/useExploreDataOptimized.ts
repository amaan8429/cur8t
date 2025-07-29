import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { getUserInfoAction } from "@/actions/user/getUserInfo";
import { showRateLimitToast } from "@/components/ui/rate-limit-toast";
import { toast } from "@/hooks/use-toast";
import {
  getExploreData,
  ExploreDataResponse,
  ExploreCollection,
} from "@/actions/platform/exploreData";

export interface UseExploreDataReturn {
  // Collections data
  trendingCollections: ExploreCollection[];
  recentCollections: ExploreCollection[];
  savedCollections: ExploreCollection[];
  newCollections: ExploreCollection[];

  // Loading states (progressive)
  isMainDataLoading: boolean;
  isUserDataLoading: boolean;
  isFullyLoaded: boolean;

  // User data
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

  // Error handling
  hasErrors: boolean;
  refetch: () => void;
}

export const useExploreDataOptimized = (): UseExploreDataReturn => {
  const { user, isLoaded } = useUser();

  // Main explore data query (public data + saved collections if authenticated)
  const {
    data: exploreData,
    isLoading: mainDataLoading,
    error: exploreError,
    refetch: refetchExplore,
  } = useQuery({
    queryKey: ["explore-data", user?.id],
    queryFn: async (): Promise<{
      trending: ExploreCollection[];
      recent: ExploreCollection[];
      newCollections: ExploreCollection[];
      savedCollections: ExploreCollection[];
      userStats: { totalSavedCollections: number };
    }> => {
      const response = await getExploreData();

      if ("error" in response) {
        if (response.error.includes("Too many requests")) {
          showRateLimitToast({
            retryAfter: response.retryAfter || 60,
            message:
              "Explore data temporarily unavailable due to rate limiting.",
          });
          // Return empty data structure instead of throwing
          return {
            trending: [],
            recent: [],
            newCollections: [],
            savedCollections: [],
            userStats: { totalSavedCollections: 0 },
          };
        }

        toast({
          title: "Failed to load explore data",
          description: response.error,
          variant: "destructive",
          duration: 5000,
        });

        return {
          trending: [],
          recent: [],
          newCollections: [],
          savedCollections: [],
          userStats: { totalSavedCollections: 0 },
        };
      }

      return {
        trending: response.data.trending || [],
        recent: response.data.recent || [],
        newCollections: response.data.newCollections || [],
        savedCollections: response.data.savedCollections || [],
        userStats: response.data.userStats || { totalSavedCollections: 0 },
      };
    },
    enabled: isLoaded,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: (failureCount, error) => {
      if (error?.message?.includes("Too many requests")) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    refetchOnWindowFocus: false, // Prevent refetch on window focus for better UX
  });

  // User info query (only when authenticated) - separate to enable progressive loading
  const {
    data: databaseUser,
    isLoading: userInfoLoading,
    error: userInfoError,
    refetch: refetchUserInfo,
  } = useQuery({
    queryKey: ["user-info", user?.id],
    queryFn: async (): Promise<{
      id: string;
      name: string;
      email: string;
      username: string | null;
      totalCollections: number;
    } | null> => {
      try {
        const result = await getUserInfoAction();

        if (result && "error" in result && "retryAfter" in result) {
          showRateLimitToast({
            retryAfter: result.retryAfter * 60,
            message: "Too many user info requests. Please try again later.",
          });
          return null;
        }

        return result;
      } catch (error: unknown) {
        console.warn("Failed to load user info:", error);
        return null;
      }
    },
    enabled: isLoaded && !!user,
    staleTime: 10 * 60 * 1000, // 10 minutes - user info changes less frequently
    gcTime: 15 * 60 * 1000, // 15 minutes (formerly cacheTime)
    retry: 1,
    retryDelay: 5000,
    refetchOnWindowFocus: false,
  });

  // Progressive loading states
  const isMainDataLoading = mainDataLoading;
  const isUserDataLoading = !!user && userInfoLoading;
  const isFullyLoaded = !isMainDataLoading && (!user || !isUserDataLoading);

  // Check for errors
  const hasErrors = !!(exploreError || userInfoError);

  // Combined refetch function
  const refetch = () => {
    refetchExplore();
    if (user) {
      refetchUserInfo();
    }
  };

  return {
    // Collections data with fallbacks
    trendingCollections: exploreData?.trending || [],
    recentCollections: exploreData?.recent || [],
    savedCollections: exploreData?.savedCollections || [],
    newCollections: exploreData?.newCollections || [],

    // Progressive loading states
    isMainDataLoading,
    isUserDataLoading,
    isFullyLoaded,

    // User data
    userStats: exploreData?.userStats || { totalSavedCollections: 0 },
    databaseUser: databaseUser || null,

    // Error handling
    hasErrors,
    refetch,
  };
};
