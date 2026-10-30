// 『唐詩畫意』 卷八 둘째 묶음 (3): 李白〈秋浦歌〉〈別東林寺僧〉〈賦得白鷺鷥〉〈夏日山中〉〈觀放白鷹〉
import type { Background } from '../types'
import { H, W, disc, dot, fillRows, hash, mod, px } from '../pixel'
import type { Ctx } from '../pixel'
import { AUTUMN, GREEN, bamboo, bird, broadTree, flower, moon, person, pine, rain, ridge, sky, veil, withAlpha } from '../kit'
import { OTHER_PALS, POET_PAL, pal, seatFig, standFig } from '../figures'
import { drift, egret, grasses, shimmer, skiff, soundArcs, sp, sun, water } from './hy_kit'

// ════════════════════════════════════════════════════════════
// 李白〈秋浦歌〉: 가을 강, 왼쪽 기슭의 오두막
// ════════════════════════════════════════════════════════════
const QP_WATER = 104

export const qiupuBackground: Background = {
  id: 'hy027',
  drawBack(ctx) {
    sky(ctx, ['#cdd0cc', '#d6d4c8', '#dfd8c4'], QP_WATER)
    ridge(ctx, (x) => 70 + 10 * Math.sin(x * 0.02 + 2) + 4 * Math.sin(x * 0.07), '#8a9080', '#98a08e', 0, W, QP_WATER)
    water(ctx, QP_WATER, H, '#9ab0ac', '#6e8c8c', '#c0d4cc')
    // 왼쪽 기슭과 오른쪽 기슭
    fillRows(ctx, 96, 140, (y) => [0, 110 - (y - 96) * 0.6], (y) => (y < 100 ? '#9a9064' : '#8a8058'))
    fillRows(ctx, 100, 150, (y) => [190 + (y - 100) * 0.4, W], (y) => (y < 104 ? '#a09870' : '#8e8660'))
    for (let i = 0; i < 4; i++) broadTree(ctx, 14 + i * 20, 100, 0.8, AUTUMN)
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    shimmer(ctx, env.t, QP_WATER + 6, 176, 20, '#e2ece6', 100, 220)
  },
}

const QP_MAN = { x: 8, y: 80, w: 128, h: 72 }
const QP_BOAT = { x: 88, y: 108, w: 128, h: 72 }
const QP_NET = { x: 184, y: 80, w: 136, h: 76 }
const QP_GROVE = { x: 176, y: 30, w: 144, h: 81 }
const OLD = pal({ B: '#e8e4dc', H: '#d8d4cc', R: '#7a6a4a', r: '#5a4a32' })

/** 백한(白鷴): 희고 긴 꼬리의 꿩 */
function pheasant(ctx: Ctx, x: number, y: number) {
  px(ctx, x, y, 8, 4, '#f4f2ec')
  px(ctx, x + 6, y - 3, 3, 3, '#1f1d22')
  dot(ctx, x + 7, y - 4, '#c0302a')
  for (let k = 0; k < 12; k++) dot(ctx, x - k, y + 1 + k * 0.2, '#e8e4dc')
  px(ctx, x + 2, y + 4, 1, 3, '#c0302a')
  px(ctx, x + 5, y + 4, 1, 3, '#c0302a')
}

