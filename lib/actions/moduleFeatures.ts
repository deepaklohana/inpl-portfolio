'use server'

import { prisma } from '@/lib/prisma'

function isConnectionPoolTimeout(err: unknown) {
  const msg =
    err instanceof Error
      ? err.message
      : typeof err === 'string'
        ? err
        : typeof err === 'object' && err !== null && 'message' in err
          ? (err as { message?: unknown }).message
          : undefined
  const lower = String(msg ?? '').toLowerCase()
  return (
    lower.includes('connection pool') ||
    lower.includes('timed out fetching a new connection') ||
    lower.includes('timed out fetching') // extra safety across Prisma versions
  )
}

function userFriendlyDbBusyMessage() {
  return 'Server is busy right now. Please try again in a few seconds.'
}

async function retryPrismaOperation<T>(operation: () => Promise<T>): Promise<T> {
  const maxAttempts = 3
  let lastErr: unknown

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation()
    } catch (err) {
      lastErr = err
      if (!isConnectionPoolTimeout(err) || attempt === maxAttempts) break

      // Backoff before retrying to give the pool a chance to free a connection.
      const delayMs = attempt * 500
      await new Promise((r) => setTimeout(r, delayMs))
    }
  }

  if (isConnectionPoolTimeout(lastErr)) {
    throw new Error(userFriendlyDbBusyMessage())
  }

  throw lastErr
}

export async function createFeature(moduleId: number, data: any) {
  const feature = await retryPrismaOperation(() =>
    prisma.moduleFeature.create({
      data: {
        moduleId,
        ...data
      }
    })
  )
  return { success: true, feature }
}

export async function updateFeature(id: number, data: any) {
  const feature = await retryPrismaOperation(() =>
    prisma.moduleFeature.update({
      where: { id },
      data
    })
  )
  return { success: true, feature }
}

export async function deleteFeature(id: number) {
  await retryPrismaOperation(() =>
    prisma.moduleFeature.delete({
      where: { id }
    })
  )
  return { success: true }
}

export async function updateFeaturesOrder(items: { id: number; sortOrder: number }[]) {
  await retryPrismaOperation(() =>
    prisma.$transaction(
      items.map((item) =>
        prisma.moduleFeature.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder }
        })
      )
    )
  )
  return { success: true }
}
