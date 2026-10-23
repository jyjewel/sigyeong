// 李白〈黃鶴樓送孟浩然之廣陵〉: 황학루 아래 나루와 하늘 끝으로 이어지는 장강.
import type { Background, Sprite } from '../types'
import { H, W, dot, fillRows, hash, mod, px } from '../pixel'
import type { Ctx } from '../pixel'
import { AUTUMN, broadTree, canopyPts, flower, person, ridge, sky, snowfall, veil, withAlpha } from '../kit'

const V = { x: 300, y: 97 } // 강이 하늘과 만나는 곳
const upY = (x: number) => 128 - (x / 300) * 31
const xUp = (y: number) => (y >= 128 ? 0 : ((128 - y) / 31) * 300)
const xLow = (y: number) => 60 + ((180 - y) * 240) / 83
const river = (y: number): [number, number] => [xUp(y), xLow(y)]
const PIER = { x: 104, y: 122 }
const TOWER = { x: 26, y: 120 }

function drawTower(ctx: Ctx) {
  const { x, y } = TOWER
  px(ctx, x - 6, y - 8, 64, 8, '#9a907e')
  px(ctx, x - 6, y - 8, 64, 1, '#b3aa98')
  const tiers = [
    { w: 48, h: 14 },
    { w: 38, h: 12 },
    { w: 28, h: 10 },
  ]
  let top = y - 8
  tiers.forEach((t, i) => {
    const cx = x + 26
    const bx = cx - t.w / 2
    px(ctx, bx, top - t.h, t.w, t.h, '#e9dcc0')
    for (let k = 0; k <= t.w; k += 6) px(ctx, bx + k, top - t.h, 1, t.h, '#a8352a')
    px(ctx, bx + t.w / 2 - 2, top - t.h + 4, 4, t.h - 4, '#6b2a1c')
    // 겹처마
    const rw = t.w + 12
    px(ctx, cx - rw / 2, top - t.h - 3, rw, 3, '#c99a2e')
    px(ctx, cx - rw / 2 + 2, top - t.h - 5, rw - 4, 2, '#b4862a')
    dot(ctx, cx - rw / 2 - 1, top - t.h - 4, '#c99a2e')
    dot(ctx, cx + rw / 2, top - t.h - 4, '#c99a2e')
    top = top - t.h - 5
    if (i === 2) {
      px(ctx, cx - 1, top - 4, 2, 4, '#c99a2e')
    }
  })
}

export const huanghelouBackground: Background = {
  id: 'huanghelou',
  drawBack(ctx) {
    sky(ctx, ['#a9c9e3', '#b4d0e7', '#c0d8eb', '#cbdeee', '#d6e5f0', '#e1ebf1'], 100)
    px(ctx, 0, 96, W, H - 96, '#a2c0d4')
    ridge(ctx, (x) => 92 + 3 * Math.sin(x * 0.05) + hash(x) * 1.2, '#b7c6cf', undefined, 200, W, 100)
    // 위쪽(왼쪽) 강 언덕
    for (let x = 0; x < W; x++) {
      const y = Math.round(upY(x))
      px(ctx, x, 96, 1, y - 96, x < 200 ? '#8f9a6a' : '#a7b08a')
    }
    ridge(ctx, (x) => 70 + 10 * Math.sin(x * 0.03 + 1) + x * 0.08, '#9fb0b8', '#b1c0c8', 0, 200, 100)
    // 강
    fillRows(ctx, V.y, H, river, (y) => (y < 110 ? '#b9d2e2' : y < 140 ? '#a2c0d4' : '#8fb0c8'))
  },
  drawFront(ctx) {
    // 아래(오른쪽) 강 언덕
    fillRows(ctx, V.y, H, (y) => [xLow(y), W], (y) => (y < 120 ? '#9aa572' : '#87925f'))
    for (let y = V.y; y < H; y++) dot(ctx, xLow(y), y, '#d9d0b0')
    // 나루
    px(ctx, PIER.x - 10, PIER.y, 22, 2, '#7a5a3c')
    for (const k of [-8, 0, 8]) px(ctx, PIER.x + k, PIER.y + 2, 1, 5, '#5a3d28')
    drawTower(ctx)
  },
  drawDynamic() {},
}

// ── 1구: 떠나는 사람 ────────────────────────────────────────
const TOWER_FOCUS = { x: 0, y: 66, w: 160, h: 90 }

