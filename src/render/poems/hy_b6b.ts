// 『唐詩畫意』 卷九 둘째 묶음 (2): 權德輿〈晝〉〈晚〉, 羊士諤〈初移琪樹〉, 裴度〈溪居〉, 韓愈〈渚亭〉〈竹溪〉
import type { Background } from '../types'
import { H, W, disc, dot, fillRows, hash, mod, px } from '../pixel'
import type { Ctx } from '../pixel'
import { bamboo, bird, boat, hut, mistBands, moon, person, rain, ridge, sky, snowfall, withAlpha } from '../kit'
import { OTHER_PALS, pal, seatFig, standFig } from '../figures'
import { drift, egret, grasses, lotusFlower, lotusPad, mix, shimmer, skiff, soundArcs, sp, stone, sun, water } from './hy_kit'

const FULL = { x: 0, y: 0, w: 320, h: 180 }

/** 나는 학 (x, y 는 몸통 가운데) */
function craneFly(ctx: Ctx, x: number, y: number, t: number, down = false) {
  const Wc = '#f6f4ee'
  const up = Math.sin(t * 4) > 0
  px(ctx, x - 5, y - 1, 10, 3, Wc)
  px(ctx, x + 5, y + (down ? 1 : 0), 6, 1, Wc)
  dot(ctx, x + 11, y + (down ? 1 : 0), '#d83a2a')
  px(ctx, x - 9, y, 4, 1, '#2a2622')
  for (const s of [-1, 1]) {
    const wy = up ? y - 6 : y + 3
    px(ctx, x - 4, wy, 8, 3, Wc)
    px(ctx, x - 6, wy + (up ? 0 : 2), 3, 2, '#2a2622')
    if (s > 0) break
  }
  if (down) {
    px(ctx, x - 2, y + 2, 1, 6, '#3a3530')
    px(ctx, x + 1, y + 2, 1, 6, '#3a3530')
  }
}

// ════════════════════════════════════════════════════════════
// 權德輿〈晝〉: 한낮의 잔잔한 강
// ════════════════════════════════════════════════════════════
const ZW_WATER = 108
const ZW_BOAT = { x: 150, y: 148 }

export const zhouBackground: Background = {
  id: 'hy079',
  drawBack(ctx) {
    sky(ctx, ['#9cc0dc', '#b0cee2', '#c8dce6'], ZW_WATER)
    ridge(ctx, (x) => 90 + 8 * Math.sin(x * 0.02 + 1.6), '#8aaab0', '#96b6ba', 0, W, ZW_WATER)
    water(ctx, ZW_WATER, H, '#8ab8c0', '#6a9aa6', '#b4d4d8')
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    if (!env.fx.zwCalm) shimmer(ctx, env.t, ZW_WATER + 3, 178, 14, '#e4f0f0')
  },
}

const ZW_BOAT_F = { x: 96, y: 112, w: 112, h: 63 }
const ZW_SKY = { x: 152, y: 40, w: 144, h: 81 }

export const ZHOU_SPRITES = [
  sp('zw_boat', '햇빛에 출렁이는 외로운 배', 20, ZW_BOAT_F, (ctx, env) => {
    const b = env.fx.zwCalm ? 0 : Math.sin(env.t * 1.2) * 1
    skiff(ctx, ZW_BOAT.x, ZW_BOAT.y + b, env.t, { rower: false, guest: '#4b5068', len: 26 })
    for (let k = 0; k < 4; k++) if (Math.sin(env.t * 3 + k) > 0.5) dot(ctx, ZW_BOAT.x - 14 + k * 9, ZW_BOAT.y + 4, '#ffffff')
  }),
  sp('zw_fleet', '줄지은 배들', 20, ZW_BOAT_F, (ctx) => {
    for (let k = 0; k < 4; k++) boat(ctx, 110 + k * 28, 140 + (k % 2) * 10, { len: 20 })
  }),
  sp('zw_raft', '통나무 뗏목', 20, ZW_BOAT_F, (ctx) => {
    for (let k = 0; k < 6; k++) px(ctx, 136 + k * 4, 146, 3, 5, '#8a6a48')
  }),

  sp('zw_crane', '가을 하늘에서 내려오는 학', 24, ZW_SKY, (ctx, env) => {
    const f = mod(env.t * 0.06, 1)
    craneFly(ctx, 270 - f * 80, 56 + f * 50, env.t, f > 0.6)
  }),
  sp('zw_geese', '기러기 떼', 24, ZW_SKY, (ctx, env) => {
    for (let k = 0; k < 7; k++) bird(ctx, 190 + k * 10 + mod(env.t * 4, 30), 60 + Math.abs(k - 3) * 5, Math.floor(env.t * 4 + k) % 2, '#4a4a52')
  }),
  sp('zw_kite', '종이 연', 24, ZW_SKY, (ctx) => {
    fillRows(ctx, 56, 68, (y) => [230 - (6 - Math.abs(y - 62)), 230 + (6 - Math.abs(y - 62))], '#e8c048')
    for (let i = 0; i < 30; i++) dot(ctx, 230 - i * 1.4, 68 + i * 2, '#5a4632')
  }),

  sp('zw_noon', '잔잔한 물, 한낮의 해', 6, FULL, (ctx) => {
    sun(ctx, 120, 18, 9)
    withAlpha(ctx, 0.1, () => px(ctx, 0, 0, W, H, '#fff0c0'))
    withAlpha(ctx, 0.5, () => px(ctx, 117, ZW_WATER + 4, 6, 50, '#fff4d0'))
  }),
  sp('zw_waves', '거센 파도', 6, FULL, (ctx, env) => {
    for (let k = 0; k < 30; k++) px(ctx, mod(hash(k) * 320 + env.t * 30, 320), ZW_WATER + 4 + hash(k * 3) * 70, 8, 2, '#f4fafa')
  }),
  sp('zw_night', '달 뜬 밤', 6, FULL, (ctx) => {
    withAlpha(ctx, 0.55, () => px(ctx, 0, 0, W, H, '#141a30'))
    moon(ctx, 120, 24, 7)
  }),

  sp('zw_calm', '바람 없이 맑은 푸른 물', 12, FULL, (ctx) => {
    for (let y = ZW_WATER; y < H; y++) px(ctx, 0, y, W, 1, mix('#9cc8d0', '#7ab0bc', (y - ZW_WATER) / 72))
    withAlpha(ctx, 0.45, () => {
      for (let x = 0; x < W; x++) {
        const top = Math.round(90 + 8 * Math.sin(x * 0.02 + 1.6))
        const d = ZW_WATER - top
        px(ctx, x, ZW_WATER, 1, d, '#8aaab0')
      }
    })
  }, { fx: { zwCalm: 1 } }),
  sp('zw_wind', '세찬 바람', 12, FULL, (ctx, env) => {
    for (let k = 0; k < 10; k++) withAlpha(ctx, 0.5, () => px(ctx, mod(hash(k) * 320 + env.t * 80, 340) - 10, 20 + k * 14, 20, 1, '#ffffff'))
  }, { wind: 0.9 }),
  sp('zw_cloud', '몰려오는 먹구름', 12, FULL, (ctx) => {
    for (const [x, y, w] of [[0, 10, 160], [100, 24, 140], [180, 6, 140]] as const) px(ctx, x, y, w, 14, '#5a6068')
  }),
]

