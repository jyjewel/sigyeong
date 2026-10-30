// 『唐詩畫意』 卷八 첫 묶음 (1): 盧照鄰〈浴浪鳥〉, 王維〈華子岡〉〈臨湖亭〉〈南垞〉
import type { Background } from '../types'
import { H, W, disc, dot, hash, mod, px } from '../pixel'
import type { Ctx } from '../pixel'
import { AUTUMN, broadTree, bubble, flower, person, ridge, sky, withAlpha } from '../kit'
import { POET_PAL, drawFigure, pal, seatFig } from '../figures'
import { drift, lotusFlower, lotusPad, notes, shimmer, skiff, sp, stone, water } from './hy_kit'

// ════════════════════════════════════════════════════════════
// 盧照鄰〈浴浪鳥〉: 물가의 바위·물결·푸른 모래톱·흰 구름
// ════════════════════════════════════════════════════════════
const YL_WATER = 100

export const yulangniaoBackground: Background = {
  id: 'hy001',
  drawBack(ctx) {
    sky(ctx, ['#c4d8de', '#d2e2e4', '#dde9e8', '#e7efea'], YL_WATER)
    ridge(ctx, (x) => 84 + 8 * Math.sin(x * 0.02 + 1) + 3 * Math.sin(x * 0.09), '#a9bcbc', '#b6c8c6', 0, W, YL_WATER)
    water(ctx, YL_WATER, H, '#8cb0b2', '#5e8a8e', '#b8d2cc')
    // 푸른 모래톱 (碧沙)
    for (let y = 150; y < H; y++) {
      const a = 210 + (y - 150) * 1.6
      px(ctx, a, y, W - a, 1, y < 154 ? '#b9c9a4' : y % 5 === 0 ? '#93a982' : '#a3b78f')
    }
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    shimmer(ctx, env.t, YL_WATER + 4, 148, 26, '#e2eee8')
  },
}

/** 작은 물새 (날개를 접고 섬) */
function waterBird(ctx: Ctx, x: number, y: number, color = '#ecebe4') {
  px(ctx, x - 3, y - 4, 6, 3, color)
  px(ctx, x + 2, y - 7, 2, 3, color)
  dot(ctx, x + 4, y - 7, '#d9a441')
  dot(ctx, x - 1, y - 1, '#4a4038')
  dot(ctx, x + 1, y - 1, '#4a4038')
}

/** 날갯짓하는 물새 */
function flapBird(ctx: Ctx, x: number, y: number, t: number, color = '#ecebe4') {
  const up = Math.sin(t * 10) > 0
  px(ctx, x - 3, y - 4, 7, 3, color)
  px(ctx, x + 3, y - 6, 2, 2, color)
  dot(ctx, x + 5, y - 6, '#d9a441')
  if (up) {
    px(ctx, x - 5, y - 9, 4, 4, color)
    px(ctx, x + 1, y - 9, 3, 4, color)
  } else {
    px(ctx, x - 7, y - 3, 4, 2, '#cfcdc4')
    px(ctx, x + 2, y - 2, 4, 2, '#cfcdc4')
  }
}

const YL_ROCK = { x: 24, y: 96, w: 128, h: 72 }
const YL_WAVE = { x: 104, y: 84, w: 144, h: 81 }
const YL_SAND = { x: 192, y: 112, w: 128, h: 68 }
const YL_SKY = { x: 40, y: 0, w: 200, h: 113 }

