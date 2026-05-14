# Aleksei Shchetinin

This repository contains the source for my personal website: [alxy.sh](https://alxy.sh).

The site is a small static profile page with links to my professional and contact profiles.

## Build

Install dependencies and regenerate the static site from the repository root:

```bash
uv sync --locked
npm ci
./scripts/build_assets.sh
npm run build:css
uv run python generate.py
```

The generated output includes `index.html`, optimized public image assets, `robots.txt`,
`sitemap.xml`, `llms.txt`, and `site.webmanifest`.

Asset generation expects `cwebp` and `ffmpeg` on `PATH`.
