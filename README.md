# Birthday Website for Madhushree

A static birthday website made for Netlify. It uses plain HTML, CSS, JavaScript, and local assets, so there is no build step.

## Files

- `index.html` - page content and structure
- `styles.css` - responsive visual styling
- `script.js` - wishes, message popups, reveal effects, and confetti
- `netlify.toml` - Netlify publish settings and security/privacy headers
- `robots.txt` - asks search engines not to crawl the site
- `assets/birthday-background-elegant.png` - active generated hero background
- `assets/birthday-background-twilight.png` - alternate generated twilight background
- `assets/birthday-hero.png` - alternate generated soft background image
- `assets/*.jpg` - personal photos used in the hero portrait and photo gallery

## Deploy on Netlify

1. Go to `https://app.netlify.com/drop`.
2. Drag this whole folder into Netlify Drop.
3. Netlify will publish it as-is and give you a `netlify.app` link.
4. In Netlify site settings, rename the site to a hard-to-guess name before sharing.

## Privacy And Security

- The site blocks search indexing with `robots.txt`, a robots meta tag, and `X-Robots-Tag`.
- The site uses only local files; no Google Fonts or other third-party requests are loaded.
- Security headers are configured in `netlify.toml`, including CSP, frame blocking, no-referrer, and no-store caching.
- The public Netlify link is still accessible to anyone who has it. For real password protection, enable Netlify password protection on a paid plan or use a provider with access control.

## Personalize

- Edit the letter and wishes in `index.html`.
- Replace or add photos inside `assets`, then update the image paths in `index.html`.
