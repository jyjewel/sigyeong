// 『唐詩畫意』 卷九 六言絕句 (2): 劉長卿〈尋張逸人山居〉〈送陸澧還吳中〉, 張繼〈山家〉〈歸山〉
import type { Background } from '../types'
import { H, W, disc, dot, fillRows, hash, mod, px } from '../pixel'
import type { Ctx, Env } from '../pixel'
import { boat, house, hut, mistBands, person, pine, rain, ridge, sky, snowfall, withAlpha } from '../kit'
import { OTHER_PALS, pal, standFig } from '../figures'
import { drift, shimmer, skiff, soundArcs, sp, sun, water } from './hy_kit'

const FULL = { x: 0, y: 0, w: 320, h: 180 }

// ════════════════════════════════════════════════════════════
// 劉長卿〈尋張逸人山居〉: 새 길과 빈 산의 인가와 떠내려오는 꽃잎
// ════════════════════════════════════════════════════════════
const s8Left = (y: number) => 70 + (y - 30) * 0.45 + Math.sin(y * 0.2) * 5
const s8Right = (y: number) => 250 - (y - 30) * 0.5 + Math.sin(y * 0.17) * 5
const s8Stream = (t: number) => ({ x: 160 + Math.sin(t * 6) * (6 + t * 30), y: 80 + t * 100 })
const S8_HOUSE = { x: 222, y: 84 }

export const zhangyirenBackground: Background = {
  id: 'hy123',
  drawBack(ctx) {
    sky(ctx, ['#c0ccd4', '#ccd4d6', '#d8dcd6'], 100)
    ridge(ctx, (x) => 60 + 10 * Math.sin(x * 0.04), '#9aaca0', '#a6b8ac', 0, W, 100)
    px(ctx, 0, 90, W, H - 90, '#7e9468')
    for (let t = 0; t <= 1; t += 0.004) {
      const p = s8Stream(t)
      px(ctx, p.x - 2 - t * 4, p.y, 4 + t * 8, 2, '#8ab0bc')
    }
    fillRows(ctx, 30, H, (y) => [0, s8Left(y)], (y) => (y % 7 === 0 ? '#6a6e62' : '#7a7e70'))
    fillRows(ctx, 30, H, (y) => [s8Right(y), W], (y) => (y % 7 === 0 ? '#62665a' : '#6e7264'))
    for (let k = 0; k < 4; k++) pine(ctx, 14 + k * 14, 40 + k * 6, 0.7)
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    for (let k = 0; k < 8; k++) {
      const p = s8Stream(mod(k / 8 + env.t * 0.05, 1))
      px(ctx, p.x - 1, p.y, 3, 1, '#d8eaf0')
    }
  },
}

const S8_PATH = { x: 0, y: 72, w: 144, h: 108 }
const S8_HOUSE_F = { x: 176, y: 56, w: 112, h: 63 }
const S8_DEEP = { x: 112, y: 52, w: 96, h: 54 }
const S8_STREAM_F = { x: 96, y: 96, w: 144, h: 84 }

