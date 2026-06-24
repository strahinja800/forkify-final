import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { pool } from '@/lib/db'

export async function POST(request: NextRequest) {
  const { name, email, password } = await request.json()

  if (!email || !password) {
    return Response.json({ error: 'Email and password are required.' }, { status: 400 })
  }

  const { rows } = await pool.query('SELECT id FROM "User" WHERE email = $1 LIMIT 1', [email])
  if (rows.length > 0) {
    return Response.json({ error: 'An account with this email already exists.' }, { status: 409 })
  }

  const hashed = await bcrypt.hash(password, 12)
  await pool.query(
    'INSERT INTO "User" (id, name, email, password) VALUES (gen_random_uuid()::text, $1, $2, $3)',
    [name ?? null, email, hashed]
  )

  return Response.json({ ok: true })
}
