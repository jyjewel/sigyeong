// 〈登高〉 기본 배경: 높은 누대, 먼 산, 협곡의 장강, 가을 나무, 모래톱.
// 원문에 없는 해·달·건축물·동물은 그리지 않는다.
import type { Background } from '../types'
import { H, W, disc, fillRows, hash, px, dot } from '../pixel'
import type { Ctx, Env } from '../pixel'

// ── 장면 기하 (스프라이트들이 공유) ─────────────────────────────
export const RIVER_TOP = 104
export function riverL(y: number) {
  return 172 - (y - RIVER_TOP) * 0.55
}
export function riverR(y: number) {
  return Math.min(W, 184 + ((y - RIVER_TOP) * 136) / 46)
}
export const riverBounds = (y: number): [number, number] => [riverL(y), riverR(y)]

export const SANDBAR = { x: 226, y: 139, rx: 24, ry: 4 }
export const POET = { x: 94, y: 96 } // 인물 격자의 좌상단 (발끝 y=117)
export const PLATFORM = { x0: 46, x1: 136, top: 113 }
export const BAG = { x: 64, y: 106 }
export const CUP = { x: 116, y: 114 }
export const HOUSE = { x: 268, y: 106 }

function wallLeft(x: number) {
  return 46 + Math.pow(Math.max(0, x) / 178, 2.2) * 60 + (hash(x * 0.37) - 0.5) * 3
}
function wallRight(x: number) {
  return 106 - Math.pow(Math.max(0, x - 180) / 140, 0.6) * 48 + (hash(x * 0.53 + 9) - 0.5) * 3
}
function cliffTop(x: number) {
  return x < 48 ? 103 + x * 0.27 : 116
}
function cliffRight(y: number) {
  return 141 - (y - 116) * 0.17
}

// ── 나무 ──────────────────────────────────────────────────────
export interface Tree {
  x: number
  y: number
  s: number
  c: 0 | 1
  far?: boolean
}
export const TREES: Tree[] = [
  { x: 118, y: 84, s: 0.55, c: 0, far: true },
  { x: 136, y: 91, s: 0.5, c: 1, far: true },
  { x: 206, y: 99, s: 0.5, c: 0, far: true },
  { x: 288, y: 76, s: 0.55, c: 1, far: true },
  { x: 240, y: 111, s: 0.8, c: 1 },
  { x: 256, y: 104, s: 1.0, c: 0 },
  { x: 304, y: 100, s: 1.1, c: 1 },
  { x: 318, y: 110, s: 0.9, c: 0 },
  { x: 5, y: 104, s: 0.9, c: 1 },
  { x: 21, y: 107, s: 1.25, c: 0 },
  { x: 38, y: 113, s: 0.75, c: 1 },
]

const TREE_COLORS = [
  { dark: '#8e3f1f', base: '#c8662a', light: '#e8994a' },
  { dark: '#6b2a1b', base: '#a5452b', light: '#cf6c3d' },
]
const FAR_COLORS = [
  { dark: '#7d5f52', base: '#a07560', light: '#bb8d6c' },
  { dark: '#6c5250', base: '#8d6458', light: '#a87866' },
]
const BLOBS: [number, number, number][] = [
  [0, 0, 6],
  [-5, 2, 5],
  [5, 2, 5],
  [-2, -4, 5],
  [3, -4, 4],
]

export function canopyCenter(t: Tree) {
  return { x: t.x, y: t.y - 7 * t.s - 5 * t.s }
}

/** 바람에 따른 수관(樹冠) 흔들림. k 는 위쪽일수록 큰 계수 */
export function treeSway(tree: Tree, env: Env, k = 1) {
  const w = env.wind
  if (w <= 0) return 0
  const amp = (0.8 + w * 2.6) * tree.s
  const bias = -w * w * 2.2 * tree.s
  const ph = hash(tree.x) * 6.28
  return (bias + amp * Math.sin(env.t * (1.4 + w * 5) + ph)) * k
}

export function drawTree(ctx: Ctx, tree: Tree, env: Env) {
  const pal = tree.far ? FAR_COLORS[tree.c] : TREE_COLORS[tree.c]
  const trunkH = Math.round(7 * tree.s)
  const tw = tree.s > 1 ? 3 : 2
  px(ctx, tree.x - 1, tree.y - trunkH, tw, trunkH, tree.far ? '#5a4a44' : '#4a3426')
  const c = canopyCenter(tree)
  for (const [bx, by, br] of BLOBS) {
    const r = Math.max(2, Math.round(br * tree.s))
    const k = 0.6 + (-by + 4) / 10
    const off = treeSway(tree, env, k)
    disc(ctx, c.x + bx * tree.s + off, c.y + by * tree.s, r, (dy) =>
      dy < -r * 0.35 ? pal.light : dy > r * 0.4 ? pal.dark : pal.base,
    )
  }
  // 잎의 얼룩
  for (let i = 0; i < 6 * tree.s; i++) {
    const a = hash(tree.x * 7 + i) * 6.28
    const rr = hash(tree.x * 3 + i * 5) * 6 * tree.s
    const off = treeSway(tree, env, 1)
    dot(ctx, c.x + Math.cos(a) * rr + off, c.y + Math.sin(a) * rr * 0.8, i % 2 ? pal.dark : pal.light)
  }
}

