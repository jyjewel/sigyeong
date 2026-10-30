// 표지 풍경: 꽃 핀 봄 나무와 잔잔한 물, 흩날리는 꽃잎
import type { Background } from '../types'
import { H, W, disc, dot, hash, mod, px } from '../pixel'
import type { Ctx } from '../pixel'
import { bird, mistBands, ridge, sky, withAlpha } from '../kit'

const WATER = 132
const TRUNK = '#5a3e34'
const TRUNK_D = '#46302a'
const PETALS = ['#f2b8c6', '#f6cdd8', '#fbe2e8', '#e89aae']

interface Bloom {
  x: number
  y: number
  r: number
}

/** 결정적으로 갈라지는 가지. 끝과 잔가지 둘레에 꽃송이 자리를 모은다 */
function branch(ctx: Ctx, x: number, y: number, ang: number, len: number, w: number, depth: number, seed: number, out: Bloom[]) {
  for (let i = 0; i < len; i++) {
    x += Math.cos(ang)
    y += Math.sin(ang)
    ang += (hash(seed * 7 + i) - 0.5) * 0.12
    px(ctx, x - w / 2, y, Math.max(1, w), Math.max(1, Math.ceil(w / 2)), i % 5 ? TRUNK : TRUNK_D)
    if (depth <= 1 && i % 5 === 4) out.push({ x, y, r: 3 + Math.round(hash(seed + i) * 2) })
  }
  if (depth === 0) {
    out.push({ x, y, r: 5 + Math.round(hash(seed) * 2) })
    return
  }
  const spread = 0.38 + hash(seed * 3) * 0.3
  branch(ctx, x, y, ang - spread, len * (0.62 + hash(seed * 5) * 0.15), w * 0.68, depth - 1, seed * 2 + 1, out)
  branch(ctx, x, y, ang + spread, len * (0.62 + hash(seed * 11) * 0.15), w * 0.68, depth - 1, seed * 2 + 2, out)
}

function blossoms(ctx: Ctx, list: Bloom[]) {
  for (const b of list) disc(ctx, b.x, b.y, b.r, PETALS[3])
  for (const b of list) disc(ctx, b.x - 1, b.y - 1, b.r - 1, PETALS[0])
  for (const [k, b] of list.entries()) {
    disc(ctx, b.x - 1, b.y - 2, Math.max(1, b.r - 3), PETALS[1])
    for (let i = 0; i < 3; i++) dot(ctx, b.x - b.r + 1 + hash(k * 3 + i) * b.r * 2, b.y - b.r + 1 + hash(k * 5 + i) * b.r * 1.6, i ? PETALS[2] : '#fff6f0')
    if (k % 3 === 0) dot(ctx, b.x, b.y, '#d8a040')
  }
}

export const titleBackground: Background = {
  id: 'title-spring',
  drawBack(ctx) {
    sky(ctx, ['#e8eef0', '#eeeeee', '#f4ece8', '#f6e6e4'], WATER)
    ridge(ctx, (x) => 78 + 16 * Math.sin(x * 0.016 + 2) + 4 * Math.sin(x * 0.07), '#c4d0d0', '#ccd6d6', 0, W, WATER)
    ridge(ctx, (x) => 100 + 9 * Math.sin(x * 0.024 + 0.6) + 3 * Math.sin(x * 0.11), '#a8bcb4', '#b4c6be', 0, W, WATER)
    // 먼 물가의 봄 숲 (분홍과 연두)
    for (let k = 0; k < 40; k++) {
      const x = hash(k * 2.3) * W
      disc(ctx, x, 120 + hash(k * 4.1) * 6, 3 + Math.round(hash(k) * 3), k % 3 ? '#b8cc98' : '#e8c4cc')
    }
    px(ctx, 0, 126, W, 6, '#a8c08a')
    // 잔잔한 물
    for (let y = WATER; y < 156; y++) px(ctx, 0, y, W, 1, y < 140 ? '#d4e2e2' : y < 148 ? '#c4d8d8' : '#b4ccce')
    for (let i = 0; i < 50; i++) px(ctx, hash(i * 5.1) * W, WATER + 2 + hash(i * 3.7) * 22, 3 + hash(i) * 8, 1, '#e8f0ee')
    // 가까운 둑과 풀꽃
    for (let y = 156; y < H; y++) px(ctx, 0, y, W, 1, y < 160 ? '#9ab87a' : '#8aac6a')
    for (let k = 0; k < 60; k++) {
      const x = hash(k * 1.9) * W
      const y = 160 + hash(k * 2.9) * 18
      dot(ctx, x, y, ['#f8f4e8', '#f6d860', '#f2b8c6'][k % 3])
      dot(ctx, x, y + 1, '#6a9a4a')
    }
    // 큰 꽃나무 (가운데 왼쪽)와 작은 꽃나무 (오른쪽)
    const big: Bloom[] = []
    branch(ctx, 150, 182, -1.66, 58, 9, 5, 3, big)
    // 위에서 드리운 가지
    branch(ctx, -4, 4, 0.32, 44, 5, 3, 21, big)
    blossoms(ctx, big)
    const small: Bloom[] = []
    branch(ctx, 268, 182, -1.45, 34, 5, 4, 9, small)
    blossoms(ctx, small)
    // 물에 비친 꽃빛
    withAlpha(ctx, 0.25, () => {
      for (const b of [...big, ...small]) if (b.y < 80 && hash(b.x) > 0.5) px(ctx, b.x - 3, WATER + (WATER - b.y) * 0.18, 6, 1, PETALS[0])
    })
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    mistBands(ctx, env.t * 0.5, [108, 114], '#ffffff', 0.35)
    // 흩날리는 꽃잎
    for (let i = 0; i < 46; i++) {
      const f = mod(hash(i * 3.1) + env.t * (0.03 + hash(i) * 0.03), 1)
      const x = mod(hash(i * 1.7) * W + f * 120 + Math.sin(env.t * 1.3 + i) * 6, W + 20) - 10
      const y = f * (H + 10) - 5
      const flip = Math.sin(env.t * 4 + i) > 0
      px(ctx, x, y, flip ? 2 : 1, 1, PETALS[i % 3])
    }
    // 물 위에 앉은 꽃잎
    for (let i = 0; i < 12; i++) px(ctx, mod(hash(i * 7.7) * W + env.t * 2, W), WATER + 4 + hash(i * 2.2) * 18, 2, 1, PETALS[1])
    // 제비 한 쌍
    for (let k = 0; k < 2; k++) {
      const x = mod(env.t * 14 + k * 26, W + 60) - 30
      bird(ctx, x, 44 + k * 8 + Math.sin(env.t * 2 + k) * 4, Math.floor(env.t * 5 + k) % 2, '#3a3a48')
    }
  },
}
