import * as db from "./db.js";

export const getItems = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM items WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const VALID_UNITS = ["", "grams", "milliliters"];

export const addItem = async (req, res) => {
  const { name, location, quantity, unit } = req.body;
  if (!name || !location) {
    return res.status(400).json({ error: "Name and location are required" });
  }
  const unitVal = unit != null && VALID_UNITS.includes(String(unit).trim()) ? String(unit).trim() : "";
  const quantityStr = quantity != null ? String(quantity).trim() : "";

  try {
    const existing = await db.query(
      "SELECT * FROM items WHERE user_id = $1 AND LOWER(TRIM(name)) = LOWER(TRIM($2)) AND location = $3 AND unit = $4",
      [req.user.userId, name.trim(), location, unitVal]
    );

    if (existing.rowCount > 0) {
      const item = existing.rows[0];
      const existingQty = String(item.quantity || "").trim();
      const existingNum = Number.parseFloat(existingQty, 10);
      const newNum = Number.parseFloat(quantityStr, 10);
      const bothNumeric = !Number.isNaN(existingNum) && !Number.isNaN(newNum);

      const newQuantity = bothNumeric ? String(existingNum + newNum) : quantityStr || existingQty;

      const result = await db.query(
        "UPDATE items SET quantity = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
        [newQuantity, item.id, req.user.userId]
      );
      return res.status(200).json(result.rows[0]);
    }

    const result = await db.query(
      "INSERT INTO items (user_id, name, location, quantity, unit) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [req.user.userId, name, location, quantityStr, unitVal]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const useItem = async (req, res) => {
  const { id } = req.params;
  const { quantityUsed } = req.body;

  try {
    const getResult = await db.query(
      "SELECT * FROM items WHERE id = $1 AND user_id = $2",
      [id, req.user.userId]
    );
    if (getResult.rowCount === 0) {
      return res.status(404).json({ error: "Item not found" });
    }
    const item = getResult.rows[0];
    const qtyNum = Number.parseFloat(String(item.quantity).trim(), 10);
    const useNum = quantityUsed != null && String(quantityUsed).trim() !== ""
      ? Number.parseFloat(String(quantityUsed).trim(), 10)
      : null;

    const useAll = useNum === null || Number.isNaN(useNum);
    const canDeduct = !Number.isNaN(qtyNum) && !useAll && useNum > 0;

    if (canDeduct && useNum > qtyNum) {
      return res.status(400).json({
        error: `Cannot use more than available. You have ${qtyNum}, tried to use ${useNum}.`,
      });
    }

    if (canDeduct && qtyNum > useNum) {
      const newQty = qtyNum - useNum;
      const result = await db.query(
        "UPDATE items SET quantity = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
        [String(newQty), id, req.user.userId]
      );
      return res.json(result.rows[0]);
    }

    if (canDeduct && qtyNum <= useNum) {
      await db.query("DELETE FROM items WHERE id = $1 AND user_id = $2", [id, req.user.userId]);
      return res.json({ deleted: true, id: item.id });
    }

    await db.query("DELETE FROM items WHERE id = $1 AND user_id = $2", [id, req.user.userId]);
    return res.json({ deleted: true, id: item.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getRecipes = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM recipes WHERE user_id = $1 ORDER BY name ASC",
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addRecipe = async (req, res) => {
  const { name, ingredients, instructions } = req.body;
  if (!name || !Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({ error: "Name and at least one ingredient are required" });
  }

  const ALLOWED_UNITS = ["", "grams", "milliliters"];
  const normalized = ingredients
    .map((i) => {
      if (typeof i !== "object" || i === null || !("name" in i)) return null;
      const name = String(i.name).trim();
      if (!name) return null;
      const amount = i.amount != null ? String(i.amount).trim() : "";
      let unit = i.unit != null ? String(i.unit).trim().toLowerCase() : "";
      if (!ALLOWED_UNITS.includes(unit)) unit = "";
      return { name, amount, unit };
    })
    .filter(Boolean);

  if (normalized.length === 0) {
    return res.status(400).json({ error: "Valid ingredients (name + amount + unit) are required" });
  }

  try {
    const result = await db.query(
      "INSERT INTO recipes (user_id, name, ingredients, instructions) VALUES ($1, $2, $3, $4) RETURNING *",
      [req.user.userId, name.trim(), JSON.stringify(normalized), instructions?.trim() || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
