// 『唐詩畫意』 卷九 다섯째 묶음 (1): 司空圖〈獨望〉〈河上〉〈即事〉 두 수, 高中丞〈漁家〉
import type { Background } from '../types'
import { H, W, disc, dot, fillRows, hash, mod, px } from '../pixel'
import type {  } from '../pixel'
import { AUTUMN, broadTree, flower, house, hut, mistBands, person, rain, ridge, sky, snowfall, withAlpha } from '../kit'
import { OTHER_PALS, pal, seatFig, standFig } from '../figures'
import { grasses, gull, shimmer, skiff, soundArcs, sp, stone, sun, water } from './hy_kit'

const FULL = { x: 0, y: 0, w: 320, h: 180 }
const HERMIT = pal({ R: '#8a8a72', r: '#6a6a56', K: '#5a5a4a' })

// ════════════════════════════════════════════════════════════
// 司空圖〈獨望〉: 마을과 밭둑길과 먼 언덕
// ════════════════════════════════════════════════════════════
const DW_GROUND = 120
const DW_HOUSES = [24, 54, 84]
const dwSlope = (x: number) => 118 - Math.max(0, x - 170) * 0.22
const DW_PATHS = [0, 1, 2].map((k) => (x: number) => 138 + k * 14 + Math.sin(x * 0.03 + k) * 3)

export const duwangBackground: Background = {
  id: 'hy108',
  drawBack(ctx) {
    sky(ctx, ['#c0d0dc', '#ccdae0', '#d8e2e0'], DW_GROUND)
    ridge(ctx, (x) => 92 + 8 * Math.sin(x * 0.02 + 1), '#a4b4ac', '#aebeb6', 0, W, DW_GROUND)
    ridge(ctx, dwSlope, '#a8a07a', '#b4ac86', 160, W, DW_GROUND + 2)
    px(ctx, 0, DW_GROUND, W, H - DW_GROUND, '#8a9a62')
    for (const f of DW_PATHS) for (let x = 0; x < W; x++) dot(ctx, x, f(x), '#b8a878')
    for (const x of DW_HOUSES) house(ctx, x, 104)
    fillRows(ctx, 128, 140, (y) => [210 + Math.abs(y - 134) * 3, 300 - Math.abs(y - 134) * 3], '#8ab0bc')
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    shimmer(ctx, env.t, 129, 139, 4, '#e4eeee', 216, 294)
  },
}

const DW_VILLAGE = { x: 0, y: 72, w: 128, h: 72 }
const DW_PATH_F = { x: 32, y: 124, w: 144, h: 56 }
const DW_SLOPE = { x: 160, y: 72, w: 160, h: 72 }

