// 王維〈山居秋暝〉: 비 갠 가을 저녁의 산 마을. 소나무·초가·대숲·연못은 기본 풍경.
import type { Background, Sprite } from '../types'
import { H, W, disc, dot, fillRows, grid, hash, mod, px } from '../pixel'
import type { Env } from '../pixel'
import {
  AUTUMN, bamboo, broadTree, canopyPts, flower, hut, mistBands, moon, person, pine, rain, ridge, sky, snowfall, sparkle, veil, withAlpha,
} from '../kit'

const PINES = [
  { x: 26, y: 132, s: 2.4 },
  { x: 88, y: 124, s: 2.0 },
  { x: 116, y: 112, s: 1.1 },
]
const PINE_PAL = { dark: '#22392c', base: '#335744', light: '#527c64' }
const MOON = { x: 58, y: 46 }
const HUT = { x: 134, y: 92 }
const TREES = [
  { x: 122, y: 106, s: 0.6 },
  { x: 178, y: 108, s: 0.8 },
]
const BAMBOO_XS = [222, 230, 238, 247, 255, 263, 272, 281, 290, 299]
const POND = { x: 262, y: 160, rx: 56, ry: 17 }
const LOTUS = Array.from({ length: 16 }, (_, i) => ({
  x: POND.x - POND.rx + 10 + hash(i * 3.1) * (POND.rx * 2 - 20),
  y: POND.y - POND.ry + 5 + hash(i * 5.3) * (POND.ry * 2 - 10),
}))
const streamC = (y: number) => 40 + (y - 126) * 2.0 + Math.sin(y * 0.15) * 4
const streamW = (y: number) => 5 + (y - 126) * 0.12
const stream = (y: number): [number, number] => [streamC(y) - streamW(y), streamC(y) + streamW(y)]
const ROCKS = Array.from({ length: 9 }, (_, i) => {
  const y = 132 + i * 5.5
  return { x: streamC(y) + (i % 2 ? 4 : -4), y }
})
const GREEN = { dark: '#3e5a35', base: '#557645', light: '#6e9058' }

function groundTop(x: number) {
  return 100 + Math.sin(x * 0.02) * 4 + (x < 120 ? (120 - x) * 0.1 : 0)
}

export const shanjuBackground: Background = {
  id: 'shanju',
  drawBack(ctx) {
    sky(ctx, ['#2f3558', '#41466a', '#5b5a7c', '#7a6e86', '#9a8489', '#b5998c'], 100)
    ridge(ctx, (x) => 52 + 12 * Math.sin(x * 0.025 + 1.5) + 5 * Math.sin(x * 0.08) + hash(x) * 1.5, '#5e6680', '#6e7690')
    ridge(ctx, (x) => 72 + 9 * Math.sin(x * 0.03 + 4) + hash(x + 3) * 1.5, '#48536a')
    for (let x = 0; x < W; x++) {
      const y = Math.round(groundTop(x))
      px(ctx, x, y, 1, H - y, '#3f4d38')
    }
    for (let i = 0; i < 90; i++) px(ctx, hash(i * 3.7) * W, 108 + hash(i * 1.9) * 70, 2, 1, i % 2 ? '#4a5a40' : '#36432f')
    // 시내 바닥 (돌 바닥)
    fillRows(ctx, 126, H, stream, '#4f4c44')
    // 연못
    for (let dy = -POND.ry; dy <= POND.ry; dy++) {
      const w = Math.round(POND.rx * Math.sqrt(1 - (dy * dy) / (POND.ry * POND.ry)))
      px(ctx, POND.x - w, POND.y + dy, w * 2, 1, dy < -POND.ry + 3 ? '#5a6a80' : '#4a5a72')
    }
  },
  drawFront(ctx) {
    ROCKS.forEach((r, i) => {
      disc(ctx, r.x, r.y, 3 + (i % 2), (dy) => (dy < 0 ? '#8a877c' : '#66635a'))
    })
    hut(ctx, HUT.x, HUT.y)
    // 오솔길
    for (let i = 0; i < 30; i++) {
      const f = i / 30
      px(ctx, 170 + f * 66, 140 - f * 16, 4, 1, '#5e5a44')
    }
  },
  drawDynamic(ctx, env) {
    PINES.forEach((p) => pine(ctx, p.x, p.y, p.s, 0, PINE_PAL))
    TREES.forEach((t) => broadTree(ctx, t.x, t.y, t.s, GREEN))
    const shake = env.fx.bambooShake ? 2.5 : 0
    BAMBOO_XS.forEach((x, i) => {
      const sw = shake ? Math.sin(env.t * 7 + i) * shake : 0
      bamboo(ctx, x, 128 - (i % 3) * 2, 44 + (i % 4) * 6, sw, env.t)
    })
    LOTUS.forEach((l, i) => {
      let off = 0
      if (env.fx.lotusSway) {
        const bx = boatX(env)
        const d = Math.abs(l.x - bx)
        if (d < 18) off = Math.round(Math.sin(env.t * 8 + i) * (1 - d / 18) * 2)
      }
      px(ctx, l.x - 3 + off, l.y, 7, 2, '#4f7a46')
      px(ctx, l.x - 2 + off, l.y - 1, 5, 1, '#6a9a5a')
      dot(ctx, l.x + off, l.y, '#3e6038')
    })
  },
}