/** 나무 수관 안의 결정적 점들 (꽃·새싹 오버레이용) */
export function canopyPoints(tree: Tree, n: number, seed: number) {
  const c = canopyCenter(tree)
  const pts: { x: number; y: number; k: number }[] = []
  for (let i = 0; i < n; i++) {
    const b = BLOBS[Math.floor(hash(seed + i * 13 + tree.x) * BLOBS.length)]
    const a = hash(seed * 3 + i * 7 + tree.x) * 6.28
    const rr = Math.sqrt(hash(seed * 5 + i * 11 + tree.y)) * b[2] * tree.s * 0.85
    pts.push({
      x: c.x + b[0] * tree.s + Math.cos(a) * rr,
      y: c.y + b[1] * tree.s + Math.sin(a) * rr,
      k: 0.6 + (-b[1] + 4) / 10,
    })
  }
  return pts
}

// ── 그리기 ────────────────────────────────────────────────────
const SKY = ['#b9d0df', '#c3d7e4', '#cddee8', '#d6e4ec', '#dfe9ef', '#e6eef1']

function drawSky(ctx: Ctx) {
  const band = 14
  for (let y = 0; y < 100; y++) {
    const i = Math.min(SKY.length - 1, Math.floor(y / band))
    px(ctx, 0, y, W, 1, SKY[i])
    // 띠 경계 디더링
    if (y % band >= band - 2 && i + 1 < SKY.length) {
      for (let x = (y % 2); x < W; x += 2) dot(ctx, x, y, SKY[i + 1])
    }
  }
  // 높은 하늘의 엷은 구름결 (가을 하늘)
  for (let i = 0; i < 7; i++) {
    const cx = hash(i * 9.1) * W
    const cy = 10 + hash(i * 4.3) * 34
    const len = 18 + hash(i * 2.2) * 30
    px(ctx, cx, cy, len, 1, '#e9f1f4')
    px(ctx, cx + 4, cy + 1, len * 0.6, 1, '#dde8ee')
  }
}

function ridgeLayer(ctx: Ctx, f: (x: number) => number, color: string, edge: string) {
  for (let x = 0; x < W; x++) {
    const y = Math.round(f(x))
    px(ctx, x, y, 1, H - y, color)
    dot(ctx, x, y, edge)
  }
}

function drawWalls(ctx: Ctx) {
  // 왼쪽 협곡 벽
  for (let x = 0; x <= 178; x++) {
    const top = Math.round(wallLeft(x))
    const streak = hash(x * 3.1) < 0.22
    for (let y = top; y < H; y++) {
      let c = streak ? '#5f7285' : '#6e8193'
      if ((y + Math.floor(x / 9)) % 8 === 0) c = '#64778a'
      if (y - top < 2) c = '#8a9cab'
      px(ctx, x, y, 1, 1, c)
    }
  }
  // 오른쪽 협곡 벽
  for (let x = 180; x < W; x++) {
    const top = Math.round(wallRight(x))
    const streak = hash(x * 2.7) < 0.22
    for (let y = top; y < H; y++) {
      let c = streak ? '#5c6e80' : '#69798b'
      if ((y + Math.floor(x / 11)) % 9 === 0) c = '#607184'
      if (y - top < 2) c = '#8193a3'
      px(ctx, x, y, 1, 1, c)
    }
  }
  // 협곡 벽 아래쪽의 가을 덤불
  for (let i = 0; i < 140; i++) {
    const right = i % 2 === 0
    const x = right ? 182 + hash(i * 1.7) * 138 : hash(i * 2.3) * 176
    const top = right ? wallRight(x) : wallLeft(x)
    const y = top + 8 + hash(i * 3.9) * (H - top - 8)
    const c = hash(i * 5.1) < 0.5 ? '#94603f' : '#a8714a'
    px(ctx, x, y, 2, 1, c)
  }
}

