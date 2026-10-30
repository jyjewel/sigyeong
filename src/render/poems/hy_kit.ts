// 『唐詩畫意』 작품들이 함께 쓰는 물가 부품 (호수·여울·물풀·물새·작은 배).
import type { Rect } from '../../data/types'
import type { Sprite } from '../types'
import { W, disc, dot, hash, mod, px } from '../pixel'
import type { Ctx, Env } from '../pixel'
import { boat, person, withAlpha } from '../kit'

/** 스프라이트를 짧게 만든다 */
export function sp(id: string, name: string, z: number, focus: Rect, draw: (ctx: Ctx, env: Env) => void, extra: Partial<Sprite> = {}): Sprite {
  return { id, name, z, focus, draw, ...extra }
}

/** y0 부터 y1 까지 물. 위에서 아래로 짙어지고, 결정적인 물결 무늬가 깔린다 */
export function water(ctx: Ctx, y0: number, y1: number, top = '#8fb0b4', bottom = '#5f8790', line = '#b9d0cf', x0 = 0, x1 = W) {
  for (let y = y0; y < y1; y++) {
    const f = (y - y0) / Math.max(1, y1 - y0)
    px(ctx, x0, y, x1 - x0, 1, f < 0.33 ? top : f < 0.66 ? mix(top, bottom) : bottom)
  }
  for (let i = 0; i < (x1 - x0) / 4; i++) {
    const y = y0 + 2 + hash(i * 3.7 + y0) * (y1 - y0 - 3)
    px(ctx, x0 + hash(i * 5.1 + y0) * (x1 - x0), y, 3 + hash(i) * 8, 1, line)
  }
}

/** 두 색의 중간 (#rrggbb 만) */
export function mix(a: string, b: string, f = 0.5) {
  const p = (c: string, i: number) => parseInt(c.slice(1 + i * 2, 3 + i * 2), 16)
  const ch = (i: number) => Math.round(p(a, i) * (1 - f) + p(b, i) * f).toString(16).padStart(2, '0')
  return `#${ch(0)}${ch(1)}${ch(2)}`
}

/** 움직이는 물결 반짝임 */
export function shimmer(ctx: Ctx, t: number, y0: number, y1: number, n: number, color = '#e4eeea', x0 = 0, x1 = W) {
  for (let i = 0; i < n; i++) {
    const x = x0 + mod(hash(i * 2.3) * (x1 - x0) + t * (3 + hash(i) * 4), x1 - x0)
    const y = y0 + hash(i * 6.1) * (y1 - y0)
    if (Math.sin(t * 2 + i) > 0.2) px(ctx, x, y, 2 + Math.round(hash(i * 9) * 3), 1, color)
  }
}

/** 부들(香蒲) 한 무리. 이삭이 바람에 흔들린다 */
export function cattails(ctx: Ctx, x0: number, x1: number, base: number, env: Env, n = 10, h = 18) {
  for (let i = 0; i < n; i++) {
    const x = x0 + hash(i * 4.3 + x0) * (x1 - x0)
    const hh = h * (0.6 + hash(i * 1.9 + x0) * 0.5)
    const sway = Math.sin(env.t * 1.5 + i) * (0.6 + env.wind * 2)
    for (let k = 0; k < hh; k++) dot(ctx, x + (sway * k) / hh, base - k, k % 5 === 0 ? '#5e7a3a' : '#728f44')
    px(ctx, x + sway - 1, base - hh - 3, 2, 4, '#7a4a2a')
  }
}

/** 갈대 또는 줄풀의 가는 잎 */
export function grasses(ctx: Ctx, x0: number, x1: number, base: number, env: Env, color = '#8a9a5a', n = 24, h = 12) {
  for (let i = 0; i < n; i++) {
    const x = x0 + hash(i * 7.7 + x0) * (x1 - x0)
    const hh = h * (0.5 + hash(i * 3.1) * 0.6)
    const lean = (hash(i * 2.2) - 0.5) * 4 + Math.sin(env.t * 1.3 + i) * (0.5 + env.wind * 2)
    for (let k = 0; k < hh; k++) dot(ctx, x + (lean * k * k) / (hh * hh), base - k, color)
  }
}