function boatX(env: Env) {
  return POND.x + POND.rx - 4 - mod(env.t * 7, POND.rx * 2 + 30)
}

// ── 1구: 비 갠 뒤 ───────────────────────────────────────────
const WHOLE_FOCUS = { x: 16, y: 16, w: 288, h: 162 }

const afterRain: Sprite = {
  id: 'sj_after_rain',
  name: '비 갠 뒤의 물기',
  z: 85,
  focus: WHOLE_FOCUS,
  draw(ctx, env) {
    // 잎끝에서 떨어지는 물방울
    const tips = [...PINES.map((p) => ({ x: p.x + 8 * p.s, y: p.y - 20 * p.s })), ...BAMBOO_XS.map((x) => ({ x: x + 4, y: 92 }))]
    tips.forEach((p, i) => {
      const f = mod(env.t * 0.7 + hash(i) * 2, 2)
      if (f < 1) {
        dot(ctx, p.x, p.y + f * 16, '#cfe6f4')
        dot(ctx, p.x, p.y + f * 16 + 1, '#9fc6e0')
      } else dot(ctx, p.x, p.y, '#e6f4fb')
    })
    // 젖은 땅과 바위의 윤기
    for (let i = 0; i < 26; i++) {
      const x = hash(i * 4.4) * W
      const y = 112 + hash(i * 2.6) * 64
      if (Math.sin(env.t * 2 + i) > 0.3) px(ctx, x, y, 3, 1, '#9fb8c8')
    }
    mistBands(ctx, env.t, [80, 94], '#dfe4ea', 0.25)
  },
}
const heavyRain: Sprite = {
  id: 'sj_heavy_rain',
  name: '쏟아지는 장대비',
  z: 85,
  focus: WHOLE_FOCUS,
  draw(ctx, env) {
    veil(ctx, 0.3, '#2a3040')
    rain(ctx, env.t, 160, 220, 'rgba(200,215,230,0.65)', 6, -1)
  },
}
const drought: Sprite = {
  id: 'sj_drought',
  name: '메마른 산',
  z: 25,
  focus: WHOLE_FOCUS,
  draw(ctx) {
    withAlpha(ctx, 0.55, () => {
      for (let x = 0; x < W; x++) {
        const y = Math.round(groundTop(x))
        px(ctx, x, y, 1, H - y, '#a08a5a')
      }
    })
    for (let i = 0; i < 24; i++) {
      let x = hash(i * 3.3) * W
      let y = 112 + hash(i * 5.5) * 60
      for (let k = 0; k < 8; k++) {
        dot(ctx, x, y, '#6e5a3a')
        x += hash(i * 7 + k) > 0.5 ? 1 : -1
        y += hash(i * 9 + k) > 0.5 ? 1 : 0
      }
    }
  },
}

// ── 2구: 계절 ───────────────────────────────────────────────
const SEASON_FOCUS = { x: 80, y: 50, w: 192, h: 108 }