// ════════════════════════════════════════════════════════════
// 權德輿〈晚〉: 고목과 빈 저녁 강
// ════════════════════════════════════════════════════════════
const WW_WATER = 112
const WW_TREE = { x: 54, y: 120 }
const WW_BOAT = { x: 186, y: 150 }

export const wanBackground: Background = {
  id: 'hy080',
  drawBack(ctx) {
    sky(ctx, ['#5a5a78', '#7a6e84', '#9a8a8e', '#b8a08e'], WW_WATER)
    ridge(ctx, (x) => 96 + 6 * Math.sin(x * 0.024 + 0.4), '#4a4a58', '#545462', 0, W, WW_WATER)
    water(ctx, WW_WATER, H, '#6a7082', '#4e5468', '#8a8ea0')
    fillRows(ctx, 106, H, (y) => [0, 96 - (y - 106) * 0.6], '#3e3e40')
    // 고목
    px(ctx, WW_TREE.x - 4, WW_TREE.y - 54, 8, 54, '#3a2e26')
    for (const [dx, dy, len, ang] of [[0, -50, 26, -2.4], [2, -44, 30, -0.7], [0, -34, 20, -2.8], [2, -28, 22, -0.3]] as const)
      for (let i = 0; i < len; i++) px(ctx, WW_TREE.x + dx + Math.cos(ang) * i, WW_TREE.y + dy + Math.sin(ang) * i, 2, 2, '#3a2e26')
    for (let k = 0; k < 10; k++) disc(ctx, WW_TREE.x - 26 + hash(k * 2.1) * 52, WW_TREE.y - 70 + hash(k * 3.7) * 26, 5, '#3e4a34')
    boat(ctx, WW_BOAT.x, WW_BOAT.y, { len: 30 })
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    shimmer(ctx, env.t, WW_WATER + 3, 178, 8, '#a8aabc', 100, W)
  },
}

const WW_TREE_F = { x: 0, y: 32, w: 128, h: 90 }
const WW_RIVER = { x: 80, y: 88, w: 240, h: 92 }
const WW_BOAT_F = { x: 136, y: 108, w: 104, h: 58 }

