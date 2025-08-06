'use client';

import React from 'react';
import { useFavorites } from '@/hooks/useFavorites';
import AddFavoriteForm from './AddFavoriteForm';
import FavoriteCard from './FavoriteCard';
import FavoritesLoadingSkeleton from './FavoritesLoadingSkeleton';
import FavoritesEmptyState from './FavoritesEmptyState';

const FavoritesPage = () => {
  const {
    favorites,
    loading,
    addingFavorite,
    editingId,
    newTitle,
    newUrl,
    editTitle,
    FAVORITES_LIMIT,
    VALIDATION_LIMITS,
    setNewTitle,
    setNewUrl,
    setEditTitle,
    handleAddFavorite,
    handleDeleteFavorite,
    handleEditFavorite,
    startEdit,
    cancelEdit,
    formatDate,
  } = useFavorites();

  if (loading) {
    return <FavoritesLoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <AddFavoriteForm
        newTitle={newTitle}
        newUrl={newUrl}
        setNewTitle={setNewTitle}
        setNewUrl={setNewUrl}
        onAdd={handleAddFavorite}
        addingFavorite={addingFavorite}
        favoritesCount={favorites.length}
        favoritesLimit={FAVORITES_LIMIT}
        VALIDATION_LIMITS={VALIDATION_LIMITS}
      />

      <div className="space-y-4">
        {favorites.length === 0 ? (
          <FavoritesEmptyState />
        ) : (
          favorites.map((favorite) => (
            <FavoriteCard
              key={favorite.id}
              favorite={favorite}
              editingId={editingId}
              editTitle={editTitle}
              setEditTitle={setEditTitle}
              onEdit={handleEditFavorite}
              onSave={handleEditFavorite}
              onCancel={cancelEdit}
              onDelete={handleDeleteFavorite}
              onStartEdit={startEdit}
              formatDate={formatDate}
              VALIDATION_LIMITS={VALIDATION_LIMITS}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
