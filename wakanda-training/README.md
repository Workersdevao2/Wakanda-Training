# Wakanda Training Website

Static multi-page website for **Wakanda Training** gym (Luanda, Angola).

## Stack

- Pure HTML + CSS + vanilla JS (no framework, no build step)
- Design system: Minimalist Luxury (deep off-black + gold accent)
- Fully mobile-first
- Hosting: Cloudflare Pages / Worker project **wakanda-training**
- i18n: PT / EN (`js/i18n.js`)
- **Admin + live catalog:** Cloudflare Worker `wakanda-publish` + Cloudinary
- Orders: WhatsApp (`+244 940 668 530`)

## Live URLs

| Role | URL |
|------|-----|
| Site | https://wakandatraining.com |
| Admin | https://wakandatraining.com/admin.html |
| Site Worker (preview) | https://wakanda-training.workersdevao.workers.dev |
| Publish API | https://wakanda-publish.workersdevao.workers.dev |

## GitHub layout

Site files live under the **`wakanda-training/`** folder in the repo:

```
Wakanda-Training/
  wakanda-training/
    index.html
    admin.html              # Staff panel (password-gated)
    pages/
    css/
      styles.css            # Public site
      admin.css             # Admin UI
    js/
      main.js               # Cart, catalog load, shop render
      products.js           # Seed products + zones (fallback)
      admin.js              # Admin CRUD + publish
      i18n.js
    images/
    worker/                 # Separate Cloudflare Worker (publish API)
      src/index.js
      wrangler.toml
      README.md
    BLUEPRINT.md            # Full admin/catalog architecture
    robots.txt
    sitemap.xml
    README.md
    googledc4e37b1da1d983c.html
```

**Deploy site:** push to `main` → Cloudflare updates the live site.  
**Deploy publish Worker:** `cd worker && npx wrangler deploy` (secrets stay on Cloudflare).

## Pages

| Page | File |
|------|------|
| Home | `index.html` |
| Admin (staff) | `admin.html` |
| Sobre Nós | `pages/sobre.html` |
| Modalidades | `pages/modalidades.html` |
| Projetos (Gordus) | `pages/projetos.html` |
| Horários | `pages/horarios.html` |
| Preçário | `pages/precario.html` |
| Loja | `pages/loja.html` |
| Resultados | `pages/resultados.html` |
| Inscrição | `pages/inscricao.html` |
| Contacto | `pages/contacto.html` |
| Checkout | `pages/checkout.html` |

## Admin panel + live catalog

Full detail: **BLUEPRINT.md**.

| Item | Value |
|------|--------|
| Admin UI | `/admin.html` |
| Local login fallback | `wakanda2026` (change after handoff) |
| Publish password | Worker secret `ADMIN_PASSWORD` |
| Seed products | `js/products.js` |
| Publish Worker | `wakanda-publish.workersdevao.workers.dev` |
| `PUBLISH_URL` | Already set in `js/admin.js` |
| Catalog (public) | `https://res.cloudinary.com/ogtzpc3v/raw/upload/wakanda-training/catalog.json` |
| Cloudinary cloud | `ogtzpc3v` |
| Unsigned media preset | `wakanda_unsigned` (folder `wakanda-training/media`) |

### Staff workflow

1. Open `/admin.html` → password  
2. **Inbox** — inscrição / perguntas / contactos (mark treated or open). Client still gets WhatsApp.  
3. Edit products / zones / site images / upload media  
4. **Guardar rascunho** — only this browser (preview Loja on same device)  
5. **Publicar na loja** — writes `catalog.json` via Worker; all visitors get new data on next load  

No site redeploy needed for price or product photo changes.

Site forms (`wa-form`) POST to Worker `/submit` then open WhatsApp. Inbox requires KV namespace `SUBMISSIONS` — see `worker/README.md`.

### Data load order (public shop)

1. `products.js` defaults  
2. Remote `catalog.json` (versioned URL preferred after publish)  
3. localStorage drafts (`wt_*_override`) win on the admin’s browser  

### Worker secrets (already set)

```bash
cd worker
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put CLOUDINARY_CLOUD_NAME    # ogtzpc3v
npx wrangler secret put CLOUDINARY_API_KEY
npx wrangler secret put CLOUDINARY_API_SECRET
```

Redeploy Worker after code changes:

```bash
cd worker && npx wrangler deploy
```

## Modalidades (official schedule)

| Modalidade | Schedule |
|------------|----------|
| Hyrox | Mon–Fri 05h–09h · Sat 07h |
| CrossFit | Mon–Fri 17h–20h · Sat 09h, 11h |
| Musculação | Mon–Fri 05h–21h · Sat–Sun 07h–14h |
| Kickboxing | Tue/Thu 18h30–20h30 · Sat 08h30–09h30, 10h30–11h30 |
| Judô | Tue/Thu 17h30–18h30 |
| Jiu Jitsu | Mon/Wed/Fri 09h–10h, 16h30–17h30 |
| Functional Kids | Mon–Fri 16h–17h · Sat 08h–09h |
| Zumba | Mon/Wed/Fri 19h00 |
| Ginástica Rítmica | Tue/Thu 16h30–17h30 · Sat 10h30–12h00 · mensalidade 45.000 KZ |
| Weightlifting | Sat 10h–11h |
| G.A.P. | Sat 08h–09h |