export const ZHANGYIREN_SPRITES = [
  sp('s8_path', '바위 사이 겨우 난 새 길', 14, S8_PATH, (ctx, env) => {
    let x = 30
    for (let y = 170; y > 80; y -= 2) {
      x += Math.sin(y * 0.15) * 1.6
      const [l] = [s8Left(y)]
      px(ctx, Math.min(x, l - 6), y, 3, 2, '#c8b88a')
    }
    const t = mod(env.t * 0.03, 1)
    person(ctx, 40 + Math.sin(t * 9) * 6, 160 - t * 70, '#4b5068')
  }),
  sp('s8_road', '넓은 큰길', 14, S8_PATH, (ctx) => fillRows(ctx, 100, H, (y) => [20 + (y - 100) * 0.1, 60 + (y - 100) * 0.3], '#c8b88a')),
  sp('s8_bridge', '돌다리', 14, S8_PATH, (ctx) => {
    for (let a = 0; a <= Math.PI; a += 0.02) px(ctx, 160 - Math.cos(a) * 30, 150 - Math.sin(a) * 8, 3, 3, '#8a8478')
  }),

  sp('s8_house', '빈 산의 인가', 20, S8_HOUSE_F, (ctx, env) => {
    px(ctx, S8_HOUSE.x - 16, S8_HOUSE.y + 14, 40, 3, '#7a7e70')
    hut(ctx, S8_HOUSE.x - 10, S8_HOUSE.y)
    withAlpha(ctx, 0.5, () => {
      for (let i = 0; i < 16; i++) dot(ctx, S8_HOUSE.x + 4 + Math.sin(i * 0.4 + env.t) * (i / 6), S8_HOUSE.y - i, '#e8ecec')
    })
  }),
  sp('s8_temple', '절', 20, S8_HOUSE_F, (ctx) => {
    px(ctx, S8_HOUSE.x - 14, S8_HOUSE.y + 4, 30, 12, '#c9bfa5')
    px(ctx, S8_HOUSE.x - 18, S8_HOUSE.y - 2, 38, 6, '#3c4048')
  }),
  sp('s8_fort', '성채', 20, S8_HOUSE_F, (ctx) => {
    px(ctx, S8_HOUSE.x - 16, S8_HOUSE.y, 36, 16, '#8a8274')
    for (let x = S8_HOUSE.x - 16; x < S8_HOUSE.x + 20; x += 6) px(ctx, x, S8_HOUSE.y - 4, 4, 4, '#8a8274')
  }),

  sp('s8_peach', '깊은 곳에 있을 도원', 12, S8_DEEP, (ctx, env) => {
    withAlpha(ctx, 0.35 + Math.sin(env.t * 0.8) * 0.08, () => disc(ctx, 160, 78, 22, '#ffd8e0'))
    for (let k = 0; k < 14; k++) disc(ctx, 142 + hash(k * 2.1) * 36, 72 + hash(k * 3.3) * 14, 2, k % 2 ? '#f4a0b8' : '#f8c8d4')
    mistBands(ctx, env.t * 0.5, [70, 84], '#ffffff', 0.4)
  }),
  sp('s8_lake', '넓은 호수', 12, S8_DEEP, (ctx) => fillRows(ctx, 76, 90, (y) => [140 + Math.abs(y - 83) * 2, 180 - Math.abs(y - 83) * 2], '#8ab4c4')),
  sp('s8_fall', '폭포', 12, S8_DEEP, (ctx, env) => {
    for (let y = 56; y < 92; y++) px(ctx, 158, y, 4, 1, Math.sin(y * 0.5 - env.t * 10) > 0 ? '#e4f0f4' : '#a8c8d0')
  }),

  sp('s8_petals', '시냇물에 떠내려오는 꽃잎', 24, S8_STREAM_F, (ctx, env) => {
    for (let k = 0; k < 10; k++) {
      const p = s8Stream(mod(k / 10 + env.t * 0.04, 1))
      px(ctx, p.x - 1 + Math.sin(env.t + k) * 2, p.y, 2, 1, k % 2 ? '#f49aae' : '#f8c8d4')
    }
  }),
  sp('s8_leaves', '낙엽', 24, S8_STREAM_F, (ctx, env) => {
    for (let k = 0; k < 8; k++) {
      const p = s8Stream(mod(k / 8 + env.t * 0.04, 1))
      px(ctx, p.x, p.y, 2, 1, '#a8662a')
    }
  }),
  sp('s8_ice', '얼음 조각', 24, S8_STREAM_F, (ctx) => {
    for (let k = 0; k < 6; k++) {
      const p = s8Stream(k / 6 + 0.05)
      px(ctx, p.x - 2, p.y, 5, 2, '#e8f0f4')
    }
  }),
]

