/**
 * Updates classroom-frontend/vercel.json to proxy /api to the Cloudflare Worker.
 * Usage: node scripts/update-vercel-proxy.mjs https://classroom-backend.<subdomain>.workers.dev
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const workerOrigin = process.argv[2]?.replace(/\/$/, "");
if (!workerOrigin?.startsWith("https://")) {
  console.error(
    "Usage: node scripts/update-vercel-proxy.mjs https://classroom-backend.<subdomain>.workers.dev",
  );
  process.exit(1);
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const vercelPath = resolve(__dirname, "../../classroom-frontend/vercel.json");

const config = JSON.parse(readFileSync(vercelPath, "utf8"));
const apiRewrite = config.rewrites.find((r) => r.source === "/api/:path*");
if (!apiRewrite) {
  console.error("Could not find /api/:path* rewrite in vercel.json");
  process.exit(1);
}

apiRewrite.destination = `${workerOrigin}/api/:path*`;
writeFileSync(vercelPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
console.log(`Updated vercel.json API proxy to ${workerOrigin}`);
