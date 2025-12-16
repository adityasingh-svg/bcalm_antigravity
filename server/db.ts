import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL must be set. Did you forget to provision a database?"); // Changed to warn
}

// Fallback to avoid crash on init. Connection will fail if used.
export const pool = new Pool({ connectionString: process.env.DATABASE_URL || "postgresql://dummy:dummy@localhost:5432/dummy" });
export const db = drizzle({ client: pool, schema });
