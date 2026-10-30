// 『唐詩畫意』 卷八 첫 묶음 (2): 王維〈欹湖〉〈欒家瀨〉〈北垞〉〈鸕鷀堰〉
import type { Background } from '../types'
import { H, W, disc, dot, fillRows, hash, mod, px } from '../pixel'
import type { Ctx } from '../pixel'
import { GREEN, bird, broadTree, mistBands, rain, ridge, sky, snowfall, sparkle, stars, veil, withAlpha } from '../kit'
import { POET_PAL, drawFigure, pal, standFig } from '../figures'
import { cattails, cormorant, egret, lotusFlower, lotusPad, notes, shimmer, skiff, sp, stone, sun, water } from './hy_kit'

// ════════════════════════════════════════════════════════════
// 王維〈欹湖〉: 산을 두른 호수. 하늘빛은 2구의 정답이 정한다
// ════════════════════════════════════════════════════════════
const QH_WATER = 96
const qhMount = (x: number) => 52 + 16 * Math.sin(x * 0.018 + 3.6) + 5 * Math.sin(x * 0.07)

export const qihuBackground: Background = {
  id: 'hy006',
  drawBack(ctx) {
    sky(ctx, ['#cbd2d4', '#d4d9d8', '#dde0da'], QH_WATER)
    ridge(ctx, qhMount, '#6f8a78', '#7f9a86', 0, W, QH_WATER)
    ridge(ctx, (x) => 80 + 6 * Math.sin(x * 0.03 + 1), '#5a7464', '#688270', 0, W, QH_WATER)
    water(ctx, QH_WATER, H, '#97b2b0', '#6a8e90', '#c0d4ce')
    // 먼 물가 (極浦)
    px(ctx, 180, QH_WATER, 140, 3, '#8a9a78')
  },
  drawFront(ctx) {
    ridge(ctx, (x) => (x > 110 ? H : 164 + (110 - x) * 0.05 - 0), '#6a7656', '#80906a')
  },
  drawDynamic(ctx, env) {
    shimmer(ctx, env.t, QH_WATER + 6, 160, 22)
  },
}

const QH_BOAT = { x: 160, y: 66, w: 144, h: 81 }
const QH_SKY = { x: 0, y: 0, w: 320, h: 180 }
const QH_NEAR = { x: 0, y: 92, w: 160, h: 88 }
const QH_MT = { x: 120, y: 10, w: 200, h: 113 }

