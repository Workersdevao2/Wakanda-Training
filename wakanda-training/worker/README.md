# Wakanda Training — Publish + Forms + Members Worker

Cloudflare Worker that:

1. Publishes `catalog.json` to Cloudinary (signed upload)
2. Stores form submissions in **KV** (inscrição, perguntas, contacto)
3. Serves admin inbox (list + mark handled + **delete**)
4. Stores **members / clientes** in the same KV (`mem_*` keys)

## Endpoints

| Method | Path | Auth | Role |
|--------|------|------|------|
| GET | `/health` | — | Health |
| POST | `/publish` | admin password | Catalog → Cloudinary |
| POST | `/submit` | public | Save form submission |
| GET | `/submissions?password=&filter=` | admin | List inbox |
| POST | `/submissions/status` | admin | Mark handled / open |
| POST | `/submissions/delete` | admin | Delete submission |
| GET | `/members?password=` | admin | List members |
| POST | `/members` | admin | Create / update member |
| POST | `/members/delete` | admin | Delete member |

## Deploy

```bash
cd worker
npx wrangler deploy
```

## Live URL

```
https://wakanda-publish.workersdevao.workers.dev
```