export const DUWANG_SPRITES = [
  sp('dw_trees', '푸른 나무에 싸여 어둑한 마을', 14, DW_VILLAGE, (ctx) => {
    for (let k = 0; k < 9; k++) broadTree(ctx, 10 + k * 13, 104 + (k % 2) * 16, 1.1 + (k % 3) * 0.15, { dark: '#2e4a2a', base: '#3e5e36', light: '#507244' })
  }),
  sp('dw_lights', '등불 환한 마을', 14, DW_VILLAGE, (ctx) => {
    for (const x of DW_HOUSES) px(ctx, x + 12, 111, 4, 4, '#ffcf6a')
  }),
  sp('dw_snow', '눈 덮인 마을', 14, DW_VILLAGE, (ctx) => {
    for (const x of DW_HOUSES) px(ctx, x, 103, 28, 3, '#f4f6f6')
  }),

  sp('dw_yellow', '밭둑길에 드문드문 핀 노란 꽃', 12, DW_PATH_F, (ctx) => {
    for (let k = 0; k < 18; k++) {
      const f = DW_PATHS[k % 3]
      const x = 36 + hash(k * 2.7) * 136
      flower(ctx, x, f(x) - 2, '#f0c838', '#c88a2a')
    }
  }),
  sp('dw_red', '붉은 꽃 가득한 길', 12, DW_PATH_F, (ctx) => {
    for (let k = 0; k < 50; k++) {
      const f = DW_PATHS[k % 3]
      const x = 36 + hash(k * 2.7) * 136
      flower(ctx, x, f(x) - 2, '#d8403a', '#f4d060')
    }
  }),
  sp('dw_stones', '흩어진 돌', 12, DW_PATH_F, (ctx) => {
    for (let k = 0; k < 10; k++) stone(ctx, 40 + k * 13, DW_PATHS[k % 3](40 + k * 13), 2, '#a8a49a', '#8a867a')
  }),

  sp('dw_grass', '먼 언덕의 푸른 봄풀', 10, DW_SLOPE, (ctx) => {
    ridge(ctx, dwSlope, '#7aac56', '#8abc62', 160, W, DW_GROUND + 2)
    for (let k = 0; k < 40; k++) {
      const x = 162 + hash(k * 1.9) * 156
      dot(ctx, x, dwSlope(x) + 1 + hash(k * 3.1) * 4, '#a4d07a')
    }
  }),
  sp('dw_maple', '붉은 단풍 언덕', 10, DW_SLOPE, (ctx) => {
    for (let k = 0; k < 8; k++) broadTree(ctx, 180 + k * 18, 114, 0.8, AUTUMN)
  }),
  sp('dw_sand', '누런 모래 언덕', 10, DW_SLOPE, (ctx) => ridge(ctx, dwSlope, '#d8c088', '#e4cc94', 160, W, DW_GROUND + 2)),

  sp('dw_birds', '아직도 날고 있는 물새', 24, DW_SLOPE, (ctx, env) => {
    for (let k = 0; k < 4; k++) {
      const f = mod(env.t * 0.06 + k / 4, 1)
      const x = 300 - f * 120
      const y = 100 + Math.sin(f * 6 + k) * 6 - k * 3
      const up = Math.sin(env.t * 6 + k) > 0
      px(ctx, x - 3, y, 6, 2, '#f4f2ec')
      px(ctx, x - 4, up ? y - 2 : y + 2, 3, 1, '#d8d4cc')
      px(ctx, x + 1, up ? y - 2 : y + 2, 3, 1, '#d8d4cc')
    }
  }),
  sp('dw_kite', '종이 연', 24, DW_SLOPE, (ctx) => {
    fillRows(ctx, 84, 96, (y) => [240 - (6 - Math.abs(y - 90)), 240 + (6 - Math.abs(y - 90))], '#e8c048')
  }),
  sp('dw_butterfly', '나비', 24, DW_SLOPE, (ctx, env) => {
    const o = Math.sin(env.t * 10) > 0
    const x = 240 + Math.sin(env.t) * 20
    px(ctx, x - (o ? 3 : 1), 100, o ? 3 : 1, 2, '#f4e060')
    px(ctx, x + 1, 100, o ? 3 : 1, 2, '#f4e060')
  }),
]

// ════════════════════════════════════════════════════════════
// 司空圖〈河上〉: 비 갠 저녁의 강마을
// ════════════════════════════════════════════════════════════
const HS_WATER = 118
const hsShore = (y: number): [number, number] => [0, 170 - (y - HS_WATER) * 0.8]

export const heshangBackground: Background = {
  id: 'hy109',
  drawBack(ctx) {
    sky(ctx, ['#a8b4c0', '#b8c0c4', '#cccabc'], HS_WATER)
    ridge(ctx, (x) => 100 + 6 * Math.sin(x * 0.025 + 0.5), '#8a9490', '#96a09c', 0, W, HS_WATER)
    water(ctx, HS_WATER, H, '#9aaab0', '#7a8e98', '#bcc8cc')
    fillRows(ctx, 108, H, hsShore, '#8a8a5a')
    fillRows(ctx, 114, 126, (y) => [180 - (y - 114) * 0.4, 300 + (y - 114) * 0.4], '#c8bc98')
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    shimmer(ctx, env.t, HS_WATER + 10, 178, 12, '#d8e4e4', 150, W)
  },
}

const HS_FIELD = { x: 0, y: 96, w: 160, h: 84 }
const HS_VILLAGE = { x: 176, y: 84, w: 128, h: 54 }