const friend: Sprite = {
  id: 'hh_friend',
  name: '떠나는 벗',
  z: 40,
  focus: TOWER_FOCUS,
  draw(ctx, env) {
    // 누각 앞에서 배웅하는 시인과 나루로 가는 벗
    person(ctx, 58, 104, '#e9e4d6', { hat: '#3a3840' })
    const wave = Math.sin(env.t * 5) > 0
    dot(ctx, 61, wave ? 105 : 106, '#e6c39b')
    const f = mod(env.t / 6, 1)
    const x = 72 + Math.min(f, 0.7) * 34
    person(ctx, x, 106 + Math.min(f, 0.7) * 6, '#5a6a8a', { step: Math.floor(env.t * 4) % 2 })
    px(ctx, x - 2, 110 + Math.min(f, 0.7) * 6, 2, 3, '#8c5a33')
  },
}
const soldiers: Sprite = {
  id: 'hh_soldiers',
  name: '창을 든 군사들',
  z: 40,
  focus: TOWER_FOCUS,
  draw(ctx, env) {
    for (let i = 0; i < 6; i++) {
      const x = 60 + i * 8 + mod(env.t * 4, 8)
      const y = 106 + i * 1.2
      person(ctx, x, y, '#7a3a2a', { hat: '#4a4a52', step: Math.floor(env.t * 4 + i) % 2 })
      px(ctx, x + 3, y - 5, 1, 10, '#6b5a4a')
      dot(ctx, x + 3, y - 6, '#cfd6dc')
    }
  },
}
const merchant: Sprite = {
  id: 'hh_merchant',
  name: '수레 끄는 장사꾼',
  z: 40,
  focus: TOWER_FOCUS,
  draw(ctx, env) {
    const x = 70 + mod(env.t * 5, 30)
    person(ctx, x, 106, '#8a7a55', { hat: '#c9b07a', step: Math.floor(env.t * 4) % 2 })
    px(ctx, x + 4, 108, 12, 5, '#8a6a42')
    px(ctx, x + 5, 105, 10, 3, '#c9a76a')
    px(ctx, x + 6, 104, 3, 2, '#b8483a')
    const r = Math.floor(env.t * 4) % 2
    px(ctx, x + 6, 113, 3, 3, r ? '#4a3426' : '#5a3d28')
    px(ctx, x + 12, 113, 3, 3, r ? '#5a3d28' : '#4a3426')
  },
}

// ── 2구: 계절 ───────────────────────────────────────────────
const SEASON_FOCUS = { x: 80, y: 72, w: 192, h: 108 }
const BANK_TREES = [
  { x: 150, y: 168, s: 1.1 },
  { x: 190, y: 152, s: 0.9 },
  { x: 236, y: 136, s: 0.8 },
  { x: 290, y: 124, s: 0.7 },
  { x: 300, y: 170, s: 1.2 },
  { x: 120, y: 112, s: 0.6 },
]
const BLOSSOM = { dark: '#d9849a', base: '#efa8bb', light: '#f9d3dd' }

const spring: Sprite = {
  id: 'hh_spring',
  name: '꽃 안개 낀 봄',
  z: 30,
  focus: SEASON_FOCUS,
  draw(ctx, env) {
    BANK_TREES.forEach((t) => broadTree(ctx, t.x, t.y, t.s, BLOSSOM))
    BANK_TREES.forEach((t, k) => canopyPts(t.x, t.y, t.s, 8, k).forEach((p) => flower(ctx, p.x, p.y, '#fff1f4', '#f7d77a')))
    // 안개처럼 자욱한 꽃기운
    withAlpha(ctx, 0.22, () => {
      for (let i = 0; i < 6; i++) {
        const y = 96 + i * 12
        const x = mod(i * 50 + env.t * 4, W + 80) - 80
        px(ctx, x, y, 120, 4, '#f7d6e0')
        px(ctx, x + 10, y + 4, 90, 2, '#f7d6e0')
      }
    })
    for (let i = 0; i < 16; i++) {
      const y = mod(hash(i) * H + env.t * 6, H)
      const x = mod(hash(i * 3) * W - env.t * 4, W)
      dot(ctx, x, y, '#f9d3dd')
    }
  },
}
const autumn: Sprite = {
  id: 'hh_autumn',
  name: '낙엽 지는 가을',
  z: 30,
  focus: SEASON_FOCUS,
  draw(ctx, env) {
    BANK_TREES.forEach((t) => broadTree(ctx, t.x, t.y, t.s, AUTUMN))
    for (let i = 0; i < 40; i++) {
      const y = mod(hash(i) * H + env.t * 10, H)
      const x = mod(hash(i * 3) * W - env.t * 6 + Math.sin(env.t + i) * 3, W)
      px(ctx, x, y, 2, 1, i % 2 ? '#d9772d' : '#b84e2c')
    }
  },
}
const winter: Sprite = {
  id: 'hh_winter',
  name: '눈 내리는 겨울',
  z: 30,
  focus: SEASON_FOCUS,
  draw(ctx, env) {
    BANK_TREES.forEach((t) => {
      px(ctx, t.x - 1, t.y - 10 * t.s, 2, 10 * t.s, '#4a3426')
      for (let k = 0; k < 4; k++) {
        const a = -2.4 + k * 0.6
        for (let j = 0; j < 8 * t.s; j++) dot(ctx, t.x + Math.cos(a) * j, t.y - 10 * t.s + Math.sin(a) * j, '#4a3426')
      }
    })
    withAlpha(ctx, 0.85, () => fillRows(ctx, V.y, H, (y) => [xLow(y) + 1, W], '#eef2f4'))
    withAlpha(ctx, 0.7, () => {
      for (let x = 0; x < W; x++) px(ctx, x, 96, 1, upY(x) - 96, '#eef2f4')
    })
    snowfall(ctx, env.t, 90)
  },
}