// ════════════════════════════════════════════════════════════
// 劉長卿〈送陸澧還吳中〉: 과보 나루의 저녁 비와 가을 풀길
// ════════════════════════════════════════════════════════════
const S9_WATER = 100
const S9_FAR = 120
const S9_POET = { x: 40, y: 174 }

export const songluliBackground: Background = {
  id: 'hy124',
  drawBack(ctx) {
    sky(ctx, ['#7a8294', '#8a909c', '#a4a4a4'], S9_WATER)
    ridge(ctx, (x) => 86 + 6 * Math.sin(x * 0.02 + 2), '#6a7278', '#747c82', 0, W, S9_WATER)
    fillRows(ctx, S9_WATER - 4, S9_FAR, () => [0, W], (y) => (y < S9_WATER ? '#7a7a5a' : '#8a96a0'))
    water(ctx, S9_FAR, 160, '#8a96a0', '#6a7682', '#a8b2b8')
    px(ctx, 0, 160, W, H - 160, '#6a6a4e')
    standFig(ctx, S9_POET.x, S9_POET.y - 22, pal())
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    shimmer(ctx, env.t, S9_FAR + 3, 158, 10, '#c8d0d4')
  },
}

const S9_RIVER = { x: 80, y: 104, w: 160, h: 72 }
const S9_NEAR = { x: 0, y: 108, w: 128, h: 72 }
const S9_SOUTH = { x: 160, y: 56, w: 160, h: 54 }
const S9_ROAD = { x: 104, y: 72, w: 192, h: 54 }

export const SONGLULI_SPRITES = [
  sp('s9_boat', '차가운 조수에 떠나는 손님의 배', 22, S9_RIVER, (ctx, env) => {
    const x = 120 + mod(env.t * 3, 80)
    skiff(ctx, x, 146, env.t, { guest: '#6a5a7a', len: 24 })
    for (let k = 0; k < 6; k++) px(ctx, 90 + mod(k * 30 + env.t * 12, 180), 130 + (k % 3) * 8, 8, 1, '#c8d0d4')
  }),
  sp('s9_fishing', '고기잡이배', 22, S9_RIVER, (ctx, env) => skiff(ctx, 160, 146, env.t, { len: 22 })),
  sp('s9_empty', '텅 빈 나루', 22, S9_RIVER, (ctx) => {
    px(ctx, 80, 150, 30, 3, '#5a4632')
    px(ctx, 106, 153, 2, 8, '#5a4632')
  }),

  sp('s9_rain', '옷을 적시는 버들솜과 저녁 비', 26, S9_NEAR, (ctx, env) => {
    rain(ctx, env.t, 70, 120, 'rgba(160,170,185,0.65)', 4)
    for (let i = 0; i < 14; i++) {
      const f = mod(hash(i * 2.1) + env.t * 0.05, 1)
      dot(ctx, mod(hash(i * 1.7) * W + f * 80, W), 60 + f * 100, '#f4f4ec')
    }
    withAlpha(ctx, 0.35, () => px(ctx, S9_POET.x + 1, S9_POET.y - 8, 12, 6, '#3a4058'))
  }),
  sp('s9_snow', '함박눈', 26, S9_NEAR, (ctx, env) => snowfall(ctx, env.t, 60)),
  sp('s9_petals', '꽃잎', 26, S9_NEAR, (ctx, env) => drift(ctx, env.t, FULL, 30, '#f2b8c6', 0.3, 4)),

  sp('s9_mountain', '남쪽으로 바라보는 고향 산', 10, S9_SOUTH, (ctx) => {
    ridge(ctx, (x) => 70 + Math.abs(x - 250) * 0.4 + 3 * Math.sin(x * 0.1), '#5a6a70', '#6a7a80', 180, W, S9_WATER - 4)
    withAlpha(ctx, 0.3, () => {
      for (let t = 0; t < 1; t += 0.03) if (Math.sin(t * 50) > 0) dot(ctx, S9_POET.x + 12 + t * 200, S9_POET.y - 18 - t * 70, '#f4ecd8')
    })
  }),
  sp('s9_sea', '넓은 바다', 10, S9_SOUTH, (ctx) => px(ctx, 160, 86, 160, 10, '#5a7a90')),
  sp('s9_city', '높은 성', 10, S9_SOUTH, (ctx) => {
    px(ctx, 200, 80, 100, 14, '#6a6458')
    for (let x = 200; x < 300; x += 8) px(ctx, x, 76, 5, 4, '#6a6458')
  }),

  sp('s9_alone', '하늘에 닿은 가을 풀길을 홀로', 24, S9_ROAD, (ctx, env) => {
    for (let k = 0; k < 40; k++) {
      const x = 104 + hash(k * 1.9) * 200
      const y = S9_WATER - 3 + hash(k * 2.9) * 18
      for (let i = 0; i < 4; i++) dot(ctx, x + Math.sin(env.t + k) * (i / 4), y - i, '#b8a060')
    }
    for (let t = 0; t <= 1; t += 0.01) px(ctx, 130 + t * 160, 112 - t * 14, 2 - t, 1, '#c8b88a')
    const f = mod(env.t * 0.02, 1)
    person(ctx, 140 + f * 120, 104 - f * 12, '#6a5a7a')
  }),
  sp('s9_group', '여럿이 함께', 24, S9_ROAD, (ctx) => {
    for (let k = 0; k < 4; k++) person(ctx, 180 + k * 8, 100, OTHER_PALS[k].R)
  }),
  sp('s9_horse', '말 타고', 24, S9_ROAD, (ctx) => {
    px(ctx, 200, 104, 12, 5, '#6a4a32')
    person(ctx, 204, 96, '#6a5a7a')
  }),
]