export const HESHANG_SPRITES = [
  sp('hs_clear', '비가 막 갠 하늘', 6, FULL, (ctx, env) => {
    for (const [x, y, w] of [[10, 18, 70], [180, 12, 60], [100, 26, 50]] as const) {
      const o = Math.sin(env.t * 0.1) * 6
      px(ctx, x + o, y, w, 6, '#e8ecf0')
      px(ctx, x + 6 + o, y - 3, w - 12, 3, '#f4f6f8')
    }
    withAlpha(ctx, 0.15, () => px(ctx, 0, 0, W, HS_WATER, '#f4f0e0'))
    for (let k = 0; k < 20; k++) if (Math.sin(env.t * 2 + k) > 0.6) dot(ctx, 10 + hash(k * 2.3) * 150, 110 + hash(k * 3.7) * 60, '#ffffff')
  }),
  sp('hs_rain', '장대비', 6, FULL, (ctx, env) => rain(ctx, env.t, 80, 140, 'rgba(140,150,165,0.7)')),
  sp('hs_snow', '함박눈', 6, FULL, (ctx, env) => snowfall(ctx, env.t, 70)),

  sp('hs_grain', '석양 아래 환한 벼와 기장', 12, HS_FIELD, (ctx, env) => {
    sun(ctx, 30, 98, 7, '#f0a050', '#f8c890')
    for (let y = 112; y < H; y += 3) {
      const [, b] = hsShore(y)
      for (let x = 4; x < b - 4; x += 4) {
        const sway = Math.sin(env.t * 1.5 + x * 0.1) * 0.8
        px(ctx, x + sway, y - 3, 1, 3, y % 2 ? '#d8b050' : '#c8a040')
        dot(ctx, x + sway, y - 4, '#f0d070')
      }
    }
  }),
  sp('hs_flowers', '꽃밭', 12, HS_FIELD, (ctx) => {
    for (let k = 0; k < 40; k++) flower(ctx, 6 + hash(k * 1.7) * 140, 116 + hash(k * 2.9) * 60, '#e88aa0', '#f4d060')
  }),
  sp('hs_reed', '갈대', 12, HS_FIELD, (ctx, env) => grasses(ctx, 0, 150, H, env, '#b8a870', 60, 16)),

  sp('hs_village', '물과 나란한 모래 마을', 20, HS_VILLAGE, (ctx, env) => {
    for (let k = 0; k < 5; k++) {
      const x = 190 + k * 20
      for (let r = 0; r < 4; r++) px(ctx, x + 2 - r, 108 + r, 14 + r * 2, 1, '#a88a5a')
      px(ctx, x, 112, 14, 6, '#d8ccb0')
      px(ctx, x + 5, 114, 3, 4, '#6a5a44')
    }
    for (let k = 0; k < 3; k++) {
      px(ctx, 200 + k * 30, 122, 1, 5, '#5a4632')
      for (let i = 0; i < 8; i++) dot(ctx, 196 + k * 30 + i, 120 + Math.sin(i + env.t) * 0.5, '#8a8a7a')
    }
  }),
  sp('hs_hill', '산꼭대기 마을', 20, HS_VILLAGE, (ctx) => {
    fillRows(ctx, 84, 116, (y) => [240 - (y - 84), 240 + (y - 84)], '#7a8a6a')
    hut(ctx, 230, 80)
  }),
  sp('hs_city', '높은 성안', 20, HS_VILLAGE, (ctx) => {
    px(ctx, 186, 100, 110, 18, '#8a8274')
    for (let x = 186; x < 296; x += 8) px(ctx, x, 96, 5, 4, '#8a8274')
  }),

  sp('hs_gull', '어부 골목의 갈매기 소리', 24, HS_VILLAGE, (ctx, env) => {
    for (let k = 0; k < 4; k++) {
      const x = 196 + k * 22 + Math.sin(env.t * 0.5 + k) * 8
      const y = 94 + Math.sin(env.t * 0.8 + k * 2) * 4
      const up = Math.sin(env.t * 5 + k) > 0
      px(ctx, x - 2, y, 5, 2, '#f4f2ec')
      px(ctx, x - 4, up ? y - 2 : y + 1, 3, 1, '#c8c4bc')
      px(ctx, x + 2, up ? y - 2 : y + 1, 3, 1, '#c8c4bc')
    }
    soundArcs(ctx, 240, 96, env.t * 1.2, '#5d4a37', 18)
    gull(ctx, 270, 128)
  }),
  sp('hs_rooster', '닭 우는 소리', 24, HS_VILLAGE, (ctx, env) => {
    px(ctx, 230, 118, 6, 5, '#e8e2d0')
    px(ctx, 234, 115, 3, 4, '#e8e2d0')
    soundArcs(ctx, 238, 117, env.t * 2, '#5d4a37', 12)
  }),
  sp('hs_anvil', '다듬이 소리', 24, HS_VILLAGE, (ctx, env) => soundArcs(ctx, 240, 116, env.t * 1.5, '#5d4a37', 18)),
]