export const QIHU_SPRITES = [
  sp('qh_flute', '퉁소 소리', 24, QH_BOAT, (ctx, env) => {
    skiff(ctx, 236, 110, env.t * 0.5, { guest: '#6b5a7a', len: 24 })
    notes(ctx, 244, 96, env.t)
  }),
  sp('qh_horn', '나팔 소리', 24, QH_BOAT, (ctx, env) => {
    skiff(ctx, 236, 110, env.t * 0.5, { guest: '#6b5a7a', len: 24 })
    px(ctx, 243, 100, 8, 1, '#c9a441')
    px(ctx, 250, 98, 3, 5, '#c9a441')
    const f = mod(env.t, 1)
    withAlpha(ctx, 1 - f, () => px(ctx, 254 + f * 10, 99, 4, 3, '#c9a441'))
  }),
  sp('qh_pipa', '비파 소리', 24, QH_BOAT, (ctx, env) => {
    skiff(ctx, 236, 110, env.t * 0.5, { guest: '#6b5a7a', len: 24 })
    disc(ctx, 244, 103, 3, '#8a5a32')
    px(ctx, 245, 95, 1, 6, '#5a3d28')
    notes(ctx, 248, 94, env.t * 1.6, '#8a5a32')
  }),

  sp('qh_dusk', '해 질 녘', 2, QH_SKY, (ctx) => {
    sky(ctx, ['#b8a8b4', '#d6a898', '#e8b88a', '#f0c88a'], QH_WATER)
    sun(ctx, 210, 62, 7, '#f0a050', '#ffd090')
    ridge(ctx, qhMount, '#5e6a66', '#6a7670', 0, W, QH_WATER)
    ridge(ctx, (x) => 80 + 6 * Math.sin(x * 0.03 + 1), '#4c5a54', '#56645e', 0, W, QH_WATER)
    withAlpha(ctx, 0.25, () => px(ctx, 0, QH_WATER, W, H - QH_WATER, '#e89a5a'))
  }),
  sp('qh_dawn', '동틀 무렵', 2, QH_SKY, (ctx) => {
    sky(ctx, ['#c8d0e0', '#e0d0dc', '#f2dccc', '#f6e8d0'], QH_WATER)
    ridge(ctx, qhMount, '#7a8e96', '#8a9ea4', 0, W, QH_WATER)
    ridge(ctx, (x) => 80 + 6 * Math.sin(x * 0.03 + 1), '#687c84', '#728890', 0, W, QH_WATER)
    withAlpha(ctx, 0.15, () => px(ctx, 0, QH_WATER, W, H - QH_WATER, '#f6d4c8'))
  }),
  sp('qh_night', '한밤중', 2, QH_SKY, (ctx, env) => {
    sky(ctx, ['#1c2238', '#222a44', '#2a3250'], QH_WATER)
    stars(ctx, 40, 7, 0, 60, env.t)
    ridge(ctx, qhMount, '#1e2a30', '#26343a', 0, W, QH_WATER)
    ridge(ctx, (x) => 80 + 6 * Math.sin(x * 0.03 + 1), '#18222a', undefined, 0, W, QH_WATER)
    withAlpha(ctx, 0.55, () => px(ctx, 0, QH_WATER, W, H - QH_WATER, '#182030'))
  }),

  sp('qh_lookback', '뒤돌아보는 시인', 30, QH_NEAR, (ctx, env) => {
    skiff(ctx, 70, 150, env.t * 0.4, { rower: false, len: 30 })
    const back = Math.sin(env.t * 0.5) > -0.3
    drawFigure(ctx, 62, 125, POET_PAL, env, { flip: !back })
  }),
  sp('qh_weep', '엎드려 우는 사람', 30, QH_NEAR, (ctx, env) => {
    skiff(ctx, 70, 150, env.t * 0.4, { rower: false, len: 30 })
    px(ctx, 60, 140, 14, 5, POET_PAL.R)
    px(ctx, 72, 138, 4, 4, POET_PAL.S)
    px(ctx, 72, 137, 4, 1, POET_PAL.K)
    for (let k = 0; k < 2; k++) {
      const f = mod(env.t + k / 2, 1)
      dot(ctx, 76, 140 + f * 6, '#a9c4dc')
    }
  }),
  sp('qh_dance', '노래하며 춤추는 사람', 30, QH_NEAR, (ctx, env) => {
    skiff(ctx, 70, 150, env.t * 0.4, { rower: false, len: 30 })
    const bob = Math.round(Math.sin(env.t * 6))
    standFig(ctx, 62, 125 + bob, pal(), Math.sin(env.t * 3) > 0)
    notes(ctx, 76, 124, env.t, '#b2352a')
  }),

  sp('qh_cloud', '흰 구름을 감은 푸른 산', 10, QH_MT, (ctx, env) => {
    const o = Math.sin(env.t * 0.25) * 6
    for (const [x, y, w] of [[150, 46, 70], [196, 38, 90], [176, 56, 110], [240, 50, 70]] as const) {
      px(ctx, x + o, y, w, 4, '#f8f8f2')
      px(ctx, x + 8 + o, y - 2, w - 16, 2, '#f8f8f2')
      px(ctx, x + 4 + o, y + 4, w - 8, 1, '#dcdcd4')
    }
  }),
  sp('qh_red', '붉게 물든 산', 10, QH_MT, (ctx) => {
    for (let i = 0; i < 240; i++) {
      const x = 120 + hash(i * 1.9) * 200
      const y = qhMount(x) + 2 + hash(i * 3.3) * (QH_WATER - qhMount(x) - 4)
      px(ctx, x, y, 2, 1, i % 3 ? '#c8662a' : '#a8402a')
    }
  }),
  sp('qh_rain', '비에 가린 산', 10, QH_MT, (ctx, env) => {
    withAlpha(ctx, 0.7, () => px(ctx, 120, 0, 200, QH_WATER, '#b8c0c4'))
    ctx.save()
    ctx.beginPath()
    ctx.rect(120, 0, 200, QH_WATER)
    ctx.clip()
    rain(ctx, env.t, 80, 140, 'rgba(120,135,145,0.8)')
    ctx.restore()
  }),
]

