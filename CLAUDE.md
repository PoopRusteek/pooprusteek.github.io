# CLAUDE.md

Guidance for Claude Code (and any other agent) working in this repository.

## What this is

The website for **PoopRusteek** (`../pooprusteek`) — a free, terminal-native
Rust TUI coding agent driving DeepSeek's reverse-engineered web API. This repo
is the *website about it*, not the agent itself.

Ten pages in two languages, every one prerendered to static HTML and hydrated
by React: `/`, `/download`, `/alternatives`, `/vs/claude-code`, `/vs/codex`,
`/vs/gemini-cli`, `/rag`, `/serve`, `/architecture`, `/faq`, and the same
under `/ru/`. No backend, no state library.

Stack: **Bun** (runtime + package manager — never npm/pnpm/yarn), **Vite 8**,
**React 19 + TypeScript (strict)**, **Tailwind v4** (CSS-first config via
`@theme` in `src/index.css`, no tailwind.config file), **Motion 12**
(`motion/react`), **i18next**, **oxlint**.

```sh
bun install
bun dev              # http://localhost:5173/pooprusteek/  (client-rendered)
bun run build        # tsc → vite build → vite build --ssr → scripts/prerender.ts
bun run preview      # serves dist/ at http://localhost:4173/pooprusteek/
bun run lint         # oxlint (no output = clean)
```

## Invariants — break these and the site breaks

1. **One source, two homes, and the base decides which.** The default build
   (`SITE_BASE` = `/pooprusteek/`) is the demo slot at `aaaver.ru/pooprusteek/`
   and must equal the aaaver-app slug. GitHub Pages (`pooprusteek.github.io`,
   the primary address) builds the same tree with `SITE_BASE=/` — see
   `.github/workflows/pages.yml`. All build-time settings live in
   `site.config.ts`. `src/lib/route-store.ts` strips
   `import.meta.env.BASE_URL` off the path, so never hard-code either prefix.
2. **Render must not touch the browser.** Every page is rendered by
   `react-dom/server` at build time and then *hydrated*; the first client
   render has to produce the same markup. So during render: no `window`,
   `navigator`, `localStorage`, `matchMedia`, `Date.now()` or
   `Math.random()`. Browser-dependent state starts neutral and is filled in
   an effect — see `usePlatform` (returns `undefined` until asked),
   `useHydrated` and `useReducedMotionSafe` in `src/lib/`. External stores
   (`theme-store`, `route-store`) return the same snapshot on server and
   client. A hydration mismatch shows up as a `console.error` — the test in
   "Verifying changes" catches it.
3. **The language is in the URL.** `/download/` is English, `/ru/download/`
   is Russian; `route-store.ts` parses the prefix and switches i18next
   before anything renders. Never pick a language from storage or the
   browser — search engines only see URLs, and a prerendered page must
   hydrate in the language it was rendered in. Internal links go through
   `ui/Link`, which keeps the current language and always ends non-root
   paths in `/` (the prerendered `route/index.html` and the canonical URL).
4. **A new route touches four places:** `ROUTES` in `route-store.ts`,
   `PAGE_META` in `src/lib/pages.ts` (meta key + JSON-LD kind), `PAGES` in
   `App.tsx`, and `meta.<key>.{title,desc,crumb}` in both locales. The
   prerenderer, sitemap, hreflang and llms.txt follow from those.
5. **The palette is not yours to invent.** Every color token in
   `src/index.css` `@theme` is the `default` (Midnight) preset from
   `pooprusteek/src/tui/theme.rs`, and `src/lib/themes.ts` carries all ten
   presets. New UI uses existing tokens (`ink`, `panel`, `panel-deep`, `fg`,
   `accent`, `accent-dim`, `accent-soft`, `focus`, `line`, `dim`, `soft`,
   `err`, `ok`, `warn`, `sel`) — **never a hard-coded hex**: the theme store
   repaints the page by rewriting those variables on `:root`. A literal
   color (Motion `animate`, inline `style`) comes from `useTheme().colors`.
