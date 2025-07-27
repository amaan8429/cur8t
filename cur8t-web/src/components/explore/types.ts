export type CollectionWithAuthor = {
  id: string;
  title: string;
  author: string;
  authorUsername: string | null;
  likes: number;
  description: string;
  userId: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  visibility: string;
  sharedEmails: string[];
  totalLinks: number;
};
