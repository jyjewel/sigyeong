// 『唐詩畫意』 卷九 첫 묶음 (2): 司空曙〈寒塘〉, 王建〈野菊〉〈荒園〉〈晚蝶〉〈田家〉
import type { Background } from '../types'
import { H, W, disc, dot, fillRows, hash, mod, px } from '../pixel'
import type { Ctx, Env } from '../pixel'
import { AUTUMN, GREEN, bird, broadTree, flower, house, hut, mistBands, person, rain, ridge, sky, withAlpha } from '../kit'
import { OTHER_PALS, pal, seatFig, standFig } from '../figures'
import { drift, lotusPad, mix, shimmer, soundArcs, sp, sun, water } from './hy_kit'
import { vignette } from './hy_b3a'

const FULL = { x: 0, y: 0, w: 320, h: 180 }

// ════════════════════════════════════════════════════════════
// 司空曙〈寒塘〉: 새벽 못가와 남쪽 누각
// ════════════════════════════════════════════════════════════
const HT_WATER = 112
const HT_MAN = { x: 52, y: 100 }
const HT_TOWER = { x: 258, y: 74 }

export const hantangBackground: Background = {
  id: 'hy069',
  drawBack(ctx) {
    sky(ctx, ['#b4bcc8', '#c4c8cc', '#d4d2c8', '#e0d8c4'], HT_WATER)
    ridge(ctx, (x) => 92 + 8 * Math.sin(x * 0.02 + 0.4), '#9aa49c', '#a4aea6', 0, W, HT_WATER)
    water(ctx, HT_WATER, H, '#a4b4b8', '#8a9ca4', '#c4d0d0')
    // 못가 둑 (왼쪽)
    fillRows(ctx, 104, H, (y) => [0, 96 - (y - 104) * 0.5], '#7a7a5a')
    // 남쪽 누각
    const { x, y } = HT_TOWER
    px(ctx, x - 16, y + 6, 32, 30, '#a8382a')
    px(ctx, x - 22, y, 44, 6, '#3c4048')
    px(ctx, x - 18, y - 2, 36, 2, '#4a4f57')
    for (let c = -13; c < 16; c += 7) px(ctx, x + c, y + 8, 2, 26, '#e0b84a')
    px(ctx, x - 24, y + 36, 48, 4, '#8a8274')
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    shimmer(ctx, env.t, HT_WATER + 3, 178, 12, '#dce4e4', 90, W)
  },
}

const HT_MAN_F = { x: 8, y: 76, w: 112, h: 63 }
const HT_POND = { x: 96, y: 100, w: 144, h: 80 }
const HT_THINK = { x: 40, y: 20, w: 128, h: 72 }
const HT_SKY = { x: 160, y: 40, w: 160, h: 90 }

