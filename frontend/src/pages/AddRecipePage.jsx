import { useState, useId } from "react";
import { useNavigate } from "react-router-dom";

const UNIT_OPTIONS = [
  { value: "", label: "— (count, e.g. 2 eggs)" },
  { value: "grams", label: "grams" },
  { value: "milliliters", label: "milliliters" },
];

const defaultIngredient = () => ({ name: "", amount: "", unit: "" });

export default function AddRecipePage({ onAddRecipe }) {
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState([defaultIngredient()]);
  const [instructions, setInstructions] = useState("");

  const navigate = useNavigate();
  const nameId = useId();

  function addIngredient() {
    setIngredients((prev) => [...prev, defaultIngredient()]);
  }

  function removeIngredient(index) {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  }

  function updateIngredient(index, field, value) {
    setIngredients((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    const valid = ingredients
      .map((row) => ({
        name: row.name.trim(),
        amount: row.amount.trim(),
        unit: row.unit,
      }))
      .filter((row) => row.name.length > 0);

    if (!name.trim() || valid.length === 0) return;

    onAddRecipe({
      name: name.trim(),
      ingredients: valid,
      instructions: instructions.trim() || null,
    });

    setName("");
    setIngredients([defaultIngredient()]);
    setInstructions("");
    navigate("/recipes");
  }

  return (
    <main>
      <h1>Add Recipe</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor={nameId}>Recipe name</label>
        <input
          id={nameId}
          type="text"
          placeholder="e.g. Classic Omelette"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <fieldset>
          <legend>Ingredients</legend>
          {ingredients.map((row, index) => (
            <div key={index} className="ingredient-row">
              <input
                type="text"
                className="ingredient-name"
                placeholder="Item name"
                value={row.name}
                onChange={(e) => updateIngredient(index, "name", e.target.value)}
                aria-label={`Ingredient ${index + 1} name`}
              />
              <input
                type="text"
                inputMode="numeric"
                placeholder="Amount"
                value={row.amount}
                onChange={(e) => updateIngredient(index, "amount", e.target.value)}
                aria-label={`Ingredient ${index + 1} amount`}
                className="ingredient-amount"
              />
              <select
                value={row.unit}
                onChange={(e) => updateIngredient(index, "unit", e.target.value)}
                aria-label={`Ingredient ${index + 1} unit`}
              >
                {UNIT_OPTIONS.map((opt) => (
                  <option key={opt.value || "blank"} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                disabled={ingredients.length <= 1}
                className="secondary ingredient-remove"
                aria-label="Remove ingredient"
              >
                ×
              </button>
            </div>
          ))}
          <button type="button" onClick={addIngredient} className="secondary">
            + Add ingredient
          </button>
        </fieldset>

        <label htmlFor="instructions">Instructions (optional)</label>
        <textarea
          id="instructions"
          placeholder="Whisk eggs, melt butter, cook and fold with cheese."
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          rows={3}
        />

        <button type="submit">Add Recipe</button>
      </form>
    </main>
  );
}
