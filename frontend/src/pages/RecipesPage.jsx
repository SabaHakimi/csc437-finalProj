import { Link } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import { canCookRecipe } from "../utils/recipeIngredients";

export default function RecipesPage({ items, recipes, onCookRecipe }) {
  const recipeCanCook = (recipe) => canCookRecipe(recipe, items);

  const available = recipes.filter(recipeCanCook);
  const unavailable = recipes.filter((r) => !recipeCanCook(r));

  return (
    <main>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <h1 style={{ margin: 0 }}>Recipes</h1>
        <Link to="/recipes/add" className="btn">Add recipe</Link>
      </div>

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
