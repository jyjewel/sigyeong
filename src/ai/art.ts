// ─────────────────────────────────────────────────────────────
//  AI가 만든 '그리기 설명(JSON)'을 배경·스프라이트로 바꾸는 해석기.
//  AI의 출력은 코드로 실행하지 않는다. 정해진 부품(type)만 읽고,
//  모든 숫자·색은 범위를 검사한 뒤 기존 픽셀 도구(kit, figures)로 그린다.
// ─────────────────────────────────────────────────────────────
import type { Rect } from '../data/types'
import type { Background, Sprite } from '../render/types'
import { H, W, disc, dot, hash, mod, px } from '../render/pixel'
import type { Ctx, Env } from '../render/pixel'
import {
  AUTUMN, GREEN, SPRING, bamboo, bird, boat, broadTree, bubble, flower, grassBlade, house, hut, mistBands, moon,
  person, pine, rain, ridge, snowfall, sparkle, stars, veil, withAlpha,
} from '../render/kit'
import type { TreePal } from '../render/kit'
import { OTHER_PALS, POET_PAL, pal, seatFig, standFig } from '../render/figures'

/** 그리기 요소 하나. AI가 쓰는 형식 그대로 (검증 전) */
export type RawElement = Record<string, unknown> & { type?: unknown }

export interface ArtLayer {
  name: string
  z: number
  wind?: number
  elements: RawElement[]
}

export interface ArtSpec {
  background: { sky: string[]; elements: RawElement[] }
  /** 스프라이트 id → 레이어 */
  layers: Record<string, ArtLayer>
}

/** AI에게 알려 주는 부품 목록. 프롬프트와 해석기가 같은 목록을 쓴다 */
export const ELEMENT_DOC = `좌표계: 캔버스 320×180, 왼쪽 위가 (0,0), y는 아래로 커진다. 지평선은 보통 y=100~125.
색은 "#rrggbb". 크기 단위는 픽셀.
- {"type":"rect","x","y","w","h","color"} 사각형 (벽, 땅 조각, 창 등)
- {"type":"disc","x","y","r","color"} 원
- {"type":"ground","y","color","color2"?} y부터 아래 전체를 땅으로 채움
- {"type":"water","y","color","highlight"?} y부터 아래 전체를 물로 채움(물결 무늬 포함)
- {"type":"mountains","y","height","color","edge"?,"seed","x0"?,"x1"?} 산등성이. y는 산 밑동, height는 높이(10~80). 먼 산일수록 옅은 색. x0~x1로 가로 범위를 좁힐 수 있다(예: 창 안)
- {"type":"moon","x","y","r"} 달 (r 5~14) / {"type":"sun","x","y","r","color"?} 해
- {"type":"stars","count"} 밤하늘의 별 (깜박임)
- {"type":"cloud","x","y","w","color"?} 흘러가는 구름
- {"type":"tree","kind","x","y","size","season"?} kind: "broad"(활엽수) | "pine"(소나무) | "bamboo"(대나무) | "willow"(버드나무) | "bare"(앙상한 나무) | "blossom"(꽃나무). x,y는 나무 밑동. size 0.5~2.5. season: "spring"|"summer"|"autumn"|"winter"
- {"type":"grass","x0","x1","y","color"?} 풀밭 / {"type":"flowers","x0","x1","y","color"} 꽃 무리
- {"type":"boat","x","y","length"?,"lantern"?,"sail"?} 배. y는 수면
- {"type":"house","x","y"} 기와집(28×13) / {"type":"hut","x","y"} 초가(22×15) / {"type":"pavilion","x","y","size"?} 누각·정자 / {"type":"bridge","x","y","w"} 아치 다리 / {"type":"wall","x","y","w","h"} 성벽
- {"type":"person","x","y","pose","robe"?,"flip"?,"scale"?} 인물. pose: "stand"(14×22) | "seat"(14×16) | "mini"(3×8, 먼 곳). x,y는 왼쪽 위. 기본은 오른쪽을 봄, flip:true면 왼쪽. scale 1~3
- {"type":"birds","x","y","count"?,"color"?} 날아가는 새 떼 / {"type":"smoke","x","y"} 피어오르는 연기
- {"type":"rain","count"?} 비 / {"type":"snow","count"?} 눈 / {"type":"leaves","count"?,"color"?} 떨어지는 잎이나 꽃잎
- {"type":"mist","ys":[y,...]} 안개 띠 / {"type":"glow","x","y","r","color"} 은은한 빛 / {"type":"veil","color","alpha"} 장면 전체에 색을 덮음(alpha 0.05~0.5)
- {"type":"bubble","x","y","w","h","tx","ty"} 생각 풍선. (tx,ty)는 꼬리 끝(인물 머리 근처). 풍선 안 그림은 뒤에 이어서 작은 요소로 그린다`