// ════════════════════════════════════════════════════════════
// 張繼〈山家〉: 널다리·한낮의 닭·차 덖는 연기·곡식 말리는 마당
// ════════════════════════════════════════════════════════════
const SA_GROUND = 128
const SA_HOUSE = { x: 150, y: 100 }
const SA_BRIDGE = { x0: 40, x1: 96, y: 142 }

export const shanjiaBackground: Background = {
  id: 'hy125',
  drawBack(ctx) {
    sky(ctx, ['#b8c8d4', '#c8d4da', '#d8e0dc'], SA_GROUND)
    ridge(ctx, (x) => 76 + 14 * Math.sin(x * 0.018 + 1.6), '#8aa08e', '#96ac9a', 0, W, SA_GROUND)
    px(ctx, 0, SA_GROUND, W, H - SA_GROUND, '#8a9a62')
    fillRows(ctx, SA_GROUND, H, (y) => [60 + Math.sin(y * 0.2) * 4, 76 + Math.sin(y * 0.2) * 4], '#8ab0bc')
    for (let r = 0; r < 7; r++) px(ctx, SA_HOUSE.x + 3 - r, SA_HOUSE.y + r, 46 + r * 2, 1, r < 2 ? '#b89b5e' : '#a3864d')
    px(ctx, SA_HOUSE.x - 3, SA_HOUSE.y + 7, 56, 1, '#7d653a')
    px(ctx, SA_HOUSE.x - 1, SA_HOUSE.y + 8, 52, 20, '#d9ccab')
    px(ctx, SA_HOUSE.x + 20, SA_HOUSE.y + 14, 8, 14, '#5f4630')
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    for (let k = 0; k < 6; k++) px(ctx, 62 + Math.sin(k) * 3, SA_GROUND + mod(k * 9 + env.t * 12, 52), 2, 1, '#d8eaf0')
  },
}

const SA_BRIDGE_F = { x: 8, y: 104, w: 128, h: 72 }
const SA_ROOF = { x: 128, y: 64, w: 96, h: 54 }
const SA_SMOKE = { x: 176, y: 48, w: 128, h: 81 }
const SA_YARD = { x: 192, y: 112, w: 128, h: 68 }

