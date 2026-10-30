// 『唐詩畫意』 卷九 六言絕句 (1): 王維〈田園樂〉 其三~其七
import type { Background } from '../types'
import { H, W, disc, dot, fillRows, hash, mod, px } from '../pixel'
import type { Ctx } from '../pixel'
import { AUTUMN, GREEN, SPRING, bamboo, boat, broadTree, flower, house, hut, mistBands, moon, person, pine, ridge, sky, stars, withAlpha } from '../kit'
import { OTHER_PALS, pal, seatFig, standFig } from '../figures'
import { drift, grasses, mix, notes, shimmer, soundArcs, sp, stone, sun } from './hy_kit'
import { vignette } from './hy_b3a'

const FULL = { x: 0, y: 0, w: 320, h: 180 }
const OLD = pal({ B: '#d8d4c8', H: '#d8d4c8', R: '#8a7a55', r: '#665a3e' })

/** 늘어진 버드나무 (x, y 는 밑동) */
function willow(ctx: Ctx, x: number, y: number, h: number, t: number, c = '#8aa860') {
  px(ctx, x - 1, y - h, 3, h, '#5a4632')
  for (let k = 0; k < 12; k++) for (let i = 0; i < h * 0.7; i++) dot(ctx, x - 16 + k * 3 + Math.sin(t + i * 0.2) * (i / h) * 2, y - h - 2 + i + Math.abs(k - 6), k % 2 ? c : mix(c, '#ffffff', 0.2))
}

// ════════════════════════════════════════════════════════════
// 其三: 마름 따는 나루·지팡이·살구나무 단·도화원
// ════════════════════════════════════════════════════════════
const T3_WATER = 136
const T3_ALTAR = { x: 222, y: 132 }

export const tianyuan3Background: Background = {
  id: 'hy118',
  drawBack(ctx) {
    sky(ctx, ['#c0c8d0', '#d0d0cc', '#e0d8c4'], 120)
    ridge(ctx, (x) => 86 + 12 * Math.sin(x * 0.02 + 2.2), '#9aaa9c', '#a4b4a6', 0, W, 124)
    px(ctx, 0, 118, W, H - 118, '#8aa062')
    fillRows(ctx, T3_WATER, H, (y) => [0, 150 - (y - T3_WATER) * 0.6], '#8aa8b0')
    for (let k = 0; k < 6; k++) broadTree(ctx, 110 + k * 16, 122, 1.1, GREEN)
    px(ctx, T3_ALTAR.x - 18, T3_ALTAR.y, 36, 6, '#a8a090')
    px(ctx, T3_ALTAR.x - 16, T3_ALTAR.y - 2, 32, 2, '#bcb4a4')
    broadTree(ctx, T3_ALTAR.x + 22, T3_ALTAR.y + 2, 1.4, SPRING)
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    shimmer(ctx, env.t, T3_WATER + 3, 178, 8, '#e4eeee', 0, 140)
  },
}

const T3_FERRY = { x: 0, y: 116, w: 128, h: 64 }
const T3_WOOD = { x: 32, y: 72, w: 144, h: 81 }
const T3_ALTAR_F = { x: 176, y: 96, w: 112, h: 63 }
const T3_FAR = { x: 232, y: 72, w: 88, h: 50 }