// ── 값 검사 ──────────────────────────────────────────────────
const num = (v: unknown, d: number, lo: number, hi: number) => {
  const n = typeof v === 'number' ? v : typeof v === 'string' ? parseFloat(v) : NaN
  return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : d
}
const X = (v: unknown, d = W / 2) => num(v, d, -40, W + 40)
const Y = (v: unknown, d = H / 2) => num(v, d, -40, H + 40)
const COLOR = /^#[0-9a-f]{3}([0-9a-f]{3})?$/i
const col = (v: unknown, d: string) => (typeof v === 'string' && COLOR.test(v) ? v : d)
const bool = (v: unknown) => v === true || v === 'true'

const MAX_ELEMENTS = 40

const TREE_PALS: Record<string, TreePal> = {
  spring: SPRING,
  summer: GREEN,
  autumn: AUTUMN,
  winter: { dark: '#5c5a58', base: '#7a7672', light: '#d8dde0' },
}
const BLOSSOM: TreePal = { dark: '#c97a8e', base: '#e7a3b4', light: '#f7d4dc' }

// ── 부품 ────────────────────────────────────────────────────
// 움직이는 부품은 배경에서 매 프레임 따로 그린다
const ANIMATED = new Set(['stars', 'cloud', 'birds', 'smoke', 'rain', 'snow', 'leaves', 'mist'])
/** 장면 전체를 덮는 부품 (미리보기 영역 = 화면 전체) */
const FULL = new Set(['rain', 'snow', 'leaves', 'mist', 'veil', 'stars', 'ground', 'water'])

function mountainFn(base: number, height: number, seed: number) {
  const a = 0.013 + hash(seed) * 0.02
  const b = 0.031 + hash(seed + 1) * 0.04
  const p = hash(seed + 2) * 6.28
  return (x: number) => base - height * (0.55 + 0.3 * Math.sin(x * a + p) + 0.15 * Math.sin(x * b + p * 2))
}

function willow(ctx: Ctx, x: number, y: number, s: number, pal: TreePal, sway: number) {
  const th = Math.round(16 * s)
  px(ctx, x - 1, y - th, 2, th, '#4a3426')
  disc(ctx, x, y - th - 3 * s, Math.round(7 * s), pal.dark)
  for (let i = 0; i < 14 * s; i++) {
    const sx = x - 10 * s + hash(x + i * 3.3) * 20 * s
    const len = (10 + hash(i * 7.1 + x) * 14) * s
    for (let k = 0; k < len; k++) {
      const f = k / len
      dot(ctx, sx + sway * f * f * 1.5, y - th - 6 * s + k, k % 3 ? pal.base : pal.light)
    }
  }
}

function bareTree(ctx: Ctx, x: number, y: number, s: number, sway: number) {
  const th = Math.round(14 * s)
  px(ctx, x - 1, y - th, 2, th, '#4a3a30')
  const branch = (bx: number, by: number, dx: number, len: number, depth: number) => {
    for (let k = 0; k < len; k++) dot(ctx, bx + (dx * k) / len + (sway * k) / len / 2, by - k, '#4a3a30')
    if (depth > 0) {
      branch(bx + dx, by - len, dx * 0.7 + 3 * s, len * 0.6, depth - 1)
      branch(bx + dx, by - len, dx * 0.7 - 3 * s, len * 0.6, depth - 1)
    }
  }
  branch(x, y - th, -4 * s, 8 * s, 2)
  branch(x, y - th, 4 * s, 9 * s, 2)
}