/** 연잎 */
export function lotusPad(ctx: Ctx, x: number, y: number, r = 5) {
  for (let dy = -Math.round(r / 2); dy <= Math.round(r / 2); dy++) {
    const w = Math.round(r * Math.sqrt(1 - (dy * dy * 4) / (r * r)))
    px(ctx, x - w, y + dy, w * 2, 1, dy < 0 ? '#5f8a46' : '#4c7438')
  }
  dot(ctx, x, y, '#3e5f2e')
}

/** 연꽃 한 송이 */
export function lotusFlower(ctx: Ctx, x: number, y: number, color = '#e88aa0', light = '#f6c4cf') {
  px(ctx, x, y + 1, 1, 4, '#4c7438')
  px(ctx, x - 2, y - 1, 5, 2, color)
  px(ctx, x - 1, y - 3, 3, 2, light)
  dot(ctx, x - 3, y - 2, color)
  dot(ctx, x + 3, y - 2, color)
}

/** 서 있는 백로 (x, y 는 발). lift 0~1 로 날아오른 높이 */
export function egret(ctx: Ctx, x: number, y: number, t = 0, flying = false) {
  const W1 = '#f6f4ee'
  const S = '#c9c6bd'
  if (flying) {
    const up = Math.sin(t * 9) > 0
    px(ctx, x - 3, y - 6, 7, 3, W1)
    px(ctx, x + 3, y - 8, 3, 2, W1)
    dot(ctx, x + 6, y - 8, '#d9a441')
    if (up) {
      px(ctx, x - 6, y - 11, 5, 2, W1)
      px(ctx, x - 2, y - 13, 4, 2, W1)
    } else {
      px(ctx, x - 7, y - 4, 6, 2, S)
    }
    px(ctx, x - 5, y - 4, 2, 1, '#3a3530')
    return
  }
  px(ctx, x, y - 8, 1, 8, '#3a3530')
  px(ctx, x + 2, y - 8, 1, 8, '#3a3530')
  px(ctx, x - 2, y - 13, 7, 5, W1)
  px(ctx, x - 3, y - 11, 2, 2, S)
  px(ctx, x + 3, y - 18, 2, 6, W1)
  px(ctx, x + 3, y - 20, 4, 2, W1)
  px(ctx, x + 7, y - 19, 3, 1, '#d9a441')
}

/** 떠 있는 물오리·갈매기 */
export function duck(ctx: Ctx, x: number, y: number, color = '#7a6a4a', head = '#3e5a3a') {
  px(ctx, x - 3, y - 2, 7, 3, color)
  px(ctx, x + 3, y - 4, 3, 3, head)
  dot(ctx, x + 6, y - 3, '#d9a441')
  px(ctx, x - 4, y + 1, 9, 1, 'rgba(255,255,255,0.35)')
}
export function gull(ctx: Ctx, x: number, y: number) {
  duck(ctx, x, y, '#eceae2', '#eceae2')
  dot(ctx, x - 3, y - 2, '#8a8a86')
}

/** 가마우지 (서 있는 모습). wet 이면 깃이 늘어지고 물방울이 떨어진다 */
export function cormorant(ctx: Ctx, x: number, y: number, t: number, wet = false) {
  const B = '#24262a'
  const G = '#3e4a46'
  px(ctx, x, y - 4, 1, 4, '#2a2a2a')
  px(ctx, x + 2, y - 4, 1, 4, '#2a2a2a')
  px(ctx, x - 2, y - 12, 6, 8, B)
  px(ctx, x + 2, y - 17, 2, 6, B)
  px(ctx, x + 2, y - 19, 4, 2, G)
  px(ctx, x + 6, y - 18, 3, 1, '#c9a441')
  if (wet) {
    px(ctx, x - 4, y - 10, 2, 8, G)
    px(ctx, x + 4, y - 10, 2, 8, G)
    for (let k = 0; k < 3; k++) {
      const f = mod(t * 1.2 + k / 3, 1)
      dot(ctx, x - 4 + k * 4, y - 3 + f * 6, '#a9c4cc')
    }
  }
}

