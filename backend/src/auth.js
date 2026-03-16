import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getEnvVar } from "./getEnvVar.js";
import * as db from "./db.js";

const JWT_SECRET = getEnvVar("JWT_SECRET") || "super-secret-key";

export const register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
      [username, hashedPassword]
    );
    
    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: "24h" });
    
    res.status(201).json({ user, token });
  } catch (err) {
    if (err.code === "23505") { // Unique violation
      return res.status(400).json({ error: "Username already exists" });
    }
    console.error("Register error:", err);
    const message = process.env.NODE_ENV !== "production" ? err.message : "Internal server error";
    res.status(500).json({ error: message });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    const result = await db.query("SELECT * FROM users WHERE username = $1", [username]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: "24h" });
    
    res.json({ user: { id: user.id, username: user.username }, token });
  } catch (err) {
    console.error("Login error:", err);
    const message = process.env.NODE_ENV !== "production" ? err.message : "Internal server error";
    res.status(500).json({ error: message });
  }
};

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Access denied" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
};
