# Portfolio

A fast, accessible, responsive personal portfolio with light/dark mode. Pure HTML/CSS/JS – no build step required.

## Getting started

- Open `portfolio/index.html` directly in your browser, or
- Use a simple static server for proper routing and faster reloads.

### Using VS Code Live Server (or any static server)
- Install Live Server extension
- Right‑click `index.html` → "Open with Live Server"

Or with Node:

```bash
npx serve portfolio
```

Then visit the URL printed in the terminal.

## Customise

- Replace "Your Name" and text in `index.html`
- Update social links in the Contact section
- Swap the avatar initials in the hero or use an `<img>`
- Add your projects in `scripts/main.js` within the `projects` array
- Adjust colours or spacing in `styles/main.css` CSS variables
- Put your CV at `portfolio/YourName_CV.pdf` or update the link

## Deploy

This works on any static host (GitHub Pages, Netlify, Cloudflare Pages, Vercel static).

- For GitHub Pages, place the `portfolio/` folder at the repo root or configure Pages to serve from it.

## Licence

MIT 