// ════════════════════════════════════════════════════════════
// 王維〈欒家瀨〉: 돌이 깔린 여울 바닥. 물은 2구의 정답이 채운다
// ════════════════════════════════════════════════════════════
/** 여울 물길의 좌우 경계 (오른쪽 위에서 왼쪽 아래로) */
const ljBanks = (y: number): [number, number] => {
  const f = (y - 60) / 120
  return [200 - f * 170 + Math.sin(y * 0.08) * 4, 270 - f * 120 + Math.sin(y * 0.07) * 4]
}
const LJ_ROCKS = [
  [236, 74, 5], [222, 92, 6], [200, 104, 7], [176, 118, 8], [150, 132, 7], [190, 126, 6], [130, 150, 9], [106, 166, 8], [160, 160, 7], [220, 110, 5],
] as const

function ljBase(ctx: Ctx) {
  sky(ctx, ['#b8c0bc', '#c2c8c0', '#cacec4'], 70)
  ridge(ctx, (x) => 40 + 10 * Math.sin(x * 0.02 + 1) + 4 * Math.sin(x * 0.08), '#7a8a7a', '#889888', 0, W, 70)
  // 양쪽 기슭
  fillRows(ctx, 56, H, () => [0, W], (y) => (y < 90 ? '#7a7a5a' : '#6a6a4c'))
  fillRows(ctx, 60, H, ljBanks, '#8a8a7e')
  for (let i = 0; i < 90; i++) {
    const y = 62 + hash(i * 2.1) * 118
    const [a, b] = ljBanks(y)
    dot(ctx, a + hash(i * 4.4) * (b - a), y, i % 2 ? '#9a9a8c' : '#76766a')
  }
}
function ljRocks(ctx: Ctx) {
  for (const [x, y, r] of LJ_ROCKS) stone(ctx, x, y, r, '#a8a49a', '#7e7a70')
}
function ljTrees(ctx: Ctx) {
  for (let i = 0; i < 7; i++) broadTree(ctx, 10 + i * 22, 92 - (i % 2) * 4, 0.9, { dark: '#5a5a32', base: '#7a6a3a', light: '#9a8a4a' })
  for (let i = 0; i < 5; i++) broadTree(ctx, 268 + i * 12, 120 + i * 10, 0.9, { dark: '#5a5a32', base: '#7a6a3a', light: '#9a8a4a' })
}
/** 여울물: 경계 안을 채우고 흰 물살이 흘러내린다 */
function ljWater(ctx: Ctx, t: number) {
  fillRows(ctx, 60, H, ljBanks, (y) => (y % 7 === 0 ? '#8eaab0' : '#6e9098'))
  for (let i = 0; i < 40; i++) {
    const f = mod(hash(i * 3.3) + t * 0.25, 1)
    const y = 62 + f * 116
    const [a, b] = ljBanks(y)
    const x = a + hash(i * 1.7) * (b - a)
    px(ctx, x, y, 4, 1, '#eef4f2')
    dot(ctx, x - 1, y + 1, '#d0e0e0')
  }
}

export const luanjialaiBackground: Background = {
  id: 'hy007',
  drawBack(ctx) {
    ljBase(ctx)
  },
  drawFront(ctx) {
    ljTrees(ctx)
  },
  drawDynamic() {},
}

