# Wakanda Training — Publish + Forms Worker

Cloudflare Worker that:

1. Publishes `catalog.json` to Cloudinary (signed upload)
2. Stores form submissions in **KV** (inscrição, perguntas, contacto)
3. Serves admin inbox (list + mark handled)

## Endpoints

| Method | Path | Auth | Role |
|--------|------|------|------|
| GET | `/health` | — | Health |
| POST | `/publish` | admin password | Catalog → Cloudinary |
| POST | `/submit` | public | Save form submission |
| GET | `/submissions?password=&filter=` | admin | List inbox |
| POST | `/submissions/status` | admin | Mark handled / open |

## First-time: create KV

```bash
cd worker
npx wrangler kv namespace create SUBMISSIONS
```

Copy the **id** from the output into `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "SUBMISSIONS"
id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
preview_id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

Optional preview namespace:

```bash
npx wrangler kv namespace create SUBMISSIONS --preview
```

## Deploy

```bash
npx wrangler deploy
```

## Secrets

```bash
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put CLOUDINARY_CLOUD_NAME
npx wrangler secret put CLOUDINARY_API_KEY
npx wrangler secret put CLOUDINARY_API_SECRET
```

## Live URL

```
https://wakanda-publish.workersdevao.workers.dev
```
