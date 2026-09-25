# Wakanda Training Website

Static multi-page website for **Wakanda Training** gym (Luanda, Angola).

## Stack
- Pure HTML + CSS + vanilla JS
- Design system: Minimalist Luxury (deep off-black + gold accent)
- Fully mobile-first
- Hosting: Cloudflare Pages (from GitHub `Workersdevao2/Wakanda-Training`)
- i18n: PT / EN (`js/i18n.js`)

## GitHub layout (current)
Site files live under the **`wakanda-training/`** folder in the repo (Cloudflare Worker is linked to that tree):

```
Wakanda-Training/
  wakanda-training/
    index.html
    pages/
    css/
    js/
    images/
    robots.txt
    sitemap.xml
    README.md
    googledc4e37b1da1d983c.html
  .github/workflows/   (optional; Actions not required for deploy)
```

**Deploy:** push to `main` → Cloudflare Git integration updates the live site.  
No GitHub Actions required for normal updates.

## Pages
| Page | File |
|------|------|
| Home | `index.html` |
| Sobre Nós | `pages/sobre.html` |
| Modalidades | `pages/modalidades.html` |
| Projetos (Gordus) | `pages/projetos.html` |
| Horários | `pages/horarios.html` |
| Preçário | `pages/precario.html` |
| Loja | `pages/loja.html` |
| Resultados | `pages/resultados.html` |
| Inscrição | `pages/inscricao.html` |
| Contacto | `pages/contacto.html` |

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
| Gymnastics | Thu 19h–20h |
| Weightlifting | Sat 10h–11h |
| G.A.P. | Sat 08h–09h |

## Events
Events are announced on **Instagram / social only** (no Eventos page on the site).

## Notable events
- **Wakanda Games Face to Face** — Ndombele vs Francisco, Master 35+, Sat 3 Oct (Coach Romário / Coach Wilson)
- **Gordus Project 90 Plus** — 21 Sep → 21 Dec 2026

## Folder map (what to edit where)
| Goal | Files |
|------|--------|
| Home hero slides | `index.html` + `images/hero-*.jpg/mp4` (hero-13 first = Face to Face) |
| About text/images | `pages/sobre.html` + `images/sobre-*.jpg` |
| Class list + times | `pages/modalidades.html` + `pages/horarios.html` |
| Prices / packs | `pages/precario.html` |
| Enrollment form (packs) | `pages/inscricao.html` + `js/main.js` |
| Resultados gallery / CTAs | `pages/resultados.html` + `images/resultado-*.jpg` + `transformacao-*.jpg` |
| Store products | `pages/loja.html` + product images |
| Team / coaches | `pages/sobre.html` + `images/coach-*.jpg` |
| PT/EN text | `js/i18n.js` |
| Styles (incl. `.cta-band`, packs, schedules) | `css/styles.css` |
| Nav / cart / WA forms | `js/main.js` |
| SEO sitemap / robots | `sitemap.xml`, `robots.txt` |
| SEO meta (canonical, OG) | `<head>` on each HTML page |

## Safe GitHub updates (Angola / unstable power)
**Do not** delete the whole repo folder to re-upload.

After every change, the assistant will list **exactly which files changed** so you can download only those and push to GitHub.

1. Note the **Files changed** list in the chat
2. Download only those paths from the project folder
3. In GitHub: open each file → Edit (pencil) **or** Upload files into the **same folders** (e.g. `pages/`, `images/`)
4. Commit message e.g. `Resultados: primary CTA transformation image`
5. Cloudflare redeploys automatically from `main`

If you only touch 2–5 files, risk of a long outage is much lower than replacing the entire tree.

## Features
- WhatsApp CTAs (`+244 940 668 530`) — forms + buttons (no floating button)
- Full-bleed CTA bands (`modalidades-hero.jpg` + text overlay) on most pages
- Language toggle PT | EN
- Client-side cart (Loja) + sticky cart bar on mobile
- Responsive nav (hamburger → X)
- SEO: canonical, Open Graph, Twitter cards, `robots.txt`, `sitemap.xml`, LocalBusiness JSON-LD
- **Preçário:** pack cards with prices + “Quero este pack” → WhatsApp
- **Inscrição (smart form):** fields depend on type — Modalidade → modality + plan + pack; Reinscrição; Gordus / trial → only relevant fields. Prefill via `?tipo=&plano=&pack=&mod=`. Modalidades deep-link with `mod=`. Optional checkbox for taxa inscrição 20.000 AKZ.
- **Preçário → Inscrição:** pack and avulsa buttons open Inscrição with options preset (not direct WhatsApp)
- **Horários:** poster-based schedule cards + sticky section nav (no per-slot WA buttons)

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

## Documentation habit
Update this **README** whenever features, schedules, prices, coaches, or deploy notes change.
## Design system
- Background `#0A0A0A` · Surface `#161616`
- Text `#F5F5F5` · muted `#A3A3A3`
- Gold `#F5C518`
- Font: Inter 300–500

## Local preview
```bash
npx serve .
```

## SEO
- Canonical + Open Graph + Twitter on every page
- `robots.txt` → allows crawl, points to sitemap
- `sitemap.xml` → all public URLs (`https://wakandatraining.com/...`)
- JSON-LD `HealthClub` on Home + Contacto (address, phone, geo, Instagram)
- Google Search Console: property `https://wakandatraining.com/` **verified** (HTML file `googledc4e37b1da1d983c.html`)
- Sitemap submitted → **Success** (11 pages discovered, 2026-09-23)
- Keep verification file at site root; do not delete it
- Local SEO next: Google Business Profile; keep NAP consistent on the site

## Deploy
Repo connected to Cloudflare Worker/Pages project **wakanda-training**.  
Live: `https://wakandatraining.com` and `https://www.wakandatraining.com`  
Preview: `https://wakanda-training.workersdevao.workers.dev`

## Contact
- WhatsApp: +244 940 668 530
- Email: teamwakandacf@gmail.com
- Instagram: @wakandatraining
- Address: Benfica, Rua Direita do BFA, defronte Ville Vermont, Luanda
