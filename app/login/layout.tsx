import '../(public)/globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Login',
  description: 'Login to the admin panel',
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}
