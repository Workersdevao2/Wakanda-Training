# Decifer Sport Resort — Website

Pure HTML / CSS / JS website ready for **Cloudflare Pages** + **GitHub**.

## Structure

```
decifer-website/
├── index.html          → Home
├── desporto.html       → Futebol, Padel, Natação, Jiu-Jitsu (preços e horários)
├── alojamento.html     → 32 Suítes (Suite Casal & Quarto Duplo)
├── eventos.html        → Casamentos, corporativos, toldos, esplanada, sala
├── espacos.html        → Aluguer de espaços e campos
├── contacto.html       → Contacto & formulário
├── css/styles.css
├── js/main.js
└── README.md
```

## Contactos oficiais (do brochure)

- **Telefone / WhatsApp:** +244 936 724 676
- **Padel reservas:** +244 929 797 204
- **Email:** reservas@decifersportresort.co.ao
- **Morada:** Rua do Centro de Distribuição da EPAL, Benfica II, Lar do Patriota

## Deploy on Cloudflare Pages

1. Create a new GitHub repository
2. Push this folder to the repo
3. Cloudflare Dashboard → Pages → Create project → Connect to Git
4. Build settings: Framework preset **None**, output directory `/`
5. Deploy

## Notes

- Images are from Unsplash (hotlinked). For production, host locally or via Cloudflare Images.
- Form shows a simple alert. Connect to Formspree, Getform, or a Cloudflare Worker for real submissions.
- Mobile sticky CTA bar appears on small screens.
- Preços e horários sincronizados com o brochure oficial Decifer Sport Resort.

## Style principles

- Thin borders, light typography (Inter), accent lime green matching brand
- Premium, calm, contemporary look
