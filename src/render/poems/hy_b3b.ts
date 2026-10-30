// 『唐詩畫意』 卷八 셋째 묶음 (2): 皇甫曾〈山下泉〉, 杜甫〈絕句〉 두 수, 錢起〈江行無題〉 其一~其四
import type { Background } from '../types'
import { H, W, disc, dot, fillRows, hash, mod, px } from '../pixel'
import type { Ctx } from '../pixel'
import { GREEN, bamboo, boat, broadTree, flower, house, hut, mistBands, moon, person, pine, rain, ridge, sky, snowfall, stars, withAlpha } from '../kit'
import { OTHER_PALS } from '../figures'
import { duck, grasses, lotusFlower, lotusPad, mix, shimmer, skiff, soundArcs, sp, stone, sun, water } from './hy_kit'

const FULL = { x: 0, y: 0, w: 320, h: 180 }

/** 엎드려 무언가를 씻거나 캐는 작은 사람 */
function crouch(ctx: Ctx, x: number, y: number, robe: string, t = 0) {
  const b = Math.sin(t * 3) > 0 ? 1 : 0
  px(ctx, x, y + 3, 7, 4, robe)
  px(ctx, x + 6, y + 1 + b, 3, 3, '#e6c39b')
  px(ctx, x + 6, y + b, 3, 1, '#1f1d22')
  px(ctx, x + 8, y + 5 + b, 2, 3, robe)
}

// ════════════════════════════════════════════════════════════
// 皇甫曾〈山下泉〉: 산속 샘에서 산 아래 못까지
// ════════════════════════════════════════════════════════════
const SQ_POOL = { y0: 134, y1: 172 }
const sqPool = (y: number): [number, number] => {
  const d = (y - 153) / 19
  const w = 78 * Math.sqrt(Math.max(0, 1 - d * d))
  return [228 - w, 228 + w]
}
/** 산속 샘에서 바위를 지나 못으로 흐르는 물길 */
const sqStream = (t: number) => ({ x: 46 + t * 120 + Math.sin(t * 7) * 6, y: 74 + t * 66 })
const SQ_TREES = [168, 186, 206, 226, 250, 272, 292]

export const shanquanBackground: Background = {
  id: 'hy039',
  drawBack(ctx) {
    sky(ctx, ['#c4d4d8', '#d0dcdc', '#dce4dc'], 130)
    ridge(ctx, (x) => 54 + 22 * Math.sin(x * 0.012 + 3.6), '#8aa494', '#98b2a2')
    // 왼쪽이 높은 산비탈
    fillRows(ctx, 60, H, (y) => [0, 90 + (y - 60) * 1.8], (y) => mix('#6a8a64', '#4e6a4a', (y - 60) / 120))
    px(ctx, 0, 132, W, H - 132, '#5a7252')
    // 물길 (바닥)
    for (let t = 0; t <= 1; t += 0.006) {
      const p = sqStream(t)
      px(ctx, p.x - 2, p.y, 5, 2, '#5a6a6a')
    }
    // 물길의 바위
    for (const [x, y, r] of [[110, 106, 6], [124, 116, 7], [138, 124, 6], [102, 116, 4], [150, 130, 5]] as const) stone(ctx, x, y, r, '#a8a49a', '#7e7a70')
    // 못과 못가 숲
    for (const x of SQ_TREES) broadTree(ctx, x, 134, 1.3 + hash(x) * 0.3, GREEN)
    fillRows(ctx, SQ_POOL.y0, SQ_POOL.y1, sqPool, '#7a9aa0')
    // 위쪽 산속 샘
    fillRows(ctx, 68, 78, (y) => [30 + Math.abs(y - 73) * 2, 62 - Math.abs(y - 73) * 2], '#7a9aa0')
    for (let k = 0; k < 4; k++) pine(ctx, 14 + k * 16, 70 - k * 3, 0.8)
  },
  drawFront() {},
  drawDynamic() {},
}

const SQ_POOL_F = { x: 148, y: 99, w: 160, h: 81 }
const SQ_ROCK = { x: 72, y: 80, w: 112, h: 63 }
const SQ_UP = { x: 0, y: 34, w: 112, h: 63 }
const inPool = (ctx: Ctx, f: () => void) => {
  ctx.save()
  ctx.beginPath()
  ctx.ellipse(228, 153, 77, 18, 0, 0, Math.PI * 2)
  ctx.clip()
  f()
  ctx.restore()
}

