import { useQuery } from '@tanstack/react-query';
import { useUser } from '@clerk/nextjs';
import {
  fetchPublicCollections,
  PublicCollection,
} from '@/actions/collection/fetchPublicCollections';
import {
  fetchSavedCollections,
  SavedCollection,
} from '@/actions/collection/fetchSavedCollections';
import {
  getHomepageCollections,
  HomepageCollection,
} from '@/actions/platform/homepageCollections';
import { getUserInfoAction } from '@/actions/user/getUserInfo';
import { showRateLimitToast } from '@/components/ui/rate-limit-toast';
import { toast } from '@/hooks/use-toast';

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
  hasErrors: boolean;
  refetch: () => void;
}

export const useExploreData = (): UseExploreDataReturn => {
  const { user, isLoaded } = useUser();

  // Query for trending collections
  const {
    data: trendingData,
    isLoading: trendingLoading,
    error: trendingError,
    refetch: refetchTrending,
  } = useQuery({
    queryKey: ['trending-collections'],
    queryFn: async () => {
      const response = await fetchPublicCollections({
        page: 1,
        limit: 5,
        sortBy: 'likes',
      });

      if ('error' in response && response.error) {
        // Handle rate limiting with toast instead of throwing
        if (response.error.includes('Too many requests')) {
          showRateLimitToast({
            retryAfter: response.retryAfter,
            message:
              'Trending collections temporarily unavailable due to rate limiting.',
          });
          // Return empty data instead of throwing
          return {
            data: [],
            pagination: { total: 0, totalPages: 0, currentPage: 1, limit: 5 },
          };
        }

        // For other errors, show a toast and return empty data
        toast({
          title: 'Failed to load trending collections',
          description: response.error,
          variant: 'destructive',
          duration: 5000,
        });
        return {
          data: [],
          pagination: { total: 0, totalPages: 0, currentPage: 1, limit: 5 },
        };
      }

      return response;
    },
    enabled: isLoaded,
    retry: (failureCount, error) => {
      // Don't retry on rate limit errors
      if (error?.message?.includes('Too many requests')) {
        return false;
      }
      return failureCount < 2; // Reduced retries
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  // Query for recent collections
  const {
    data: recentData,
    isLoading: recentLoading,
    error: recentError,
    refetch: refetchRecent,
  } = useQuery({
    queryKey: ['recent-collections'],
    queryFn: async () => {
      const response = await fetchPublicCollections({
        page: 1,
        limit: 6,
        sortBy: 'recent',
      });

      if ('error' in response && response.error) {
        if (response.error.includes('Too many requests')) {
          showRateLimitToast({
            retryAfter: response.retryAfter,
            message:
              'Recent collections temporarily unavailable due to rate limiting.',
          });
          return {
            data: [],
            pagination: { total: 0, totalPages: 0, currentPage: 1, limit: 6 },
          };
        }

        toast({
          title: 'Failed to load recent collections',
          description: response.error,
          variant: 'destructive',
          duration: 5000,
        });
        return {
          data: [],
          pagination: { total: 0, totalPages: 0, currentPage: 1, limit: 6 },
        };
      }

      return response;
    },
    enabled: isLoaded,
    retry: (failureCount, error) => {
      if (error?.message?.includes('Too many requests')) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  // Query for homepage collections (new collections)
  const {
    data: homepageData,
    isLoading: homepageLoading,
    error: homepageError,
    refetch: refetchHomepage,
  } = useQuery({
    queryKey: ['homepage-collections'],
    queryFn: async () => {
      try {
        return await getHomepageCollections();
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Unable to load new collections timeline.';
        toast({
          title: 'Failed to load new collections',
          description: errorMessage,
          variant: 'destructive',
          duration: 5000,
        });
        return { success: false, data: null };
      }
    },
    enabled: isLoaded,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  // Query for user info (only when authenticated)
  const {
    data: databaseUser,
    isLoading: userInfoLoading,
    error: userInfoError,
    refetch: refetchUserInfo,
  } = useQuery({
    queryKey: ['user-info', user?.id],
    queryFn: async () => {
      try {
        const result = await getUserInfoAction();

        // Check for rate limiting
        if (result && 'error' in result && 'retryAfter' in result) {
          const { showRateLimitToast } = await import(
            '@/components/ui/rate-limit-toast'
          );
          showRateLimitToast({
            retryAfter: result.retryAfter * 60,
            message: 'Too many user info requests. Please try again later.',
          });
          return null;
        }

        return result;
      } catch (error: unknown) {
        // Don't show toast for user info errors, handle silently
        console.warn('Failed to load user info:', error);
        return null;
      }
    },
    enabled: isLoaded && !!user,
    retry: 1,
    retryDelay: 5000,
  });

  // Query for saved collections (only when authenticated)
  const {
    data: savedData,
    isLoading: savedLoading,
    error: savedError,
    refetch: refetchSaved,
  } = useQuery({
    queryKey: ['saved-collections', user?.id],
    queryFn: async () => {
      const response = await fetchSavedCollections({
        page: 1,
        limit: 5,
        sortBy: 'recent',
      });

      if ('error' in response && response.error) {
        if (response.error.includes('Too many requests')) {
          showRateLimitToast({
            retryAfter: response.retryAfter,
            message:
              'Saved collections temporarily unavailable due to rate limiting.',
          });
          return {
            data: [],
            pagination: { total: 0, totalPages: 0, currentPage: 1, limit: 5 },
          };
        }

        toast({
          title: 'Failed to load saved collections',
          description: response.error,
          variant: 'destructive',
          duration: 5000,
        });
        return {
          data: [],
          pagination: { total: 0, totalPages: 0, currentPage: 1, limit: 5 },
        };
      }

      return response;
    },
    enabled: isLoaded && !!user,
    retry: (failureCount, error) => {
      if (error?.message?.includes('Too many requests')) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  // Combine loading states
  const isLoading =
    trendingLoading ||
    recentLoading ||
    homepageLoading ||
    (!!user && (userInfoLoading || savedLoading));

  // Check if there are any errors (for UI feedback)
  const hasErrors = !!(
    trendingError ||
    recentError ||
    homepageError ||
    userInfoError ||
    savedError
  );

  // Combined refetch function
  const refetch = () => {
    refetchTrending();
    refetchRecent();
    refetchHomepage();
    if (user) {
      refetchUserInfo();
      refetchSaved();
    }
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
    hasErrors,
    refetch,
  };
};