/** 작은 배와 사공. rower 가 있으면 노를 젓는다 */
export function skiff(ctx: Ctx, x: number, y: number, t: number, o: { robe?: string; rower?: boolean; guest?: string; len?: number } = {}) {
  const len = o.len ?? 22
  if (o.rower !== false) {
    person(ctx, x - len / 2 + 3, y - 11, o.robe ?? '#6e6450', { hat: '#a89567' })
    const k = Math.sin(t * 3)
    for (let i = 0; i < 9; i++) dot(ctx, x - len / 2 + 5 - i * 0.6, y - 6 + i * (0.6 + k * 0.2), '#5a4632')
  }
  if (o.guest) person(ctx, x + 3, y - 11, o.guest)
  boat(ctx, x, y, { len })
  withAlpha(ctx, 0.5, () => px(ctx, x - len / 2 - 2, y + 1, len + 4, 1, '#d8e4e2'))
}

/** 퍼져 나가는 소리 물결 */
export function soundArcs(ctx: Ctx, x: number, y: number, t: number, color = '#f4efe2', reach = 24) {
  for (let k = 0; k < 3; k++) {
    const f = mod(t * 0.7 + k / 3, 1)
    const r = 4 + f * reach
    withAlpha(ctx, 1 - f, () => {
      for (let a = -0.9; a <= 0.9; a += 0.15) {
        dot(ctx, x + Math.cos(a) * r, y + Math.sin(a) * r * 0.6, color)
        dot(ctx, x - Math.cos(a) * r, y + Math.sin(a) * r * 0.6, color)
      }
    })
  }
}

/** 떠오르는 음표 */
export function notes(ctx: Ctx, x: number, y: number, t: number, color = '#3b2a1d') {
  for (let k = 0; k < 3; k++) {
    const f = mod(t * 0.5 + k / 3, 1)
    const nx = x + k * 5 + Math.sin(t * 2 + k) * 2 + f * 10
    const ny = y - f * 18
    withAlpha(ctx, 1 - f, () => {
      px(ctx, nx, ny, 2, 2, color)
      px(ctx, nx + 1, ny - 4, 1, 4, color)
      dot(ctx, nx + 2, ny - 4, color)
    })
  }
}

/** 떨어지는 꽃잎이나 잎 n 장 (영역 안에서 맴돈다) */
export function drift(ctx: Ctx, t: number, area: Rect, n: number, color: string, wind = 0.3, seed = 1) {
  for (let i = 0; i < n; i++) {
    const fy = mod(hash(i * 3.1 + seed) + t * (0.05 + hash(i + seed) * 0.05), 1)
    const fx = mod(hash(i * 1.7 + seed) + t * wind * 0.04 + Math.sin(t + i) * 0.02, 1)
    px(ctx, area.x + fx * area.w, area.y + fy * area.h, 2, 1, color)
  }
}

/** 둥근 바위 (x, y 는 바닥 가운데) */
export function stone(ctx: Ctx, x: number, y: number, r: number, light = '#d8d4c8', dark = '#a8a498') {
  for (let dy = -r; dy <= 0; dy++) {
    const w = Math.round(r * 1.5 * Math.sqrt(1 - (dy * dy) / (r * r)))
    px(ctx, x - w, y + dy, w * 2, 1, dy < -r * 0.45 ? light : dark)
  }
}

/** 해 (테두리 번짐 포함) */
export function sun(ctx: Ctx, x: number, y: number, r: number, color = '#f2c46a', glow = '#ffe9b0') {
  withAlpha(ctx, 0.18, () => disc(ctx, x, y, r + 6, glow))
  disc(ctx, x, y, r, color)
}
