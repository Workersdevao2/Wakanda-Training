# Wakanda Training Website

Static multi-page website for **Wakanda Training** gym (Luanda, Angola).

## Stack
- Pure HTML + CSS + vanilla JS
- Design system: Minimalist Luxury adapted (deep off-black + gold accent, thin lines, light typography)
- Fully mobile-first
- Hosting target: Cloudflare Pages (from GitHub)

## Pages
| Page | File |
|------|------|
| Home | `index.html` |
| Sobre Nós | `pages/sobre.html` |
| Modalidades | `pages/modalidades.html` |
| Projetos (Gordus) | `pages/projetos.html` |
| Horários | `pages/horarios.html` |
| Loja | `pages/loja.html` |
| Eventos | `pages/eventos.html` |
| Resultados | `pages/resultados.html` |
| Contacto | `pages/contacto.html` |

## Features
- All CTAs open WhatsApp with pre-filled messages (`+244 940 668 530`)
- Floating WhatsApp button on every page
- Product images in Loja (t-shirts, bands, gloves, wraps, jump rope)
- Responsive navigation (desktop links + animated hamburger → X)
- Consistent design system across all pages

## Design System (summary)
- Background: `#0A0A0A`
- Surface: `#161616`
- Text: `#F5F5F5` / muted `#A3A3A3`
- Accent: `#F5C518` (gold)
- Borders: 1–1.5px, soft radius 6px
- Font: Inter 300–500

## Local preview
Open `index.html` directly or run:
```bash
npx serve .
```

## Deploy to Cloudflare Pages
1. Push this folder to a GitHub repo
2. Connect the repo to Cloudflare Pages
3. Build command: leave empty (static)
4. Output directory: `/` (root of the repo)

## Next possible improvements
- Add real gym photos / transformation photos to Resultados
- Google Maps embed on Contacto
- Simple blog or event archive with Markdown later
- Member area / booking when needed