function pavilion(ctx: Ctx, x: number, y: number, s: number) {
  const w = Math.round(30 * s)
  const tiers = s > 1.3 ? 3 : 2
  let ty = y
  px(ctx, x - 2, ty, w + 4, 3, '#8a7a66') // 기단
  for (let k = 0; k < tiers; k++) {
    const tw = w - k * 6 * s
    const tx = x + (w - tw) / 2
    const bodyH = Math.round(9 * s)
    px(ctx, tx + 2, ty - bodyH, tw - 4, bodyH, '#b23a2a')
    for (let c = 0; c < 4; c++) px(ctx, tx + 3 + ((tw - 7) / 3) * c, ty - bodyH, 1, bodyH, '#6b2a1e')
    ty -= bodyH
    px(ctx, tx - 3, ty - 2, tw + 6, 2, '#3c4048')
    px(ctx, tx - 1, ty - 4, tw + 2, 2, '#4a4f57')
    dot(ctx, tx - 4, ty - 3, '#3c4048')
    dot(ctx, tx + tw + 3, ty - 3, '#3c4048')
    ty -= 4
  }
  px(ctx, x + w / 2 - 1, ty - 3, 2, 3, '#d9a441')
}

function bridge(ctx: Ctx, x: number, y: number, w: number) {
  for (let i = 0; i < w; i++) {
    const f = i / w
    const ay = y - Math.round(Math.sin(f * Math.PI) * w * 0.22)
    px(ctx, x + i, ay, 1, 3, '#8a7a66')
    dot(ctx, x + i, ay - 1, '#a8987e')
    if (i % 6 === 0) px(ctx, x + i, ay - 4, 1, 3, '#6a5a46')
  }
}

