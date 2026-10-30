// 『唐詩畫意』 卷八 넷째 묶음 (2): 戴叔倫〈北山遊亭〉, 盧綸〈和張僕射塞下曲〉〈與暢當夜泛秋潭〉, 李端〈送陳上人遊春〉〈聽箏〉
import type { Background } from '../types'
import { H, W, disc, dot, fillRows, hash, mod, px } from '../pixel'
import type { Ctx } from '../pixel'
import { AUTUMN, bird, boat, broadTree, house, hut, mistBands, moon, person, pine, rain, ridge, sky, snowfall, stars, withAlpha } from '../kit'
import { OTHER_PALS, pal, seatFig, standFig } from '../figures'
import { drift, grasses, lotusPad, notes, shimmer, soundArcs, sp, sun, water } from './hy_kit'
import { lady } from './hy_b4a'

const FULL = { x: 0, y: 0, w: 320, h: 180 }
const MONK = pal({ K: '#8a7a6a', H: '#8a7a6a', R: '#6a6458', r: '#4e4a40', L: '#8a6a3a', B: '#e6c39b' })

// ════════════════════════════════════════════════════════════
// 戴叔倫〈北山遊亭〉: 산굽이 물과 언덕의 정자
// ════════════════════════════════════════════════════════════
const BS_RIDGE = (x: number) => 96 - 22 * Math.exp(-(((x - 186) / 60) ** 2)) + 4 * Math.sin(x * 0.05)
const bsBrook = (t: number) => ({ x: 6 + t * 120 + Math.sin(t * 8) * 8, y: 96 + t * 70 })
const BS_PAV = { x: 186, y: 74 }

export const beishanBackground: Background = {
  id: 'hy059',
  drawBack(ctx) {
    sky(ctx, ['#c4d4dc', '#d0dce0', '#dce4e0'], 110)
    ridge(ctx, (x) => 56 + 16 * Math.sin(x * 0.015 + 2.4), '#a4b4ac', '#aebeb6', 0, W, 120)
    ridge(ctx, BS_RIDGE, '#8a9a7a', '#96a686', 0, W, H)
    // 서쪽 산굽이
    fillRows(ctx, 80, H, (y) => [0, 40 + (y - 80) * 0.5], '#7a8a6a')
    px(ctx, 0, 140, W, H - 140, '#8a9672')
    for (let t = 0; t <= 1; t += 0.005) {
      const p = bsBrook(t)
      px(ctx, p.x - 2, p.y, 4, 2, '#7a8a7a')
    }
    // 언덕 길
    for (let t = 0; t <= 1; t += 0.006) px(ctx, 150 + t * 34 + Math.sin(t * 7) * 6, 170 - t * 92, 2, 1, '#b8aa86')
  },
  drawFront() {},
  drawDynamic() {},
}

const BS_BROOK = { x: 0, y: 84, w: 144, h: 81 }
const BS_PAV_F = { x: 136, y: 44, w: 104, h: 58 }
const BS_NEAR = { x: 0, y: 99, w: 144, h: 81 }