export const YULANGNIAO_SPRITES = [
  sp('yl_rock', '너럭바위의 물새', 22, YL_ROCK, (ctx, env) => {
    stone(ctx, 82, 140, 12, '#b4ae9c', '#8a8474')
    px(ctx, 56, 140, 54, 2, '#6e6a5e')
    const tilt = Math.sin(env.t * 2) > 0
    waterBird(ctx, 78, 129)
    if (tilt) {
      px(ctx, 72, 131, 4, 3, '#ecebe4')
      px(ctx, 82, 131, 4, 3, '#ecebe4')
    }
  }),
  sp('yl_willow', '버드나무 가지의 물새', 22, YL_ROCK, (ctx) => {
    px(ctx, 30, 96, 4, 50, '#4a3a2a')
    px(ctx, 34, 112, 44, 2, '#4a3a2a')
    for (let i = 0; i < 12; i++) for (let k = 0; k < 14; k++) dot(ctx, 36 + i * 4 + (k * k) / 30, 113 + k, k % 3 ? '#7aa04a' : '#9abc62')
    waterBird(ctx, 64, 112)
  }),
  sp('yl_boat', '뱃전의 물새', 22, YL_ROCK, (ctx, env) => {
    skiff(ctx, 84, 140, env.t, { rower: false, len: 34 })
    waterBird(ctx, 94, 134)
  }),

  sp('yl_ripple', '날갯짓에 이는 잔물결', 18, YL_WAVE, (ctx, env) => {
    for (let i = 0; i < 6; i++) {
      const x = 130 + i * 16
      const y = 112 + (i % 2) * 6
      const f = mod(env.t * 0.8 + i / 6, 1)
      withAlpha(ctx, 1 - f, () => {
        px(ctx, x - 4 - f * 8, y + 4, 8 + f * 16, 1, '#e8f2ee')
      })
      flapBird(ctx, x, y - 2 - Math.sin(env.t * 3 + i) * 2, env.t + i)
    }
  }),
  sp('yl_bigwave', '물보라 치는 큰 파도', 18, YL_WAVE, (ctx, env) => {
    for (let i = 0; i < 5; i++) {
      const x = 120 + i * 24
      const h = 6 + Math.sin(env.t * 3 + i) * 3
      px(ctx, x, 128 - h, 18, h, '#4f7a80')
      px(ctx, x + 2, 127 - h, 14, 2, '#f2f6f2')
      for (let k = 0; k < 4; k++) dot(ctx, x + 4 + k * 3, 122 - h - hash(i * 3 + k) * 6, '#f2f6f2')
    }
  }),
  sp('yl_ice', '꽁꽁 언 수면', 18, YL_WAVE, (ctx) => {
    for (let y = 104; y < 146; y++) px(ctx, 112, y, 128, 1, y % 6 === 0 ? '#e8f0f2' : '#cfdfe4')
    for (let i = 0; i < 6; i++) px(ctx, 120 + hash(i) * 110, 108 + hash(i * 3) * 34, 12, 1, '#a8c0c8')
  }),

  sp('yl_flap', '모래톱 앞의 날갯짓', 24, YL_SAND, (ctx, env) => {
    flapBird(ctx, 250, 148, env.t)
    for (let k = 0; k < 6; k++) {
      const f = mod(env.t * 1.5 + k / 6, 1)
      dot(ctx, 250 + Math.cos(k) * f * 12, 144 - Math.sin(k + 1) * f * 6, '#d8ecee')
    }
  }),
  sp('yl_sleep', '모래에 웅크려 잠든 새', 24, YL_SAND, (ctx, env) => {
    px(ctx, 244, 158, 10, 4, '#ecebe4')
    px(ctx, 252, 156, 3, 3, '#ecebe4')
    const f = mod(env.t * 0.4, 1)
    withAlpha(ctx, 1 - f, () => {
      px(ctx, 258 + f * 6, 150 - f * 10, 3, 1, '#5d4a37')
      px(ctx, 260 + f * 6, 151 - f * 10, 1, 1, '#5d4a37')
    })
  }),
  sp('yl_fish', '물고기를 문 새', 24, YL_SAND, (ctx, env) => {
    const x = 220 + mod(env.t * 12, 80)
    flapBird(ctx, x, 140, env.t)
    px(ctx, x + 5, 136, 4, 2, '#c0c8cc')
    dot(ctx, x + 9, 136, '#c0c8cc')
  }),

  sp('yl_cloud', '흰 구름 위를 그리는 마음', 12, YL_SKY, (ctx, env) => {
    const drift1 = Math.sin(env.t * 0.2) * 6
    for (const [cx, cy, r] of [[110, 30, 9], [124, 24, 12], [140, 30, 9], [172, 46, 7], [184, 42, 9]] as const) disc(ctx, cx + drift1, cy, r, '#fbfbf6')
    px(ctx, 96 + drift1, 34, 56, 6, '#fbfbf6')
    const f = mod(env.t * 0.12, 1)
    flapBird(ctx, 150 - f * 20, 90 - f * 50, env.t, '#f4f2ea')
  }),
  sp('yl_nest', '둥지의 새끼들 생각', 12, YL_SKY, (ctx) => {
    bubble(ctx, 150, 40, 60, 34, 240, 140)
    px(ctx, 166, 62, 28, 5, '#8a6a42')
    px(ctx, 168, 60, 24, 2, '#a88a5a')
    for (let i = 0; i < 3; i++) {
      px(ctx, 171 + i * 7, 55, 4, 5, '#d8cfba')
      dot(ctx, 173 + i * 7, 54, '#d9a441')
    }
  }),
  sp('yl_island', '따뜻한 남쪽 섬 생각', 12, YL_SKY, (ctx) => {
    bubble(ctx, 150, 40, 60, 34, 240, 140)
    px(ctx, 156, 64, 48, 4, '#7fb6c4')
    disc(ctx, 180, 64, 8, '#d9c48a')
    px(ctx, 182, 50, 2, 12, '#6b4a32')
    px(ctx, 176, 49, 12, 2, '#5f8a46')
    disc(ctx, 196, 50, 4, '#f2c46a')
  }),
]