export const QIUPU_SPRITES = [
  sp('qp_oldman', '추포의 시골 노인', 22, QP_MAN, (ctx) => standFig(ctx, 60, 104, OLD)),
  sp('qp_warrior', '젊은 무사', 22, QP_MAN, (ctx) => {
    standFig(ctx, 60, 104, pal({ R: '#6a6e78', r: '#4a4e58', L: '#b2352a' }))
    px(ctx, 74, 96, 1, 30, '#8a8a8a')
  }),
  sp('qp_noble', '비단옷 입은 귀족', 22, QP_MAN, (ctx) => standFig(ctx, 60, 104, pal({ R: '#b2352a', r: '#8a2a20', L: '#d9a441' }))),

  sp('qp_fishing', '고깃배의 잠', 26, QP_BOAT, (ctx, env) => {
    skiff(ctx, 150, 150, env.t * 0.3, { rower: false, len: 34 })
    px(ctx, 140, 144, 12, 3, OLD.R)
    px(ctx, 152, 143, 3, 3, '#e6c39b')
    px(ctx, 128, 140, 1, 10, '#5a4632')
    for (let k = 0; k < 10; k++) dot(ctx, 128 - k, 140 + k * 0.6, '#5a4632')
    const g = mod(env.t * 0.4, 1)
    withAlpha(ctx, 1 - g, () => px(ctx, 156 + g * 6, 138 - g * 8, 3, 1, '#3b2a1d'))
  }),
  sp('qp_lotus', '연꽃 따기', 26, QP_BOAT, (ctx, env) => {
    skiff(ctx, 150, 150, env.t * 0.3, { rower: false, len: 30, guest: OLD.R })
    for (let k = 0; k < 5; k++) flower(ctx, 120 + k * 16, 156 + (k % 2) * 4, '#e88aa0', '#f8e0a0')
  }),
  sp('qp_laundry', '빨래하기', 26, QP_BOAT, (ctx, env) => {
    person(ctx, 120, 136, OLD.R)
    const k = Math.sin(env.t * 4) > 0 ? 1 : 0
    px(ctx, 122, 144 + k, 12, 3, '#e8e2d0')
  }),

  sp('qp_net', '백한 잡는 그물', 30, QP_NET, (ctx, env) => {
    for (let k = 0; k <= 8; k++) {
      px(ctx, 216 + k * 7, 100, 1, 32, '#8a8268')
      px(ctx, 216, 100 + k * 4, 56, 1, '#8a8268')
    }
    standFig(ctx, 198, 112, pal({ R: '#8a5a6a', r: '#6a4250', B: '#e6c39b' }))
    const hop = Math.abs(Math.sin(env.t * 4)) * 2
    px(ctx, 282, 128 - hop, 3, 6, '#c0604a')
    dot(ctx, 283, 126 - hop, '#e6c39b')
    pheasant(ctx, 238, 116 + Math.sin(env.t * 2) * 2)
  }),
  sp('qp_plow', '밭 갈기', 30, QP_NET, (ctx, env) => {
    for (let k = 0; k < 6; k++) px(ctx, 200, 128 + k * 4, 100, 1, '#7a6a48')
    const x = 220 + mod(env.t * 6, 50)
    px(ctx, x, 120, 16, 7, '#5a4632')
    px(ctx, x + 14, 117, 5, 5, '#5a4632')
    person(ctx, x - 12, 118, '#8a5a6a')
  }),
  sp('qp_weave', '베 짜기', 30, QP_NET, (ctx, env) => {
    px(ctx, 220, 108, 40, 2, '#6b4a32')
    px(ctx, 220, 130, 40, 2, '#6b4a32')
    for (let k = 0; k < 10; k++) px(ctx, 222 + k * 4, 110, 1, 20, '#e8dcc0')
    px(ctx, 222, 112 + mod(env.t * 6, 16), 36, 1, '#b2352a')
    seatFig(ctx, 204, 112, pal({ R: '#8a5a6a', r: '#6a4250', B: '#e6c39b' }))
  }),

  sp('qp_bamboo', '대숲의 그물', 8, QP_GROVE, (ctx, env) => {
    for (let k = 0; k < 16; k++) bamboo(ctx, 190 + k * 8, 112, 50 + (k % 4) * 10, Math.sin(env.t + k) * 2, env.t)
  }),
  sp('qp_pine', '소나무 숲', 8, QP_GROVE, (ctx) => {
    for (let k = 0; k < 6; k++) pine(ctx, 196 + k * 22, 112, 1.2 + (k % 2) * 0.3)
  }),
  sp('qp_reeds', '갈대밭', 8, QP_GROVE, (ctx, env) => {
    grasses(ctx, 186, 316, 112, env, '#b8a870', 60, 26)
  }),
]

// ════════════════════════════════════════════════════════════
// 李白〈別東林寺僧〉: 달 뜨는 여산, 호계와 작은 다리
// ════════════════════════════════════════════════════════════
const tiger = (x: number) => 138 + (x - 120) * 0.25 + Math.sin(x * 0.05) * 3 // 호계 물길

export const donglinBackground: Background = {
  id: 'hy028',
  drawBack(ctx) {
    sky(ctx, ['#4a5a78', '#5a6886', '#6a7690', '#7a8296'], 100)
    moon(ctx, 70, 26, 8)
    ridge(ctx, (x) => 40 + 30 * Math.exp(-((x - 230) ** 2) / 4000) * -1 + 18 * Math.sin(x * 0.015 + 2.5), '#3a4a52', '#46565e')
    ridge(ctx, (x) => 92 + 8 * Math.sin(x * 0.03 + 1), '#34443c', '#3e4e46')
    fillRows(ctx, 100, H, () => [0, W], (y) => (y < 120 ? '#4a5a42' : '#44523c'))
    // 호계
    for (let x = 120; x < W; x++) px(ctx, x, tiger(x), 1, 6, '#6a8090')
    // 작은 다리
    for (let x = 176; x < 204; x++) px(ctx, x, tiger(190) - 3 - Math.sin(((x - 176) / 28) * Math.PI) * 5, 1, 3, '#8a7a66')
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    for (let i = 0; i < 12; i++) {
      const x = 120 + mod(hash(i) * 200 + env.t * 8, 200)
      if (Math.sin(env.t * 3 + i) > 0) px(ctx, x, tiger(x) + 2, 3, 1, '#a8bccc')
    }
  },
}

