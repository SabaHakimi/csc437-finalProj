-- =============================================================================
-- FRESH SCHEMA: run this in Supabase SQL Editor to drop all app tables and
-- recreate them. (Supabase system tables like auth are untouched.)
-- =============================================================================

-- Drop in reverse dependency order (child tables first)
DROP TABLE IF EXISTS recipes;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS users;

-- -----------------------------------------------------------------------------
-- users
-- -----------------------------------------------------------------------------
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- items (inventory per user; no "used" – items are removed or quantity reduced
-- when you "use" them)
-- -----------------------------------------------------------------------------
CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  quantity TEXT NOT NULL DEFAULT '',
  unit TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_items_user_id ON items(user_id);

-- -----------------------------------------------------------------------------
-- recipes (per user; each ingredient has name + quantity so recipes can consume
-- a specific amount of an item)
-- ingredients: JSONB array of objects, e.g.
--   [{"name": "Eggs", "amount": "2", "unit": ""}, {"name": "Flour", "amount": "200", "unit": "grams"}]
-- unit is one of: "" (count/no unit), "grams", "milliliters"
-- This supports flexible quantities (numbers or text like "1/2 cup") and is
-- easy to query/filter in SQL and in the app.
-- -----------------------------------------------------------------------------
CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  ingredients JSONB NOT NULL DEFAULT '[]',
  instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_recipes_user_id ON recipes(user_id);