// ════════════════════════════════════════════════════════════
// 王維〈華子岡〉: 가을 하늘, 겹겹의 산, 언덕길
// ════════════════════════════════════════════════════════════
const hzSlope = (x: number) => 176 - x * 0.22 - 6 * Math.sin(x * 0.03)

export const huazigangBackground: Background = {
  id: 'hy002',
  drawBack(ctx) {
    sky(ctx, ['#cdd3d0', '#d8d8cc', '#e2dcc8', '#e9dfc4'], 110)
    ridge(ctx, (x) => 66 + 12 * Math.sin(x * 0.018 + 0.8) + 5 * Math.sin(x * 0.07), '#9aa09a', '#a8ada6')
    ridge(ctx, (x) => 84 + 10 * Math.sin(x * 0.026 + 2.4) + 4 * Math.sin(x * 0.1), '#7d857c', '#8a9288')
    ridge(ctx, (x) => 102 + 8 * Math.sin(x * 0.034 + 4) + 3 * Math.sin(x * 0.12), '#626c62')
  },
  drawFront(ctx) {
    // 화자강 언덕과 길
    ridge(ctx, hzSlope, '#6e6650', '#857c62')
    for (let x = 0; x < W; x += 2) {
      const y = hzSlope(x) + 8 + Math.sin(x * 0.05) * 2
      px(ctx, x, y, 2, 2, '#a8987a')
    }
    for (let i = 0; i < 40; i++) {
      const x = hash(i * 3.3) * W
      dot(ctx, x, hzSlope(x) + 14 + hash(i * 5) * 20, '#5a5442')
    }
  },
  drawDynamic() {},
}

const HZ_SKY = { x: 120, y: 0, w: 200, h: 113 }
const HZ_RIDGE = { x: 0, y: 0, w: 320, h: 180 }
const HZ_PATH = { x: 70, y: 76, w: 160, h: 90 }
const HZ_MOOD = { x: 110, y: 60, w: 144, h: 81 }
const pathY = (x: number) => hzSlope(x) + 6