export const BEISHAN_SPRITES = [
  sp('bs_brook', '서쪽 산굽이에 맑게 흐르는 물', 12, BS_BROOK, (ctx, env) => {
    for (let t = 0; t <= 1; t += 0.005) {
      const p = bsBrook(t)
      px(ctx, p.x - 2, p.y, 4, 2, Math.sin(t * 70 - env.t * 5) > 0.6 ? '#e4f0f4' : '#8ab4c4')
    }
    soundArcs(ctx, bsBrook(0.4).x, bsBrook(0.4).y, env.t, '#e4f0f4', 12)
  }),
  sp('bs_mud', '누런 흙탕물', 12, BS_BROOK, (ctx) => {
    for (let t = 0; t <= 1; t += 0.005) {
      const p = bsBrook(t)
      px(ctx, p.x - 2, p.y, 4, 2, '#a08a5a')
    }
  }),
  sp('bs_dry', '바닥까지 마른 물길', 12, BS_BROOK, (ctx) => {
    for (let t = 0; t <= 1; t += 0.008) {
      const p = bsBrook(t)
      px(ctx, p.x - 2, p.y, 4, 2, '#b8a886')
      if (hash(t * 90) > 0.6) dot(ctx, p.x, p.y, '#8a7a5a')
    }
  }),

  sp('bs_pavilion', '언덕을 따라 선 노니는 정자', 14, BS_PAV_F, (ctx) => {
    const { x, y } = BS_PAV
    px(ctx, x - 12, y + 18, 24, 3, '#9a9284')
    for (const dx of [-9, -3, 3, 9]) px(ctx, x + dx, y + 6, 1, 12, '#8a3a2a')
    fillRows(ctx, y - 4, y + 6, (yy) => [x - 2 - (yy - y + 4) * 1.4, x + 2 + (yy - y + 4) * 1.4], (yy) => (yy < y ? '#4a4f57' : '#3c4048'))
    px(ctx, x, y - 7, 1, 3, '#3c4048')
    dot(ctx, x - 17, y + 5, '#3c4048')
    dot(ctx, x + 17, y + 5, '#3c4048')
    person(ctx, x - 2, y + 10, '#4b5068')
  }),
  sp('bs_fort', '높은 성채', 14, BS_PAV_F, (ctx) => {
    px(ctx, BS_PAV.x - 20, BS_PAV.y, 40, 20, '#8a8274')
    for (let x = BS_PAV.x - 20; x < BS_PAV.x + 20; x += 6) px(ctx, x, BS_PAV.y - 4, 4, 4, '#8a8274')
  }),
  sp('bs_pagoda', '층층 탑', 14, BS_PAV_F, (ctx) => {
    for (let k = 0; k < 5; k++) {
      px(ctx, BS_PAV.x - 5 + k, BS_PAV.y + 16 - k * 7, 10 - k * 2, 5, '#c9bfa5')
      px(ctx, BS_PAV.x - 8 + k, BS_PAV.y + 14 - k * 7, 16 - k * 2, 2, '#3c4048')
    }
  }),

  sp('bs_grass', '자라난 봄풀', 16, BS_NEAR, (ctx, env) => {
    grasses(ctx, 0, W, H, env, '#6aa84a', 90, 12)
    grasses(ctx, 0, W, 150, env, '#7ab85a', 60, 8)
  }),
  sp('bs_maple', '붉은 단풍', 16, BS_NEAR, (ctx) => {
    for (let k = 0; k < 6; k++) broadTree(ctx, 20 + k * 56, 172, 1.2, AUTUMN)
  }),
  sp('bs_reed', '마른 갈대', 16, BS_NEAR, (ctx, env) => grasses(ctx, 0, W, H, env, '#b8a870', 80, 16)),

  sp('bs_green', '멀리 보아도 온통 푸른 들', 30, FULL, (ctx) => {
    withAlpha(ctx, 0.3, () => fillRows(ctx, 60, H, () => [0, W], (y) => (y < 100 ? '#7ab85a' : '#5a9a3a')))
    withAlpha(ctx, 0.25, () => {
      for (let k = 0; k < 40; k++) dot(ctx, hash(k * 2.1) * W, 70 + hash(k * 3.3) * 60, '#a8d880')
    })
  }),
  sp('bs_red', '온통 붉은 산', 30, FULL, (ctx) => withAlpha(ctx, 0.3, () => px(ctx, 0, 50, W, H - 50, '#c8502a'))),
  sp('bs_white', '하얀 눈빛', 30, FULL, (ctx, env) => {
    withAlpha(ctx, 0.45, () => px(ctx, 0, 50, W, H - 50, '#f4f6f6'))
    snowfall(ctx, env.t, 50)
  }),
]

// ════════════════════════════════════════════════════════════
// 盧綸〈和張僕射塞下曲〉: 달 없는 밤의 변방
// ════════════════════════════════════════════════════════════
const SX_GROUND = 136
const SX_TENTS = [232, 254, 276, 298]

/** 말 탄 사람 (작은 크기). dir 1 이면 오른쪽으로 달린다 */
function rider(ctx: Ctx, x: number, y: number, t: number, dir: number, robe: string, spear = false) {
  const g = Math.sin(t * 10)
  px(ctx, x - 6, y - 6, 12, 4, '#2a2420')
  px(ctx, x + dir * 6 - (dir > 0 ? 0 : 3), y - 9, 3, 4, '#2a2420')
  for (const [lx, s] of [[-5, g], [-2, -g], [2, -g], [5, g]]) px(ctx, x + lx + Math.round(s), y - 2, 1, 3, '#2a2420')
  px(ctx, x - 1, y - 12, 3, 6, robe)
  px(ctx, x - 1, y - 14, 3, 2, '#c8a888')
  if (spear) px(ctx, x + dir * 2, y - 20, 1, 12, '#8a8478')
}

