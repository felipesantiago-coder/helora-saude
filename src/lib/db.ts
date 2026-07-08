import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const logConfig =
  process.env.NODE_ENV === 'development' ? ['error', 'warn'] as const : []

/**
 * Creates a PrismaClient instance.
 *
 * When TURSO_DATABASE_URL is set, connects to a Turso cloud database
 * using the libsql adapter. Otherwise falls back to local SQLite.
 */
async function createPrismaClient(): Promise<PrismaClient> {
  const tursoUrl = process.env.TURSO_DATABASE_URL
  const tursoAuthToken = process.env.TURSO_AUTH_TOKEN

  if (tursoUrl) {
    try {
      const { createClient } = await import('@libsql/client')
      const { PrismaLibSQL } = await import('@prisma/adapter-libsql')

      const libsql = createClient({
        url: tursoUrl,
        ...(tursoAuthToken ? { authToken: tursoAuthToken } : {}),
      })

      const adapter = new PrismaLibSQL(libsql)
      const client = new PrismaClient({ adapter, log: logConfig })

      // Verify connection works
      await client.$queryRaw`SELECT 1`
      console.log('[DB] Connected to Turso successfully')

      return client
    } catch (err) {
      console.error('[DB] Failed to connect to Turso:', err)
      throw new Error(
        `[DB] Turso connection failed: ${err instanceof Error ? err.message : String(err)}. ` +
        'Check TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in Vercel environment variables.'
      )
    }
  }

  // In production, Turso is required (no persistent filesystem on Vercel)
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      '[DB] TURSO_DATABASE_URL is required in production. ' +
      'Local SQLite cannot be used on Vercel (ephemeral filesystem). ' +
      'Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in your Vercel environment variables.'
    )
  }

  // Development fallback: local SQLite
  return new PrismaClient({ log: logConfig })
}

// ---------------------------------------------------------------------------
// Synchronous export for backward compatibility (local SQLite only)
// ---------------------------------------------------------------------------

const localDb =
  globalForPrisma.prisma ??
  new PrismaClient({ log: logConfig })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = localDb

/**
 * Synchronous Prisma client — works immediately with local SQLite.
 *
 * For Turso cloud databases use `getDb()` instead to ensure the
 * libsql adapter is initialised before the first query.
 */
export const db = localDb

// ---------------------------------------------------------------------------
// Async factory for Turso (also works for local SQLite)
// ---------------------------------------------------------------------------

let _cachedClient: PrismaClient | null = null

/**
 * Returns a ready-to-use PrismaClient, initialising the Turso libsql
 * adapter on first call if TURSO_DATABASE_URL is configured.
 *
 * Safe to call repeatedly — the client is cached in memory.
 *
 * @example
 * ```ts
 * import { getDb } from '@/lib/db'
 * const db = await getDb()
 * const users = await db.user.findMany()
 * ```
 */
export async function getDb(): Promise<PrismaClient> {
  if (_cachedClient) return _cachedClient

  const client = await createPrismaClient()

  // Cache in module scope
  _cachedClient = client

  // Persist across hot-reloads in development
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client
  }

  return client
}