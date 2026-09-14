# CLAUDE.md

Guidance for Claude Code (and any other agent) working in this repository.

## What this is

The marketing site for **PoopRusteek** (`../pooprusteek`) — a free,
terminal-native Rust TUI coding agent driving DeepSeek's reverse-engineered
web API. This repo is the *website about it*, not the agent itself.

Five pages, no backend, no state library: a landing page plus
`/download`, `/rag`, `/serve` and `/architecture`.

Stack: **Bun** (runtime + package manager — never npm/pnpm/yarn), **Vite 8**,
**React 19 + TypeScript (strict)**, **Tailwind v4** (CSS-first config via
`@theme` in `src/index.css`, no tailwind.config file), **Motion 12**
(`motion/react` — the framer-motion successor), **oxlint**.

```sh
bun install
bun dev              # http://localhost:5173/pooprusteek/
bun run build        # tsc -b && vite build → dist/
bun run preview      # serves dist/ at http://localhost:4173/pooprusteek/
bun run lint         # oxlint (no output = clean)
```

## Invariants — break these and the site breaks

1. **`base: '/pooprusteek/'` in `vite.config.ts` must equal the deploy slug.**
   The site is served by aaaver-app from `sites/pooprusteek/` at
   `aaaver.ru/pooprusteek/`. Dev and preview URLs also live under that base —
   `http://localhost:5173/` alone 404s. `src/lib/route-store.ts` strips the
   same base off `location.pathname`, so a changed slug breaks routing too.
2. **Deep links only work because the host falls back to `index.html`.**
   aaaver-app serves `sites/<slug>/index.html` for any path under the slug
   that doesn't look like a file (`server/lib/static/sites.ts`). Keep routes
   extensionless; never link to `/download.html`.
3. **The palette is not yours to invent.** Every color token in
   `src/index.css` `@theme` is the `default` (Midnight) preset from
   `pooprusteek/src/tui/theme.rs`, and `src/lib/themes.ts` carries all ten
   presets from that same table. New UI must use existing tokens (`ink`,
   `panel`, `panel-deep`, `fg`, `accent`, `accent-dim`, `accent-soft`,
   `focus`, `line`, `dim`, `soft`, `err`, `ok`, `warn`, `sel`) — **never a
   hard-coded hex**, because `lib/theme-store.ts` repaints the page by
   rewriting those variables on `:root` at runtime. A component that needs a
   literal color (a Motion `animate` value, an inline `style`) reads it from
   `useTheme().colors`. Re-sync `themes.ts` by parsing theme.rs, not by hand.
4. **One font: JetBrains Mono Variable** (self-hosted via
   `@fontsource-variable/jetbrains-mono`, imported in index.css). No second
   typeface — the entire aesthetic is "the TUI, but a webpage".
5. **Download links come from the GitHub API, never from a literal.** The
   stable release can lag behind the installers (it did on launch), so
   `src/lib/release.ts` picks the newest release that actually ships every
   required asset and `src/lib/install.ts` spells the matching command —
   including `--channel dev` when that is what the recommended build is.
   Hard-coding `releases/latest/download/...` hands out 404s. The static
   `FALLBACK` (rolling `dev` tag) is what renders before the fetch lands and
   when GitHub is unreachable; keep its asset names in sync with
   `pooprusteek/scripts/ci/collect-assets.sh`.
6. **Every JS-timer animation must respect reduced motion.** Motion
   components are covered globally by `MotionConfig reducedMotion="user"` in
   `main.tsx`, but `setTimeout`/`setInterval` animations (TerminalDemo
   typewriter, spinners, PowTicker, GoalLoop cycle) each guard with
   `useReducedMotion()` — keep doing that for anything new, and give it a
   sensible static end-state.
7. **Don't put Tailwind `transition-*` classes on `motion.*` elements** —
   they fight Motion's inline styles and stutter. `transition-colors` for
   pure CSS hovers on plain elements is fine (used on cards/links).
8. **Grid children that must shrink need `min-w-0`.** Already bitten twice:
   the PoW ticker's `truncate` (= `white-space: nowrap`) inflated its grid
   column's min-content and caused horizontal scroll on mobile. Terminal-ish
   single-line content inside any grid/flex column → `min-w-0` on the item.
9. **Copy is English first**: `src/i18n/locales/en.ts` is the source of
   truth and `ru.ts` is typed `typeof en`, so an untranslated key fails the
   build. Tone is the project's — irreverent about the name, dead serious
   about the engineering ("No API key. No subscription. No fluff."). Real
   TUI strings (status badges, slash commands, config snippets, the status
   bar format) are quoted verbatim in components, not in the locales:
   they're the product, not copy.
10. **Claims are checkable.** Numbers on this site (MRR 0.927 / 0.836, ~900
    tests, 62k lines, 51 commands, 16 tools, glibc 2.39+, port 7667) come
    from the agent repo. If you can't point at the file that says it, don't
    put it on the page.

## Repo map

- `src/App.tsx` — route → page table, plus the per-route `document.title` and
  meta-description effect.
