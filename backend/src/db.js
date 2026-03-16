import pg from "pg";
import { getEnvVar } from "./getEnvVar.js";

const { Pool } = pg;

const pool = new Pool({
  connectionString: getEnvVar("DATABASE_URL"),
  ssl: {
    rejectUnauthorized: false, // Required for Supabase
  },
});

export const query = (text, params) => pool.query(text, params);
