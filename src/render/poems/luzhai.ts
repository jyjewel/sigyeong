// 王維〈鹿柴〉: 저물녘의 빈 산과 깊은 숲. 사람은 그리지 않고 안개·소리·빛으로만 채운다.
import type { Background, Sprite } from '../types'
import { H, W, disc, dot, fillRows, hash, mod, px } from '../pixel'
import type { Ctx } from '../pixel'
import { bubble, mistBands, person, ridge, sky, snowfall, sparkle, veil, withAlpha } from '../kit'

const FLOOR = 140
const ROCKS = [
  { x: 160, y: 160, r: 10 },
  { x: 196, y: 167, r: 8 },
  { x: 224, y: 158, r: 6 },
  { x: 124, y: 170, r: 7 },
]

function conifer(ctx: Ctx, x: number, y: number, h: number, c1: string, c2: string) {
  px(ctx, x, y - 4, 1, 4, '#2a2018')
  for (let r = 0; r < h; r++) {
    const w = Math.round((r / h) * h * 0.45) + 1
    px(ctx, x - w, y - 4 - h + r, w * 2 + 1, 1, r % 4 === 0 ? c2 : c1)
  }
}

function rock(ctx: Ctx, x: number, y: number, r: number) {
  for (let dy = -r; dy <= 0; dy++) {
    const w = Math.round(r * 1.4 * Math.sqrt(1 - (dy * dy) / (r * r)))
    px(ctx, x - w, y + dy, w * 2, 1, dy < -r * 0.5 ? '#8a8a80' : '#6e6e66')
  }
  px(ctx, x - r * 1.4, y + 1, r * 2.8, 1, '#2a2620')
}

export const luzhaiBackground: Background = {
  id: 'luzhai',
  drawBack(ctx) {
    sky(ctx, ['#9a94a4', '#a59ea8', '#b2a8aa', '#bfb2a8', '#c9bba6'], 96)
    ridge(ctx, (x) => 46 + 14 * Math.sin(x * 0.022 + 0.5) + 6 * Math.sin(x * 0.07) + hash(x) * 1.5, '#7b8288', '#8c9298')
    ridge(ctx, (x) => 66 + 10 * Math.sin(x * 0.03 + 2) + 4 * Math.sin(x * 0.11) + hash(x + 5) * 1.5, '#5d6a62', '#6b786e')
    ridge(ctx, (x) => 86 + 6 * Math.sin(x * 0.04 + 1) + hash(x + 9) * 2, '#3f4f45')
  },
  drawFront(ctx) {
    // 숲
    for (let i = 0; i < 70; i++) {
      const x = hash(i * 2.9) * (W + 10) - 5
      const y = 100 + hash(i * 4.1) * 44
      const h = 14 + hash(i * 1.3) * 22
      const shade = y < 120 ? ['#2f4237', '#3a5042'] : ['#24342b', '#2f4237']
      conifer(ctx, Math.round(x), Math.round(y), Math.round(h), shade[0], shade[1])
    }
    // 숲 바닥
    fillRows(ctx, FLOOR, H, () => [0, W], (y) => (y < 150 ? '#3a3a2c' : y < 165 ? '#34342a' : '#2e2e24'))
    for (let i = 0; i < 80; i++) px(ctx, hash(i * 3.3) * W, FLOOR + hash(i * 5.5) * 40, 2, 1, i % 2 ? '#4a4634' : '#2a2a20')
    ROCKS.forEach((r) => rock(ctx, r.x, r.y, r.r))
    // 앞쪽 큰 나무 줄기
    px(ctx, 16, 40, 6, 140, '#2a2018')
    px(ctx, 296, 30, 7, 150, '#2a2018')
    px(ctx, 18, 40, 1, 140, '#3a2e22')
  },
  drawDynamic() {},
}

// ── 1구: 빈 산 ──────────────────────────────────────────────
const MOUNT_FOCUS = { x: 32, y: 24, w: 256, h: 144 }

const empty: Sprite = {
  id: 'lz_empty',
  name: '고요한 빈 산',
  z: 15,
  focus: MOUNT_FOCUS,
  draw(ctx, env) {
    mistBands(ctx, env.t, [58, 74, 90, 104], '#eae6e0', 0.5)
  },
}
const woodcutter: Sprite = {
  id: 'lz_woodcutter',
  name: '나무하는 나무꾼',
  z: 40,
  focus: MOUNT_FOCUS,
  draw(ctx, env) {
    const x = 84
    const y = 142
    person(ctx, x, y, '#7a6a4a', { hat: '#a89567' })
    const up = Math.sin(env.t * 5) > 0
    px(ctx, x + 3, y + (up ? 1 : 4), 4, 1, '#8a6a42')
    px(ctx, x + 7, y + (up ? 0 : 4), 2, 2, '#9aa0a8')
    px(ctx, x + 10, y - 10, 3, 18, '#4a3426')
    if (!up) for (let k = 0; k < 3; k++) dot(ctx, x + 14 + k * 2, y + 1 - k, '#d8c8a0')
    px(ctx, x - 8, y + 6, 6, 2, '#8a6a42')
    px(ctx, x - 8, y + 4, 6, 2, '#7a5a3c')
  },
}
const hikers: Sprite = {
  id: 'lz_hikers',
  name: '산을 오르는 사람들',
  z: 40,
  focus: MOUNT_FOCUS,
  draw(ctx, env) {
    const robes = ['#7a4a3a', '#4f6b4a', '#6b5a7a', '#8a7a55']
    for (let i = 0; i < 4; i++) {
      const f = mod(env.t / 14 + i * 0.07, 1)
      person(ctx, 60 + f * 110, 168 - f * 40, robes[i], { step: Math.floor(env.t * 4 + i) % 2 })
    }
  },
}