export const HUAZIGANG_SPRITES = [
  sp('hz_far', '멀어지는 새', 14, HZ_SKY, (ctx, env) => {
    for (let i = 0; i < 7; i++) {
      const f = mod(env.t * 0.06 + i / 7, 1)
      const x = 150 + f * 170
      const y = 70 - f * 50 + i * 2
      const s = 1 - f * 0.8
      const up = Math.sin(env.t * 6 + i) > 0
      if (s > 0.45) {
        dot(ctx, x - 2, y + (up ? -1 : 1), '#3e3a36')
        dot(ctx, x + 2, y + (up ? -1 : 1), '#3e3a36')
      }
      dot(ctx, x, y, '#3e3a36')
    }
  }),
  sp('hz_roost', '둥지로 돌아온 새', 14, HZ_SKY, (ctx) => {
    px(ctx, 250, 40, 3, 70, '#4a3a2a')
    px(ctx, 232, 52, 40, 2, '#4a3a2a')
    px(ctx, 244, 48, 16, 4, '#7a5a3a')
    for (let i = 0; i < 4; i++) {
      px(ctx, 236 + i * 9, 48, 4, 3, '#3e3a36')
      dot(ctx, 239 + i * 9, 47, '#3e3a36')
    }
  }),
  sp('hz_circle', '하늘을 맴도는 새', 14, HZ_SKY, (ctx, env) => {
    for (let i = 0; i < 5; i++) {
      const a = env.t * 0.8 + (i / 5) * Math.PI * 2
      const x = 230 + Math.cos(a) * 34
      const y = 44 + Math.sin(a) * 14
      dot(ctx, x - 2, y - 1, '#3e3a36')
      dot(ctx, x + 2, y - 1, '#3e3a36')
      dot(ctx, x, y, '#3e3a36')
    }
  }),

  sp('hz_autumn', '가을빛 연산', 6, HZ_RIDGE, (ctx) => {
    const cols = [AUTUMN.base, AUTUMN.light, '#b8863a', AUTUMN.dark]
    for (let i = 0; i < 260; i++) {
      const x = hash(i * 1.3) * W
      const band = i % 3
      const base = band === 0 ? 70 : band === 1 ? 88 : 106
      const y = base + 4 + hash(i * 2.9) * 12 + 10 * Math.sin(x * 0.02 + band)
      px(ctx, x, y, 2, 1, cols[i % 4])
    }
  }),
  sp('hz_snow', '눈 덮인 산', 6, HZ_RIDGE, (ctx) => {
    ridge(ctx, (x) => 66 + 12 * Math.sin(x * 0.018 + 0.8) + 5 * Math.sin(x * 0.07), '#eef0ee', '#ffffff', 0, W, 76)
    ridge(ctx, (x) => 84 + 10 * Math.sin(x * 0.026 + 2.4) + 4 * Math.sin(x * 0.1), '#e2e6e4', '#ffffff', 0, W, 92)
    ridge(ctx, (x) => 102 + 8 * Math.sin(x * 0.034 + 4) + 3 * Math.sin(x * 0.12), '#d6dcda', '#ffffff', 0, W, 110)
  }),
  sp('hz_spring', '봄꽃 핀 산', 6, HZ_RIDGE, (ctx) => {
    for (let i = 0; i < 200; i++) {
      const x = hash(i * 1.7) * W
      const band = i % 3
      const y = (band === 0 ? 72 : band === 1 ? 90 : 108) + hash(i * 3.1) * 12 + 10 * Math.sin(x * 0.02 + band)
      px(ctx, x, y, 2, 1, i % 2 ? '#e8a3b4' : '#f6d4dc')
    }
  }),

  sp('hz_walk', '언덕을 오르내리는 시인', 30, HZ_PATH, (ctx, env) => {
    const f = (Math.sin(env.t * 0.35) + 1) / 2
    const x = 100 + f * 100
    const flip = Math.cos(env.t * 0.35) < 0
    drawFigure(ctx, Math.round(x), Math.round(pathY(x + 7) - 22), POET_PAL, env, { flip })
  }),
  sp('hz_drink', '정자에서 술 마시는 사람', 30, HZ_PATH, (ctx) => {
    const x = 140
    const y = pathY(150) - 30
    px(ctx, x - 4, y - 2, 40, 4, '#5a4a3a')
    px(ctx, x, y + 2, 2, 26, '#6b4a32')
    px(ctx, x + 30, y + 2, 2, 26, '#6b4a32')
    seatFig(ctx, x + 8, y + 10, pal())
    px(ctx, x + 24, y + 20, 4, 3, '#dcd2bb')
  }),
  sp('hz_horse', '말 타고 지나는 사람', 30, HZ_PATH, (ctx, env) => {
    const x = 110 + mod(env.t * 10, 100)
    const y = pathY(x + 10) - 14
    px(ctx, x, y, 18, 7, '#6b4a32')
    px(ctx, x + 16, y - 5, 4, 7, '#6b4a32')
    const leg = Math.floor(env.t * 6) % 2
    for (let k = 0; k < 4; k++) px(ctx, x + 2 + k * 4 + (leg && k % 2 ? 1 : 0), y + 7, 1, 6, '#4a3220')
    person(ctx, x + 6, y - 9, '#7a4a3a')
  }),

  sp('hz_sorrow', '끝없는 서글픔', 40, HZ_MOOD, (ctx, env) => {
    drift(ctx, env.t, { x: 120, y: 70, w: 120, h: 60 }, 14, AUTUMN.base, 0.4, 3)
    const f = (Math.sin(env.t * 0.35) + 1) / 2
    const x = 100 + f * 100
    const y = pathY(x + 7) - 30
    // 머리 위의 작은 먹구름과 떨어지는 빗방울 (서글픔)
    px(ctx, x + 2, y - 8, 12, 3, '#6e7682')
    px(ctx, x + 4, y - 10, 8, 2, '#7e8692')
    for (let k = 0; k < 3; k++) dot(ctx, x + 4 + k * 4, y - 4 + mod(env.t * 1.5 + k / 3, 1) * 6, '#8aa4c4')
  }),
  sp('hz_sing', '기뻐 부르는 노래', 40, HZ_MOOD, (ctx, env) => {
    const f = (Math.sin(env.t * 0.35) + 1) / 2
    const x = 100 + f * 100
    notes(ctx, x + 14, pathY(x + 7) - 28, env.t, '#b2352a')
  }),
  sp('hz_sleepy', '쏟아지는 졸음', 40, HZ_MOOD, (ctx, env) => {
    const f = (Math.sin(env.t * 0.35) + 1) / 2
    const x = 100 + f * 100
    const y = pathY(x + 7) - 30
    for (let k = 0; k < 3; k++) {
      const g = mod(env.t * 0.5 + k / 3, 1)
      withAlpha(ctx, 1 - g, () => {
        const zx = x + 16 + k * 5 + g * 6
        const zy = y - g * 14
        px(ctx, zx, zy, 4, 1, '#3b2a1d')
        dot(ctx, zx + 2, zy + 1, '#3b2a1d')
        dot(ctx, zx + 1, zy + 2, '#3b2a1d')
        px(ctx, zx, zy + 3, 4, 1, '#3b2a1d')
      })
    }
  }),
]

