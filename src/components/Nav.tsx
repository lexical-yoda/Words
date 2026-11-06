'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import { ThemeToggle } from './ThemeToggle'

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/writing', label: 'Writing' },
  { href: '/quotes', label: 'Word Collector' },
]

export function Nav() {
  const path = usePathname() || '/'
  const active = (href: string) => (href === '/' ? path === '/' : path.startsWith(href) || (href === '/writing' && path.startsWith('/w/')))
  return (
    <header className="site-nav">
      <Link className="brand" href="/">
        words<span>.</span>
      </Link>
      <nav className="nav-pill" aria-label="Sections">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className={active(l.href) ? 'is-active' : ''} aria-current={active(l.href) ? 'page' : undefined}>
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="nav-actions">
        <a className="nav-out" href="https://www.l3xj.com">
          l3xj.com ↗
        </a>
        <ThemeToggle />
      </div>
    </header>
  )
}
