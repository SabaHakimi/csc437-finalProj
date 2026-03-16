function formatIngredientLabel(ing) {
  if (typeof ing !== "object" || ing === null || !("name" in ing)) {
    return { key: String(ing), label: String(ing), name: String(ing).toLowerCase(), amount: null, unit: "" };
  }
  const name = String(ing.name).trim();
  const amount = ing.amount != null ? String(ing.amount).trim() : "";
  const unit = (ing.unit != null ? String(ing.unit).trim() : "").toLowerCase();
  let label = name;
  if (amount) {
    if (unit === "grams") label = `${amount} g ${name}`;
    else if (unit === "milliliters") label = `${amount} ml ${name}`;
    else label = `${amount} ${name}`;
  }
  return {
    key: `${amount}-${unit}-${name}`,
    label,
    name: name.toLowerCase(),
    amount: amount || null,
    unit: unit || "",
  };
}

import { hasEnoughForIngredient } from "../utils/recipeIngredients";

export default function RecipeCard({ recipe, availableItems, canCook, onCook }) {
  const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients.map(formatIngredientLabel) : [];

  return (
    <div className="card">
      <h3>{recipe.name}</h3>
      <div className="recipe-ingredients">
        {ingredients.map((ing) => {
          const have = hasEnoughForIngredient(ing, availableItems);
          return (
            <span
              key={ing.key}
              className={`ingredient-tag ${have ? "available" : "missing"}`}
            >
              {ing.label}
            </span>
          );
        })}
      </div>
      {canCook ? (
        <button onClick={() => onCook(recipe.id)}>Cook Recipe</button>
      ) : (
        <p style={{ marginTop: "0.5rem", fontStyle: "italic", fontSize: "0.85rem" }}>
          Missing ingredients
        </p>
      )}
    </div>
  );
}
