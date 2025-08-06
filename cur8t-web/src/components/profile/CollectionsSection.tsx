import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PiPushPin, PiUser, PiCaretLeft, PiCaretRight } from 'react-icons/pi';
import { CollectionCard } from './CollectionCard';
import { type Collection, type SortOption } from '@/types/profile';

interface CollectionsSectionProps {
  pinnedCollections: Collection[];
  unpinnedCollections: Collection[];
  sortBy: SortOption;
  setSortBy: (sortBy: SortOption) => void;
}

const ITEMS_PER_PAGE = 6;

export function CollectionsSection({
  pinnedCollections,
  unpinnedCollections,
  sortBy,
  setSortBy,
}: CollectionsSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Apply sorting
  const sortedCollections = [...unpinnedCollections].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      case 'likes':
        return b.likes - a.likes;
      case 'links':
        return b.totalLinks - a.totalLinks;
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedCollections.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCollections = sortedCollections.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // Reset to first page when sorting changes
  const handleSortChange = (value: SortOption) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  return (
    <div className="flex-1">
      {/* Pinned Collections */}
      {pinnedCollections.length > 0 && (
        <section className="mb-8">
          <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <PiPushPin className="h-4 w-4" />
            Pinned
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pinnedCollections.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                isPinned={true}
              />
            ))}
          </div>
        </section>
      )}

      {/* Collections Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">
            Repositories
          </h2>

          {/* Sort Options */}
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-36 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently updated</SelectItem>
              <SelectItem value="likes">Most liked</SelectItem>
              <SelectItem value="links">Most links</SelectItem>
              <SelectItem value="alphabetical">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {sortedCollections.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="text-center py-12">
              <PiUser className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-base font-medium text-foreground mb-2">
                No public repositories
              </h3>
              <p className="text-sm text-muted-foreground">
                This user hasn&apos;t made any collections public yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Collections List */}
            <div className="space-y-4">
              {paginatedCollections.map((collection) => (
                <CollectionCard key={collection.id} collection={collection} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  <PiCaretLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8"
                      >
                        {page}
                      </Button>
                    )
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                  <PiCaretRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
