import RecipeCard from "../components/RecipeCard";

export default function RecipesPage({ items, recipes, onCookRecipe }) {
  const availableItems = items.filter((i) => !i.used);

  const canCookRecipe = (recipe) =>
    recipe.ingredients.every((ing) =>
      availableItems.some((item) => item.name.toLowerCase() === ing.toLowerCase())
    );

  const available = recipes.filter(canCookRecipe);
  const unavailable = recipes.filter((r) => !canCookRecipe(r));

  return (
    <main>
      <h1>Recipes</h1>

      <section className="section" aria-labelledby="available-heading">
        <h2 id="available-heading">Available With Current Inventory</h2>
        {available.length === 0 ? (
          <p className="empty-state">No recipes can be made with current items.</p>
        ) : (
          <div className="card-grid">
            {available.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                availableItems={items}
                canCook
                onCook={onCookRecipe}
              />
            ))}
          </div>
        )}
      </section>

      <section className="section" aria-labelledby="other-heading">
        <h2 id="other-heading">Other Recipes</h2>
        {unavailable.length === 0 ? (
          <p className="empty-state">You can make all recipes!</p>
        ) : (
          <div className="card-grid">
            {unavailable.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                availableItems={items}
                canCook={false}
                onCook={onCookRecipe}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
