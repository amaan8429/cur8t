import { z } from "zod";

// Define consistent length limits
export const VALIDATION_LIMITS = {
  COLLECTION_NAME_MAX: 100,
  COLLECTION_DESCRIPTION_MAX: 500,
  LINK_TITLE_MAX: 200,
  LINK_URL_MAX: 2048,
} as const;

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
    .max(VALIDATION_LIMITS.LINK_TITLE_MAX, {
      message: `Title must be at most ${VALIDATION_LIMITS.LINK_TITLE_MAX} characters long`,
    })
    .optional(),
  url: z
    .string()
    .trim()
    .url({
      message: "Please enter a valid URL",
    })
    .max(VALIDATION_LIMITS.LINK_URL_MAX, {
      message: `URL must be at most ${VALIDATION_LIMITS.LINK_URL_MAX} characters long`,
    }),
});

export const FrontendCollectionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, {
      message: "Collection name is required",
    })
    .max(VALIDATION_LIMITS.COLLECTION_NAME_MAX, {
      message: `Collection name must be at most ${VALIDATION_LIMITS.COLLECTION_NAME_MAX} characters long`,
    }),
  description: z
    .string()
    .max(VALIDATION_LIMITS.COLLECTION_DESCRIPTION_MAX, {
      message: `Description must be at most ${VALIDATION_LIMITS.COLLECTION_DESCRIPTION_MAX} characters long`,
    })
    .optional()
    .default(""),
});

export type Link = z.infer<typeof LinkSchema>;
export type FrontendLink = z.infer<typeof FrontendLinkSchema>;
export type FrontendCollection = z.infer<typeof FrontendCollectionSchema>;
export type Collection = z.infer<typeof CollectionSchema>;