export const HANTANG_SPRITES = [
  sp('ht_comb', '물가에서 머리 빗는 나그네', 22, HT_MAN_F, (ctx, env) => {
    seatFig(ctx, HT_MAN.x, HT_MAN.y, pal({ K: '#1f1d22' }))
    for (let i = 0; i < 9; i++) dot(ctx, HT_MAN.x + 4, HT_MAN.y + 3 + i, '#1f1d22')
    const s = Math.round(Math.sin(env.t * 3) * 3)
    px(ctx, HT_MAN.x + 1, HT_MAN.y + 4 + s, 4, 1, '#c8a868')
    withAlpha(ctx, 0.35, () => {
      px(ctx, HT_MAN.x + 2, HT_WATER + 6, 10, 6, '#4b5068')
      px(ctx, HT_MAN.x + 4, HT_WATER + 12, 5, 3, '#e6c39b')
    })
  }),
  sp('ht_fish', '낚시하는 나그네', 22, HT_MAN_F, (ctx) => {
    seatFig(ctx, HT_MAN.x, HT_MAN.y, pal())
    for (let i = 0; i < 26; i++) dot(ctx, HT_MAN.x + 12 + i, HT_MAN.y + 8 - i * 0.3, '#5a4632')
    px(ctx, HT_MAN.x + 38, HT_MAN.y, 1, 20, '#c8c4b8')
  }),
  sp('ht_wash', '빨래하는 나그네', 22, HT_MAN_F, (ctx) => {
    seatFig(ctx, HT_MAN.x, HT_MAN.y, pal())
    px(ctx, HT_MAN.x + 14, HT_MAN.y + 14, 10, 3, '#e8e2d0')
  }),

  sp('ht_autumn', '시든 연잎과 가을빛', 12, HT_POND, (ctx, env) => {
    for (let k = 0; k < 10; k++) {
      const x = 112 + hash(k * 3.1) * 120
      const y = 130 + hash(k * 4.7) * 40
      px(ctx, x, y - 10, 1, 10, '#7a6a4a')
      lotusPad(ctx, x + 3, y - 10, 3)
      fillRows(ctx, y - 12, y - 8, (yy) => [x + 1, x + 6 - (yy - y + 12)], '#8a7a4a')
    }
    for (let k = 0; k < 16; k++) {
      const x = 100 + hash(k * 2.3) * 200
      for (let i = 0; i < 10; i++) dot(ctx, x + Math.sin(env.t + k) * (i / 10), HT_WATER + 2 - i, '#b8a868')
    }
    drift(ctx, env.t, { x: 120, y: 60, w: 200, h: 80 }, 10, '#c88a3a', 0.4, 9)
  }),
  sp('ht_spring', '피어나는 봄꽃', 12, HT_POND, (ctx) => {
    for (let k = 0; k < 12; k++) {
      lotusPad(ctx, 112 + hash(k * 3.1) * 120, 130 + hash(k * 4.7) * 40, 5)
      if (k % 2) flower(ctx, 114 + hash(k * 3.1) * 120, 126 + hash(k * 4.7) * 40, '#f2b8c6', '#f4d060')
    }
  }),
  sp('ht_ice', '꽁꽁 언 얼음', 12, HT_POND, (ctx) => withAlpha(ctx, 0.7, () => px(ctx, 90, HT_WATER, W - 90, H - HT_WATER, '#dce8ee'))),

  sp('ht_home', '끝없는 고향 생각', 24, HT_THINK, (ctx) => {
    const bx = 70
    const by = 34
    px(ctx, bx, by, 70, 40, '#fbf6e8')
    for (const [x, y, w, h] of [[bx, by, 70, 1], [bx, by + 39, 70, 1], [bx, by, 1, 40], [bx + 69, by, 1, 40]] as const) px(ctx, x, y, w, h, '#5d4a37')
    ridge(ctx, (x) => by + 14 + 6 * Math.sin(x * 0.12), '#8aa494', undefined, bx + 2, bx + 68, by + 38)
    hut(ctx, bx + 24, by + 22)
    broadTree(ctx, bx + 54, by + 36, 0.7, GREEN)
    for (const [x, y] of [[66, 80], [62, 88], [60, 94]] as const) px(ctx, x, y, 3, 3, '#fbf6e8')
  }),
  sp('ht_feast', '잔치에 들뜬 마음', 24, HT_THINK, (ctx, env) => {
    for (let k = 0; k < 5; k++) px(ctx, 70 + k * 12, 50, 4, 5, Math.sin(env.t * 3 + k) > -0.5 ? '#e04a3a' : '#c03a2a')
  }),
  sp('ht_sleep', '스르르 졸린 마음', 24, HT_THINK, (ctx, env) => {
    for (let k = 0; k < 3; k++) {
      const f = mod(env.t * 0.4 + k / 3, 1)
      withAlpha(ctx, 1 - f, () => px(ctx, HT_MAN.x + 14 + f * 6 + k * 3, HT_MAN.y - 4 - f * 12 - k * 3, 4, 1, '#4a5a6a'))
    }
  }),

  sp('ht_goose', '남쪽 누각을 건너는 외기러기', 26, HT_SKY, (ctx, env) => {
    const f = mod(env.t * 0.06, 1)
    const x = 320 - f * 160
    const y = 66 + Math.sin(f * 6) * 3
    const up = Math.sin(env.t * 4) > 0
    px(ctx, x - 3, y, 7, 2, '#5a5a62')
    px(ctx, x - 6, y, 3, 1, '#5a5a62')
    px(ctx, x - 1, up ? y - 3 : y + 2, 4, 2, '#6a6a72')
  }),
  sp('ht_flock', '기러기 떼', 26, HT_SKY, (ctx, env) => {
    for (let k = 0; k < 7; k++) bird(ctx, 190 + k * 10 + mod(env.t * 4, 30), 56 + Math.abs(k - 3) * 5, Math.floor(env.t * 4 + k) % 2, '#4a4a52')
  }),
  sp('ht_crow', '까마귀', 26, HT_SKY, (ctx, env) => bird(ctx, 240 + Math.sin(env.t * 0.4) * 20, 60, Math.floor(env.t * 5) % 2, '#1a1a20')),
]

// ════════════════════════════════════════════════════════════
// 王建〈野菊〉: 거친 울타리의 들국화
// ════════════════════════════════════════════════════════════
const YC_WATER = 150
const YC_FENCE = { x0: 30, x1: 170, y: 116 }
const YC_MUMS = Array.from({ length: 14 }, (_, i) => ({ x: YC_FENCE.x0 + 6 + hash(i * 2.7) * (YC_FENCE.x1 - YC_FENCE.x0 - 10), y: YC_FENCE.y + 8 + hash(i * 3.3) * 18 }))
const YC_MEM = { cx: 246, cy: 104, rx: 62, ry: 40 }

function mum(ctx: Ctx, x: number, y: number, c = '#f0c838') {
  px(ctx, x, y, 1, 6, '#4a7a3a')
  dot(ctx, x - 1, y + 3, '#4a7a3a')
  disc(ctx, x, y - 1, 2, c)
  dot(ctx, x, y - 1, '#c88a2a')
}

