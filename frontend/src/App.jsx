import { useState, useCallback, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Toast from "./components/Toast";
import InventoryPage from "./pages/InventoryPage";
import RecipesPage from "./pages/RecipesPage";
import AddItemPage from "./pages/AddItemPage";
import LoginPage from "./pages/LoginPage";
import { initialItems, initialRecipes } from "./data/mockData";
import "./styles.css";

function App() {
  const [user, setUser] = useState({ name: "Tom" });
  const [items, setItems] = useState(initialItems);
  const [recipes] = useState(initialRecipes);
  const [darkMode, setDarkMode] = useState(false);
  const [toast, setToast] = useState("");
  const [nextId, setNextId] = useState(initialItems.length + 1);

  const showToast = useCallback((msg) => setToast(msg), []);
  const clearToast = useCallback(() => setToast(""), []);

  function handleLogin(userData) {
    setUser(userData);
    showToast(`Welcome, ${userData.name}!`);
  }

  function handleLogout() {
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

  function handleAddItem({ name, location, quantity }) {
    const newItem = { id: nextId, name, location, quantity, used: false };
    setItems((prev) => [...prev, newItem]);
    setNextId((prev) => prev + 1);
    showToast(`Added "${name}" to ${location}.`);
  }

  function handleMarkUsed(id) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, used: true } : item
      )
    );
    const item = items.find((i) => i.id === id);
    if (item) showToast(`Marked "${item.name}" as used.`);
  }

  function handleCookRecipe(recipeId) {
    const recipe = recipes.find((r) => r.id === recipeId);
    if (!recipe) return;

    setItems((prev) =>
      prev.map((item) => {
        const isIngredient = recipe.ingredients.some(
          (ing) => ing.toLowerCase() === item.name.toLowerCase()
        );
        return isIngredient && !item.used ? { ...item, used: true } : item;
      })
    );
    showToast(`Cooked "${recipe.name}"! Ingredients marked as used.`);
  }

  return (
    <>
      <NavBar
        user={user}
        onLogout={handleLogout}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

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
                onMarkUsed={handleMarkUsed}
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
