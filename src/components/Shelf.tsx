import { useEffect, useRef } from 'react'
import { ctx2d, disc, dot, hash, mod, px } from '../render/pixel'
import type { Ctx } from '../render/pixel'

// 책가도(冊架圖) 책장: 픽셀 그림 위에 책 제목·진행 수를 글자로 얹는다.
const SW = 180
const SH = 300
const ROW_H = 70
const GAP = 4
const WIDE = 96
const NARROW = 72

export type BookId = 'v8' | 'v9' | 'app'

export interface ShelfBook {
  id: BookId
  /** 띠지 위쪽 작은 글자 (附錄) */
  pre?: string
  title: string
  /** 띠지 아래쪽 작은 글자 (卷八) */
  sub?: string
  done: number
  total: number
  cover: 'indigo' | 'ochre'
}

interface Cell {
  x: number
  y: number
  w: number
  h: number
}

/** 줄마다 넓은 칸과 좁은 칸이 엇갈린다. book 은 넓은 칸에 꽂힌다 */
function cells(): { book: Cell[]; things: Cell[] } {
  const book: Cell[] = []
  const things: Cell[] = []
  for (let r = 0; r < 4; r++) {
    const y = 4 + r * (ROW_H + GAP)
    const wideLeft = r % 2 === 0
    const wide = { x: wideLeft ? 4 : 4 + NARROW + GAP, y, w: WIDE, h: ROW_H }
    const narrow = { x: wideLeft ? 4 + WIDE + GAP : 4, y, w: NARROW, h: ROW_H }
    // 0·1·3 줄의 넓은 칸에 책, 2 줄은 족자
    if (r === 2) things.push(wide, narrow)
    else {
      book.push(wide)
      things.push(narrow)
    }
  }
  return { book, things }
}
const CELLS = cells()
const BOOK_W = 40
const BOOK_H = 58
const bookRect = (c: Cell) => ({ x: c.x + Math.round((c.w - BOOK_W) / 2), y: c.y + c.h - 4 - BOOK_H, w: BOOK_W, h: BOOK_H })

const COVERS = {
  indigo: { base: '#2f4466', dark: '#1d2b44', dot: '#3c5478' },
  ochre: { base: '#a5683a', dark: '#6e4022', dot: '#b87a48' },
}

function cabinet(ctx: Ctx) {
  px(ctx, 0, 0, SW, SH, '#2e1c10')
  px(ctx, 1, 1, SW - 2, SH - 2, '#5b3a22')
  px(ctx, 2, 2, SW - 4, 1, '#7a5232')
  for (const c of [...CELLS.book, ...CELLS.things]) {
    px(ctx, c.x - 1, c.y - 1, c.w + 2, c.h + 2, '#3e2614')
    for (let y = 0; y < c.h; y++) px(ctx, c.x, c.y + y, c.w, 1, y < 4 ? '#b9a47c' : y < 8 ? '#cbb68c' : '#d6c39a')
    // 선반 널
    px(ctx, c.x, c.y + c.h - 4, c.w, 4, '#8a6240')
    px(ctx, c.x, c.y + c.h - 4, c.w, 1, '#a87c52')
  }
}

function book(ctx: Ctx, c: Cell, cover: ShelfBook['cover']) {
  const r = bookRect(c)
  const k = COVERS[cover]
  px(ctx, r.x + 2, r.y + 2, r.w, r.h, 'rgba(40,20,8,0.45)')
  px(ctx, r.x, r.y, r.w, r.h, k.dark)
  px(ctx, r.x + 1, r.y + 1, r.w - 2, r.h - 2, k.base)
  for (let y = 3; y < r.h - 2; y += 5) for (let x = 3 + ((y / 5) % 2) * 2; x < r.w - 3; x += 5) dot(ctx, r.x + x, r.y + y, k.dot)
  // 띠지 자리 (글자는 위에 얹는다)
  px(ctx, r.x + 4, r.y + 4, 13, r.h - 8, '#c9b88e')
  px(ctx, r.x + 5, r.y + 5, 11, r.h - 10, '#f4ecd6')
  // 실 꿰맨 자리
  for (let i = 0; i < 5; i++) {
    const y = r.y + 5 + i * ((r.h - 10) / 4)
    px(ctx, r.x + r.w - 4, Math.round(y), 1, 1, '#e8dcc0')
    px(ctx, r.x + r.w - 3, Math.round(y), 2, 1, '#e8dcc0')
  }
  px(ctx, r.x + r.w - 5, r.y + 2, 1, r.h - 4, 'rgba(255,255,255,0.18)')
}

