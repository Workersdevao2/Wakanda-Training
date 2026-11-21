# Handoff: Media CMS — Admin upload / delete

**Status:** Phase 1–4 **code complete** (2026-11-21) · Eventos page removed (Instagram/social only) · Video deferred  
**Date:** 2026-11-21  
**Project:** Wakanda Training static site + admin (`wakanda-training/`)  
**Stack:** Pure HTML/CSS/JS · Cloudflare Pages · Worker `wakanda-publish` · Cloudinary `ogtzpc3v`

Phase 1–4 in-repo. Public Eventos page deleted (announcements via Instagram / social only). Next: ops verification.

---

## Product decisions (locked)

| ID | Decision |
|----|----------|
| Scope | Full media CMS eventually: library + all site images + hero + **create new section slots** from admin |
| Phase order | **1 → 2 → 3 → 4** (below). |
| Delete | Remove from admin library **and** destroy on **Cloudinary**. Clean draft references (slots/products). **Do not** auto-republish — staff must hit **Publicar na loja**. |
| Videos | **Deferred.** Media library is image-only for now. Static hero `*.mp4` files under `images/` remain untouched. |
| Hero (Phase 2) | Admin-managed list of **photos** only for now. |
| Publish | Same flow everywhere: **Guardar rascunho** → **Publicar na loja** (catalog.json via Worker → KV + Cloudinary). |
| Phase 3 section order | `home_modalities` → `coaches` → `resultados` (Eventos page removed) |

---

## Current architecture (read before coding)

### Key files
- `admin.html` — panels: media (`#panel-media`), site images (`#panel-images`)
- `js/admin.js` — drafts, media library, site slots, upload, publish
- `js/main.js` — public catalog load, hero slider, shop
- `worker/src/index.js` — `/publish`, `/catalog`, `/media/delete`, submissions, members
- `worker/wrangler.toml` — secrets: `ADMIN_PASSWORD`, `CLOUDINARY_*`
- `BLUEPRINT.md` / `README.md` — high-level; this file is the build contract

### Existing media behaviour (Phase 1 complete)
- Upload: unsigned Cloudinary **`/image/upload`** only (`accept="image/*"`).
- Library: `localStorage` key `wt_media_library` — array of `{ url, publicId, resourceType, name, at }`.
- Delete (✕): calls Worker `POST /media/delete` → Cloudinary destroy; clears matching draft URLs.
- Site slots: `SITE_IMAGE_SLOTS` + `siteImages` map → published as `catalog.images`.
- Hero: still **hardcoded** slides in `index.html` (Phase 2 will make it catalog-driven).
- Homepage modalities: catalog-driven when `sections.home_modalities` non-empty; static HTML fallback otherwise. Coaches + resultados catalog-driven when non-empty; static HTML fallback otherwise. Eventos page removed.

### Cloudinary
- Cloud name: `ogtzpc3v`
- Unsigned preset: `wakanda_unsigned`
- Folder: `wakanda-training/media` (uploads), catalog raw at `wakanda-training/catalog`
- **Destroy requires signed API** (API key + secret) → must run on **Worker only**, never in client JS.

### Catalog load order (public)
1. `products.js` defaults  
2. Worker `GET /catalog` (KV) preferred  
3. Cloudinary raw fallbacks  
4. Admin browser: localStorage drafts override  

---

## Target catalog shape (full vision)

```js
{
  products: [],
  zones: [],
  texts: { pt: {}, en: {} },
  images: { /* existing fixed slot keys → url */ },
  hero: [
    { type: 'photo', url: string, publicId?: string, alt?: string }
  ],
  sections: {
    home_modalities: [
      { id, title, subtitle, image, href, order }
    ],
    coaches: [
      { id, name, role, image, bio?, order }
    ]
    // resultados, …
  },
  // optional published mirror of library (not required for Phase 1)
  media: [
    { url, publicId, resourceType: 'image', name, at }
  ],
  updatedAt: string
}
```

