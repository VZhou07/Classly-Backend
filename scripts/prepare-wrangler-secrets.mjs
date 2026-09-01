/**
 * Prepares a secrets file for `wrangler secret bulk` from .env (excludes admin-only vars).
 * Usage: node scripts/prepare-wrangler-secrets.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const envPath = resolve(root, ".env");
const outPath = resolve(root, ".wrangler-secrets");

const SKIP_KEYS = new Set([
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
  "ADMIN_NAME",
  "ARCJET_ENV",
  "NODE_ENV",
  "PORT",
]);

const lines = readFileSync(envPath, "utf8").split(/\r?\n/);
const secrets = [];

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;

  const eq = trimmed.indexOf("=");
  if (eq === -1) continue;

  const key = trimmed.slice(0, eq).trim();
  if (SKIP_KEYS.has(key)) continue;

  let value = trimmed.slice(eq + 1).trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  const hash = value.indexOf(" #");
  if (hash !== -1) {
    value = value.slice(0, hash).trim();
  }

  secrets.push(`${key}=${value}`);
}

writeFileSync(outPath, `${secrets.join("\n")}\n`, "utf8");
console.log(`Wrote ${secrets.length} secrets to .wrangler-secrets`);
console.log("Run: npx wrangler secret bulk .wrangler-secrets");
