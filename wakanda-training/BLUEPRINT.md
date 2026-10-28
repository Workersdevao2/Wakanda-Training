# Wakanda Training — Site + Admin Blueprint

Adapted from the reusable small e-commerce / brochure architecture.

## Stack

| Layer | Tech |
|-------|------|
| Public site | Pure HTML / CSS / JS · Cloudflare Pages |
| Admin | `/admin.html` · password gate · localStorage drafts |
| Publish API | Cloudflare Worker `wakanda-publish` |
| Media + catalog | Cloudinary (`ogtzpc3v`) |
| Orders | WhatsApp `+244 940 668 530` |

## Cloudinary setup

1. **Unsigned upload preset** (required for browser media uploads)
   - Dashboard → Settings → Upload → Upload presets → Add
   - Signing mode: **Unsigned**
   - Name: `wakanda_unsigned`
   - Folder: `wakanda-training/media` (optional)
   - Overwrite: **off**
   - Unique filename: **on**

2. **Catalog** is written only by the Worker (signed raw upload) to:
   ```
   wakanda-training/catalog  →  catalog.json
   Public URL:
   https://res.cloudinary.com/ogtzpc3v/raw/upload/wakanda-training/catalog.json
   ```

## Worker deploy

```bash
cd worker
npx wrangler deploy

npx wrangler secret put ADMIN_PASSWORD
# strong password for staff

npx wrangler secret put CLOUDINARY_CLOUD_NAME
# ogtzpc3v

npx wrangler secret put CLOUDINARY_API_KEY
# 321851197572399

npx wrangler secret put CLOUDINARY_API_SECRET
# jNWpl43sstSr_yb1DjmflXt7h78
```

Live publish URL (already set in `js/admin.js`):

```js
const PUBLISH_URL = 'https://wakanda-publish.workersdevao.workers.dev/publish';
```

## Admin password

- Local first-login fallback: `wakanda2026` (change after handoff)
- Production: only the Worker `ADMIN_PASSWORD` matters for publish

## Staff flow

1. Open `/admin.html` → password (show/hide toggle on the field)
2. **Inbox** — mark treated, delete, or convert inscrição to client
3. **Clientes** — pack, validity, classes remaining, status
4. Edit products / zones / site images / upload media
5. **Guardar rascunho** → preview loja on same device
6. **Publicar na loja** → all visitors get new catalog

Layout: left sidebar (desktop), bottom icons (mobile).

## Public data load order

1. `products.js` defaults  
2. Remote `catalog.json`  
3. localStorage drafts (`wt_*_override`) win on the admin’s browser  

## Key files

| File | Role |
|------|------|
| `admin.html` | Staff panel (sidebar, inbox, clients) |
| `css/admin.css` | Admin UI |
| `js/admin.js` | CRUD, media, publish, members, inbox |
| `js/products.js` | Seed products + zones |
| `js/main.js` | Cart + catalog fetch + shop + inscrição forms |
| `worker/` | Publish + forms + members API |
| `pages/loja.html` | Dynamic product grids `#shop-apparel` / `#shop-accessories` |
| `pages/inscricao.html` | Enrollment / trial form |

## Security notes

- Never commit API secret to client JS or git.
- Unsigned preset cannot list or delete assets; cannot touch catalog.
- Change default admin password after go-live.
- Optional: Cloudflare Access in front of `/admin.html`.