export const saixiaBackground: Background = {
  id: 'hy060',
  drawBack(ctx) {
    sky(ctx, ['#0a0e18', '#10141e', '#181c26'], SX_GROUND)
    stars(ctx, 14, 31, 4, 90, 0, '#5a6070')
    ridge(ctx, (x) => 104 + 10 * Math.sin(x * 0.015 + 1) + 3 * Math.sin(x * 0.07), '#141820', '#1a1e26', 0, W, SX_GROUND)
    px(ctx, 0, SX_GROUND, W, H - SX_GROUND, '#1e2024')
    // 우리 진영 (왼쪽 보루)
    px(ctx, 0, 104, 110, 32, '#2e2c2a')
    for (let x = 0; x < 110; x += 8) px(ctx, x, 100, 5, 4, '#2e2c2a')
    fillRows(ctx, 116, 136, () => [86, 102], '#141210')
    for (const x of [20, 60]) {
      px(ctx, x, 84, 1, 16, '#4a3a2a')
      px(ctx, x + 1, 84, 6, 4, '#6a2a22')
    }
    // 적의 천막
    for (const x of SX_TENTS) fillRows(ctx, 124, SX_GROUND, (y) => [x - (y - 124) * 0.8, x + (y - 124) * 0.8], '#2a2620')
  },
  drawFront() {},
  drawDynamic() {},
}

const SX_SKY = { x: 32, y: 8, w: 176, h: 99 }
const SX_ENEMY = { x: 192, y: 96, w: 128, h: 72 }
const SX_CAMP = { x: 40, y: 96, w: 144, h: 81 }

export const SAIXIA_SPRITES = [
  sp('sx_geese', '달 없는 하늘 높이 나는 기러기', 6, SX_SKY, (ctx, env) => {
    for (let k = 0; k < 7; k++) {
      const off = Math.abs(k - 3)
      bird(ctx, 80 + k * 10 + mod(env.t * 3, 40), 34 + off * 5, Math.floor(env.t * 3 + k) % 2, '#4a5060')
    }
  }),
  sp('sx_moon', '환한 보름달', 6, SX_SKY, (ctx) => {
    moon(ctx, 110, 40, 10)
    withAlpha(ctx, 0.15, () => px(ctx, 0, 0, W, H, '#c8d0e0'))
  }),
  sp('sx_sun', '떠오르는 해', 6, SX_SKY, (ctx) => {
    sky(ctx, ['#3a3a5a', '#8a5a5a', '#d8805a'], 104)
    sun(ctx, 110, 90, 9, '#f0a050')
  }),

  sp('sx_flee', '밤을 틈타 달아나는 선우', 22, SX_ENEMY, (ctx, env) => {
    for (let k = 0; k < 4; k++) {
      const x = 240 + mod(env.t * 14 + k * 22, 90)
      withAlpha(ctx, x > 300 ? Math.max(0, (330 - x) / 30) : 1, () => rider(ctx, x, 150 + (k % 2) * 6, env.t + k, 1, '#3a2a22'))
    }
    withAlpha(ctx, 0.35, () => {
      for (let k = 0; k < 10; k++) disc(ctx, 230 + mod(k * 12 + env.t * 10, 90), 154 + (k % 3) * 3, 3, '#3a3630')
    })
  }),
  sp('sx_feast', '천막의 잔치', 22, SX_ENEMY, (ctx, env) => {
    for (let k = 0; k < 4; k++) if (Math.sin(env.t * 8 + k) > -0.3) px(ctx, 262 + k * 3, 140 - (k % 2) * 3, 2, 5, k % 2 ? '#ffb040' : '#e8702a')
    withAlpha(ctx, 0.2, () => disc(ctx, 266, 140, 16, '#ffb040'))
    for (let k = 0; k < 4; k++) person(ctx, 240 + k * 14, 134 - (Math.sin(env.t * 4 + k) > 0 ? 1 : 0), '#3a2a22')
  }),
  sp('sx_sleep', '모두 잠든 천막', 22, SX_ENEMY, (ctx, env) => {
    for (let k = 0; k < 3; k++) {
      const f = mod(env.t * 0.4 + k / 3, 1)
      withAlpha(ctx, 1 - f, () => px(ctx, 260 + f * 6 + k * 4, 116 - f * 12, 3, 1, '#5a6070'))
    }
  }),

  sp('sx_cavalry', '날랜 기병을 이끌고 뒤쫓으려는 장수', 24, SX_CAMP, (ctx, env) => {
    for (let k = 0; k < 5; k++) rider(ctx, 108 + k * 14 + Math.sin(env.t * 2 + k) * 1.5, 150 + (k % 2) * 8, env.t * 0.6 + k, 1, k === 0 ? '#a8382a' : '#4a4a52', true)
    px(ctx, 98, 120, 1, 22, '#4a3a2a')
    px(ctx, 99, 120, 8, 5, '#a8382a')
  }),
  sp('sx_gate', '성문을 닫는 장수', 24, SX_CAMP, (ctx) => {
    fillRows(ctx, 116, 136, () => [86, 102], '#4a3a28')
    person(ctx, 106, 128, '#a8382a')
  }),
  sp('sx_drink', '술잔을 든 장수', 24, SX_CAMP, (ctx, env) => {
    seatFig(ctx, 120, 130, pal({ R: '#a8382a', r: '#7a2a20' }))
    withAlpha(ctx, 0.25 + Math.sin(env.t * 5) * 0.05, () => disc(ctx, 128, 136, 12, '#ffb040'))
  }),

  sp('sx_snow', '활과 칼에 가득한 큰 눈', 30, FULL, (ctx, env) => {
    snowfall(ctx, env.t, 160, '#f4f6f6')
    snowfall(ctx, env.t * 1.6 + 7, 80, '#c8ccd4')
    withAlpha(ctx, 0.35, () => px(ctx, 0, SX_GROUND, W, H - SX_GROUND, '#e4e8ec'))
    for (let k = 0; k < 60; k++) dot(ctx, hash(k * 2.7) * W, SX_GROUND + 1 + hash(k * 1.3) * 40, '#f4f6f6')
    for (let k = 0; k < 5; k++) {
      const x = 108 + k * 14
      const y = 150 + (k % 2) * 8
      px(ctx, x + 2, y - 20, 1, 3, '#f4f6f6')
      px(ctx, x - 1, y - 14, 3, 1, '#f4f6f6')
      px(ctx, x - 6, y - 7, 12, 1, '#f4f6f6')
    }
    withAlpha(ctx, 0.12, () => px(ctx, 0, 0, W, H, '#c8d0e0'))
  }),
  sp('sx_petals', '흩날리는 꽃잎', 30, FULL, (ctx, env) => drift(ctx, env.t, FULL, 50, '#f2b8c6', 0.4, 4)),
  sp('sx_rain', '쏟아지는 빗물', 30, FULL, (ctx, env) => rain(ctx, env.t, 90, 140, 'rgba(120,130,150,0.7)')),
]

