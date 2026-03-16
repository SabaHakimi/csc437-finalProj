-- Add unit to items (same as recipe ingredients: "", "grams", "milliliters")
ALTER TABLE items ADD COLUMN IF NOT EXISTS unit TEXT NOT NULL DEFAULT '';