export const WAN_SPRITES = [
  sp('ww_sunset', '고목에 다하는 저녁 햇빛', 10, WW_TREE_F, (ctx) => {
    sun(ctx, 130, WW_WATER - 14, 7, '#e8704a', '#f4a070')
    withAlpha(ctx, 0.5, () => {
      for (let k = 0; k < 10; k++) disc(ctx, WW_TREE.x - 24 + hash(k * 2.1) * 52, WW_TREE.y - 72 + hash(k * 3.7) * 14, 3, '#e8904a')
    })
    withAlpha(ctx, 0.15, () => px(ctx, 0, 0, W, WW_WATER, '#e8804a'))
  }),
  sp('ww_morning', '아침 햇살', 10, WW_TREE_F, (ctx) => {
    withAlpha(ctx, 0.35, () => px(ctx, 0, 0, W, WW_WATER, '#d8e4ec'))
    sun(ctx, 260, 60, 7, '#f4d890')
  }),
  sp('ww_snow', '고목에 쌓인 눈', 10, WW_TREE_F, (ctx, env) => {
    for (let k = 0; k < 10; k++) px(ctx, WW_TREE.x - 26 + hash(k * 2.1) * 52, WW_TREE.y - 74 + hash(k * 3.7) * 26, 8, 2, '#f4f6f6')
    snowfall(ctx, env.t, 40)
  }),

  sp('ww_mist', '빈 강에 걷히는 저녁 안개', 12, WW_RIVER, (ctx, env) => {
    const f = mod(env.t * 0.07, 1)
    withAlpha(ctx, 1 - f, () => mistBands(ctx, env.t, [118 - f * 16, 126 - f * 16, 134 - f * 16, 144 - f * 16], '#c8c4d0', 0.7))
  }),
  sp('ww_boats', '강을 메운 배', 12, WW_RIVER, (ctx) => {
    for (let k = 0; k < 5; k++) boat(ctx, 110 + k * 40, 126 + (k % 2) * 10, { len: 20 })
  }),
  sp('ww_ice', '두꺼운 얼음', 12, WW_RIVER, (ctx) => withAlpha(ctx, 0.7, () => px(ctx, 96, WW_WATER, W - 96, H - WW_WATER, '#d0dce4'))),

  sp('ww_tap', '쓸쓸히 뱃전을 두드리며 앉은 나그네', 24, WW_BOAT_F, (ctx, env) => {
    seatFig(ctx, WW_BOAT.x - 10, WW_BOAT.y - 20, pal())
    const hit = Math.sin(env.t * 2.5) > 0.4
    px(ctx, WW_BOAT.x + 4, hit ? WW_BOAT.y - 5 : WW_BOAT.y - 8, 2, 2, '#e6c39b')
    if (hit) soundArcs(ctx, WW_BOAT.x + 6, WW_BOAT.y - 4, env.t, '#c8c4d0', 10)
  }),
  sp('ww_dance', '노래하며 춤추는 사람', 24, WW_BOAT_F, (ctx, env) => standFig(ctx, WW_BOAT.x - 6 + Math.sin(env.t * 3) * 3, WW_BOAT.y - 26, pal())),
  sp('ww_fish', '낚싯대를 드리운 사람', 24, WW_BOAT_F, (ctx) => {
    seatFig(ctx, WW_BOAT.x - 10, WW_BOAT.y - 20, pal())
    for (let i = 0; i < 24; i++) dot(ctx, WW_BOAT.x + 4 + i, WW_BOAT.y - 12 - i * 0.3, '#5a4632')
  }),

  sp('ww_sorrow', '홀로 이는 천 리의 시름', 26, FULL, (ctx) => {
    withAlpha(ctx, 0.25, () => px(ctx, 0, 0, W, H, '#1a1e30'))
    const bx = 150
    const by = 50
    px(ctx, bx, by, 80, 40, '#ece6d6')
    for (const [x, y, w, h] of [[bx, by, 80, 1], [bx, by + 39, 80, 1], [bx, by, 1, 40], [bx + 79, by, 1, 40]] as const) px(ctx, x, y, w, h, '#5d4a37')
    for (let t = 0; t < 1; t += 0.01) dot(ctx, bx + 6 + t * 62, by + 34 - t * 20 + Math.sin(t * 12) * 3, '#a89a7a')
    ridge(ctx, (x) => by + 12 + 3 * Math.sin(x * 0.2), '#a8b4a8', undefined, bx + 50, bx + 78, by + 22)
    hut(ctx, bx + 60, by + 8)
    for (const [x, y] of [[188, 98], [190, 104], [192, 110]] as const) px(ctx, x, y, 3, 3, '#ece6d6')
  }),
  sp('ww_joy', '웃음', 26, FULL, (ctx, env) => {
    for (let k = 0; k < 3; k++) px(ctx, WW_BOAT.x + 10 + k * 4, WW_BOAT.y - 30 - Math.abs(Math.sin(env.t * 3 + k)) * 4, 2, 2, '#f4d060')
  }),
  sp('ww_sleep', '졸음', 26, FULL, (ctx, env) => {
    for (let k = 0; k < 3; k++) {
      const f = mod(env.t * 0.4 + k / 3, 1)
      withAlpha(ctx, 1 - f, () => px(ctx, WW_BOAT.x + 6 + f * 6 + k * 2, WW_BOAT.y - 28 - f * 10 - k * 3, 3, 1, '#c8c4d0'))
    }
  }),
]

// ════════════════════════════════════════════════════════════
// 羊士諤〈初移琪樹〉: 옮겨 심은 옥 나무와 푸른 창
// ════════════════════════════════════════════════════════════
const QI_GROUND = 132
const QI_TREE = { x: 112, y: QI_GROUND }
const QI_WIN = { x: 204, y: 96, w: 40, h: 22 }

