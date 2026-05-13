import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "@/db/schema";

export type Db = ReturnType<typeof drizzle<typeof schema>>;

let cache: Db | undefined;

export function getDb(): Db {
  if (cache) return cache;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  const sql = neon(url);
  cache = drizzle(sql, { schema });
  return cache;
}

export { schema };