// ════════════════════════════════════════════════════════════
// 司空圖〈即事〉(茶爽添詩句): 차와 학과 빈 숲
// ════════════════════════════════════════════════════════════
const CH_GROUND = 136
const CH_MAN = { x: 104, y: 120 }
const CH_CRANE = { x: 214, y: 150 }

export const jishi1Background: Background = {
  id: 'hy110',
  drawBack(ctx) {
    sky(ctx, ['#c4c8cc', '#ced0ce', '#d8d8d0'], CH_GROUND)
    ridge(ctx, (x) => 100 + 10 * Math.sin(x * 0.02 + 2), '#a8b0a4', '#b2bab0', 0, W, CH_GROUND)
    px(ctx, 0, CH_GROUND, W, H - CH_GROUND, '#8a9a6a')
    hut(ctx, 140, 118)
    seatFig(ctx, CH_MAN.x, CH_MAN.y, HERMIT)
  },
  drawFront() {},
  drawDynamic() {},
}

const CH_MAN_F = { x: 72, y: 100, w: 96, h: 54 }
const CH_CRANE_F = { x: 168, y: 112, w: 96, h: 54 }

export const JISHI1_SPRITES = [
  sp('ch_tea', '시구를 더해 주는 상쾌한 차', 24, CH_MAN_F, (ctx, env) => {
    px(ctx, CH_MAN.x + 18, CH_GROUND - 6, 8, 6, '#8a8a7a')
    px(ctx, CH_MAN.x + 25, CH_GROUND - 5, 3, 1, '#8a8a7a')
    px(ctx, CH_MAN.x + 30, CH_GROUND - 3, 4, 3, '#dcd2bb')
    for (let k = 0; k < 3; k++) {
      const f = mod(env.t * 0.4 + k / 3, 1)
      withAlpha(ctx, 0.7 * (1 - f), () => dot(ctx, CH_MAN.x + 32 + Math.sin(f * 6 + k) * 2, CH_GROUND - 5 - f * 14, '#f4f4f0'))
    }
    px(ctx, CH_MAN.x - 14, CH_GROUND - 4, 12, 4, '#f4f0e0')
    for (let c = 0; c < 3; c++) px(ctx, CH_MAN.x - 12 + c * 4, CH_GROUND - 3, 1, 2, '#1f1d22')
  }),
  sp('ch_wine', '향기로운 술', 24, CH_MAN_F, (ctx) => {
    px(ctx, CH_MAN.x + 20, CH_GROUND - 10, 7, 10, '#8a5a3a')
    px(ctx, CH_MAN.x + 21, CH_GROUND - 12, 5, 2, '#6a4a32')
  }),
  sp('ch_incense', '피어오르는 향', 24, CH_MAN_F, (ctx, env) => {
    px(ctx, CH_MAN.x + 20, CH_GROUND - 4, 6, 4, '#8a6a3a')
    for (let k = 0; k < 4; k++) dot(ctx, CH_MAN.x + 23 + Math.sin(env.t + k) * 2, CH_GROUND - 6 - k * 4, '#c8c8d0')
  }),

  sp('ch_clear', '맑게 갠 하늘', 6, FULL, (ctx) => sky(ctx, ['#7ab0d8', '#94c0de', '#b0d0e2', '#c8dce0'], CH_GROUND - 30)),
  sp('ch_cloudy', '흐린 하늘', 6, FULL, (ctx) => {
    for (const [x, y, w] of [[0, 10, 160], [120, 26, 200]] as const) px(ctx, x, y, w, 14, '#9aa0a4')
  }),
  sp('ch_glow', '노을 진 하늘', 6, FULL, (ctx) => withAlpha(ctx, 0.35, () => px(ctx, 0, 0, W, CH_GROUND, '#e8804a'))),

  sp('ch_crane', '남겨 둔 학 한 마리', 22, CH_CRANE_F, (ctx, env) => {
    const { x, y } = CH_CRANE
    px(ctx, x, y - 10, 1, 10, '#3a3530')
    px(ctx, x + 3, y - 10, 1, 10, '#3a3530')
    px(ctx, x - 3, y - 16, 10, 6, '#f6f4ee')
    px(ctx, x - 5, y - 14, 3, 3, '#2a2622')
    const bob = Math.sin(env.t * 0.8) > 0.6 ? 1 : 0
    px(ctx, x + 5, y - 26 + bob, 2, 11, '#f6f4ee')
    px(ctx, x + 5, y - 22 + bob, 2, 4, '#2a2622')
    px(ctx, x + 5, y - 29 + bob, 3, 3, '#f6f4ee')
    dot(ctx, x + 6, y - 30 + bob, '#d83a2a')
    px(ctx, x + 8, y - 28 + bob, 4, 1, '#c8a441')
  }),
  sp('ch_dog', '개 한 마리', 22, CH_CRANE_F, (ctx) => {
    px(ctx, CH_CRANE.x - 4, CH_CRANE.y - 8, 10, 5, '#8a6a4a')
    px(ctx, CH_CRANE.x + 4, CH_CRANE.y - 11, 4, 4, '#8a6a4a')
  }),
  sp('ch_horse', '말 한 필', 22, CH_CRANE_F, (ctx) => {
    px(ctx, CH_CRANE.x - 8, CH_CRANE.y - 14, 18, 7, '#8a6a4a')
    px(ctx, CH_CRANE.x + 8, CH_CRANE.y - 20, 4, 8, '#8a6a4a')
  }),

  sp('ch_forest', '그 밖의 빈 숲', 10, FULL, (ctx) => {
    for (let k = 0; k < 16; k++) {
      const x = 8 + k * 20 + (k % 2) * 4
      if (x > 128 && x < 196) continue
      const h = 50 + hash(k) * 30
      px(ctx, x, CH_GROUND - h, 3, h, '#6a5a48')
      for (let i = 0; i < 4; i++) for (let j = 0; j < 10; j++) dot(ctx, x + 1 + (i % 2 ? j : -j) * 0.8, CH_GROUND - h + 10 + i * 10 - j * 0.6, '#6a5a48')
    }
  }),
  sp('ch_market', '북적이는 시장', 10, FULL, (ctx) => {
    for (let k = 0; k < 4; k++) {
      px(ctx, 220 + k * 24, CH_GROUND - 12, 20, 3, ['#b2352a', '#d9a441', '#4f6b4a', '#6b5a7a'][k])
      person(ctx, 228 + k * 24, CH_GROUND - 8, OTHER_PALS[k].R)
    }
  }),
  sp('ch_village', '이웃 마을', 10, FULL, (ctx) => {
    for (let k = 0; k < 3; k++) house(ctx, 220 + k * 30, CH_GROUND - 14)
  }),
]