/** 裴迪〈欒家瀨〉용: 같은 여울에 물이 흐르고, 왼쪽 아래에 나루가 있다 */
export const peiLuanjialaiBackground: Background = {
  id: 'hy013',
  drawBack(ctx) {
    ljBase(ctx)
  },
  drawFront(ctx) {
    ljTrees(ctx)
    // 남쪽 나루 (南津)
    px(ctx, 24, 162, 40, 3, '#8a6a42')
    for (let k = 0; k < 4; k++) px(ctx, 26 + k * 12, 165, 2, 10, '#5a4632')
    px(ctx, 60, 150, 2, 14, '#5a4632')
  },
  drawDynamic(ctx, env) {
    ljWater(ctx, env.t)
    ljRocks(ctx)
  },
}

const LJ_ALL = { x: 0, y: 0, w: 320, h: 180 }
const LJ_FLOW = { x: 40, y: 54, w: 240, h: 126 }
const LJ_SPLASH = { x: 104, y: 80, w: 144, h: 81 }
const LJ_EGRET = { x: 200, y: 40, w: 120, h: 68 }

export const LUANJIALAI_SPRITES = [
  sp('lj_rain', '쏴쏴 가을비', 40, LJ_ALL, (ctx, env) => {
    veil(ctx, 0.18, '#5a6670')
    rain(ctx, env.t, 110, 150, 'rgba(220,230,236,0.75)', 5, -2)
  }),
  sp('lj_snow', '펑펑 함박눈', 40, LJ_ALL, (ctx, env) => {
    veil(ctx, 0.12, '#e8eef2')
    snowfall(ctx, env.t, 90)
  }),
  sp('lj_sun', '쨍쨍한 햇살', 40, LJ_ALL, (ctx, env) => {
    sun(ctx, 60, 24, 9)
    withAlpha(ctx, 0.12 + 0.04 * Math.sin(env.t), () => {
      for (let k = 0; k < 5; k++) fillRows(ctx, 30, H, (y) => [60 + k * 40 + (y - 30) * 0.5, 74 + k * 40 + (y - 30) * 0.6], '#fff2c0')
    })
  }),

  sp('lj_rapids', '돌 사이로 쏟아지는 여울', 8, LJ_FLOW, (ctx, env) => {
    ljWater(ctx, env.t)
    ljRocks(ctx)
  }),
  sp('lj_pond', '고요히 고인 연못', 8, LJ_FLOW, (ctx) => {
    fillRows(ctx, 60, H, ljBanks, '#7a9aa0')
    for (let i = 0; i < 20; i++) {
      const y = 64 + hash(i * 2.7) * 112
      const [a, b] = ljBanks(y)
      px(ctx, a + 6 + hash(i) * (b - a - 16), y, 8, 1, '#a8c4c4')
    }
  }),
  sp('lj_dry', '바닥이 드러난 마른 내', 8, LJ_FLOW, (ctx) => {
    ljRocks(ctx)
    for (let i = 0; i < 60; i++) {
      const y = 62 + hash(i * 1.3) * 116
      const [a, b] = ljBanks(y)
      px(ctx, a + hash(i * 3.9) * (b - a), y, 3, 1, '#b8ae94')
    }
  }),

  sp('lj_splash', '서로 튀는 물방울', 20, LJ_SPLASH, (ctx, env) => {
    for (const [x, y] of [[176, 118], [150, 132], [190, 126], [200, 104]] as const) {
      for (let k = 0; k < 6; k++) {
        const f = mod(env.t * 1.4 + k / 6 + x * 0.01, 1)
        const a = -Math.PI / 2 + (k - 2.5) * 0.45
        dot(ctx, x + Math.cos(a) * f * 12, y - 6 + Math.sin(a) * f * 10 + f * f * 10, '#f4f8f6')
      }
    }
  }),
  sp('lj_ice', '떠내려가는 얼음 조각', 20, LJ_SPLASH, (ctx, env) => {
    for (let i = 0; i < 5; i++) {
      const f = mod(env.t * 0.08 + i / 5, 1)
      const y = 80 + f * 80
      const [a, b] = ljBanks(y)
      px(ctx, a + (b - a) * 0.4, y, 10, 4, '#e8f2f6')
      px(ctx, a + (b - a) * 0.4 + 1, y + 4, 8, 1, '#b8ccd4')
    }
  }),
  sp('lj_fish', '뛰어오르는 물고기', 20, LJ_SPLASH, (ctx, env) => {
    for (let i = 0; i < 3; i++) {
      const f = mod(env.t * 0.7 + i / 3, 1)
      const x = 140 + i * 24 + f * 12
      const y = 132 - Math.sin(f * Math.PI) * 18
      px(ctx, x, y, 5, 2, '#c0b090')
      dot(ctx, x - 1, y - 1, '#c0b090')
      dot(ctx, x - 1, y + 2, '#c0b090')
    }
  }),

  sp('lj_egret', '놀랐다 내려앉는 백로', 30, LJ_EGRET, (ctx, env) => {
    const f = mod(env.t * 0.22, 1)
    if (f < 0.25 || f > 0.85) egret(ctx, 246, 82)
    else {
      const g = (f - 0.25) / 0.6
      egret(ctx, 246 + Math.sin(g * Math.PI) * 18, 82 - Math.sin(g * Math.PI) * 30, env.t, true)
    }
  }),
  sp('lj_away', '물고기 물고 떠나는 백로', 30, LJ_EGRET, (ctx, env) => {
    const f = mod(env.t * 0.1, 1)
    const x = 240 + f * 90
    const y = 76 - f * 40
    egret(ctx, x, y, env.t, true)
    px(ctx, x + 7, y - 7, 4, 2, '#c0c8cc')
  }),
  sp('lj_doze', '둥지에서 조는 백로', 30, LJ_EGRET, (ctx) => {
    px(ctx, 268, 40, 3, 60, '#4a3a2a')
    px(ctx, 244, 60, 40, 2, '#4a3a2a')
    px(ctx, 250, 56, 22, 4, '#7a5a3a')
    px(ctx, 254, 50, 12, 6, '#f6f4ee')
    px(ctx, 262, 48, 4, 3, '#f6f4ee')
  }),
]