// ════════════════════════════════════════════════════════════
// 盧綸〈與暢當夜泛秋潭〉: 가을 못의 밤배
// ════════════════════════════════════════════════════════════
const QT_WATER = 112
const QT_BOAT = { x: 186, y: 152 }
const QT_LOTUS = Array.from({ length: 12 }, (_, i) => ({ x: 24 + hash(i * 3.1) * 110, y: 126 + hash(i * 5.3) * 30 }))

export const qiutanBackground: Background = {
  id: 'hy061',
  drawBack(ctx) {
    sky(ctx, ['#141c2c', '#1a2236', '#222c40'], QT_WATER)
    stars(ctx, 16, 41, 4, 60, 0, '#8a90a8')
    ridge(ctx, (x) => 94 + 6 * Math.sin(x * 0.024 + 1), '#141a20', '#1a2028', 0, W, QT_WATER)
    water(ctx, QT_WATER, H, '#1e2a3a', '#16202e', '#2e3c50')
    // 오른쪽 기슭의 가을 나무
    fillRows(ctx, 100, QT_WATER + 6, (y) => [250 - (y - 100), W], '#161c16')
    broadTree(ctx, 270, 112, 2.4, { dark: '#3a1e14', base: '#5a2e1e', light: '#7a4a2a' })
    boat(ctx, QT_BOAT.x, QT_BOAT.y, { len: 44 })
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    shimmer(ctx, env.t, QT_WATER + 3, 178, 12, '#3e4e66')
    QT_LOTUS.forEach((p, i) => {
      lotusPad(ctx, p.x, p.y, 4 + (i % 3))
      if (i % 4 === 0) {
        px(ctx, p.x + 1, p.y - 8, 1, 7, '#3a4a32')
        disc(ctx, p.x + 1, p.y - 9, 2, '#5a6a3a')
      }
    })
  },
}

const QT_POND = { x: 8, y: 96, w: 144, h: 81 }
const QT_BOAT_F = { x: 136, y: 112, w: 104, h: 58 }
const QT_TREE = { x: 160, y: 64, w: 160, h: 108 }