6. **One font: JetBrains Mono Variable.** No second typeface.
7. **Download links come from the GitHub API, never from a literal.**
   `src/lib/release.ts` picks the newest release that ships every required
   asset and `src/lib/install.ts` spells the matching command (with
   `--channel dev` while that's the recommended build). The static
   `FALLBACK` (rolling `dev` tag) renders in the HTML and whenever GitHub is
   unreachable; keep its asset names in sync with
   `pooprusteek/scripts/ci/collect-assets.sh`.
8. **Every JS-timer animation respects reduced motion** through
   `useReducedMotionSafe()`, with a static end state.
9. **Don't put Tailwind `transition-*` classes on `motion.*` elements.**
10. **Grid children that must shrink need `min-w-0`.** Wide tables go in an
    `overflow-x-auto` wrapper; the page itself never scrolls sideways.
11. **Copy is English first**: `locales/en.ts` is the source of truth and
    `ru.ts` is typed `typeof en`, so an untranslated key fails the build.
    Russian copy is written for Russian searches, not machine-translated.
    Real TUI strings (badges, slash commands, config snippets) stay verbatim
    in components.
12. **Claims are checkable.** Numbers about PoopRusteek come from the agent
    repo. **Facts about other tools** (Claude Code, Codex CLI, Gemini CLI,
    aider, OpenCode) come from their official docs or repositories, carry a
    "checked on" date and a sources list on the page, and never state that a
    competitor *lacks* something unless that is verified. Comparison pages
    say when the competitor is the better choice — that honesty is the point.
13. **No comments in shipped HTML.** `index.html` is a template the
    prerenderer rewrites; explanations belong in `scripts/prerender.ts`.

## Repo map

- `site.config.ts` — base, site URL, canonical URL, IndexNow key.
- `scripts/prerender.ts` — renders every route × language into
  `dist/[ru/]<route>/index.html` with a per-page `<head>` (title,
  description, canonical, hreflang, Open Graph, JSON-LD), `404.html`, and
  for the primary build `sitemap.xml`, `robots.txt`, `llms.txt` and the
  IndexNow key file.
- `scripts/indexnow.ts` — submits the live sitemap to IndexNow after deploy.
- `src/entry-server.tsx` — the SSR entry the prerenderer imports.
- `src/main.tsx` — hydrates when the root was prerendered for the URL's
  route and language, client-renders otherwise.
- `src/App.tsx` — route → page, and the `<head>` effect for client navigation.
- `src/lib/`
  - `route-store.ts` — pages × languages router (`usePlace`, `navigate`, `href`, `parse`).
  - `pages.ts` — route → meta key and JSON-LD kind.
  - `theme-store.ts` + `themes.ts` — the ten TUI presets.
  - `release.ts`, `use-release.ts`, `install.ts`, `platform.ts` — downloads.
  - `use-hydrated.ts` — `useHydrated`, `useReducedMotionSafe`.
- `src/pages/` — `Home`, `Download`, `Alternatives`, `Versus` (all three
  `/vs/*` pages, copy under `vs.<id>`), `Rag`, `Serve`, `Architecture`, `Faq`.
- `src/components/` — home sections (`Hero`, `InstallSection`, `Switching`,
  `Features`, `ZeroDollars`, `GoalLoop`, `RagTeaser`, `Commands`,
  `ServeTeaser`, `ThemeGallery`, `TechStrip`), chrome (`Nav`, `Footer`,
  `StatusBar`, `ThemePicker`), and `ui/` building blocks.
- `public/og.png` — 1200×630 link preview; `docs/hero.webp` — README shot.

## Verifying changes

1. `bun run build` and `bun run lint`.
2. Check the static HTML without a browser: `dist/<route>/index.html` must
   contain the page's text, one `<h1>`, the right `<html lang>`, canonical,
   hreflang and a JSON-LD block that parses.
3. `bun run preview`, then drive a headless browser over **every route in
   both languages**, desktop 1440×900 and mobile 390×844. Required: no
   `console.error` (hydration mismatches land there), `<html lang>` matches
   the URL, and `scrollWidth > clientWidth` is `false` while scrolling the
   whole page (sections reveal on `whileInView`; scroll before full-page
   screenshots).
4. Click through: nav link → back button, language switch (same page,
   other language), a theme change surviving a reload.
5. For the Pages variant, build with `SITE_BASE=/ SITE_URL=… CANONICAL_URL=…`
   and serve `dist/` with a plain static server (no SPA fallback).
6. Hero screenshots: wait for `[GOAL DONE]` inside the demo box, not
   anywhere on the page (several sections quote that badge).
   `docs/hero.webp` is 1440×1120 lossless WebP; `public/og.png` 1200×630.

## Deploying

Both targets build in CI, each workflow guarded by `github.repository`:

- **GitHub Pages** (primary) — `git push pages develop:main` to
  `PoopRusteek/pooprusteek.github.io`. `pages.yml` builds with `SITE_BASE=/`,
  deploys, then pings IndexNow.
- **aaaver.ru** — `git push origin develop` to `Aver005/pooprusteek-landing`.
  `demo.yml` reuses `Aver005/aaaver-app/.github/workflows/site-release.yml`
  to publish a `latest` release with `dist.tar.gz`; `sites-updater` on the VDS
  polls it every ten minutes and swaps `sites/pooprusteek/`. A manual copy
  into that folder is replaced as soon as the registered release changes.

## Conventions

- One file per section in `src/components/`, shared pieces in `ui/`, default
  export, local helpers below it.
- Reveal-on-scroll uses the shared `rise`/`stagger` variants with
  `viewport={viewportOnce}`.
- Commits are the user's job; don't commit or push unless explicitly asked.
  Style: Conventional Commits with gitmoji and a Keep a Changelog body.