const DL_LEFT = { x: 0, y: 60, w: 144, h: 81 }
const DL_TREE = { x: 104, y: 24, w: 128, h: 72 }
const DL_WALK = { x: 176, y: 76, w: 144, h: 81 }
const DL_STREAM = { x: 120, y: 112, w: 128, h: 68 }

export const DONGLIN_SPRITES = [
  sp('dl_temple', '동림사의 배웅', 14, DL_LEFT, (ctx) => {
    px(ctx, 20, 92, 70, 4, '#2a2e36')
    px(ctx, 26, 88, 58, 4, '#363a44')
    px(ctx, 26, 96, 58, 28, '#8a7e66')
    px(ctx, 46, 102, 18, 22, '#3a2a1a')
    standFig(ctx, 94, 104, pal({ K: '#8a7a6a', H: '#8a7a6a', R: '#6a6458', r: '#4e4a40', B: '#e6c39b' }))
  }),
  sp('dl_market', '저잣거리', 14, DL_LEFT, (ctx) => {
    for (let k = 0; k < 3; k++) {
      px(ctx, 14 + k * 36, 100, 30, 3, ['#b2352a', '#d9a441', '#4f6b4a'][k])
      px(ctx, 16 + k * 36, 103, 2, 16, '#5a4632')
      person(ctx, 24 + k * 36, 112, OTHER_PALS[k].R)
    }
  }),
  sp('dl_boat', '배 위의 배웅', 14, DL_LEFT, (ctx, env) => {
    fillRows(ctx, 120, 134, () => [0, 130], '#5a7080')
    skiff(ctx, 70, 130, env.t, { guest: POET_PAL.R, len: 30 })
  }),

  sp('dl_monkey', '달밤의 흰 원숭이', 22, DL_TREE, (ctx, env) => {
    pine(ctx, 160, 100, 1.6)
    const y = 62 + Math.sin(env.t * 1.5) * 1
    disc(ctx, 168, y, 3, '#e8e4dc')
    px(ctx, 166, y + 2, 5, 6, '#e8e4dc')
    for (let k = 0; k < 6; k++) dot(ctx, 166 - k, y + 6 + k * 0.6, '#e8e4dc')
    dot(ctx, 169, y - 1, '#2a2622')
    soundArcs(ctx, 172, y, env.t, '#f4efe2', 22)
  }),
  sp('dl_crane', '춤추는 학', 22, DL_TREE, (ctx, env) => {
    const up = Math.sin(env.t * 4) > 0
    px(ctx, 160, 80, 1, 12, '#2a2622')
    px(ctx, 163, 80, 1, 12, '#2a2622')
    px(ctx, 154, 70, 14, 10, '#f8f6f0')
    px(ctx, up ? 140 : 146, up ? 60 : 70, 14, 4, '#f8f6f0')
    px(ctx, 166, 56, 2, 14, '#f8f6f0')
    dot(ctx, 167, 55, '#c0302a')
  }),
  sp('dl_deer', '사슴', 22, DL_TREE, (ctx) => {
    px(ctx, 150, 80, 18, 8, '#9a7a52')
    px(ctx, 166, 72, 5, 9, '#9a7a52')
    for (let k = 0; k < 4; k++) px(ctx, 152 + k * 4, 88, 1, 8, '#7a5a3a')
    px(ctx, 167, 66, 1, 6, '#6a4a2a')
    px(ctx, 170, 66, 1, 6, '#6a4a2a')
  }),

  sp('dl_smile', '웃으며 하는 작별', 30, DL_WALK, (ctx, env) => {
    const x = 220 + mod(env.t * 3, 60)
    standFig(ctx, Math.round(x), 106, pal())
    px(ctx, Math.round(x) + 6, 101, 3, 1, '#3b2a1d')
    dot(ctx, Math.round(x) + 5, 100, '#3b2a1d')
    dot(ctx, Math.round(x) + 9, 100, '#3b2a1d')
  }),
  sp('dl_cry', '울며 붙잡음', 30, DL_WALK, (ctx, env) => {
    standFig(ctx, 220, 106, pal())
    standFig(ctx, 236, 106, pal({ K: '#8a7a6a', H: '#8a7a6a', R: '#6a6458', r: '#4e4a40', B: '#e6c39b' }), true)
    for (let k = 0; k < 2; k++) dot(ctx, 230, 112 + mod(env.t + k / 2, 1) * 6, '#a9c4dc')
  }),
  sp('dl_angry', '성내며 돌아섬', 30, DL_WALK, (ctx, env) => {
    standFig(ctx, 240, 106, pal(), true)
    const puff = mod(env.t, 1)
    withAlpha(ctx, 1 - puff, () => disc(ctx, 242, 100 - puff * 8, 3 + puff * 3, '#d06a50'))
  }),

  sp('dl_stop', '호계 앞의 작별', 26, DL_STREAM, (ctx, env) => {
    const MONK = pal({ K: '#8a7a6a', H: '#8a7a6a', R: '#6a6458', r: '#4e4a40', B: '#e6c39b' })
    standFig(ctx, 156, tiger(160) - 24, MONK)
    const up = Math.sin(env.t * 4) > 0
    px(ctx, 168, tiger(160) - (up ? 18 : 14), 1, 4, '#e6c39b')
  }),
  sp('dl_cross', '함께 건너는 호계', 26, DL_STREAM, (ctx, env) => {
    const f = mod(env.t * 0.06, 1)
    const x = 170 + f * 30
    person(ctx, x, tiger(190) - 16 - Math.sin(f * Math.PI) * 5, '#6a6458')
    person(ctx, x + 6, tiger(190) - 16 - Math.sin(f * Math.PI) * 5, POET_PAL.R)
  }),
  sp('dl_ferry', '배를 띄운 호계', 26, DL_STREAM, (ctx, env) => skiff(ctx, 160, tiger(160) + 6, env.t, { len: 20, guest: POET_PAL.R })),
]

