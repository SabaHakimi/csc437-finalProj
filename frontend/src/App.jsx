import { useState, useCallback, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Toast from "./components/Toast";
import InventoryPage from "./pages/InventoryPage";
import RecipesPage from "./pages/RecipesPage";
import AddItemPage from "./pages/AddItemPage";
import AddRecipePage from "./pages/AddRecipePage";
import LoginPage from "./pages/LoginPage";
import { api } from "./api";
import "./styles.css";

function normalizeRecipeIngredients(ingredients) {
  if (!Array.isArray(ingredients)) return [];
  return ingredients.map((ing) => {
    if (typeof ing === "object" && ing !== null && "name" in ing) {
      const name = String(ing.name).trim();
      const quantity = ing.amount != null ? String(ing.amount).trim() : (ing.quantity != null ? String(ing.quantity).trim() : "");
      return { name, quantity };
    }
    return { name: String(ing).trim(), quantity: "" };
  });
}

function App() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const showToast = useCallback((msg) => setToast(msg), []);
  const clearToast = useCallback(() => setToast(""), []);

  // Check for existing token on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Fetch data when user changes
  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setItems([]);
      setRecipes([]);
    }
  }, [user]);

  async function fetchData() {
    setLoading(true);
    setError("");
    try {
      const [itemsData, recipesData] = await Promise.all([
        api.getItems(),
        api.getRecipes(),
      ]);
      setItems(itemsData);
      setRecipes(recipesData);
    } catch (err) {
      setError("Failed to load data. Please try again.");
      showToast("Error loading data.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogin(userData, token) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    showToast(`Welcome, ${userData.username}!`);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    showToast("Logged out.");
  }

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  function handleToggleDarkMode() {
    setDarkMode((prev) => !prev);
  }

  async function handleAddItem({ name, location, quantity, unit }) {
    try {
      const { item, merged } = await api.addItem({ name, location, quantity, unit });
      if (merged) {
        setItems((prev) => prev.map((i) => (i.id === item.id ? item : i)));
        showToast(`Updated "${name}" in ${location}.`);
      } else {
        setItems((prev) => [item, ...prev]);
        showToast(`Added "${name}" to ${location}.`);
      }
    } catch (err) {
      showToast("Failed to add item.");
    }
  }

  async function handleUseItem(id, quantityUsed) {
    try {
      const result = await api.useItem(id, quantityUsed);
      if (result.deleted) {
        setItems((prev) => prev.filter((item) => item.id !== result.id));
        showToast("Item used and removed.");
      } else {
        setItems((prev) =>
          prev.map((item) => (item.id === id ? result : item))
        );
        showToast(`Used ${quantityUsed ?? "all"} of "${result.name}".`);
      }
    } catch (err) {
      showToast(err.message || "Failed to use item.");
    }
  }

  async function handleAddRecipe({ name, ingredients, instructions }) {
    try {
      const newRecipe = await api.addRecipe({ name, ingredients, instructions });
      setRecipes((prev) => [...prev, newRecipe].sort((a, b) => a.name.localeCompare(b.name)));
      showToast(`Added recipe "${name}".`);
    } catch (err) {
      showToast("Failed to add recipe.");
    }
  }

  async function handleCookRecipe(recipeId) {
    const recipe = recipes.find((r) => r.id === recipeId);
    if (!recipe) return;

    const ingredients = normalizeRecipeIngredients(recipe.ingredients);

    try {
      let currentItems = items;
      for (const ing of ingredients) {
        const nameLower = ing.name.toLowerCase();
        const item = currentItems.find((i) => i.name.toLowerCase() === nameLower);
        if (item) {
          const result = await api.useItem(item.id, ing.quantity || null);
          if (result.deleted) {
            currentItems = currentItems.filter((i) => i.id !== result.id);
          } else {
            currentItems = currentItems.map((i) => (i.id === item.id ? result : i));
          }
        }
      }
      setItems(currentItems);
      showToast(`Cooked "${recipe.name}"!`);
    } catch (err) {
      showToast(err.message || "Failed to complete recipe.");
    }
  }

  return (
    <>
      <NavBar
        user={user}
        onLogout={handleLogout}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      {loading && <div className="loading-indicator">Loading...</div>}
      {error && <div className="error-indicator">{error}</div>}

      <Routes>
        <Route
          path="/login"
          element={
            user ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />
          }
        />
        <Route
          path="/"
          element={
            user ? (
              <InventoryPage
                user={user}
                items={items}
                onUseItem={handleUseItem}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/recipes"
          element={
            user ? (
              <RecipesPage
                items={items}
                recipes={recipes}
                onCookRecipe={handleCookRecipe}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/recipes/add"
          element={
            user ? (
              <AddRecipePage onAddRecipe={handleAddRecipe} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/add"
          element={
            user ? (
              <AddItemPage onAddItem={handleAddItem} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Toast message={toast} onClose={clearToast} />
    </>
  );
}

export default App;
