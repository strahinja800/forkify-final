# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server on localhost:3000
npm run build    # production build
npm run start    # start production server
npx tsc --noEmit # type check without emitting
```

No test suite is configured.

## Architecture

This is a Next.js 16 / React 19 single-page recipe app. The entire UI renders on one route (`src/app/page.tsx`) — no dynamic routing.

**State** is managed entirely in `src/context/RecipeContext.tsx` via a single `useReducer`. All components consume state through the `useRecipe()` hook. Never use local state for data that belongs to the global recipe/search/bookmark model.

**Data flow:**
- `src/lib/config.ts` — API base URL, API key, pagination constant (`RES_PER_PAGE = 13`), timeout
- `src/lib/api.ts` — `ajax(url, uploadData?)` wraps fetch with a race-condition timeout; handles both GET and POST
- `RecipeContext` calls `ajax` directly; there is no server-side data fetching layer

**Recipe routing** uses URL hash (`#<recipe-id>`). `page.tsx` listens to `hashchange` and calls `loadRecipe(id)`.

**Bookmarks** persist to `localStorage` only. They are initialized on mount via `initBookmarks()` in `page.tsx`.

**Styling** uses Tailwind CSS v4 (`@import 'tailwindcss'` in `globals.css`). Custom design tokens are defined in the `@theme {}` block in `globals.css` — not in a `tailwind.config`. Two non-Tailwind classes exist in `globals.css` for things Tailwind cannot express: `.forkify-container` (main CSS grid layout) and `.recipe-title-span` (`box-decoration-break: clone`). Do not move these to Tailwind utilities.

**SVG icons** are served from `public/icons.svg` as a sprite; reference them with `<use href="/icons.svg#icon-<name>" />`.

**Ingredient format** for upload: `"Quantity,Unit,Description"` (comma-separated string, all three parts required).