export const yejuBackground: Background = {
  id: 'hy070',
  drawBack(ctx) {
    sky(ctx, ['#c0c8cc', '#cccfcc', '#d8d6c8'], 120)
    ridge(ctx, (x) => 90 + 10 * Math.sin(x * 0.02 + 2.4), '#a0a898', '#aab2a2', 0, W, 130)
    px(ctx, 0, 112, W, YC_WATER - 112, '#9a9468')
    water(ctx, YC_WATER, H, '#8aa0a4', '#6a8288', '#b0c4c4')
    // 거친 울타리 (기울고 빠진 살)
    for (let x = YC_FENCE.x0; x < YC_FENCE.x1; x += 6) {
      if (hash(x) < 0.2) continue
      const lean = Math.round((hash(x * 3) - 0.5) * 4)
      for (let i = 0; i < 26; i++) dot(ctx, x + Math.round((lean * i) / 26), YC_FENCE.y + 26 - i, '#7a6448')
    }
    px(ctx, YC_FENCE.x0, YC_FENCE.y + 8, YC_FENCE.x1 - YC_FENCE.x0, 1, '#6a5438')
    px(ctx, YC_FENCE.x0 + 10, YC_FENCE.y + 18, YC_FENCE.x1 - YC_FENCE.x0 - 30, 1, '#6a5438')
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    shimmer(ctx, env.t, YC_WATER + 3, 178, 10, '#d8e4e4')
  },
}

const YC_FENCE_F = { x: 16, y: 84, w: 160, h: 90 }
const YC_MEM_F = { x: 176, y: 58, w: 144, h: 90 }

export const YEJU_SPRITES = [
  sp('yc_mum', '울타리 밖의 늦게 핀 들국화', 20, YC_FENCE_F, (ctx) => {
    for (const m of YC_MUMS) mum(ctx, m.x, m.y)
    for (let k = 0; k < 5; k++) mum(ctx, YC_FENCE.x0 + 10 + k * 28, YC_FENCE.y + 30, '#f4d860')
  }),
  sp('yc_rose', '붉은 장미', 20, YC_FENCE_F, (ctx) => {
    for (const m of YC_MUMS) disc(ctx, m.x, m.y, 2, '#c8303a')
  }),
  sp('yc_gourd', '하얀 박꽃', 20, YC_FENCE_F, (ctx) => {
    for (const m of YC_MUMS.slice(0, 8)) disc(ctx, m.x, m.y - 6, 2, '#f4f4ec')
  }),

  sp('yc_water', '가을 물에 밴 찬 향기', 14, YC_FENCE_F, (ctx, env) => {
    withAlpha(ctx, 0.4, () => {
      for (let k = 0; k < 5; k++) disc(ctx, YC_FENCE.x0 + 10 + k * 28, YC_WATER + 8 + Math.sin(env.t + k), 2, '#f0c838')
    })
    for (let k = 0; k < 3; k++) {
      const f = mod(env.t * 0.3 + k / 3, 1)
      withAlpha(ctx, 0.6 * (1 - f), () => {
        for (let i = 0; i < 16; i++) dot(ctx, 50 + k * 40 + i * 2, YC_WATER - 6 - f * 10 + Math.sin(i * 0.8 + env.t * 2) * 2, '#e8f0f4')
      })
    }
  }),
  sp('yc_screen', '병풍 속 국화', 14, YC_FENCE_F, (ctx) => {
    for (let k = 0; k < 4; k++) px(ctx, 40 + k * 22, 120, 20, 30, k % 2 ? '#e8dcc0' : '#dccfae')
  }),
  sp('yc_cup', '술잔에 띄운 꽃잎', 14, YC_FENCE_F, (ctx) => {
    px(ctx, 90, 142, 12, 5, '#dcd2bb')
    px(ctx, 93, 141, 4, 1, '#f0c838')
  }),

  sp('yc_mountain', '떠올린 산속', 22, YC_MEM_F, (ctx) => vignette(ctx, YC_MEM.cx, YC_MEM.cy, YC_MEM.rx, YC_MEM.ry, (c) => {
    ridge(c, (x) => 78 + 10 * Math.sin(x * 0.05), '#a8b4a8', undefined, 184, 310, 150)
    fillRows(c, 96, 150, (y) => [186, 236 + Math.sin(y * 0.4) * 4], (y) => (y % 6 === 0 ? '#8a8478' : '#9a9488'))
    for (let y = 100; y < 146; y += 9) px(c, 192, y, 30, 1, '#6a665c')
    px(c, 236, 130, 80, 20, '#b4ae94')
  })),
  sp('yc_palace', '궁궐 뜰', 22, YC_MEM_F, (ctx) => vignette(ctx, YC_MEM.cx, YC_MEM.cy, YC_MEM.rx, YC_MEM.ry, (c) => {
    px(c, 206, 96, 80, 26, '#b8352a')
    px(c, 200, 88, 92, 8, '#c89a3a')
  })),
  sp('yc_market', '저잣거리', 22, YC_MEM_F, (ctx) => vignette(ctx, YC_MEM.cx, YC_MEM.cy, YC_MEM.rx, YC_MEM.ry, (c) => {
    for (let k = 0; k < 3; k++) house(c, 200 + k * 30, 100 + (k % 2) * 4)
  })),

  sp('yc_cricket', '돌벽 틈에서 귀뚜라미와 짝한 국화', 26, YC_MEM_F, (ctx, env) => {
    for (let k = 0; k < 4; k++) mum(ctx, 222 + k * 5, 110 + (k % 2) * 6)
    const cx = 214
    const cy = 128
    px(ctx, cx, cy, 6, 2, '#4a3a22')
    px(ctx, cx + 5, cy - 1, 2, 2, '#4a3a22')
    for (let i = 0; i < 5; i++) dot(ctx, cx + 6 + i, cy - 2 - i, '#4a3a22')
    px(ctx, cx - 2, cy + 2, 3, 1, '#4a3a22')
    if (Math.sin(env.t * 8) > 0) soundArcs(ctx, cx + 3, cy, env.t * 2, '#5d4a37', 10)
  }),
  sp('yc_butterfly', '나비', 26, YC_MEM_F, (ctx, env) => {
    const o = Math.sin(env.t * 10) > 0
    px(ctx, 220 - (o ? 3 : 1), 118, o ? 3 : 1, 2, '#f4e060')
    px(ctx, 221, 118, o ? 3 : 1, 2, '#f4e060')
  }),
  sp('yc_sparrow', '참새', 26, YC_MEM_F, (ctx) => {
    px(ctx, 214, 126, 6, 4, '#8a6a4a')
    px(ctx, 219, 124, 3, 3, '#6a4a32')
  }),
]