export const SHANQUAN_SPRITES = [
  sp('sq_glow', '산빛 어린 샘', 10, SQ_POOL_F, (ctx, env) => inPool(ctx, () => {
    for (let y = SQ_POOL.y0; y < SQ_POOL.y1; y++) px(ctx, 150, y, 160, 1, mix('#8ab4a4', '#5e8a80', (y - SQ_POOL.y0) / 38))
    for (let k = 0; k < 16; k++) {
      const x = 156 + mod(hash(k) * 150 + Math.sin(env.t + k) * 4, 150)
      px(ctx, x, 138 + hash(k * 3) * 30, 6, 1, Math.sin(env.t * 2 + k) > 0 ? '#c4e0d0' : '#a4c8b8')
    }
  })),
  sp('sq_mud', '누런 흙빛 물', 10, SQ_POOL_F, (ctx) => inPool(ctx, () => px(ctx, 150, SQ_POOL.y0, 160, 40, '#a08a5a'))),
  sp('sq_ice', '하얗게 언 물', 10, SQ_POOL_F, (ctx) => inPool(ctx, () => {
    px(ctx, 150, SQ_POOL.y0, 160, 40, '#e4eef0')
    for (let k = 0; k < 6; k++) px(ctx, 170 + k * 20, 146 + (k % 3) * 6, 12, 1, '#c4d4dc')
  })),

  sp('sq_reflect', '거꾸로 비친 숲 그림자', 12, SQ_POOL_F, (ctx, env) => inPool(ctx, () => {
    withAlpha(ctx, 0.45, () => {
      for (const x of SQ_TREES) {
        const s = Math.sin(env.t * 1.5 + x) * 1
        px(ctx, x - 1 + s, 135, 2, 8, '#2e4a32')
        disc(ctx, x + s, 150, 8, '#2e4a32')
        disc(ctx, x + 4 + s, 146, 5, '#2e4a32')
      }
    })
  })),
  sp('sq_fish', '헤엄치는 물고기 떼', 12, SQ_POOL_F, (ctx, env) => inPool(ctx, () => {
    for (let k = 0; k < 7; k++) {
      const x = 160 + mod(hash(k) * 140 + env.t * (6 + k), 140)
      const y = 142 + hash(k * 3) * 22
      px(ctx, x, y, 5, 2, '#d8702a')
      dot(ctx, x - 1, y, '#d8702a')
    }
  })),
  sp('sq_moon', '물에 비친 둥근 달', 12, SQ_POOL_F, (ctx) => inPool(ctx, () => disc(ctx, 228, 152, 6, '#f4ecc8'))),

  sp('sq_splash', '돌 위에서 떠들썩한 물', 22, SQ_ROCK, (ctx, env) => {
    for (let t = 0.4; t <= 0.9; t += 0.01) {
      const p = sqStream(t)
      px(ctx, p.x - 2, p.y, 5, 2, Math.sin(t * 60 - env.t * 8) > 0 ? '#e8f2f4' : '#a8c8d0')
    }
    for (let k = 0; k < 14; k++) {
      const f = mod(env.t * 1.4 + k / 14, 1)
      const p = sqStream(0.48 + (k % 4) * 0.1)
      dot(ctx, p.x + (k % 3 - 1) * f * 8, p.y - Math.sin(f * 3.14) * 6, '#f4fafa')
    }
    soundArcs(ctx, 126, 112, env.t, '#4a5a5a', 26)
  }),
  sp('sq_still', '고요히 고인 물', 22, SQ_ROCK, (ctx) => {
    for (let t = 0.4; t <= 0.9; t += 0.01) {
      const p = sqStream(t)
      px(ctx, p.x - 3, p.y, 7, 2, '#8aaab0')
    }
  }),
  sp('sq_dry', '말라붙은 물길', 22, SQ_ROCK, (ctx) => {
    for (let t = 0.4; t <= 0.9; t += 0.01) {
      const p = sqStream(t)
      px(ctx, p.x - 2, p.y, 5, 2, '#a89a7a')
      if (hash(t * 100) > 0.7) dot(ctx, p.x, p.y + 1, '#7a6a4a')
    }
  }),

  sp('sq_quiet', '산속의 고요', 24, SQ_UP, (ctx, env) => {
    for (let y = 68; y < 78; y++) px(ctx, 30 + Math.abs(y - 73) * 2, y, 32 - Math.abs(y - 73) * 4, 1, '#a8c8c8')
    px(ctx, 42, 72, 3, 1, '#c89a3a')
    mistBands(ctx, env.t * 0.4, [56, 62, 82], '#f4f6f4', 0.6)
    for (let k = 0; k < 4; k++) dot(ctx, 50 + Math.sin(env.t * 0.3) * 2 + k * 3, 73, '#c4dcdc')
    // 아래에서 위로 이어지는 그리움의 실선
    withAlpha(ctx, 0.5, () => {
      for (let t = 0; t < 0.5; t += 0.03) {
        const p = sqStream(t)
        if (Math.sin(t * 40 + env.t * 3) > 0) dot(ctx, p.x, p.y - 4, '#f4f6f4')
      }
    })
  }),
  sp('sq_village', '아래 마을의 불빛', 24, SQ_POOL_F, (ctx) => {
    for (let k = 0; k < 3; k++) {
      house(ctx, 170 + k * 40, 160)
      px(ctx, 174 + k * 40, 166, 4, 3, '#ffcf6a')
    }
  }),
  sp('sq_sea', '넓은 바다', 24, SQ_UP, (ctx, env) => {
    px(ctx, 0, 40, 112, 30, '#5a8aa0')
    for (let k = 0; k < 10; k++) px(ctx, mod(hash(k) * 110 + env.t * 4, 110), 44 + hash(k * 3) * 24, 6, 1, '#a8c8d4')
  }),
]

// ════════════════════════════════════════════════════════════
// 杜甫〈絕句〉(鑿井交棕葉): 초당 둘레의 우물·도랑·배·오솔길
// ════════════════════════════════════════════════════════════
const ZJ_RIVER = 142
const ZJ_WELL = { x: 46, y: 140 }
const zjCanal = (t: number) => ({ x: 112 + t * 106, y: 122 + t * 22 + Math.sin(t * 6) * 2 })
const zjPath = (t: number) => ({ x: 150 - t * 30 + Math.sin(t * 9) * 16, y: 178 - t * 84 })

export const zaojingBackground: Background = {
  id: 'hy040',
  drawBack(ctx) {
    sky(ctx, ['#b8d0dc', '#c8dae0', '#d8e4e0'], 96)
    ridge(ctx, (x) => 80 + 8 * Math.sin(x * 0.02 + 0.7), '#90a8a0', '#9ab4aa', 0, W, 96)
    px(ctx, 0, 96, W, H - 96, '#7a9a5a')
    for (let y = 96; y < H; y += 5) px(ctx, 0, y, W, 1, '#729250')
    // 강 (오른쪽 아래)
    fillRows(ctx, ZJ_RIVER, H, (y) => [200 - (y - ZJ_RIVER) * 1.6, W], '#7aa0aa')
    px(ctx, 200, ZJ_RIVER, 120, 1, '#a8c8c8')
    // 대숲
    for (let k = 0; k < 10; k++) bamboo(ctx, 80 + k * 8, 124, 36 + (k % 3) * 8)
    // 우물 돌테
    px(ctx, ZJ_WELL.x - 10, ZJ_WELL.y - 6, 20, 8, '#9a9284')
    px(ctx, ZJ_WELL.x - 8, ZJ_WELL.y - 6, 16, 2, '#2a3a3e')
    px(ctx, ZJ_WELL.x - 10, ZJ_WELL.y - 7, 20, 1, '#b4ac9c')
    // 먼 마을
    for (let k = 0; k < 3; k++) hut(ctx, 98 + k * 22, 84 + (k % 2) * 2)
  },
  drawFront() {},
  drawDynamic() {},
}

const ZJ_WELL_F = { x: 0, y: 84, w: 112, h: 63 }
const ZJ_CANAL = { x: 96, y: 96, w: 144, h: 81 }
const ZJ_BOAT = { x: 192, y: 120, w: 112, h: 60 }
const ZJ_PATH = { x: 72, y: 76, w: 144, h: 81 }