/** 매화 꽂은 백자 병 */
function plumVase(ctx: Ctx, c: Cell, t: number) {
  const cx = c.x + c.w / 2
  const base = c.y + c.h - 4
  const branch: [number, number][][] = [
    [[0, -28], [-3, -36], [-9, -44], [-15, -50]],
    [[0, -30], [5, -38], [12, -44], [19, -47]],
    [[-3, -36], [-2, -46], [1, -56]],
    [[5, -38], [7, -48], [5, -55]],
  ]
  for (const b of branch)
    for (let i = 0; i < b.length - 1; i++) {
      const [x0, y0] = b[i]
      const [x1, y1] = b[i + 1]
      for (let s = 0; s <= 6; s++) dot(ctx, Math.round(cx + x0 + ((x1 - x0) * s) / 6), Math.round(base + y0 + ((y1 - y0) * s) / 6), '#4a3020')
    }
  const blossoms: [number, number][] = [[-15, -50], [-9, -44], [19, -47], [12, -44], [1, -56], [-2, -46], [5, -55], [7, -48], [3, -34]]
  blossoms.forEach(([x, y], i) => {
    disc(ctx, cx + x, base + y, 2, i % 3 ? '#f3b6c8' : '#f7c9d6')
    dot(ctx, cx + x, base + y, '#c2264a')
  })
  // 지는 꽃잎
  for (let i = 0; i < 3; i++) {
    const f = mod(t * 0.12 + i / 3, 1)
    const x = cx - 12 + hash(i * 7) * 30 + Math.sin(t * 1.4 + i) * 3
    const y = base - 52 + f * 48
    if (f < 0.95) dot(ctx, Math.round(x), Math.round(y), '#f3b6c8')
  }
  // 병
  for (let y = 0; y < 28; y++) {
    const yy = base - 28 + y
    const half = y < 4 ? 4 : Math.round(4 + Math.sin(((y - 4) / 24) * Math.PI * 0.9) * 10)
    px(ctx, Math.round(cx - half), yy, half * 2, 1, y === 27 ? '#c8cec8' : '#eef0ea')
    dot(ctx, Math.round(cx - half), yy, '#9aa4a0')
    dot(ctx, Math.round(cx + half - 1), yy, '#9aa4a0')
  }
  for (let x = -7; x <= 7; x++) dot(ctx, Math.round(cx + x), Math.round(base - 14 + Math.sin(x * 0.6) * 2), '#3d5a8a')
}

/** 붓통과 두루마리 */
function brushes(ctx: Ctx, c: Cell) {
  const x0 = c.x + 14
  const base = c.y + c.h - 4
  ;[[-6, -50], [0, -54], [7, -49]].forEach(([dx, top], i) => {
    for (let y = top; y < -26; y++) dot(ctx, Math.round(x0 + 8 + dx * ((-26 - y) / (-26 - top))), base + y, i === 1 ? '#8a6a3a' : '#7a5a30')
    px(ctx, x0 + 7 + dx, base + top - 4, 2, 4, '#2b1f15')
  })
  px(ctx, x0, base - 28, 17, 28, '#3f5634')
  px(ctx, x0 + 1, base - 27, 15, 27, '#6b8a5a')
  for (let x = 0; x < 11; x++) {
    dot(ctx, x0 + 3 + x, base - 20 + Math.round(Math.abs(x - 5) * 0.5), '#a8c098')
    dot(ctx, x0 + 3 + x, base - 11 + Math.round(Math.abs(x - 5) * 0.5), '#a8c098')
  }
  // 두루마리
  px(ctx, c.x + 38, base - 9, 22, 9, '#8a6a42')
  px(ctx, c.x + 39, base - 8, 20, 7, '#efe4c8')
  px(ctx, c.x + 36, base - 7, 3, 5, '#b2352a')
  px(ctx, c.x + 59, base - 7, 3, 5, '#b2352a')
}

/** 산수 족자 */
function scrollPainting(ctx: Ctx, c: Cell, t: number) {
  const w = 34
  const h = 50
  const x = c.x + Math.round((c.w - w) / 2)
  const y = c.y + 6
  px(ctx, x - 3, y - 2, w + 6, 3, '#5a4330')
  px(ctx, x, y, w, h, '#8a6a42')
  px(ctx, x + 2, y + 1, w - 4, h - 2, '#f4ecd6')
  for (let i = 0; i < w - 6; i++) {
    const top = y + 26 - Math.round(Math.max(0, 14 - Math.abs(i - 12) * 1.2))
    px(ctx, x + 3 + i, top, 1, y + 40 - top, '#9aac7e')
  }
  px(ctx, x + 3, y + 40, w - 6, 6, '#98b6b2')
  px(ctx, x + 3 + Math.round(mod(t * 2, w - 10)), y + 42, 4, 1, '#c4d8d0')
  disc(ctx, x + w - 9, y + 9, 3, '#d9a441')
  px(ctx, x - 3, y + h, w + 6, 3, '#5a4330')
  px(ctx, x - 5, y + h + 1, 2, 2, '#3e2614')
  px(ctx, x + w + 3, y + h + 1, 2, 2, '#3e2614')
}

