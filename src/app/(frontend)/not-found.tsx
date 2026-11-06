import Link from 'next/link'
import React from 'react'

import { Win } from '@/components/Win'

export default function NotFound() {
  return (
    <div className="wrap page">
      <Win title="error.log" className="w-404">
        <div className="doc">
          <p className="label label-accent">404</p>
          <h1 className="h1">
            These words are <b>not here</b>.
          </h1>
          <p className="lede">Maybe they were never written, or they moved somewhere quieter.</p>
          <div className="btns">
            <Link className="btn btn-solid" href="/">
              Go home
            </Link>
            <Link className="btn" href="/quotes">
              Browse quotes
            </Link>
          </div>
        </div>
      </Win>
    </div>
  )
}