export const QIUTAN_SPRITES = [
  sp('qt_firefly', '연꽃 떨기 위로 날리는 반딧불', 22, QT_POND, (ctx, env) => {
    for (let k = 0; k < 16; k++) {
      const x = 30 + hash(k * 2.1) * 110 + Math.sin(env.t * 0.7 + k) * 8
      const y = 110 + hash(k * 3.9) * 40 + Math.cos(env.t * 0.9 + k * 2) * 5
      const on = Math.sin(env.t * 3 + k * 1.7)
      if (on > -0.2) {
        withAlpha(ctx, 0.3 * (on + 0.2), () => disc(ctx, x, y, 2, '#d8f080'))
        dot(ctx, x, y, '#f4ffb0')
      }
    }
  }),
  sp('qt_butterfly', '나비', 22, QT_POND, (ctx, env) => {
    for (let k = 0; k < 4; k++) {
      const x = 40 + k * 26 + Math.sin(env.t + k) * 6
      const o = Math.sin(env.t * 10 + k) > 0
      px(ctx, x - (o ? 3 : 1), 120, o ? 3 : 1, 2, '#e8e0f0')
      px(ctx, x + 1, 120, o ? 3 : 1, 2, '#e8e0f0')
    }
  }),
  sp('qt_dragonfly', '잠자리', 22, QT_POND, (ctx, env) => {
    for (let k = 0; k < 4; k++) {
      const x = 40 + k * 26 + Math.sin(env.t * 0.7 + k) * 8
      px(ctx, x, 118 + k * 3, 6, 1, '#8a3a2a')
      px(ctx, x + 2, 117 + k * 3, 1, 3, '#a8a8b8')
    }
  }),

  sp('qt_wind', '서늘한 물에 잦은 밤바람', 12, FULL, (ctx, env) => {
    mistBands(ctx, env.t, [114, 122, 134], '#8a9ab8', 0.35)
    for (let k = 0; k < 8; k++) {
      const x = mod(hash(k) * 300 + env.t * 40, 330) - 10
      withAlpha(ctx, 0.4, () => px(ctx, x, 118 + k * 7, 14, 1, '#6a7a98'))
    }
    withAlpha(ctx, 0.12, () => px(ctx, 0, QT_WATER, W, H - QT_WATER, '#4a6a9a'))
  }, { wind: 0.5 }),
  sp('qt_hot', '뜨거운 한낮 볕', 12, FULL, (ctx) => {
    withAlpha(ctx, 0.4, () => px(ctx, 0, 0, W, H, '#f4d080'))
    sun(ctx, 60, 30, 9)
  }),
  sp('qt_ice', '꽁꽁 언 물', 12, FULL, (ctx) => withAlpha(ctx, 0.6, () => px(ctx, 0, QT_WATER, W, H - QT_WATER, '#c8d8e4'))),

  sp('qt_friends', '곧 떠날 벗과 시인', 24, QT_BOAT_F, (ctx) => {
    seatFig(ctx, QT_BOAT.x - 18, QT_BOAT.y - 18, pal())
    seatFig(ctx, QT_BOAT.x + 4, QT_BOAT.y - 18, pal(OTHER_PALS[1]), true)
    px(ctx, QT_BOAT.x - 2, QT_BOAT.y - 4, 4, 2, '#c8a868')
  }),
  sp('qt_alone', '홀로 낚시하는 사람', 24, QT_BOAT_F, (ctx) => {
    seatFig(ctx, QT_BOAT.x - 8, QT_BOAT.y - 18, pal())
    for (let i = 0; i < 20; i++) dot(ctx, QT_BOAT.x + 4 + i, QT_BOAT.y - 10 - i * 0.4, '#5a4632')
  }),
  sp('qt_boatman', '뱃사공뿐', 24, QT_BOAT_F, (ctx) => person(ctx, QT_BOAT.x - 20, QT_BOAT.y - 11, '#6e6450', { hat: '#a89567' })),

  sp('qt_leaves', '한 배에 함께 있는 지는 잎', 26, QT_TREE, (ctx, env) => {
    for (let i = 0; i < 14; i++) {
      const f = mod(hash(i * 2.3) + env.t * (0.05 + hash(i) * 0.04), 1)
      const x = 250 - f * 60 + Math.sin(env.t * 2 + i) * 5
      const y = 90 + f * 60
      px(ctx, x, y, 2, 1, ['#a8562a', '#c87a3a', '#7a3a1e'][i % 3])
    }
    for (let k = 0; k < 6; k++) px(ctx, QT_BOAT.x - 16 + k * 6, QT_BOAT.y - 4 + (k % 2), 2, 1, '#a8562a')
  }),
  sp('qt_lotus', '연꽃 한 아름', 26, QT_TREE, (ctx) => {
    for (let k = 0; k < 4; k++) disc(ctx, QT_BOAT.x - 6 + k * 4, QT_BOAT.y - 5, 2, '#d88aa0')
  }),
  sp('qt_jar', '술동이', 26, QT_TREE, (ctx) => {
    px(ctx, QT_BOAT.x - 2, QT_BOAT.y - 10, 6, 7, '#6a4a32')
    px(ctx, QT_BOAT.x - 1, QT_BOAT.y - 12, 4, 2, '#4a3426')
  }),
]

// ════════════════════════════════════════════════════════════
// 李端〈送陳上人遊春〉: 봄 들판과 은자의 산
// ════════════════════════════════════════════════════════════
const CS_RIVER = 124
const csPath = (t: number) => ({ x: 40 + t * 190 + Math.sin(t * 5) * 12, y: 176 - t * 70 })
const CS_HUT = { x: 220, y: 90 }

