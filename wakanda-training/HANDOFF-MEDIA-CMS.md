# Handoff: Media CMS (images + videos) — Admin upload / delete

**Status:** Phase 1 **code complete** (2026-11-19) — deploy Worker + verify · Phases 2–4 not started  
**Date:** 2026-11-19  
**Project:** Wakanda Training static site + admin (`wakanda-training/`)  
**Stack:** Pure HTML/CSS/JS · Cloudflare Pages · Worker `wakanda-publish` · Cloudinary `ogtzpc3v`

Phase 1 source changes are in-repo. Finish **Ops** checkboxes under Phase 1 acceptance, then Phase 2.

---

## Product decisions (locked)

| ID | Decision |
|----|----------|
| Scope | Full media CMS eventually: library + all site images/videos + hero + **create new section slots** from admin |
| Phase order | **1 → 2 → 3 → 4** (below). User chose start with **Phase 1 only**. |
| Delete | Remove from admin library **and** destroy on **Cloudinary**. Clean draft references (slots/products). **Do not** auto-republish — staff must hit **Publicar na loja**. |
| Videos | Uploadable to media library; later usable on hero and any video-capable slots (Phase 2+). |
| Hero alternation | Keep strict **video → image → video → image** when Phase 2 lands. |
| Publish | Same flow everywhere: **Guardar rascunho** → **Publicar na loja** (catalog.json via Worker → KV + Cloudinary). |
| Cloudinary video preset | **Unknown** whether `wakanda_unsigned` allows video. Code for `/video/upload`; document dashboard requirement. |
| Phase 3 section order | `home_modalities` → `coaches` → `resultados` → `eventos` |

---

## Current architecture (read before coding)

### Key files
- `admin.html` — panels: media (`#panel-media`), site images (`#panel-images`)
- `js/admin.js` — drafts, media library, site slots, upload, publish
- `js/main.js` — public catalog load, hero slider, shop
- `worker/src/index.js` — `/publish`, `/catalog`, submissions, members (no media delete yet)
- `worker/wrangler.toml` — secrets: `ADMIN_PASSWORD`, `CLOUDINARY_*`
- `BLUEPRINT.md` / `README.md` — high-level; this file is the build contract

### Existing media behaviour
- Upload: unsigned Cloudinary **`/image/upload`** only (`accept="image/*"`).
- Library: `localStorage` key `wt_media_library` — array of `{ url, name, at }`.
- Delete (✕): **local array only** — does **not** call Cloudinary destroy.
- Site slots: `SITE_IMAGE_SLOTS` + `siteImages` map → published as `catalog.images`.
- Hero: **hardcoded** slides in `index.html`; random V-I sequence in `initHeroSlider()` (main.js).
- Homepage modalities / many section images: **static HTML**, not catalog-driven.

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
    { type: 'video' | 'photo', url: string, publicId?: string, alt?: string }
  ],
  sections: {
    home_modalities: [
      { id, title, subtitle, image, href, order }
    ],
    coaches: [
      { id, name, role, image, bio?, order }
    ]
    // resultados, eventos, …
  },
  // optional published mirror of library (not required for Phase 1)
  media: [
    { url, publicId, resourceType: 'image' | 'video', name, at }
  ],
  updatedAt: string
}
```

Phase 1 only **requires** richer media library records + Worker delete. Catalog `hero` / `sections` start in Phase 2–3.

---

## Phase 1 — Media foundation (IMPLEMENT THIS)

### Goals
1. Upload **images and videos** into the media library.
2. Store `publicId` + `resourceType` on each library item (needed for Cloudinary destroy).
3. Delete: Worker destroys Cloudinary asset; client removes from library and clears draft URLs that matched that asset.
4. No auto-publish after delete.
5. Update docs (this file + short notes in BLUEPRINT/README).

### 1.1 Admin UI (`admin.html`)
- `#media-file-input`: change `accept` to allow images **and** videos, e.g.  
  `accept="image/*,video/mp4,video/webm,video/quicktime"`
- Media grid: show video items with a `<video>` thumb or placeholder icon (not only `<img>`).
- Keep buttons: URL · Usar · ✕

### 1.2 `js/admin.js`
**Library item shape (new):**
```js
{
  url: string,           // secure_url
  publicId: string,      // Cloudinary public_id (required for destroy)
  resourceType: 'image' | 'video',
  name: string,
  at: string             // ISO
}
```
Migrate old items: if `publicId` missing, still list them; delete may only remove locally and toast that Cloudinary destroy was skipped.