export const qishuBackground: Background = {
  id: 'hy081',
  drawBack(ctx) {
    sky(ctx, ['#c0ccd4', '#ccd4d6', '#d8dcd6'], QI_GROUND)
    ridge(ctx, (x) => 92 + 12 * Math.sin(x * 0.02 + 2.2), '#a0ae9e', '#aab8a8', 0, W, QI_GROUND)
    px(ctx, 0, QI_GROUND, W, H - QI_GROUND, '#8a9070')
    px(ctx, 180, 80, 140, 52, '#d8d0bc')
    px(ctx, 174, 70, 152, 10, '#3c4048')
    px(ctx, 178, 68, 144, 2, '#4a4f57')
    for (let x = 182; x < W; x += 22) px(ctx, x, 80, 2, 52, '#6b4a32')
    px(ctx, QI_WIN.x, QI_WIN.y, QI_WIN.w, QI_WIN.h, '#3a3226')
    for (let x = QI_WIN.x; x <= QI_WIN.x + QI_WIN.w; x += 8) px(ctx, x, QI_WIN.y, 1, QI_WIN.h, '#8a6a48')
  },
  drawFront() {},
  drawDynamic() {},
}

const QI_TREE_F = { x: 48, y: 64, w: 128, h: 81 }
const QI_SKY = { x: 24, y: 8, w: 192, h: 90 }
const QI_WIN_F = { x: 176, y: 76, w: 96, h: 54 }
const QI_LEAVES = Array.from({ length: 16 }, (_, i) => {
  const a = hash(i * 2.1) * 6.28
  const r = Math.sqrt(hash(i * 3.7)) * 22
  return { x: QI_TREE.x + Math.cos(a) * r * 1.2, y: QI_TREE.y - 44 + Math.sin(a) * r * 0.7 }
})

export const QISHU_SPRITES = [
  sp('qi_tree', '언덕에서 옮겨 온 옥 같은 나무', 14, QI_TREE_F, (ctx, env) => {
    fillRows(ctx, QI_GROUND - 3, QI_GROUND + 2, (y) => [QI_TREE.x - 14 + (QI_GROUND - y), QI_TREE.x + 14 - (QI_GROUND - y)], '#6a5a3a')
    px(ctx, QI_TREE.x - 2, QI_TREE.y - 40, 4, 40, '#6a7a6a')
    for (const l of QI_LEAVES) disc(ctx, l.x + Math.sin(env.t + l.x) * 0.5, l.y, 6, (dy) => (dy < -2 ? '#7ac0b0' : '#4a9a8a'))
    for (let k = 0; k < 8; k++) if (Math.sin(env.t * 2 + k) > 0.7) dot(ctx, QI_LEAVES[k].x, QI_LEAVES[k].y - 3, '#e0fff4')
  }),
  sp('qi_rock', '기이한 바위', 14, QI_TREE_F, (ctx) => {
    stone(ctx, QI_TREE.x, QI_GROUND, 14, '#a8a49a', '#7e7a70')
    stone(ctx, QI_TREE.x + 4, QI_GROUND - 16, 8, '#a8a49a', '#7e7a70')
  }),
  sp('qi_pot', '꽃 화분', 14, QI_TREE_F, (ctx) => {
    px(ctx, QI_TREE.x - 8, QI_GROUND - 10, 16, 10, '#a86a3a')
    for (let k = 0; k < 4; k++) disc(ctx, QI_TREE.x - 6 + k * 4, QI_GROUND - 14, 2, '#e88aa0')
  }),

  sp('qi_frost', '안개와 서리 속에 종일 바라보는 나무', 16, QI_TREE_F, (ctx, env) => {
    mistBands(ctx, env.t * 0.5, [98, 108, 120], '#f4f6f4', 0.5)
    for (const l of QI_LEAVES) px(ctx, l.x - 3, l.y - 5, 6, 1, '#eef4f4')
    for (let k = 0; k < 40; k++) dot(ctx, hash(k * 2.1) * W, QI_GROUND + 2 + hash(k * 3.3) * 46, '#e8eef0')
  }),
  sp('qi_summer', '한여름 땡볕', 16, QI_TREE_F, (ctx) => {
    sun(ctx, 60, 30, 9)
    withAlpha(ctx, 0.15, () => px(ctx, 0, 0, W, H, '#fff0a0'))
  }),
  sp('qi_rain', '장대비', 16, QI_TREE_F, (ctx, env) => rain(ctx, env.t, 70, 150, 'rgba(150,165,180,0.7)')),

  sp('qi_cloud', '나무 위의 끝없는 푸른 구름', 12, QI_SKY, (ctx, env) => {
    for (let k = 0; k < 6; k++) {
      const x = mod(30 + k * 40 + env.t * 2, 240) + 10
      const y = 30 + (k % 3) * 12
      px(ctx, x, y, 44, 5, '#b8d4d0')
      px(ctx, x + 6, y - 3, 30, 3, '#cce0dc')
    }
  }),
  sp('qi_glow', '붉은 노을', 12, QI_SKY, (ctx) => withAlpha(ctx, 0.35, () => px(ctx, 0, 0, W, 100, '#e8804a'))),
  sp('qi_storm', '검은 먹구름', 12, QI_SKY, (ctx) => {
    for (const [x, y, w] of [[20, 20, 120], [100, 30, 120]] as const) px(ctx, x, y, w, 12, '#4a5058')
  }),

  sp('qi_window', '푸르고 서늘해진 창', 24, QI_WIN_F, (ctx) => {
    withAlpha(ctx, 0.6, () => px(ctx, QI_WIN.x, QI_WIN.y, QI_WIN.w, QI_WIN.h, '#a8d0c4'))
    person(ctx, QI_WIN.x + 16, QI_WIN.y + 9, '#4b5068')
    for (let x = QI_WIN.x; x <= QI_WIN.x + QI_WIN.w; x += 8) px(ctx, x, QI_WIN.y, 1, QI_WIN.h, '#8a6a48')
    withAlpha(ctx, 0.12, () => px(ctx, 0, 0, W, H, '#8ac0c0'))
  }),
  sp('qi_warm', '등불로 따스한 창', 24, QI_WIN_F, (ctx) => withAlpha(ctx, 0.7, () => px(ctx, QI_WIN.x, QI_WIN.y, QI_WIN.w, QI_WIN.h, '#f4c870'))),
  sp('qi_shut', '닫힌 창', 24, QI_WIN_F, (ctx) => px(ctx, QI_WIN.x, QI_WIN.y, QI_WIN.w, QI_WIN.h, '#6b4a32')),
]