- `src/pages/`
  - `Home.tsx` — section order: Hero → Install → ZeroDollars → Features →
    RagTeaser → GoalLoop → ServeTeaser → Commands → ThemeGallery → TechStrip.
  - `Download.tsx` — release badge, OS-aware primary action, the reused
    install tabs, the full asset table (channel switch, sizes, SHA-256 from
    the API), verification, update channels, first run, requirements.
  - `Rag.tsx` · `Serve.tsx` · `Architecture.tsx` — the technology pages.
- `src/lib/`
  - `route-store.ts` — the whole router: `useRoute`, `navigate`, `href`,
    `BASE`. `useSyncExternalStore`, no dependency, no context.
  - `theme-store.ts` + `themes.ts` — the ten TUI presets and the code that
    writes them onto `:root` (including the CRT overlay tints, which are
    derived per theme so Paper Light doesn't get dark scanlines).
  - `release.ts` — GitHub release fetch, shaping, 30-minute sessionStorage
    cache, static fallback, size/date/version formatting.
  - `use-release.ts` — one shared in-flight promise for all consumers.
  - `platform.ts` — OS/arch detection (UA string, refined by UA-CH).
  - `install.ts` — every install/uninstall/verify command shown on the site.
  - `anim.ts` — shared `rise`/`stagger` variants, `viewportOnce`, and the
    re-exported repo URLs.
- `src/components/`
  - `ui/` — `Link` (router-aware `<a>`), `CopyLine`, `SectionTitle`,
    `PageHero`, `PageSection`, `Ledger`, `CodeBlock`, `Corners`.
  - `Logo.tsx` — POOPRUSTEEK wordmark; per-letter color wave built from the
    active theme, replicating the TUI landing logo.
  - `TerminalDemo.tsx` — scripted typewriter session. The whole demo is the
    `SCRIPT` array (`typed: true` lines get char-by-char typing, others
    appear whole after `pause` ms); it loops forever. Keep status labels
    real (`[GOAL ON]`, `[EVALUATING]`, `[GOAL DONE]`…).
  - `DownloadCTA.tsx` — the hero's OS-aware action: a button on Windows, the
    `curl … | sh` line on macOS/Linux, a link to `/download` otherwise.
  - `InstallSection.tsx` — the three-tab installation block, reused as-is on
    the download page.
  - `ThemePicker.tsx` / `ThemeGallery.tsx` — `/themes` in the nav and as a
    section; each gallery card previews a preset in *its own* colors.
  - `ZeroDollars` · `Features` · `RagTeaser` · `GoalLoop` · `ServeTeaser` ·
    `Commands` · `TechStrip` · `Footer` · `StatusBar` — home sections.
- `public/og.png` — 1200×630 link-preview capture of the hero; regenerate it
  when the hero changes (see below).
- `docs/hero.webp` — README screenshot.

## Verifying changes

There are no tests; verification is visual:

1. `bun run build` (tsc catches type errors) and `bun run lint`.
2. `bun run preview` in background, then drive it with a headless browser at
   `http://localhost:4173/pooprusteek/`.
3. Check desktop (1440×900) and mobile (390×844), **on every route**. On
   mobile always run the horizontal-overflow probe — this site's most likely
   regression: `document.documentElement.scrollWidth >
   document.documentElement.clientWidth` must be `false`. Probe while
   scrolling the whole page; sections mount their content on `whileInView`,
   and a full-page screenshot taken without scrolling first will show them
   still transparent.
4. Click through the router (nav link → back button), flip a theme (it must
   survive a reload and apply on every page), and switch to RU.
5. For a hero screenshot with the terminal in a good state, wait for
   `[GOAL DONE]` **inside the demo box** rather than anywhere on the page —
   several sections quote that badge, so a page-wide match fires while the
   demo is still on its first line. Find the box from its title bar
   (`~/dev/that-one-project` → `closest('div[class*="rounded-lg"]')`).
6. `docs/hero.webp` is that shot at 1440×1120 (lossless WebP);
   `public/og.png` is the same state at 1200×630, clipped from the top.

## Deploying

Hosting is aaaver-app: its Bun server serves `sites/<slug>/` at `/<slug>/`,
slug = lowercase `[a-z0-9-]`, `index.html` at the folder root (satisfied by
`dist/`).

The supported path is CI: a push to `develop` runs `.github/workflows/demo.yml`,
which reuses `Aver005/aaaver-app/.github/workflows/site-release.yml` to publish
a `latest` release with `dist.tar.gz`. The `sites-updater` service on the VDS
polls that release every ten minutes and swaps `sites/pooprusteek/` atomically.
A manual copy into `sites/pooprusteek/` works too, but the updater will
replace it as soon as the registered release changes — it compares the
`version` in `sites/<slug>/.release.json`.

Live check: `https://aaaver.ru/api/sites` lists mounted slugs.

## Conventions

- Components: one file per section in `src/components/`, shared pieces in
  `src/components/ui/`, default export, local helpers below the default
  export in the same file.
- Reveal-on-scroll: use the shared `rise`/`stagger` variants with
  `viewport={viewportOnce}` — don't hand-roll new IntersectionObserver logic.
- Internal links go through `ui/Link` (or `navigate`), never a bare `<a>`
  with a site-relative href — the bare one triggers a full page load.
- Commits are the user's job; don't run `git commit`/`git push` unless
  explicitly asked. The sibling agent repo uses conventional commits with
  gitmoji (`feat(landing): ✨ …`) — follow that if asked to commit here.
