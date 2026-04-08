import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// On Vercel serverless each function instance creates its own process.
// connection_limit=1 prevents pool exhaustion across concurrent lambdas.
// connection_timeout fallback ensures fast failure instead of hanging.
// However, during Next.js SSG build (which uses multiple workers), we need slightly more.
const isDevOrBuild = process.env.NODE_ENV !== 'production' || process.env.npm_lifecycle_event === 'build';
const poolingConfig = process.env.DATABASE_URL?.includes('pgbouncer=true') 
  ? (isDevOrBuild ? '&connection_limit=5&pool_timeout=20' : '&connection_limit=1&pool_timeout=10')
  : '';

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL + poolingConfig,
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