export const TIANYUAN3_SPRITES = [
  sp('t3_caltrop', '바람 급한 나루에서 마름 따기', 22, T3_FERRY, (ctx, env) => {
    const x = 70 + Math.sin(env.t * 0.4) * 6
    for (let r = 0; r < 3; r++) px(ctx, x - 12 + r, 154 + r, 24 - r * 2, 1, r ? '#5a3d28' : '#7a5a3c')
    standFig(ctx, x - 6, 132, pal({ R: '#c86a7a', r: '#a84a5a', K: '#1f1d22' }), false, 0.8)
    for (let k = 0; k < 6; k++) disc(ctx, 30 + k * 16, 162 + (k % 2) * 6, 3, '#4a7a3a')
    for (let k = 0; k < 5; k++) withAlpha(ctx, 0.45, () => px(ctx, mod(hash(k) * 150 + env.t * 50, 150), 140 + k * 7, 12, 1, '#ffffff'))
  }, { wind: 0.7 }),
  sp('t3_fish', '낚시하기', 22, T3_FERRY, (ctx) => {
    person(ctx, 30, 126, '#6e6450', { hat: '#a89567' })
    for (let i = 0; i < 26; i++) dot(ctx, 33 + i, 130 + i * 0.2, '#5a4632')
  }),
  sp('t3_wash', '빨래하기', 22, T3_FERRY, (ctx) => {
    person(ctx, 40, 128, '#c86a7a')
    px(ctx, 46, 138, 10, 3, '#e8e2d0')
  }),

  sp('t3_staff', '숲 서쪽에 해 기울 때 지팡이 짚은 사람', 24, T3_WOOD, (ctx) => {
    sun(ctx, 60, 96, 7, '#f0a050', '#f4c890')
    withAlpha(ctx, 0.15, () => px(ctx, 0, 0, W, 120, '#f4b070'))
    standFig(ctx, 90, 100, OLD)
    px(ctx, 104, 102, 1, 22, '#6a4a32')
  }),
  sp('t3_horse', '아침에 말 탄 사람', 24, T3_WOOD, (ctx) => {
    px(ctx, 84, 112, 18, 7, '#6a4a32')
    person(ctx, 90, 102, '#4b5068')
  }),
  sp('t3_cart', '수레 끄는 사람', 24, T3_WOOD, (ctx) => {
    px(ctx, 84, 110, 16, 8, '#8a6a48')
    disc(ctx, 90, 120, 3, '#4a3424')
    person(ctx, 104, 108, '#6e6450')
  }),

  sp('t3_fisher', '살구나무 단 곁의 어부', 22, T3_ALTAR_F, (ctx) => {
    seatFig(ctx, T3_ALTAR.x - 8, T3_ALTAR.y - 16, pal({ R: '#6e6450', r: '#544c3c', K: '#a89567' }))
    for (let i = 0; i < 18; i++) dot(ctx, T3_ALTAR.x - 10 - i, T3_ALTAR.y - 8 - i * 0.6, '#5a4632')
    for (let k = 0; k < 6; k++) disc(ctx, T3_ALTAR.x + 14 + hash(k) * 16, T3_ALTAR.y - 22 + hash(k * 3) * 10, 2, '#f4c8d0')
  }),
  sp('t3_merchant', '짐 진 장사꾼', 22, T3_ALTAR_F, (ctx) => {
    standFig(ctx, T3_ALTAR.x - 8, T3_ALTAR.y - 22, pal(OTHER_PALS[3]))
    px(ctx, T3_ALTAR.x - 14, T3_ALTAR.y - 18, 7, 10, '#a8864a')
  }),
  sp('t3_soldier', '창 든 병사', 22, T3_ALTAR_F, (ctx) => {
    standFig(ctx, T3_ALTAR.x - 8, T3_ALTAR.y - 22, pal({ R: '#6a3a2a', r: '#4a2a1e' }))
    px(ctx, T3_ALTAR.x + 6, T3_ALTAR.y - 30, 1, 30, '#8a8478')
  }),

  sp('t3_village', '도화원 속의 인가', 12, T3_FAR, (ctx, env) => {
    for (let k = 0; k < 3; k++) {
      px(ctx, 250 + k * 20, 106, 14, 6, '#d8d0bc')
      px(ctx, 249 + k * 20, 104, 16, 2, '#6a5a44')
    }
    for (let k = 0; k < 18; k++) disc(ctx, 240 + hash(k * 2.1) * 76, 96 + hash(k * 3.3) * 14, 2, k % 2 ? '#f4a0b8' : '#f8c8d4')
    withAlpha(ctx, 0.2 + Math.sin(env.t) * 0.05, () => disc(ctx, 278, 104, 24, '#ffd8e0'))
  }),
  sp('t3_palace', '궁궐', 12, T3_FAR, (ctx) => {
    px(ctx, 250, 98, 50, 14, '#b8352a')
    px(ctx, 246, 92, 58, 6, '#c89a3a')
  }),
  sp('t3_empty', '빈 들', 12, T3_FAR, (ctx) => px(ctx, 240, 108, 80, 4, '#a8a070')),
]

// ════════════════════════════════════════════════════════════
// 其四: 늘 푸른 풀·큰 소나무·돌아오는 소와 양·노는 아이들
// ════════════════════════════════════════════════════════════
const T4_GROUND = 124
const T4_PINE = { x: 56, y: 146 }

