'use client'

import React, { useEffect, useRef } from 'react'

// Two hands reaching for each other, drawn as a plexus: points scattered
// through simple hand shapes (capsules and an ellipse), joined to their
// nearest neighbours, with a loose web of drifting nodes around them. After
// the plexus-hands image in the l3xj.com design references; nothing from that
// image is used, the shapes are generated here.

type Shape = { kind: 'cap'; ax: number; ay: number; bx: number; by: number; r: number } | { kind: 'ell'; cx: number; cy: number; rx: number; ry: number }

const cap = (ax: number, ay: number, len: number, deg: number, r: number): Shape => {
  const a = (deg * Math.PI) / 180
  return { kind: 'cap', ax, ay, bx: ax + Math.cos(a) * len, by: ay + Math.sin(a) * len, r }
}

// One hand in local units: wrist at the left, fingertips pointing right (+x).
const HAND: Shape[] = [
  cap(-1.05, 0.02, 0.7, 0, 0.12), // forearm
  { kind: 'ell', cx: -0.1, cy: 0.02, rx: 0.3, ry: 0.23 }, // palm
  cap(0.13, -0.15, 0.42, -14, 0.045), // index
  cap(0.17, -0.04, 0.47, -3, 0.047), // middle
  cap(0.15, 0.08, 0.42, 8, 0.045), // ring
  cap(0.08, 0.18, 0.32, 20, 0.04), // little
  cap(-0.2, -0.17, 0.36, -62, 0.052), // thumb
]

function depth(s: Shape, x: number, y: number) {
  if (s.kind === 'ell') {
    const d = Math.hypot((x - s.cx) / s.rx, (y - s.cy) / s.ry)
    return (1 - d) * Math.min(s.rx, s.ry)
  }
  const vx = s.bx - s.ax, vy = s.by - s.ay
  const t = Math.max(0, Math.min(1, ((x - s.ax) * vx + (y - s.ay) * vy) / (vx * vx + vy * vy)))
  return s.r - Math.hypot(x - (s.ax + vx * t), y - (s.ay + vy * t))
}

// Seeded random, so the drawing is the same on every visit.
function rng(seed: number) {
  return () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296)
}

function sampleHand(n: number, rand: () => number) {
  const pts: [number, number][] = []
  let guard = 0
  while (pts.length < n && guard++ < n * 60) {
    const x = -1.2 + rand() * 1.9, y = -0.55 + rand() * 1.0
    let d = -1
    for (const s of HAND) d = Math.max(d, depth(s, x, y))
    if (d <= 0) continue
    // Favour points near the outline so the shape reads as a surface.
    if (rand() < 0.3 + 0.7 * Math.max(0, 1 - d / 0.05)) pts.push([x, y])
  }
  return pts
}

type P = { bx: number; by: number; x: number; y: number; ph: number; sp: number; hand: number }

