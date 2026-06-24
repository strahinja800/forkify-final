import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { pool } from '@/lib/db'
import type { Recipe } from '@/context/RecipeContext'

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { rows: users } = await pool.query('SELECT id FROM "User" WHERE email = $1 LIMIT 1', [session.user.email])
  if (users.length === 0) return Response.json({ bookmarks: [] })
  const userId = users[0].id

  const { rows } = await pool.query(
    'SELECT snapshot FROM "Bookmark" WHERE "userId" = $1 ORDER BY "createdAt" DESC',
    [userId]
  )

  return Response.json({
    bookmarks: rows.map(r => ({ ...(r.snapshot as Recipe), bookmarked: true })),
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

  const { sourceId, snapshot } = await request.json()

  await pool.query(
    `INSERT INTO "Bookmark" (id, "userId", "sourceId", snapshot)
     VALUES (gen_random_uuid()::text, $1, $2, $3)
     ON CONFLICT ("userId", "sourceId") DO UPDATE SET snapshot = EXCLUDED.snapshot`,
    [userId, sourceId, JSON.stringify(snapshot)]
  )

  return Response.json({ ok: true })
}

export async function DELETE(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { rows: users } = await pool.query('SELECT id FROM "User" WHERE email = $1 LIMIT 1', [session.user.email])
  if (users.length === 0) return Response.json({ error: 'User not found' }, { status: 404 })
  const userId = users[0].id

  const sourceId = request.nextUrl.searchParams.get('sourceId')
  if (!sourceId) return Response.json({ error: 'sourceId required' }, { status: 400 })

  await pool.query('DELETE FROM "Bookmark" WHERE "userId" = $1 AND "sourceId" = $2', [userId, sourceId])

  return Response.json({ ok: true })
}