// ════════════════════════════════════════════════════════════
// 王建〈荒園〉: 서리 내린 거친 동산
// ════════════════════════════════════════════════════════════
const HU_GROUND = 112
const HU_GAP = { a: 184, b: 228 }
const HU_SWEEP = { x: 112, y: 128 }
const HU_CHIVE = { x: 140, y: 156 }

export const huangyuanBackground: Background = {
  id: 'hy071',
  drawBack(ctx) {
    sky(ctx, ['#c8ccd4', '#d4d6d8', '#e4e0d4'], HU_GROUND)
    ridge(ctx, (x) => 90 + 8 * Math.sin(x * 0.024 + 1), '#a8b0aa', '#b2b8b2', 0, W, HU_GROUND)
    px(ctx, 0, HU_GROUND, W, H - HU_GROUND, '#8a8a62')
    house(ctx, 8, 92)
    // 울타리
    for (let x = 40; x < 310; x += 5) px(ctx, x, 100, 1, 14, '#7a6448')
    px(ctx, 40, 104, 270, 1, '#6a5438')
    broadTree(ctx, 290, 112, 1.6, AUTUMN)
  },
  drawFront() {},
  drawDynamic() {},
}

const HU_YARD = { x: 0, y: 72, w: 192, h: 108 }
const HU_FENCE = { x: 152, y: 76, w: 112, h: 63 }
const HU_SWEEP_F = { x: 72, y: 108, w: 128, h: 72 }

