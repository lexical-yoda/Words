import { NextResponse } from 'next/server'

import { randomQuote } from '@/lib/data'

export const dynamic = 'force-dynamic'

// Sends the visitor to a random quote; relative, so it works behind nginx.
export async function GET() {
  const q = await randomQuote()
  return new NextResponse(null, {
    status: 307,
    headers: { Location: q ? `/quotes/${q.number}` : '/quotes', 'Cache-Control': 'no-store' },
  })
}
