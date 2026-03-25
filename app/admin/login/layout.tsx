import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Login',
  description: 'Login to the admin panel',
}

import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  // If already logged in, no need to see the login page
  if (session) {
    redirect('/admin')
  }

  return (
    <>
      {children}
    </>
  )
}