// ════════════════════════════════════════════════════════════
// 王維〈臨湖亭〉: 호수와 오른쪽 기슭의 정자
// ════════════════════════════════════════════════════════════
const LH_WATER = 92
const PAV = { x: 222, y: 70 } // 정자 지붕 왼쪽 위

function pavilion(ctx: Ctx, x: number, y: number) {
  px(ctx, x + 4, y + 10, 2, 34, '#7a2a20')
  px(ctx, x + 62, y + 10, 2, 34, '#7a2a20')
  px(ctx, x + 32, y + 10, 2, 34, '#7a2a20')
  px(ctx, x - 6, y + 4, 80, 4, '#3c4048')
  px(ctx, x + 2, y, 64, 4, '#4a4f57')
  px(ctx, x + 20, y - 3, 28, 3, '#4a4f57')
  dot(ctx, x - 7, y + 3, '#3c4048')
  dot(ctx, x + 74, y + 3, '#3c4048')
  // 난간(軒)
  px(ctx, x, y + 34, 68, 2, '#b2352a')
  for (let k = 0; k < 9; k++) px(ctx, x + 2 + k * 8, y + 36, 1, 6, '#8a2a20')
  px(ctx, x - 4, y + 44, 80, 4, '#8a8072')
}

export const linhutingBackground: Background = {
  id: 'hy004',
  drawBack(ctx) {
    sky(ctx, ['#cfdcd8', '#d9e3dc', '#e3e9de'], LH_WATER)
    ridge(ctx, (x) => 74 + 7 * Math.sin(x * 0.025 + 1) + 2 * Math.sin(x * 0.1), '#9fb0a2', '#aebeb0', 0, W, LH_WATER)
    // 맞은편 기슭
    px(ctx, 0, LH_WATER - 4, 150, 4, '#7d8f72')
    for (let i = 0; i < 12; i++) broadTree(ctx, 8 + i * 12, LH_WATER - 3, 0.5, { dark: '#4f6b44', base: '#5f7d50', light: '#7a9a62' })
    water(ctx, LH_WATER, H, '#9fbcb8', '#6f9898', '#c4d8d0')
  },
  drawFront(ctx) {
    // 오른쪽 기슭과 정자
    ridge(ctx, (x) => (x < 200 ? H : 124 - (x - 200) * 0.05), '#6f7d5a', '#8a9870')
    pavilion(ctx, PAV.x, PAV.y)
  },
  drawDynamic(ctx, env) {
    shimmer(ctx, env.t, LH_WATER + 6, 168, 24, '#e6f0ea', 0, 210)
  },
}

const LH_FAR = { x: 0, y: 52, w: 160, h: 90 }
const LH_MID = { x: 60, y: 92, w: 160, h: 90 }
const LH_PAV = { x: 196, y: 60, w: 124, h: 70 }
const LH_LOT = { x: 0, y: 100, w: 320, h: 80 }

