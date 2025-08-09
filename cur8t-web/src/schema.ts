import {
  boolean,
  integer,
  jsonb,
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

// Subscription plans table (no AI token fields yet)
export const PlansTable = pgTable(
  'plans',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    name: text('name').notNull(),
    slug: text('slug').notNull(), // e.g., free, pro-monthly, business-yearly
    productId: text('product_id'), // Lemon Squeezy product ID (nullable until Step 1)
    variantId: text('variant_id'), // Lemon Squeezy variant ID (nullable until Step 1)
    interval: text('interval').notNull(), // none | month | year
    priceCents: integer('price_cents').notNull().default(0),
    limits: jsonb('limits').notNull(), // { collections, linksPerCollection, totalLinks, favorites, topCollections }
    sort: integer('sort').notNull().default(0),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    slugUnique: unique().on(table.slug),
  })
);

// User subscriptions (no token usage fields yet)
export const SubscriptionsTable = pgTable('subscriptions', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => UsersTable.id, { onDelete: 'cascade' }),
  storeCustomerId: text('store_customer_id'), // Lemon Squeezy customer ID (nullable until Step 1)
  subscriptionId: text('subscription_id'), // Lemon Squeezy subscription ID (nullable until Step 1)
  productId: text('product_id'),
  variantId: text('variant_id'),
  status: text('status').notNull().default('none'), // trialing | active | past_due | canceled | unpaid | none
  currentPeriodStart: timestamp('current_period_start'),
  currentPeriodEnd: timestamp('current_period_end'),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').notNull().default(false),
  trialEnd: timestamp('trial_end'),
  billingAnchor: timestamp('billing_anchor'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});

// Lemon Squeezy webhook events (for idempotency and auditing)
export const LemonSqueezyEventsTable = pgTable('lemonsqueezy_events', {
  eventId: text('event_id').primaryKey().notNull(),
  type: text('type').notNull(),
  payloadHash: text('payload_hash').notNull(),
  receivedAt: timestamp('received_at').notNull().defaultNow(),
  processedAt: timestamp('processed_at'),
  status: text('status').notNull().default('received'), // received | processed | failed
  error: text('error'),
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

// Infer types for plans
export type InsertPlan = typeof PlansTable.$inferInsert;
export type SelectPlan = typeof PlansTable.$inferSelect;

// Infer types for subscriptions
export type InsertSubscription = typeof SubscriptionsTable.$inferInsert;
export type SelectSubscription = typeof SubscriptionsTable.$inferSelect;

// Infer types for Lemon Squeezy events
export type InsertLemonSqueezyEvent =
  typeof LemonSqueezyEventsTable.$inferInsert;
export type SelectLemonSqueezyEvent =
  typeof LemonSqueezyEventsTable.$inferSelect;
