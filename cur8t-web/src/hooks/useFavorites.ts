'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createFavorite } from '@/actions/favorites/createFavorite';
import { getFavorites } from '@/actions/favorites/getFavorites';
import { deleteFavorite } from '@/actions/favorites/deleteFavorite';
import { updateFavorite } from '@/actions/favorites/updateFavorite';
import { useSubscriptionStatus } from '@/hooks/useSubscription';
import { VALIDATION_LIMITS } from '@/types/types';

interface Favorite {
  id: string;
  title: string;
  url: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export const useFavorites = () => {
  const { toast } = useToast();
  const { data: subscription } = useSubscriptionStatus();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingFavorite, setAddingFavorite] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [editTitle, setEditTitle] = useState('');

  // Get actual subscription limits instead of hardcoded values
  const FAVORITES_LIMIT = subscription?.limits?.favorites || 5; // Default to 5 if no subscription data

  const loadFavorites = async () => {
    try {
      const result = await getFavorites();
      if (result.success) {
        setFavorites(result.data || []);
      } else {
        if (result.retryAfter) {
          toast({
            title: 'Rate Limited',
            description: `${result.error} Please try again in ${result.retryAfter} minutes.`,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Error',
            description: result.error || 'Failed to load favorites',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load favorites',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const validateInputs = (title: string, url: string) => {
    if (!title.trim() || !url.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in both title and URL',
        variant: 'destructive',
      });
      return false;
    }

    if (favorites.length >= FAVORITES_LIMIT) {
      toast({
        title: 'Limit Reached',
        description: `You can only have up to ${FAVORITES_LIMIT} favorites on your current plan. Please delete some before adding new ones or upgrade your plan.`,
        variant: 'destructive',
      });
      return false;
    }

    if (title.trim().length > VALIDATION_LIMITS.LINK_TITLE_MAX) {
      toast({
        title: 'Title Too Long',
        description: `Title must be at most ${VALIDATION_LIMITS.LINK_TITLE_MAX} characters long.`,
        variant: 'destructive',
      });
      return false;
    }

    if (url.trim().length > VALIDATION_LIMITS.LINK_URL_MAX) {
      toast({
        title: 'URL Too Long',
        description: `URL must be at most ${VALIDATION_LIMITS.LINK_URL_MAX} characters long.`,
        variant: 'destructive',
      });
      return false;
    }

    try {
      new URL(url.trim());
    } catch {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid URL (e.g., https://example.com)',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleAddFavorite = async () => {
    if (!validateInputs(newTitle, newUrl)) return;

    setAddingFavorite(true);
    try {
      const result = await createFavorite(newTitle.trim(), newUrl.trim());
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Favorite added successfully',
        });
        setNewTitle('');
        setNewUrl('');
        loadFavorites();
      } else {
        if (result.retryAfter) {
          toast({
            title: 'Rate Limited',
            description: `${result.error} Please try again in ${result.retryAfter} minutes.`,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Error',
            description: result.error || 'Failed to add favorite',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add favorite',
        variant: 'destructive',
      });
    } finally {
      setAddingFavorite(false);
    }
  };

  const handleDeleteFavorite = async (id: string) => {
    try {
      const result = await deleteFavorite(id);
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Favorite deleted successfully',
        });
        loadFavorites();
      } else {
        if (result.retryAfter) {
          toast({
            title: 'Rate Limited',
            description: `${result.error} Please try again in ${result.retryAfter} minutes.`,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Error',
            description: result.error || 'Failed to delete favorite',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete favorite',
        variant: 'destructive',
      });
    }
  };

  const handleEditFavorite = async (id: string) => {
    if (!editTitle.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a title',
        variant: 'destructive',
      });
      return;
    }

    if (editTitle.trim().length > VALIDATION_LIMITS.LINK_TITLE_MAX) {
      toast({
        title: 'Title Too Long',
        description: `Title must be at most ${VALIDATION_LIMITS.LINK_TITLE_MAX} characters long.`,
        variant: 'destructive',
      });
      return;
    }

    try {
      const result = await updateFavorite(id, editTitle.trim());
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Favorite updated successfully',
        });
        setEditingId(null);
        setEditTitle('');
        loadFavorites();
      } else {
        if (result.retryAfter) {
          toast({
            title: 'Rate Limited',
            description: `${result.error} Please try again in ${result.retryAfter} minutes.`,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Error',
            description: result.error || 'Failed to update favorite',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update favorite',
        variant: 'destructive',
      });
    }
  };

  const startEdit = (favorite: Favorite) => {
    setEditingId(favorite.id);
    setEditTitle(favorite.title);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  return {
    // State
    favorites,
    loading,
    addingFavorite,
    editingId,
    newTitle,
    newUrl,
    editTitle,
    FAVORITES_LIMIT,
    VALIDATION_LIMITS,

    // Actions
    setNewTitle,
    setNewUrl,
    setEditTitle,
    handleAddFavorite,
    handleDeleteFavorite,
    handleEditFavorite,
    startEdit,
    cancelEdit,
    formatDate,
  };
};