// ════════════════════════════════════════════════════════════
// 李白〈賦得白鷺鷥送宋少府入三峽〉: 강과 멀리 협곡
// ════════════════════════════════════════════════════════════
const BL_WATER = 100

/** 멀리 오른쪽의 협곡과 왼쪽의 낮은 산 */
function blGorge(ctx: Ctx, left: string, right: string, hill: string) {
  fillRows(ctx, 20, BL_WATER, (y) => [196 + (BL_WATER - y) * 0.3, 222 + (y - 20) * 0.2], left)
  fillRows(ctx, 20, BL_WATER, (y) => [262 - (y - 20) * 0.2, 300 + (BL_WATER - y) * 0.3], right)
  ridge(ctx, (x) => 80 + 6 * Math.sin(x * 0.03), hill, undefined, 0, 190, BL_WATER)
}

export const bailuBackground: Background = {
  id: 'hy029',
  drawBack(ctx) {
    sky(ctx, ['#b8c4cc', '#c4ccd0', '#ced2d2'], BL_WATER)
    blGorge(ctx, '#6a766e', '#5e6a62', '#7a8a80')
    water(ctx, BL_WATER, H, '#8aa4aa', '#5e7e86', '#b4cac8')
    // 왼쪽 물가
    fillRows(ctx, 150, H, (y) => [0, 60 + (y - 150) * 2], '#7a7a5a')
    grasses(ctx, 0, 70, 156, { t: 0, wind: 0, fx: {} }, '#8a8a5a', 20, 10)
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    shimmer(ctx, env.t, BL_WATER + 4, 176, 20, '#dce8e8', 60, W)
  },
}

const BL_NEAR = { x: 24, y: 108, w: 128, h: 72 }
const BL_ALL = { x: 0, y: 0, w: 320, h: 180 }
const BL_AIR = { x: 80, y: 30, w: 160, h: 90 }
const BL_GORGE = { x: 176, y: 30, w: 144, h: 81 }

