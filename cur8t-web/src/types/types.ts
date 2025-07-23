import { z } from "zod";

const LinkSchema = z.object({
  id: z.string(),
  userId: z.string(),
  url: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  title: z.string(),
  linkCollectionId: z.string(),
});

const CollectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  likes: z.number(),
  description: z.string(),
  userId: z.string(),
  url: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  visibility: z.string(),
  sharedEmails: z.array(z.string()).default([]),
  totalLinks: z.number(),
});

export const FrontendLinkSchema = z.object({
  title: z
    .string()
    .max(100, {
      message: "Title must be at most 100 characters long",
    })
    .optional(),
  url: z.string().trim().url(),
});

export type Link = z.infer<typeof LinkSchema>;
export type FrontendLink = z.infer<typeof FrontendLinkSchema>;
export type Collection = z.infer<typeof CollectionSchema>;
