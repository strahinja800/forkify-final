import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { pool } from '@/lib/db'
import type { Ingredient } from '@/context/RecipeContext'

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { rows: users } = await pool.query('SELECT id FROM "User" WHERE email = $1 LIMIT 1', [session.user.email])
  if (users.length === 0) return Response.json({ recipes: [] })
  const userId = users[0].id

  const { rows } = await pool.query(
    'SELECT * FROM "Recipe" WHERE "userId" = $1 ORDER BY "createdAt" DESC',
    [userId]
  )

  return Response.json({
    recipes: rows.map(r => ({
      id: r.id,
      title: r.title,
      publisher: r.publisher,
      sourceUrl: r.sourceUrl,
      image: r.image,
      servings: r.servings,
      cookingTime: r.cookingTime,
      ingredients: r.ingredients as Ingredient[],
      key: userId,
    })),
  })
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { rows: users } = await pool.query('SELECT id FROM "User" WHERE email = $1 LIMIT 1', [session.user.email])
  if (users.length === 0) return Response.json({ error: 'User not found' }, { status: 404 })
  const userId = users[0].id

  const { title, publisher, sourceUrl, image, servings, cookingTime, ingredients } = await request.json()

  const { rows } = await pool.query(
    `INSERT INTO "Recipe" (id, title, publisher, "sourceUrl", image, servings, "cookingTime", ingredients, "userId")
     VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [title, publisher, sourceUrl, image, servings, cookingTime, JSON.stringify(ingredients), userId]
  )
  const recipe = rows[0]

  return Response.json({
    recipe: {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.sourceUrl,
      image: recipe.image,
      servings: recipe.servings,
      cookingTime: recipe.cookingTime,
      ingredients: recipe.ingredients as Ingredient[],
      key: userId,
    },
  })
}
