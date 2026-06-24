# Forkify

A recipe search and bookmarking app built with Next.js 16 and React 19. Search over 1,000,000 recipes, adjust servings, bookmark your favorites, and upload your own recipes.

## Features

- Search recipes via the [Forkify API](https://forkify-api.jonas.io)
- Browse 12 curated recipes available without any search
- View full recipe details with ingredients and directions
- Adjust serving sizes with automatic ingredient scaling
- Bookmark recipes — saved to localStorage
- Upload your own recipes (automatically added to the sidebar and bookmarks)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

- **Next.js 16** / **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Forkify API v2** — recipe data

## Project Structure

```
src/
  app/             # Root layout and single page route
  components/      # Header, SearchResults, Recipe, PreviewItem, Bookmarks, AddRecipeModal
  context/         # RecipeContext — global state via useReducer
  lib/             # api.ts (fetch wrapper), config.ts (constants), localRecipes.ts (hardcoded recipes)
```

## Uploading a Recipe

Ingredients must follow the format: `Quantity,Unit,Description`
Example: `2,cups,all-purpose flour`

Leave Quantity empty if not applicable: `,pinch,salt`

## Environment

No `.env` file needed — the API key is bundled in `src/lib/config.ts` and is the public demo key from the original Forkify course project.
