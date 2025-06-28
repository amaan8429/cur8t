"use server";

import { db } from "@/db";
import { CollectionsTable } from "@/schema";
import { eq, ilike, or } from "drizzle-orm";
import { Collection } from "@/types/types";

// Define categories with their keywords
const CATEGORIES = {
  development: {
    name: "Development",
    keywords: [
      "development",
      "programming",
      "coding",
      "code",
      "dev",
      "software",
      "web dev",
      "frontend",
      "backend",
      "fullstack",
      "javascript",
      "react",
      "node",
      "python",
      "api",
      "github",
      "git",
    ],
    description: "Programming and development resources",
  },
  design: {
    name: "Design",
    keywords: [
      "design",
      "ui",
      "ux",
      "figma",
      "sketch",
      "adobe",
      "creative",
      "graphics",
      "visual",
      "branding",
      "logo",
      "typography",
      "color",
      "layout",
      "interface",
    ],
    description: "Design inspiration and resources",
  },
  tools: {
    name: "Tools & Utilities",
    keywords: [
      "tools",
      "utilities",
      "productivity",
      "workflow",
      "automation",
      "app",
      "software",
      "extension",
      "plugin",
      "chrome",
      "vscode",
      "notion",
    ],
    description: "Useful tools and utilities",
  },
  learning: {
    name: "Learning",
    keywords: [
      "tutorial",
      "course",
      "learning",
      "education",
      "guide",
      "documentation",
      "docs",
      "reference",
      "how to",
      "tips",
      "tricks",
      "best practices",
    ],
    description: "Educational content and tutorials",
  },
  business: {
    name: "Business",
    keywords: [
      "business",
      "startup",
      "entrepreneurship",
      "marketing",
      "sales",
      "finance",
      "management",
      "strategy",
      "growth",
      "seo",
      "analytics",
    ],
    description: "Business and entrepreneurship",
  },
  news: {
    name: "News & Articles",
    keywords: [
      "news",
      "article",
      "blog",
      "medium",
      "newsletter",
      "update",
      "announcement",
      "trend",
      "industry",
      "tech news",
    ],
    description: "News and articles",
  },
};

export async function getCategorizedCollections() {
  try {
    const categorizedCollections: Record<string, Collection[]> = {};

    // Fetch collections for each category
    for (const [key, category] of Object.entries(CATEGORIES)) {
      const collections = await db
        .select({
          id: CollectionsTable.id,
          title: CollectionsTable.title,
          author: CollectionsTable.author,
          likes: CollectionsTable.likes,
          description: CollectionsTable.description,
          userId: CollectionsTable.userId,
          url: CollectionsTable.url,
          createdAt: CollectionsTable.createdAt,
          updatedAt: CollectionsTable.updatedAt,
          visibility: CollectionsTable.visibility,
          sharedEmails: CollectionsTable.sharedEmails,
          totalLinks: CollectionsTable.totalLinks,
        })
        .from(CollectionsTable)
        .where(
          or(
            eq(CollectionsTable.visibility, "public"),
            ...category.keywords.map((keyword) =>
              or(
                ilike(CollectionsTable.title, `%${keyword}%`),
                ilike(CollectionsTable.description, `%${keyword}%`)
              )
            )
          )
        )
        .limit(6);

      // Filter collections that actually match the keywords and are public
      const filteredCollections = collections.filter((collection) => {
        const isPublic = collection.visibility === "public";
        const titleLower = collection.title.toLowerCase();
        const descLower = collection.description.toLowerCase();

        const hasKeyword = category.keywords.some(
          (keyword) =>
            titleLower.includes(keyword.toLowerCase()) ||
            descLower.includes(keyword.toLowerCase())
        );

        return isPublic && hasKeyword;
      });

      if (filteredCollections.length > 0) {
        categorizedCollections[key] = filteredCollections.slice(
          0,
          6
        ) as Collection[];
      }
    }

    return {
      success: true,
      data: {
        categories: CATEGORIES,
        collections: categorizedCollections,
      },
    };
  } catch (error) {
    console.error("Error fetching categorized collections:", error);
    return {
      error: "Failed to fetch categorized collections",
    };
  }
}
