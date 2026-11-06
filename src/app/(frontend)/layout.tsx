import { Geist, Geist_Mono, Source_Serif_4 } from 'next/font/google'
import React from 'react'

import { Nav } from '@/components/Nav'
import { THEME_INIT } from '@/components/ThemeToggle'
import './styles.css'

const sans = Geist({ subsets: ['latin'], weight: ['300', '400', '500', '600'], variable: '--f-sans' })
const mono = Geist_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--f-mono' })
// Quotes are set in Source Serif 4: a text serif built for screens, much
// easier to read at length than the display serif used at first.
const serif = Source_Serif_4({ subsets: ['latin'], weight: ['400', '500'], style: ['normal', 'italic'], variable: '--f-serif' })

export const metadata = {
  metadataBase: new URL(process.env.SITE_URL || 'https://words.l3xj.com'),
  title: { default: 'words · Lexi', template: '%s · words' },
  description: 'Stories, reflections and a collection of words worth keeping, by Lexi.',
  alternates: { types: { 'application/rss+xml': '/feed.xml' } },
}

// Pages read the database on each request, never at build time.
export const dynamic = 'force-dynamic'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <div className="desk dotgrid" aria-hidden="true" />
        <Nav />
        <main id="main">{children}</main>
        <footer className="taskbar">
          <div className="wrap tb-wrap">
            <a className="tb-start" href="/">
              <span className="tb-logo" aria-hidden="true" />
              words<span className="dot">.</span>l3xj.com
            </a>
            <nav className="tb-items" aria-label="Footer">
              <a href="/writing">writing/</a>
              <a href="/quotes">word_collector.txt</a>
              <a href="/feed.xml">feed.xml</a>
              <a href="https://substack.com/@lexicalyoda">substack ↗</a>
            </nav>
            <span className="tb-tray">© {new Date().getFullYear()} Lexi</span>
          </div>
        </footer>
      </body>
    </html>
  )
}
