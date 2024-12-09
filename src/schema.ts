import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users_table", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
});

// listGroup table with id, name, user_id
export const listGroup = pgTable("list_group", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

// single link with id, title, url , user_id, created_at, updated_at
export const linkTable = pgTable("link_table", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
  linkgroupId: integer("link_group_id")
    .references(() => listGroup.id)
    .notNull(),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertPost = typeof linkTable.$inferInsert;
export type SelectPost = typeof linkTable.$inferSelect;

export type InsertListGroup = typeof listGroup.$inferInsert;
export type SelectListGroup = typeof listGroup.$inferSelect;

// //amaan

// listList 1 : react links

// 1. https://reactjs.org/docs/getting-started.html
// 2. https://reactjs.org/docs/create-a-new-react-app.html

// listList 2 : nextjs links

// 1. https://nextjs.org/docs/getting-started
// 2. https://nextjs.org/docs/api-reference/create-next-app

// user : amaan