const autumnSj: Sprite = {
  id: 'sj_autumn',
  name: '저물녘의 가을 기운',
  z: 26,
  focus: SEASON_FOCUS,
  draw(ctx, env) {
    TREES.forEach((t, i) => broadTree(ctx, t.x, t.y, t.s, i ? AUTUMN : { dark: '#9a6a1f', base: '#c99a2e', light: '#e8c05a' }))
    mistBands(ctx, env.t, [104, 118], '#cdd3e0', 0.3)
    for (let i = 0; i < 8; i++) {
      const f = mod(env.t * 0.2 + i / 8, 1)
      px(ctx, 170 + hash(i) * 20 - f * 16, 96 + f * 30, 2, 1, i % 2 ? '#d9772d' : '#e8c05a')
    }
  },
}
const summer: Sprite = {
  id: 'sj_summer',
  name: '무더운 여름',
  z: 26,
  focus: SEASON_FOCUS,
  draw(ctx, env) {
    TREES.forEach((t) => broadTree(ctx, t.x, t.y, t.s, { dark: '#2f7a2f', base: '#3f9a3a', light: '#7ccc5a' }))
    veil(ctx, 0.12, '#ffcf6a')
    for (let i = 0; i < 12; i++) {
      const x = 90 + i * 15
      for (let k = 0; k < 6; k++) dot(ctx, x + Math.sin(env.t * 4 + k + i) * 1.5, 120 - k * 3, 'rgba(255,240,200,0.6)')
    }
  },
}
const winterSj: Sprite = {
  id: 'sj_winter',
  name: '매서운 겨울',
  z: 26,
  focus: SEASON_FOCUS,
  draw(ctx, env) {
    TREES.forEach((t) => {
      const c = canopyPts(t.x, t.y, t.s, 1, 0)[0]
      px(ctx, t.x - 1, c.y, 2, t.y - c.y, '#4a3426')
      for (let k = 0; k < 4; k++) for (let j = 0; j < 7 * t.s; j++) dot(ctx, t.x + Math.cos(-2.4 + k * 0.6) * j, c.y + Math.sin(-2.4 + k * 0.6) * j, '#4a3426')
    })
    withAlpha(ctx, 0.7, () => {
      for (let x = 0; x < W; x++) px(ctx, x, groundTop(x), 1, 3, '#f0f3f5')
    })
    px(ctx, HUT.x + 2, HUT.y - 1, 18, 2, '#ffffff')
    snowfall(ctx, env.t, 70)
  },
}

// ── 3구: 소나무 사이 ────────────────────────────────────────
const PINE_FOCUS = { x: 0, y: 14, w: 160, h: 90 }

const moonSj: Sprite = {
  id: 'sj_moon',
  name: '소나무 사이의 달',
  z: 8,
  focus: PINE_FOCUS,
  draw(ctx, env) {
    moon(ctx, MOON.x, MOON.y, 8)
    withAlpha(ctx, 0.12 + 0.03 * Math.sin(env.t), () => {
      for (let k = -2; k <= 2; k++) {
        fillRows(ctx, MOON.y + 10, 130, (y) => {
          const f = (y - MOON.y - 10) / 90
          const c = MOON.x + k * 10 + f * k * 22
          return [c - 2, c + 2]
        }, '#fff7d6')
      }
    })
  },
}
const sun: Sprite = {
  id: 'sj_sun',
  name: '한낮의 햇빛',
  z: 8,
  focus: PINE_FOCUS,
  draw(ctx) {
    veil(ctx, 0.45, '#cfe2f0', 0, 0, W, 100)
    withAlpha(ctx, 0.3, () => disc(ctx, MOON.x, MOON.y, 16, '#fff2b0'))
    disc(ctx, MOON.x, MOON.y, 9, '#fff6c8')
  },
}
const torches: Sprite = {
  id: 'sj_torches',
  name: '사람들의 횃불',
  z: 50,
  focus: PINE_FOCUS,
  draw(ctx, env) {
    ;[44, 62, 88].forEach((x, i) => {
      const y = 104 + i * 3
      person(ctx, x, y, '#5a4a3a')
      px(ctx, x + 3, y - 4, 1, 6, '#6b4a32')
      const fl = Math.sin(env.t * 10 + i) > 0 ? 1 : 0
      px(ctx, x + 2, y - 7 - fl, 3, 3, '#ff9a2e')
      dot(ctx, x + 3, y - 8 - fl, '#ffe08a')
      withAlpha(ctx, 0.18, () => disc(ctx, x + 3, y - 6, 9, '#ffb85a'))
    })
  },
}