export const SHANJIA_SPRITES = [
  sp('sa_bridge', '샘물 소리 나는 널다리를 건너는 사람', 22, SA_BRIDGE_F, (ctx, env) => {
    px(ctx, SA_BRIDGE.x0, SA_BRIDGE.y, SA_BRIDGE.x1 - SA_BRIDGE.x0, 3, '#8a6a48')
    for (let x = SA_BRIDGE.x0; x < SA_BRIDGE.x1; x += 6) px(ctx, x, SA_BRIDGE.y, 1, 3, '#6a4a32')
    for (const x of [SA_BRIDGE.x0 + 4, SA_BRIDGE.x1 - 6]) px(ctx, x, SA_BRIDGE.y + 3, 2, 10, '#5a3e2a')
    const f = mod(env.t * 0.06, 1)
    person(ctx, SA_BRIDGE.x0 + f * (SA_BRIDGE.x1 - SA_BRIDGE.x0), SA_BRIDGE.y - 8, '#4b5068', { step: Math.sin(env.t * 6) })
    soundArcs(ctx, 68, SA_BRIDGE.y + 12, env.t, '#4a6a7a', 16)
  }),
  sp('sa_stone', '돌다리', 22, SA_BRIDGE_F, (ctx) => {
    for (let a = 0; a <= Math.PI; a += 0.02) px(ctx, 68 - Math.cos(a) * 26, SA_BRIDGE.y + 4 - Math.sin(a) * 8, 3, 3, '#8a8478')
  }),
  sp('sa_boat', '나룻배', 22, SA_BRIDGE_F, (ctx) => boat(ctx, 68, SA_BRIDGE.y + 10, { len: 18 })),

  sp('sa_rooster', '한낮 띠 처마의 닭 울음', 24, SA_ROOF, (ctx, env) => {
    sun(ctx, 170, 24, 7)
    const x = SA_HOUSE.x + 12
    const y = SA_HOUSE.y - 6
    px(ctx, x, y, 7, 5, '#e8e2d0')
    px(ctx, x + 5, y - 3, 3, 4, '#e8e2d0')
    px(ctx, x + 6, y - 5, 2, 2, '#c0302a')
    dot(ctx, x + 8, y - 2, '#d8a040')
    px(ctx, x - 3, y - 2, 3, 4, '#3a5a3a')
    soundArcs(ctx, x + 9, y - 2, env.t * 2, '#5d4a37', 14)
  }),
  sp('sa_dog', '개 짖는 소리', 24, SA_ROOF, (ctx, env) => {
    px(ctx, SA_HOUSE.x - 14, SA_GROUND - 6, 9, 5, '#8a6a4a')
    if (Math.sin(env.t * 7) > 0) soundArcs(ctx, SA_HOUSE.x - 14, SA_GROUND - 6, env.t, '#5d4a37', 10)
  }),
  sp('sa_bell', '절의 종소리', 24, SA_ROOF, (ctx, env) => soundArcs(ctx, 180, 70, env.t, '#5d4a37', 24)),

  sp('sa_tea', '자욱한 차 덖는 연기', 20, SA_SMOKE, (ctx, env) => {
    px(ctx, SA_HOUSE.x + 54, SA_GROUND - 8, 12, 8, '#5a4a3a')
    px(ctx, SA_HOUSE.x + 52, SA_GROUND - 10, 16, 2, '#3a3028')
    for (let k = 0; k < 10; k++) {
      const f = mod(env.t * 0.12 + k / 10, 1)
      withAlpha(ctx, 0.55 * (1 - f), () => disc(ctx, SA_HOUSE.x + 60 + f * 30 + Math.sin(f * 6 + k) * 4, SA_GROUND - 12 - f * 70, 4 + f * 9, '#c8c8c0'))
    }
  }),
  sp('sa_fire', '불난 연기', 20, SA_SMOKE, (ctx, env) => {
    for (let k = 0; k < 5; k++) if (Math.sin(env.t * 8 + k) > -0.3) px(ctx, SA_HOUSE.x + 10 + k * 6, SA_HOUSE.y - 4, 3, 6, '#e8702a')
  }),
  sp('sa_fog', '산안개', 20, SA_SMOKE, (ctx, env) => mistBands(ctx, env.t, [70, 80, 90], '#f4f4f0', 0.7)),

  sp('sa_grain', '날이 개어 말리는 곡식', 22, SA_YARD, (ctx) => {
    for (let k = 0; k < 3; k++) {
      const x = 214 + k * 32
      px(ctx, x, 146 + (k % 2) * 8, 26, 10, '#a8864a')
      for (let i = 0; i < 40; i++) dot(ctx, x + 1 + hash(i + k * 50) * 24, 147 + (k % 2) * 8 + hash(i * 3 + k) * 8, i % 2 ? '#e8c860' : '#d8b048')
    }
    withAlpha(ctx, 0.12, () => px(ctx, 0, 0, W, H, '#fff0b0'))
  }),
  sp('sa_rain', '쏟아지는 비', 22, SA_YARD, (ctx, env) => rain(ctx, env.t, 80, 140, 'rgba(140,150,165,0.7)')),
  sp('sa_snow', '내리는 눈', 22, SA_YARD, (ctx, env) => snowfall(ctx, env.t, 70)),
]

