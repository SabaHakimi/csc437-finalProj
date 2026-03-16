import "dotenv/config";
import express from "express";
import cors from "cors";
import { getEnvVar } from "./getEnvVar.js";
import * as auth from "./auth.js";
import * as inventory from "./inventory.js";

const PORT = Number.parseInt(getEnvVar("PORT", false), 10) || 3000;
const app = express();

app.use(cors());
app.use(express.json());

// Auth routes
app.post("/api/register", auth.register);
app.post("/api/login", auth.login);

// Inventory routes (protected)
app.get("/api/items", auth.authenticateToken, inventory.getItems);
app.post("/api/items", auth.authenticateToken, inventory.addItem);
app.patch("/api/items/:id/use", auth.authenticateToken, inventory.useItem);

// Recipes (public or protected, let's make it protected for consistency)
app.get("/api/recipes", auth.authenticateToken, inventory.getRecipes);
app.post("/api/recipes", auth.authenticateToken, inventory.addRecipe);

app.get("/hello", (req, res) => {
    res.send("Hello, World");
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}.  CTRL+C to stop.`);
});
