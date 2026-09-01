import { neon, Pool } from "@neondatabase/serverless";
import {
  drizzle as drizzleHttp,
  type NeonHttpDatabase,
} from "drizzle-orm/neon-http";
import {
  drizzle as drizzleServerless,
  type NeonDatabase,
  type NeonTransaction,
} from "drizzle-orm/neon-serverless";
import type { TablesRelationalConfig } from "drizzle-orm/relations";

let dbInstance: NeonHttpDatabase | undefined;

type Transaction = NeonTransaction<Record<string, never>, TablesRelationalConfig>;

function getDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not defined");
  }
  return databaseUrl;
}

function getDb(): NeonHttpDatabase {
  if (!dbInstance) {
    dbInstance = drizzleHttp(neon(getDatabaseUrl()));
  }
  return dbInstance;
}

export const db = new Proxy({} as NeonHttpDatabase, { //javascript proxy not network proxy
  get(_target, prop, receiver) {
    return Reflect.get(getDb(), prop, receiver);
  },
});

export async function withTransaction<T>(
  callback: (tx: Transaction) => Promise<T>,
): Promise<T> {
  const pool = new Pool({ connectionString: getDatabaseUrl() });
  const transactionDb: NeonDatabase = drizzleServerless(pool);

  try {
    return await transactionDb.transaction(callback);
  } finally {
    await pool.end();
  }
}