// ════════════════════════════════════════════════════════════
// 張繼〈歸山〉: 흰 머리와 푸른 산, 눈 기다리는 빈 숲의 옛길
// ════════════════════════════════════════════════════════════
const GS_GROUND = 134
const gsMountain = (x: number) => 54 + Math.abs(x - 176) * 0.5 + 4 * Math.sin(x * 0.1)
const gsRoad = (t: number) => ({ x: 120 + t * 80 + Math.sin(t * 7) * 14, y: 178 - t * 66 })
const GS_TREES = [20, 40, 62, 84, 250, 274, 298]

/** 지팡이 짚은 흰머리 노인 */
function oldMan(ctx: Ctx, x: number, y: number, s: number, env: Env) {
  standFig(ctx, x, y, pal({ B: '#e8e8e4', H: '#e8e8e4', K: '#c8c8c4', R: '#6a6a72', r: '#4e4e56' }), false, s)
  if (s >= 1) for (let i = 0; i < 5; i++) dot(ctx, x + 2 - i - Math.round(Math.sin(env.t * 3 + i)), y + 2 + i * 0.4, '#f4f4f0')
  px(ctx, x + 14 * s, y + 6 * s, 1, 16 * s, '#6a4a32')
}

export const guishanBackground: Background = {
  id: 'hy126',
  drawBack(ctx) {
    sky(ctx, ['#a8acb4', '#b8bcc0', '#c8c8c4'], GS_GROUND)
    ridge(ctx, gsMountain, '#6a8478', '#768e84', 60, 300, GS_GROUND)
    ridge(ctx, (x) => 112 + 6 * Math.sin(x * 0.03), '#6a706a', '#747a74', 0, W, GS_GROUND)
    px(ctx, 0, GS_GROUND, W, H - GS_GROUND, '#7a7a68')
    for (let t = 0; t <= 1; t += 0.004) {
      const p = gsRoad(t)
      px(ctx, p.x - 3 + t * 2, p.y, 6 - t * 4, 1, '#a89a7a')
    }
    for (const x of GS_TREES) {
      px(ctx, x - 1, GS_GROUND - 40, 3, 40, '#4a3e34')
      for (const [dx, dy] of [[-8, -34], [8, -38], [-6, -24], [6, -28]] as const) for (let i = 0; i < 9; i++) dot(ctx, x + (dx * i) / 9, GS_GROUND + dy + 8 - i * 0.8, '#4a3e34')
    }
  },
  drawFront() {},
  drawDynamic() {},
}

const GS_NEAR = { x: 104, y: 112, w: 96, h: 54 }
const GS_MT = { x: 64, y: 32, w: 224, h: 108 }
const GS_WOOD = { x: 0, y: 72, w: 320, h: 108 }
const GS_ROAD = { x: 96, y: 96, w: 128, h: 72 }

