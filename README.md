# YAPONAMAMA · The Art of Sushi

An unofficial restaurant concept for Uzbekistan’s Yaponamama. Russian is the default language. The language selector translates the hero, navigation, menu names and categories, search, and cart into Uzbek and English. The long-form story and editorial sections are in Russian.

## Run locally

Requires Node.js 20.9 or newer. From the project directory:

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For a production check and static export:

```sh
npm run typecheck
npm run lint
npm run build
python -m http.server 3000 --directory out
```

The production build is in `out/`. Any static host that serves `index.html` and the `_next/` and `assets/` directories can host it.

Run the interaction suite with a local server running:

```sh
npx playwright install chromium
npx playwright test
```

Set `YAPONAMAMA_TEST_URL` for a different preview URL, or `YAPONAMAMA_CHROMIUM=/path/to/chromium` to use an installed Chromium binary.

## Story and menu

`scenes/timeline.ts` contains the seven chapter thresholds, colors, copy, and easing utility. In `scenes/SushiScene.tsx`, each animation samples the same normalized progress provided by ScrollTrigger. The nori sheet bends around the fillings, with instanced rice and bamboo following its curvature. Eight cross-section meshes separate in sync with the knife, move onto a plate, and enter the hinged box. The package viewer reuses the box model. The desktop story pins for five viewport heights and phones use a shorter sequence. On reduced-motion or unavailable WebGL settings, the chapter controls and packaging illustration remain available.

The demo cart lives in local storage. Its quantities and prices never leave this site. The checkout link opens the official Yaponamama storefront without transferring the cart.

## Brand, images and production data

- The [Yaponamama storefront](https://yaponamama.uz/brand/yaponamama) and [official restaurant directory](https://yaponamama.uz/where-to-go) are the reference for outbound links. Branch cards use reservation links found on the official site. The cards do not infer opening hours, addresses, or phone numbers.
- The wordmark is concept typography. If the owner supplies an approved SVG, put it in `public/assets/` and replace `Wordmark` in `components/Graphic.tsx`. For the box, replace the canvas print in `scenes/PackagingModel.tsx` with an owner-approved, transparent logo texture or composite the supplied logo onto the lid artwork. Keep the existing lid plane and hinge pivots.
- Hero and dish photographs are original generated illustrations for the concept. They are not images of the restaurant’s products. Replace `hero.webp` and the `dish-*.webp` assets with approved photographs. Keep the hero subject on the right, add alt text as appropriate, and update the mapped filenames in `data/menu.ts` and `components/Editorial.tsx`.
- The procedural meshes and materials are checked into the project as TypeScript. No external 3D models or GLB files are required. If replacing the sushi with a licensed 3D model, preserve the stage interface and the bendable sheet or supply an equivalent scroll-seekable animation.
- The catalog uses names checked against the storefront where available, plus sample dishes. Every price and description is illustrative. Replace the menu records with owner-approved product data before production. The locale dictionaries live in `lib/i18n.ts`.
- Manrope and Unbounded are distributed under their bundled OFL licenses in `public/assets/`.