// ════════════════════════════════════════════════════════════
// 司空圖〈即事〉(幽鳥穿籬去): 울타리·못·부처님 앞의 꽃
// ════════════════════════════════════════════════════════════
const JI_GROUND = 130
const JI_FENCE = { x0: 16, x1: 110, y: 112 }
const JI_POOL = { x: 170, y: 152 }
const JI_SHRINE = { x: 252, y: 98 }
const jiPool = (y: number): [number, number] => {
  const d = (y - JI_POOL.y) / 12
  const w = 52 * Math.sqrt(Math.max(0, 1 - d * d))
  return [JI_POOL.x - w, JI_POOL.x + w]
}

export const jishi2Background: Background = {
  id: 'hy111',
  drawBack(ctx) {
    sky(ctx, ['#bcccd4', '#c8d6da', '#d6dfdc'], JI_GROUND)
    ridge(ctx, (x) => 92 + 12 * Math.sin(x * 0.02 + 1), '#98ac9c', '#a4b8a8', 0, W, JI_GROUND)
    px(ctx, 0, JI_GROUND, W, H - JI_GROUND, '#8a9a6a')
    for (let x = JI_FENCE.x0; x < JI_FENCE.x1; x += 5) if (x < 58 || x > 66) px(ctx, x, JI_FENCE.y, 1, 20, '#7a6448')
    px(ctx, JI_FENCE.x0, JI_FENCE.y + 6, JI_FENCE.x1 - JI_FENCE.x0, 1, '#6a5438')
    fillRows(ctx, JI_POOL.y - 12, JI_POOL.y + 12, jiPool, '#7aa0a8')
    // 작은 불당
    px(ctx, JI_SHRINE.x - 20, JI_SHRINE.y + 8, 40, 30, '#c9bfa5')
    px(ctx, JI_SHRINE.x - 26, JI_SHRINE.y, 52, 8, '#3c4048')
    px(ctx, JI_SHRINE.x - 22, JI_SHRINE.y - 2, 44, 2, '#4a4f57')
    px(ctx, JI_SHRINE.x - 8, JI_SHRINE.y + 14, 16, 24, '#3a3028')
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    shimmer(ctx, env.t, JI_POOL.y - 8, JI_POOL.y + 10, 6, '#d8e8e8', JI_POOL.x - 44, JI_POOL.x + 44)
  },
}