// ── 2구: 소리 ───────────────────────────────────────────────
const SOUND_FOCUS = { x: 40, y: 60, w: 240, h: 120 }

const voices: Sprite = {
  id: 'lz_voices',
  name: '어디선가 들리는 말소리',
  z: 50,
  focus: SOUND_FOCUS,
  draw(ctx, env) {
    const spots = [
      { x: 92, y: 98 },
      { x: 186, y: 110 },
      { x: 250, y: 92 },
    ]
    spots.forEach((s, i) => {
      const f = mod(env.t / 3 + i / 3, 1)
      if (f < 0.6) {
        withAlpha(ctx, f < 0.1 ? f * 10 : f > 0.45 ? (0.6 - f) / 0.15 : 1, () => {
          bubble(ctx, s.x, s.y - f * 6, 16, 9, s.x + 4, s.y + 12)
          for (let k = 0; k < 3; k++) dot(ctx, s.x + 4 + k * 3, s.y + 4 - f * 6, '#5d4a37')
        })
      }
      // 메아리
      const r = f * 18
      withAlpha(ctx, 0.5 * (1 - f), () => {
        for (let a = -0.8; a <= 0.8; a += 0.2) dot(ctx, s.x + 8 + Math.cos(a) * r, s.y + 18 + Math.sin(a) * r * 0.5, '#e9e2cf')
        for (let a = -0.8; a <= 0.8; a += 0.2) dot(ctx, s.x + 8 - Math.cos(a) * r, s.y + 18 + Math.sin(a) * r * 0.5, '#e9e2cf')
      })
    })
  },
}
const waterfall: Sprite = {
  id: 'lz_waterfall',
  name: '우렁찬 폭포',
  z: 50,
  focus: SOUND_FOCUS,
  draw(ctx, env) {
    const x = 240
    px(ctx, x - 10, 64, 26, 6, '#5a5a54')
    for (let y = 70; y < 146; y++) {
      for (let k = 0; k < 8; k++) {
        const on = (y + k * 3 + Math.floor(env.t * 40)) % 7 < 4
        dot(ctx, x + k, y, on ? '#eef4f6' : '#b8cdd6')
      }
    }
    for (let i = 0; i < 10; i++) {
      const f = mod(env.t * 2 + i / 10, 1)
      dot(ctx, x + 4 + Math.cos(i) * f * 14, 146 - f * 8, '#ffffff')
    }
    for (let r = 0; r < 3; r++) {
      const rr = 8 + r * 5 + mod(env.t * 10, 5)
      for (let a = -0.9; a <= 0.9; a += 0.25) dot(ctx, x - 6 - Math.cos(a) * rr, 110 + Math.sin(a) * rr, '#e9e2cf')
    }
  },
}
const deer: Sprite = {
  id: 'lz_deer',
  name: '우는 사슴',
  z: 50,
  focus: SOUND_FOCUS,
  draw(ctx, env) {
    const x = 120
    const y = 146
    px(ctx, x, y, 10, 4, '#8a5a3a')
    px(ctx, x + 8, y - 5, 3, 6, '#8a5a3a')
    px(ctx, x + 9, y - 7, 4, 3, '#8a5a3a')
    px(ctx, x + 9, y - 10, 1, 3, '#5a3d28')
    px(ctx, x + 12, y - 10, 1, 3, '#5a3d28')
    for (const k of [1, 3, 7, 9]) px(ctx, x + k, y + 4, 1, 5, '#6b4a32')
    for (let i = 0; i < 4; i++) dot(ctx, x + 2 + i * 2, y + 1, '#e8d8b8')
    for (let r = 0; r < 3; r++) {
      const rr = 4 + r * 4 + mod(env.t * 8, 4)
      for (let a = -0.7; a <= 0.7; a += 0.25) dot(ctx, x + 14 + Math.cos(a) * rr, y - 8 + Math.sin(a) * rr, '#e9e2cf')
    }
  },
}