function drawElement(ctx: Ctx, e: RawElement, env: Env, i: number) {
  const t = env.t
  const sway = Math.sin(t * 1.6 + i) * env.wind * 3
  switch (e.type) {
    case 'rect':
      px(ctx, X(e.x), Y(e.y), num(e.w, 10, 1, W + 80), num(e.h, 10, 1, H + 80), col(e.color, '#6b4a32'))
      break
    case 'disc':
      disc(ctx, X(e.x), Y(e.y), Math.round(num(e.r, 6, 1, 80)), col(e.color, '#e9e0bd'))
      break
    case 'ground': {
      const y0 = Math.round(Y(e.y, 120))
      const c2 = col(e.color2, '')
      for (let y = Math.max(0, y0); y < H; y++) px(ctx, 0, y, W, 1, c2 && (y - y0) % 7 === 3 ? c2 : col(e.color, '#7a6a4e'))
      break
    }
    case 'water': {
      const y0 = Math.round(Y(e.y, 120))
      const c = col(e.color, '#5f7f8f')
      const hl = col(e.highlight, '#9fb8c2')
      for (let y = Math.max(0, y0); y < H; y++) px(ctx, 0, y, W, 1, c)
      for (let k = 0; k < 60; k++) {
        const wy = y0 + 2 + hash(k * 2.7) * (H - y0)
        px(ctx, hash(k * 5.3) * W, wy, 3 + hash(k) * 10, 1, hl)
      }
      break
    }
    case 'mountains': {
      const base = Y(e.y, 120)
      ridge(ctx, mountainFn(base, num(e.height, 40, 4, 120), num(e.seed, i, 0, 999)), col(e.color, '#7d8a96'), col(e.edge, '') || undefined, X(e.x0, 0), X(e.x1, W), Math.min(H, base))
      break
    }
    case 'moon':
      moon(ctx, X(e.x), Y(e.y), Math.round(num(e.r, 9, 3, 20)))
      break
    case 'sun': {
      const c = col(e.color, '#f4b860')
      withAlpha(ctx, 0.15, () => disc(ctx, X(e.x), Y(e.y), Math.round(num(e.r, 10, 3, 24)) + 6, c))
      disc(ctx, X(e.x), Y(e.y), Math.round(num(e.r, 10, 3, 24)), c)
      break
    }
    case 'stars':
      stars(ctx, Math.round(num(e.count, 30, 1, 120)), 11 + i, 0, num(e.y1, 90, 10, H), t)
      break
    case 'cloud': {
      const w = num(e.w, 50, 10, 160)
      const x = mod(X(e.x) + t * 3, W + w + 40) - w - 20
      const c = col(e.color, '#f1f0ea')
      const y = Y(e.y, 30)
      px(ctx, x, y, w, 3, c)
      px(ctx, x + w * 0.2, y - 2, w * 0.5, 2, c)
      withAlpha(ctx, 0.6, () => px(ctx, x + 6, y + 3, w - 12, 1, c))
      break
    }
    case 'tree': {
      const x = X(e.x)
      const y = Y(e.y, 130)
      const s = num(e.size, 1, 0.4, 3)
      const season = typeof e.season === 'string' ? e.season : 'summer'
      const p = TREE_PALS[season] ?? GREEN
      switch (e.kind) {
        case 'pine': pine(ctx, x, y, s, sway); break
        case 'bamboo': bamboo(ctx, x, y, Math.round(40 * s), sway * 2, t); break
        case 'willow': willow(ctx, x, y, s, season === 'autumn' ? AUTUMN : SPRING, sway); break
        case 'bare': bareTree(ctx, x, y, s, sway); break
        case 'blossom': broadTree(ctx, x, y, s, BLOSSOM, sway); break
        default: broadTree(ctx, x, y, s, p, sway)
      }
      break
    }
    case 'grass': {
      const x0 = X(e.x0, 0), x1 = X(e.x1, W), y = Y(e.y, 130)
      const c = col(e.color, '#6b8a4a')
      for (let x = x0; x < x1; x += 2) grassBlade(ctx, x, y, 2 + Math.round(hash(x) * 4), sway * 0.4 + (hash(x * 3) - 0.5) * 2, c)
      break
    }
    case 'flowers': {
      const x0 = X(e.x0, 0), x1 = X(e.x1, W), y = Y(e.y, 130)
      const c = col(e.color, '#e7a3b4')
      for (let x = x0; x < x1; x += 5) flower(ctx, x + hash(x) * 3, y - hash(x * 7) * 4, c, '#f3d58a')
      break
    }
    case 'boat':
      boat(ctx, X(e.x), Y(e.y, 130), { len: num(e.length, 22, 10, 60), lantern: bool(e.lantern), mast: bool(e.sail) ? 14 : 0, sail: bool(e.sail) ? 10 : 0, t })
      break
    case 'house': house(ctx, X(e.x), Y(e.y, 110)); break
    case 'hut': hut(ctx, X(e.x), Y(e.y, 110)); break
    case 'pavilion': pavilion(ctx, X(e.x), Y(e.y, 110), num(e.size, 1, 0.5, 2.5)); break
    case 'bridge': bridge(ctx, X(e.x), Y(e.y, 125), num(e.w, 50, 10, 200)); break
    case 'wall': {
      const x = X(e.x), y = Y(e.y, 100), w = num(e.w, 80, 4, W), h = num(e.h, 20, 4, 100)
      px(ctx, x, y, w, h, '#8a8072')
      for (let k = 0; k < w; k += 8) px(ctx, x + k, y - 3, 5, 3, '#8a8072')
      for (let r = 4; r < h; r += 5) px(ctx, x, y + r, w, 1, '#766c60')
      break
    }
    case 'person': {
      const x = X(e.x), y = Y(e.y, 100)
      const robe = col(e.robe, '')
      const p = robe ? pal({ R: robe, r: robe }) : pal(i % 2 ? OTHER_PALS[i % OTHER_PALS.length] : POET_PAL)
      const sc = Math.round(num(e.scale, 1, 1, 3))
      if (e.pose === 'mini') person(ctx, x, y, robe || '#4b5068')
      else if (e.pose === 'seat') seatFig(ctx, x, y, p, bool(e.flip), sc)
      else standFig(ctx, x, y, p, bool(e.flip), sc)
      break
    }
    case 'birds': {
      const n = Math.round(num(e.count, 3, 1, 12))
      const c = col(e.color, '#2f2f36')
      for (let k = 0; k < n; k++) {
        const bx = mod(X(e.x) + t * (10 + k) + k * 9, W + 20) - 10
        bird(ctx, bx, Y(e.y, 40) + (k % 3) * 4 + Math.sin(t * 2 + k) * 2, Math.floor(t * 4 + k) % 2, c)
      }
      break
    }
    case 'smoke': {
      const x = X(e.x), y = Y(e.y, 100)
      withAlpha(ctx, 0.5, () => {
        for (let k = 0; k < 8; k++) {
          const f = mod(t * 0.3 + k / 8, 1)
          disc(ctx, x + Math.sin(f * 6 + k) * 3 + f * 8, y - f * 30, 1 + Math.round(f * 3), '#e8e8e4')
        }
      })
      break
    }
    case 'rain': rain(ctx, t, Math.round(num(e.count, 70, 5, 200)), 120); break
    case 'snow': snowfall(ctx, t, Math.round(num(e.count, 60, 5, 200))); break
    case 'leaves': {
      const n = Math.round(num(e.count, 24, 3, 80))
      const c = col(e.color, '#c8662a')
      for (let k = 0; k < n; k++) {
        const y = mod(hash(k * 3.7) * H + t * (10 + hash(k) * 10), H + 6) - 3
        const x = mod(hash(k * 1.9) * W + Math.sin(t + k) * 6 - t * 6 * env.wind, W)
        px(ctx, x, y, 2, 1, c)
      }
      break
    }
    case 'mist': {
      const ys = Array.isArray(e.ys) ? e.ys.slice(0, 6).map((v) => Y(v, 90)) : [90]
      mistBands(ctx, t, ys)
      break
    }
    case 'glow': {
      const c = col(e.color, '#fff2c0')
      const r = Math.round(num(e.r, 20, 2, 120))
      withAlpha(ctx, 0.12, () => {
        disc(ctx, X(e.x), Y(e.y), r, c)
        disc(ctx, X(e.x), Y(e.y), Math.round(r * 0.6), c)
      })
      break
    }
    case 'veil':
      veil(ctx, num(e.alpha, 0.2, 0, 0.6), col(e.color, '#1a2040'))
      break
    case 'bubble': {
      const x = X(e.x), y = Y(e.y, 20)
      bubble(ctx, x, y, num(e.w, 40, 12, 140), num(e.h, 26, 10, 90), X(e.tx, x), Y(e.ty, y + 30))
      break
    }
    case 'sparkle':
      sparkle(ctx, X(e.x), Y(e.y), col(e.color, '#fff6c8'), true)
      break
  }
}

