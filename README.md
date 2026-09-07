# Aleksei Shchetinin

This repository contains the source for my personal website: [alxy.sh](https://alxy.sh).

The site is a small static profile page with links to my professional and contact profiles.
Google Analytics 4 is configured through the `analytics.google_measurement_id` setting in
`config.yaml` and only loads after a visitor consents through the on-page dialog. Visitors
can accept or revoke consent through **Analytics settings** below the profile links.
Set the measurement ID to an empty string to disable analytics and its consent UI. Fonts are
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

The generated output includes `index.html`, optimized public image assets,
`robots.txt`, `sitemap.xml`, `llms.txt`, and `site.webmanifest`.

Asset generation expects `cwebp`, `ffmpeg` (with `ffprobe`) on `PATH` and reads the source
photo from `src/profile.jpeg` unless another path is passed as the first argument.

For content changes, edit `config.yaml`; for markup, edit `template.html`. Rebuild CSS
and regenerate HTML after either change, and commit the generated files with the sources.
`theme.js` and `analytics.js` are maintained directly, not generated.

## Validation and deployment

Run the regression checks before committing:

```bash
uv run python -m unittest discover -s tests
node --test tests/*.test.cjs
```

These check template escaping and missing fields, profile assets and metadata, and
analytics consent (including revocation and blocked storage). Also check the page in
a browser at narrow and desktop widths, with both themes and print styles.

GitHub Actions builds and tests pull requests. Pushes to `main` also deploy the public
files to GitHub Pages; the source photo and build tools are excluded from deployment.
CI rejects stale generated HTML, CSS, and search metadata.
