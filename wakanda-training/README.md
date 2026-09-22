# Wakanda Training Website

Static multi-page website for **Wakanda Training** gym (Luanda, Angola).

## Stack
- Pure HTML + CSS + vanilla JS
- Design system: Minimalist Luxury (deep off-black + gold accent)
- Fully mobile-first
- Hosting: Cloudflare Pages (from GitHub `Workersdevao2/Wakanda-Training`)
- i18n: PT / EN (`js/i18n.js`)

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
| Eventos | `pages/eventos.html` |
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

## Notable events
- **Wakanda Games Face to Face** — Ndombele vs Francisco, Master 35+, Sat 3 Oct (Coach Romário / Coach Wilson)
- **Gordus Project 90 Plus** — 21 Sep → 21 Dec 2026

## Folder map (what to edit where)
| Goal | Files |
|------|--------|
| Home hero slides | `index.html` + `images/hero-*.jpg/mp4` |
| About text/images | `pages/sobre.html` + `images/sobre-*.jpg` |
| Class list + times | `pages/modalidades.html` + `pages/horarios.html` |
| Events | `pages/eventos.html` + `images/evento-*.jpg` |
| Store products | `pages/loja.html` + product images |
| PT/EN text | `js/i18n.js` |
| Styles | `css/styles.css` |
| Nav / cart / WA | `js/main.js` |

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
- WhatsApp CTAs (`+244 940 668 530`)
- Floating WhatsApp button
- Language toggle PT | EN
- Client-side cart (Loja)
- Responsive nav (hamburger → X)

## Design system
- Background `#0A0A0A` · Surface `#161616`
- Text `#F5F5F5` · muted `#A3A3A3`
- Gold `#F5C518`
- Font: Inter 300–500

## Local preview
```bash
npx serve .
```

## Deploy
Repo connected to Cloudflare project **wakanda-training**.  
Domain: `wakandatraining.com`.

## Contact
- WhatsApp: +244 940 668 530
- Email: teamwakandacf@gmail.com
- Instagram: @wakandatraining
- Address: Benfica, Rua Direita do BFA, defronte Ville Vermont, Luanda