// ════════════════════════════════════════════════════════════
// 王維〈北垞〉: 호수, 멀리 남쪽 들판과 푸른 숲 (냇물은 3구 정답)
// ════════════════════════════════════════════════════════════
const BT_LAKE = 96

export const beituoBackground: Background = {
  id: 'hy008',
  drawBack(ctx) {
    sky(ctx, ['#c9d6d8', '#d6e0dc', '#e0e6dc'], 52)
    // 남쪽 들판
    fillRows(ctx, 52, BT_LAKE, () => [0, W], (y) => (y < 70 ? '#9aac7e' : '#8a9e70'))
    for (let i = 0; i < 40; i++) px(ctx, hash(i * 2.9) * W, 54 + hash(i * 5.3) * 40, 6, 1, '#a8b88a')
    // 푸른 숲 (青林)
    for (let i = 0; i < 30; i++) broadTree(ctx, 150 + i * 6 + hash(i) * 4, 70 + hash(i * 3) * 4, 0.55, GREEN)
    water(ctx, BT_LAKE, H, '#98b6b2', '#6a9090', '#c4d8d0')
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    shimmer(ctx, env.t, BT_LAKE + 6, 175, 22, '#e6f0ea', 160, W)
  },
}

const BT_SHORE = { x: 0, y: 96, w: 160, h: 84 }
const BT_RIVER = { x: 140, y: 40, w: 180, h: 101 }
const BT_EDGE = { x: 170, y: 40, w: 128, h: 72 }

/** 북타 기슭 (1구 정답이 그린다) */
function shoreLand(ctx: Ctx) {
  ridge(ctx, (x) => (x > 170 ? H : 128 - 14 * Math.sin((x / 170) * Math.PI) + 3 * Math.sin(x * 0.1)), '#6e7e56', '#86966a')
  for (let i = 0; i < 6; i++) broadTree(ctx, 20 + i * 22, 122 - Math.sin(((20 + i * 22) / 170) * Math.PI) * 10, 0.9, GREEN)
}

