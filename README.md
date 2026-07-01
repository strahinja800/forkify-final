# Forkify

A recipe search and bookmarking app built with Next.js 16 and React 19. Search over 1,000,000 recipes, save bookmarks to your account, and upload your own recipes.

## Features

- Search recipes via the [Forkify API](https://forkify-api.jonas.io)
- View full recipe details with ingredients and cooking instructions
- Adjust serving sizes with automatic ingredient scaling
- User authentication (register / sign in)
- Bookmarks synced to your account via PostgreSQL
- Upload custom recipes (stored in the database, tied to your account)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the project root:

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
AUTH_SECRET=your_random_secret_here
```

Generate `AUTH_SECRET` with:

```bash
npx auth secret
```

### 3. Set up the database

Run the Prisma migration to create the required tables:

```bash
npx prisma migrate deploy
```

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

- **Next.js 16** / **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **NextAuth v5** — JWT-based authentication with credentials provider
- **PostgreSQL** — user accounts, bookmarks, and uploaded recipes
- **Prisma** — database schema and migrations
- **Forkify API v2** — external recipe data source

## Project Structure

```
src/
  app/
    api/
      auth/         # NextAuth route handler + register endpoint
      bookmarks/    # GET and POST bookmarks for the signed-in user
      recipes/      # POST to save a custom recipe
    page.tsx        # Single-page root — all UI renders here
  components/       # Header, SearchResults, Recipe, PreviewItem,
                    # Bookmarks, AddRecipeModal, AuthModal
  context/          # RecipeContext — global state via useReducer
  lib/
    api.ts          # Fetch wrapper with timeout
    auth.ts         # NextAuth config
    config.ts       # API URL, key, pagination constant
    db.ts           # PostgreSQL connection pool
prisma/
  schema.prisma     # User, Recipe, Bookmark models
```

## Database Schema

| Model      | Key fields                                                         |
| ---------- | ------------------------------------------------------------------ |
| `User`     | `id`, `email`, `password` (hashed), `name`                        |
| `Recipe`   | `title`, `publisher`, `ingredients` (JSON), `userId`              |
| `Bookmark` | `userId`, `sourceId` (external recipe id or internal), `snapshot` |

## Uploading a Recipe

Ingredients must follow the format `Quantity,Unit,Description` (comma-separated).

```
2,cups,all-purpose flour
,pinch,salt
```

Leave `Quantity` blank if the ingredient has no quantity. Uploaded recipes are saved to your account and appear in the sidebar automatically.

## Scripts

```bash
npm run dev      # dev server on localhost:3000
npm run build    # production build
npm run start    # start production server
npx tsc --noEmit # type check
```
