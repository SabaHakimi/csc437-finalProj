export function normalizeIngredientForCheck(ing) {
  if (typeof ing === "object" && ing !== null && "name" in ing) {
    const name = String(ing.name).trim().toLowerCase();
    const amount = ing.amount != null ? String(ing.amount).trim() : "";
    const unit = (ing.unit != null ? String(ing.unit).trim() : "").toLowerCase();
    return { name, amount: amount || null, unit: unit || "" };
  }
  return { name: String(ing).trim().toLowerCase(), amount: null, unit: "" };
}

export function hasEnoughForIngredient(ing, items) {
  const item = items.find((i) => i.name.toLowerCase() === ing.name);
  if (!item) return false;
  if (!ing.amount) return true;
  const reqNum = Number.parseFloat(ing.amount, 10);
  if (Number.isNaN(reqNum) || reqNum <= 0) return true;
  const itemUnit = (item.unit != null ? String(item.unit).trim() : "").toLowerCase();
  if (itemUnit !== ing.unit) return false;
  const haveNum = Number.parseFloat(String(item.quantity).trim(), 10);
  if (Number.isNaN(haveNum)) return false;
  return haveNum >= reqNum;
}

export function canCookRecipe(recipe, items) {
  const ings = Array.isArray(recipe.ingredients)
    ? recipe.ingredients.map(normalizeIngredientForCheck)
    : [];
  return ings.every((ing) => hasEnoughForIngredient(ing, items));
}