export const BEITUO_SPRITES = [
  sp('bt_shore', '호수 북쪽 기슭', 14, BT_SHORE, (ctx) => shoreLand(ctx)),
  sp('bt_island', '호수 한가운데 섬', 14, BT_SHORE, (ctx) => {
    fillRows(ctx, 124, 140, (y) => [70 - (140 - y) * 2, 130 + (140 - y) * 1.5], '#7a8a5e')
    broadTree(ctx, 100, 126, 0.9, GREEN)
  }),
  sp('bt_peak', '높은 산꼭대기', 14, BT_SHORE, (ctx) => {
    fillRows(ctx, 96, H, (y) => [80 - (y - 96) * 0.9, 80 + (y - 96) * 0.9], (y) => (y < 104 ? '#eef0ee' : '#6a7464'))
  }),

  sp('bt_rail', '나무가 어린 붉은 난간', 22, BT_SHORE, (ctx, env) => {
    px(ctx, 16, 138, 130, 2, '#b2352a')
    for (let k = 0; k < 14; k++) px(ctx, 18 + k * 9, 140, 1, 8, '#8a2a20')
    px(ctx, 16, 147, 130, 1, '#b2352a')
    // 물에 어린 나무 그림자
    withAlpha(ctx, 0.35, () => {
      for (let i = 0; i < 6; i++) {
        const w = Math.sin(env.t * 1.5 + i) * 1.5
        px(ctx, 22 + i * 22 + w, 152, 10, 6, '#3e5a38')
      }
    })
  }),
  sp('bt_wall', '흰 담장', 22, BT_SHORE, (ctx) => {
    px(ctx, 16, 132, 130, 14, '#ece6d6')
    px(ctx, 14, 129, 134, 3, '#5a5f66')
  }),
  sp('bt_fence', '대나무 울타리', 22, BT_SHORE, (ctx) => {
    for (let k = 0; k < 30; k++) px(ctx, 16 + k * 4, 134, 2, 14, k % 2 ? '#a8a060' : '#8a8a4a')
    px(ctx, 16, 138, 120, 1, '#6a6a3a')
  }),

  sp('bt_winding', '구불구불한 냇물', 10, BT_RIVER, (ctx) => {
    for (let y = 54; y < BT_LAKE; y++) {
      const x = 230 + Math.sin(y * 0.18) * 30 - (y - 54) * 0.6
      px(ctx, x, y, 6 + (y - 54) * 0.12, 1, '#a8c8d0')
    }
  }),
  sp('bt_straight', '곧게 뻗은 냇물', 10, BT_RIVER, (ctx) => {
    for (let y = 54; y < BT_LAKE; y++) px(ctx, 236 - (y - 54) * 1.2, y, 5 + (y - 54) * 0.1, 1, '#a8c8d0')
  }),
  sp('bt_fall', '폭포로 떨어지는 물', 10, BT_RIVER, (ctx, env) => {
    px(ctx, 220, 46, 40, 40, '#6a6a5e')
    for (let y = 46; y < 90; y++) px(ctx, 234, y, 8, 1, (y + Math.floor(env.t * 20)) % 4 ? '#e4eef0' : '#b8d0d8')
    for (let k = 0; k < 6; k++) dot(ctx, 230 + k * 3, 90 + hash(k + Math.floor(env.t * 6)) * 4, '#f4f8f8')
  }),

  sp('bt_glint', '숲 끝에서 반짝이는 물빛', 16, BT_EDGE, (ctx, env) => {
    for (let k = 0; k < 6; k++) {
      const on = Math.sin(env.t * 2.4 + k * 1.7) > 0.3
      if (on) sparkle(ctx, 190 + k * 16, 64 + (k % 3) * 5, '#ffffff', k % 2 === 0)
    }
  }),
  sp('bt_fog', '숲을 덮은 안개', 16, BT_EDGE, (ctx, env) => {
    ctx.save()
    ctx.beginPath()
    ctx.rect(150, 40, 170, 60)
    ctx.clip()
    mistBands(ctx, env.t, [58, 66, 74, 82], '#f2f4f2', 0.7)
    ctx.restore()
  }),
  sp('bt_frozen', '꽁꽁 언 물', 16, BT_EDGE, (ctx) => {
    for (let k = 0; k < 6; k++) px(ctx, 186 + k * 18, 66 + (k % 3) * 4, 12, 3, '#eef6fa')
  }),
]

