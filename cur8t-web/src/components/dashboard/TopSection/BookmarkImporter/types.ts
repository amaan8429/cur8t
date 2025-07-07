// Types shared across BookmarkImporter components

export type Step = "upload" | "analyze" | "preview" | "create" | "complete";

export interface BookmarkLink {
  url: string;
  title: string;
  description?: string;
  favicon?: string;
  added_date?: string;
  folder_path?: string[];
}

export interface BookmarkCategory {
  name: string;
  description?: string;
  suggested_collection_name?: string;
  keywords: string[];
  confidence_score: number;
  bookmarks: BookmarkLink[];
}

export interface EnhancedCategory extends Omit<BookmarkCategory, "bookmarks"> {
  bookmarks: BookmarkLink[];
}

export interface CreatedCollection {
  id: string;
  title: string;
  linksCount: number;
}

export interface BookmarkImporterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