export const BAILU_SPRITES = [
  sp('bl_onefoot', '한 발로 선 백로', 26, BL_NEAR, (ctx) => {
    px(ctx, 86, 140, 1, 10, '#3a3530')
    px(ctx, 84, 136, 3, 1, '#3a3530')
    px(ctx, 82, 131, 9, 6, '#f6f4ee')
    px(ctx, 89, 122, 2, 9, '#f6f4ee')
    px(ctx, 89, 120, 5, 2, '#f6f4ee')
    px(ctx, 94, 121, 4, 1, '#d9a441')
  }),
  sp('bl_dance', '날개 펴고 춤추는 백로', 26, BL_NEAR, (ctx, env) => {
    egret(ctx, 86, 150)
    const up = Math.sin(env.t * 5) > 0
    px(ctx, 70, up ? 132 : 138, 14, 3, '#f6f4ee')
    px(ctx, 90, up ? 132 : 138, 14, 3, '#f6f4ee')
  }),
  sp('bl_dive', '자맥질하는 백로', 26, BL_NEAR, (ctx, env) => {
    const f = mod(env.t * 0.5, 1)
    if (f < 0.5) px(ctx, 84, 140 + f * 16, 8, 4, '#f6f4ee')
    withAlpha(ctx, 1 - f, () => px(ctx, 78 - f * 10, 150, 20 + f * 20, 1, '#eef4f2'))
  }),

  sp('bl_moon', '달 밝은 찬 가을 물', 4, BL_ALL, (ctx) => {
    sky(ctx, ['#1e2840', '#26324e', '#2e3c5a'], BL_WATER)
    moon(ctx, 100, 28, 9)
    blGorge(ctx, '#2a3440', '#222c38', '#2e3a44')
    withAlpha(ctx, 0.45, () => px(ctx, 0, BL_WATER, W, H - BL_WATER, '#20304a'))
    withAlpha(ctx, 0.5, () => {
      for (let y = BL_WATER + 4; y < 176; y += 3) px(ctx, 100 - (y - BL_WATER) * 0.05, y, 4 + (y - BL_WATER) * 0.1, 1, '#f4ecc8')
    })
  }),
  sp('bl_noon', '뜨거운 한낮', 4, BL_ALL, (ctx) => {
    withAlpha(ctx, 0.12, () => px(ctx, 0, 0, W, H, '#f8d060'))
    sun(ctx, 100, 18, 10, '#f8d060')
  }),
  sp('bl_spring', '꽃잎 뜬 봄물', 4, BL_ALL, (ctx) => {
    for (let i = 0; i < 40; i++) px(ctx, 60 + hash(i * 2.1) * 260, BL_WATER + 4 + hash(i * 3.7) * 70, 2, 1, '#f4c4cc')
  }),

  sp('bl_fly', '놀라 나는 백로', 30, BL_AIR, (ctx, env) => {
    const f = mod(env.t * 0.12, 1)
    egret(ctx, 100 + f * 120, 100 - f * 50, env.t, true)
  }),
  sp('bl_approach', '사람에게 다가오는 백로', 30, BL_AIR, (ctx, env) => {
    const f = (Math.sin(env.t * 0.4) + 1) / 2
    egret(ctx, 160 - f * 40, 120)
    person(ctx, 100, 112, POET_PAL.R)
  }),
  sp('bl_doze', '졸고 있는 백로', 30, BL_AIR, (ctx, env) => {
    px(ctx, 150, 104, 10, 6, '#f6f4ee')
    px(ctx, 156, 102, 3, 3, '#f6f4ee')
    px(ctx, 153, 110, 1, 6, '#3a3530')
    const g = mod(env.t * 0.5, 1)
    withAlpha(ctx, 1 - g, () => px(ctx, 162 + g * 6, 98 - g * 8, 3, 1, '#3b2a1d'))
  }),

  sp('bl_rapids', '사군탄으로 가는 백로', 20, BL_GORGE, (ctx, env) => {
    for (let i = 0; i < 20; i++) {
      const y = 70 + hash(i * 2.7) * 30
      const x = 226 + hash(i * 1.3) * 34
      if (Math.sin(env.t * 4 + i) > -0.2) px(ctx, x, y, 4, 1, '#f4f8f8')
    }
    const f = mod(env.t * 0.1, 1)
    egret(ctx, 210 + f * 30, 60 + f * 10, env.t, true)
  }),
  sp('bl_nest', '둥지가 있는 나무', 20, BL_GORGE, (ctx) => {
    px(ctx, 220, 60, 3, 50, '#4a3a2a')
    broadTree(ctx, 221, 70, 1.2, GREEN)
    px(ctx, 212, 54, 18, 4, '#7a5a3a')
  }),
  sp('bl_roof', '마을 지붕 위', 20, BL_GORGE, (ctx) => {
    for (let k = 0; k < 3; k++) {
      px(ctx, 200 + k * 26, 86, 22, 3, '#4a4f57')
      px(ctx, 202 + k * 26, 89, 18, 8, '#c9bfa5')
    }
    egret(ctx, 226, 86)
  }),
]

// ════════════════════════════════════════════════════════════
// 李白〈夏日山中〉: 여름 솔숲, 돌벽, 앉은 시인
// ════════════════════════════════════════════════════════════
const XR_POET = { x: 140, y: 112 } // 앉은 시인 격자 왼쪽 위
const WALL = { x: 14, y: 64, w: 80, h: 96 }