export const HUANGYUAN_SPRITES = [
  sp('hu_frost', '아침 해에 동산 가득한 서리', 8, FULL, (ctx, env) => {
    sun(ctx, 40, 70, 7, '#f4d090', '#fff0c8')
    for (let k = 0; k < 160; k++) {
      const x = hash(k * 1.9) * W
      const y = HU_GROUND + 2 + hash(k * 2.7) * 66
      dot(ctx, x, y, Math.sin(env.t * 2 + k) > 0.9 ? '#ffffff' : '#e4e8ec')
    }
    px(ctx, 8, 92, 28, 2, '#eef2f4')
    withAlpha(ctx, 0.25, () => px(ctx, 0, HU_GROUND, W, H - HU_GROUND, '#e4e8ec'))
  }),
  sp('hu_dew', '이슬 맺힌 꽃', 8, FULL, (ctx) => {
    for (let k = 0; k < 20; k++) flower(ctx, 30 + hash(k * 2.3) * 260, 120 + hash(k * 3.1) * 50, '#f2b8c6', '#a8d0e0')
  }),
  sp('hu_snowman', '눈사람', 8, FULL, (ctx) => {
    px(ctx, 0, HU_GROUND, W, H - HU_GROUND, '#eef2f2')
    disc(ctx, 60, 140, 8, '#ffffff')
    disc(ctx, 60, 128, 5, '#ffffff')
  }),

  sp('hu_ox', '소가 들이받아 무너진 울타리', 20, HU_FENCE, (ctx, env) => {
    px(ctx, HU_GAP.a, 99, HU_GAP.b - HU_GAP.a, 16, '#8a8a62')
    for (let k = 0; k < 6; k++) {
      const x = HU_GAP.a + 4 + k * 7
      const lean = (k - 2.5) * 2
      for (let i = 0; i < 12; i++) dot(ctx, x + (lean * i) / 12, 114 - i * (0.6 + (k % 2) * 0.3), '#7a6448')
    }
    px(ctx, HU_GAP.a + 2, 112, 20, 1, '#6a5438')
    const s = Math.round(Math.sin(env.t * 0.6) * 1)
    px(ctx, 206 + s, 114, 24, 10, '#6a4a32')
    px(ctx, 200 + s, 112, 8, 8, '#6a4a32')
    px(ctx, 199 + s, 110, 2, 3, '#d8d4c8')
    px(ctx, 205 + s, 110, 2, 3, '#d8d4c8')
    for (const lx of [208, 213, 222, 227]) px(ctx, lx + s, 124, 2, 6, '#5a3e2a')
  }),
  sp('hu_newfence', '새로 엮은 울타리', 20, HU_FENCE, (ctx) => {
    for (let x = HU_GAP.a; x < HU_GAP.b; x += 4) px(ctx, x, 98, 2, 16, '#c8a868')
  }),
  sp('hu_vines', '꽃 덩굴 덮인 울타리', 20, HU_FENCE, (ctx) => {
    for (let k = 0; k < 14; k++) disc(ctx, HU_GAP.a + k * 3, 102 + (k % 3) * 3, 2, k % 3 ? '#5a8a3a' : '#e88aa0')
  }),

  sp('hu_leaves', '누런 잎을 쓸어 내는 사람', 22, HU_SWEEP_F, (ctx, env) => {
    for (let k = 0; k < 4; k++) fillRows(ctx, 150 + k * 6, 158 + k * 6, (y) => [80 + k * 30 - (y - 150 - k * 6), 104 + k * 30 + (y - 150 - k * 6)], k % 2 ? '#c8962a' : '#b8862a')
    for (let k = 0; k < 30; k++) px(ctx, 76 + hash(k * 2.1) * 120, 140 + hash(k * 3.3) * 36, 2, 1, ['#d8a83a', '#a8762a'][k % 2])
    standFig(ctx, HU_SWEEP.x, HU_SWEEP.y - 8, pal({ R: '#6e6450', r: '#544c3c' }))
    const sw = Math.sin(env.t * 3) * 5
    for (let i = 0; i < 12; i++) dot(ctx, HU_SWEEP.x + 2 + sw * (i / 12), HU_SWEEP.y + 2 + i, '#6a4a32')
    px(ctx, HU_SWEEP.x - 2 + sw, HU_SWEEP.y + 14, 8, 2, '#a8864a')
  }),
  sp('hu_snow', '쌓인 눈을 쓰는 사람', 22, HU_SWEEP_F, (ctx) => {
    px(ctx, 76, 140, 120, 36, '#eef2f2')
    standFig(ctx, HU_SWEEP.x, HU_SWEEP.y - 8, pal({ R: '#6e6450', r: '#544c3c' }))
  }),
  sp('hu_petals', '꽃잎을 쓰는 사람', 22, HU_SWEEP_F, (ctx) => {
    for (let k = 0; k < 30; k++) px(ctx, 76 + hash(k * 2.1) * 120, 140 + hash(k * 3.3) * 36, 2, 1, '#f2b8c6')
    standFig(ctx, HU_SWEEP.x, HU_SWEEP.y - 8, pal({ R: '#6e6450', r: '#544c3c' }))
  }),

  sp('hu_chive', '잎 속에서 나온 염교 한 포기', 26, HU_YARD, (ctx, env) => {
    for (let k = 0; k < 7; k++) {
      const lean = (k - 3) * 0.7
      for (let i = 0; i < 9; i++) dot(ctx, HU_CHIVE.x + k + lean * (i / 9) * 3, HU_CHIVE.y - i, i % 2 ? '#4a8a3a' : '#6aa84a')
    }
    px(ctx, HU_CHIVE.x, HU_CHIVE.y, 8, 2, '#e8e4d0')
    if (Math.sin(env.t * 2) > 0) {
      dot(ctx, HU_CHIVE.x - 3, HU_CHIVE.y - 10, '#ffffff')
      dot(ctx, HU_CHIVE.x + 11, HU_CHIVE.y - 6, '#ffffff')
    }
  }),
  sp('hu_coin', '동전 한 닢', 26, HU_YARD, (ctx) => {
    disc(ctx, HU_CHIVE.x + 3, HU_CHIVE.y - 2, 3, '#c8a441')
    px(ctx, HU_CHIVE.x + 2, HU_CHIVE.y - 3, 2, 2, '#8a6a2a')
  }),
  sp('hu_cat', '숨은 고양이', 26, HU_YARD, (ctx) => {
    px(ctx, HU_CHIVE.x, HU_CHIVE.y - 6, 10, 6, '#8a8a8a')
    px(ctx, HU_CHIVE.x + 8, HU_CHIVE.y - 10, 5, 5, '#8a8a8a')
    dot(ctx, HU_CHIVE.x + 9, HU_CHIVE.y - 11, '#8a8a8a')
    dot(ctx, HU_CHIVE.x + 12, HU_CHIVE.y - 11, '#8a8a8a')
  }),
]