export const tianyuan4Background: Background = {
  id: 'hy119',
  drawBack(ctx) {
    sky(ctx, ['#b8ccd8', '#c8d6dc', '#d8e0dc'], T4_GROUND)
    ridge(ctx, (x) => 92 + 10 * Math.sin(x * 0.02 + 1), '#9aae9e', '#a6baaa', 0, W, T4_GROUND)
    px(ctx, 0, T4_GROUND, W, H - T4_GROUND, '#9a9a6a')
    for (let k = 0; k < 4; k++) broadTree(ctx, 180 + k * 40, 110, 1, AUTUMN)
    for (let k = 0; k < 4; k++) house(ctx, 190 + k * 30, 106 + (k % 2) * 3)
    for (let t = 0; t <= 1; t += 0.005) px(ctx, 120 + t * 90, 178 - t * 56, 6 - t * 3, 1, '#c8b88a')
  },
  drawFront() {},
  drawDynamic() {},
}

const T4_FIELD = { x: 0, y: 108, w: 192, h: 72 }
const T4_PINE_F = { x: 0, y: 56, w: 128, h: 108 }
const T4_LANE = { x: 128, y: 100, w: 144, h: 81 }

export const TIANYUAN4_SPRITES = [
  sp('t4_grass', '가을에도 푸른 봄풀', 10, T4_FIELD, (ctx, env) => {
    px(ctx, 0, T4_GROUND, W, H - T4_GROUND, '#7aa458')
    grasses(ctx, 0, W, H, env, '#5a9a3a', 90, 10)
    grasses(ctx, 0, W, 150, env, '#6aac4a', 60, 7)
  }),
  sp('t4_withered', '누렇게 시든 풀', 10, T4_FIELD, (ctx, env) => grasses(ctx, 0, W, H, env, '#b8a060', 80, 10)),
  sp('t4_snow', '눈 덮인 풀', 10, T4_FIELD, (ctx) => withAlpha(ctx, 0.7, () => px(ctx, 0, T4_GROUND, W, H - T4_GROUND, '#eef2f2'))),

  sp('t4_pine', '여름에도 서늘한 큰 소나무', 14, T4_PINE_F, (ctx, env) => {
    withAlpha(ctx, 0.3, () => fillRows(ctx, T4_PINE.y - 4, T4_PINE.y + 8, (y) => [T4_PINE.x - 40 + (y - T4_PINE.y) * 0.5, T4_PINE.x + 40 - (y - T4_PINE.y) * 0.5], '#2a3a2a'))
    pine(ctx, T4_PINE.x, T4_PINE.y, 3, Math.sin(env.t * 0.5) * 1.5)
  }),
  sp('t4_willow', '늘어진 버들', 14, T4_PINE_F, (ctx, env) => willow(ctx, T4_PINE.x, T4_PINE.y, 60, env.t)),
  sp('t4_bamboo', '대숲', 14, T4_PINE_F, (ctx, env) => {
    for (let k = 0; k < 10; k++) bamboo(ctx, 20 + k * 8, T4_PINE.y, 60 + (k % 3) * 10, Math.sin(env.t + k), env.t)
  }),

  sp('t4_herd', '절로 마을 골목으로 돌아오는 소와 양', 22, T4_LANE, (ctx, env) => {
    const f = mod(env.t * 0.04, 1)
    for (let k = 0; k < 2; k++) {
      const t = Math.min(1, f + k * 0.12)
      const x = 130 + t * 80
      const y = 172 - t * 50
      px(ctx, x - 7, y - 7, 14, 6, '#5a4a3a')
      px(ctx, x + 6, y - 9, 5, 5, '#5a4a3a')
      for (const d of [-6, -2, 3, 6]) px(ctx, x + d, y - 1, 1, 2, '#3a2e22')
    }
    for (let k = 0; k < 4; k++) {
      const t = Math.min(1, f + 0.25 + k * 0.06)
      disc(ctx, 140 + t * 76 + (k % 2) * 6, 168 - t * 50, 3, '#f4f0e8')
    }
  }),
  sp('t4_horses', '말 떼', 22, T4_LANE, (ctx) => {
    for (let k = 0; k < 3; k++) px(ctx, 150 + k * 20, 150 - k * 8, 14, 6, '#8a6a4a')
  }),
  sp('t4_carts', '수레 행렬', 22, T4_LANE, (ctx) => {
    for (let k = 0; k < 2; k++) {
      px(ctx, 150 + k * 30, 146 - k * 10, 16, 8, '#8a6a48')
      disc(ctx, 156 + k * 30, 156 - k * 10, 3, '#4a3424')
    }
  }),

  sp('t4_kids', '의관을 몰라보고 노는 아이들', 26, FULL, (ctx, env) => {
    standFig(ctx, 100, 128, pal({ R: '#a8382a', r: '#7a2a20' }))
    px(ctx, 100, 127, 14, 2, '#1f1d22')
    for (let k = 0; k < 3; k++) {
      const x = 130 + k * 14 + Math.sin(env.t * 2 + k) * 6
      const y = 152 - Math.abs(Math.sin(env.t * 4 + k)) * 4
      px(ctx, x - 2, y - 7, 5, 7, ['#d8a040', '#6aa0c8', '#c86a7a'][k])
      px(ctx, x - 1, y - 10, 3, 3, '#e6c39b')
    }
  }),
  sp('t4_bow', '넙죽 절하는 아이', 26, FULL, (ctx) => {
    standFig(ctx, 100, 128, pal({ R: '#a8382a', r: '#7a2a20' }))
    px(ctx, 130, 146, 6, 4, '#d8a040')
    px(ctx, 127, 146, 3, 3, '#e6c39b')
  }),
  sp('t4_run', '겁먹고 달아나는 아이', 26, FULL, (ctx, env) => {
    standFig(ctx, 100, 128, pal({ R: '#a8382a', r: '#7a2a20' }))
    const x = 130 + mod(env.t * 14, 60)
    px(ctx, x - 2, 143, 5, 7, '#d8a040')
    px(ctx, x - 1, 140, 3, 3, '#e6c39b')
  }),
]