**Upload:**
- Detect type from `file.type` (or extension).
- Images → `POST https://api.cloudinary.com/v1_1/{CLOUD}/image/upload`
- Videos → `POST https://api.cloudinary.com/v1_1/{CLOUD}/video/upload`
- Same unsigned preset + folder `wakanda-training/media`
- On success save `secure_url`, `public_id`, `resource_type` from response.
- Soft size warnings: images >8MB; videos >40MB (adjust if needed). Toast progress.

**Cloudinary preset note:** If video upload returns 400, staff must enable video for preset `wakanda_unsigned` (or create a second unsigned video preset and document the name in admin.js).

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

**Usar / copy:** unchanged behaviour; videos can set product image field only if that makes sense — or toast “use on hero/slots when available” for pure video URLs until Phase 2.

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
- [x] Code: JPEG/PNG/WebP + video upload path in admin library
- [x] Code: store `publicId` + `resourceType`; video thumbs in grid
- [x] Code: ✕ → `POST /media/delete` → clear draft slot/product URLs
- [x] Code: failed Cloudinary delete does not drop local item
- [ ] **Ops:** `cd worker && npx wrangler deploy`
- [ ] **Ops:** confirm image upload works on live admin
- [ ] **Ops:** confirm MP4 upload (enable video on `wakanda_unsigned` if 400)
- [ ] **Ops:** confirm ✕ destroys asset + Publicar updates live

### Phase 1 verification
1. Open `/admin.html` → Média → upload image → confirm Cloudinary URL in library.
2. Upload small MP4; if error, fix preset then retry.
3. Assign image to a site slot → Guardar rascunho → Publicar → confirm live page.
4. ✕ that media → confirm 200 from `/media/delete` → library empty of item → slot draft cleared → live still old until Publicar again.
5. Publicar → live no longer references deleted URL.

---

## Phase 2 — Hero from admin (NOT STARTED)

1. Extend catalog with `hero: [{ type, url, publicId?, alt? }]`.
2. Admin panel section: ordered list, add from library or upload, delete, reorder.
3. Enforce strict V-I-V-I in UI and on publish validation.
4. `index.html`: keep a noscript/fallback static set optional; `initHeroSlider()` prefer `catalog.hero` when non-empty.
5. Blur-layer + mobile contain rules already in CSS/JS — keep working with dynamic slides.

---

## Phase 3 — Dynamic sections / create new slots (NOT STARTED)

Priority: `home_modalities` → `coaches` → `resultados` → `eventos`.

For each section:
1. Add `catalog.sections.<key>[]` with id, fields, order, image/video url.
2. Admin CRUD + “Adicionar”.
3. Public page: empty container `#…` + renderer in `main.js`; fallback to current hardcoded HTML if array missing/empty so first deploy is safe.
4. Publish via existing catalog pipeline.

---

## Phase 4 — Remaining fixed image slots

Expand `SITE_IMAGE_SLOTS` / `images{}` for any leftover single hardcoded backgrounds still not covered.

---

## Implementation rules (for any AI continuing)

1. **Clarify / plan** only when requirements are ambiguous; Phase 1 is specified — implement Phase 1 with **minimal diffs**.
2. Do not refactor unrelated admin panels, cart, inbox, or members.
3. No Node-only APIs in Worker; use Web Crypto / `fetch` only.
4. Type-aware UI states: loading, empty, error on upload/delete.
5. After Worker change, remind user to `wrangler deploy` and that video may need preset toggle in Cloudinary dashboard.
6. Update this handoff file when a phase is completed (checkboxes + “DONE” date).

---

## Quick file touch list — Phase 1 only

| File | Change |
|------|--------|
| `admin.html` | `accept` on media input; optional video thumb markup hooks |
| `js/admin.js` | upload image\|video; library shape; delete → Worker; clear drafts |
| `worker/src/index.js` | `POST /media/delete` signed destroy |
| `css/admin.css` | minor: video thumb in `.media-item` if needed |
| `BLUEPRINT.md` | short pointer + media delete note |
| `README.md` | short pointer to this handoff |
| `HANDOFF-MEDIA-CMS.md` | this file |

---

## Secrets / env (Worker)

Already required: `ADMIN_PASSWORD`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`  
Optional: `CLOUDINARY_FOLDER` (default `wakanda-training`)

No new secrets for Phase 1 if those exist.

---

*End of handoff. Next action: implement Phase 1 checklist.*
