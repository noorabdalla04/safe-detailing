# Safe Detailing website

A single-page marketing site for a mobile car-detailing business in Ottawa.
Plain HTML / CSS / JS, no build step. Hosted on GitHub Pages.

## Live site
Published via GitHub Pages (see the repo's **Settings → Pages** for the URL).

## Edit it
- **Text, prices, services:** `index.html`
- **Colours, fonts, layout:** `assets/css/style.css` (palette lives in the `:root` block at the top)
- **Interactions** (before/after sliders, menu, form): `assets/js/main.js`
- **Photos:** `assets/img/` (`ba*-before/after.jpg` are the comparison sliders, `result*.jpg` the gallery)

## Things to confirm / change
- **Business name:** "Safe Detailing" is a working name. No business name was in the
  source material. To rename, search-and-replace `Safe Detailing` (and the `Safe` wordmark)
  across `index.html`.
- **Contact:** phone `(343) 571-4226` and email `Sayfudein3@gmail.com` are wired into the
  header, contact section, footer, and the booking form. Update those if they change.
- **Booking form:** submitting opens the visitor's email app pre-addressed to the email above
  (no server needed). For a true inbox form later, drop in a service like Formspree.

## Run locally
```
cd site-folder
python3 -m http.server 8000
# open http://localhost:8000
```