// ════════════════════════════════════════════════════════════
// 裴度〈溪居〉: 고목과 나란한 띠집
// ════════════════════════════════════════════════════════════
const XU_GROUND = 120
const XU_HUT = { x: 140, y: 100 }
const xuStream = (t: number) => ({ x: t * W, y: 150 + Math.sin(t * 7) * 6 })

export const xijuBackground: Background = {
  id: 'hy082',
  drawBack(ctx) {
    sky(ctx, ['#bcd0d8', '#cadadc', '#d8e2dc'], XU_GROUND)
    ridge(ctx, (x) => 76 + 14 * Math.sin(x * 0.016 + 3), '#9ab0a4', '#a6bcb0', 0, W, XU_GROUND)
    ridge(ctx, (x) => 98 + 6 * Math.sin(x * 0.03 + 1), '#7e9a7a', '#8aa686', 0, W, XU_GROUND)
    px(ctx, 0, XU_GROUND, W, H - XU_GROUND, '#7e9a5e')
    hut(ctx, XU_HUT.x, XU_HUT.y)
  },
  drawFront() {},
  drawDynamic() {},
}

const XU_PATH = { x: 80, y: 100, w: 160, h: 80 }
const XU_HUT_F = { x: 96, y: 52, w: 128, h: 72 }
const XU_FAR = { x: 192, y: 40, w: 128, h: 72 }
const XU_BIRD = { x: 192, y: 120, w: 112, h: 60 }

export const XIJU_SPRITES = [
  sp('xu_stream', '문 앞 길이 굽어보는 맑은 시내', 12, XU_PATH, (ctx, env) => {
    for (let t = 0; t <= 1; t += 0.003) {
      const p = xuStream(t)
      px(ctx, p.x, p.y, 2, 8, '#8ab8c4')
      if (Math.sin(t * 90 - env.t * 3) > 0.85) px(ctx, p.x, p.y + 3, 3, 1, '#e4f0f4')
    }
    for (let t = 0; t <= 1; t += 0.01) px(ctx, XU_HUT.x + 10 - t * 10 + Math.sin(t * 6) * 4, XU_HUT.y + 15 + t * 32, 3, 1, '#c8b88a')
  }),
  sp('xu_road', '넓은 큰길', 12, XU_PATH, (ctx) => px(ctx, 0, 140, W, 14, '#c8b88a')),
  sp('xu_market', '북적이는 시장', 12, XU_PATH, (ctx) => {
    for (let k = 0; k < 4; k++) {
      px(ctx, 100 + k * 36, 140, 24, 3, ['#b2352a', '#d9a441', '#4f6b4a', '#6b5a7a'][k])
      person(ctx, 108 + k * 36, 144, OTHER_PALS[k].R)
    }
  }),

  sp('xu_oldtree', '띠 처마와 나란한 고목', 14, XU_HUT_F, (ctx, env) => {
    for (const [x, s] of [[124, 1.5], [178, 1.7]] as const) {
      px(ctx, x - 2, XU_GROUND - 24, 5, 26, '#4a3426')
      for (let k = 0; k < 8; k++) disc(ctx, x - 12 + hash(k * 2.1 + x) * 24 + Math.sin(env.t + k) * 0.5, XU_HUT.y - 6 + hash(k * 3.3 + x) * 10, Math.round(5 * s * 0.8), k % 2 ? '#3e6a3a' : '#527e46')
    }
  }),
  sp('xu_wall', '높은 담', 14, XU_HUT_F, (ctx) => {
    px(ctx, 110, 92, 100, 28, '#a49c8c')
    px(ctx, 108, 90, 104, 2, '#5a5e66')
  }),
  sp('xu_tower', '층층 탑', 14, XU_HUT_F, (ctx) => {
    for (let k = 0; k < 5; k++) {
      px(ctx, 186 + k, 108 - k * 10, 14 - k * 2, 6, '#c9bfa5')
      px(ctx, 183 + k, 106 - k * 10, 20 - k * 2, 2, '#3c4048')
    }
  }),

  sp('xu_nodust', '날아와 닿지 않는 붉은 먼지', 8, XU_FAR, (ctx, env) => {
    for (let k = 0; k < 6; k++) px(ctx, 250 + k * 10, 84 - (k % 2) * 3, 8, 6, '#a89a8a')
    withAlpha(ctx, 0.45, () => {
      for (let k = 0; k < 6; k++) disc(ctx, 266 + Math.sin(env.t * 0.4 + k) * 8 + k * 6, 76 - k * 2, 10, '#c88a6a')
    })
    ridge(ctx, (x) => 82 + 6 * Math.sin(x * 0.08), '#7e9a7a', '#8aa686', 218, 250, XU_GROUND)
  }),
  sp('xu_dusty', '마당까지 가득한 먼지', 8, XU_FAR, (ctx) => withAlpha(ctx, 0.35, () => px(ctx, 0, 40, W, 140, '#c88a6a'))),
  sp('xu_smoke', '연기와 섞인 먼지', 8, XU_FAR, (ctx, env) => {
    for (let k = 0; k < 8; k++) {
      const f = mod(env.t * 0.15 + k / 8, 1)
      withAlpha(ctx, 0.5 * (1 - f), () => disc(ctx, 180 + k * 12, 110 - f * 60, 6 + f * 8, '#8a8a8a'))
    }
  }),

  sp('xu_bird', '때때로 우는 물새', 24, XU_BIRD, (ctx, env) => {
    egret(ctx, 246, 154, env.t)
    if (Math.sin(env.t * 1.5) > 0.3) soundArcs(ctx, 256, 136, env.t * 2, '#5d4a37', 14)
  }),
  sp('xu_rooster', '닭 우는 소리', 24, XU_BIRD, (ctx, env) => {
    px(ctx, 240, 140, 8, 6, '#e8e2d0')
    px(ctx, 246, 136, 4, 5, '#e8e2d0')
    px(ctx, 247, 134, 3, 2, '#c0302a')
    soundArcs(ctx, 252, 138, env.t * 2, '#5d4a37', 12)
  }),
  sp('xu_dog', '개 짖는 소리', 24, XU_BIRD, (ctx, env) => {
    px(ctx, 240, 140, 9, 5, '#8a6a4a')
    px(ctx, 237, 137, 4, 4, '#8a6a4a')
    if (Math.sin(env.t * 7) > 0) soundArcs(ctx, 236, 139, env.t, '#5d4a37', 10)
  }),
]