export const songchenBackground: Background = {
  id: 'hy062',
  drawBack(ctx) {
    sky(ctx, ['#b8d0e0', '#c8dae4', '#d8e4e4'], CS_RIVER)
    ridge(ctx, (x) => 60 + 22 * Math.exp(-(((x - 230) / 70) ** 2)) * -1 + 30 + 6 * Math.sin(x * 0.03), '#8aa490', '#96b09c', 0, W, CS_RIVER)
    ridge(ctx, (x) => 100 + 6 * Math.sin(x * 0.02 + 2), '#7a9a6a', '#86a676', 0, W, CS_RIVER)
    fillRows(ctx, CS_RIVER, 136, () => [0, W], '#9ac0c8')
    for (let i = 0; i < 30; i++) px(ctx, hash(i * 2.7) * W, CS_RIVER + 2 + hash(i * 1.9) * 10, 5, 1, '#c8dce0')
    px(ctx, 0, 136, W, H - 136, '#8aac62')
    for (let t = 0; t <= 1; t += 0.004) {
      const p = csPath(t)
      if (p.y < 136 && p.y > CS_RIVER) continue
      px(ctx, p.x - 2, p.y, 4 - t * 2, 1, '#c8b88a')
    }
    px(ctx, 150, 128, 20, 3, '#8a6a48')
    // 배웅하는 시인
    standFig(ctx, 14, 150, pal())
  },
  drawFront() {},
  drawDynamic() {},
}

const CS_PATH_F = { x: 16, y: 112, w: 120, h: 68 }
const CS_HILL = { x: 168, y: 56, w: 112, h: 63 }
const CS_BANK = { x: 80, y: 96, w: 160, h: 72 }

export const SONGCHEN_SPRITES = [
  sp('cs_monk', '지둔 같은 스님', 24, CS_PATH_F, (ctx, env) => {
    const p = csPath(0.12 + Math.sin(env.t * 0.15) * 0.02)
    standFig(ctx, p.x - 7, p.y - 22, MONK)
    px(ctx, p.x + 6, p.y - 24, 1, 24, '#6a4a32')
    dot(ctx, p.x + 6, p.y - 25, '#c8a441')
  }),
  sp('cs_general', '갑옷 입은 장군', 24, CS_PATH_F, (ctx) => {
    const p = csPath(0.12)
    standFig(ctx, p.x - 7, p.y - 22, pal({ R: '#8a3a2a', r: '#5a2a20', L: '#c8a441' }))
    px(ctx, p.x + 6, p.y - 30, 1, 30, '#8a8478')
  }),
  sp('cs_merchant', '짐 진 상인', 24, CS_PATH_F, (ctx) => {
    const p = csPath(0.12)
    standFig(ctx, p.x - 7, p.y - 22, pal(OTHER_PALS[3]))
    px(ctx, p.x - 12, p.y - 20, 8, 10, '#a8864a')
  }),

  sp('cs_hermit', '산속 은자의 집', 14, CS_HILL, (ctx) => {
    hut(ctx, CS_HUT.x, CS_HUT.y)
    for (const dx of [-20, 30, 44]) pine(ctx, CS_HUT.x + dx, CS_HUT.y + 16, 0.9)
    person(ctx, CS_HUT.x + 24, CS_HUT.y + 8, '#8a8a7a')
  }),
  sp('cs_palace', '궁궐', 14, CS_HILL, (ctx) => {
    px(ctx, CS_HUT.x - 10, CS_HUT.y + 2, 50, 14, '#b8352a')
    px(ctx, CS_HUT.x - 14, CS_HUT.y - 4, 58, 6, '#c89a3a')
  }),
  sp('cs_market', '저잣거리', 14, CS_HILL, (ctx) => {
    for (let k = 0; k < 3; k++) house(ctx, CS_HUT.x - 20 + k * 22, CS_HUT.y + 2 - (k % 2) * 2)
  }),

  sp('cs_people', '갠 들판 물가에 나온 사람들', 20, CS_BANK, (ctx, env) => {
    const at: [number, number, string][] = [[96, 136, OTHER_PALS[0].R], [112, 138, OTHER_PALS[2].R], [186, 136, '#d86a7a'], [204, 137, OTHER_PALS[1].R]]
    at.forEach(([x, y, c], k) => person(ctx, x, y - (Math.sin(env.t * 2 + k) > 0.7 ? 1 : 0), c))
    px(ctx, 176, 140, 10, 3, '#c8a868')
    for (let i = 0; i < 12; i++) dot(ctx, 120 + i, 138 - i * 0.6, '#5a4632')
  }),
  sp('cs_cattle', '풀 뜯는 소 떼', 20, CS_BANK, (ctx) => {
    for (let k = 0; k < 4; k++) {
      px(ctx, 100 + k * 30, 142, 10, 5, '#6a4a32')
      px(ctx, 108 + k * 30, 144, 3, 3, '#6a4a32')
    }
  }),
  sp('cs_empty', '텅 빈 들', 20, CS_BANK, (ctx, env) => bird(ctx, 160 + Math.sin(env.t * 0.3) * 30, 110, Math.floor(env.t * 4) % 2, '#4a4a52')),

  sp('cs_blossom', '나무마다 꽃 핀 봄 산', 10, CS_HILL, (ctx) => {
    for (let k = 0; k < 70; k++) {
      const x = hash(k * 2.3) * W
      const top = 60 + 22 * Math.exp(-(((x - 230) / 70) ** 2)) * -1 + 30 + 6 * Math.sin(x * 0.03)
      const y = top + 3 + hash(k * 4.1) * Math.max(4, CS_RIVER - top - 6)
      disc(ctx, x, y, 2 + Math.round(hash(k) * 2), k % 3 ? '#f2b8c6' : '#f8f0e8')
    }
  }),
  sp('cs_maple', '붉은 단풍', 10, CS_HILL, (ctx) => {
    for (let k = 0; k < 50; k++) disc(ctx, hash(k * 2.3) * W, 90 + hash(k * 4.1) * 30, 3, k % 2 ? '#c8502a' : '#e8803a')
  }),
  sp('cs_snow', '하얀 눈', 10, CS_HILL, (ctx) => {
    ridge(ctx, (x) => 60 + 22 * Math.exp(-(((x - 230) / 70) ** 2)) * -1 + 30 + 6 * Math.sin(x * 0.03), '#e8eef0', '#f4f6f6', 0, W, 100)
  }),
]

