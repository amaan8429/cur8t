import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { PiHeart, PiLink, PiCalendar, PiPushPin } from 'react-icons/pi';
import { type Collection } from '@/types/profile';

interface CollectionCardProps {
  collection: Collection;
  isPinned?: boolean;
}

export function CollectionCard({
  collection,
  isPinned = false,
}: CollectionCardProps) {
  return (
    <div
      className={`p-4 border border-border rounded-md hover:bg-muted/50 transition-colors min-h-[120px] flex flex-col ${
        isPinned ? 'border-l-4 border-l-primary' : ''
      }`}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          {isPinned && (
            <PiPushPin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          )}
          <PiLink
            href={`/collection/${collection.id}`}
            className="font-semibold text-foreground hover:text-primary transition-colors truncate"
          >
            {collection.title}
          </PiLink>
          <Badge variant="outline" className="text-xs flex-shrink-0">
            Public
          </Badge>
        </div>

        <div className="mb-3 min-h-[40px] flex items-start">
          {collection.description ? (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {collection.description}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground/60 italic">
              No description provided
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto">
        <div className="flex items-center gap-1 flex-shrink-0">
          <PiLink className="h-3 w-3" />
          <span>{collection.totalLinks} links</span>
        </div>

        {collection.likes > 0 && (
          <div className="flex items-center gap-1 flex-shrink-0">
            <PiHeart className="h-3 w-3" />
            <span>{collection.likes}</span>
          </div>
        )}

        <div className="flex items-center gap-1 flex-shrink-0 ml-auto">
          <PiCalendar className="h-3 w-3" />
          <span className="truncate">
            Updated {new Date(collection.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}
