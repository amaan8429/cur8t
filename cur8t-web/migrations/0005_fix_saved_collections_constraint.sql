-- Fix saved_collections table constraint
-- First, remove duplicates by keeping only the earliest saved entry for each user-collection pair
WITH duplicates AS (
  SELECT id,
         ROW_NUMBER() OVER (PARTITION BY user_id, collection_id ORDER BY saved_at ASC) as rn
  FROM saved_collections
)
DELETE FROM saved_collections 
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);

-- Remove the incorrect unique constraint on collection_id only
ALTER TABLE "saved_collections" DROP CONSTRAINT IF EXISTS "saved_collections_collection_id_unique";

-- Add the correct composite unique constraint on (user_id, collection_id)
ALTER TABLE "saved_collections" ADD CONSTRAINT "saved_collections_user_id_collection_id_unique" UNIQUE("user_id", "collection_id"); 