Phase 1 only **requires** richer media library records + Worker delete. Catalog `hero` / `sections` start in Phase 2–3.

---

## Phase 1 — Media foundation (DONE — image only)

### Goals
1. Upload **images** into the media library.
2. Store `publicId` + `resourceType` on each library item (needed for Cloudinary destroy).
3. Delete: Worker destroys Cloudinary asset; client removes from library and clears draft URLs that matched that asset.
4. No auto-publish after delete.
5. Update docs (this file + short notes in BLUEPRINT/README).

**Video upload was deferred** (2026-11-20). Admin is image-only.

### 1.1 Admin UI (`admin.html`)
- `#media-file-input`: `accept="image/*"`
- Media grid: `<img>` thumbs only.
- Keep buttons: URL · Usar · ✕

### 1.2 `js/admin.js`
**Library item shape:**
```js
{
  url: string,           // secure_url
  publicId: string,      // Cloudinary public_id (required for destroy)
  resourceType: 'image',
  name: string,
  at: string             // ISO
}
```
Migrate old items: if `publicId` missing, still list them; delete may only remove locally and toast that Cloudinary destroy was skipped.

**Upload:**
- Images only → `POST https://api.cloudinary.com/v1_1/{CLOUD}/image/upload`
- Same unsigned preset + folder `wakanda-training/media`
- On success save `secure_url`, `public_id`, `resource_type` from response.
- Soft size warning: images >8MB. Toast progress.

**Delete flow (✕):**
1. Confirm dialog (PT): warn that file is removed from Cloudinary and must **Publicar** to update live site references.
2. `POST {API_BASE}/media/delete` with body:
   ```js
   { password: getPublishPassword(), publicId, resourceType }
   ```
3. On success:
   - Splice item from `mediaLibrary`
   - Scan `siteImages` values and product `image` fields; clear any equal to deleted `url`
   - `saveDrafts()` / localStorage
   - `renderMedia()` (+ slots/products if visible)
4. On failure: toast error; do not remove from library.

**Usar / copy:** unchanged behaviour for images.

### 1.3 Worker (`worker/src/index.js`)
Add route:
```
POST /media/delete
```
- Auth: same admin password check as `/publish`
- Body: `{ password, publicId, resourceType }` (`resourceType` default `'image'`)
- Call Cloudinary Admin API destroy (signed):
  - Endpoint: `https://api.cloudinary.com/v1_1/{cloud}/{resource_type}/destroy`
  - Params: `public_id`, `api_key`, `timestamp`, `signature` (sha1 of sorted params + api_secret — same signing style as existing raw upload if any)
- Return `{ ok: true, publicId }` or 4xx/5xx JSON error
- CORS: same as other admin POSTs
- **Never** log or return `api_secret`

Deploy: `cd worker && npx wrangler deploy` after change.

### 1.4 Security
- No Cloudinary API secret in client bundles or git.
- Delete only with admin password verified on Worker.
- Sanitize/limit `publicId` (string, reasonable length, no path traversal tricks).

### 1.5 Out of scope for Phase 1
- Hero admin UI / catalog.hero
- Dynamic modalities/coaches sections
- Auto-republish on delete
- Deleting static files under `images/` on GitHub (those remain until replaced by catalog URLs)

### Phase 1 acceptance criteria
- [x] Code: JPEG/PNG/WebP image upload path in admin library
- [x] Code: store `publicId` + `resourceType`
- [x] Code: ✕ → `POST /media/delete` → clear draft slot/product URLs
- [x] Code: failed Cloudinary delete does not drop local item
- [x] Code: video upload path removed (deferred)
- [ ] **Ops:** confirm image upload works on live admin
- [ ] **Ops:** confirm ✕ destroys asset + Publicar updates live

### Phase 1 verification
1. Open `/admin.html` → Média → upload image → confirm Cloudinary URL in library.
2. Assign image to a site slot → Guardar rascunho → Publicar → confirm live page.
3. ✕ that media → confirm 200 from `/media/delete` → library empty of item → slot draft cleared → live still old until Publicar again.
4. Publicar → live no longer references deleted URL.

