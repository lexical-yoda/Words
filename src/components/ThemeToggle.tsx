'use client'

import React from 'react'

// Same behaviour as l3xj.com: dark unless the visitor picked light, choice
// kept in localStorage under `l3xj-theme`.
export function ThemeToggle() {
  const flip = () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem('l3xj-theme', next)
    } catch {}
  }
  return (
    <button type="button" className="icon-btn theme-toggle" onClick={flip} aria-label="Switch colour theme">
      <svg className="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      <svg className="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
      </svg>
    </button>
  )
}

export const THEME_INIT = `(function(){var t='dark';try{var q=new URLSearchParams(location.search).get('theme');var s=localStorage.getItem('l3xj-theme');t=q==='dark'||q==='light'?q:(s==='dark'||s==='light'?s:'dark')}catch(e){}document.documentElement.dataset.theme=t})();`