// ════════════════════════════════════════════════════════════
// 王建〈晚蝶〉: 늦가을 섬돌과 국화
// ════════════════════════════════════════════════════════════
const WD_GROUND = 118
const WD_STEPS = [0, 1, 2].map((k) => ({ x: 120 - k * 8, y: 122 + k * 6, w: 80 + k * 16 }))
const WD_MUM = { x: 262, y: 138 }

/** 나비 자리: 섬돌을 맴돌거나, 국화 속으로 든다 */
function wdPos(env: Env) {
  if (env.fx.wdMum) return { x: WD_MUM.x - 6 + Math.sin(env.t * 0.8) * 4, y: WD_MUM.y - 20 + Math.sin(env.t * 1.3) * 2 }
  if (env.fx.wdSteps) return { x: 160 + Math.cos(env.t * 0.9) * 46, y: 118 + Math.sin(env.t * 0.9) * 10 }
  return { x: 160 + Math.sin(env.t * 0.5) * 30, y: 96 + Math.sin(env.t * 1.1) * 6 }
}
function butterfly(ctx: Ctx, env: Env, c: string, dark: string, big = 1) {
  const { x, y } = wdPos(env)
  const o = Math.sin(env.t * 9) > 0
  const w = Math.round((o ? 5 : 2) * big)
  const h = Math.round(4 * big)
  px(ctx, x - w - 1, y - 3, w + 2, h + 2, dark)
  px(ctx, x, y - 3, w + 2, h + 2, dark)
  px(ctx, x - w, y - 2, w, h, c)
  px(ctx, x + 1, y - 2, w, h, c)
  px(ctx, x, y - 3, 1, 7, dark)
  dot(ctx, x - 1, y - 5, dark)
  dot(ctx, x + 1, y - 5, dark)
}

export const wandieBackground: Background = {
  id: 'hy072',
  drawBack(ctx) {
    sky(ctx, ['#c4ccd4', '#d0d4d4', '#dcdcd0'], WD_GROUND)
    ridge(ctx, (x) => 82 + 14 * Math.sin(x * 0.018 + 0.8), '#a4b0a8', '#aebab2', 0, W, WD_GROUND)
    px(ctx, 0, WD_GROUND, W, H - WD_GROUND, '#8a8e6e')
    for (const s of WD_STEPS) {
      px(ctx, s.x, s.y, s.w, 5, '#b4ac9c')
      px(ctx, s.x, s.y, s.w, 1, '#c8c0ae')
    }
    // 국화 떨기
    for (let k = 0; k < 9; k++) disc(ctx, WD_MUM.x - 20 + k * 5, WD_MUM.y - (k % 3) * 3, 5, k % 2 ? '#4a6a3a' : '#5a7a48')
  },
  drawFront() {},
  drawDynamic() {},
}

const WD_AIR = { x: 104, y: 72, w: 112, h: 63 }
const WD_STEP_F = { x: 96, y: 88, w: 128, h: 72 }
const WD_SKY = { x: 0, y: 0, w: 240, h: 135 }
const WD_MUM_F = { x: 216, y: 104, w: 96, h: 54 }