export const xiariBackground: Background = {
  id: 'hy030',
  drawBack(ctx) {
    sky(ctx, ['#b4d0d8', '#c4dad8', '#d2e2d8'], 90)
    for (let k = 0; k < 9; k++) pine(ctx, 10 + k * 38, 116 + (k % 2) * 4, 1.4 + (k % 3) * 0.2)
    fillRows(ctx, 112, H, () => [0, W], (y) => (y < 130 ? '#6a8a4a' : '#5e7e42'))
    // 돌벽
    px(ctx, WALL.x, WALL.y, WALL.w, WALL.h, '#8a8678')
    for (let i = 0; i < 20; i++) px(ctx, WALL.x + hash(i * 2.1) * WALL.w, WALL.y + hash(i * 3.3) * WALL.h, 8, 1, '#6e6a5e')
    px(ctx, 60, 90, 2, 3, '#4a4638') // 못 박힌 자리
    // 앉은 시인 (옷차림·머리는 2·3구 정답이 바꾼다)
    seatFig(ctx, XR_POET.x, XR_POET.y, pal())
  },
  drawFront() {},
  drawDynamic() {},
}

const XR_HAND = { x: 120, y: 92, w: 96, h: 54 }
const XR_BODY = { x: 112, y: 96, w: 96, h: 54 }
const XR_WALL = { x: 16, y: 70, w: 192, h: 108 }
const XR_AIR = { x: 64, y: 40, w: 192, h: 108 }

export const XIARI_SPRITES = [
  sp('xr_feather', '흰 깃털 부채', 26, XR_HAND, (ctx, env) => {
    const a = Math.sin(env.t * 0.8) * 0.15
    for (let k = 0; k < 7; k++) {
      const ang = -1.2 + k * 0.16 + a
      for (let s = 0; s < 9; s++) dot(ctx, 157 + Math.cos(ang) * s, 118 + Math.sin(ang) * s, k % 2 ? '#f8f8f4' : '#e0e0da')
    }
    px(ctx, 156, 118, 1, 6, '#8a6a42')
  }),
  sp('xr_silk', '붉은 비단 부채', 26, XR_HAND, (ctx, env) => {
    const y = 108 + Math.sin(env.t * 6) * 2
    disc(ctx, 160, y, 6, '#c0405a')
    px(ctx, 159, y + 6, 1, 6, '#8a6a42')
  }),
  sp('xr_leaf', '파초잎 부채', 26, XR_HAND, (ctx, env) => {
    const y = 106 + Math.sin(env.t * 5) * 2
    for (let s = 0; s < 14; s++) px(ctx, 158 + s * 0.3, y + s, 6 - Math.abs(s - 7) * 0.6, 1, '#5f9a46')
  }),

  sp('xr_bare', '웃통 벗은 시인', 20, XR_BODY, (ctx) => {
    px(ctx, XR_POET.x + 4, XR_POET.y + 8, 7, 5, '#e6c39b')
    px(ctx, XR_POET.x + 5, XR_POET.y + 9, 1, 2, '#c8a07a')
  }),
  sp('xr_armor', '갑옷 입은 시인', 20, XR_BODY, (ctx) => {
    for (let r = 0; r < 6; r++) px(ctx, XR_POET.x + 3, XR_POET.y + 8 + r, 9, 1, r % 2 ? '#8a8e96' : '#6a6e76')
  }),
  sp('xr_fur', '털옷 입은 시인', 20, XR_BODY, (ctx) => {
    for (let i = 0; i < 30; i++) dot(ctx, XR_POET.x + 2 + hash(i) * 12, XR_POET.y + 8 + hash(i * 3) * 8, i % 2 ? '#8a6a42' : '#a88a5a')
  }),

  sp('xr_hang', '돌벽에 건 두건', 30, XR_WALL, (ctx) => {
    px(ctx, 56, 92, 10, 4, '#1f1d22')
    px(ctx, 58, 90, 6, 2, '#1f1d22')
    px(ctx, 60, 96, 2, 6, '#1f1d22')
    // 두건 벗은 머리 (상투)
    px(ctx, XR_POET.x + 5, XR_POET.y, 5, 3, '#26232a')
    px(ctx, XR_POET.x + 6, XR_POET.y - 2, 3, 2, '#26232a')
  }),
  sp('xr_wear', '단단히 쓴 두건', 30, XR_WALL, (ctx) => {
    px(ctx, XR_POET.x + 5, XR_POET.y - 1, 6, 3, '#0e0c10')
    px(ctx, XR_POET.x + 4, XR_POET.y + 1, 8, 1, '#0e0c10')
  }),
  sp('xr_throw', '냇물에 던진 두건', 30, XR_WALL, (ctx, env) => {
    fillRows(ctx, 160, 172, () => [20, 200], '#7aa0a8')
    const x = 40 + mod(env.t * 10, 150)
    px(ctx, x, 162, 8, 3, '#1f1d22')
    px(ctx, XR_POET.x + 5, XR_POET.y, 5, 3, '#26232a')
  }),

  sp('xr_wind', '맨머리의 솔바람', 40, XR_AIR, (ctx, env) => {
    for (let k = 0; k < 8; k++) {
      const f = mod(env.t * 0.4 + k / 8, 1)
      const y = 60 + k * 9
      withAlpha(ctx, Math.sin(f * Math.PI) * 0.8, () => {
        for (let s = 0; s < 16; s++) dot(ctx, 80 + f * 140 + s * 2, y + Math.sin(s * 0.6 + env.t * 2) * 1.5, '#f4faf4')
      })
    }
    for (let k = 1; k <= 3; k++) dot(ctx, XR_POET.x + 4 - k, XR_POET.y + 1 + Math.round(Math.sin(env.t * 8 - k)), '#26232a')
  }),
  sp('xr_shower', '쏟아지는 소나기', 40, XR_AIR, (ctx, env) => {
    veil(ctx, 0.15, '#4a5660')
    rain(ctx, env.t, 100, 150, 'rgba(210,222,230,0.75)')
  }),
  sp('xr_sun', '내리쬐는 땡볕', 40, XR_AIR, (ctx, env) => {
    withAlpha(ctx, 0.15, () => px(ctx, 0, 0, W, H, '#f8d060'))
    sun(ctx, 120, 20, 12, '#f8d060')
    for (let k = 0; k < 8; k++) px(ctx, 80 + k * 24, 120 + Math.sin(env.t * 4 + k) * 2, 12, 1, 'rgba(255,240,200,0.6)')
  }),
]