function drawRiverBase(ctx: Ctx) {
  fillRows(ctx, RIVER_TOP, H, riverBounds, (y) => (y < 112 ? '#9fb5c1' : y < 130 ? '#8ea6b4' : '#839cab'))
  // 오른쪽 기슭의 모래띠
  for (let y = RIVER_TOP; y < H; y++) {
    const r = riverR(y)
    if (r >= W) continue
    px(ctx, r, y, 2 + (y - RIVER_TOP) * 0.08, 1, '#b3a888')
  }
  // 상류의 물안개
  for (let y = 96; y < 110; y++) {
    for (let x = 150; x < 212; x++) {
      const d = Math.abs(x - 179) / 32 + Math.abs(y - 103) / 8
      if (d < 1 && (x + y) % 2 === 0 && hash(x * 7 + y) > d * 0.8) dot(ctx, x, y, '#d3dee3')
    }
  }
}

function drawSandbar(ctx: Ctx) {
  const { x, y, rx, ry } = SANDBAR
  // 맑은 물가 테두리
  for (let dy = -ry - 1; dy <= ry + 1; dy++) {
    const half = Math.round((rx + 3) * Math.sqrt(Math.max(0, 1 - (dy * dy) / ((ry + 1.5) * (ry + 1.5)))))
    px(ctx, x - half, y + dy, half * 2, 1, '#b8ccd5')
  }
  for (let dy = -ry; dy <= ry; dy++) {
    const half = Math.round(rx * Math.sqrt(Math.max(0, 1 - (dy * dy) / (ry * ry + 0.5))))
    px(ctx, x - half, y + dy, half * 2, 1, dy >= ry - 1 ? '#d2c9b2' : '#efe9da')
  }
  for (let i = 0; i < 10; i++) dot(ctx, x - rx + 4 + hash(i * 3.3) * (rx * 2 - 8), y - 1 + hash(i * 7.7) * 3, '#ddd4bf')
}

function drawCliff(ctx: Ctx) {
  for (let y = 103; y < H; y++) {
    let x1: number
    if (y < 116) x1 = Math.min(48, (y - 103) / 0.27)
    else x1 = cliffRight(y)
    for (let x = 0; x < x1; x++) {
      const top = cliffTop(x)
      if (y < top) continue
      let c = '#5d5a52'
      if ((y * 3 + Math.floor(x / 7) * 5) % 11 === 0) c = '#4c4943'
      else if (hash(x * 13 + y * 7) < 0.06) c = '#77736a'
      if (x > x1 - 2) c = '#46433d'
      if (x < 48 && y - top < 2) c = hash(x) < 0.5 ? '#7c6b47' : '#a08d58'
      dot(ctx, x, y, c)
    }
  }
  // 마른 풀
  for (let i = 0; i < 18; i++) {
    const x = hash(i * 4.1) * 46
    const y = cliffTop(x)
    px(ctx, x, y - 2, 1, 2, '#b49f62')
  }
  // 누대(臺): 돌로 쌓은 높은 단
  const { x0, x1, top } = PLATFORM
  px(ctx, x0, top, x1 - x0, 5, '#c4b69b')
  for (let x = x0 + 6; x < x1; x += 11) px(ctx, x, top, 1, 5, '#ab9d82')
  px(ctx, x0, top, x1 - x0, 1, '#d6caae')
  px(ctx, x0, top + 5, x1 - x0, 5, '#958670')
  for (let x = x0 + 3; x < x1; x += 8) px(ctx, x, top + 5, 1, 5, '#7e705d')
  px(ctx, x0, top + 7, x1 - x0, 1, '#867762')
  px(ctx, x0, top + 10, x1 - x0, 1, '#3e3b36')
  // 왼쪽 돌계단
  px(ctx, x0 - 5, top + 3, 5, 3, '#b3a58a')
  px(ctx, x0 - 5, top + 6, 5, 4, '#8a7c68')
  px(ctx, x0 - 10, top + 7, 5, 3, '#b3a58a')
}

export const denggaoBackground: Background = {
  id: 'denggao',
  drawBack(ctx) {
    drawSky(ctx)
    ridgeLayer(
      ctx,
      (x) => 58 + 9 * Math.sin(x * 0.035 + 0.5) + 5 * Math.sin(x * 0.083 + 2) + hash(x) * 1.5,
      '#aebdc8',
      '#bfccd5',
    )
    ridgeLayer(
      ctx,
      (x) => 76 + 10 * Math.sin(x * 0.027 + 1.7) + 4 * Math.sin(x * 0.11) + hash(x + 50) * 1.5,
      '#93a5b4',
      '#a6b6c3',
    )
    drawWalls(ctx)
    drawRiverBase(ctx)
  },
  drawFront(ctx) {
    drawSandbar(ctx)
    drawCliff(ctx)
  },
  drawDynamic(ctx, env) {
    for (const t of TREES) drawTree(ctx, t, env)
  },
}