export const ZAOJING_SPRITES = [
  sp('zj_palm', '우물 위에 엇갈린 종려잎', 22, ZJ_WELL_F, (ctx, env) => {
    for (const [bx, lean] of [[30, 1], [66, -1]] as const) {
      for (let i = 0; i < 40; i++) px(ctx, bx + lean * i * 0.2, 140 - i, 3, 1, i % 4 ? '#7a6248' : '#5a4632')
      const tx = bx + lean * 8
      for (let k = 0; k < 7; k++) {
        const a = -Math.PI / 2 + (k - 3) * 0.45 + lean * 0.5 + Math.sin(env.t + k) * 0.03
        for (let r = 0; r < 18; r++) {
          const x = tx + Math.cos(a) * r
          const y = 100 + Math.sin(a) * r + (r * r) / 50
          dot(ctx, x, y, r % 3 ? '#3e7a3e' : '#5a9a4a')
          if (r % 3 === 0) dot(ctx, x, y + 1, '#2e5a2e')
        }
      }
    }
  }),
  sp('zj_willow', '우물 위 버들가지', 22, ZJ_WELL_F, (ctx, env) => {
    px(ctx, 28, 100, 3, 40, '#5a4632')
    for (let k = 0; k < 14; k++) for (let i = 0; i < 26; i++) dot(ctx, 18 + k * 3 + Math.sin(env.t + i * 0.2) * 1.5, 98 + i, k % 2 ? '#8aa860' : '#a4bf74')
  }),
  sp('zj_grape', '우물 위 포도 덩굴', 22, ZJ_WELL_F, (ctx) => {
    for (const x of [32, 60]) px(ctx, x, 112, 2, 28, '#6a4a32')
    px(ctx, 30, 110, 34, 2, '#6a4a32')
    for (let k = 0; k < 8; k++) disc(ctx, 32 + k * 4, 108, 3, '#5a8a3a')
    for (let k = 0; k < 4; k++) disc(ctx, 36 + k * 7, 115, 2, '#6a3a6a')
  }),

  sp('zj_canal', '대 뿌리 끊고 낸 도랑', 14, ZJ_CANAL, (ctx, env) => {
    for (let t = 0; t <= 1; t += 0.01) {
      const p = zjCanal(t)
      px(ctx, p.x - 2, p.y, 6, 3, '#6a8a92')
      if (Math.sin(t * 40 - env.t * 4) > 0.7) dot(ctx, p.x, p.y + 1, '#b8d4d8')
    }
    for (const t of [0.04, 0.12, 0.2]) {
      const p = zjCanal(t)
      px(ctx, p.x - 5, p.y - 2, 3, 2, '#c8b890')
      px(ctx, p.x + 4, p.y + 3, 3, 2, '#c8b890')
    }
    px(ctx, 104, 112, 1, 12, '#5a4632')
    px(ctx, 102, 122, 5, 3, '#8a8a8a')
  }),
  sp('zj_bridge', '도랑 위 돌다리', 14, ZJ_CANAL, (ctx) => {
    for (let t = 0; t <= 1; t += 0.01) {
      const p = zjCanal(t)
      px(ctx, p.x - 2, p.y, 6, 3, '#6a8a92')
    }
    const p = zjCanal(0.5)
    px(ctx, p.x - 8, p.y - 3, 18, 3, '#a8a49a')
    px(ctx, p.x - 6, p.y - 4, 14, 1, '#c8c4b8')
  }),
  sp('zj_mill', '도랑의 물레방아', 14, ZJ_CANAL, (ctx, env) => {
    for (let t = 0; t <= 1; t += 0.01) {
      const p = zjCanal(t)
      px(ctx, p.x - 2, p.y, 6, 3, '#6a8a92')
    }
    const p = zjCanal(0.45)
    disc(ctx, p.x, p.y - 6, 9, '#6a4a32')
    disc(ctx, p.x, p.y - 6, 7, '#7a9a5a')
    for (let k = 0; k < 6; k++) {
      const a = env.t + (k * Math.PI) / 3
      for (let r = 0; r < 9; r++) dot(ctx, p.x + Math.cos(a) * r, p.y - 6 + Math.sin(a) * r, '#5a3e2a')
    }
  }),

  sp('zj_moored', '줄에 매여 흔들리는 작은 배', 22, ZJ_BOAT, (ctx, env) => {
    const s = Math.sin(env.t * 1.2) * 2
    px(ctx, 214, 140, 2, 12, '#5a4632')
    for (let i = 0; i < 16; i++) dot(ctx, 216 + i, 146 + Math.sin(i / 5) * 2 + (i / 16) * s, '#8a7a5a')
    boat(ctx, 246 + s, 158, { len: 26 })
    withAlpha(ctx, 0.5, () => px(ctx, 230 + s, 159, 32, 1, '#d8e4e2'))
  }),
  sp('zj_sail', '돛 펴고 달리는 배', 22, ZJ_BOAT, (ctx, env) => boat(ctx, 220 + mod(env.t * 8, 80), 160, { len: 22, mast: 18, sail: 14 })),
  sp('zj_beached', '모래에 얹힌 배', 22, ZJ_BOAT, (ctx) => {
    fillRows(ctx, 146, 156, (y) => [200 + (y - 146), 270 - (y - 146) * 2], '#d0c09a')
    boat(ctx, 232, 150, { len: 24 })
  }),

  sp('zj_path', '굽이굽이 마을로 가는 오솔길', 12, ZJ_PATH, (ctx) => {
    for (let t = 0; t <= 1; t += 0.004) {
      const p = zjPath(t)
      px(ctx, p.x - 2 + t * 1.5, p.y, 5 - t * 3, 1, '#c8b88a')
    }
  }),
  sp('zj_road', '곧게 뻗은 큰길', 12, ZJ_PATH, (ctx) => fillRows(ctx, 96, H, (y) => [140 - (y - 96) * 0.4, 146 + (y - 96) * 0.4], '#c8b88a')),
  sp('zj_climb', '산꼭대기로 오르는 길', 12, ZJ_PATH, (ctx) => {
    for (let t = 0; t <= 1; t += 0.004) px(ctx, 150 + Math.sin(t * 30) * 8 * (1 - t), 178 - t * 100, 3, 1, '#c8b88a')
  }),
]

// ════════════════════════════════════════════════════════════
// 杜甫〈絕句〉(水檻溫江口): 성도 초당 둘레
// ════════════════════════════════════════════════════════════
const SK_WATER = 132

export const shuijianBackground: Background = {
  id: 'hy041',
  drawBack(ctx) {
    sky(ctx, ['#bcccd4', '#ccd8da', '#dce2da'], SK_WATER)
    ridge(ctx, (x) => 92 + 10 * Math.sin(x * 0.017 + 1.4), '#90a4a0', '#9cb0aa', 0, W, SK_WATER)
    px(ctx, 0, 112, W, SK_WATER - 112, '#7e9a62')
    water(ctx, SK_WATER, H, '#8aacb2', '#6a8e98', '#b4ccce')
    // 갈라져 들어오는 물줄기 (강어귀)
    fillRows(ctx, 112, SK_WATER, (y) => [40 + (SK_WATER - y) * 2.4, 58 + (SK_WATER - y) * 2.6], '#8aacb2')
    // 띠집
    hut(ctx, 128, 100)
    px(ctx, 112, 116, 56, 1, '#6a7a4e')
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    shimmer(ctx, env.t, SK_WATER + 2, 178, 18, '#d8e8e8')
  },
}

const SK_MOUTH = { x: 0, y: 84, w: 128, h: 72 }
const SK_HALL = { x: 104, y: 60, w: 128, h: 72 }
const SK_FAR = { x: 200, y: 72, w: 120, h: 68 }
const SK_NEAR = { x: 176, y: 120, w: 112, h: 60 }