// ════════════════════════════════════════════════════════════
// 李白〈觀放白鷹〉: 가을 변방 들판, 매를 든 사냥꾼
// ════════════════════════════════════════════════════════════
const BY_GROUND = 120
const HAND = { x: 52, y: 120 } // 사냥꾼의 팔 끝

export const baiyingBackground: Background = {
  id: 'hy031',
  drawBack(ctx) {
    sky(ctx, ['#b8c4d0', '#c8ced2', '#d8d6cc'], BY_GROUND)
    ridge(ctx, (x) => 100 + 8 * Math.sin(x * 0.015 + 1) + 3 * Math.sin(x * 0.07), '#8a8a7a', '#98988a', 0, W, BY_GROUND)
    fillRows(ctx, BY_GROUND - 4, H, () => [0, W], (y) => ((y - BY_GROUND) % 8 === 0 ? '#b8a468' : '#c8b478'))
    standFig(ctx, 30, 128, pal({ K: '#5a4a3a', R: '#7a5a3a', r: '#5a4028', L: '#b2352a' }))
    px(ctx, 42, 134, 6, 2, '#7a5a3a')
    px(ctx, 48, 128, 2, 6, '#7a5a3a')
    px(ctx, HAND.x - 4, HAND.y + 6, 4, 3, '#5a4632')
  },
  drawFront() {},
  drawDynamic() {},
}

const BY_ALL = { x: 0, y: 40, w: 320, h: 140 }
const BY_HAND = { x: 8, y: 84, w: 112, h: 63 }
const BY_SKY = { x: 80, y: 0, w: 176, h: 99 }
const BY_FAR = { x: 112, y: 60, w: 208, h: 117 }

/** 매 (앉은 모습) */
function hawk(ctx: Ctx, x: number, y: number, body: string, dark: string) {
  px(ctx, x - 2, y - 7, 6, 7, body)
  px(ctx, x + 1, y - 10, 4, 3, body)
  dot(ctx, x + 5, y - 9, '#d9a441')
  dot(ctx, x + 3, y - 9, '#1f1d22')
  px(ctx, x - 3, y - 6, 2, 6, dark)
  px(ctx, x - 1, y, 1, 2, '#d9a441')
  px(ctx, x + 2, y, 1, 2, '#d9a441')
}

