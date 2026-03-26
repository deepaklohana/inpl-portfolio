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
      className={`group flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all duration-300 font-['Inter',sans-serif] ${indent ? 'ml-4 text-sm' : ''} ${
        isActive
          ? 'bg-linear-to-r from-[#2251B5] to-[#2251B5]/90 text-white shadow-[0px_8px_15px_-3px_rgba(34,81,181,0.25)]'
          : 'text-[#4A5565] hover:text-[#2251B5] hover:bg-[#F3F4F6]'
      }`}
    >
      <div className={indent ? 'w-4 h-4 [&>svg]:w-4 [&>svg]:h-4' : 'w-5 h-5 [&>svg]:w-5 [&>svg]:h-5'}>{icon}</div>
      <span className="font-medium">{children}</span>
    </Link>
  )
}
