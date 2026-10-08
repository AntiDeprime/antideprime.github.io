# Tasks

## Planned Tasks

- [ ] Keep this list for scoped, pre-planned work items.

## Ad-hoc Tasks

- [x] Review fitness, consent controls, accessibility, build dependencies, and regression coverage; fix and validate findings.
- [x] Migrate repository workflow from `pip`/`requirements.txt` to `uv`.
- [x] Harden Tailwind/runtime config loading, generator validation, and Pages workflow checks.
- [x] Fix Firefox dark-mode toggle regression, clean layout spacing, and add search/social preview metadata.
- [x] Simplify `README.md` into a visitor-facing personal website note.
- [x] Upgrade the personal page with optimized assets, static Tailwind CSS, richer profile metadata, and LLM-readable site facts.
- [x] Add Google Analytics 4 tracking for the production website.
- [x] Full project review: restore CSS lost to Tailwind content scan, derive metadata from config, unblock theme toggle on mobile, self-host fonts with consent-gated analytics, deduplicate CI jobs, and clean up dead code/config.
- [x] Test desktop/mobile behavior, repair the consent dialog, and simplify duplicated content and client-side state handling.
- [x] Redesign the site as the "Shell" direction: Geist typography, system-following light/dark theme, hand-written modern CSS, non-blocking consent banner.
- [x] Make the design more professional: drop the terminal `whoami`/monospace styling, use a calmer blue accent, a round portrait and a plain role line.

## Completion Log

- 2026-10-08: Toned the "Shell" design down to a more professional register. Removed the `whoami` prompt, the `alxy.sh` wordmark and the monospace key/value block; the header now holds only the theme toggle. The profile reads as a round portrait, a smaller name, a plain role line ("AI R&D at Action1"), location with previous employer, and the summary, followed by a link list with capitalized names and muted handles. Swapped the amber accent for blue, dropped the Geist Mono font files and preload (Geist only), and gave wide screens a vertically centered two-column layout. Verified generation, the Python and Node tests, and Chromium at 320–1920px in both themes.
- 2026-10-08: Redesigned the page as the "Shell" direction (monospace key/value profile, links list, amber accent). Replaced Tailwind and its npm toolchain with one hand-written `styles.css` (cascade layers, native nesting, `light-dark()` tokens, responsive layout, forced-colors and print support) and removed `package.json`, `package-lock.json`, `tailwind.config.js` and `styles.input.css` along with the CI install/build steps. Swapped Outfit and Plus Jakarta Sans for self-hosted Geist and Geist Mono variable fonts (Latin and Latin Extended, preloaded, with the OFL license) and added a 256px portrait. The theme follows the system scheme with a remembered manual override; the analytics consent dialog became a non-blocking banner and its measurement ID moved from an inline global to a data attribute, so analytics markup disappears when disabled. Split `render_index` out of `generate.py`, dropped the unused `layout` and `aria_label` config, and added structural page tests plus theme tests. Verified in Chromium at 320–1920px in both themes, with JavaScript disabled, keyboard navigation, print and forced colors, and a clean axe scan.
- 2026-09-07: Reviewed the site as a static professional profile. Added reusable analytics settings and immediate opt-out, suppressed consent UI when tracking is disabled, repaired dark-theme link contrast and print colors, allowed narrow-screen social labels to wrap, enabled strict Jinja undefined checks, and updated the vulnerable transitive CSS selector parser. Added eight dependency-free regression checks to CI and documented the build/deployment workflow. Verified locked installs, image/CSS/HTML generation, zero npm audit vulnerabilities, browser widths 320–1440, dark mode, printing, and accept/revoke/reload behavior with the external analytics script stubbed.
- 2026-04-23: Initialized task tracker structure.
- 2026-04-23: Migrated docs and GitHub Actions workflow to `uv`; removed `requirements.txt`.
- 2026-04-23: Added generated-output CI guard, narrowed Pages artifact contents, and simplified CSS/JS runtime behavior.
- 2026-05-12: Restored dark-first theme behavior, tightened profile card spacing, added canonical/social/JSON-LD metadata, and generated `robots.txt`/`sitemap.xml`.
- 2026-05-12: Removed setup and contributor workflow details from `README.md`.
- 2026-05-14: Added optimized metadata assets, static Tailwind build output, ProfilePage JSON-LD, GitHub profile link, `llms.txt`, and manifest/icon support.
- 2026-05-14: Updated the profile summary copy to a first-person AI leadership positioning.
- 2026-07-22: Added configurable Google Analytics 4 tracking and updated the measurement ID to `G-JWD1WMJEDF`.
- 2026-08-26: Repaired link-hover/bio styles that Tailwind's content scan silently dropped, moved employment/location/theme colors into `config.yaml`, made the theme toggle work on mobile, self-hosted fonts, gated analytics behind a consent banner, merged the duplicate CI jobs in favor of a single build with `setup-uv`, and removed dead config/markup (keywords meta, `og:image:secure_url`, unused platforms, boilerplate project description).
- 2026-08-26: Bumped transitive `postcss` to 8.5.26 and `nanoid` to 3.3.18 to clear the two open Dependabot alerts; rebuilt `styles.css` with the updated toolchain.
- 2026-08-26: Reworked consent UI into a bottom sheet on mobile with a centered dialog on desktop, and moved the theme toggle into the profile card so no control overlaps page content; restored vertical centering on mobile.
- 2026-08-27: Replaced the conflicting responsive consent overlay with an accessible native modal, made analytics loading idempotent, enabled template autoescaping, removed duplicated employment markup from config, simplified theme state updates, and verified desktop/mobile behavior in the browser.