// ════════════════════════════════════════════════════════════
// 李端〈聽箏〉: 옥방 앞의 쟁
// ════════════════════════════════════════════════════════════
const TZ_FLOOR = 146
const TZ_ZHENG = { x: 104, y: 140, w: 70 }
const TZ_LADY = { x: 130, y: 120 }
const TZ_ZHOU = { x: 236, y: 118 }

export const tingzhengBackground: Background = {
  id: 'hy063',
  drawBack(ctx) {
    sky(ctx, ['#2a2438', '#3a304a', '#4a3e56'], TZ_FLOOR)
    // 옥방: 비취빛 기둥과 발
    px(ctx, 0, 54, W, 8, '#2a3e3a')
    px(ctx, 0, 50, W, 4, '#3a5a52')
    for (const x of [30, 200, 300]) {
      px(ctx, x, 62, 6, TZ_FLOOR - 62, '#5a9a8a')
      px(ctx, x, 62, 2, TZ_FLOOR - 62, '#8ac8b8')
    }
    for (let x = 40; x < 196; x += 4) px(ctx, x, 62, 2, 30 + Math.round(Math.sin(x * 0.2) * 3), '#6a5a48')
    px(ctx, 40, 92, 156, 2, '#8a6a48')
    for (const [r, al] of [[44, 0.06], [30, 0.07], [18, 0.08]] as const) withAlpha(ctx, al, () => disc(ctx, 182, 118, r, '#f4c870'))
    px(ctx, 0, TZ_FLOOR, W, H - TZ_FLOOR, '#5a4a3a')
    for (let x = 0; x < W; x += 16) px(ctx, x, TZ_FLOOR, 1, H - TZ_FLOOR, '#4a3a2e')
    // 등잔
    px(ctx, 182, 124, 2, 22, '#8a6a3a')
    px(ctx, 180, 121, 6, 3, '#ffd27a')
  },
  drawFront() {},
  drawDynamic() {},
}

const TZ_PLAY = { x: 88, y: 100, w: 112, h: 63 }
const TZ_ZHOU_F = { x: 192, y: 92, w: 96, h: 54 }

