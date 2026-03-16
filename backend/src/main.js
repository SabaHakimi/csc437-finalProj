import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";
import { getEnvVar } from "./getEnvVar.js";
import { VALID_ROUTES } from "./validRoutes.js";
import * as auth from "./auth.js";
import * as inventory from "./inventory.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number.parseInt(getEnvVar("PORT", false), 10) || 3000;
const app = express();

app.use(cors());
app.use(express.json());

const frontendDist = path.join(__dirname, "..", "..", "frontend", "dist");

// API and server routes first
app.post("/api/register", auth.register);
app.post("/api/login", auth.login);
app.get("/api/items", auth.authenticateToken, inventory.getItems);
app.post("/api/items", auth.authenticateToken, inventory.addItem);
app.patch("/api/items/:id/use", auth.authenticateToken, inventory.useItem);
app.get("/api/recipes", auth.authenticateToken, inventory.getRecipes);
app.post("/api/recipes", auth.authenticateToken, inventory.addRecipe);
app.get("/hello", (req, res) => {
    res.send("Hello, World");
});

// Serve built frontend when frontend/dist exists (e.g. on VPS after build)
if (existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
    app.get(Object.values(VALID_ROUTES), (req, res) => {
        res.sendFile("index.html", { root: frontendDist });
    });
}

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}.  CTRL+C to stop.`);
});
