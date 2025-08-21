import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  PiTrash,
  PiPencilSimple,
  PiArrowSquareOut,
  PiCalendar,
} from 'react-icons/pi';
import { Favorite } from '@/types/types';

interface FavoriteCardProps {
  favorite: Favorite;
  editingId: string | null;
  editTitle: string;
  setEditTitle: (title: string) => void;
  onEdit: (id: string) => void;
  onSave: (id: string) => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
  onStartEdit: (favorite: Favorite) => void;
  formatDate: (date: Date) => string;
  VALIDATION_LIMITS: {
    LINK_TITLE_MAX: number;
    LINK_URL_MAX: number;
  };
}

const FavoriteCard: React.FC<FavoriteCardProps> = ({
  favorite,
  editingId,
  editTitle,
  setEditTitle,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onStartEdit,
  formatDate,
  VALIDATION_LIMITS,
}) => {
  const isEditing = editingId === favorite.id;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-3">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onSave(favorite.id);
                    if (e.key === 'Escape') onCancel();
                  }}
                  autoFocus
                  maxLength={VALIDATION_LIMITS.LINK_TITLE_MAX}
                  className="text-sm"
                />
                <div className="text-xs text-muted-foreground">
                  {editTitle.length}/{VALIDATION_LIMITS.LINK_TITLE_MAX}{' '}
                  characters
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => onSave(favorite.id)}>
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold truncate text-base">
                    {favorite.title}
                  </h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onStartEdit(favorite)}
                    className="h-6 w-6 p-0"
                  >
                    <PiPencilSimple className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <PiArrowSquareOut className="h-4 w-4 flex-shrink-0" />
                  <a
                    href={favorite.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate hover:underline text-blue-600 dark:text-blue-400"
                  >
                    {favorite.url}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <PiCalendar className="h-3 w-3 flex-shrink-0" />
                  <span>Added {formatDate(favorite.createdAt)}</span>
                </div>
              </div>
            )}
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(favorite.id)}
            className="text-destructive hover:text-destructive h-8 w-8 p-0"
          >
            <PiTrash className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FavoriteCard;