// ════════════════════════════════════════════════════════════
// 韓愈〈渚亭〉: 연못 가운데 물가 정자
// ════════════════════════════════════════════════════════════
const ZT_WATER = 104
const ZT_ISLE = { x: 166, y: 126 }
const ztIsle = (y: number): [number, number] => {
  const d = (y - 126) / 8
  const w = 40 * Math.sqrt(Math.max(0, 1 - d * d))
  return [ZT_ISLE.x - w, ZT_ISLE.x + w]
}
const ZT_LOTUS = Array.from({ length: 20 }, (_, i) => ({ x: 10 + hash(i * 2.9) * 300, y: 112 + hash(i * 4.3) * 64 })).filter((p) => Math.abs(p.x - ZT_ISLE.x) > 48 || p.y > 140)

export const zhutingBackground: Background = {
  id: 'hy083',
  drawBack(ctx) {
    sky(ctx, ['#b8d0dc', '#c8dae0', '#d8e4e2'], ZT_WATER)
    ridge(ctx, (x) => 88 + 8 * Math.sin(x * 0.022 + 0.3), '#8aaa9c', '#96b6a8', 0, W, ZT_WATER)
    px(ctx, 0, 98, W, 6, '#7e9a62')
    water(ctx, ZT_WATER, H, '#9ac0c4', '#7aa4ac', '#c4dcdc')
    fillRows(ctx, 118, 135, ztIsle, (y) => (y < 122 ? '#8aa462' : '#6e8a4e'))
    // 왼쪽 기슭
    fillRows(ctx, 120, H, (y) => [0, 40 + (y - 120) * 0.3], '#7e9a62')
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    shimmer(ctx, env.t, ZT_WATER + 3, 178, 12, '#e4eeee', 50, W)
  },
}

const ZT_ISLE_F = { x: 104, y: 76, w: 128, h: 72 }
const ZT_DYKE = { x: 16, y: 104, w: 160, h: 72 }

