import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';

// Define the users table
export const UsersTable = pgTable('users', {
  id: text('id').primaryKey().notNull(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  username: text('username').unique(),
  githubConnected: boolean('github_connected').notNull().default(false),
  APIKeysCount: integer('api_keys_count').notNull().default(0),
  totalCollections: integer('total_collections').notNull().default(0),
  topCollections: text('top_collections').array().default([]).notNull(),
  pinnedCollections: text('pinned_collections').array().default([]).notNull(),

  twitterUsername: text('twitter_username').unique(),
  linkedinUsername: text('linkedin_username').unique(),
  githubUsername: text('github_username').unique(),
  instagramUsername: text('instagram_username').unique(),
  personalWebsite: text('personal_website').unique(),
  bio: text('bio').default(''),
  showSocialLinks: boolean('show_social_links').notNull().default(true),
});

export const APIKeysTable = pgTable('api_keys', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => UsersTable.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  key: text('key').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});

export const GitHubSettingsTable = pgTable('github_settings', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => UsersTable.id, { onDelete: 'cascade' }),
  repoName: text('repo_name').default('bukmarksCollection'),
  githubAccessToken: text('github_access_token').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});

// Define the link_collection table (list group)
export const CollectionsTable = pgTable('collections', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  title: text('title').notNull(),
  likes: integer('likes').default(0).notNull(),
  description: text('description').default('').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => UsersTable.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
  visibility: text('visibility').notNull().default('private'),
  sharedEmails: text('shared_emails').array().default([]).notNull(),
  totalLinks: integer('total_links').default(0).notNull(),
});

// Define the link table (single link)
export const LinksTable = pgTable('links', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  title: text('title').notNull(),
  url: text('url').notNull(),
  linkCollectionId: uuid('link_collection_id')
    .references(() => CollectionsTable.id, { onDelete: 'cascade' })
    .notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => UsersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});

export const SavedCollectionsTable = pgTable(
  'saved_collections',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => UsersTable.id, { onDelete: 'cascade' }),
    collectionId: uuid('collection_id')
      .notNull()
      .references(() => CollectionsTable.id, { onDelete: 'cascade' }),
    savedAt: timestamp('saved_at').notNull().defaultNow(),
  },
  (table) => ({
    // Composite unique constraint: one user can save a collection only once
    userCollectionUnique: unique().on(table.userId, table.collectionId),
  })
);

export const CollectionLikesTable = pgTable('collection_likes', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => UsersTable.id, { onDelete: 'cascade' }),
  collectionId: uuid('collection_id')
    .notNull()
    .references(() => CollectionsTable.id, { onDelete: 'cascade' }),
  likedAt: timestamp('liked_at').notNull().defaultNow(),
});

export const AccessRequestsTable = pgTable(
  'access_requests',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    requesterId: text('requester_id')
      .notNull()
      .references(() => UsersTable.id, { onDelete: 'cascade' }),
    collectionId: uuid('collection_id')
      .notNull()
      .references(() => CollectionsTable.id, { onDelete: 'cascade' }),
    ownerId: text('owner_id')
      .notNull()
      .references(() => UsersTable.id, { onDelete: 'cascade' }),
    message: text('message').default('').notNull(),
    status: text('status').notNull().default('pending'), // pending, approved, denied
    requestedAt: timestamp('requested_at').notNull().defaultNow(),
    respondedAt: timestamp('responded_at'),
  },
  (table) => ({
    // Composite unique constraint: one user can request access to a collection only once
    userCollectionRequestUnique: unique().on(
      table.requesterId,
      table.collectionId
    ),
  })
);

// Define the favorites table for user's important links
export const FavoritesTable = pgTable('favorites', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  title: text('title').notNull(),
  url: text('url').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => UsersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
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

// Infer types for access requests
export type InsertAccessRequest = typeof AccessRequestsTable.$inferInsert;
export type SelectAccessRequest = typeof AccessRequestsTable.$inferSelect;

// Infer types for favorites
export type InsertFavorite = typeof FavoritesTable.$inferInsert;
export type SelectFavorite = typeof FavoritesTable.$inferSelect;