// ════════════════════════════════════════════════════════════
// 其五: 먼 마을 연기·언덕의 외로운 나무·표주박·다섯 버들
// ════════════════════════════════════════════════════════════
const T5_GROUND = 128
const T5_HUT = { x: 46, y: 132 }
const T5_HOUSE = { x: 210, y: 132 }
const t5Plateau = (x: number) => (x > 200 ? 84 + Math.sin(x * 0.1) * 1.5 : 200)

export const tianyuan5Background: Background = {
  id: 'hy120',
  drawBack(ctx) {
    sky(ctx, ['#c4ccd4', '#d0d4d4', '#dcdcd0'], T5_GROUND)
    ridge(ctx, (x) => 44 + Math.abs(x - 90) * 0.7, '#8a9e94', '#96aaa0', 0, 200, T5_GROUND)
    fillRows(ctx, 84, T5_GROUND, (y) => [200 - (y - 84) * 0.6, W], '#9aa478')
    px(ctx, 0, 104, 200, T5_GROUND - 104, '#8a9a6a')
    for (let k = 0; k < 4; k++) hut(ctx, 30 + k * 16, 98)
    px(ctx, 0, T5_GROUND, W, H - T5_GROUND, '#9a9470')
    px(ctx, 100, T5_GROUND + 2, 100, H - T5_GROUND, '#b0a480')
    hut(ctx, T5_HUT.x, T5_HUT.y)
    house(ctx, T5_HOUSE.x, T5_HOUSE.y)
  },
  drawFront() {},
  drawDynamic() {},
}

const T5_VILLAGE = { x: 8, y: 56, w: 112, h: 63 }
const T5_PLATEAU = { x: 208, y: 40, w: 112, h: 63 }
const T5_HUT_F = { x: 16, y: 112, w: 96, h: 54 }
const T5_HOUSE_F = { x: 184, y: 96, w: 128, h: 72 }

