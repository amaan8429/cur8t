export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  bio?: string;
  twitterUsername?: string;
  linkedinUsername?: string;
  githubUsername?: string;
  instagramUsername?: string;
  personalWebsite?: string;
  showSocialLinks?: boolean;
  pinnedCollections?: string[];
  totalCollections?: number;
}

export interface Collection {
  id: string;
  title: string;
  description: string;
  author: string;
  likes: number;
  totalLinks: number;
  userId: string;
  visibility: string;
  sharedEmails: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type SortOption = "recent" | "likes" | "links" | "alphabetical";