export const SHUIJIAN_SPRITES = [
  sp('sk_rail', '강어귀의 물가 난간', 20, SK_MOUTH, (ctx) => {
    px(ctx, 16, 124, 70, 3, '#8a6a48')
    for (let x = 18; x < 86; x += 8) px(ctx, x, 127, 2, 14, '#6a4a32')
    px(ctx, 16, 116, 70, 1, '#6a4a32')
    for (let x = 18; x < 86; x += 6) px(ctx, x, 117, 1, 7, '#6a4a32')
    person(ctx, 50, 114, '#4b5068')
  }),
  sp('sk_peak', '산꼭대기 난간', 20, SK_MOUTH, (ctx) => {
    fillRows(ctx, 90, 132, (y) => [40 - (y - 90) * 0.8, 70 + (y - 90) * 0.8], '#7a8a6a')
    px(ctx, 40, 88, 30, 1, '#6a4a32')
    for (let x = 40; x < 70; x += 5) px(ctx, x, 88, 1, 5, '#6a4a32')
  }),
  sp('sk_market', '저잣거리 난간', 20, SK_MOUTH, (ctx) => {
    for (let k = 0; k < 3; k++) {
      px(ctx, 12 + k * 28, 108, 24, 3, ['#b2352a', '#d9a441', '#4f6b4a'][k])
      px(ctx, 14 + k * 28, 111, 2, 10, '#5a4632')
      person(ctx, 22 + k * 28, 114, OTHER_PALS[k].R)
    }
  }),

  sp('sk_stone', '띠집 동쪽의 석순', 20, SK_HALL, (ctx) => {
    for (const [cx, top, w0, lean] of [[194, 66, 5, 2], [204, 88, 3, -1]] as const) {
      fillRows(ctx, top, 116, (y) => {
        const f = (y - top) / (116 - top)
        const w = 1 + w0 * Math.sqrt(f)
        const x = cx + lean * (1 - f) * 3
        return [x - w, x + w]
      }, (y) => (hash(y * 3.1 + cx) > 0.8 ? '#8a8478' : '#a49e90'))
      for (let y = top + 4; y < 116; y += 5) dot(ctx, cx - 1 + lean * (1 - (y - top) / (116 - top)) * 3, y, '#c4beb0')
    }
    px(ctx, 186, 116, 26, 2, '#7a7468')
  }),
  sp('sk_pagoda', '높은 탑', 20, SK_HALL, (ctx) => {
    for (let k = 0; k < 5; k++) {
      px(ctx, 188 + k, 72 + k * 9, 16 - k * 2 + k * 2, 6, '#c9bfa5')
      px(ctx, 184 + k, 70 + k * 9, 24 - k * 2 + k * 2, 2, '#3c4048')
    }
  }),
  sp('sk_tree', '큰 느티나무', 20, SK_HALL, (ctx) => broadTree(ctx, 196, 116, 2.4, GREEN)),

  sp('sk_shrine', '배를 옮겨 가는 선주묘', 22, SK_FAR, (ctx, env) => {
    px(ctx, 240, 104, 52, 16, '#b8352a')
    px(ctx, 238, 96, 56, 3, '#3c4048')
    px(ctx, 236, 99, 60, 4, '#2e3238')
    for (let x = 244; x < 292; x += 9) px(ctx, x, 104, 2, 16, '#6b2a1e')
    px(ctx, 232, 120, 68, 3, '#9a9284')
    for (let k = 0; k < 3; k++) broadTree(ctx, 226 + k * 40, 122, 1.2, GREEN)
    skiff(ctx, 220 + mod(env.t * 3, 30), 140, env.t, { guest: '#4b5068', len: 20 })
  }),
  sp('sk_city', '큰 성문', 22, SK_FAR, (ctx) => {
    px(ctx, 220, 100, 96, 24, '#8a8274')
    for (let x = 220; x < 316; x += 8) px(ctx, x, 96, 5, 4, '#8a8274')
    fillRows(ctx, 108, 124, () => [262, 276], '#2e2a26')
  }),
  sp('sk_sea', '넓은 바다', 22, SK_FAR, (ctx, env) => {
    px(ctx, 200, 112, 120, 22, '#5a8aa0')
    for (let k = 0; k < 10; k++) px(ctx, 200 + mod(hash(k) * 120 + env.t * 4, 120), 114 + hash(k * 3) * 18, 6, 1, '#a8c8d4')
  }),

  sp('sk_herb', '시내에서 약초를 씻는 사람', 26, SK_NEAR, (ctx, env) => {
    px(ctx, 196, 150, 70, 6, '#7e9a62')
    crouch(ctx, 226, 144, '#4b5068', env.t)
    px(ctx, 206, 148, 12, 6, '#a8864a')
    for (let k = 0; k < 5; k++) px(ctx, 207 + k * 2, 144 - (k % 2), 1, 4, '#4a8a3a')
    for (let k = 0; k < 4; k++) {
      const f = mod(env.t * 0.6 + k / 4, 1)
      withAlpha(ctx, 1 - f, () => px(ctx, 236 + f * 20, 158 + k, 3, 1, '#e8f2f0'))
    }
    for (let k = 0; k < 3; k++) px(ctx, 238 + k * 4, 156, 2, 2, '#4a8a3a')
  }),
  sp('sk_laundry', '빨래하는 사람', 26, SK_NEAR, (ctx, env) => {
    px(ctx, 196, 150, 70, 6, '#7e9a62')
    crouch(ctx, 226, 144, '#7a4a3a', env.t)
    px(ctx, 236, 156, 10, 4, '#e8e2d0')
  }),
  sp('sk_fish', '낚시하는 사람', 26, SK_NEAR, (ctx) => {
    px(ctx, 196, 150, 70, 6, '#7e9a62')
    person(ctx, 226, 141, '#4b5068', { hat: '#a89567' })
    for (let i = 0; i < 24; i++) dot(ctx, 229 + i, 144 - i * 0.4, '#5a4632')
    px(ctx, 253, 135, 1, 26, '#c8c4b8')
  }),
]

// ════════════════════════════════════════════════════════════
// 錢起〈江行無題〉 其一: 밤비에 불어난 강
// ════════════════════════════════════════════════════════════
const J1_WATER = 112
const J1_BOAT = { x: 150, y: 150 }
const j1Bank = (y: number): [number, number] => [0, 116 - (y - 104) * 0.7]

/** 뱃창이 있는 지붕배 */
function windowBoat(ctx: Ctx, x: number, y: number) {
  for (let r = 0; r < 6; r++) px(ctx, x - 36 + (r > 3 ? r - 3 : 0) * 3, y - 3 + r, 72 - (r > 3 ? r - 3 : 0) * 6, 1, r === 0 ? '#7a5a3c' : '#5a3d28')
  px(ctx, x - 22, y - 16, 44, 13, '#6a5a40')
  px(ctx, x - 24, y - 19, 48, 3, '#3d3a32')
  px(ctx, x - 22, y - 20, 44, 1, '#55513f')
  // 뱃창
  px(ctx, x - 16, y - 13, 12, 7, '#2a2620')
  px(ctx, x - 17, y - 14, 14, 1, '#8a6a48')
  px(ctx, x - 17, y - 6, 14, 1, '#8a6a48')
  px(ctx, x - 11, y - 13, 1, 7, '#8a6a48')
  px(ctx, x + 6, y - 13, 10, 7, '#2a2620')
}

export const jiangxing1Background: Background = {
  id: 'hy042',
  drawBack(ctx) {
    sky(ctx, ['#b8c4c8', '#c8d0ce', '#d4dad2'], J1_WATER)
    ridge(ctx, (x) => 84 + 12 * Math.sin(x * 0.02 + 2.2), '#7c9290', '#88a09c', 0, W, J1_WATER)
    water(ctx, J1_WATER, H, '#8aa4a4', '#6a8888', '#b0c8c4')
    // 왼쪽 기슭과 모래
    fillRows(ctx, 104, 150, j1Bank, (y) => (y < 112 ? '#6a8a5a' : '#5e7a50'))
    fillRows(ctx, 112, 134, (y) => [j1Bank(y)[1] - 4, j1Bank(y)[1] + 26 - (y - 112)], '#d0c4a0')
    windowBoat(ctx, J1_BOAT.x, J1_BOAT.y)
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    shimmer(ctx, env.t, J1_WATER + 2, 178, 16, '#d8e4e0', 160, W)
  },
}