export const TINGZHENG_SPRITES = [
  sp('tz_zheng', '금 장식 기러기발의 쟁', 10, TZ_PLAY, (ctx) => {
    const { x, y, w } = TZ_ZHENG
    px(ctx, x, y, w, 4, '#7a4a2a')
    px(ctx, x, y, w, 1, '#a86a3a')
    px(ctx, x + 2, y + 4, 4, 2, '#4a2a1a')
    px(ctx, x + w - 6, y + 4, 4, 2, '#4a2a1a')
    for (let k = 0; k < 13; k++) {
      const bx = x + 8 + k * 4.4 + (k % 2) * 1
      px(ctx, bx, y - 2, 1, 2, '#e8c048')
      dot(ctx, bx, y - 3, '#f4e080')
    }
    for (let s = 0; s < 3; s++) px(ctx, x + 2, y - 1 + s, w - 4, 1, 'rgba(240,230,200,0.5)')
  }),
  sp('tz_pipa', '둥근 비파', 10, TZ_PLAY, (ctx) => {
    disc(ctx, 140, 134, 8, '#8a5a2a')
    px(ctx, 139, 112, 2, 18, '#6a4a2a')
  }),
  sp('tz_drum', '커다란 북', 10, TZ_PLAY, (ctx) => {
    px(ctx, 124, 124, 30, 18, '#a8382a')
    px(ctx, 124, 124, 30, 2, '#e8d8b0')
  }),

  sp('tz_hands', '옥방 앞 흰 손의 여인', 22, TZ_PLAY, (ctx, env) => {
    lady(ctx, TZ_LADY.x, TZ_LADY.y, '#c8a0c0', 'sit')
    const k = Math.floor(env.t * 4) % 4
    px(ctx, TZ_LADY.x - 6 + k * 2, TZ_ZHENG.y - 3, 3, 2, '#fbf4ec')
    px(ctx, TZ_LADY.x + 8 - k, TZ_ZHENG.y - 3, 3, 2, '#fbf4ec')
    if (!env.fx.tzMiss) notes(ctx, TZ_LADY.x + 14, TZ_ZHENG.y - 10, env.t, '#f4e8c8')
  }),
  sp('tz_oldman', '늙은 악사', 22, TZ_PLAY, (ctx) => seatFig(ctx, TZ_LADY.x - 4, TZ_LADY.y - 2, pal({ B: '#d8d4c8', H: '#d8d4c8' }))),
  sp('tz_child', '어린아이', 22, TZ_PLAY, (ctx) => seatFig(ctx, TZ_LADY.x - 2, TZ_LADY.y + 4, pal({ R: '#d8a040', r: '#a87a30' }), false, 0.75)),

  sp('tz_zhoulang', '돌아봐 주기를 바라는 주랑', 24, TZ_ZHOU_F, (ctx, env) => {
    seatFig(ctx, TZ_ZHOU.x, TZ_ZHOU.y, pal({ R: '#4a6a8a', r: '#34506a', L: '#c8a441' }), !!env.fx.tzMiss)
    if (env.fx.tzMiss) {
      withAlpha(ctx, 0.7, () => {
        for (let i = 0; i < 20; i++) if (i % 3) dot(ctx, TZ_ZHOU.x - 4 - i * 4, TZ_ZHOU.y + 4 + i * 0.6, '#f4e8c8')
      })
    }
  }),
  sp('tz_crowd', '박수 치는 사람들', 24, TZ_ZHOU_F, (ctx, env) => {
    for (let k = 0; k < 4; k++) person(ctx, 212 + k * 14, 132 - (Math.sin(env.t * 6 + k) > 0 ? 1 : 0), OTHER_PALS[k].R)
  }),
  sp('tz_reward', '상으로 받는 비단', 24, TZ_ZHOU_F, (ctx) => {
    seatFig(ctx, TZ_ZHOU.x, TZ_ZHOU.y, pal(OTHER_PALS[2]), true)
    px(ctx, TZ_ZHOU.x - 12, TZ_ZHOU.y + 10, 10, 6, '#c8402a')
    px(ctx, TZ_ZHOU.x - 12, TZ_ZHOU.y + 12, 10, 1, '#e8c048')
  }),

  sp('tz_miss', '일부러 잘못 튕긴 줄', 26, TZ_PLAY, (ctx, env) => {
    const f = mod(env.t * 0.6, 1)
    const x = TZ_LADY.x + 16 + f * 30
    const y = TZ_ZHENG.y - 12 - f * 20
    withAlpha(ctx, 1 - f, () => {
      px(ctx, x, y, 3, 2, '#e8705a')
      px(ctx, x + 2, y - 5, 1, 5, '#e8705a')
      for (let i = 0; i < 6; i++) dot(ctx, x + 5 + i, y + (i % 2 ? -1 : 1), '#e8705a')
    })
    for (let i = 0; i < 20; i++) dot(ctx, TZ_ZHENG.x + 20 + i, TZ_ZHENG.y - 1 + Math.sin(i + env.t * 20) * 1, '#fbf4ec')
  }, { fx: { tzMiss: 1 } }),
  sp('tz_snap', '끊어진 줄', 26, TZ_PLAY, (ctx) => {
    for (let i = 0; i < 10; i++) dot(ctx, TZ_ZHENG.x + 30 + i, TZ_ZHENG.y - 2 - Math.sin(i * 0.6) * 4, '#fbf4ec')
  }),
  sp('tz_stop', '연주를 멈춘 손', 26, TZ_PLAY, (ctx) => {
    px(ctx, TZ_LADY.x - 4, TZ_LADY.y + 6, 3, 2, '#fbf4ec')
    px(ctx, TZ_LADY.x + 8, TZ_LADY.y + 6, 3, 2, '#fbf4ec')
  }),
]