export const TIANYUAN5_SPRITES = [
  sp('t5_smoke', '산 아래 먼 마을의 외로운 연기', 20, T5_VILLAGE, (ctx, env) => {
    for (let k = 0; k < 2; k++) {
      const x = 44 + k * 24
      withAlpha(ctx, 0.6, () => {
        for (let i = 0; i < 30; i++) dot(ctx, x + Math.sin(i * 0.3 + env.t + k) * (i / 8), 96 - i, '#e8ecec')
      })
    }
  }),
  sp('t5_fire', '번지는 불길', 20, T5_VILLAGE, (ctx, env) => {
    for (let k = 0; k < 6; k++) if (Math.sin(env.t * 8 + k) > -0.3) px(ctx, 36 + k * 6, 94 - (k % 2) * 3, 3, 6, k % 2 ? '#ffb040' : '#e8702a')
  }),
  sp('t5_fog', '짙은 안개', 20, T5_VILLAGE, (ctx, env) => mistBands(ctx, env.t, [92, 98, 104], '#f4f4f0', 0.8)),

  sp('t5_tree', '하늘 끝 언덕의 홀로 선 나무', 14, T5_PLATEAU, (ctx, env) => broadTree(ctx, 262, t5Plateau(262) + 1, 1.5, GREEN, Math.sin(env.t * 0.5))),
  sp('t5_forest', '우거진 숲', 14, T5_PLATEAU, (ctx) => {
    for (let k = 0; k < 6; k++) broadTree(ctx, 220 + k * 16, 86, 1, GREEN)
  }),
  sp('t5_pagoda', '높은 탑', 14, T5_PLATEAU, (ctx) => {
    for (let k = 0; k < 4; k++) {
      px(ctx, 258 + k, 74 - k * 8, 10 - k * 2, 5, '#c9bfa5')
      px(ctx, 255 + k, 72 - k * 8, 16 - k * 2, 2, '#3c4048')
    }
  }),

  sp('t5_gourd', '표주박 하나의 누추한 골목', 22, T5_HUT_F, (ctx) => {
    seatFig(ctx, T5_HUT.x + 24, T5_HUT.y + 2, pal({ R: '#a8a490', r: '#8a8672' }))
    disc(ctx, T5_HUT.x + 40, T5_HUT.y + 14, 2, '#c8a848')
    disc(ctx, T5_HUT.x + 40, T5_HUT.y + 11, 1, '#c8a848')
    px(ctx, T5_HUT.x - 6, T5_HUT.y + 14, 4, 2, '#8a8270')
  }),
  sp('t5_feast', '차려 놓은 잔칫상', 22, T5_HUT_F, (ctx) => {
    px(ctx, T5_HUT.x + 24, T5_HUT.y + 12, 20, 4, '#a8382a')
    for (let k = 0; k < 4; k++) disc(ctx, T5_HUT.x + 27 + k * 5, T5_HUT.y + 11, 1, '#f4d060')
  }),
  sp('t5_gold', '쌓인 금은보화', 22, T5_HUT_F, (ctx) => {
    for (let k = 0; k < 5; k++) px(ctx, T5_HUT.x + 26 + k * 3, T5_HUT.y + 12 - (k % 2) * 2, 3, 3, '#e8c048')
  }),

  sp('t5_willows', '마주 보는 오류 선생의 문', 24, T5_HOUSE_F, (ctx, env) => {
    for (let k = 0; k < 5; k++) willow(ctx, T5_HOUSE.x - 14 + k * 14, T5_HOUSE.y + 16, 30, env.t + k)
  }),
  sp('t5_pines', '소나무 다섯 그루', 24, T5_HOUSE_F, (ctx) => {
    for (let k = 0; k < 5; k++) pine(ctx, T5_HOUSE.x - 14 + k * 14, T5_HOUSE.y + 16, 0.8)
  }),
  sp('t5_bamboo', '대나무 숲', 24, T5_HOUSE_F, (ctx, env) => {
    for (let k = 0; k < 8; k++) bamboo(ctx, T5_HOUSE.x - 14 + k * 8, T5_HOUSE.y + 16, 30, Math.sin(env.t + k), env.t)
  }),
]

// ════════════════════════════════════════════════════════════
// 其六: 비 머금은 복사꽃·안개 띤 버들·쓸지 않은 꽃잎·잠든 산 손님
// ════════════════════════════════════════════════════════════
const T6_GROUND = 140
const T6_PEACH = { x: 70, y: T6_GROUND }
const T6_WILLOW = { x: 140, y: T6_GROUND }
const T6_ROOM = { x: 196, y: 86 }
const T6_BLOOMS = Array.from({ length: 22 }, (_, i) => ({ x: T6_PEACH.x - 26 + hash(i * 2.1) * 52, y: T6_PEACH.y - 66 + hash(i * 3.3) * 30 }))

export const tianyuan6Background: Background = {
  id: 'hy121',
  drawBack(ctx) {
    sky(ctx, ['#d0dce4', '#dce2e4', '#e6e6de'], T6_GROUND)
    ridge(ctx, (x) => 96 + 10 * Math.sin(x * 0.02 + 1), '#a8bcb4', '#b4c8c0', 0, W, T6_GROUND)
    px(ctx, 0, T6_GROUND, W, H - T6_GROUND, '#8aac62')
    px(ctx, T6_PEACH.x - 3, T6_PEACH.y - 44, 6, 44, '#4a3426')
    for (const b of T6_BLOOMS) disc(ctx, b.x, b.y, 4, '#6a9a4a')
    // 방
    px(ctx, T6_ROOM.x, T6_ROOM.y, 120, 54, '#d8d0bc')
    px(ctx, T6_ROOM.x - 6, T6_ROOM.y - 10, 132, 10, '#3c4048')
    px(ctx, T6_ROOM.x + 10, T6_ROOM.y + 8, 100, 40, '#5a4a3a')
    px(ctx, T6_ROOM.x + 20, T6_ROOM.y + 36, 70, 4, '#8a6a48')
  },
  drawFront() {},
  drawDynamic() {},
}

