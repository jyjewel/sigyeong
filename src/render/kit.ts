// 여러 작품이 함께 쓰는 픽셀아트 부품
import { H, W, disc, dot, hash, mod, px } from './pixel'
import type { Ctx } from './pixel'

/** 띠 모양 하늘 그라데이션 (경계는 디더링) */
export function sky(ctx: Ctx, colors: string[], height = H) {
  const band = Math.ceil(height / colors.length)
  for (let y = 0; y < height; y++) {
    const i = Math.min(colors.length - 1, Math.floor(y / band))
    px(ctx, 0, y, W, 1, colors[i])
    if (y % band >= band - 2 && i + 1 < colors.length) {
      for (let x = y % 2; x < W; x += 2) dot(ctx, x, y, colors[i + 1])
    }
  }
}

export function stars(ctx: Ctx, n: number, seed: number, y0: number, y1: number, t: number, color = '#f2f0dc') {
  for (let i = 0; i < n; i++) {
    const x = hash(seed + i * 3.1) * W
    const y = y0 + hash(seed + i * 7.3) * (y1 - y0)
    const tw = Math.sin(t * (1 + hash(i) * 2) + i)
    if (tw > -0.6) dot(ctx, x, y, color)
    if (hash(seed + i) > 0.85 && tw > 0.3) {
      dot(ctx, x - 1, y, color)
      dot(ctx, x + 1, y, color)
      dot(ctx, x, y - 1, color)
      dot(ctx, x, y + 1, color)
    }
  }
}

export function moon(ctx: Ctx, x: number, y: number, r: number, glow = true) {
  if (glow) {
    ctx.save()
    for (let k = 3; k >= 1; k--) {
      ctx.globalAlpha = 0.07
      disc(ctx, x, y, r + k * 4, '#fff7d6')
    }
    ctx.restore()
  }
  disc(ctx, x, y, r, (dy) => (dy > r * 0.4 ? '#e9e0bd' : '#fbf6e2'))
  dot(ctx, x - 2, y - 1, '#e2d8b4')
  dot(ctx, x + 1, y + 2, '#e2d8b4')
}

export function ridge(ctx: Ctx, f: (x: number) => number, color: string, edge?: string, x0 = 0, x1 = W, bottom = H) {
  for (let x = x0; x < x1; x++) {
    const y = Math.round(f(x))
    if (y >= bottom) continue
    px(ctx, x, y, 1, bottom - y, color)
    if (edge) dot(ctx, x, y, edge)
  }
}

export interface TreePal {
  dark: string
  base: string
  light: string
  trunk?: string
}
export const AUTUMN: TreePal = { dark: '#8e3f1f', base: '#c8662a', light: '#e8994a' }
export const GREEN: TreePal = { dark: '#2f5a32', base: '#467a3f', light: '#6b9a52' }
export const SPRING: TreePal = { dark: '#4f7a3a', base: '#6e9a48', light: '#94bb5e' }

const BLOBS: [number, number, number][] = [
  [0, 0, 6],
  [-5, 2, 5],
  [5, 2, 5],
  [-2, -4, 5],
  [3, -4, 4],
]

export function treeTop(x: number, y: number, s: number) {
  return { x, y: y - 12 * s }
}

/** 활엽수 */
export function broadTree(ctx: Ctx, x: number, y: number, s: number, pal: TreePal, sway = 0) {
  const th = Math.round(7 * s)
  px(ctx, x - 1, y - th, s > 1 ? 3 : 2, th, pal.trunk ?? '#4a3426')
  const c = treeTop(x, y, s)
  for (const [bx, by, br] of BLOBS) {
    const r = Math.max(2, Math.round(br * s))
    const k = 0.6 + (-by + 4) / 10
    disc(ctx, c.x + bx * s + sway * k, c.y + by * s, r, (dy) => (dy < -r * 0.35 ? pal.light : dy > r * 0.4 ? pal.dark : pal.base))
  }
  for (let i = 0; i < 5 * s; i++) {
    const a = hash(x * 7 + i) * 6.28
    const rr = hash(x * 3 + i * 5) * 6 * s
    dot(ctx, c.x + Math.cos(a) * rr + sway, c.y + Math.sin(a) * rr * 0.8, i % 2 ? pal.dark : pal.light)
  }
}