// ════════════════════════════════════════════════════════════
// 王維〈鸕鷀堰〉: 연못과 돌로 쌓은 둑(堰)
// ════════════════════════════════════════════════════════════
const LC_WATER = 84

export const luciyanBackground: Background = {
  id: 'hy009',
  drawBack(ctx) {
    sky(ctx, ['#cfd8d0', '#d9e0d6', '#e2e6da'], LC_WATER)
    ridge(ctx, (x) => 62 + 8 * Math.sin(x * 0.025 + 0.4), '#8aa08a', '#98ae98', 0, W, LC_WATER)
    for (let i = 0; i < 16; i++) broadTree(ctx, 6 + i * 21, LC_WATER - 2, 0.6, GREEN)
    water(ctx, LC_WATER, H, '#9ab8a8', '#6a9284', '#c4d8c8')
  },
  drawFront(ctx) {
    // 둑
    fillRows(ctx, 118, 128, (y) => [180 + (128 - y) * 0.5, W], (y) => (y < 121 ? '#a8a08c' : '#8a8272'))
    for (let k = 0; k < 14; k++) px(ctx, 184 + k * 10, 121, 1, 7, '#6e6858')
  },
  drawDynamic(ctx, env) {
    shimmer(ctx, env.t, LC_WATER + 4, 176, 24, '#e6f0e8')
  },
}

const LC_LEFT = { x: 0, y: 92, w: 144, h: 81 }
const LC_MID = { x: 96, y: 84, w: 144, h: 81 }
const LC_WEIR = { x: 176, y: 70, w: 112, h: 63 }
const LC_RIGHT = { x: 192, y: 112, w: 128, h: 68 }

/** 자맥질 물결 */
function diveRings(ctx: Ctx, x: number, y: number, t: number) {
  for (let k = 0; k < 2; k++) {
    const f = mod(t * 0.6 + k / 2, 1)
    withAlpha(ctx, 1 - f, () => px(ctx, x - 3 - f * 10, y, 6 + f * 20, 1, '#eef4f0'))
  }
}

