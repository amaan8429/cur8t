import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Define the users table
export const usersTable = pgTable("users", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
});

// Define the link_collection table (list group)
export const linkCollectionTable = pgTable("link_collection", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: text("name").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
  visibility: text("visibility").notNull().default("private"),
});

// Define the link table (single link)
export const linkTable = pgTable("link", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  linkCollectionId: uuid("link_collection_id")
    .references(() => linkCollectionTable.id)
    .notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

// Infer types for users
export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

// Infer types for link collections
export type InsertLinkCollection = typeof linkCollectionTable.$inferInsert;
export type SelectLinkCollection = typeof linkCollectionTable.$inferSelect;

// Infer types for links
export type InsertLink = typeof linkTable.$inferInsert;
export type SelectLink = typeof linkTable.$inferSelect;