/** 수관 안의 결정적 점들 */
export function canopyPts(x: number, y: number, s: number, n: number, seed: number) {
  const c = treeTop(x, y, s)
  const out: { x: number; y: number }[] = []
  for (let i = 0; i < n; i++) {
    const b = BLOBS[Math.floor(hash(seed + i * 13 + x) * BLOBS.length)]
    const a = hash(seed * 3 + i * 7 + x) * 6.28
    const rr = Math.sqrt(hash(seed * 5 + i * 11 + y)) * b[2] * s * 0.85
    out.push({ x: c.x + b[0] * s + Math.cos(a) * rr, y: c.y + b[1] * s + Math.sin(a) * rr })
  }
  return out
}

/** 소나무: 층층이 평평한 잎 */
export function pine(ctx: Ctx, x: number, y: number, s: number, sway = 0, pal = { dark: '#1f3b2c', base: '#2f5440', light: '#4a7258' }) {
  const h = Math.round(30 * s)
  for (let i = 0; i < h; i++) {
    const bend = Math.round(Math.sin(i * 0.15 + x) * 1.5 * s)
    px(ctx, x + bend, y - i, s > 0.9 ? 2 : 1, 1, '#5a3e2c')
  }
  const tiers = Math.max(3, Math.round(4 * s))
  for (let k = 0; k < tiers; k++) {
    const ty = y - h * 0.35 - k * (h * 0.65) / tiers
    const w = (12 - k * 2) * s
    const side = k % 2 ? 1 : -1
    const cx = x + side * w * 0.3 + sway * (k / tiers)
    px(ctx, cx - w / 2, ty - 2, w, 2, pal.light)
    px(ctx, cx - w / 2 - 1, ty, w + 2, 2, pal.base)
    px(ctx, cx - w / 2, ty + 2, w, 1, pal.dark)
  }
}

/** 대나무 한 그루 */
export function bamboo(ctx: Ctx, x: number, y: number, h: number, sway = 0, t = 0) {
  for (let i = 0; i < h; i++) {
    const f = i / h
    const bx = x + sway * f * f
    px(ctx, bx, y - i, 2, 1, i % 9 === 0 ? '#3f6a33' : '#5d8f45')
  }
  for (let k = 1; k < h / 9; k++) {
    const f = (k * 9) / h
    const bx = x + sway * f * f
    const by = y - k * 9
    const side = k % 2 ? 1 : -1
    const fl = Math.round(Math.sin(t * 3 + k + x) * Math.abs(sway) * 0.3)
    px(ctx, bx + (side > 0 ? 2 : -5), by + fl, 5, 1, '#4f8a3c')
    px(ctx, bx + (side > 0 ? 4 : -7), by + 1 + fl, 4, 1, '#77a85a')
  }
}

export function grassBlade(ctx: Ctx, x: number, y: number, h: number, lean: number, color: string) {
  for (let i = 0; i < h; i++) {
    const f = i / h
    dot(ctx, x + lean * f * f, y - i, color)
  }
}

