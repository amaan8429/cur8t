import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// Define the users table
export const UsersTable = pgTable("users", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  githubConnected: boolean("github_connected").notNull().default(false),
  APIKeysCount: integer("api_keys_count").notNull().default(0),
  totalCollections: integer("total_collections").notNull().default(0),
});

export const APIKeysTable = pgTable("api_keys", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => UsersTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  key: text("key").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const GitHubSettingsTable = pgTable("github_settings", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => UsersTable.id, { onDelete: "cascade" }),
  repoName: text("repo_name").default("bukmarksCollection"),
  githubAccessToken: text("github_access_token").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

// Define the link_collection table (list group)
export const CollectionsTable = pgTable("collections", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  likes: integer("likes").default(0).notNull(),
  description: text("description").default("").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => UsersTable.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
  visibility: text("visibility").notNull().default("private"),
  sharedEmails: text("shared_emails").array().default([]).notNull(),
  totalLinks: integer("total_links").default(0).notNull(),
});

// Define the link table (single link)
export const LinksTable = pgTable("links", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  linkCollectionId: uuid("link_collection_id")
    .references(() => CollectionsTable.id, { onDelete: "cascade" })
    .notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => UsersTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const SavedCollectionsTable = pgTable("saved_collections", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => UsersTable.id, { onDelete: "cascade" }),
  collectionId: uuid("collection_id")
    .notNull()
    .unique()
    .references(() => CollectionsTable.id, { onDelete: "cascade" }),
  savedAt: timestamp("saved_at").notNull().defaultNow(),
});

export const CollectionLikesTable = pgTable("collection_likes", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => UsersTable.id, { onDelete: "cascade" }),
  collectionId: uuid("collection_id")
    .notNull()
    .references(() => CollectionsTable.id, { onDelete: "cascade" }),
  likedAt: timestamp("liked_at").notNull().defaultNow(),
});

// Infer types for users
export type InsertUser = typeof UsersTable.$inferInsert;
export type SelectUser = typeof UsersTable.$inferSelect;

// Infer types for link collections
export type InsertLinkCollection = typeof CollectionsTable.$inferInsert;
export type SelectLinkCollection = typeof CollectionsTable.$inferSelect;

// Infer types for links
export type InsertLink = typeof LinksTable.$inferInsert;
export type SelectLink = typeof LinksTable.$inferSelect;

// Infer types for bookmarked collections
export type InsertSavedCollection = typeof SavedCollectionsTable.$inferInsert;
export type SelectSavedCollection = typeof SavedCollectionsTable.$inferSelect;

// Infer types for collection likes
export type InsertCollectionLike = typeof CollectionLikesTable.$inferInsert;
export type SelectCollectionLike = typeof CollectionLikesTable.$inferSelect;