export const LINHUTING_SPRITES = [
  sp('lh_skiff', '손님을 맞는 작은 배', 20, LH_FAR, (ctx, env) => {
    person(ctx, 40, LH_WATER - 12, '#7a4a3a')
    skiff(ctx, 62, LH_WATER + 8, env.t, { len: 24 })
  }),
  sp('lh_palanquin', '화려한 가마', 20, LH_FAR, (ctx, env) => {
    const x = 30 + mod(env.t * 6, 80)
    px(ctx, x, LH_WATER - 16, 14, 10, '#b2352a')
    px(ctx, x - 1, LH_WATER - 18, 16, 3, '#d9a441')
    px(ctx, x - 6, LH_WATER - 10, 26, 1, '#5a4632')
    person(ctx, x - 6, LH_WATER - 12, '#4b5068')
    person(ctx, x + 16, LH_WATER - 12, '#4b5068')
  }),
  sp('lh_horse', '말 탄 하인', 20, LH_FAR, (ctx, env) => {
    const x = 30 + mod(env.t * 8, 90)
    px(ctx, x, LH_WATER - 12, 14, 6, '#6b4a32')
    px(ctx, x + 12, LH_WATER - 16, 3, 6, '#6b4a32')
    const leg = Math.floor(env.t * 6) % 2
    for (let k = 0; k < 4; k++) px(ctx, x + 1 + k * 4 + (leg && k % 2 ? 1 : 0), LH_WATER - 6, 1, 5, '#4a3220')
    person(ctx, x + 4, LH_WATER - 20, '#4f6b4a')
  }),

  sp('lh_slow', '유유히 오는 배', 26, LH_MID, (ctx, env) => {
    const x = 110 + Math.sin(env.t * 0.25) * 18
    skiff(ctx, x, 136, env.t * 0.5, { guest: '#6b5a7a', len: 28 })
    for (let k = 0; k < 3; k++) px(ctx, x - 22 - k * 10, 138 + k, 8, 1, '#dce8e2')
  }),
  sp('lh_storm', '거센 물결에 흔들리는 배', 26, LH_MID, (ctx, env) => {
    const tilt = Math.sin(env.t * 4) * 3
    skiff(ctx, 120, 134 + tilt, env.t, { guest: '#6b5a7a', len: 28 })
    for (let i = 0; i < 6; i++) {
      const x = 80 + i * 16
      const h = 4 + Math.sin(env.t * 4 + i) * 3
      px(ctx, x, 142 - h, 12, h, '#5a8086')
      px(ctx, x + 1, 141 - h, 10, 1, '#f2f6f2')
    }
  }),
  sp('lh_fast', '급히 노 저어 오는 배', 26, LH_MID, (ctx, env) => {
    const x = 80 + mod(env.t * 30, 90)
    skiff(ctx, x, 136, env.t * 4, { guest: '#6b5a7a', len: 28 })
    for (let k = 0; k < 5; k++) dot(ctx, x - 16 - hash(k + Math.floor(env.t * 8)) * 6, 132 + hash(k * 3) * 6, '#f2f6f2')
  }),

  sp('lh_wine', '난간 앞의 술동이', 34, LH_PAV, (ctx) => {
    seatFig(ctx, PAV.x + 10, PAV.y + 18, pal())
    seatFig(ctx, PAV.x + 44, PAV.y + 18, pal({ R: '#6b5a7a', r: '#4d405a' }), true)
    px(ctx, PAV.x + 30, PAV.y + 26, 8, 8, '#8a6a42')
    px(ctx, PAV.x + 31, PAV.y + 24, 6, 2, '#a88a5a')
    px(ctx, PAV.x + 26, PAV.y + 30, 3, 2, '#dcd2bb')
  }),
  sp('lh_go', '바둑판', 34, LH_PAV, (ctx) => {
    seatFig(ctx, PAV.x + 10, PAV.y + 18, pal())
    seatFig(ctx, PAV.x + 44, PAV.y + 18, pal({ R: '#6b5a7a', r: '#4d405a' }), true)
    px(ctx, PAV.x + 26, PAV.y + 28, 16, 6, '#c9a46a')
    for (let k = 0; k < 6; k++) dot(ctx, PAV.x + 28 + k * 2, PAV.y + 29 + (k % 2) * 2, k % 2 ? '#ffffff' : '#1f1d22')
  }),
  sp('lh_qin', '거문고', 34, LH_PAV, (ctx, env) => {
    seatFig(ctx, PAV.x + 20, PAV.y + 18, pal())
    px(ctx, PAV.x + 28, PAV.y + 30, 28, 3, '#5a3d28')
    for (let k = 0; k < 4; k++) px(ctx, PAV.x + 30, PAV.y + 30 + (k % 2), 24, 1, '#d8c8a0')
    notes(ctx, PAV.x + 50, PAV.y + 20, env.t)
  }),

  sp('lh_lotus', '사방의 연꽃', 12, LH_LOT, (ctx) => {
    for (let i = 0; i < 30; i++) {
      const x = 6 + hash(i * 2.1) * 200
      const y = 112 + hash(i * 4.7) * 60
      lotusPad(ctx, x, y, 4 + Math.round(hash(i) * 3))
      if (i % 2 === 0) lotusFlower(ctx, x + 2, y - 3)
    }
  }),
  sp('lh_reed', '갈대꽃', 12, LH_LOT, (ctx, env) => {
    for (let i = 0; i < 26; i++) {
      const x = 6 + hash(i * 2.3) * 200
      const base = 120 + hash(i * 5.1) * 56
      const sway = Math.sin(env.t * 1.4 + i) * 1.5
      px(ctx, x, base - 14, 1, 14, '#9a9a6a')
      px(ctx, x - 1 + sway, base - 18, 3, 4, '#e8e2cc')
    }
  }),
  sp('lh_plum', '매화', 12, LH_LOT, (ctx) => {
    for (let i = 0; i < 6; i++) {
      const x = 14 + i * 34
      const y = 150 + (i % 2) * 14
      px(ctx, x, y - 22, 2, 22, '#4a3426')
      px(ctx, x, y - 18, 10, 1, '#4a3426')
      for (let k = 0; k < 6; k++) flower(ctx, x - 2 + hash(i * 6 + k) * 14, y - 26 + hash(i * 3 + k) * 12, '#f6f0f2', '#d9a441')
    }
  }),
]