/** 요소 하나가 차지하는 대략의 영역 (미리보기 확대용) */
function boundsOf(e: RawElement): Rect | null {
  if (typeof e.type !== 'string') return null
  if (FULL.has(e.type)) return { x: 0, y: 0, w: W, h: H }
  const x = X(e.x), y = Y(e.y)
  switch (e.type) {
    case 'rect': case 'wall': return { x, y, w: num(e.w, 10, 1, W), h: num(e.h, 10, 1, H) }
    case 'disc': case 'moon': case 'sun': case 'glow': { const r = num(e.r, 10, 1, 80) + 6; return { x: x - r, y: y - r, w: r * 2, h: r * 2 } }
    case 'mountains': { const h = num(e.height, 40, 4, 120), x0 = X(e.x0, 0); return { x: x0, y: y - h, w: X(e.x1, W) - x0, h } }
    case 'tree': { const s = num(e.size, 1, 0.4, 3); return { x: x - 14 * s, y: y - 36 * s, w: 28 * s, h: 36 * s } }
    case 'grass': case 'flowers': { const x0 = X(e.x0, 0); return { x: x0, y: y - 8, w: X(e.x1, W) - x0, h: 10 } }
    case 'boat': { const l = num(e.length, 22, 10, 60); return { x: x - l / 2, y: y - 18, w: l, h: 20 } }
    case 'house': return { x, y, w: 28, h: 13 }
    case 'hut': return { x, y, w: 22, h: 15 }
    case 'pavilion': { const s = num(e.size, 1, 0.5, 2.5); return { x, y: y - 34 * s, w: 30 * s, h: 34 * s } }
    case 'bridge': { const w = num(e.w, 50, 10, 200); return { x, y: y - w * 0.25, w, h: w * 0.25 + 4 } }
    case 'person': { const s = num(e.scale, 1, 1, 3); return e.pose === 'mini' ? { x, y, w: 3, h: 8 } : { x, y, w: 14 * s, h: 22 * s } }
    case 'birds': return { x: 0, y: y - 4, w: W, h: 16 }
    case 'cloud': return { x: 0, y: y - 4, w: W, h: 10 }
    case 'smoke': return { x: x - 4, y: y - 32, w: 16, h: 34 }
    case 'bubble': return { x, y, w: num(e.w, 40, 12, 140), h: num(e.h, 26, 10, 90) }
    default: return { x: x - 8, y: y - 8, w: 16, h: 16 }
  }
}

