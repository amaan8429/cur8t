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

const FrontendLinkSchema = z.object({
  title: z.string(),
  url: z.string(),
});

export type Link = z.infer<typeof LinkSchema>;
export type FrontendLink = z.infer<typeof FrontendLinkSchema>;