// ════════════════════════════════════════════════════════════
// 王維〈南垞〉: 앞쪽 남쪽 언덕, 넓은 호수, 아득한 북쪽 기슭
// ════════════════════════════════════════════════════════════
const NT_FAR = 64 // 북쪽 기슭 물가선

export const nantuoBackground: Background = {
  id: 'hy005',
  drawBack(ctx) {
    sky(ctx, ['#d3dcd8', '#dde4dc', '#e6eadf'], NT_FAR)
    water(ctx, NT_FAR, H, '#a6c0bc', '#7aa0a0', '#cadcd4')
  },
  drawFront(ctx) {
    // 남쪽 언덕 (앞쪽)
    ridge(ctx, (x) => 150 + 10 * Math.sin(x * 0.02 + 2) - (x < 120 ? (120 - x) * 0.12 : 0), '#6e7a56', '#86926a')
    for (let i = 0; i < 6; i++) broadTree(ctx, 12 + i * 16, 150 - (6 - i) * 2, 0.8, { dark: '#3e5a38', base: '#4f6b44', light: '#6a8a58' })
  },
  drawDynamic(ctx, env) {
    shimmer(ctx, env.t, NT_FAR + 30, 146, 22, '#e8f0ea')
  },
}

const NT_BOAT = { x: 100, y: 108, w: 128, h: 72 }
const NT_SHORE = { x: 0, y: 30, w: 320, h: 180 }
const NT_HOUSE = { x: 176, y: 34, w: 128, h: 72 }

