-- Run this in Supabase SQL Editor to:
-- 1. Convert recipes.ingredients from TEXT[] to JSONB (if needed)
-- 2. Make recipes per-user (add user_id)

-- Step 1: Convert ingredients from TEXT[] to JSONB (run only if ingredients is currently TEXT[])
-- If you get "type ... cannot be cast automatically", the column is already JSONB; skip this block.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'recipes' AND column_name = 'ingredients'
  ) AND (
    SELECT data_type FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'recipes' AND column_name = 'ingredients'
  ) = 'ARRAY' THEN
    ALTER TABLE recipes
      ALTER COLUMN ingredients TYPE JSONB
      USING (
        COALESCE(
          (SELECT jsonb_agg(jsonb_build_object('name', elem, 'quantity', ''))
           FROM unnest(ingredients) AS elem),
          '[]'::jsonb
        )
      );
    RAISE NOTICE 'ingredients converted from TEXT[] to JSONB';
  ELSE
    RAISE NOTICE 'ingredients left unchanged (already JSONB or column missing)';
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'ingredients conversion skipped: %', SQLERRM;
END $$;

-- Step 2: Add user_id to recipes (nullable first so we can backfill)
ALTER TABLE recipes
  ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;

-- Step 3: Assign existing recipes to the first user
UPDATE recipes
SET user_id = (SELECT id FROM users ORDER BY id ASC LIMIT 1)
WHERE user_id IS NULL;

-- Step 4: Make user_id required (only if no NULLs remain)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM recipes WHERE user_id IS NULL) THEN
    ALTER TABLE recipes ALTER COLUMN user_id SET NOT NULL;
    RAISE NOTICE 'user_id set to NOT NULL';
  ELSE
    RAISE NOTICE 'user_id still nullable (some rows have no user); add a user and run the UPDATE again';
  END IF;
END $$;

-- Step 5: Index for listing a user's recipes
CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON recipes(user_id);
