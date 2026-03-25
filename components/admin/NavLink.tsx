'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface NavLinkProps {
  href: string
  icon: ReactNode
  children: ReactNode
  indent?: boolean
}

export function NavLink({ href, icon, children, indent = false }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(href + '/')

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${indent ? 'ml-4 text-sm' : ''} ${
        isActive
          ? 'bg-blue-50 text-blue-700'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      <div className={indent ? 'w-4 h-4 [&>svg]:w-4 [&>svg]:h-4' : 'w-5 h-5 [&>svg]:w-5 [&>svg]:h-5'}>{icon}</div>
      <span className="font-medium">{children}</span>
    </Link>
  )
}