export const WANDIE_SPRITES = [
  sp('wd_pale', '분 바른 듯 여린 날개의 나비', 28, WD_AIR, (ctx, env) => butterfly(ctx, env, '#f4f2ec', '#8a8a7a')),
  sp('wd_black', '검고 큰 날개의 나비', 28, WD_AIR, (ctx, env) => butterfly(ctx, env, '#2a2a30', '#1a1a20', 1.5)),
  sp('wd_red', '붉고 화려한 날개의 나비', 28, WD_AIR, (ctx, env) => butterfly(ctx, env, '#d8503a', '#5a2a1a')),

  sp('wd_steps', '섬돌을 맴돌다 바람에 기대는 나비', 14, WD_STEP_F, (ctx, env) => {
    withAlpha(ctx, 0.4, () => {
      for (let a = 0; a < 6.28; a += 0.2) if (Math.sin(a * 3 - env.t * 2) > 0) dot(ctx, 160 + Math.cos(a) * 46, 118 + Math.sin(a) * 10, '#f4f2ec')
    })
    for (let k = 0; k < 3; k++) withAlpha(ctx, 0.35, () => px(ctx, mod(hash(k) * 200 + env.t * 30, 200) + 60, 104 + k * 6, 12, 1, '#e8ecf0'))
  }, { fx: { wdSteps: 1 } }),
  sp('wd_pond', '연못을 맴도는 나비', 14, WD_STEP_F, (ctx) => fillRows(ctx, 140, 160, (y) => [120 + Math.abs(y - 150) * 3, 200 - Math.abs(y - 150) * 3], '#8ab0bc')),
  sp('wd_roof', '지붕을 맴도는 나비', 14, WD_STEP_F, (ctx) => house(ctx, 130, 96)),

  sp('wd_dew', '해 높아 걷히는 산 이슬', 10, WD_SKY, (ctx, env) => {
    sun(ctx, 120, 22, 8)
    mistBands(ctx, env.t * 0.3, [84, 90], '#f4f6f4', 0.25)
    for (let k = 0; k < 14; k++) {
      const f = mod(env.t * 0.3 + k / 14, 1)
      withAlpha(ctx, 1 - f, () => dot(ctx, 20 + hash(k * 3.1) * 220, 96 - f * 14 + hash(k) * 10, '#ffffff'))
    }
  }),
  sp('wd_rain', '쏟아지는 비', 10, WD_SKY, (ctx, env) => rain(ctx, env.t, 70, 130, 'rgba(160,175,190,0.7)')),
  sp('wd_dusk', '지는 노을', 10, WD_SKY, (ctx) => {
    withAlpha(ctx, 0.3, () => px(ctx, 0, 0, W, H, '#e8804a'))
    sun(ctx, 40, 80, 8, '#e87a3a')
  }),

  sp('wd_mum', '국화꽃 속으로 날아든 나비', 20, WD_MUM_F, (ctx) => {
    for (let k = 0; k < 12; k++) {
      const x = WD_MUM.x - 20 + hash(k * 2.7) * 40
      const y = WD_MUM.y - 10 + hash(k * 3.9) * 10
      disc(ctx, x, y, 2, k % 3 ? '#f0c838' : '#f4f0e0')
      dot(ctx, x, y, '#c88a2a')
    }
  }, { fx: { wdMum: 1 } }),
  sp('wd_web', '거미줄', 20, WD_MUM_F, (ctx) => {
    for (let a = 0; a < 6.28; a += 0.5) for (let r = 0; r < 14; r++) dot(ctx, WD_MUM.x + Math.cos(a) * r, WD_MUM.y - 14 + Math.sin(a) * r, '#e8e8e8')
  }),
  sp('wd_window', '열린 창문', 20, WD_MUM_F, (ctx) => {
    px(ctx, WD_MUM.x - 14, WD_MUM.y - 30, 28, 20, '#6a5a44')
    px(ctx, WD_MUM.x - 12, WD_MUM.y - 28, 24, 16, '#e8d8a8')
  }),
]

// ════════════════════════════════════════════════════════════
// 王建〈田家〉: 장마에 잠긴 논
// ════════════════════════════════════════════════════════════
const TJ_FIELD = 128
const TJ_TREE = { x: 108, y: 120 }

export const tianjiaBackground: Background = {
  id: 'hy073',
  drawBack(ctx) {
    sky(ctx, ['#9aa0a8', '#a8acb0', '#b8b8b4'], TJ_FIELD)
    // 동쪽 언덕
    fillRows(ctx, 74, TJ_FIELD, (y) => [320 - (y - 74) * 2.2, W], (y) => mix('#7a8a6a', '#6a7a5a', (y - 74) / 54))
    ridge(ctx, (x) => 104 + 6 * Math.sin(x * 0.02), '#8a948a', '#949e94', 0, 220, TJ_FIELD)
    // 농가와 나무
    hut(ctx, 34, 108)
    px(ctx, TJ_TREE.x - 2, TJ_TREE.y - 44, 4, 44, '#4a3426')
    for (const [dx, dy, r] of [[-12, -46, 10], [10, -50, 11], [0, -60, 10], [-4, -36, 8], [12, -36, 7]] as const) disc(ctx, TJ_TREE.x + dx, TJ_TREE.y + dy, r, (d) => (d < -3 ? '#5e7a52' : '#4a6442'))
    // 물에 잠긴 논
    water(ctx, TJ_FIELD, H, '#8a9a8a', '#6a7a6e', '#a8b8ac')
    for (let r = 0; r < 5; r++) for (let c = 0; c < 26; c++) px(ctx, c * 12 + (r % 2) * 6, TJ_FIELD + 6 + r * 10, 1, 4, '#8a9a4a')
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    shimmer(ctx, env.t, TJ_FIELD + 3, 178, 12, '#c4d0c8')
  },
}

const TJ_TREE_F = { x: 64, y: 40, w: 96, h: 54 }
const TJ_SLOPE = { x: 176, y: 56, w: 144, h: 81 }
const TJ_HOUSE = { x: 0, y: 72, w: 112, h: 63 }
const TJ_PADDY = { x: 112, y: 112, w: 144, h: 68 }