---

## Phase 2 — Hero from admin (DONE — images only)

1. Catalog includes `hero: [{ type: 'photo', url, publicId?, alt? }]`.
2. Admin panel **Hero**: ordered list, add from library or upload, ↑↓, delete, alt text.
3. Photos only (video slides deferred).
4. Public: `applyCatalogHero()` rebuilds `#hero-media` when catalog.hero is non-empty; empty → static fallback.
5. Draft key: `wt_hero_override`. Included in publish payload.
4. `index.html`: keep a noscript/fallback static set optional; `initHeroSlider()` prefer `catalog.hero` when non-empty.
5. Blur-layer + mobile contain rules already in CSS/JS — keep working with dynamic slides.

---

## Phase 3 — Dynamic sections / create new slots

Priority: `home_modalities` → `coaches` → `resultados`. **Eventos page removed** (2026-11-21) — announcements via Instagram / social only; no public page, no `sections.eventos`.

### home_modalities — DONE (2026-11-20)
- Catalog: `sections.home_modalities[]` = `{ id, title, subtitle, image, href, order }`
- Admin: panel **Secções** — add / edit / reorder / delete / image from upload or library
- Public: `#home-modalities-dynamic` filled when array non-empty; `#home-modalities-static` kept as fallback
- Draft key: `wt_sections_override`

### coaches — DONE (2026-11-20)
- Catalog: `sections.coaches[]` = `{ id, name, role, image, order }`
- Admin: same **Secções** panel — second list
- Public (Sobre Nós): `#coaches-dynamic` / `#coaches-static` fallback

### resultados — DONE (2026-11-21)
- Catalog: `sections.resultados[]` = `{ id, image, alt?, order }`
- Admin: same **Secções** panel — third list (galeria)
- Public (`pages/resultados.html`): `#resultados-dynamic` / `#resultados-static` fallback
- Empty array → static gallery HTML remains

### Remaining
Phase 3–4 complete (Eventos page removed). Ops verification next.

---

## Phase 4 — Remaining fixed image slots

**DONE (2026-11-21) — scope A only**

Wired existing slots (no new keys):
- `contacto-1/2/3` → `pages/contacto.html` gallery
- `modalidades-hero` → page heroes + CTA bands on Sobre, Modalidades, Horários, Preçário, Contacto, Inscrição, Projetos, Resultados, Home CTA
- `gordus` → `pages/projetos.html` main project image

Static `src` / `background-image` kept as fallback when catalog has no value.
Not in scope A: sobre espaço, inscrição aside, resultados secondary cards (optional later).

---

## Implementation rules (for any AI continuing)

1. **Clarify / plan** only when requirements are ambiguous; Phase 1 is specified — implement Phase 1 with **minimal diffs**.
2. Do not refactor unrelated admin panels, cart, inbox, or members.
3. No Node-only APIs in Worker; use Web Crypto / `fetch` only.
4. Type-aware UI states: loading, empty, error on upload/delete.
5. After Worker change, remind user to `wrangler deploy` and that video may need preset toggle in Cloudinary dashboard.
6. Update this handoff file when a phase is completed (checkboxes + “DONE” date).

---

## Quick file touch list — Phase 1 (done)

| File | Change |
|------|--------|
| `admin.html` | `accept="image/*"`; image-only help text |
| `js/admin.js` | image upload only; library shape with publicId; delete → Worker; clear drafts |
| `worker/src/index.js` | `POST /media/delete` signed destroy |
| `css/admin.css` | media grid styles (image only) |
| `BLUEPRINT.md` | short pointer |
| `README.md` | short pointer to this handoff |
| `HANDOFF-MEDIA-CMS.md` | this file |

---

## Secrets / env (Worker)

Already required: `ADMIN_PASSWORD`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`  
Optional: `CLOUDINARY_FOLDER` (default `wakanda-training`)

No new secrets for Phase 1 if those exist.

---

*End of handoff. Next action: Phase  2 (Hero from admin — images only).*