const T6_PEACH_F = { x: 8, y: 56, w: 128, h: 72 }
const T6_WILLOW_F = { x: 96, y: 60, w: 96, h: 81 }
const T6_YARD = { x: 0, y: 112, w: 192, h: 68 }
const T6_ROOM_F = { x: 184, y: 64, w: 136, h: 81 }

export const TIANYUAN6_SPRITES = [
  sp('t6_peach', '지난밤 비를 머금은 붉은 복사꽃', 12, T6_PEACH_F, (ctx, env) => {
    for (const [i, b] of T6_BLOOMS.entries()) {
      disc(ctx, b.x, b.y, 2, i % 3 ? '#e8708a' : '#f49aae')
      if (Math.sin(env.t * 1.5 + i) > 0.7) dot(ctx, b.x + 1, b.y + 2, '#e8f4f8')
    }
  }),
  sp('t6_pear', '하얀 배꽃', 12, T6_PEACH_F, (ctx) => {
    for (const b of T6_BLOOMS) disc(ctx, b.x, b.y, 2, '#f8f8f4')
  }),
  sp('t6_forsythia', '노란 개나리', 12, T6_PEACH_F, (ctx) => {
    for (const b of T6_BLOOMS) disc(ctx, b.x, b.y, 1, '#f4d040')
  }),

  sp('t6_willow', '아침 안개를 띤 푸른 버들', 14, T6_WILLOW_F, (ctx, env) => {
    willow(ctx, T6_WILLOW.x, T6_WILLOW.y, 64, env.t, '#7ab050')
    mistBands(ctx, env.t * 0.5, [96, 106, 118], '#ffffff', 0.5)
  }),
  sp('t6_maple', '붉게 물든 단풍', 14, T6_WILLOW_F, (ctx) => broadTree(ctx, T6_WILLOW.x, T6_WILLOW.y, 2, AUTUMN)),
  sp('t6_snow', '눈 인 가지', 14, T6_WILLOW_F, (ctx) => {
    px(ctx, T6_WILLOW.x - 1, T6_WILLOW.y - 60, 3, 60, '#5a4632')
    for (let k = 0; k < 6; k++) px(ctx, T6_WILLOW.x - 14 + k * 5, T6_WILLOW.y - 62 + (k % 2) * 4, 5, 2, '#f4f6f6')
  }),

  sp('t6_petals', '아이종이 아직 쓸지 않은 꽃잎', 20, T6_YARD, (ctx, env) => {
    for (let k = 0; k < 50; k++) px(ctx, 10 + hash(k * 1.9) * 180, T6_GROUND + 2 + hash(k * 2.9) * 36, 2, 1, k % 2 ? '#f49aae' : '#f8c8d4')
    drift(ctx, env.t, { x: 40, y: 80, w: 80, h: 60 }, 6, '#f49aae', 0.2, 2)
    const x = 150
    standFig(ctx, x, T6_GROUND - 18, pal({ R: '#8a7a55', r: '#665a3e', K: '#1f1d22' }), true, 0.8)
    for (let i = 0; i < 14; i++) dot(ctx, x - 2 + i * 0.1, T6_GROUND - 14 + i, '#6a4a32')
    px(ctx, x - 5, T6_GROUND - 1, 7, 2, '#a8864a')
  }),
  sp('t6_swept', '깨끗이 쓴 마당', 20, T6_YARD, (ctx) => {
    for (let k = 0; k < 8; k++) px(ctx, 20 + k * 20, T6_GROUND + 10 + (k % 2) * 6, 14, 1, '#7a9a52')
  }),
  sp('t6_burn', '모아서 태운 꽃잎', 20, T6_YARD, (ctx, env) => {
    for (let k = 0; k < 4; k++) if (Math.sin(env.t * 8 + k) > -0.3) px(ctx, 100 + k * 3, T6_GROUND + 6, 2, 4, '#e8702a')
  }),

  sp('t6_sleep', '꾀꼬리 우는데 아직 잠든 산 손님', 24, T6_ROOM_F, (ctx, env) => {
    px(ctx, T6_ROOM.x + 26, T6_ROOM.y + 31, 46, 5, '#d8dce4')
    px(ctx, T6_ROOM.x + 72, T6_ROOM.y + 30, 5, 5, '#e6c39b')
    for (let k = 0; k < 3; k++) {
      const f = mod(env.t * 0.4 + k / 3, 1)
      withAlpha(ctx, 1 - f, () => px(ctx, T6_ROOM.x + 80 + f * 6 + k * 2, T6_ROOM.y + 24 - f * 10 - k * 3, 3, 1, '#4a5a6a'))
    }
    const bx = T6_PEACH.x + 20
    const by = T6_PEACH.y - 50
    px(ctx, bx, by, 6, 4, '#f0c020')
    px(ctx, bx + 5, by - 2, 3, 3, '#f0c020')
    dot(ctx, bx + 8, by - 1, '#d88a2a')
    soundArcs(ctx, bx + 9, by - 1, env.t * 1.5, '#5d4a37', 14)
  }),
  sp('t6_walk', '산책 나선 손님', 24, T6_ROOM_F, (ctx, env) => standFig(ctx, 200 + Math.sin(env.t * 0.3) * 10, T6_GROUND - 22, pal())),
  sp('t6_write', '글 쓰는 손님', 24, T6_ROOM_F, (ctx) => {
    seatFig(ctx, T6_ROOM.x + 40, T6_ROOM.y + 22, pal())
    px(ctx, T6_ROOM.x + 56, T6_ROOM.y + 34, 10, 3, '#f4f0e0')
  }),
]