// ── 4구: 샘물 ───────────────────────────────────────────────
const STREAM_FOCUS = { x: 24, y: 110, w: 144, h: 70 }

const streamFlow: Sprite = {
  id: 'sj_stream',
  name: '바위 위로 흐르는 샘물',
  z: 10,
  focus: STREAM_FOCUS,
  draw(ctx, env) {
    fillRows(ctx, 126, H, stream, '#7fa6bf')
    for (let i = 0; i < 40; i++) {
      const f = mod(hash(i * 2.1) + env.t * 0.25, 1)
      const y = 126 + f * (H - 126)
      const [a, b] = stream(y)
      px(ctx, a + hash(i * 5) * (b - a), y, 2, 1, f > 0.5 ? '#e6f2f8' : '#bcd6e6')
    }
  },
}
const streamFrozen: Sprite = {
  id: 'sj_stream_frozen',
  name: '얼어붙은 샘물',
  z: 10,
  focus: STREAM_FOCUS,
  draw(ctx) {
    fillRows(ctx, 126, H, stream, (y) => (y % 5 === 0 ? '#c8d8e4' : '#dce8f0'))
    for (let i = 0; i < 6; i++) {
      const y = 132 + i * 8
      px(ctx, streamC(y) - 2, y, 4, 1, '#ffffff')
    }
  },
}
const streamDry: Sprite = {
  id: 'sj_stream_dry',
  name: '말라붙은 물길',
  z: 10,
  focus: STREAM_FOCUS,
  draw(ctx) {
    fillRows(ctx, 126, H, stream, '#8a7a5a')
    for (let i = 0; i < 10; i++) {
      const y = 128 + i * 5
      px(ctx, streamC(y) - 3 + hash(i) * 4, y, 3, 1, '#6e5a3a')
    }
  },
}

// ── 5구: 대숲 ───────────────────────────────────────────────
const BAMBOO_FOCUS = { x: 150, y: 70, w: 160, h: 90 }

function walkers(env: Env, n: number, draw: (x: number, y: number, i: number, step: number) => void) {
  for (let i = 0; i < n; i++) {
    const f = mod(env.t / 10 + i * 0.09, 1)
    const x = 168 + f * 64
    const y = 132 - f * 16
    draw(x, y, i, Math.floor(env.t * 4 + i) % 2)
  }
}

const washers: Sprite = {
  id: 'sj_washers',
  name: '돌아가는 빨래하던 여인들',
  z: 40,
  fx: { bambooShake: 1 },
  focus: BAMBOO_FOCUS,
  draw(ctx, env) {
    walkers(env, 3, (x, y, i, step) => {
      person(ctx, x, y, i % 2 ? '#d9cfc0' : '#c9b8c8', { hat: '#1f1d22', step })
      dot(ctx, x + 1, y - 1, '#1f1d22')
      px(ctx, x - 3, y + 3, 3, 3, '#b8a070')
      px(ctx, x - 3, y + 3, 3, 1, '#efe6cf')
    })
    // 말소리
    if (Math.sin(env.t * 3) > 0) for (let k = 0; k < 3; k++) dot(ctx, 200 + k * 3, 106 - k, '#efe6cf')
  },
}
const merchants: Sprite = {
  id: 'sj_merchants',
  name: '장터로 가는 상인들',
  z: 40,
  focus: BAMBOO_FOCUS,
  draw(ctx, env) {
    walkers(env, 2, (x, y, _i, step) => {
      person(ctx, x, y, '#6b5a4a', { hat: '#c9b07a', step })
      px(ctx, x - 5, y + 2, 13, 1, '#8a6a42')
      px(ctx, x - 6, y + 3, 3, 3, '#a8703f')
      px(ctx, x + 6, y + 3, 3, 3, '#a8703f')
    })
  },
}
const hunters: Sprite = {
  id: 'sj_hunters',
  name: '사냥꾼들',
  z: 40,
  focus: BAMBOO_FOCUS,
  draw(ctx, env) {
    walkers(env, 2, (x, y, _i, step) => {
      person(ctx, x, y, '#5a4a32', { hat: '#3a3a30', step })
      for (let k = 0; k < 7; k++) dot(ctx, x - 2 + Math.sin(k * 0.45) * 2, y + k, '#8a6a42')
    })
    const f = mod(env.t / 10 + 0.2, 1)
    px(ctx, 176 + f * 64, 136 - f * 16, 5, 2, '#8a6a4a')
    dot(ctx, 180 + f * 64, 135 - f * 16, '#8a6a4a')
  },
}