export function PlexusHands({ seed = 7 }: { seed?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const rand = rng(seed)
    const local = [sampleHand(520, rand), sampleHand(520, rand)]
    let pts: P[] = [], web: P[] = [], links: [number, number][] = [], w = 0, h = 0, raf = 0, visible = true
    let ink = '#f1f0ec', accent = '#5aa8ff', accent2 = '#b27dff'

    const readColours = () => {
      const cs = getComputedStyle(canvas)
      ink = cs.getPropertyValue('--ink').trim() || ink
      accent = cs.getPropertyValue('--accent').trim() || accent
      accent2 = cs.getPropertyValue('--accent-2').trim() || accent2
    }

    const layout = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      w = canvas.clientWidth; h = canvas.clientHeight
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const s = Math.min(w, h) * 0.4
      // The hands lie along the panel's diagonal: the lower one reaches up and
      // right, its mirror reaches down and left, and the fingertips stop just
      // short of the centre so the gap between them stays open.
      const rot = -Math.atan2(h, w) * 0.95
      const dx = Math.cos(rot), dy = Math.sin(rot), px = -dy, py = dx
      const cx = w / 2, cy = h / 2, back = 0.5 * s, side = 0.32 * s
      const place = [
        { x: cx - dx * back + px * side, y: cy - dy * back + py * side, rot, flip: 1 },
        { x: cx + dx * back - px * side, y: cy + dy * back - py * side, rot: rot + Math.PI, flip: -1 },
      ]
      pts = []
      local.forEach((list, hi) => {
        const p = place[hi], c = Math.cos(p.rot), sn = Math.sin(p.rot)
        for (const [lx0, ly0] of list) {
          const lx = lx0, ly = ly0 * p.flip
          const bx = p.x + (lx * c - ly * sn) * s, by = p.y + (lx * sn + ly * c) * s
          pts.push({ bx, by, x: bx, y: by, ph: rand() * 6.28, sp: 0.4 + rand() * 0.8, hand: hi })
        }
      })
      // Each point links to its three nearest neighbours in the same hand.
      links = []
      const reach = s * 0.09
      pts.forEach((a, i) => {
        const near: [number, number][] = []
        for (let j = 0; j < pts.length; j++) {
          if (j === i || pts[j].hand !== a.hand) continue
          const d = Math.hypot(pts[j].bx - a.bx, pts[j].by - a.by)
          if (d < reach) near.push([d, j])
        }
        near.sort((p, q) => p[0] - q[0]).slice(0, 3).forEach(([, j]) => { if (i < j) links.push([i, j]) })
      })
      const r2 = rng(seed + 1)
      web = Array.from({ length: Math.round((w * h) / 9000) }, () => {
        const bx = r2() * w, by = r2() * h
        return { bx, by, x: bx, y: by, ph: r2() * 6.28, sp: 0.2 + r2() * 0.5, hand: -1 }
      })
    }

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      const breathe = reduce ? 0 : Math.sin(t * 0.00045) * 0.018
      for (const p of pts) {
        // The hands drift towards each other and back, a little at a time.
        const dir = p.hand === 0 ? 1 : -1
        p.x = p.bx + dir * breathe * w + (reduce ? 0 : Math.sin(t * 0.001 * p.sp + p.ph) * 1.1)
        p.y = p.by - dir * breathe * h * 0.6 + (reduce ? 0 : Math.cos(t * 0.0012 * p.sp + p.ph) * 1.1)
      }
      for (const p of web) {
        p.x = p.bx + (reduce ? 0 : Math.sin(t * 0.0003 * p.sp + p.ph) * 14)
        p.y = p.by + (reduce ? 0 : Math.cos(t * 0.00025 * p.sp + p.ph) * 14)
      }
      // Loose web: each drifting node joins nearby nodes and the nearest hand point.
      ctx.lineWidth = 0.6
      ctx.strokeStyle = accent2
      for (let i = 0; i < web.length; i++) {
        const a = web[i]
        for (let j = i + 1; j < web.length; j++) {
          const b = web[j], d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < 110) { ctx.globalAlpha = 0.28 * (1 - d / 110); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke() }
        }
        let best = -1, bd = 90
        for (let k = 0; k < pts.length; k += 3) { const d = Math.hypot(a.x - pts[k].x, a.y - pts[k].y); if (d < bd) { bd = d; best = k } }
        if (best >= 0) { ctx.strokeStyle = accent; ctx.globalAlpha = 0.35 * (1 - bd / 90); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(pts[best].x, pts[best].y); ctx.stroke(); ctx.strokeStyle = accent2 }
      }
      // The hands themselves.
      ctx.strokeStyle = ink
      ctx.lineWidth = 0.55
      ctx.globalAlpha = 0.5
      ctx.beginPath()
      for (const [i, j] of links) { ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y) }
      ctx.stroke()
      ctx.fillStyle = ink
      ctx.globalAlpha = 0.9
      for (const p of pts) ctx.fillRect(p.x - 0.7, p.y - 0.7, 1.4, 1.4)
      ctx.fillStyle = accent
      for (const p of web) { ctx.globalAlpha = 0.8; ctx.beginPath(); ctx.arc(p.x, p.y, 1.4, 0, 6.28); ctx.fill() }
      ctx.globalAlpha = 1
    }

    const loop = (t: number) => { draw(t); if (!reduce && visible) raf = requestAnimationFrame(loop) }
    const start = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(loop) }

    readColours()
    layout()
    start()
    const ro = new ResizeObserver(() => { layout(); if (reduce) draw(0) })
    ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start() })
    io.observe(canvas)
    const mo = new MutationObserver(() => { readColours(); if (reduce) draw(0) })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); mo.disconnect() }
  }, [seed])

  return <canvas ref={ref} className="plexus" aria-hidden="true" />
}
