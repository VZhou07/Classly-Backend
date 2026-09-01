# Deploy backend to Cloudflare Workers

## Prerequisites

1. Cloudflare account
2. `wrangler login` (one-time, interactive)
3. Copy `.env` from Render/local into `classroom-backend/.env`
4. Optional: copy env to `.dev.vars` for `npm run cf:dev`

## Deploy

```bash
cd classroom-backend
npm install
npm run build
npm run cf:login          # if not already authenticated
npm run cf:secrets        # uploads secrets from .env
npm run deploy            # deploy Worker
```

After deploy, Wrangler prints your Worker URL, e.g.:

`https://classroom-backend.<your-subdomain>.workers.dev`

## Point Vercel at Cloudflare

```bash
npm run cf:update-vercel -- https://classroom-backend.<your-subdomain>.workers.dev
```

Or manually update `classroom-frontend/vercel.json`:

```json
"destination": "https://classroom-backend.<your-subdomain>.workers.dev/api/:path*"
```

Then redeploy the frontend on Vercel.

## Verify

```bash
curl https://classroom-backend.<your-subdomain>.workers.dev/
# {"message":"Classroom backend is up."}
```

Test login, dashboard, and one CRUD route via `https://classly-black.vercel.app`.

## Decommission Render

After 24h of stable traffic, suspend or delete the Render web service.