export const TIANJIA_SPRITES = [
  sp('tj_sparrow', '나무 가득 짹짹이는 참새', 22, TJ_TREE_F, (ctx, env) => {
    for (let k = 0; k < 14; k++) {
      const x = TJ_TREE.x - 18 + hash(k * 2.3) * 36
      const y = TJ_TREE.y - 66 + hash(k * 3.7) * 34
      const hop = Math.sin(env.t * 6 + k) > 0.8 ? 1 : 0
      px(ctx, x, y - hop, 4, 3, '#8a6a4a')
      dot(ctx, x + 3, y - 1 - hop, '#5a3e2a')
    }
    soundArcs(ctx, TJ_TREE.x, TJ_TREE.y - 54, env.t * 1.5, '#4a3a2a', 22)
  }),
  sp('tj_cicada', '우는 매미', 22, TJ_TREE_F, (ctx, env) => {
    px(ctx, TJ_TREE.x + 2, TJ_TREE.y - 30, 3, 5, '#4a3a2a')
    soundArcs(ctx, TJ_TREE.x + 3, TJ_TREE.y - 28, env.t * 2, '#4a3a2a', 14)
  }),
  sp('tj_flower', '활짝 핀 꽃', 22, TJ_TREE_F, (ctx) => {
    for (let k = 0; k < 16; k++) disc(ctx, TJ_TREE.x - 18 + hash(k * 2.3) * 36, TJ_TREE.y - 66 + hash(k * 3.7) * 34, 2, '#f2b8c6')
  }),

  sp('tj_rain', '동쪽 언덕의 자욱한 비', 12, TJ_SLOPE, (ctx, env) => {
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(320, 60)
    ctx.lineTo(180, 60)
    ctx.lineTo(150, 180)
    ctx.lineTo(320, 180)
    ctx.clip()
    rain(ctx, env.t, 120, 120, 'rgba(180,190,200,0.6)')
    ctx.restore()
    mistBands(ctx, env.t, [80, 92, 104], '#c8ccd0', 0.5)
  }),
  sp('tj_sun', '맑은 햇살', 12, TJ_SLOPE, (ctx) => sun(ctx, 270, 70, 8)),
  sp('tj_rainbow', '무지개', 12, TJ_SLOPE, (ctx) => {
    for (const [r, c] of [[50, '#c8504a'], [47, '#d8a040'], [44, '#7aa050'], [41, '#4a6ab0']] as const)
      for (let a = Math.PI; a < Math.PI * 2; a += 0.01) dot(ctx, 250 + Math.cos(a) * r, 126 + Math.sin(a) * r * 0.9, c)
  }),

  sp('tj_empty', '밤에 먹을 것이 없는 농가', 20, TJ_HOUSE, (ctx) => {
    withAlpha(ctx, 0.45, () => px(ctx, 0, 0, W, H, '#141a2a'))
    px(ctx, 62, 118, 8, 5, '#3a3430')
    px(ctx, 61, 117, 10, 1, '#5a5048')
    withAlpha(ctx, 0.25, () => px(ctx, 36, 117, 4, 3, '#e0b860'))
  }),
  sp('tj_feast', '잔치가 벌어진 농가', 20, TJ_HOUSE, (ctx, env) => {
    for (let k = 0; k < 3; k++) person(ctx, 64 + k * 10, 116 - (Math.sin(env.t * 4 + k) > 0 ? 1 : 0), OTHER_PALS[k].R)
    px(ctx, 42, 117, 4, 3, '#ffcf6a')
  }),
  sp('tj_full', '가득 찬 곳간', 20, TJ_HOUSE, (ctx) => {
    for (let k = 0; k < 4; k++) disc(ctx, 66 + k * 8, 118, 4, '#c8a868')
  }),

  sp('tj_wade', '물속에서 이삭을 따는 사람들', 26, TJ_PADDY, (ctx, env) => {
    for (let k = 0; k < 3; k++) {
      const x = 140 + k * 32
      const y = 146 + (k % 2) * 8
      const b = Math.sin(env.t * 2 + k) > 0 ? 1 : 0
      person(ctx, x, y - 8 + b, OTHER_PALS[k].R, { hat: '#a89567', bow: 1 })
      withAlpha(ctx, 0.6, () => px(ctx, x - 3, y - 2, 10, 2, '#8a9a8a'))
      px(ctx, x + 6, y - 6, 6, 4, '#a8864a')
      for (let i = 0; i < 3; i++) px(ctx, x + 6 + i * 2, y - 8, 1, 2, '#c8b850')
      for (let a = 0; a < 6.28; a += 0.5) dot(ctx, x + 1 + Math.cos(a) * 6, y + Math.sin(a) * 1.5, '#c4d0c8')
    }
  }),
  sp('tj_fish', '물고기 잡는 사람', 26, TJ_PADDY, (ctx) => {
    person(ctx, 170, 140, OTHER_PALS[0].R, { hat: '#a89567' })
    for (let i = 0; i < 10; i++) dot(ctx, 172 + i, 144 + i * 0.4, '#8a8a7a')
  }),
  sp('tj_sleep', '모두 잠든 농가', 26, TJ_PADDY, (ctx, env) => {
    for (let k = 0; k < 3; k++) {
      const f = mod(env.t * 0.4 + k / 3, 1)
      withAlpha(ctx, 1 - f, () => px(ctx, 60 + f * 6 + k * 3, 100 - f * 12, 3, 1, '#5a6070'))
    }
  }),
]