/** 영역들을 합쳐 16:9 로 넓힌 미리보기 영역 */
function focusOf(elements: RawElement[]): Rect {
  const rs = elements.map(boundsOf).filter((r): r is Rect => !!r)
  if (!rs.length) return { x: 0, y: 0, w: W, h: H }
  let x0 = Math.min(...rs.map((r) => r.x)) - 6
  let y0 = Math.min(...rs.map((r) => r.y)) - 6
  let x1 = Math.max(...rs.map((r) => r.x + r.w)) + 6
  let y1 = Math.max(...rs.map((r) => r.y + r.h)) + 6
  let w = Math.max(64, x1 - x0)
  let h = Math.max(36, y1 - y0)
  if (w / h > W / H) h = (w * H) / W
  else w = (h * W) / H
  w = Math.min(W, w)
  h = Math.min(H, h)
  const cx = (x0 + x1) / 2
  const cy = (y0 + y1) / 2
  x0 = Math.min(W - w, Math.max(0, cx - w / 2))
  y0 = Math.min(H - h, Math.max(0, cy - h / 2))
  return { x: Math.round(x0), y: Math.round(y0), w: Math.round(w), h: Math.round(h) }
}

function clean(list: unknown): RawElement[] {
  if (!Array.isArray(list)) return []
  return list.filter((e): e is RawElement => !!e && typeof e === 'object' && typeof (e as RawElement).type === 'string').slice(0, MAX_ELEMENTS)
}

function drawAll(ctx: Ctx, list: RawElement[], env: Env) {
  list.forEach((e, i) => {
    try {
      drawElement(ctx, e, env, i)
    } catch {
      // 요소 하나가 잘못돼도 장면 전체는 그린다
    }
  })
}

const STILL: Env = { t: 0, wind: 0, fx: {} }

export function compileBackground(id: string, spec: ArtSpec['background']): Background {
  const sky = (Array.isArray(spec.sky) ? spec.sky : []).map((c) => col(c, '')).filter(Boolean).slice(0, 8)
  const all = clean(spec.elements)
  const still = all.filter((e) => !ANIMATED.has(e.type as string))
  const moving = all.filter((e) => ANIMATED.has(e.type as string))
  return {
    id,
    drawBack(ctx) {
      const bands = sky.length ? sky : ['#c9d6de', '#dbe3e4']
      const band = Math.ceil(H / bands.length)
      for (let y = 0; y < H; y++) px(ctx, 0, y, W, 1, bands[Math.min(bands.length - 1, Math.floor(y / band))])
      drawAll(ctx, still, STILL)
    },
    drawFront() {},
    drawDynamic(ctx, env) {
      drawAll(ctx, moving, env)
    },
  }
}

export function compileSprite(id: string, layer: ArtLayer): Sprite {
  const elements = clean(layer.elements)
  return {
    id,
    name: String(layer.name ?? '').slice(0, 40) || id,
    z: num(layer.z, 10, 0, 30),
    wind: layer.wind === undefined ? undefined : num(layer.wind, 0, 0, 1),
    focus: focusOf(elements),
    draw(ctx, env) {
      drawAll(ctx, elements, env)
    },
  }
}