const JI_FENCE_F = { x: 0, y: 84, w: 128, h: 72 }
const JI_PATH = { x: 0, y: 112, w: 128, h: 68 }
const JI_POOL_F = { x: 104, y: 112, w: 128, h: 68 }
const JI_SHRINE_F = { x: 200, y: 80, w: 112, h: 72 }

export const JISHI2_SPRITES = [
  sp('ji_bird', '울타리를 뚫고 가는 그윽한 새', 22, JI_FENCE_F, (ctx, env) => {
    const f = mod(env.t * 0.25, 1)
    const x = 20 + f * 100
    const y = 118 - Math.sin(f * Math.PI) * 14
    const up = Math.sin(env.t * 10) > 0
    px(ctx, x - 2, y, 5, 3, '#4a5a7a')
    dot(ctx, x + 3, y, '#d8a040')
    px(ctx, x - 3, up ? y - 2 : y + 3, 4, 1, '#3a4a6a')
  }),
  sp('ji_cat', '울타리를 지나는 고양이', 22, JI_FENCE_F, (ctx) => {
    px(ctx, 56, 126, 10, 5, '#8a8a8a')
    px(ctx, 64, 122, 5, 5, '#8a8a8a')
  }),
  sp('ji_dog', '울타리를 지나는 강아지', 22, JI_FENCE_F, (ctx) => {
    px(ctx, 56, 124, 10, 6, '#a8864a')
    px(ctx, 64, 121, 5, 5, '#a8864a')
  }),

  sp('ji_herb', '약을 캐고 돌아오는 이웃 노인', 24, JI_PATH, (ctx, env) => {
    const x = 80 - mod(env.t * 4, 30)
    standFig(ctx, x, 136, pal({ B: '#d8d4c8', H: '#d8d4c8', R: '#8a7a55', r: '#665a3e' }), true)
    px(ctx, x + 12, 144, 7, 8, '#a8864a')
    for (let i = 0; i < 4; i++) dot(ctx, x + 13 + i, 143, '#5a9a4a')
    px(ctx, x - 2, 140, 1, 18, '#6a4a32')
  }),
  sp('ji_wood', '나무를 하고 오는 노인', 24, JI_PATH, (ctx) => {
    standFig(ctx, 60, 136, pal({ B: '#d8d4c8', H: '#d8d4c8' }), true)
    for (let k = 0; k < 3; k++) px(ctx, 70, 138 + k * 2, 16, 1, '#8a6a48')
  }),
  sp('ji_fish', '낚시하고 오는 노인', 24, JI_PATH, (ctx) => {
    standFig(ctx, 60, 136, pal({ B: '#d8d4c8', H: '#d8d4c8' }), true)
    px(ctx, 56, 128, 1, 26, '#5a4632')
  }),

  sp('ji_cloud', '못 밑에서 솟는 구름', 12, JI_POOL_F, (ctx, env) => {
    ctx.save()
    ctx.beginPath()
    ctx.ellipse(JI_POOL.x, JI_POOL.y, 51, 11, 0, 0, Math.PI * 2)
    ctx.clip()
    for (let k = 0; k < 4; k++) {
      const x = JI_POOL.x - 40 + k * 26 + Math.sin(env.t * 0.3 + k) * 4
      px(ctx, x, JI_POOL.y - 4 + (k % 2) * 4, 18, 3, '#f4f6f6')
      px(ctx, x + 3, JI_POOL.y - 6 + (k % 2) * 4, 12, 2, '#ffffff')
    }
    ctx.restore()
    for (let k = 0; k < 3; k++) {
      const x = 130 + k * 34 + Math.sin(env.t * 0.3 + k) * 4
      px(ctx, x, 30 + k * 8, 24, 4, '#f4f6f6')
    }
  }),
  sp('ji_fish2', '물고기', 12, JI_POOL_F, (ctx, env) => {
    for (let k = 0; k < 3; k++) px(ctx, JI_POOL.x - 30 + mod(k * 24 + env.t * 6, 60), JI_POOL.y - 2 + k * 3, 4, 2, '#d8702a')
  }),
  sp('ji_bubbles', '물거품', 12, JI_POOL_F, (ctx, env) => {
    for (let k = 0; k < 8; k++) dot(ctx, JI_POOL.x - 30 + k * 8, JI_POOL.y - mod(env.t * 4 + k, 8), '#e8f4f4')
  }),

  sp('ji_buddha', '부처님 앞을 향해 핀 꽃', 24, JI_SHRINE_F, (ctx, env) => {
    const { x, y } = JI_SHRINE
    withAlpha(ctx, 0.35 + Math.sin(env.t) * 0.05, () => disc(ctx, x, y + 22, 9, '#f4d888'))
    px(ctx, x - 4, y + 26, 8, 10, '#d8a840')
    disc(ctx, x, y + 22, 3, '#d8a840')
    px(ctx, x - 6, y + 34, 12, 2, '#c89830')
    for (let k = 0; k < 6; k++) {
      const fx = x - 30 + k * 5 + (k > 2 ? 34 : 0)
      px(ctx, fx, y + 36, 1, 6, '#4a7a3a')
      flower(ctx, fx + (k > 2 ? -1 : 1), y + 35, '#f4a0b8', '#f4d060')
    }
  }),
  sp('ji_window', '창을 향해 핀 꽃', 24, JI_SHRINE_F, (ctx) => {
    px(ctx, JI_SHRINE.x - 16, JI_SHRINE.y + 12, 8, 8, '#6a5a44')
    flower(ctx, JI_SHRINE.x - 12, JI_SHRINE.y + 24, '#f4a0b8', '#f4d060')
  }),
  sp('ji_pond', '연못을 향해 핀 꽃', 24, JI_SHRINE_F, (ctx) => {
    for (let k = 0; k < 4; k++) flower(ctx, 214 + k * 6, 140, '#f4a0b8', '#f4d060')
  }),
]