const J1_RIVER = { x: 140, y: 80, w: 180, h: 100 }
const J1_BANK = { x: 40, y: 92, w: 128, h: 72 }
const J1_WIN = { x: 92, y: 110, w: 96, h: 54 }

export const JIANGXING1_SPRITES = [
  sp('j1_flood', '산비에 불어난 강물', 4, FULL, (ctx, env) => {
    withAlpha(ctx, 0.55, () => rain(ctx, env.t * 0.3, 40, 30, 'rgba(110,125,135,0.8)', 3))
    for (let y = J1_WATER - 6; y < J1_WATER + 2; y++) px(ctx, 100, y, 220, 1, '#8a9a8a')
    withAlpha(ctx, 0.25, () => px(ctx, 0, J1_WATER - 6, W, H - J1_WATER + 6, '#a8946a'))
  }),
  sp('j1_dry', '가뭄에 마른 강', 4, FULL, (ctx) => {
    fillRows(ctx, J1_WATER, H, (y) => [140 + (y - J1_WATER) * 0.6, W], '#c4b490')
    px(ctx, 200, 150, 120, 10, '#8aa4a4')
  }),
  sp('j1_snow', '눈 덮인 강가', 4, FULL, (ctx, env) => {
    fillRows(ctx, 104, 110, j1Bank, '#f4f6f6')
    ridge(ctx, (x) => 84 + 12 * Math.sin(x * 0.02 + 2.2), '#e4eaec', '#f4f6f6', 0, W, 90)
    snowfall(ctx, env.t, 60)
  }),

  sp('j1_fish', '강 가득 뛰노는 물고기', 22, J1_RIVER, (ctx, env) => {
    for (let k = 0; k < 9; k++) {
      const f = mod(env.t * 0.7 + hash(k) , 1)
      const x0 = 160 + hash(k * 3) * 150
      const y0 = 130 + hash(k * 5) * 40
      if (f < 0.5) {
        const g = f / 0.5
        const x = x0 + g * 12
        const y = y0 - Math.sin(g * Math.PI) * 12
        px(ctx, x, y, 4, 2, '#c8ccc4')
        dot(ctx, x - 1, y - 1, '#c8ccc4')
      } else {
        const g = (f - 0.5) * 2
        withAlpha(ctx, 1 - g, () => {
          for (let a = 0; a < 6.28; a += 0.5) dot(ctx, x0 + 12 + Math.cos(a) * g * 6, y0 + Math.sin(a) * g * 2, '#e4eeea')
        })
      }
    }
  }),
  sp('j1_ducks', '떠다니는 오리 떼', 22, J1_RIVER, (ctx, env) => {
    for (let k = 0; k < 5; k++) duck(ctx, 180 + mod(k * 26 + env.t * 4, 130), 136 + (k % 3) * 10)
  }),
  sp('j1_lotus', '강의 연꽃', 22, J1_RIVER, (ctx) => {
    for (let k = 0; k < 8; k++) {
      lotusPad(ctx, 176 + k * 18, 132 + (k % 3) * 12)
      if (k % 2) lotusFlower(ctx, 178 + k * 18, 128 + (k % 3) * 12)
    }
  }),

  sp('j1_sunk', '물에 잠겨 사라지는 모래톱', 8, J1_BANK, (ctx, env) => {
    fillRows(ctx, 112, 136, (y) => [j1Bank(y)[1] - 6, j1Bank(y)[1] + 30 - (y - 112)], '#8aa4a4')
    for (let k = 0; k < 4; k++) px(ctx, 88 + k * 9 + Math.sin(env.t + k) * 2, 114 + k * 4, 6, 1, '#d0c4a0')
  }),
  sp('j1_wide', '넓게 드러난 모래톱', 8, J1_BANK, (ctx) => {
    fillRows(ctx, 112, 148, (y) => [j1Bank(y)[1] - 4, j1Bank(y)[1] + 60 - (y - 112)], '#d8ccaa')
  }),
  sp('j1_steps', '발자국 가득한 모래', 8, J1_BANK, (ctx) => {
    for (let k = 0; k < 10; k++) px(ctx, 88 + k * 4, 114 + (k % 2) * 2 + k * 1.4, 2, 1, '#8a7a5a')
  }),

  sp('j1_smartweed', '뱃창으로 늘어진 여뀌', 26, J1_WIN, (ctx, env) => {
    for (let k = 0; k < 7; k++) {
      const bx = 106 + k * 4
      const sw = Math.sin(env.t * 1.2 + k) * 1.5
      for (let i = 0; i < 22; i++) {
        const f = i / 22
        dot(ctx, bx + f * 22 + sw * f, 118 + f * 14 - f * f * 6 + (k % 2), '#5a7a3a')
      }
      for (let i = 0; i < 5; i++) dot(ctx, bx + 20 + sw + i * 0.6, 126 + i + (k % 2), i % 2 ? '#d8607a' : '#e88a9a')
    }
  }),
  sp('j1_moon', '뱃창에 든 달빛', 26, J1_WIN, (ctx) => {
    withAlpha(ctx, 0.6, () => px(ctx, 134, 137, 12, 7, '#f4ecc8'))
    moon(ctx, 120, 100, 5)
  }),
  sp('j1_rain', '뱃창에 드는 빗물', 26, J1_WIN, (ctx, env) => {
    ctx.save()
    ctx.beginPath()
    ctx.rect(96, 100, 92, 50)
    ctx.clip()
    rain(ctx, env.t, 50, 120, 'rgba(150,170,190,0.8)')
    ctx.restore()
  }),
]

// ════════════════════════════════════════════════════════════
// 錢起〈江行無題〉 其二: 밤배와 다듬이 소리
// ════════════════════════════════════════════════════════════
const J2_WATER = 118
const DIPPER: [number, number][] = [[24, 40], [36, 36], [48, 38], [58, 44], [62, 56], [76, 58], [78, 46]]

export const jiangxing2Background: Background = {
  id: 'hy043',
  drawBack(ctx) {
    sky(ctx, ['#121828', '#1a2236', '#222c42'], J2_WATER)
    stars(ctx, 24, 11, 4, 90, 0, '#a8acc0')
    ridge(ctx, (x) => 98 + 6 * Math.sin(x * 0.02 + 0.4), '#1a2028', '#222a34', 0, W, J2_WATER)
    // 맞은편 기슭
    fillRows(ctx, 104, J2_WATER, (y) => [160 - (y - 104) * 2, W], '#1e2620')
    water(ctx, J2_WATER, H, '#26324a', '#1a243a', '#38465e')
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    shimmer(ctx, env.t, J2_WATER + 3, 178, 14, '#3e4c66')
  },
}

const J2_SKY = { x: 0, y: 16, w: 128, h: 72 }
const J2_RIVER = { x: 40, y: 108, w: 128, h: 72 }
const J2_BANK = { x: 176, y: 72, w: 128, h: 72 }

