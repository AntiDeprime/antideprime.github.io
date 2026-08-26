# Aleksei Shchetinin

This repository contains the source for my personal website: [alxy.sh](https://alxy.sh).

The site is a small static profile page with links to my professional and contact profiles.
Google Analytics 4 is configured through the `analytics.google_measurement_id` setting in
`config.yaml` and only loads after a visitor consents through the on-page banner. Fonts are
self-hosted from `assets/fonts/`.

## Build

Install dependencies and regenerate the static site from the repository root:

```bash
uv sync --locked
npm ci
./scripts/build_assets.sh
npm run build:css
uv run python generate.py
```

The generated output includes `index.html`, `analytics.js`, optimized public image assets,
`robots.txt`, `sitemap.xml`, `llms.txt`, and `site.webmanifest`.

Asset generation expects `cwebp`, `ffmpeg` (with `ffprobe`) on `PATH` and reads the source
photo from `src/profile.jpeg` unless another path is passed as the first argument.