export const ZHUTING_SPRITES = [
  sp('zt_hidden', '아는 사람만 찾는 숨은 물가', 12, ZT_ISLE_F, (ctx, env) => {
    for (let k = 0; k < 18; k++) {
      const x = ZT_ISLE.x - 40 + k * 4.6
      if (Math.abs(x - ZT_ISLE.x) < 14) continue
      const h = 14 + hash(k) * 10
      for (let i = 0; i < h; i++) dot(ctx, x + Math.sin(env.t + k) * (i / h), 128 - i, '#8a9a5a')
    }
    for (const x of [ZT_ISLE.x - 34, ZT_ISLE.x + 34]) {
      px(ctx, x, 100, 2, 26, '#5a4632')
      for (let k = 0; k < 10; k++) for (let i = 0; i < 16; i++) dot(ctx, x - 12 + k * 3 + Math.sin(env.t + i * 0.2), 98 + i, '#8aa860')
    }
  }),
  sp('zt_road', '큰길가', 12, ZT_ISLE_F, (ctx) => px(ctx, 104, 96, 128, 6, '#c8b88a')),
  sp('zt_peak', '산꼭대기', 12, ZT_ISLE_F, (ctx) => fillRows(ctx, 60, 120, (y) => [ZT_ISLE.x - (y - 60) * 0.8, ZT_ISLE.x + (y - 60) * 0.8], '#7a8a6a')),

  sp('zt_steps', '정자로 걸어간 발자취', 14, ZT_DYKE, (ctx) => {
    for (let x = 30; x < ZT_ISLE.x - 36; x++) px(ctx, x, 128 + Math.round(Math.sin(x * 0.05) * 2), 1, 4, '#c8b88a')
    for (let k = 0; k < 12; k++) {
      const x = 40 + k * 7
      px(ctx, x, 129 + Math.round(Math.sin(x * 0.05) * 2) + (k % 2), 2, 1, '#8a7a5a')
    }
  }),
  sp('zt_wheel', '수레바퀴 자국', 14, ZT_DYKE, (ctx) => {
    for (let x = 30; x < ZT_ISLE.x - 36; x++) {
      px(ctx, x, 128, 1, 4, '#c8b88a')
      dot(ctx, x, 129, '#8a7a5a')
      dot(ctx, x, 131, '#8a7a5a')
    }
  }),
  sp('zt_beast', '짐승 발자국', 14, ZT_DYKE, (ctx) => {
    for (let k = 0; k < 10; k++) {
      disc(ctx, 40 + k * 9, 140 + (k % 2) * 4, 1, '#5a4a3a')
      dot(ctx, 41 + k * 9, 138 + (k % 2) * 4, '#5a4a3a')
    }
  }),

  sp('zt_open', '네 벽 없이 탁 트인 정자', 22, ZT_ISLE_F, (ctx) => {
    const { x } = ZT_ISLE
    px(ctx, x - 16, 118, 32, 3, '#9a9284')
    for (const dx of [-13, -5, 4, 12]) px(ctx, x + dx, 104, 1, 14, '#8a3a2a')
    fillRows(ctx, 94, 104, (y) => [x - 3 - (y - 94) * 1.8, x + 3 + (y - 94) * 1.8], (y) => (y < 99 ? '#4a4f57' : '#3c4048'))
    px(ctx, x, 90, 1, 4, '#3c4048')
    person(ctx, x - 2, 110, '#4b5068')
  }),
  sp('zt_walls', '네 벽을 두른 정자', 22, ZT_ISLE_F, (ctx) => {
    const { x } = ZT_ISLE
    px(ctx, x - 14, 104, 28, 14, '#d8d0bc')
    fillRows(ctx, 94, 104, (y) => [x - 3 - (y - 94) * 1.8, x + 3 + (y - 94) * 1.8], '#3c4048')
  }),
  sp('zt_blind', '발을 드리운 정자', 22, ZT_ISLE_F, (ctx) => {
    const { x } = ZT_ISLE
    for (let i = -13; i < 14; i += 2) px(ctx, x + i, 104, 1, 12, '#b8a070')
    fillRows(ctx, 94, 104, (y) => [x - 3 - (y - 94) * 1.8, x + 3 + (y - 94) * 1.8], '#3c4048')
  }),

  sp('zt_lotus', '사면으로 보이는 연꽃', 16, FULL, (ctx, env) => {
    ZT_LOTUS.forEach((p, i) => {
      lotusPad(ctx, p.x, p.y, 5 + (i % 3))
      if (i % 2 === 0) lotusFlower(ctx, p.x + 2, p.y - 4 + Math.round(Math.sin(env.t + i) * 0.5))
    })
  }),
  sp('zt_bamboo', '대숲', 16, FULL, (ctx) => {
    for (let k = 0; k < 14; k++) bamboo(ctx, 220 + k * 7, 120, 40)
  }),
  sp('zt_snow', '눈 덮인 들', 16, FULL, (ctx) => {
    fillRows(ctx, 118, 124, ztIsle, '#f4f6f6')
    px(ctx, 0, 98, W, 6, '#eef2f2')
  }),
]

// ════════════════════════════════════════════════════════════
// 韓愈〈竹溪〉: 대숲 사이 느린 시내
// ════════════════════════════════════════════════════════════
const ZX_TOP = 90
const zxStream = (y: number): [number, number] => {
  const c = 160 + Math.sin(y * 0.05) * 30
  const w = 10 + (y - ZX_TOP) * 0.35
  return [c - w, c + w]
}

export const zhuxiBackground: Background = {
  id: 'hy084',
  drawBack(ctx) {
    sky(ctx, ['#b8ccc4', '#c4d4c8', '#d0dccc'], ZX_TOP)
    ridge(ctx, (x) => 70 + 10 * Math.sin(x * 0.02 + 1), '#8aa48a', '#96b096', 0, W, ZX_TOP + 10)
    px(ctx, 0, ZX_TOP, W, H - ZX_TOP, '#c8bc98')
    fillRows(ctx, ZX_TOP, H, (y) => {
      const [a, b] = zxStream(y)
      return [a - 8, b + 8]
    }, '#d8ceae')
    fillRows(ctx, ZX_TOP, H, zxStream, (y) => mix('#8ab0a8', '#6a9a94', (y - ZX_TOP) / 90))
  },
  drawFront() {},
  drawDynamic() {},
}