export const LUCIYAN_SPRITES = [
  sp('lc_lotus', '붉은 연꽃 속 자맥질', 18, LC_LEFT, (ctx, env) => {
    for (let i = 0; i < 12; i++) {
      const x = 14 + hash(i * 3.1) * 110
      const y = 112 + hash(i * 1.7) * 50
      lotusPad(ctx, x, y, 5)
      if (i % 2) lotusFlower(ctx, x + 1, y - 3, '#d0405a', '#ec8a9a')
    }
    diveRings(ctx, 70, 138, env.t)
    const f = mod(env.t * 0.4, 1)
    if (f < 0.3) px(ctx, 68, 132 + f * 20, 4, 3, '#24262a')
  }),
  sp('lc_willow', '버드나무 그늘', 18, LC_LEFT, (ctx, env) => {
    px(ctx, 30, 90, 4, 60, '#4a3a2a')
    for (let i = 0; i < 14; i++) for (let k = 0; k < 30; k++) dot(ctx, 20 + i * 5 + (k * k) / 120, 96 + k, k % 3 ? '#7aa04a' : '#9abc62')
    diveRings(ctx, 80, 140, env.t)
  }),
  sp('lc_pool', '깊은 바위 웅덩이', 18, LC_LEFT, (ctx, env) => {
    for (let i = 0; i < 5; i++) stone(ctx, 30 + i * 22, 150 - (i % 2) * 8, 10, '#8a8678', '#6a665a')
    px(ctx, 50, 152, 60, 10, '#3e5a58')
    diveRings(ctx, 80, 156, env.t)
  }),

  sp('lc_cattail', '부들 사이로 솟는 새', 22, LC_MID, (ctx, env) => {
    cattails(ctx, 120, 210, 150, env, 16, 24)
    const f = mod(env.t * 0.35, 1)
    const x = 150 + f * 60
    const y = 130 - Math.sin(f * Math.PI) * 40
    bird(ctx, x, y, Math.floor(env.t * 8) % 2, '#24262a')
    px(ctx, x - 2, y, 5, 2, '#24262a')
  }),
  sp('lc_cave', '바위 동굴', 22, LC_MID, (ctx, env) => {
    stone(ctx, 170, 150, 22, '#8a8678', '#6a665a')
    disc(ctx, 170, 144, 7, '#24221e')
    const f = mod(env.t * 0.4, 1)
    bird(ctx, 170 + f * 30, 140 - f * 20, Math.floor(env.t * 8) % 2, '#24262a')
  }),
  sp('lc_bridge', '돌다리 밑', 22, LC_MID, (ctx, env) => {
    for (let x = 120; x < 220; x++) {
      const y = 120 - Math.sin(((x - 120) / 100) * Math.PI) * 18
      px(ctx, x, y, 1, 4, '#a8a08c')
    }
    const f = mod(env.t * 0.4, 1)
    bird(ctx, 170 + f * 20, 140 - f * 10, Math.floor(env.t * 8) % 2, '#24262a')
  }),

  sp('lc_wet', '젖은 깃의 가마우지', 30, LC_WEIR, (ctx, env) => cormorant(ctx, 226, 118, env.t, true)),
  sp('lc_dance', '날개 펴고 춤추는 가마우지', 30, LC_WEIR, (ctx, env) => {
    cormorant(ctx, 226, 118, env.t)
    const up = Math.sin(env.t * 5) > 0
    px(ctx, 214, up ? 100 : 106, 10, 3, '#24262a')
    px(ctx, 230, up ? 100 : 106, 10, 3, '#24262a')
  }),
  sp('lc_sleep', '머리를 묻고 자는 가마우지', 30, LC_WEIR, (ctx) => {
    px(ctx, 224, 114, 1, 4, '#2a2a2a')
    px(ctx, 226, 114, 1, 4, '#2a2a2a')
    px(ctx, 220, 104, 10, 10, '#24262a')
    px(ctx, 226, 102, 4, 3, '#3e4a46')
  }),

  sp('lc_fish', '뗏목 위의 물고기', 34, LC_RIGHT, (ctx, env) => {
    for (let k = 0; k < 6; k++) px(ctx, 244, 150 + k * 2, 50, 2, k % 2 ? '#6a5236' : '#7a6242')
    cormorant(ctx, 268, 150, env.t)
    const w = Math.sin(env.t * 8) > 0 ? 1 : 0
    px(ctx, 275, 131 + w, 6, 2, '#c8ccc4')
    dot(ctx, 281, 130 + w, '#c8ccc4')
  }),
  sp('lc_twig', '나뭇가지를 문 둥지', 34, LC_RIGHT, (ctx, env) => {
    px(ctx, 290, 100, 3, 70, '#4a3a2a')
    px(ctx, 260, 140, 40, 6, '#7a5a3a')
    cormorant(ctx, 276, 140, env.t)
    px(ctx, 282, 121, 10, 1, '#6b4a32')
  }),
  sp('lc_leaf', '연잎을 문 새', 34, LC_RIGHT, (ctx, env) => {
    stone(ctx, 268, 164, 12, '#8a8678', '#6a665a')
    cormorant(ctx, 268, 152, env.t)
    lotusPad(ctx, 281, 134, 4)
  }),
]