export const JIANGXING2_SPRITES = [
  sp('j2_dipper', '기운 북두와 지지 않은 달', 6, J2_SKY, (ctx, env) => {
    DIPPER.forEach(([x, y], i) => {
      dot(ctx, x, y, '#f4f0dc')
      if (Math.sin(env.t * 2 + i) > 0) {
        dot(ctx, x - 1, y, '#c8c4b0')
        dot(ctx, x + 1, y, '#c8c4b0')
      }
    })
    withAlpha(ctx, 0.25, () => DIPPER.slice(0, -1).forEach(([x, y], i) => {
      const [nx, ny] = DIPPER[i + 1]
      for (let f = 0.15; f < 0.9; f += 0.1) dot(ctx, x + (nx - x) * f, y + (ny - y) * f, '#c8c4b0')
    }))
    moon(ctx, 100, 82, 6)
  }),
  sp('j2_sun', '떠오르는 해', 6, J2_SKY, (ctx) => {
    sky(ctx, ['#4a4a6a', '#8a6a6a', '#d8906a'], 100)
    sun(ctx, 80, 92, 8, '#f4a050')
  }),
  sp('j2_rainbow', '밤하늘의 무지개', 6, J2_SKY, (ctx) => {
    for (const [r, c] of [[46, '#c8504a'], [43, '#d8a040'], [40, '#7aa050'], [37, '#4a6ab0']] as const)
      for (let a = Math.PI; a < Math.PI * 2; a += 0.01) dot(ctx, 70 + Math.cos(a) * r, 98 + Math.sin(a) * r * 0.9, c)
  }),

  sp('j2_night', '깊은 밤 강을 가는 배', 22, J2_RIVER, (ctx, env) => {
    const x = 90 + Math.sin(env.t * 0.1) * 10
    boat(ctx, x, 148, { len: 30, lantern: true, t: env.t })
    person(ctx, x - 13, 137, '#3a3a40', { hat: '#6a6050' })
    withAlpha(ctx, 0.45, () => {
      for (let k = 1; k < 6; k++) px(ctx, x + 14 + k * 6, 149 + k, 5, 1, '#5a6a86')
    })
    withAlpha(ctx, 0.35, () => {
      for (let y = 151; y < 172; y += 3) px(ctx, x + 12, y, 2, 1, '#f4c060')
    })
  }),
  sp('j2_moor', '나루에 매인 배', 22, J2_RIVER, (ctx) => {
    px(ctx, 40, 136, 30, 4, '#3a2e22')
    px(ctx, 66, 136, 2, 14, '#3a2e22')
    boat(ctx, 96, 148, { len: 30 })
  }),
  sp('j2_dawn', '아침에 떠나는 배', 22, J2_RIVER, (ctx) => {
    withAlpha(ctx, 0.25, () => px(ctx, 0, J2_WATER, W, H - J2_WATER, '#d8906a'))
    boat(ctx, 96, 148, { len: 30, mast: 18, sail: 14 })
  }),

  sp('j2_village', '멀지 않은 작은 마을', 20, J2_BANK, (ctx, env) => {
    for (let k = 0; k < 4; k++) {
      const x = 194 + k * 24
      const y = 98 + (k % 2) * 3
      for (let r = 0; r < 4; r++) px(ctx, x + 2 - r, y + r, 16 + r * 2, 1, '#2e2a24')
      px(ctx, x, y + 4, 16, 7, '#3a342c')
      if (k % 2 === 0) px(ctx, x + 6, y + 6, 3, 3, Math.sin(env.t * 2 + k) > -0.6 ? '#f4c060' : '#c89a40')
    }
    broadTree(ctx, 290, 112, 1.1, { dark: '#141c16', base: '#1a241c', light: '#222e24' })
  }),
  sp('j2_city', '큰 성', 20, J2_BANK, (ctx) => {
    px(ctx, 180, 92, 130, 20, '#2e2e34')
    for (let x = 180; x < 310; x += 8) px(ctx, x, 88, 5, 4, '#2e2e34')
    px(ctx, 230, 80, 30, 12, '#262630')
  }),
  sp('j2_temple', '산속 절', 20, J2_BANK, (ctx) => {
    px(ctx, 220, 94, 50, 14, '#2e2a26')
    px(ctx, 214, 88, 62, 6, '#1e1e24')
    px(ctx, 240, 98, 4, 4, '#c89a40')
  }),

  sp('j2_anvil', '바람결에 들리는 다듬이 소리', 26, J2_BANK, (ctx, env) => {
    const hit = Math.sin(env.t * 5) > 0
    px(ctx, 199, 107, 5, 2, '#8a8478')
    px(ctx, 196, hit ? 104 : 100, 4, 1, '#c8b890')
    for (let k = 0; k < 2; k++) soundArcs(ctx, 202 - k * 40, 102 + k * 6, env.t + k * 0.5, '#c8c4b0', 30)
    withAlpha(ctx, 0.5, () => {
      for (let k = 0; k < 4; k++) px(ctx, mod(220 - env.t * 20 - k * 40, 200) + 20, 118 + k * 6, 12, 1, '#5a6a86')
    })
  }),
  sp('j2_flute', '피리 소리', 26, J2_BANK, (ctx, env) => {
    px(ctx, 196, 104, 8, 1, '#c8b890')
    for (let k = 0; k < 3; k++) {
      const f = mod(env.t * 0.5 + k / 3, 1)
      withAlpha(ctx, 1 - f, () => px(ctx, 206 + f * 16, 102 - f * 14 - k * 2, 2, 2, '#c8c4b0'))
    }
  }),
  sp('j2_dog', '개 짖는 소리', 26, J2_BANK, (ctx, env) => {
    px(ctx, 196, 108, 8, 4, '#4a4036')
    px(ctx, 202, 105, 4, 4, '#4a4036')
    if (Math.sin(env.t * 6) > 0) soundArcs(ctx, 208, 106, env.t, '#c8c4b0', 12)
  }),
]

// ════════════════════════════════════════════════════════════
// 錢起〈江行無題〉 其三: 가을걷이하는 강마을
// ════════════════════════════════════════════════════════════
const J3_WATER = 150
const J3_FIELD = { y0: 106, y1: 140 }

export const jiangxing3Background: Background = {
  id: 'hy044',
  drawBack(ctx) {
    sky(ctx, ['#d8c8b0', '#e4d2b0', '#ecdcb8'], J3_FIELD.y0)
    ridge(ctx, (x) => 86 + 10 * Math.sin(x * 0.02 + 1), '#a49a86', '#b0a690', 0, W, J3_FIELD.y0)
    // 논
    for (let y = J3_FIELD.y0; y < J3_FIELD.y1; y++) px(ctx, 0, y, W, 1, y % 6 === 0 ? '#a89a5a' : '#b8a864')
    // 마을 (왼쪽)
    for (let k = 0; k < 3; k++) hut(ctx, 10 + k * 26, 94 + (k % 2) * 4)
    // 기슭과 물
    px(ctx, 0, J3_FIELD.y1, W, J3_WATER - J3_FIELD.y1, '#8a8a5a')
    water(ctx, J3_WATER, H, '#8aa0a0', '#6a8484', '#b0c4c0')
    for (let k = 0; k < 7; k++) lotusPad(ctx, 170 + k * 18, 160 + (k % 3) * 6, 5)
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    shimmer(ctx, env.t, J3_WATER + 3, 178, 12, '#d8e4e0')
  },
}