const ZX_STREAM = { x: 88, y: 96, w: 144, h: 84 }
const ZX_BANK = { x: 0, y: 24, w: 320, h: 156 }
const ZX_SAND = { x: 16, y: 120, w: 112, h: 60 }

export const ZHUXI_SPRITES = [
  sp('zx_slow', '자욱한 그늘 속 느린 시냇물', 10, ZX_STREAM, (ctx, env) => {
    for (let k = 0; k < 14; k++) {
      const y = ZX_TOP + 4 + mod(hash(k) * 86 + env.t * 2, 86)
      const [a, b] = zxStream(y)
      px(ctx, a + 4 + hash(k * 3) * (b - a - 10), y, 5, 1, '#c4dcd8')
    }
    withAlpha(ctx, 0.18, () => px(ctx, 0, 0, W, H, '#2a3a2a'))
  }),
  sp('zx_rapid', '콸콸 쏟아지는 물', 10, ZX_STREAM, (ctx, env) => {
    for (let k = 0; k < 30; k++) {
      const y = ZX_TOP + 4 + mod(hash(k) * 86 + env.t * 40, 86)
      const [a, b] = zxStream(y)
      px(ctx, a + 2 + hash(k * 3) * (b - a - 6), y, 3, 2, '#f4fafa')
    }
  }),
  sp('zx_dry', '말라붙은 시내', 10, ZX_STREAM, (ctx) => fillRows(ctx, ZX_TOP, H, zxStream, '#b8aa86')),

  sp('zx_bamboo', '기슭에 길게 자란 가는 대', 14, ZX_BANK, (ctx, env) => {
    for (let k = 0; k < 22; k++) {
      const y = 120 + (k % 4) * 14
      const [a, b] = zxStream(y)
      const x = k % 2 ? b + 12 + (k % 5) * 10 : a - 14 - (k % 5) * 10
      bamboo(ctx, x, y, 70 + (k % 3) * 14, Math.sin(env.t * 0.8 + k) * 2, env.t)
    }
  }),
  sp('zx_willow', '버드나무', 14, ZX_BANK, (ctx, env) => {
    for (const x of [60, 260]) {
      px(ctx, x, 80, 3, 50, '#5a4632')
      for (let k = 0; k < 14; k++) for (let i = 0; i < 30; i++) dot(ctx, x - 20 + k * 3 + Math.sin(env.t + i * 0.2), 78 + i, '#8aa860')
    }
  }),
  sp('zx_reed', '갈대', 14, ZX_BANK, (ctx, env) => {
    grasses(ctx, 0, 110, 170, env, '#b8a870', 40, 18)
    grasses(ctx, 210, W, 170, env, '#b8a870', 40, 18)
  }),

  sp('zx_shoot', '모래를 뚫고 나온 푸른 대순', 22, ZX_SAND, (ctx) => {
    for (const [x, y, h] of [[40, 160, 12], [60, 168, 9], [82, 158, 14], [104, 166, 8], [30, 172, 7]] as const) {
      fillRows(ctx, y - h, y, (yy) => [x - (yy - y + h) * 0.25, x + (yy - y + h) * 0.25 + 1], (yy) => ((yy - y) % 3 === 0 ? '#3e7a3e' : '#5a9a4a'))
      px(ctx, x - 2, y, 6, 1, '#b8aa86')
    }
  }),
  sp('zx_mushroom', '버섯', 22, ZX_SAND, (ctx) => {
    for (let k = 0; k < 4; k++) {
      px(ctx, 40 + k * 20, 162, 1, 4, '#e8e2d0')
      px(ctx, 38 + k * 20, 160, 5, 2, '#a86a3a')
    }
  }),
  sp('zx_stone', '자갈', 22, ZX_SAND, (ctx) => {
    for (let k = 0; k < 6; k++) stone(ctx, 34 + k * 14, 166 + (k % 2) * 4, 3, '#a8a49a', '#8a867a')
  }),

  sp('zx_husk', '물에 떨어진 자줏빛 죽순 껍질', 26, ZX_STREAM, (ctx, env) => {
    for (let k = 0; k < 6; k++) {
      const y = ZX_TOP + 10 + mod(k * 14 + env.t * 2, 80)
      const [a, b] = zxStream(y)
      const x = (a + b) / 2 + Math.sin(k * 2) * (b - a) * 0.3
      fillRows(ctx, y, y + 3, (yy) => [x - 3 + (yy - y), x + 3 - (yy - y) * 0.5], '#8a4a6a')
      dot(ctx, x - 2, y, '#a86a8a')
    }
  }),
  sp('zx_leaf', '붉은 단풍잎', 26, ZX_STREAM, (ctx, env) => drift(ctx, env.t, { x: 120, y: 100, w: 80, h: 80 }, 10, '#c8502a', 0, 2)),
  sp('zx_petal', '흰 꽃잎', 26, ZX_STREAM, (ctx, env) => drift(ctx, env.t, { x: 120, y: 100, w: 80, h: 80 }, 12, '#f4f2ec', 0, 3)),
]
