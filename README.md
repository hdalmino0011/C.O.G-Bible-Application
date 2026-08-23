# COG (T.J.R) Bible

An offline-first Bible application with parallel Cebuano (Bugna) and English
(KJV) text. It is built as a Progressive Web App for phones and desktop
browsers.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

## Build

```bash
npm run lint
npm run build
```

The production files are written to `dist/`.

## Publish with GitHub Pages

1. Create a GitHub repository and push this folder to its `main` branch.
2. In the repository, open **Settings → Pages**.
3. Set **Source** to **GitHub Actions**.
4. Push to `main` again, or run **Deploy to GitHub Pages** from the
   repository's **Actions** tab.

The included workflow builds and deploys the app. The Vite configuration uses
relative paths so it works at a GitHub Pages project URL, not only at a
domain root.

## Offline use

Open the deployed site once while online, then install it from the browser's
**Add to Home Screen** or **Install app** option. The Bible database and
production JavaScript/CSS are precached by the service worker, so reading and
the app's local saved-data features remain available without internet access.