# Wakanda Training — Publish Worker

Small Cloudflare Worker that receives the admin catalog + password, verifies credentials, and performs a **signed** Cloudinary raw upload of `catalog.json`.

## Deploy

```bash
cd worker
npx wrangler deploy
```

## Secrets (required)

```bash
npx wrangler secret put ADMIN_PASSWORD
# Choose a strong password (staff will type this in /admin.html)

npx wrangler secret put CLOUDINARY_CLOUD_NAME
# Value: ogtzpc3v

npx wrangler secret put CLOUDINARY_API_KEY
# Value: 321851197572399

npx wrangler secret put CLOUDINARY_API_SECRET
# Value: jNWpl43sstSr_yb1DjmflXt7h78
```

Optional (defaults shown):

```bash
# If you want a different folder / public_id:
npx wrangler secret put CLOUDINARY_FOLDER
# default: wakanda-training

npx wrangler secret put CATALOG_PUBLIC_ID
# default: wakanda-training/catalog
```

## After deploy

Copy the worker URL, e.g.:

```
https://wakanda-publish.<your-subdomain>.workers.dev
```

Then set in `js/admin.js`:

```js
const PUBLISH_URL = 'https://wakanda-publish.<your-subdomain>.workers.dev/publish';
```

## Test

```bash
curl -X POST https://wakanda-publish....workers.dev/publish \
  -H 'Content-Type: application/json' \
  -d '{"password":"YOUR_ADMIN_PASSWORD","catalog":{"products":[],"zones":[],"texts":{},"images":{}}}'
```

## Security

- API secret never leaves the Worker.
- Only a correct `ADMIN_PASSWORD` can overwrite the catalog.
- Media uploads use an **unsigned** preset from the browser (separate from this Worker).
