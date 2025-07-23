ALTER TABLE "users" ADD COLUMN "twitter_username" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "linkedin_username" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "github_username" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "instagram_username" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "personal_website" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "bio" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "show_social_links" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "collections" DROP COLUMN IF EXISTS "author";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_twitter_username_unique" UNIQUE("twitter_username");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_linkedin_username_unique" UNIQUE("linkedin_username");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_github_username_unique" UNIQUE("github_username");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_instagram_username_unique" UNIQUE("instagram_username");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_personal_website_unique" UNIQUE("personal_website");