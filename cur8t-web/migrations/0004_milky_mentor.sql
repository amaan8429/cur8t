ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "twitter_username" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "linkedin_username" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "github_username" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "instagram_username" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "personal_website" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "bio" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "show_social_links" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "collections" DROP COLUMN IF EXISTS "author";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_twitter_username_unique" UNIQUE("twitter_username");
EXCEPTION WHEN duplicate_object THEN null WHEN duplicate_table THEN null; END $$;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_linkedin_username_unique" UNIQUE("linkedin_username");
EXCEPTION WHEN duplicate_object THEN null WHEN duplicate_table THEN null; END $$;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_github_username_unique" UNIQUE("github_username");
EXCEPTION WHEN duplicate_object THEN null WHEN duplicate_table THEN null; END $$;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_instagram_username_unique" UNIQUE("instagram_username");
EXCEPTION WHEN duplicate_object THEN null WHEN duplicate_table THEN null; END $$;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_personal_website_unique" UNIQUE("personal_website");
EXCEPTION WHEN duplicate_object THEN null WHEN duplicate_table THEN null; END $$;