export const NANTUO_SPRITES = [
  sp('nt_boat', '남쪽 언덕을 떠나는 배', 26, NT_BOAT, (ctx, env) => {
    const x = 150 + Math.sin(env.t * 0.2) * 10 + 10
    skiff(ctx, x, 150, env.t, { len: 26 })
    for (let k = 0; k < 3; k++) px(ctx, x + 16 + k * 8, 152 + k, 6, 1, '#dce8e2')
  }),
  sp('nt_donkey', '나귀 탄 사람', 26, NT_BOAT, (ctx, env) => {
    const x = 120 + mod(env.t * 6, 70)
    px(ctx, x, 150, 12, 5, '#8a8072')
    px(ctx, x + 10, 146, 3, 5, '#8a8072')
    px(ctx, x + 11, 144, 1, 3, '#8a8072')
    for (let k = 0; k < 4; k++) px(ctx, x + 1 + k * 3, 155, 1, 4, '#5a524a')
    person(ctx, x + 3, 142, '#4b5068')
  }),
  sp('nt_cart', '수레', 26, NT_BOAT, (ctx, env) => {
    const x = 120 + mod(env.t * 5, 70)
    px(ctx, x, 146, 20, 6, '#8a6a42')
    disc(ctx, x + 6, 155, 4, '#5a4632')
    disc(ctx, x + 6, 155, 1, '#a88a5a')
    px(ctx, x + 20, 150, 10, 1, '#5a4632')
    person(ctx, x + 28, 144, '#7a6a4a')
  }),

  sp('nt_far', '아득한 북쪽 언덕', 8, NT_SHORE, (ctx, env) => {
    ridge(ctx, (x) => NT_FAR - 4 + 2 * Math.sin(x * 0.05), '#a9b6a8', '#b8c4b6', 0, W, NT_FAR)
    withAlpha(ctx, 0.5, () => {
      for (let k = 0; k < 3; k++) {
        const o = Math.sin(env.t * 0.3 + k) * 8
        px(ctx, 20 + k * 90 + o, NT_FAR + 4 + k * 6, 70, 2, '#eef2ee')
      }
    })
  }),
  sp('nt_near', '바로 코앞의 북쪽 언덕', 8, NT_SHORE, (ctx) => {
    ridge(ctx, (x) => NT_FAR + 30 + 10 * Math.sin(x * 0.03), '#6e7a56', '#86926a', 0, W, NT_FAR + 60)
  }),
  sp('nt_bridge', '긴 다리', 8, NT_SHORE, (ctx) => {
    ridge(ctx, (x) => NT_FAR - 4 + 2 * Math.sin(x * 0.05), '#a9b6a8', '#b8c4b6', 0, W, NT_FAR)
    for (let y = NT_FAR; y < 150; y++) {
      const f = (y - NT_FAR) / (150 - NT_FAR)
      const w = 6 + f * 14
      px(ctx, 150 - w / 2 + f * 30, y, w, 1, y % 6 === 0 ? '#6a5a46' : '#8a7a66')
    }
  }),

  sp('nt_houses', '물 건너 인가', 10, NT_HOUSE, (ctx) => {
    for (let i = 0; i < 4; i++) {
      const x = 196 + i * 18
      px(ctx, x, NT_FAR - 12, 12, 2, '#5a5f66')
      px(ctx, x + 1, NT_FAR - 10, 10, 6, '#e2dccb')
      px(ctx, x + 4, NT_FAR - 8, 3, 4, '#6b4a32')
    }
    withAlpha(ctx, 0.5, () => px(ctx, 230, NT_FAR - 22, 2, 10, '#e8e8e4'))
  }),
  sp('nt_pagoda', '절의 탑', 10, NT_HOUSE, (ctx) => {
    for (let k = 0; k < 6; k++) {
      const w = 16 - k * 2
      px(ctx, 230 - w / 2, NT_FAR - 6 - k * 6, w, 2, '#4a4f57')
      px(ctx, 230 - w / 2 + 2, NT_FAR - 4 - k * 6, w - 4, 4, '#c9bfa5')
    }
    px(ctx, 229, NT_FAR - 44, 2, 6, '#d9a441')
  }),
  sp('nt_wall', '높은 성곽', 10, NT_HOUSE, (ctx) => {
    px(ctx, 190, NT_FAR - 14, 90, 14, '#8a8072')
    for (let k = 0; k < 90; k += 8) px(ctx, 190 + k, NT_FAR - 18, 5, 4, '#8a8072')
    px(ctx, 228, NT_FAR - 26, 14, 12, '#6b4a32')
    px(ctx, 226, NT_FAR - 28, 18, 3, '#4a4f57')
  }),

  sp('nt_tiny', '알아볼 수 없는 먼 사람들', 12, NT_HOUSE, (ctx, env) => {
    for (let i = 0; i < 4; i++) {
      const x = 194 + i * 20 + Math.sin(env.t * 0.4 + i) * 3
      px(ctx, x, NT_FAR - 3, 1, 2, '#3e3a36')
    }
  }),
  sp('nt_wave', '손 흔들어 반기는 사람', 12, NT_HOUSE, (ctx, env) => {
    person(ctx, 220, NT_FAR - 9, '#7a4a3a')
    const up = Math.sin(env.t * 6) > 0
    px(ctx, 223, NT_FAR - (up ? 11 : 8), 1, 3, '#e6c39b')
  }),
  sp('nt_meet', '마중 나오는 배', 12, NT_HOUSE, (ctx, env) => {
    const f = mod(env.t * 0.08, 1)
    skiff(ctx, 230 - f * 30, NT_FAR + 10 + f * 30, env.t, { len: 20 })
  }),
]