// ════════════════════════════════════════════════════════════
// 其七: 샘가의 술·소나무와 거문고·이슬 젖은 아욱·밤의 기장 찧기
// ════════════════════════════════════════════════════════════
const T7_GROUND = 128
const T7_SPRING = { x: 70, y: 150 }
const T7_PINE = { x: 170, y: T7_GROUND + 6 }
const T7_GARDEN = { x: 250, y: 160 }
const T7_VIG = { cx: 254, cy: 96, rx: 54, ry: 30 }

export const tianyuan7Background: Background = {
  id: 'hy122',
  drawBack(ctx) {
    sky(ctx, ['#c0d0dc', '#ccdae0', '#d8e2e0'], T7_GROUND)
    ridge(ctx, (x) => 84 + 12 * Math.sin(x * 0.02 + 0.6), '#9ab0a4', '#a6bcb0', 0, W, T7_GROUND)
    px(ctx, 0, T7_GROUND, W, H - T7_GROUND, '#8aa462')
    fillRows(ctx, T7_SPRING.y - 8, T7_SPRING.y + 8, (y) => [T7_SPRING.x - 30 + Math.abs(y - T7_SPRING.y) * 2, T7_SPRING.x + 30 - Math.abs(y - T7_SPRING.y) * 2], '#8ab4c4')
    for (let k = 0; k < 4; k++) stone(ctx, T7_SPRING.x - 30 + k * 20, T7_SPRING.y - 8, 3, '#a8a49a', '#8a867a')
    pine(ctx, T7_PINE.x, T7_PINE.y, 2.2)
    for (let r = 0; r < 3; r++) px(ctx, T7_GARDEN.x - 40, T7_GARDEN.y + r * 6, 80, 2, '#7a6a48')
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    shimmer(ctx, env.t, T7_SPRING.y - 6, T7_SPRING.y + 6, 4, '#e4f0f4', T7_SPRING.x - 24, T7_SPRING.x + 24)
  },
}

const T7_SPRING_F = { x: 16, y: 112, w: 112, h: 63 }
const T7_PINE_F = { x: 128, y: 80, w: 96, h: 63 }
const T7_GARDEN_F = { x: 200, y: 136, w: 96, h: 44 }
const T7_VIG_F = { x: 192, y: 60, w: 124, h: 72 }

