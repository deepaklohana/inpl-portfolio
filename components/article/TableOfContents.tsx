'use client'

import { useEffect, useState } from 'react'
import { TOCItem } from '@/lib/utils/generateTOC'

interface TableOfContentsProps {
  items: TOCItem[]
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    )

    // Observe all heading elements
    items.forEach((item) => {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [items])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top: y, behavior: 'smooth' })
      setActiveId(id)
      setIsExpanded(false) // Close mobile menu after clicking
    }
  }

  if (!items || items.length === 0) return null

  return (
    <div className="w-full md:sticky md:top-24 md:w-64 shrink-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 md:border-none md:bg-transparent md:dark:bg-transparent md:rounded-none md:p-0">
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between font-medium md:hidden text-gray-800 dark:text-gray-200"
      >
        <span>Table of Contents</span>
        <span className="text-sm">{isExpanded ? '▲' : '▼'}</span>
      </button>

      {/* List Container */}
      <div className={`mt-4 md:mt-0 ${isExpanded ? 'block' : 'hidden'} md:block`}>
        <h4 className="hidden md:block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
          Table of Contents
        </h4>
        <ul className="space-y-2.5 text-sm">
          {items.map((item) => {
            const isActive = activeId === item.id
            return (
              <li
                key={item.id}
                className={`
                  ${item.level === 3 ? 'pl-4 text-[13px]' : ''}
                `}
              >
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleClick(e, item.id)}
                  className={`block transition-colors border-l-2 py-1 pl-3 ${
                    isActive
                      ? 'text-orange-500 font-medium border-orange-500'
                      : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 border-transparent hover:border-gray-300 dark:hover:border-gray-700'
                  }`}
                >
                  {item.title}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