// ── 3구: 돛 ─────────────────────────────────────────────────
const SAIL_FOCUS = { x: 96, y: 72, w: 216, h: 99 }

function sailBoat(ctx: Ctx, x: number, y: number, s: number) {
  const len = Math.max(3, Math.round(16 * s))
  const mast = Math.max(2, Math.round(16 * s))
  px(ctx, x - len / 2, y, len, Math.max(1, Math.round(3 * s)), '#5a3d28')
  px(ctx, x, y - mast, 1, mast, '#3a2a1c')
  for (let i = 0; i < mast - 1; i++) {
    const w = Math.max(1, Math.round((2 + i * 0.5) * s * 1.2))
    px(ctx, x + 1, y - mast + 1 + i, w, 1, '#e8dfc8')
  }
}
function sailPath(f: number) {
  return { x: PIER.x + 8 + f * (V.x - PIER.x - 10), y: PIER.y + 4 - f * (PIER.y + 4 - V.y), s: 1 - f * 0.9 }
}

const sailVanish: Sprite = {
  id: 'hh_sail_vanish',
  name: '하늘 끝으로 사라지는 외로운 돛',
  z: 35,
  focus: SAIL_FOCUS,
  draw(ctx, env) {
    const f = mod(env.t / 12, 1.15)
    if (f > 1) return
    const p = sailPath(Math.pow(f, 0.8))
    withAlpha(ctx, f > 0.85 ? (1 - f) / 0.15 : 1, () => sailBoat(ctx, p.x, p.y, p.s))
  },
}
const convoy: Sprite = {
  id: 'hh_convoy',
  name: '함께 떠나는 여러 배',
  z: 35,
  focus: SAIL_FOCUS,
  draw(ctx, env) {
    for (let i = 0; i < 4; i++) {
      const f = mod(env.t / 12 + i * 0.06, 1)
      const p = sailPath(f)
      sailBoat(ctx, p.x + (i % 2) * 6, p.y + (i % 2 ? 4 : -2) * p.s, p.s)
    }
  },
}
const sailReturn: Sprite = {
  id: 'hh_sail_return',
  name: '돌아오는 배',
  z: 35,
  focus: SAIL_FOCUS,
  draw(ctx, env) {
    const f = 1 - mod(env.t / 12, 1)
    const p = sailPath(f)
    sailBoat(ctx, p.x, p.y, p.s)
  },
}

// ── 4구: 남은 것 ────────────────────────────────────────────
const RIVER_FOCUS = { x: 80, y: 72, w: 240, h: 108 }

const riverFlow: Sprite = {
  id: 'hh_river_flow',
  name: '하늘 끝으로 흐르는 장강',
  z: 12,
  focus: RIVER_FOCUS,
  draw(ctx, env) {
    for (let i = 0; i < 46; i++) {
      const f = mod(hash(i * 2.3) + env.t * 0.05, 1)
      const lane = hash(i * 5.7)
      const yb = 178 - f * (178 - V.y - 2)
      const [a, b] = river(yb)
      const x = a + lane * (b - a)
      const len = Math.max(1, 8 * (1 - f))
      px(ctx, x, yb, len, 1, f > 0.7 ? '#e9f2f7' : '#cfe1ec')
    }
    // 하늘 끝의 반짝임
    for (let i = 0; i < 10; i++) if (Math.sin(env.t * 3 + i * 1.3) > 0.4) dot(ctx, V.x - 30 + i * 3, V.y + 1, '#ffffff')
  },
}
const boatsMany: Sprite = {
  id: 'hh_boats_many',
  name: '강을 메운 배들',
  z: 36,
  focus: RIVER_FOCUS,
  draw(ctx, env) {
    for (let i = 0; i < 12; i++) {
      const f = hash(i * 3.1) * 0.85
      const p = sailPath(f)
      sailBoat(ctx, p.x + (hash(i) - 0.5) * 40 * (1 - f), p.y + (hash(i * 7) - 0.5) * 18 * (1 - f) + Math.sin(env.t + i) * 0.5, p.s)
    }
  },
}
const fog: Sprite = {
  id: 'hh_fog',
  name: '모든 것을 가린 안개',
  z: 80,
  focus: RIVER_FOCUS,
  draw(ctx, env) {
    veil(ctx, 0.55, '#e7ecee')
    withAlpha(ctx, 0.5, () => {
      for (let i = 0; i < 8; i++) {
        const y = 60 + i * 15
        const x = mod(i * 40 + env.t * 5, W + 100) - 100
        px(ctx, x, y, 160, 6, '#f4f6f6')
      }
    })
  },
}

export const HUANGHELOU_SPRITES: Sprite[] = [
  friend, soldiers, merchant,
  spring, autumn, winter,
  sailVanish, convoy, sailReturn,
  riverFlow, boatsMany, fog,
]
