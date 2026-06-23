import { Pool } from 'pg'

const globalForPool = globalThis as unknown as { pool: Pool }

export const pool =
  globalForPool.pool ??
  new Pool({ connectionString: process.env.DIRECT_URL })

if (process.env.NODE_ENV !== 'production') globalForPool.pool = pool