## Events

Events are announced on **Instagram / social only** (no Eventos page on the public nav as primary).

Notable:

- **Wakanda Games Face to Face** — Ndombele vs Francisco, Master 35+, Sat 3 Oct (Coach Romário / Coach Wilson)
- **Gordus Project 90 Plus** — 21 Sep → 21 Dec 2026

## Manual upload (GitHub only)

- **`images/hero-5.mp4`** — add manually on GitHub into `wakanda-training/images/` if missing. Required for the home hero carousel.

## Hero carousel (current)

1. `hero-1.mp4`  
2. `hero-2.jpg`  
3. `hero-3.mp4`  
4. `hero-4.jpg`  
5. `hero-5.mp4` (manual upload)  
6. `hero-6.jpg`  
7. `hero-7.mp4`  
8. `hero-8.mp4` — Judo / BJJ training  
9. `hero-9.mp4` — Corporate / team activation  
10. `hero-10.mp4`  

## Folder map (what to edit where)

| Goal | Files |
|------|--------|
| Home hero slides | `index.html` + `images/hero-*.jpg/mp4` |
| About text/images | `pages/sobre.html` + `images/sobre-*.jpg` / `coach-*.jpg` |
| Class list + times | `pages/modalidades.html` + `pages/horarios.html` |
| Prices / packs | `pages/precario.html` |
| Enrollment form | `pages/inscricao.html` + `js/main.js` |
| Resultados gallery | `pages/resultados.html` + `images/resultado-*.jpg` |
| **Store products / prices** | **Admin → Publicar** (or seed `js/products.js`) |
| Team / coaches | `pages/sobre.html` + `images/coach-*.jpg` |
| PT/EN text | `js/i18n.js` |
| Public styles | `css/styles.css` |
| Admin styles | `css/admin.css` |
| Nav / cart / WA / catalog load | `js/main.js` |
| Admin CRUD / publish | `js/admin.js` |
| Publish API | `worker/src/index.js` |
| SEO | `sitemap.xml`, `robots.txt`, page `<head>` |

## Safe GitHub updates (Angola / unstable power)

**Do not** delete the whole repo folder to re-upload.

1. Note the **Files changed** list in chat  
2. Download only those paths  
3. In GitHub: edit or upload into the **same folders**  
4. Commit → Cloudflare redeploys from `main`  

Worker code changes need `npx wrangler deploy` from `worker/` separately.

## Features

- WhatsApp CTAs (`+244 940 668 530`) — forms + buttons  
- Full-bleed CTA bands on most pages  
- Language toggle PT \| EN  
- Client-side cart (Loja) + sticky cart bar on mobile  
- **Live product catalog** via Cloudinary + admin publish  
- Responsive nav (hamburger → X)  
- SEO: canonical, Open Graph, Twitter cards, `robots.txt`, `sitemap.xml`, LocalBusiness JSON-LD  
- **Preçário:** pack cards + “Quero este pack” → Inscrição / WhatsApp  
- **Inscrição (smart form):** fields depend on type; prefill via query params  

## Coaches (Sobre nós)

| Order | Name | Role |
|-------|------|------|
| 1 | Romário N'gama | Coach |
| 2 | — | (name TBD) |
| 3 | — | (name TBD) |
| 4 | Wilson Benjamim | Head Coach |
| 5 | Sérgio Monteiro | Coach |
| 6 | — | (name TBD) |

Photos: `images/coach-01.jpg` … `coach-06.jpg`

## Header system

- **Announce bar** (36px): Gordus 90+ CTA → Projetos; hides on scroll down  
- **Main header**: transparent over hero → solid on scroll  
- **Brand**: text (WAKANDA TRAINING / HIGH PERFORMANCE) in **Anton**  
- **Desktop** (≥900px): brand above centered nav  
- **Mobile**: hamburger left · brand center · lang/cart right · left drawer  

## Design system

- Background `#0A0A0A` · Surface `#161616`  
- Text `#F5F5F5` · muted `#A3A3A3`  
- Gold `#F5C518`  
- Body: **Inter** 300–500  
- Display / headings / brand: **Anton**  

## Local preview

```bash
npx serve .
# then open http://localhost:3000 and /admin.html
```

## SEO

- Canonical + Open Graph + Twitter on every page  
- `robots.txt` → sitemap  
- `sitemap.xml` → public URLs (`https://wakandatraining.com/...`)  
- JSON-LD `HealthClub` on Home + Contacto  
- Google Search Console verified (`googledc4e37b1da1d983c.html`)  
- Do not delete the verification file  

## Contact

- WhatsApp: +244 940 668 530  
- Email: teamwakandacf@gmail.com  
- Instagram: @wakandatraining  
- Address: Benfica, Rua Direita do BFA, defronte Ville Vermont, Luanda  

## Documentation habit

Update this **README** and **BLUEPRINT.md** when features, deploy URLs, or admin/catalog setup change.