const J3_BANK = { x: 0, y: 112, w: 128, h: 72 }
const J3_VILLAGE = { x: 0, y: 64, w: 112, h: 63 }
const J3_FIELD_F = { x: 96, y: 72, w: 160, h: 90 }
const J3_POND = { x: 168, y: 120, w: 112, h: 60 }

export const JIANGXING3_SPRITES = [
  sp('j3_withered', '시든 빛으로 이어진 기슭 풀', 20, J3_BANK, (ctx, env) => grasses(ctx, 0, W, J3_WATER, env, '#a08a4a', 70, 10)),
  sp('j3_sprout', '갓 돋은 푸른 싹', 20, J3_BANK, (ctx, env) => grasses(ctx, 0, W, J3_WATER, env, '#6aa84a', 70, 6)),
  sp('j3_snow', '눈 덮인 기슭', 20, J3_BANK, (ctx) => px(ctx, 0, J3_FIELD.y1, W, J3_WATER - J3_FIELD.y1, '#eef2f2')),

  sp('j3_bees', '풍년을 즐기는 마을 벌', 22, J3_VILLAGE, (ctx, env) => {
    for (const x of [30, 60]) {
      px(ctx, x, 108, 8, 10, '#8a6a3a')
      px(ctx, x - 1, 107, 10, 2, '#6a4a2a')
      dot(ctx, x + 4, 114, '#2a1a10')
    }
    for (let k = 0; k < 12; k++) {
      const a = env.t * (2 + hash(k)) + k
      const x = 48 + Math.cos(a) * (14 + hash(k * 3) * 10)
      const y = 104 + Math.sin(a * 1.3) * 8
      px(ctx, x, y, 2, 1, '#e8b830')
      dot(ctx, x + 1, y - 1, '#f4f0e0')
    }
    for (let k = 0; k < 5; k++) flower(ctx, 20 + k * 14, 122, '#e8c048', '#c86a2a')
  }),
  sp('j3_butterfly', '나비', 22, J3_VILLAGE, (ctx, env) => {
    for (let k = 0; k < 4; k++) {
      const x = 30 + k * 14 + Math.sin(env.t + k) * 6
      const y = 104 + Math.cos(env.t * 1.3 + k) * 5
      const o = Math.sin(env.t * 10 + k) > 0
      px(ctx, x - (o ? 3 : 1), y, o ? 3 : 1, 2, '#f4e0f0')
      px(ctx, x + 1, y, o ? 3 : 1, 2, '#f4e0f0')
    }
  }),
  sp('j3_dragonfly', '잠자리', 22, J3_VILLAGE, (ctx, env) => {
    for (let k = 0; k < 4; k++) {
      const x = 30 + k * 16 + Math.sin(env.t * 0.7 + k) * 8
      const y = 100 + k * 3
      px(ctx, x, y, 6, 1, '#c8402a')
      px(ctx, x + 1, y - 1, 1, 3, '#d8d8e8')
      px(ctx, x + 3, y - 1, 1, 3, '#d8d8e8')
    }
  }),

  sp('j3_harvest', '저녁 개어 처음 거두는 벼', 14, J3_FIELD_F, (ctx, env) => {
    withAlpha(ctx, 0.3, () => px(ctx, 0, 0, W, J3_FIELD.y0, '#f4b860'))
    sun(ctx, 120, 80, 7, '#f0a050', '#f4c080')
    for (let y = J3_FIELD.y0; y < J3_FIELD.y1; y++) px(ctx, 100, y, 220, 1, y % 5 === 0 ? '#c8a040' : '#d8b450')
    for (let k = 0; k < 18; k++) for (let i = 0; i < 3; i++) dot(ctx, 104 + k * 12 + i, J3_FIELD.y0 + 2 + (k % 3) * 9 - i, '#e8c460')
    for (let k = 0; k < 5; k++) {
      px(ctx, 112 + k * 16, 124, 3, 6, '#b89040')
      dot(ctx, 113 + k * 16, 123, '#e0c060')
    }
    for (let k = 0; k < 3; k++) {
      const x = 180 + k * 36
      crouch(ctx, x, 118, OTHER_PALS[k].R, env.t + k)
      if (Math.sin(env.t * 3 + k) > 0) px(ctx, x + 10, 124, 3, 1, '#c8c8c8')
    }
  }),
  sp('j3_plant', '모를 심는 논', 14, J3_FIELD_F, (ctx, env) => {
    for (let y = J3_FIELD.y0; y < J3_FIELD.y1; y++) px(ctx, 100, y, 220, 1, y % 5 === 0 ? '#8aa8a8' : '#9ab8b4')
    for (let r = 0; r < 4; r++) for (let c = 0; c < 18; c++) px(ctx, 104 + c * 12, J3_FIELD.y0 + 4 + r * 8, 1, 3, '#5a9a3a')
    for (let k = 0; k < 3; k++) crouch(ctx, 180 + k * 36, 118, OTHER_PALS[k].R, env.t + k)
  }),
  sp('j3_shovel', '눈 치우는 사람', 14, J3_FIELD_F, (ctx) => {
    px(ctx, 100, J3_FIELD.y0, 220, J3_FIELD.y1 - J3_FIELD.y0, '#eef2f2')
    for (let k = 0; k < 2; k++) {
      person(ctx, 180 + k * 40, 120, OTHER_PALS[k].R)
      px(ctx, 184 + k * 40, 124, 6, 1, '#5a4632')
      px(ctx, 190 + k * 40, 123, 3, 3, '#8a8a8a')
    }
  }),

  sp('j3_idle', '한가로이 매인 연밥 배', 24, J3_POND, (ctx, env) => {
    for (let k = 0; k < 6; k++) {
      const x = 186 + k * 16
      px(ctx, x, 150 - 8 - (k % 2) * 3, 1, 8 + (k % 2) * 3, '#8a7a4a')
      px(ctx, x - 2, 150 - 10 - (k % 2) * 3, 5, 2, '#8a7a4a')
    }
    const s = Math.sin(env.t * 0.8) * 1
    px(ctx, 206, 146, 2, 10, '#5a4632')
    for (let i = 0; i < 10; i++) dot(ctx, 208 + i, 150 + i * 0.4, '#8a7a5a')
    for (let r = 0; r < 3; r++) px(ctx, 220 - r + s, 157 + r, 28 + r * 2 - r * 4, 1, r === 0 ? '#7a5a3c' : '#5a3d28')
    withAlpha(ctx, 0.5, () => px(ctx, 218 + s, 160, 32, 1, '#d8e4e2'))
  }),
  sp('j3_busy', '연밥을 가득 싣고 가는 배', 24, J3_POND, (ctx, env) => {
    const x = 220 + Math.sin(env.t * 0.3) * 10
    skiff(ctx, x, 160, env.t, { len: 26 })
    for (let k = 0; k < 6; k++) disc(ctx, x - 4 + k * 3, 155 - (k % 2), 2, '#6a8a4a')
  }),
  sp('j3_fishing', '고기 잡는 배', 24, J3_POND, (ctx, env) => {
    skiff(ctx, 230, 160, env.t, { len: 24 })
    for (let k = 0; k < 6; k++) for (let i = 0; i < 6; i++) dot(ctx, 244 + k * 3, 152 + i * 2 + (k % 2), '#8a8a7a')
  }),
]