export const GUISHAN_SPRITES = [
  sp('gs_hair', '흰 머리 몇 올의 마음', 22, GS_NEAR, (ctx, env) => {
    if (env.fx.gsFar) return
    oldMan(ctx, 140, 140, 1, env)
  }),
  sp('gs_crown', '금관', 22, GS_NEAR, (ctx) => {
    standFig(ctx, 140, 140, pal())
    px(ctx, 142, 138, 10, 3, '#e8c048')
  }),
  sp('gs_brush', '붓 한 자루', 22, GS_NEAR, (ctx) => {
    standFig(ctx, 140, 140, pal())
    px(ctx, 156, 148, 1, 8, '#6a4a32')
  }),

  sp('gs_mountain', '푸른 산 한 조각의 생애', 12, GS_MT, (ctx) => {
    ridge(ctx, gsMountain, '#3e7a64', '#4e8a72', 60, 300, GS_GROUND)
    for (let k = 0; k < 20; k++) {
      const x = 90 + hash(k * 2.1) * 170
      const top = gsMountain(x)
      pine(ctx, x, top + 14 + hash(k * 3.3) * 30, 0.5, 0, { dark: '#2e5a46', base: '#3a6a52', light: '#4a7a60' })
    }
  }),
  sp('gs_mansion', '큰 저택', 12, GS_MT, (ctx) => {
    house(ctx, 150, 100)
    house(ctx, 178, 102)
  }),
  sp('gs_boat', '배 한 척', 12, GS_MT, (ctx) => {
    px(ctx, 110, 124, 140, 8, '#8a9aa4')
    boat(ctx, 180, 128, { len: 24 })
  }),

  sp('gs_snow', '빈 숲에서 기다리는 눈', 14, GS_WOOD, (ctx, env) => {
    for (const x of GS_TREES) for (const [dx, dy] of [[-8, -34], [8, -38], [-6, -24], [6, -28]] as const) px(ctx, x + dx - 2, GS_GROUND + dy, 5, 2, '#f4f6f6')
    withAlpha(ctx, 0.7, () => px(ctx, 0, GS_GROUND, W, H - GS_GROUND, '#e8ecee'))
    ridge(ctx, (x) => gsMountain(x) + 2, '#f4f6f6', undefined, 140, 212, 70)
    snowfall(ctx, env.t * 0.5, 30)
  }),
  sp('gs_bloom', '핀 꽃', 14, GS_WOOD, (ctx) => {
    for (const x of GS_TREES) for (let k = 0; k < 6; k++) disc(ctx, x - 8 + k * 3, GS_GROUND - 34 + (k % 2) * 6, 1, '#f2b8c6')
  }),
  sp('gs_people', '마중 나온 사람들', 14, GS_WOOD, (ctx) => {
    for (let k = 0; k < 4; k++) person(ctx, 250 + k * 12, GS_GROUND - 8, OTHER_PALS[k].R)
  }),

  sp('gs_alone', '아무도 없는 옛길을 홀로 돌아감', 24, GS_ROAD, (ctx, env) => {
    const t = 0.35 + mod(env.t * 0.015, 0.5)
    const p = gsRoad(t)
    const s = 1 - t * 0.6
    oldMan(ctx, p.x - 7 * s, p.y - 22 * s, s, env)
  }, { fx: { gsFar: 1 } }),
  sp('gs_group', '여럿이 함께', 24, GS_ROAD, (ctx) => {
    for (let k = 0; k < 4; k++) {
      const p = gsRoad(0.4 + k * 0.05)
      person(ctx, p.x, p.y - 8, OTHER_PALS[k].R)
    }
  }),
  sp('gs_cart', '수레를 타고', 24, GS_ROAD, (ctx) => {
    const p = gsRoad(0.5)
    px(ctx, p.x - 8, p.y - 10, 16, 8, '#8a6a48')
    disc(ctx, p.x, p.y - 2, 3, '#4a3424')
  }),
]

