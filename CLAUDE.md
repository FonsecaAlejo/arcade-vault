# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

Arcade Vault (`README.md`) is an online arcade platform where users play retro-style games (Bloque Buster, Caída, Serpentina, Glotón, Invasores, Rocas, Ranaria, Duelo Pixel) and compete on score leaderboards. Development follows Spec Driven Design using `/spec` and `/spec-impl` conventions from https://github.com/Klerith/fernando-skills.

The app is a Next.js App Router project (`app/`) currently at the fresh `create-next-app` scaffold stage — only `app/layout.tsx` and `app/page.tsx` exist so far.

### Design reference (not runnable Next.js code)

`resources/templates/` contains a static HTML/CDN-React prototype of the full UI that the real app is built from — treat it as a design/behavior spec, not code to import directly:

- `Arcade Vault.html` — standalone HTML shell that loads the `.jsx` files via CDN React/Babel.
- `app.jsx` — root component with hash-based routing (`biblioteca`, `detalle`, `player`, `auth`, `salon`) and `localStorage`-backed auth/score state. In the real app this routing/state must be re-implemented using App Router conventions and real persistence, not ported as-is.
- `nav.jsx`, `biblioteca.jsx` (game library/grid), `detalle.jsx` (game detail), `reproductor.jsx` (game player screen), `auth.jsx` (login/signup), `salon.jsx` (hall of fame / leaderboard) — one prototype component per screen.
- `data.jsx` — mock data: the `GAMES` catalog (id, title, category, color, best score, plays), `CATS` categories, `PLAYERS` list, and `seededScores()` for generating mock leaderboard rows.
- `styles.css` — the neon/retro-arcade design system: CSS custom properties for colors (`--cyan`, `--magenta`, `--yellow`, `--green`, gold/silver/bronze rank colors), fonts (`--pixel`: "Press Start 2P", `--mono`: "JetBrains Mono"), and the scanline/grid background effect. Reuse these tokens when building real Tailwind/CSS styles so the app matches the prototype's look.

## Working in this repo

- **This Next.js version differs from your training data.** Before writing routing, data-fetching, caching, image, or middleware code, check the matching guide under `node_modules/next/dist/docs/01-app/` (getting-started and guides) and specifically `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md` for breaking changes versus Next.js as you know it — notable ones: Turbopack is the default bundler, Request APIs (`params`, `searchParams`, cookies/headers) are async, `middleware.ts` is being renamed to `proxy.ts`, and `next/image` defaults (quality list, cache TTL, redirect limits) changed.
- Path alias `@/*` maps to the project root (see `tsconfig.json`).
- Styling uses Tailwind CSS v4 (`@tailwindcss/postcss`, no `tailwind.config.*` file — config lives in `app/globals.css`/CSS).

## Commands

- `npm run dev` — start the dev server (Turbopack by default in this Next.js version).
- `npm run build` — production build.
- `npm run start` — run the production build.
- `npm run lint` — ESLint via flat config (`eslint.config.mjs`, extends `eslint-config-next` core-web-vitals + typescript).

There is no test runner configured yet.
