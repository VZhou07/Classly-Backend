import { neon, Pool } from "@neondatabase/serverless";
import {
  drizzle as drizzleHttp,
  type NeonHttpDatabase,
} from "drizzle-orm/neon-http";
import {
  drizzle as drizzleServerless,
  type NeonDatabase,
} from "drizzle-orm/neon-serverless";

let dbInstance: NeonHttpDatabase | undefined;
let transactionDbInstance: NeonDatabase | undefined;

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

function getTransactionDb(): NeonDatabase {
  if (!transactionDbInstance) {
    const pool = new Pool({ connectionString: getDatabaseUrl() });
    transactionDbInstance = drizzleServerless(pool);
  }
  return transactionDbInstance;
}

export const db = new Proxy({} as NeonHttpDatabase, { //javascript proxy not network proxy
  get(_target, prop, receiver) {
    return Reflect.get(getDb(), prop, receiver);
  },
});

export const transactionDb = new Proxy({} as NeonDatabase, {
  get(_target, prop, receiver) {
    return Reflect.get(getTransactionDb(), prop, receiver);
  },
});
