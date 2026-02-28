export default function RecipeCard({ recipe, availableItems, canCook, onCook }) {
  return (
    <div className="card">
      <h3>{recipe.name}</h3>
      <div className="recipe-ingredients">
        {recipe.ingredients.map((ing) => {
          const have = availableItems.some(
            (item) => item.name.toLowerCase() === ing.toLowerCase() && !item.used
          );
          return (
            <span
              key={ing}
              className={`ingredient-tag ${have ? "available" : "missing"}`}
            >
              {ing}
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