// ── 6구: 연못 ───────────────────────────────────────────────
const POND_FOCUS = { x: 196, y: 128, w: 124, h: 52 }

const fishingBoat: Sprite = {
  id: 'sj_fishing_boat',
  name: '내려가는 고깃배',
  z: 45,
  fx: { lotusSway: 1 },
  focus: POND_FOCUS,
  draw(ctx, env) {
    const x = boatX(env)
    if (x < POND.x - POND.rx + 4) return
    const y = POND.y + 2
    px(ctx, x - 8, y, 16, 2, '#6b4a32')
    px(ctx, x - 6, y + 2, 12, 1, '#4a3426')
    px(ctx, x - 1, y - 7, 3, 2, '#b89b5e')
    px(ctx, x - 2, y - 6, 5, 1, '#a3864d')
    px(ctx, x - 1, y - 5, 3, 5, '#5a5a4a')
    for (let k = 0; k < 9; k++) dot(ctx, x + 2 + k * 0.6, y - 4 - k, '#8a6a42')
    for (let k = 1; k < 8; k++) withAlpha(ctx, 0.5 * (1 - k / 8), () => px(ctx, x + 8 + k * 3, y + 2, 2, 1, '#8aa0b8'))
  },
}
const ducks: Sprite = {
  id: 'sj_ducks',
  name: '헤엄치는 오리 떼',
  z: 45,
  focus: POND_FOCUS,
  draw(ctx, env) {
    for (let i = 0; i < 4; i++) {
      const x = POND.x + 30 - mod(env.t * 4 + i * 8, 80)
      const y = POND.y - 4 + (i % 2) * 6
      grid(ctx, ['.GG..', 'GGWWW', '.WWW.'], x, y, { G: '#2f6a3a', W: '#a89a7a' })
      dot(ctx, x, y + 1, '#e0a040')
    }
  },
}
const rainLotus: Sprite = {
  id: 'sj_rain_lotus',
  name: '연못에 내리는 비',
  z: 45,
  fx: { lotusSway: 1 },
  focus: POND_FOCUS,
  draw(ctx, env) {
    for (let i = 0; i < 12; i++) {
      const f = mod(env.t + hash(i) * 3, 1)
      const x = POND.x - 40 + hash(i * 3.3) * 80
      const y = POND.y - 10 + hash(i * 5.5) * 20
      const r = f * 6
      withAlpha(ctx, 1 - f, () => {
        px(ctx, x - r, y, r * 2, 1, '#9fb8d0')
      })
    }
    rain(ctx, env.t, 50, 200, 'rgba(200,215,230,0.6)', 4, -0.5)
  },
}

// ── 7구: 봄꽃 ───────────────────────────────────────────────
const FLOWER_FOCUS = { x: 90, y: 100, w: 160, h: 72 }
const SHRUBS = [
  { x: 118, y: 136 },
  { x: 196, y: 146 },
]

