const API_URL = "http://localhost:3000/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  async login(username, password) {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Login failed");
    }
    return res.json();
  },

  async register(username, password) {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Registration failed");
    }
    return res.json();
  },

  async getItems() {
    const res = await fetch(`${API_URL}/items`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to fetch items");
    return res.json();
  },

  async addItem(item) {
    const res = await fetch(`${API_URL}/items`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error("Failed to add item");
    const data = await res.json();
    return { item: data, merged: res.status === 200 };
  },

  async useItem(id, quantityUsed) {
    const res = await fetch(`${API_URL}/items/${id}/use`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ quantityUsed: quantityUsed ?? undefined }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Failed to use item");
    return data;
  },

  async getRecipes() {
    const res = await fetch(`${API_URL}/recipes`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to fetch recipes");
    return res.json();
  },

  async addRecipe(recipe) {
    const res = await fetch(`${API_URL}/recipes`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(recipe),
    });
    if (!res.ok) throw new Error("Failed to add recipe");
    return res.json();
  },
};
