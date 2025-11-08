import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;
neonConfig.webSocketConstructor = ws;

// If DATABASE_URL is not set (development), don't crash — other storage implementations may be used.
export let pool: any = null;
export let db: any = null;

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL not set — skipping Neon DB initialization (using file-based storage)");
} else {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
}