export const TIANYUAN7_SPRITES = [
  sp('t7_spring', '샘물가에 모여 술 따르기', 22, T7_SPRING_F, (ctx) => {
    seatFig(ctx, T7_SPRING.x - 44, T7_SPRING.y - 22, pal())
    seatFig(ctx, T7_SPRING.x + 30, T7_SPRING.y - 22, pal(OTHER_PALS[1]), true)
    px(ctx, T7_SPRING.x + 24, T7_SPRING.y - 10, 6, 7, '#8a5a3a')
    px(ctx, T7_SPRING.x - 30, T7_SPRING.y - 12, 3, 2, '#dcd2bb')
  }),
  sp('t7_room', '방 안', 22, T7_SPRING_F, (ctx) => {
    px(ctx, 30, 120, 80, 30, '#d8d0bc')
    px(ctx, 26, 114, 88, 6, '#3c4048')
  }),
  sp('t7_boat', '배 위', 22, T7_SPRING_F, (ctx) => boat(ctx, T7_SPRING.x, T7_SPRING.y + 4, { len: 24 })),

  sp('t7_qin', '거문고 안고 큰 소나무에 기대기', 24, T7_PINE_F, (ctx, env) => {
    seatFig(ctx, T7_PINE.x + 2, T7_PINE.y - 16, pal({ R: '#c8c4b0', r: '#a8a490' }))
    px(ctx, T7_PINE.x - 2, T7_PINE.y - 8, 18, 3, '#6a4a2a')
    for (let i = 0; i < 5; i++) dot(ctx, T7_PINE.x + i * 3, T7_PINE.y - 9, '#e8d8a8')
    notes(ctx, T7_PINE.x + 18, T7_PINE.y - 14, env.t, '#5d4a37')
  }),
  sp('t7_willow', '버드나무에 기대기', 24, T7_PINE_F, (ctx, env) => willow(ctx, T7_PINE.x + 20, T7_PINE.y, 40, env.t)),
  sp('t7_rock', '바위에 기대기', 24, T7_PINE_F, (ctx) => stone(ctx, T7_PINE.x + 14, T7_PINE.y, 8, '#a8a49a', '#7e7a70')),

  sp('t7_kui', '아침에 꺾는 이슬 젖은 아욱', 20, T7_GARDEN_F, (ctx, env) => {
    for (let r = 0; r < 3; r++) for (let c = 0; c < 8; c++) {
      const x = T7_GARDEN.x - 36 + c * 10
      const y = T7_GARDEN.y - 2 + r * 6
      disc(ctx, x, y, 2, '#5a9a4a')
      if (Math.sin(env.t * 2 + c + r) > 0.6) dot(ctx, x, y - 1, '#ffffff')
    }
    person(ctx, T7_GARDEN.x + 30, T7_GARDEN.y - 12, '#6e6450', { bow: 1 })
  }),
  sp('t7_flower', '꽃 꺾기', 20, T7_GARDEN_F, (ctx) => {
    for (let c = 0; c < 8; c++) flower(ctx, T7_GARDEN.x - 36 + c * 10, T7_GARDEN.y, '#e88aa0', '#f4d060')
  }),
  sp('t7_persimmon', '감 따기', 20, T7_GARDEN_F, (ctx) => {
    for (let c = 0; c < 6; c++) disc(ctx, T7_GARDEN.x - 30 + c * 12, T7_GARDEN.y, 2, '#e8803a')
  }),

  sp('t7_mortar', '밤에 동쪽 골짜기에서 기장 찧기', 26, T7_VIG_F, (ctx, env) => vignette(ctx, T7_VIG.cx, T7_VIG.cy, T7_VIG.rx, T7_VIG.ry, (c) => {
    sky(c, ['#1a2238', '#242c44'], 130)
    stars(c, 10, 9, 66, 90, env.t, '#c8c8d8')
    moon(c, T7_VIG.cx + 30, 78, 5)
    ridge(c, (x) => 96 + 6 * Math.sin(x * 0.1), '#1e2630', undefined, 200, 310, 130)
    px(c, 200, 112, 110, 20, '#2a2e2a')
    const up = Math.sin(env.t * 4) > 0
    person(c, T7_VIG.cx - 8, 104, '#4b5068')
    px(c, T7_VIG.cx - 1, up ? 98 : 104, 2, 10, '#8a6a48')
    px(c, T7_VIG.cx - 5, 112, 10, 6, '#6a665c')
    px(c, T7_VIG.cx - 4, 111, 8, 1, '#d8b050')
    if (!up) soundArcs(c, T7_VIG.cx, 110, env.t, '#a8acc4', 12)
  })),
  sp('t7_weave', '베 짜기', 26, T7_VIG_F, (ctx) => vignette(ctx, T7_VIG.cx, T7_VIG.cy, T7_VIG.rx, T7_VIG.ry, (c) => {
    px(c, 230, 90, 40, 20, '#8a6a48')
    for (let i = 0; i < 10; i++) px(c, 232 + i * 4, 90, 1, 20, '#e8e2d0')
  })),
  sp('t7_sleep', '잠자기', 26, T7_VIG_F, (ctx) => vignette(ctx, T7_VIG.cx, T7_VIG.cy, T7_VIG.rx, T7_VIG.ry, (c) => {
    sky(c, ['#1a2238', '#242c44'], 130)
    hut(c, T7_VIG.cx - 10, 92)
  })),
]