// ════════════════════════════════════════════════════════════
// 錢起〈江行無題〉 其四: 대숲 마을과 갈대 물길
// ════════════════════════════════════════════════════════════
const J4_WATER = 134
const J4_GROVE = Array.from({ length: 16 }, (_, k) => 14 + k * 9)

export const jiangxing4Background: Background = {
  id: 'hy045',
  drawBack(ctx) {
    sky(ctx, ['#c8d4d0', '#d4ddd4', '#dee4d8'], 116)
    ridge(ctx, (x) => 78 + 12 * Math.sin(x * 0.018 + 1.8), '#94a898', '#a0b4a4', 0, W, 116)
    px(ctx, 0, 104, W, J4_WATER - 104, '#88a066')
    // 오른쪽 비탈 밭자리
    fillRows(ctx, 90, J4_WATER, (y) => [170 - (y - 90) * 0.6, W], '#8e9a68')
    water(ctx, J4_WATER, H, '#8aa8a8', '#6a8a8c', '#b0c8c4')
    for (const x of J4_GROVE) bamboo(ctx, x, 120, 40 + (x % 3) * 6)
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    shimmer(ctx, env.t, J4_WATER + 3, 178, 10, '#d8e4e0', 100, 220)
  },
}

const J4_GROVE_F = { x: 0, y: 56, w: 160, h: 90 }
const J4_CHANNEL = { x: 64, y: 108, w: 144, h: 72 }
const J4_SLOPE = { x: 160, y: 72, w: 160, h: 72 }
const J4_PLOT = { x: 208, y: 104, w: 112, h: 63 }

export const JIANGXING4_SPRITES = [
  sp('j4_village', '대숲 너머 아늑한 마을', 12, J4_GROVE_F, (ctx, env) => {
    house(ctx, 36, 100)
    house(ctx, 84, 96)
    withAlpha(ctx, 0.6, () => {
      for (let k = 0; k < 3; k++) px(ctx, 50 + k * 40 + Math.sin(env.t * 0.5 + k) * 2, 86 - k * 2, 2, 8, '#d8dcd8')
    })
    for (const x of J4_GROVE.filter((_, i) => i % 3 === 1)) bamboo(ctx, x, 120, 40 + (x % 3) * 6, Math.sin(env.t + x) * 0.6, env.t)
  }),
  sp('j4_temple', '대숲 너머 큰 절', 12, J4_GROVE_F, (ctx) => {
    px(ctx, 40, 98, 80, 18, '#c9bfa5')
    px(ctx, 36, 90, 88, 8, '#3c4048')
    px(ctx, 74, 104, 12, 12, '#6b4a32')
  }),
  sp('j4_wall', '대숲 너머 높은 성벽', 12, J4_GROVE_F, (ctx) => {
    px(ctx, 10, 88, 150, 28, '#8a8274')
    for (let x = 10; x < 160; x += 8) px(ctx, x, 84, 5, 4, '#8a8274')
  }),

  sp('j4_reeds', '갈대숲을 뚫고 가는 배', 22, J4_CHANNEL, (ctx, env) => {
    const x = 130 + Math.sin(env.t * 0.2) * 8
    skiff(ctx, x, 160, env.t, { len: 22, guest: '#4b5068' })
    for (let k = 0; k < 26; k++) {
      const rx = 68 + k * 5.4
      if (Math.abs(rx - x) < 16) continue
      const h = 16 + hash(k) * 12
      const lean = Math.sin(env.t * 1.2 + k) * 2
      for (let i = 0; i < h; i++) dot(ctx, rx + lean * (i / h), 172 - i, '#a89a64')
      px(ctx, rx + lean - 1, 172 - h - 2, 3, 3, '#d8ccb0')
    }
  }),
  sp('j4_ice', '얼음을 깨며 가는 배', 22, J4_CHANNEL, (ctx, env) => {
    px(ctx, 64, J4_WATER + 2, 144, 40, '#d8e8ee')
    for (let k = 0; k < 6; k++) px(ctx, 80 + k * 20, 150 + (k % 2) * 8, 10, 1, '#a8c0c8')
    skiff(ctx, 130, 160, env.t, { len: 22 })
  }),
  sp('j4_fog', '짙은 안개 속의 배', 22, J4_CHANNEL, (ctx, env) => {
    skiff(ctx, 130, 160, env.t, { len: 22 })
    mistBands(ctx, env.t, [140, 146, 152, 158, 164], '#e8ecec', 0.8)
  }),

  sp('j4_fields', '놀리는 땅 없이 일군 밭', 10, J4_SLOPE, (ctx) => {
    const cols = ['#7a8a4a', '#9a8a5a', '#6a8a4a', '#a89a62']
    for (let r = 0; r < 5; r++) {
      const y = 92 + r * 8
      const x0 = 170 - (y - 90) * 0.6
      for (let c = 0; x0 + c * 26 < W; c++) {
        px(ctx, x0 + c * 26, y, 25, 7, cols[(r + c) % 4])
        for (let k = 0; k < 4; k++) px(ctx, x0 + c * 26 + 2, y + 1 + k * 2, 21, 1, mix(cols[(r + c) % 4], '#4a5a2a', 0.3))
      }
    }
  }),
  sp('j4_weeds', '잡초 우거진 빈 땅', 10, J4_SLOPE, (ctx, env) => grasses(ctx, 170, W, J4_WATER, env, '#7a8a4a', 60, 14)),
  sp('j4_flood', '물에 잠긴 밭', 10, J4_SLOPE, (ctx) => fillRows(ctx, 100, J4_WATER, (y) => [170 - (y - 90) * 0.6, W], '#8aa8a8')),

  sp('j4_taro', '생강과 토란 거두기', 24, J4_PLOT, (ctx, env) => {
    for (let k = 0; k < 6; k++) {
      const x = 216 + k * 15
      const y = 122 + (k % 2) * 4
      px(ctx, x, y, 1, 8, '#5a8a3a')
      fillRows(ctx, y - 7, y, (yy) => [x - 5 + (y - yy) * 0.2, x + 6 - (y - yy) * 0.2], '#4a8a3a')
      dot(ctx, x, y - 4, '#2e5a2e')
    }
    for (let k = 0; k < 6; k++) px(ctx, 222 + k * 12, 138, 1, 5, '#8ab04a')
    crouch(ctx, 274, 134, '#7a4a3a', env.t)
    px(ctx, 290, 138, 10, 6, '#a8864a')
    for (let k = 0; k < 3; k++) disc(ctx, 292 + k * 3, 137, 1, '#8a6a4a')
  }),
  sp('j4_wheat', '밀 거두기', 24, J4_PLOT, (ctx) => {
    for (let k = 0; k < 18; k++) {
      px(ctx, 214 + k * 5, 122, 1, 14, '#c8a850')
      px(ctx, 213 + k * 5, 118, 3, 5, '#d8b860')
    }
  }),
  sp('j4_cotton', '목화 거두기', 24, J4_PLOT, (ctx) => {
    for (let k = 0; k < 10; k++) {
      px(ctx, 216 + k * 9, 126, 1, 10, '#6a5a3a')
      disc(ctx, 216 + k * 9, 124, 2, '#f4f4f0')
    }
  }),
]

