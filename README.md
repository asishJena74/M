# Birthday Website for Madhushree

A static birthday website made for GitHub Pages. It uses plain HTML, CSS, JavaScript, and local assets, so there is no build step.

## Files

- `index.html` - page content and structure
- `styles.css` - responsive visual styling
- `script.js` - background music controls, wishes, message popups, reveal effects, and confetti
- `assets/birthday-background-elegant.png` - active generated hero background
- `assets/birthday-background-twilight.png` - alternate generated twilight background
- `assets/birthday-hero.png` - alternate generated soft background image
- `assets/Cutie Patootie.mp3` - background music used by the page
- `assets/*.jpg` - personal photos used in the hero portrait and photo gallery

## Deploy On GitHub Pages

1. Create a GitHub repository.
2. Upload or push all files in this folder to the repository root.
3. Open the repository on GitHub.
4. Go to `Settings` > `Pages`.
5. Under `Build and deployment`, choose `Deploy from a branch`.
6. Select the `main` branch and `/root` folder.
7. Click `Save`.

GitHub will publish the site at a link like:

```text
https://your-username.github.io/your-repo-name/
```

## Notes

- GitHub Pages links are public to anyone who has the URL.
- The site uses only local files; no Google Fonts or third-party media are loaded.
- The background music uses `assets/Cutie Patootie.mp3`. The page attempts to play it automatically with sound when opened, but some browsers may require the first tap/click before allowing sound.

## Personalize

- Edit the letter and wishes in `index.html`.
- Replace or add photos inside `assets`, then update the image paths in `index.html`.
