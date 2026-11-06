'use client'

import React, { useEffect, useRef } from 'react'

// Redraws a picture as a field of square dots, one per light pixel, so it
// matches the dithered look of the l3xj.com art. Dots twinkle slightly, and
// the two halves of the picture drift towards each other and back, which
// makes a pair of reaching hands reach. Animation stops off screen and under
// reduced motion.

type Dot = { x: number; y: number; a: number; ph: number; side: number }

export function PixelImage({ src, focusY = 0.53, band = 0.42 }: { src: string; focusY?: number; band?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let dots: Dot[] = [], w = 0, h = 0, raf = 0, visible = true, ink = '#f1f0ec', spark = '#ff9e6d'
    const img = new Image()

    const readColours = () => {
      const cs = getComputedStyle(canvas)
      ink = cs.getPropertyValue('--ink').trim() || ink
      spark = cs.getPropertyValue('--spark').trim() || spark
    }

    const layout = () => {
      if (!img.naturalWidth) return
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      w = canvas.clientWidth; h = canvas.clientHeight
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Cover the canvas with the part of the picture around `focusY`, at most
      // `band` of its height tall, so a wide subject fills a wide panel.
      const iw = img.naturalWidth, ih = img.naturalHeight
      let sh = Math.min(ih, Math.max(ih * band, (iw * h) / w)), sw = (sh * w) / h
      if (sw > iw) { sw = iw; sh = (iw * h) / w }
      const sx = (iw - sw) / 2, sy = Math.max(0, Math.min(ih - sh, ih * focusY - sh / 2))

      const step = w < 500 ? 2.5 : 3
      const cols = Math.floor(w / step), rows = Math.floor(h / step)
      const off = document.createElement('canvas')
      off.width = cols; off.height = rows
      const octx = off.getContext('2d', { willReadFrequently: true })
      if (!octx) return
      octx.drawImage(img, sx, sy, sw, sh, 0, 0, cols, rows)
      const px = octx.getImageData(0, 0, cols, rows).data
      dots = []
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = (r * cols + c) * 4
          const lum = (px[i] * 0.299 + px[i + 1] * 0.587 + px[i + 2] * 0.114) / 255
          if (lum < 0.35) continue
          dots.push({ x: c * step, y: r * step, a: Math.min(1, lum * 1.1), ph: Math.random() * 6.28, side: c < cols / 2 ? 1 : -1 })
        }
      }
    }

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      const size = w < 500 ? 1.7 : 2
      const reach = reduce ? 0 : (Math.sin(t * 0.0006) * 0.5 + 0.5) * Math.min(10, w * 0.012)
      ctx.fillStyle = ink
      for (const d of dots) {
        const tw = reduce ? 1 : 0.75 + 0.25 * Math.sin(t * 0.002 + d.ph)
        ctx.globalAlpha = d.a * tw
        ctx.fillRect(d.x + d.side * reach, d.y, size, size)
      }
      // One peach spark in the gap between the hands, as on l3xj.com.
      ctx.globalAlpha = reduce ? 1 : 0.6 + 0.4 * Math.sin(t * 0.003)
      ctx.fillStyle = spark
      ctx.beginPath(); ctx.arc(w / 2, h * 0.52, 3, 0, 6.28); ctx.fill()
      ctx.globalAlpha = 1
    }

    const loop = (t: number) => { draw(t); if (!reduce && visible) raf = requestAnimationFrame(loop) }
    const start = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(loop) }

    readColours()
    img.onload = () => { layout(); start() }
    img.src = src
    const ro = new ResizeObserver(() => { layout(); if (reduce) draw(0) })
    ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && dots.length) start() })
    io.observe(canvas)
    const mo = new MutationObserver(() => { readColours(); if (reduce) draw(0) })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); mo.disconnect() }
  }, [src, focusY, band])

  return <canvas ref={ref} className="plexus" aria-hidden="true" />
}