/** 벼루와 연적 */
function inkstone(ctx: Ctx, c: Cell) {
  const base = c.y + c.h - 4
  const x = c.x + 6
  px(ctx, x, base - 13, 36, 13, '#1e1e22')
  px(ctx, x + 1, base - 12, 34, 11, '#3a3a3e')
  px(ctx, x + 5, base - 10, 26, 4, '#26262a')
  px(ctx, x + 3, base - 19, 7, 6, '#2b2b2b')
  // 연적
  const cx = c.x + 54
  for (let y = 0; y < 11; y++) {
    const half = Math.round(Math.sin(((y + 1) / 12) * Math.PI) * 8)
    px(ctx, cx - half, base - 11 + y, half * 2, 1, '#e8ece6')
  }
  disc(ctx, cx, base - 12, 1.5, '#3d5a8a')
  for (let k = -4; k <= 4; k++) dot(ctx, cx + k, base - 6 + Math.round(Math.abs(k) * 0.3), '#3d5a8a')
}

/** 눕혀 쌓은 책과 도장 */
function stackedBooks(ctx: Ctx, c: Cell) {
  const base = c.y + c.h - 4
  const layers = [
    { x: 6, w: 58, c: '#3a5070', d: '#1d2b44' },
    { x: 10, w: 52, c: '#8a4a2a', d: '#5a2a14' },
    { x: 14, w: 46, c: '#4f6b3a', d: '#2f4320' },
  ]
  layers.forEach((l, i) => {
    const y = base - 8 * (i + 1)
    px(ctx, c.x + l.x, y, l.w, 8, l.d)
    px(ctx, c.x + l.x + 1, y + 1, l.w - 2, 6, l.c)
    px(ctx, c.x + l.x + 1, y + 1, l.w - 2, 1, '#efe4c8')
  })
  const sx = c.x + 40
  const sy = base - 24 - 11
  px(ctx, sx, sy, 9, 11, '#8a6a42')
  px(ctx, sx + 1, sy + 1, 7, 10, '#d9c08a')
  px(ctx, sx - 1, sy - 3, 11, 4, '#b2352a')
}

function drawShelf(ctx: Ctx, books: ShelfBook[], t: number) {
  cabinet(ctx)
  books.forEach((b, i) => CELLS.book[i] && book(ctx, CELLS.book[i], b.cover))
  const [scroll, ink, vase, brush, stack] = [CELLS.things[2], CELLS.things[3], CELLS.things[0], CELLS.things[1], CELLS.things[4]]
  plumVase(ctx, vase, t)
  brushes(ctx, brush)
  scrollPainting(ctx, scroll, t)
  inkstone(ctx, ink)
  stackedBooks(ctx, stack)
}

const pct = (v: number, of: number) => `${(v / of) * 100}%`

export function Shelf({ books, onOpen }: { books: ShelfBook[]; onOpen: (id: BookId) => void }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const booksRef = useRef(books)
  booksRef.current = books

  useEffect(() => {
    const canvas = ref.current!
    const ctx = ctx2d(canvas)
    let raf = 0
    let last = 0
    const loop = (ms: number) => {
      raf = requestAnimationFrame(loop)
      if (ms - last < 80) return
      last = ms
      drawShelf(ctx, booksRef.current, ms / 1000)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="shelf">
      <canvas ref={ref} width={SW} height={SH} className="pixel shelf-canvas" role="img" aria-label="책가도 책장" />
      {books.map((b, i) => {
        const r = bookRect(CELLS.book[i])
        const cell = CELLS.book[i]
        const complete = b.done === b.total
        return [
          <span
            key={`${b.id}-p`}
            className="shelf-prog"
            aria-hidden
            style={{ right: pct(SW - (cell.x + cell.w) + 3, SW), top: pct(cell.y + 3, SH) }}
          >
            {b.done} / {b.total}
          </span>,
          <button
            key={b.id}
            className="shelf-book"
            style={{ left: pct(r.x, SW), top: pct(r.y, SH), width: pct(r.w, SW), height: pct(r.h, SH) }}
            onClick={() => onOpen(b.id)}
            aria-label={`${b.pre ?? ''} ${b.title} ${b.sub ?? ''} 펼치기, ${b.total}수 중 ${b.done}수 완성`}
          >
            <span className="shelf-slip han" aria-hidden>
              {b.pre && <small>{b.pre}</small>}
              {b.title}
              {b.sub && <small>{b.sub}</small>}
            </span>
            {complete && (
              <span className="shelf-seal han" aria-hidden>
                完
              </span>
            )}
          </button>,
        ]
      })}
    </div>
  )
}