export interface BoatOpts {
  len?: number
  mast?: number
  sail?: number
  lantern?: boolean
  hull?: string
  t?: number
}
/** 측면에서 본 배. (x, y) 는 수면 위 선체 가운데 */
export function boat(ctx: Ctx, x: number, y: number, o: BoatOpts = {}) {
  const len = o.len ?? 22
  const hull = o.hull ?? '#5a3d28'
  for (let r = 0; r < 4; r++) {
    const inset = r === 3 ? 4 : r === 2 ? 2 : r === 0 ? -1 : 0
    px(ctx, x - len / 2 + inset, y - 3 + r, len - inset * 2, 1, r === 0 ? '#7a5a3c' : hull)
  }
  // 뜸(지붕)
  px(ctx, x - len / 4, y - 7, len / 2, 4, '#3d3a32')
  px(ctx, x - len / 4 + 1, y - 8, len / 2 - 2, 1, '#55513f')
  if (o.mast) {
    px(ctx, x + 1, y - 3 - o.mast, 1, o.mast, '#3a2a1c')
    if (o.sail) {
      for (let i = 0; i < o.sail; i++) {
        const w = 2 + Math.round(i * 0.5)
        px(ctx, x + 2, y - 3 - o.mast + 2 + i, w, 1, i % 4 === 0 ? '#bfb39a' : '#d8ceb5')
      }
    }
  }
  if (o.lantern) {
    const fl = o.t ? Math.sin(o.t * 6) > 0 : true
    px(ctx, x + len / 2 - 3, y - 7, 2, 2, fl ? '#ffcf6a' : '#f0a845')
    ctx.save()
    ctx.globalAlpha = 0.16
    disc(ctx, x + len / 2 - 2, y - 6, 3, '#ffd27a')
    ctx.restore()
  }
}

/** 기와집 */
export function house(ctx: Ctx, x: number, y: number) {
  px(ctx, x + 1, y, 24, 2, '#4a4f57')
  px(ctx, x - 1, y + 2, 28, 2, '#3c4048')
  dot(ctx, x - 2, y + 1, '#3c4048')
  dot(ctx, x + 27, y + 1, '#3c4048')
  px(ctx, x + 1, y + 4, 24, 9, '#e6dfcc')
  for (const c of [1, 9, 17, 24]) px(ctx, x + c, y + 4, 1, 9, '#6b4a32')
  px(ctx, x + 11, y + 7, 4, 6, '#6b4a32')
  px(ctx, x + 3, y + 6, 4, 3, '#c9b98f')
  px(ctx, x + 19, y + 6, 4, 3, '#c9b98f')
}

/** 초가 */
export function hut(ctx: Ctx, x: number, y: number) {
  for (let r = 0; r < 6; r++) px(ctx, x + 3 - r, y + r, 18 + r * 2, 1, r < 2 ? '#b89b5e' : '#a3864d')
  px(ctx, x - 1, y + 6, 22, 1, '#7d653a')
  px(ctx, x + 1, y + 7, 18, 8, '#d9ccab')
  px(ctx, x + 8, y + 9, 4, 6, '#5f4630')
  px(ctx, x + 2, y + 9, 4, 3, '#a89567')
}

/** 아주 작은 사람 (3×8). facing: 1 오른쪽, -1 왼쪽 */
export function person(ctx: Ctx, x: number, y: number, robe: string, o: { head?: string; hat?: string; step?: number; bow?: number } = {}) {
  const bow = o.bow ?? 0
  px(ctx, x + 1 + bow, y, 2, 1, o.hat ?? '#1f1d22')
  px(ctx, x + 1 + bow, y + 1, 2, 2, o.head ?? '#e6c39b')
  px(ctx, x, y + 3, 3, 4, robe)
  const st = o.step ?? 0
  px(ctx, x + (st > 0 ? 0 : 0), y + 7, 1, 1, '#2a2622')
  px(ctx, x + 2 + (st > 0 ? 1 : 0), y + 7, 1, 1, '#2a2622')
}