export const BAIYING_SPRITES = [
  sp('by_wind', '변방의 높은 바람', 10, BY_ALL, (ctx, env) => {
    for (let i = 0; i < 40; i++) {
      const x = mod(hash(i * 2.1) * W + env.t * (40 + hash(i) * 30), W + 20) - 20
      const y = 50 + hash(i * 3.7) * 120
      px(ctx, x, y, 8 + hash(i) * 10, 1, 'rgba(244,240,224,0.7)')
    }
    grasses(ctx, 0, W, 178, { ...env, wind: 1 }, '#a89058', 60, 10)
  }),
  sp('by_calm', '잔잔한 봄날', 10, BY_ALL, (ctx) => {
    for (let i = 0; i < 40; i++) flower(ctx, hash(i * 2.3) * W, 130 + hash(i * 1.9) * 46, i % 2 ? '#f0a0b4' : '#f4e080', '#e8c050')
  }),
  sp('by_rain', '장맛비', 10, BY_ALL, (ctx, env) => {
    veil(ctx, 0.18, '#4a5660')
    rain(ctx, env.t, 110, 150, 'rgba(210,222,230,0.75)')
  }),

  sp('by_white', '흰 비단 깃털의 매', 24, BY_HAND, (ctx) => hawk(ctx, HAND.x, HAND.y + 6, '#f6f4ee', '#d8d4c8')),
  sp('by_black', '검은 매', 24, BY_HAND, (ctx) => hawk(ctx, HAND.x, HAND.y + 6, '#2a2622', '#1a1612')),
  sp('by_red', '붉은 매', 24, BY_HAND, (ctx) => hawk(ctx, HAND.x, HAND.y + 6, '#b8603a', '#8a4024')),

  sp('by_soar', '한 조각 눈 같은 매', 30, BY_SKY, (ctx, env) => {
    const a = env.t * 0.5
    const x = 170 + Math.cos(a) * 30
    const y = 36 + Math.sin(a) * 10
    px(ctx, x - 3, y, 7, 1, '#ffffff')
    px(ctx, x - 1, y - 1, 3, 3, '#ffffff')
  }),
  sp('by_flock', '떼 지어 나는 새', 30, BY_SKY, (ctx, env) => {
    for (let k = 0; k < 9; k++) bird(ctx, 120 + k * 12 + Math.sin(env.t + k) * 3, 30 + (k % 3) * 8, Math.floor(env.t * 6 + k) % 2, '#3e3a36')
  }),
  sp('by_land', '땅에 내려앉은 매', 30, { x: 112, y: 80, w: 128, h: 72 }, (ctx) => hawk(ctx, 170, 128, '#f6f4ee', '#d8d4c8')),

  sp('by_sight', '백 리를 보는 눈', 36, BY_FAR, (ctx, env) => {
    // 멀리 마른 풀 사이의 작은 토끼
    const hx = 270
    const hy = 150
    px(ctx, hx, hy, 5, 3, '#8a7a5a')
    px(ctx, hx + 4, hy - 2, 2, 2, '#8a7a5a')
    dot(ctx, hx + 4, hy - 4, '#8a7a5a')
    if (Math.sin(env.t * 3) > 0) {
      for (let k = 0; k < 4; k++) dot(ctx, hx + 2 + Math.cos(k * 1.6) * 6, hy + Math.sin(k * 1.6) * 4, '#f4efe2')
    }
    // 하늘의 매에서 내려오는 시선
    const a = env.t * 0.5
    const sx = 170 + Math.cos(a) * 30
    const sy = 36 + Math.sin(a) * 10
    for (let s = 0; s < 1; s += 0.04) if (Math.floor(s * 25 + env.t * 4) % 2) dot(ctx, sx + (hx - sx) * s, sy + (hy - sy) * s, 'rgba(255,255,255,0.6)')
  }),
  sp('by_sleep', '눈 감고 조는 매', 36, BY_SKY, (ctx, env) => {
    px(ctx, 170, 40, 7, 1, '#ffffff')
    px(ctx, 172, 39, 3, 3, '#ffffff')
    const g = mod(env.t * 0.5, 1)
    withAlpha(ctx, 1 - g, () => {
      px(ctx, 180 + g * 8, 34 - g * 10, 4, 1, '#3b2a1d')
      dot(ctx, 182 + g * 8, 35 - g * 10, '#3b2a1d')
      px(ctx, 180 + g * 8, 36 - g * 10, 4, 1, '#3b2a1d')
    })
  }),
  sp('by_miss', '놓쳐 버린 먹이', 36, BY_FAR, (ctx, env) => {
    const f = mod(env.t * 0.3, 1)
    const x = 250 + f * 40
    px(ctx, x, 150, 5, 3, '#8a7a5a')
    disc(ctx, 296, 154, 4, '#3a2e1e')
    drift(ctx, env.t, { x: 240, y: 140, w: 60, h: 20 }, 4, '#c8b478', 0.5, 7)
  }),
]