// ════════════════════════════════════════════════════════════
// 高中丞〈漁家〉: 천 년의 물과 낚싯배
// ════════════════════════════════════════════════════════════
const YU_WATER = 106
const YU_BUSH = { x: 46, y: 118 }

export const yujiaBackground: Background = {
  id: 'hy112',
  drawBack(ctx) {
    sky(ctx, ['#b4c4d0', '#c4d0d6', '#d4dcd8'], YU_WATER)
    ridge(ctx, (x) => 94 + 6 * Math.sin(x * 0.02 + 1.4), '#9aaaa4', '#a4b4ae', 0, W, YU_WATER)
    water(ctx, YU_WATER, H, '#8aa4ac', '#6a8894', '#b0c4c8')
    fillRows(ctx, 110, H, (y) => [0, 96 - (y - 110) * 0.5], '#7e9a62')
    for (let k = 0; k < 6; k++) disc(ctx, YU_BUSH.x - 14 + k * 6, YU_BUSH.y - (k % 2) * 4, 6, '#4e7a40')
  },
  drawFront() {},
  drawDynamic() {},
}

const YU_BUSH_F = { x: 0, y: 84, w: 112, h: 63 }
const YU_FAR = { x: 192, y: 72, w: 128, h: 54 }
const YU_RIVER = { x: 96, y: 108, w: 192, h: 72 }