/** 생각 풍선 */
export function bubble(ctx: Ctx, x: number, y: number, w: number, h: number, tx: number, ty: number) {
  const edge = '#5d4a37'
  const fill = '#fbf6e8'
  px(ctx, x + 2, y, w - 4, 1, edge)
  px(ctx, x + 2, y + h - 1, w - 4, 1, edge)
  px(ctx, x, y + 2, 1, h - 4, edge)
  px(ctx, x + w - 1, y + 2, 1, h - 4, edge)
  dot(ctx, x + 1, y + 1, edge)
  dot(ctx, x + w - 2, y + 1, edge)
  dot(ctx, x + 1, y + h - 2, edge)
  dot(ctx, x + w - 2, y + h - 2, edge)
  px(ctx, x + 2, y + 1, w - 4, h - 2, fill)
  px(ctx, x + 1, y + 2, w - 2, h - 4, fill)
  // 꼬리 방울
  const mx = (x + w / 2 + tx) / 2
  const my = (y + h + ty) / 2
  px(ctx, mx - 1, my - 1, 3, 3, fill)
  dot(ctx, mx - 2, my, edge)
  dot(ctx, mx + 2, my, edge)
  px(ctx, tx, ty, 2, 2, fill)
  dot(ctx, tx - 1, ty, edge)
}

export function rain(ctx: Ctx, t: number, n: number, speed: number, color = 'rgba(210,225,235,0.7)', len = 4, slant = -1) {
  ctx.fillStyle = color
  for (let i = 0; i < n; i++) {
    const x0 = hash(i * 1.7) * (W + 40)
    const y = mod(hash(i * 3.3) * H + t * speed, H + 10) - 5
    const x = mod(x0 + slant * (y * 0.3), W + 10) - 5
    for (let k = 0; k < len; k++) ctx.fillRect(Math.round(x + slant * k * 0.3), Math.round(y + k), 1, 1)
  }
}

export function snowfall(ctx: Ctx, t: number, n: number, color = '#ffffff') {
  for (let i = 0; i < n; i++) {
    const y = mod(hash(i * 3.1) * H + t * (8 + hash(i) * 8), H + 6) - 3
    const x = mod(hash(i * 1.3) * W + Math.sin(t + i) * 3, W)
    dot(ctx, x, y, color)
  }
}

export function flower(ctx: Ctx, x: number, y: number, petal: string, center: string) {
  dot(ctx, x - 1, y, petal)
  dot(ctx, x + 1, y, petal)
  dot(ctx, x, y - 1, petal)
  dot(ctx, x, y + 1, petal)
  dot(ctx, x, y, center)
}

export function sparkle(ctx: Ctx, x: number, y: number, color: string, big = false) {
  dot(ctx, x, y, color)
  if (big) {
    dot(ctx, x - 1, y, color)
    dot(ctx, x + 1, y, color)
    dot(ctx, x, y - 1, color)
    dot(ctx, x, y + 1, color)
  }
}

/** 반투명 덮개 (안개·빛 등) */
export function veil(ctx: Ctx, alpha: number, color: string, x = 0, y = 0, w = W, h = H) {
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.fillStyle = color
  ctx.fillRect(x, y, w, h)
  ctx.restore()
}

export function withAlpha(ctx: Ctx, a: number, f: () => void) {
  ctx.save()
  ctx.globalAlpha *= a
  f()
  ctx.restore()
}

/** 엷게 흐르는 안개 띠 */
export function mistBands(ctx: Ctx, t: number, ys: number[], color = '#eef2f2', alpha = 0.45) {
  withAlpha(ctx, alpha, () => {
    ys.forEach((y, k) => {
      for (let i = 0; i < 5; i++) {
        const len = 30 + hash(k * 9 + i) * 40
        const x = mod(hash(k * 5 + i * 3) * W + t * (4 + k), W + len) - len
        px(ctx, x, y + (i % 2), len, 1, color)
        px(ctx, x + 6, y + 1 + (i % 2), len - 12, 1, color)
      }
    })
  })
}

/** 날아가는 새 (5×2) */
export function bird(ctx: Ctx, x: number, y: number, frame: number, color = '#2f2f36') {
  if (frame) {
    dot(ctx, x - 2, y - 1, color)
    dot(ctx, x + 2, y - 1, color)
    px(ctx, x - 1, y, 3, 1, color)
  } else {
    px(ctx, x - 1, y, 3, 1, color)
    dot(ctx, x - 2, y + 1, color)
    dot(ctx, x + 2, y + 1, color)
  }
}