const petalsGone: Sprite = {
  id: 'sj_petals_gone',
  name: '다 져 버린 봄꽃',
  z: 50,
  focus: FLOWER_FOCUS,
  draw(ctx, env) {
    SHRUBS.forEach((s) => {
      for (let k = 0; k < 5; k++) for (let j = 0; j < 6; j++) dot(ctx, s.x + Math.cos(-2.6 + k * 0.5) * j, s.y + Math.sin(-2.6 + k * 0.5) * j, '#5a4a3a')
    })
    for (let i = 0; i < 26; i++) {
      const x = 100 + hash(i * 3.1) * 130
      const y = 146 + hash(i * 1.7) * 26
      dot(ctx, x + Math.sin(env.t * 0.5 + i) * 0.5, y, i % 3 ? '#9a8080' : '#b89a9a')
    }
  },
}
const blossom: Sprite = {
  id: 'sj_blossom',
  name: '만발한 봄꽃',
  z: 50,
  focus: FLOWER_FOCUS,
  draw(ctx, env) {
    SHRUBS.forEach((s, k) => {
      disc(ctx, s.x, s.y - 4, 7, '#d98aa0')
      canopyPts(s.x, s.y + 8, 0.9, 12, k).forEach((p, i) => {
        flower(ctx, p.x, p.y, '#f7c0cf', '#fff2a0')
        if (Math.sin(env.t * 3 + i) > 0.9) sparkle(ctx, p.x, p.y - 2, '#ffffff')
      })
    })
  },
}
const vase: Sprite = {
  id: 'sj_vase',
  name: '병에 꽂은 꽃',
  z: 50,
  focus: FLOWER_FOCUS,
  draw(ctx) {
    const x = HUT.x + 22
    const y = HUT.y + 10
    px(ctx, x, y, 4, 6, '#5a7a9a')
    px(ctx, x + 1, y - 1, 2, 1, '#4a6a8a')
    for (let k = 0; k < 4; k++) {
      dot(ctx, x + 1 + k - 1, y - 2 - k, '#4f7a3a')
      flower(ctx, x - 1 + k * 2, y - 6 - (k % 2) * 2, '#f7a0b8', '#fff2a0')
    }
  },
}

// ── 8구: 王孫 ───────────────────────────────────────────────
const STAY_FOCUS = { x: 100, y: 72, w: 128, h: 72 }

const stay: Sprite = {
  id: 'sj_stay',
  name: '산에 머무는 사람',
  z: 55,
  focus: STAY_FOCUS,
  draw(ctx, env) {
    // 초가 문 앞에 앉아 쉬는 사람과 밝힌 등불
    const x = HUT.x + 4
    const y = HUT.y + 10
    px(ctx, x - 1, y + 1, 4, 1, '#1f1d22')
    px(ctx, x - 1, y + 2, 4, 2, '#e6c39b')
    px(ctx, x - 2, y + 4, 6, 3, '#e9e4d6')
    px(ctx, x - 3, y + 7, 8, 1, '#c9bfa5')
    const fl = Math.sin(env.t * 5) > 0 ? '#ffd27a' : '#ffbf5a'
    px(ctx, HUT.x + 2, HUT.y + 9, 4, 3, fl)
    withAlpha(ctx, 0.2, () => disc(ctx, HUT.x + 4, HUT.y + 10, 8, '#ffd27a'))
  },
}
const leave: Sprite = {
  id: 'sj_leave',
  name: '산을 떠나는 사람',
  z: 55,
  focus: STAY_FOCUS,
  draw(ctx, env) {
    const f = mod(env.t / 8, 1)
    const x = HUT.x + 10 - f * 60
    const y = HUT.y + 16 + f * 18
    person(ctx, x, y, '#e9e4d6', { step: Math.floor(env.t * 4) % 2 })
    px(ctx, x + 2, y + 3, 3, 3, '#8c5a33')
  },
}
const court: Sprite = {
  id: 'sj_court',
  name: '조정으로 가는 행차',
  z: 55,
  focus: STAY_FOCUS,
  draw(ctx, env) {
    const x = HUT.x + 28 + Math.sin(env.t) * 2
    const y = HUT.y + 14
    px(ctx, x, y + 3, 10, 4, '#e9e2d0')
    px(ctx, x + 9, y, 3, 4, '#e9e2d0')
    for (const k of [1, 3, 7, 9]) px(ctx, x + k, y + 7, 1, 4, '#9a8a7a')
    px(ctx, x + 3, y - 3, 3, 1, '#1f1d22')
    px(ctx, x + 3, y - 2, 3, 2, '#e6c39b')
    px(ctx, x + 2, y, 5, 3, '#a8352a')
    person(ctx, x - 8, y + 2, '#5a4a3a')
    px(ctx, x - 6, y - 8, 1, 10, '#6b4a32')
    px(ctx, x - 5, y - 8, 5, 4, '#c43a3a')
  },
}

export const SHANJU_SPRITES: Sprite[] = [
  afterRain, heavyRain, drought,
  autumnSj, summer, winterSj,
  moonSj, sun, torches,
  streamFlow, streamFrozen, streamDry,
  washers, merchants, hunters,
  fishingBoat, ducks, rainLotus,
  petalsGone, blossom, vase,
  stay, leave, court,
]
