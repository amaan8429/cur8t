-- Fix saved_collections table constraint
-- Remove the incorrect unique constraint on collection_id only
ALTER TABLE "saved_collections" DROP CONSTRAINT IF EXISTS "saved_collections_collection_id_unique";

-- Add the correct composite unique constraint on (user_id, collection_id)
ALTER TABLE "saved_collections" ADD CONSTRAINT "saved_collections_user_id_collection_id_unique" UNIQUE("user_id", "collection_id"); 