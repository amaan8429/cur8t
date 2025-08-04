"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit, Plus, ExternalLink, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createFavorite } from "@/actions/favorites/createFavorite";
import { getFavorites } from "@/actions/favorites/getFavorites";
import { deleteFavorite } from "@/actions/favorites/deleteFavorite";
import { updateFavorite } from "@/actions/favorites/updateFavorite";

interface Favorite {
  id: string;
  title: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

const FavoritesPage = () => {
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingFavorite, setAddingFavorite] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const result = await getFavorites();
      if (result.success) {
        setFavorites(result.data || []);
      } else {
        // Check if it's a rate limit error
        if (result.retryAfter) {
          toast({
            title: "Rate Limited",
            description: `${result.error} Please try again in ${result.retryAfter} minutes.`,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to load favorites",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load favorites",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddFavorite = async () => {
    if (!newTitle.trim() || !newUrl.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both title and URL",
        variant: "destructive",
      });
      return;
    }

    setAddingFavorite(true);
    try {
      const result = await createFavorite(newTitle.trim(), newUrl.trim());
      if (result.success) {
        toast({
          title: "Success",
          description: "Favorite added successfully",
        });
        setNewTitle("");
        setNewUrl("");
        loadFavorites();
      } else {
        // Check if it's a rate limit error
        if (result.retryAfter) {
          toast({
            title: "Rate Limited",
            description: `${result.error} Please try again in ${result.retryAfter} minutes.`,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to add favorite",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add favorite",
        variant: "destructive",
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
          title: "Success",
          description: "Favorite deleted successfully",
        });
        loadFavorites();
      } else {
        // Check if it's a rate limit error
        if (result.retryAfter) {
          toast({
            title: "Rate Limited",
            description: `${result.error} Please try again in ${result.retryAfter} minutes.`,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to delete favorite",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete favorite",
        variant: "destructive",
      });
    }
  };

  const handleEditFavorite = async (id: string) => {
    if (!editTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await updateFavorite(id, editTitle.trim());
      if (result.success) {
        toast({
          title: "Success",
          description: "Favorite updated successfully",
        });
        setEditingId(null);
        setEditTitle("");
        loadFavorites();
      } else {
        // Check if it's a rate limit error
        if (result.retryAfter) {
          toast({
            title: "Rate Limited",
            description: `${result.error} Please try again in ${result.retryAfter} minutes.`,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to update favorite",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorite",
        variant: "destructive",
      });
    }
  };

  const startEdit = (favorite: Favorite) => {
    setEditingId(favorite.id);
    setEditTitle(favorite.title);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add New Favorite */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Favorite
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                placeholder="Enter a descriptive title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddFavorite()}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="url" className="text-sm font-medium">
                URL
              </label>
              <Input
                id="url"
                placeholder="https://example.com"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddFavorite()}
              />
            </div>
          </div>
          <Button
            onClick={handleAddFavorite}
            disabled={addingFavorite || !newTitle.trim() || !newUrl.trim()}
            className="w-full md:w-auto"
          >
            {addingFavorite ? "Adding..." : "Add Favorite"}
          </Button>
        </CardContent>
      </Card>

      {/* Favorites List */}
      <div className="space-y-4">
        {favorites.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-muted-foreground text-center">
                <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
                <p className="text-sm">
                  Add your first favorite link above to get started
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          favorites.map((favorite) => (
            <Card key={favorite.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {editingId === favorite.id ? (
                      <div className="space-y-2">
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter")
                              handleEditFavorite(favorite.id);
                            if (e.key === "Escape") cancelEdit();
                          }}
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleEditFavorite(favorite.id)}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={cancelEdit}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold truncate">
                            {favorite.title}
                          </h3>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEdit(favorite)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <ExternalLink className="h-4 w-4" />
                          <a
                            href={favorite.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="truncate hover:underline"
                          >
                            {favorite.url}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>Added {formatDate(favorite.createdAt)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteFavorite(favorite.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
