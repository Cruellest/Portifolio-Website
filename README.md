# Portfolio Website

Personal portfolio and resume website — Vue 3 + TypeScript, fully driven by a single JSON file per language.

## Features

- **Minimal, animated design** — full-screen hero, scroll-reveal sections and micro-interactions powered by [motion-v](https://motion.dev/docs/vue), respecting `prefers-reduced-motion`.
- **Single JSON per language** — all content (resume data and UI strings) lives in [src/data/data.json](src/data/data.json) (English) and [src/data/translated_data/](src/data/translated_data/) (translations). The shared TypeScript schema in [src/types/portfolio.ts](src/types/portfolio.ts) makes the build fail if a language file misses a key.
- **Two printable resumes**, both generated from the same data and following the active language:
  - `/print-resume` — visual resume: A4 single page, two columns, photo.
  - `/resume-ats` — ATS-friendly resume: single column, semantic headings, no photo/icons, selectable-text PDF.
- **AI/SEO friendly** — a `schema.org/Person` JSON-LD script is injected and kept in sync with the active language.
- **Light/dark themes** — follows the system by default (auto), with a manual toggle. Custom daisyUI themes.
- **Full-page search** — ⌘/Ctrl+F or `/` opens a command-palette-style overlay that highlights and cycles matches.
- **i18n** — English and Portuguese, persisted in `localStorage`.

## Stack

Vue 3 (`<script setup>`) · TypeScript (strict) · Vite (rolldown) · Tailwind CSS 4 · daisyUI 5 · Pinia · vue-router · motion-v · Bun

## Development

```bash
bun install
bun run dev          # dev server
bun run build        # typecheck (vue-tsc) + production build
bun run lint         # ESLint
bun run lint:fix     # ESLint with autofix
bun run format       # Prettier
bun run format:check # Prettier check (CI)
```

CI runs lint, format check and build on every push/PR ([.github/workflows/quality.yml](.github/workflows/quality.yml)). Pushes to `main` also build and publish the Docker image ([.github/workflows/docker-image.yml](.github/workflows/docker-image.yml)).

## Project structure

```
src/
├── components/
│   ├── navbar/       # AppNavbar + language/theme/download menus + search overlay
│   ├── sections/     # Hero, About, Skills, Experience (+ JobCard/ProjectCard), Education
│   └── ui/           # Reveal (scroll animation), SectionHeading
├── composables/      # useTheme, useSiteSearch, usePrintFlow, usePersonJsonLd
├── data/             # data.json (en) + translated_data/ + languages.json
├── pages/            # Homepage, print-resume, ats-resume
├── router/
├── stores/           # Pinia store: typed data + language switching
├── types/            # PortfolioData schema
└── utils/            # url/dom helpers
```

## Customizing

1. Edit [src/data/data.json](src/data/data.json) with your own content.
2. Mirror the same structure in each translation file (the typecheck enforces this).
3. Adjust the languages list in [src/data/languages.json](src/data/languages.json) and the loader map in [src/stores/portfolio.ts](src/stores/portfolio.ts) when adding a language.
4. Theme colors live in [src/style.css](src/style.css) (daisyUI theme blocks).

## Docker

```bash
docker build -t portfolio-website .
docker run -p 8080:80 portfolio-website
```
