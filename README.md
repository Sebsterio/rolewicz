# Rolewicz TSL

[www.rolewicz-tsl.com](https://rolewicz-tsl.com)

Responsive, accessible, optimized, single-page brochure website

Built with gulp

---

## Features

### Translation

- Multi-langauge support (client-side)
- An artbitrary number of langauges supported
- Translation data loaded dynamically, stored on a Google Spreadsheet as database (using Tabletop)
- Browser langauge detection (client-side)
- Session persistance

### Optimization

- Optimal image resolution and proportions for each breakpoint
- Lazy-loading of `<img>` and background images; `noscript` fallback
- 2 levels of compression quality, high quality version loaded asynchroneously - initialized on lazy-load, and displayed when downloaded.
- Browser support detection (`.webp` and JS) and fallback on `.jpg`/`.png` versions
- Critical CSS inlined, non-critical deferred (with fallback for browsers that don't support `preload`)
- Text file compression (gzip)
- Mobile-first (mostly)

### Juice

- Multi-layer parallax image on landing page; disabled when not within viewport
- On-scroll img fade-in (with no-js fallback)
- Scroll-to-section on nav link click (with no-js fallback)

### Other

- Enforce HTTPS
- Cache-control
- Contact form without back-end (using an API)
- Works in all modern browsers and IE11

### TODO

- Separte dev and production builds
- Add langauge routes for no-JS users and redirect from main page
- Automate inlining critiacal CSS (landing page background image URLs)
- Remove unused CSS (95% of Boostrap file)
- Remove helper classes (e.g. .margin-b-50) for better separation of concerns

---

## Lighthouse report

Performance: 99% (short due hosting platform limitations)  
Accessibility: 95% (short due to some decorative text)  
Best Practices: 100%  
SEO: 100%

---

## Installation and use

Process SCSS, minify and concatenate CSS and JS:

- `$ npm run gulp`

Detect critical CSS:

- `$ npm run critical`
- Paste landinge-page-related CSS into `index.html` manually