export const YUJIA_SPRITES = [
  sp('yu_river', '천 년을 변함없이 흐르는 들판의 물', 8, YU_RIVER, (ctx, env) => {
    for (let k = 0; k < 14; k++) {
      const y = YU_WATER + 6 + k * 5
      const x = mod(hash(k) * 300 + env.t * (4 + k * 0.4), 340) - 20
      px(ctx, x, y, 30 + hash(k * 3) * 30, 1, '#d4e2e4')
    }
  }),
  sp('yu_dry', '말라 버린 물', 8, YU_RIVER, (ctx) => px(ctx, 100, YU_WATER, 220, H - YU_WATER, '#b8aa86')),
  sp('yu_ice', '꽁꽁 언 물', 8, YU_RIVER, (ctx) => withAlpha(ctx, 0.7, () => px(ctx, 100, YU_WATER, 220, H - YU_WATER, '#dce8ee'))),

  sp('yu_fall', '하룻저녁에 지는 한가로운 꽃', 20, YU_BUSH_F, (ctx, env) => {
    for (let k = 0; k < 6; k++) dot(ctx, YU_BUSH.x - 14 + k * 6, YU_BUSH.y - 6 - (k % 2) * 4, '#f4a0b8')
    for (let i = 0; i < 18; i++) {
      const f = mod(hash(i * 2.3) + env.t * 0.12, 1)
      px(ctx, YU_BUSH.x - 16 + hash(i) * 32 + f * 30, YU_BUSH.y - 8 + f * 40, 2, 1, '#f4a0b8')
    }
    withAlpha(ctx, 0.2, () => px(ctx, 0, 0, W, YU_WATER, '#e8a06a'))
  }),
  sp('yu_bloom', '활짝 핀 꽃', 20, YU_BUSH_F, (ctx) => {
    for (let k = 0; k < 14; k++) flower(ctx, YU_BUSH.x - 16 + hash(k) * 34, YU_BUSH.y - 10 + hash(k * 3) * 10, '#f4a0b8', '#f4d060')
  }),
  sp('yu_fruit', '열매 맺은 꽃', 20, YU_BUSH_F, (ctx) => {
    for (let k = 0; k < 8; k++) disc(ctx, YU_BUSH.x - 14 + k * 4, YU_BUSH.y - 6, 1, '#c8402a')
  }),

  sp('yu_narrow', '좁기만 한 덧없는 세상', 14, YU_FAR, (ctx, env) => {
    px(ctx, 220, 92, 96, 14, '#8a8274')
    for (let x = 220; x < 316; x += 6) px(ctx, x, 88, 4, 4, '#8a8274')
    for (let k = 0; k < 10; k++) px(ctx, 222 + k * 9, 84 - (k % 3) * 2, 8, 4, '#6a6458')
    withAlpha(ctx, 0.4, () => mistBands(ctx, env.t, [86, 92, 98], '#a89a8a', 1))
  }),
  sp('yu_wide', '넓고 즐거운 세상', 14, YU_FAR, (ctx) => px(ctx, 200, 96, 120, 6, '#a8c09a')),
  sp('yu_feast', '흥겨운 잔치', 14, YU_FAR, (ctx, env) => {
    for (let k = 0; k < 5; k++) px(ctx, 220 + k * 16, 92, 3, 4, Math.sin(env.t * 3 + k) > -0.5 ? '#e04a3a' : '#c03a2a')
  }),

  sp('yu_boat', '낚싯배 안의 한가로움', 24, YU_RIVER, (ctx, env) => {
    const x = 180 + Math.sin(env.t * 0.15) * 12
    skiff(ctx, x, 150, env.t, { rower: false, guest: '#6e6450', len: 26 })
    for (let i = 0; i < 26; i++) dot(ctx, x + 6 + i, 138 - i * 0.4, '#5a4632')
    px(ctx, x + 32, 128, 1, 26, '#c8c4b8')
    withAlpha(ctx, 0.5, () => {
      for (let a = 0; a < 6.28; a += 0.4) dot(ctx, x + 32 + Math.cos(a) * 3, 155 + Math.sin(a), '#e4eeee')
    })
  }),
  sp('yu_palace', '궁궐 안', 24, YU_RIVER, (ctx) => {
    px(ctx, 160, 120, 80, 24, '#b8352a')
    px(ctx, 154, 112, 92, 8, '#c89a3a')
  }),
  sp('yu_horse', '말 위', 24, YU_RIVER, (ctx) => {
    px(ctx, 170, 140, 20, 7, '#6a4a32')
    person(ctx, 176, 130, '#4b5068')
  }),
]