// ── 3구: 저녁 빛 ────────────────────────────────────────────
const RAY_FOCUS = { x: 96, y: 40, w: 224, h: 126 }

const rays: Sprite = {
  id: 'lz_rays',
  name: '숲에 비껴 드는 저녁 빛',
  z: 60,
  focus: RAY_FOCUS,
  draw(ctx, env) {
    for (let k = 0; k < 5; k++) {
      const x0 = 330 - k * 14
      const a = 0.18 + 0.05 * Math.sin(env.t * 0.8 + k)
      withAlpha(ctx, a, () =>
        fillRows(ctx, 30, 168, (y) => {
          const f = (y - 30) / 138
          const c = x0 - f * 150
          return [c - 3 - f * 6, c + 3 + f * 6]
        }, '#ffd27a'),
      )
    }
    for (let i = 0; i < 18; i++) {
      const f = mod(env.t * 0.05 + hash(i), 1)
      const x = 300 - f * 140 + Math.sin(env.t + i) * 3
      const y = 50 + f * 110
      if (Math.sin(env.t * 3 + i) > 0) dot(ctx, x, y, '#fff2c0')
    }
  },
}
const lakeLight: Sprite = {
  id: 'lz_lake_light',
  name: '호수 위의 빛',
  z: 55,
  focus: RAY_FOCUS,
  draw(ctx, env) {
    for (let dy = -6; dy <= 6; dy++) {
      const w = Math.round(60 * Math.sqrt(1 - (dy * dy) / 49))
      px(ctx, 170 - w, 150 + dy, w * 2, 1, '#8aa0a8')
    }
    for (let i = 0; i < 20; i++) {
      const x = 120 + hash(i * 2.2) * 100
      const y = 146 + hash(i * 3.3) * 9
      if (Math.sin(env.t * 4 + i) > 0.2) px(ctx, x, y, 3, 1, '#ffd98a')
    }
  },
}
const clouded: Sprite = {
  id: 'lz_clouded',
  name: '구름에 가린 빛',
  z: 60,
  focus: RAY_FOCUS,
  draw(ctx, env) {
    veil(ctx, 0.35, '#2a2a34')
    for (let k = 0; k < 4; k++) {
      const x = mod(k * 90 + env.t * 4, W + 140) - 140
      const y = 6 + k * 10
      for (let r = 0; r < 7; r++) px(ctx, x - r, y + r, 140 + r * 2, 1, r < 2 ? '#7a7684' : '#625e6e')
    }
  },
}

// ── 4구: 다시 비추는 곳 ─────────────────────────────────────
const FLOOR_FOCUS = { x: 100, y: 132, w: 144, h: 48 }

const moss: Sprite = {
  id: 'lz_moss',
  name: '빛을 받은 푸른 이끼',
  z: 70,
  focus: FLOOR_FOCUS,
  draw(ctx, env) {
    ROCKS.forEach((r, k) => {
      for (let i = 0; i < r.r * 3; i++) {
        const a = Math.PI + hash(k * 9 + i) * Math.PI
        const rr = hash(k * 3 + i * 7) * r.r
        px(ctx, r.x + Math.cos(a) * rr * 1.3, r.y + Math.sin(a) * rr * 0.9, 2, 1, i % 3 ? '#4f8a3c' : '#77a85a')
      }
    })
    // 이끼 위에 머문 빛
    const a = 0.3 + 0.12 * Math.sin(env.t * 1.2)
    withAlpha(ctx, a, () => disc(ctx, 168, 156, 12, '#ffe7a0'))
    for (let i = 0; i < 6; i++) if (Math.sin(env.t * 3 + i * 2) > 0.5) sparkle(ctx, 160 + hash(i) * 20, 150 + hash(i * 3) * 8, '#e8ffd0')
  },
}
const maple: Sprite = {
  id: 'lz_maple',
  name: '붉은 단풍잎',
  z: 70,
  focus: FLOOR_FOCUS,
  draw(ctx) {
    for (let i = 0; i < 50; i++) {
      const x = 108 + hash(i * 2.7) * 130
      const y = 146 + hash(i * 4.9) * 30
      px(ctx, x, y, 2, 2, i % 3 ? '#c8402a' : '#e86a3a')
    }
  },
}
const snow: Sprite = {
  id: 'lz_snow',
  name: '하얀 눈',
  z: 70,
  focus: FLOOR_FOCUS,
  draw(ctx, env) {
    withAlpha(ctx, 0.8, () => px(ctx, 0, FLOOR + 2, W, H - FLOOR - 2, '#eef2f4'))
    ROCKS.forEach((r) => px(ctx, r.x - r.r, r.y - r.r, r.r * 2, 2, '#ffffff'))
    snowfall(ctx, env.t, 50)
  },
}

export const LUZHAI_SPRITES: Sprite[] = [
  empty, woodcutter, hikers,
  voices, waterfall, deer,
  rays, lakeLight, clouded,
  moss, maple, snow,
]
