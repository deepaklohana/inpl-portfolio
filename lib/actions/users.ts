'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

async function requireSuperadmin() {
  const session = await auth()
  if (!session || session.user.role !== 'superadmin') {
    throw new Error('Unauthorized: superadmin access required')
  }
  return session
}

export async function getUsers() {
  await requireSuperadmin()

  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function createUser(data: {
  name: string
  email: string
  password: string
  role: string
}) {
  await requireSuperadmin()

  const hashedPassword = await bcrypt.hash(data.password, 12)

  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    },
  })
}

export async function updateUser(
  id: string,
  data: { name?: string; email?: string; role?: string; isActive?: boolean }
) {
  await requireSuperadmin()

  return prisma.user.update({
    where: { id },
    data,
  })
}

export async function updatePassword(id: string, newPassword: string) {
  await requireSuperadmin()

  const hashedPassword = await bcrypt.hash(newPassword, 12)

  return prisma.user.update({
    where: { id },
    data: { password: hashedPassword },
  })
}

export async function deleteUser(id: string) {
  const session = await requireSuperadmin()

  if (session.user.id === id) {
    throw new Error('Cannot delete your own account')
  }

  return prisma.user.delete({
    where: { id },
  })
}
