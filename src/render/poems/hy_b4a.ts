// 『唐詩畫意』 卷八 넷째 묶음 (1): 柳中庸〈江行〉, 顧況〈石竇泉〉〈山中〉〈溪上〉, 耿湋〈拜新月〉
import type { Background } from '../types'
import { H, W, disc, dot, fillRows, hash, mod, px } from '../pixel'
import type { Ctx } from '../pixel'
import { AUTUMN, bamboo, boat, broadTree, mistBands, moon, person, pine, rain, ridge, sky, snowfall, stars, withAlpha } from '../kit'
import { pal, seatFig } from '../figures'
import { drift, egret, lotusFlower, lotusPad, mix, shimmer, soundArcs, sp, stone, sun, water } from './hy_kit'

const FULL = { x: 0, y: 0, w: 320, h: 180 }

/** 여인 (x, y 는 머리 꼭대기). kneel 이면 무릎 꿇고 절하는 모습 */
export function lady(ctx: Ctx, x: number, y: number, robe: string, pose: 'stand' | 'kneel' | 'sit' = 'stand') {
  const dark = mix(robe, '#2a1a1a', 0.35)
  if (pose === 'kneel') {
    // 치마가 둥글게 퍼지고, 상체를 앞으로 숙인 모습 (오른쪽을 본다)
    fillRows(ctx, y + 9, y + 16, (yy) => [x - (yy - y - 9) * 0.6, x + 9 + (yy - y - 9) * 0.5], robe)
    px(ctx, x - 4, y + 15, 17, 1, dark)
    fillRows(ctx, y + 3, y + 10, (yy) => [x + 3 + (yy - y - 3) * 0.3, x + 9 + (yy - y - 3) * 0.2], robe)
    px(ctx, x + 9, y + 2, 4, 4, '#f0d0b0')
    px(ctx, x + 8, y, 4, 3, '#1f1d22')
    px(ctx, x + 8, y - 2, 2, 2, '#1f1d22')
    px(ctx, x + 10, y + 8, 4, 2, robe)
    dot(ctx, x + 13, y + 7, '#f0d0b0')
    px(ctx, x + 3, y + 9, 7, 1, '#e8c048')
    return
  }
  px(ctx, x + 1, y, 4, 2, '#1f1d22')
  px(ctx, x + 2, y - 2, 2, 2, '#1f1d22')
  px(ctx, x + 1, y + 2, 4, 3, '#f0d0b0')
  if (pose === 'sit') {
    fillRows(ctx, y + 5, y + 14, (yy) => [x - (yy - y - 5) * 0.4, x + 6 + (yy - y - 5) * 0.5], robe)
    px(ctx, x - 3, y + 13, 14, 1, dark)
  } else {
    fillRows(ctx, y + 5, y + 18, (yy) => [x + 0.5 - (yy - y - 5) * 0.25, x + 5.5 + (yy - y - 5) * 0.25], robe)
    px(ctx, x - 2, y + 17, 10, 1, dark)
  }
  px(ctx, x, y + 8, 6, 1, '#e8c048')
}

// ════════════════════════════════════════════════════════════
// 柳中庸〈江行〉: 가을 강의 모래섬과 포구
// ════════════════════════════════════════════════════════════
const JX_WATER = 104
const jxIsle = (y: number): [number, number] => {
  const d = (y - 121) / 6
  const w = 52 * Math.sqrt(Math.max(0, 1 - d * d))
  return [104 - w, 104 + w]
}
const JX_TREES = [240, 262, 286, 306]

export const jiangxingLiuBackground: Background = {
  id: 'hy054',
  drawBack(ctx) {
    sky(ctx, ['#a8b0b8', '#b8bcbc', '#c8c6bc'], JX_WATER)
    ridge(ctx, (x) => 82 + 10 * Math.sin(x * 0.02 + 0.5), '#7e8a8a', '#8a9696', 0, W, JX_WATER)
    water(ctx, JX_WATER, H, '#8a9ca0', '#6a7e86', '#aab8ba')
    fillRows(ctx, 115, 128, jxIsle, (y) => (y < 118 ? '#c8bc98' : '#b0a484'))
    for (let k = 0; k < 14; k++) {
      const x = 66 + k * 6
      for (let i = 0; i < 6 + (k % 3) * 2; i++) dot(ctx, x + i * 0.2, 118 - i, '#9a8a5a')
    }
    // 포구 (오른쪽 기슭)
    fillRows(ctx, 118, H, (y) => [232 - (y - 118) * 0.3, W], (y) => (y < 122 ? '#8a7e5a' : '#76704e'))
    for (const x of JX_TREES) broadTree(ctx, x, 124, 1.3 + hash(x) * 0.3, AUTUMN)
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    shimmer(ctx, env.t, JX_WATER + 2, 178, 14, '#c4d0d0', 0, 220)
  },
}

const JX_ISLE = { x: 32, y: 72, w: 144, h: 81 }
const JX_SHORE = { x: 176, y: 76, w: 144, h: 81 }
const JX_RIVER = { x: 104, y: 112, w: 120, h: 68 }

export const JIANGXING_LIU_SPRITES = [
  sp('jx_shade', '모래섬을 가린 짙은 그늘', 10, JX_ISLE, (ctx, env) => {
    const o = Math.sin(env.t * 0.15) * 6
    for (const [x, y, r] of [[70, 40, 14], [92, 34, 16], [116, 38, 15], [140, 44, 11], [56, 46, 10], [104, 46, 14]] as const)
      disc(ctx, x + o, y, r, (dy) => (dy < -r * 0.3 ? '#7a8088' : '#666c76'))
    withAlpha(ctx, 0.5, () => fillRows(ctx, 113, 130, (y) => {
      const [a, b] = jxIsle(y)
      return [a - 6, b + 6]
    }, '#3a404c'))
    withAlpha(ctx, 0.25, () => px(ctx, 30 + o, 104, 150, 30, '#3a404c'))
  }),
  sp('jx_rainbow', '무지개', 10, JX_ISLE, (ctx) => {
    for (const [r, c] of [[56, '#c8504a'], [53, '#d8a040'], [50, '#7aa050'], [47, '#4a6ab0']] as const)
      for (let a = Math.PI; a < Math.PI * 2; a += 0.01) dot(ctx, 104 + Math.cos(a) * r, 112 + Math.sin(a) * r * 0.9, c)
  }),
  sp('jx_sunlit', '환한 햇살', 10, JX_ISLE, (ctx) => {
    sun(ctx, 60, 40, 8)
    withAlpha(ctx, 0.3, () => fillRows(ctx, 114, 129, jxIsle, '#fff0b0'))
  }),

  sp('jx_leaves', '포구에 날리는 낙엽', 22, JX_SHORE, (ctx, env) => {
    for (let i = 0; i < 20; i++) {
      const f = mod(hash(i * 2.1) + env.t * (0.05 + hash(i) * 0.04), 1)
      const x = 300 - f * 120 + Math.sin(env.t * 2 + i) * 4
      const y = 96 + f * 50 + Math.sin(env.t * 3 + i) * 3
      px(ctx, x, y, 2, 1, ['#c8662a', '#e8994a', '#8e3f1f'][i % 3])
    }
  }),
  sp('jx_petals', '꽃잎', 22, JX_SHORE, (ctx, env) => drift(ctx, env.t, { x: 190, y: 96, w: 120, h: 50 }, 18, '#f4c8d0', -0.4, 3)),
  sp('jx_snow', '눈송이', 22, JX_SHORE, (ctx, env) => {
    ctx.save()
    ctx.beginPath()
    ctx.rect(176, 76, 144, 81)
    ctx.clip()
    snowfall(ctx, env.t, 60)
    ctx.restore()
  }),

  sp('jx_sail', '쓸쓸한 나그네의 돛배', 24, JX_RIVER, (ctx, env) => {
    const x = 180 - mod(env.t * 1.5, 40)
    boat(ctx, x, 152, { len: 26, mast: 26, sail: 20 })
    person(ctx, x + 6, 141, '#4b5068')
    withAlpha(ctx, 0.4, () => {
      for (let k = 1; k < 5; k++) px(ctx, x + 14 + k * 5, 153 + k, 4, 1, '#c4d0d0')
    })
  }),
  sp('jx_raft', '고기잡이 뗏목', 24, JX_RIVER, (ctx) => {
    for (let k = 0; k < 6; k++) px(ctx, 150 + k * 4, 150, 3, 4, '#8a6a48')
    person(ctx, 160, 141, '#6e6450', { hat: '#a89567' })
  }),
  sp('jx_pleasure', '화려한 놀잇배', 24, JX_RIVER, (ctx, env) => {
    boat(ctx, 166, 152, { len: 34, hull: '#a8382a', lantern: true, t: env.t })
    for (let k = 0; k < 4; k++) px(ctx, 152 + k * 8, 140, 3, 4, Math.sin(env.t * 3 + k) > -0.4 ? '#e04a3a' : '#c03a2a')
  }),

  sp('jx_rain', '저물녘 차가운 강비', 30, FULL, (ctx, env) => {
    withAlpha(ctx, 0.32, () => px(ctx, 0, 0, W, H, '#2a3040'))
    rain(ctx, env.t, 90, 130, 'rgba(170,180,195,0.7)', 5, -1.5)
  }),
  sp('jx_moon', '달 밝은 강', 30, FULL, (ctx) => {
    withAlpha(ctx, 0.4, () => px(ctx, 0, 0, W, H, '#1a2038'))
    moon(ctx, 60, 30, 8)
  }),
  sp('jx_glow', '붉은 노을', 30, FULL, (ctx) => {
    withAlpha(ctx, 0.3, () => px(ctx, 0, 0, W, H, '#d86a3a'))
    sun(ctx, 40, 82, 8, '#e87a3a', '#f4a060')
  }),
]

// ════════════════════════════════════════════════════════════
// 顧況〈石竇泉〉: 바위 구멍에서 솟는 샘
// ════════════════════════════════════════════════════════════
const SD_HOLE = { x: 112, y: 86 }
const sdStream = (t: number) => ({ x: 112 + t * 140 + Math.sin(t * 9) * 10, y: 112 + t * 50 })
const SD_TREE = { x: 40, y: 120 }
const SD_GUEST = { x: 200, y: 142 }

export const shidouBackground: Background = {
  id: 'hy055',
  drawBack(ctx) {
    sky(ctx, ['#c4d4cc', '#d0dcd0', '#dce2d4'], 120)
    ridge(ctx, (x) => 60 + 14 * Math.sin(x * 0.02 + 1), '#98ac9c', '#a4b8a8')
    // 이끼 낀 바위벽
    fillRows(ctx, 56, 126, (y) => [62 - (y - 56) * 0.2, 168 + (y - 56) * 0.4], (y) => (y % 7 === 0 ? '#7a8274' : '#8a9282'))
    for (let k = 0; k < 20; k++) px(ctx, 64 + hash(k * 2.3) * 100, 60 + hash(k * 3.1) * 60, 4, 2, '#6a8a5a')
    // 돌구멍
    disc(ctx, SD_HOLE.x, SD_HOLE.y, 6, '#2a2e2a')
    px(ctx, 0, 120, W, H - 120, '#7e9a62')
    // 물길
    for (let t = 0; t <= 1; t += 0.004) {
      const p = sdStream(t)
      px(ctx, p.x - 3, p.y, 7, 2, '#6a8a94')
    }
    px(ctx, 96, 110, 32, 4, '#6a8a94')
    // 꽃나무
    px(ctx, SD_TREE.x - 2, SD_TREE.y - 40, 4, 40, '#5a3e34')
    for (let k = 0; k < 9; k++) disc(ctx, SD_TREE.x - 16 + hash(k * 3) * 32, SD_TREE.y - 50 + hash(k * 5) * 20, 5, k % 2 ? '#f2b8c6' : '#f6cdd8')
    stone(ctx, SD_GUEST.x + 6, SD_GUEST.y + 10, 8, '#a8a49a', '#7e7a70')
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    for (let k = 0; k < 10; k++) {
      const p = sdStream(mod(k / 10 + env.t * 0.06, 1))
      px(ctx, p.x - 1, p.y, 3, 1, '#c8dce0')
    }
  },
}

const SD_ROCK = { x: 56, y: 52, w: 112, h: 63 }
const SD_FLOW = { x: 96, y: 96, w: 176, h: 84 }
const SD_GUEST_F = { x: 152, y: 100, w: 112, h: 63 }
const SD_CUP = { cx: 262, cy: 96, r: 22 }
const SD_CUP_F = { x: 224, y: 70, w: 80, h: 45 }

function cupInset(ctx: Ctx, inner: (ctx: Ctx) => void) {
  disc(ctx, SD_CUP.cx, SD_CUP.cy, SD_CUP.r, '#f0ead8')
  for (let a = 0; a < 6.28; a += 0.12) dot(ctx, SD_CUP.cx + Math.cos(a) * SD_CUP.r, SD_CUP.cy + Math.sin(a) * SD_CUP.r, '#8a7a5a')
  for (let i = 0; i < 6; i++) dot(ctx, SD_GUEST.x + 10 + i * 6, SD_GUEST.y - 2 - i * 4, '#c8bca0')
  fillRows(ctx, SD_CUP.cy - 6, SD_CUP.cy + 10, (y) => [SD_CUP.cx - 14 + (y - SD_CUP.cy + 6) * 0.4, SD_CUP.cx + 14 - (y - SD_CUP.cy + 6) * 0.4], '#c8b890')
  fillRows(ctx, SD_CUP.cy - 6, SD_CUP.cy - 1, () => [SD_CUP.cx - 13, SD_CUP.cx + 13], '#9ab8c0')
  inner(ctx)
}

export const SHIDOU_SPRITES = [
  sp('sd_spout', '모래 불고 돌에 뿜는 샘물', 20, SD_ROCK, (ctx, env) => {
    for (let k = 0; k < 18; k++) {
      const f = mod(env.t * 1.3 + k / 18, 1)
      const a = -0.6 + (k % 6) * 0.25
      const x = SD_HOLE.x + Math.cos(a) * f * 22
      const y = SD_HOLE.y + Math.sin(a) * f * 10 + f * f * 26
      dot(ctx, x, y, k % 3 ? '#e4f0f4' : '#c8b88a')
    }
    px(ctx, SD_HOLE.x - 3, SD_HOLE.y - 1, 7, 3, '#a8c8d0')
    for (let k = 0; k < 4; k++) if (Math.sin(env.t * 7 + k) > 0) dot(ctx, SD_HOLE.x + 20 + k * 3, SD_HOLE.y + 14, '#f4fafa')
  }),
  sp('sd_still', '고요히 고인 샘물', 20, SD_ROCK, (ctx) => disc(ctx, SD_HOLE.x, SD_HOLE.y + 2, 4, '#7a9aa4')),
  sp('sd_frozen', '꽁꽁 언 샘물', 20, SD_ROCK, (ctx) => {
    disc(ctx, SD_HOLE.x, SD_HOLE.y, 5, '#d8eaf0')
    for (let k = 0; k < 5; k++) px(ctx, SD_HOLE.x - 5 + k * 2, SD_HOLE.y + 5, 1, 4 + (k % 2) * 3, '#d8eaf0')
  }),

  sp('sd_swirl', '굽이치다 둥글게 맴도는 물', 14, SD_FLOW, (ctx, env) => {
    for (const t of [0.18, 0.5, 0.82]) {
      const p = sdStream(t)
      for (let a = 0; a < 6.28 * 1.6; a += 0.25) {
        const r = 1 + a * 0.9
        dot(ctx, p.x + Math.cos(a + env.t * 3) * r, p.y + 1 + Math.sin(a + env.t * 3) * r * 0.35, '#e4f0f4')
      }
    }
    for (let t = 0; t <= 1; t += 0.03) {
      const p = sdStream(t)
      if (Math.sin(t * 50 - env.t * 5) > 0.5) px(ctx, p.x - 2, p.y, 3, 1, '#d8eaee')
    }
  }),
  sp('sd_fall', '곧게 떨어지는 폭포', 14, SD_FLOW, (ctx, env) => {
    for (let y = SD_HOLE.y; y < 160; y++) px(ctx, SD_HOLE.x - 3, y, 6, 1, Math.sin(y * 0.6 - env.t * 10) > 0 ? '#e4f0f4' : '#a8c8d0')
  }),
  sp('sd_seep', '땅속으로 스미는 물', 14, SD_FLOW, (ctx) => {
    withAlpha(ctx, 0.5, () => {
      for (let t = 0; t <= 0.5; t += 0.01) {
        const p = sdStream(t)
        px(ctx, p.x - 5, p.y, 10, 2, '#5a6a4a')
      }
    })
  }),

  sp('sd_rinse', '흐르는 물에 입을 헹구는 나그네', 24, SD_GUEST_F, (ctx, env) => {
    seatFig(ctx, SD_GUEST.x, SD_GUEST.y - 14, pal({ R: '#8a7a55', r: '#665a3e' }), true)
    const up = Math.sin(env.t * 1.5) > 0
    px(ctx, SD_GUEST.x - 3, up ? SD_GUEST.y - 6 : SD_GUEST.y - 2, 4, 3, '#c8b890')
    if (!up) for (let k = 0; k < 3; k++) dot(ctx, SD_GUEST.x - 4 + k, SD_GUEST.y + 2 + k * 2, '#c8dce0')
  }),
  sp('sd_fish', '물고기 잡는 나그네', 24, SD_GUEST_F, (ctx) => {
    person(ctx, SD_GUEST.x, SD_GUEST.y - 10, '#8a7a55', { hat: '#a89567' })
    for (let i = 0; i < 14; i++) dot(ctx, SD_GUEST.x - 2 - i, SD_GUEST.y - 6 + i * 0.6, '#5a4632')
  }),
  sp('sd_feet', '발 씻는 나그네', 24, SD_GUEST_F, (ctx) => {
    seatFig(ctx, SD_GUEST.x, SD_GUEST.y - 14, pal({ R: '#8a7a55', r: '#665a3e' }), true)
    px(ctx, SD_GUEST.x - 4, SD_GUEST.y + 2, 6, 2, '#e6c39b')
  }),

  sp('sd_petal', '잔에 붙은 꽃잎', 28, SD_CUP_F, (ctx, env) => {
    cupInset(ctx, (c) => {
      px(c, SD_CUP.cx - 4, SD_CUP.cy - 5, 4, 2, '#f2b8c6')
      px(c, SD_CUP.cx + 5, SD_CUP.cy - 3, 3, 2, '#f6cdd8')
      dot(c, SD_CUP.cx - 5, SD_CUP.cy - 4, '#e89aae')
    })
    drift(ctx, env.t, { x: 20, y: 70, w: 200, h: 80 }, 12, '#f2b8c6', 0.6, 5)
  }),
  sp('sd_needle', '잔에 붙은 솔잎', 28, SD_CUP_F, (ctx) => cupInset(ctx, (c) => {
    for (let k = 0; k < 3; k++) px(c, SD_CUP.cx - 6 + k * 5, SD_CUP.cy - 5 + (k % 2), 4, 1, '#2f5440')
  })),
  sp('sd_leaf', '잔에 붙은 마른 낙엽', 28, SD_CUP_F, (ctx) => cupInset(ctx, (c) => {
    fillRows(c, SD_CUP.cy - 6, SD_CUP.cy - 1, (y) => [SD_CUP.cx - 4 + Math.abs(y - SD_CUP.cy + 4), SD_CUP.cx + 4 - Math.abs(y - SD_CUP.cy + 4)], '#a8762a')
  })),
]

// ════════════════════════════════════════════════════════════
// 顧況〈山中〉: 가을밤 산속 집
// ════════════════════════════════════════════════════════════
const SN_GROUND = 144
const SN_DOOR = { x: 200, y: 120, w: 12, h: 20 }
const SN_BED = { x: 120, y: 136, w: 40 }
const SN_PINE = { x: 282, y: 160 }

export const shanzhongGuBackground: Background = {
  id: 'hy056',
  drawBack(ctx) {
    sky(ctx, ['#141a2c', '#1c2438', '#262e44'], SN_GROUND)
    stars(ctx, 20, 17, 4, 70, 0, '#a8acc0')
    ridge(ctx, (x) => 50 + Math.abs(Math.sin(x * 0.03 + 0.4)) * 34, '#222a38', '#2a3242', 0, W, SN_GROUND)
    ridge(ctx, (x) => 80 + Math.abs(Math.sin(x * 0.045 + 2)) * 22, '#1c2430', '#242c38', 0, W, SN_GROUND)
    ridge(ctx, (x) => 112 + 6 * Math.sin(x * 0.03), '#182018', '#1e281e', 0, W, SN_GROUND)
    px(ctx, 0, SN_GROUND, W, H - SN_GROUND, '#1e241c')
    // 산집
    px(ctx, 170, 112, 70, 32, '#5a5246')
    for (let r = 0; r < 8; r++) px(ctx, 172 - r, 104 + r, 66 + r * 2, 1, r < 3 ? '#6a5a3a' : '#5a4a30')
    px(ctx, SN_DOOR.x, SN_DOOR.y, SN_DOOR.w, SN_DOOR.h, '#e0b860')
    px(ctx, 178, 122, 12, 8, '#3a3228')
    // 덩굴 평상
    px(ctx, SN_BED.x, SN_BED.y, SN_BED.w, 3, '#5a4632')
    for (const x of [SN_BED.x + 1, SN_BED.x + SN_BED.w - 3]) px(ctx, x, SN_BED.y + 3, 2, 6, '#4a3a28')
    for (let i = 0; i < SN_BED.w; i += 2) dot(ctx, SN_BED.x + i, SN_BED.y + 3 + (i % 4 === 0 ? 1 : 0), '#3e5a3a')
    // 왼쪽 수풀
    for (let k = 0; k < 8; k++) disc(ctx, 10 + k * 13, 150 + (k % 2) * 4, 9, '#141c16')
  },
  drawFront() {},
  drawDynamic() {},
}

const SN_SKY = { x: 0, y: 8, w: 192, h: 108 }
const SN_BED_F = { x: 96, y: 112, w: 96, h: 54 }
const SN_YARD = { x: 36, y: 81, w: 176, h: 99 }
const SN_PINE_F = { x: 176, y: 64, w: 144, h: 81 }

export const SHANZHONG_GU_SPRITES = [
  sp('sn_moon', '겹겹 봉우리에 걸린 서늘한 달', 6, SN_SKY, (ctx) => {
    moon(ctx, 86, 46, 8)
    withAlpha(ctx, 0.12, () => px(ctx, 0, 0, W, SN_GROUND, '#a8b8d8'))
  }),
  sp('sn_sea', '바다 위로 뜬 달', 6, SN_SKY, (ctx) => {
    px(ctx, 0, 90, 200, 20, '#2a3e5a')
    moon(ctx, 86, 82, 8)
  }),
  sp('sn_hidden', '구름 속에 숨은 달', 6, SN_SKY, (ctx) => {
    withAlpha(ctx, 0.4, () => disc(ctx, 86, 46, 8, '#c8c4a8'))
    for (const [x, y, w] of [[40, 40, 100], [60, 48, 90]] as const) px(ctx, x, y, w, 6, '#3a4256')
  }),

  sp('sn_leaves', '덩굴 평상에 수북한 낙엽', 20, SN_BED_F, (ctx) => {
    for (let k = 0; k < 30; k++) {
      const x = SN_BED.x + 2 + hash(k * 2.7) * (SN_BED.w - 4)
      const y = SN_BED.y - 1 - hash(k * 3.9) * 4 + (Math.abs(x - SN_BED.x - SN_BED.w / 2) / SN_BED.w) * 4
      px(ctx, x, y, 2, 1, ['#a8662a', '#c88a3a', '#7a4a22'][k % 3])
    }
    for (let k = 0; k < 8; k++) px(ctx, SN_BED.x - 6 + k * 7, SN_GROUND + 2 + (k % 2), 2, 1, '#8a5a2a')
  }),
  sp('sn_books', '평상에 펼쳐 둔 책', 20, SN_BED_F, (ctx) => {
    px(ctx, SN_BED.x + 10, SN_BED.y - 2, 10, 2, '#d8d0b8')
    px(ctx, SN_BED.x + 24, SN_BED.y - 3, 8, 3, '#8a6a3a')
  }),
  sp('sn_snow', '평상에 쌓인 눈', 20, SN_BED_F, (ctx) => px(ctx, SN_BED.x - 1, SN_BED.y - 2, SN_BED.w + 2, 2, '#e8eef2')),

  sp('sn_tiger', '문 닫게 한 어둠 속의 범', 22, SN_YARD, (ctx, env) => {
    px(ctx, SN_DOOR.x, SN_DOOR.y, SN_DOOR.w, SN_DOOR.h, '#4a3a28')
    px(ctx, SN_DOOR.x + 5, SN_DOOR.y, 1, SN_DOOR.h, '#2e2418')
    withAlpha(ctx, 0.5, () => {
      px(ctx, SN_DOOR.x, SN_DOOR.y - 1, SN_DOOR.w, 1, '#e0b860')
      px(ctx, SN_DOOR.x, SN_DOOR.y + SN_DOOR.h, SN_DOOR.w, 1, '#e0b860')
    })
    const x = 44 + Math.sin(env.t * 0.3) * 10
    withAlpha(ctx, 0.55, () => {
      px(ctx, x - 12, 147, 26, 7, '#6a4a2a')
      for (let k = 0; k < 5; k++) px(ctx, x - 10 + k * 5, 147, 1, 7, '#1a1410')
    })
    if (Math.sin(env.t * 0.9) > -0.8) {
      px(ctx, x + 10, 146, 2, 1, '#f4d040')
      px(ctx, x + 15, 146, 2, 1, '#f4d040')
    }
  }),
  sp('sn_thief', '도둑의 그림자', 22, SN_YARD, (ctx) => {
    withAlpha(ctx, 0.7, () => person(ctx, 100, 136, '#0e1210', { hat: '#0e1210', head: '#2a2a2a' }))
  }),
  sp('sn_rain', '들이치는 비', 22, SN_YARD, (ctx, env) => rain(ctx, env.t, 60, 140, 'rgba(140,150,170,0.6)')),

  sp('sn_pine', '바람에 뒤흔들리는 큰 소나무', 24, SN_PINE_F, (ctx, env) => {
    const sway = Math.sin(env.t * 1.8) * 5 + Math.sin(env.t * 4.3) * 1.5
    pine(ctx, SN_PINE.x, SN_PINE.y, 2.8, sway, { dark: '#0e1a14', base: '#16261c', light: '#223628' })
    for (let k = 0; k < 6; k++) {
      const x = mod(hash(k) * 300 + env.t * 70, 330) - 10
      withAlpha(ctx, 0.35, () => px(ctx, x, 70 + k * 12, 18, 1, '#8a94a8'))
    }
    soundArcs(ctx, SN_PINE.x, 90, env.t * 0.8, '#6a7488', 30)
  }, { wind: 0.9 }),
  sp('sn_bamboo', '대나무', 24, SN_PINE_F, (ctx, env) => {
    for (let k = 0; k < 8; k++) bamboo(ctx, 250 + k * 8, SN_PINE.y, 60 + (k % 3) * 10, Math.sin(env.t * 2 + k) * 4, env.t)
  }, { wind: 0.6 }),
  sp('sn_willow', '버드나무', 24, SN_PINE_F, (ctx, env) => {
    px(ctx, SN_PINE.x, 96, 3, 64, '#2e241c')
    for (let k = 0; k < 14; k++) for (let i = 0; i < 30; i++) dot(ctx, SN_PINE.x - 20 + k * 3 + Math.sin(env.t * 2 + i * 0.2) * 3 * (i / 30), 92 + i, '#2e4a2a')
  }, { wind: 0.6 }),
]

// ════════════════════════════════════════════════════════════
// 顧況〈溪上〉: 연밥 따는 시내
// ════════════════════════════════════════════════════════════
const XS_WATER = 104
const XS_BOAT = { x: 160, y: 146 }
const XS_PADS = Array.from({ length: 18 }, (_, i) => ({ x: 20 + hash(i * 2.9) * 280, y: 116 + hash(i * 4.7) * 56 })).filter((p) => Math.abs(p.x - XS_BOAT.x) > 26 || Math.abs(p.y - XS_BOAT.y) > 10)
const XS_CLOUDS: [number, number, number][] = [[30, 30, 70], [120, 22, 60], [60, 50, 50]]

export const xishangBackground: Background = {
  id: 'hy057',
  drawBack(ctx) {
    sky(ctx, ['#a8c8dc', '#bcd6e2', '#d0e2e4'], XS_WATER)
    for (const [x, y, w] of XS_CLOUDS) {
      px(ctx, x, y, w, 6, '#f4f6f4')
      px(ctx, x + 8, y - 4, w - 16, 4, '#f4f6f4')
    }
    ridge(ctx, (x) => 90 + 6 * Math.sin(x * 0.025 + 1), '#8aaaa0', '#96b6aa', 0, W, XS_WATER)
    px(ctx, 0, 98, W, 6, '#7e9a62')
    water(ctx, XS_WATER, H, '#9abcc0', '#7aa0a8', '#c4dcdc')
    // 물에 비친 구름
    withAlpha(ctx, 0.35, () => {
      for (const [x, y, w] of XS_CLOUDS) px(ctx, x, XS_WATER + (XS_WATER - y) * 0.5, w, 3, '#ffffff')
    })
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    shimmer(ctx, env.t, XS_WATER + 2, 178, 14, '#e4eeee')
    XS_PADS.forEach((p, i) => {
      lotusPad(ctx, p.x, p.y, 5 + (i % 3))
      if (i % 3 === 0) lotusFlower(ctx, p.x + 2, p.y - 4)
    })
  },
}

const XS_BOAT_F = { x: 104, y: 108, w: 112, h: 63 }
const XS_NEAR = { x: 112, y: 100, w: 128, h: 72 }

export const XISHANG_SPRITES = [
  sp('xs_girl', '연밥 따는 아가씨', 22, XS_BOAT_F, (ctx, env) => {
    const tilt = env.fx.xsRock ? Math.sin(env.t * 3) * 1.5 : 0
    const x = XS_BOAT.x
    const y = XS_BOAT.y + Math.round(tilt)
    lady(ctx, x - 2, y - 14, '#d86a7a', 'sit')
    for (let r = 0; r < 4; r++) px(ctx, x - 14 + r + (r === 0 ? Math.round(-tilt) : 0), y + r, 28 - r * 2, 1, r === 0 ? '#8a6a48' : '#6a4a32')
    px(ctx, x + 6, y - 8, 1, 6, '#d86a7a')
    disc(ctx, x + 10, y - 6, 2, '#6a8a4a')
    withAlpha(ctx, 0.5, () => px(ctx, x - 16, y + 4, 32, 1, '#e4eeee'))
  }),
  sp('xs_old', '낚시하는 노인', 22, XS_BOAT_F, (ctx) => {
    px(ctx, 104, 128, 40, 6, '#7e9a62')
    person(ctx, 124, 119, '#8a8a7a', { hat: '#a89567', head: '#d8b894' })
    for (let i = 0; i < 26; i++) dot(ctx, 127 + i, 122 - i * 0.3, '#5a4632')
    px(ctx, 153, 114, 1, 24, '#c8c4b8')
  }),
  sp('xs_wash', '빨래하는 아낙', 22, XS_BOAT_F, (ctx) => {
    px(ctx, 104, 128, 50, 6, '#7e9a62')
    lady(ctx, 128, 116, '#6a7a9a', 'kneel')
    px(ctx, 140, 130, 10, 3, '#e8e2d0')
  }),

  sp('xs_rock', '바람에 흔들리는 작은 배', 20, XS_BOAT_F, (ctx, env) => {
    for (let k = 0; k < 5; k++) {
      const x = mod(hash(k) * 160 + env.t * 50, 170) + 90
      withAlpha(ctx, 0.5, () => px(ctx, x, 118 + k * 7, 16, 1, '#f4f8f8'))
    }
    for (let k = 0; k < 2; k++) {
      const r = 18 + mod(env.t * 0.8 + k / 2, 1) * 14
      for (let a = 0; a < 6.28; a += 0.25) dot(ctx, XS_BOAT.x + Math.cos(a) * r, XS_BOAT.y + 3 + Math.sin(a) * r * 0.2, '#e4f0f0')
    }
  }, { fx: { xsRock: 1 }, wind: 0.6 }),
  sp('xs_rapid', '거센 물살', 20, XS_BOAT_F, (ctx, env) => {
    for (let k = 0; k < 14; k++) {
      const x = mod(hash(k) * 160 + env.t * 90, 170) + 90
      px(ctx, x, 124 + (k % 6) * 7, 10, 1, '#f4fafa')
    }
  }),
  sp('xs_stuck', '모래에 얹힌 배', 20, XS_BOAT_F, (ctx) => fillRows(ctx, XS_BOAT.y + 1, XS_BOAT.y + 8, (y) => [XS_BOAT.x - 26 + (y - XS_BOAT.y) * 2, XS_BOAT.x + 26 - (y - XS_BOAT.y) * 2], '#d0c4a0')),

  sp('xs_duck', '놀라 날아오른 원앙', 26, XS_NEAR, (ctx, env) => {
    const f = mod(env.t * 0.25, 1)
    for (let k = 0; k < 2; k++) {
      const x = XS_BOAT.x + 24 + f * 50 + k * 10
      const y = XS_BOAT.y - 8 - f * 40 - k * 4
      const up = Math.sin(env.t * 10 + k) > 0
      px(ctx, x - 3, y, 7, 3, k ? '#8a6a4a' : '#c86a2a')
      px(ctx, x + 3, y - 2, 3, 3, k ? '#6a5a4a' : '#2a6a5a')
      dot(ctx, x + 5, y - 1, '#f4f0e0')
      px(ctx, x - 2, up ? y - 4 : y + 3, 5, 2, k ? '#a8886a' : '#e8a040')
    }
    if (f < 0.25) for (let a = 0; a < 6.28; a += 0.4) dot(ctx, XS_BOAT.x + 26 + Math.cos(a) * f * 30, XS_BOAT.y + 2 + Math.sin(a) * f * 8, '#f4fafa')
  }),
  sp('xs_frog', '개구리', 26, XS_NEAR, (ctx, env) => {
    const hop = Math.abs(Math.sin(env.t * 2)) * 8
    px(ctx, XS_BOAT.x + 30, XS_BOAT.y - 2 - hop, 5, 3, '#5a8a3a')
  }),
  sp('xs_egret', '백로', 26, XS_NEAR, (ctx, env) => egret(ctx, XS_BOAT.x + 40, XS_BOAT.y - 20, env.t, true)),

  sp('xs_red', '물과 구름에 어지러운 붉은빛', 8, FULL, (ctx, env) => {
    for (const [x, y, w] of XS_CLOUDS) {
      px(ctx, x, y + 4, w, 2, '#f4c0c0')
      px(ctx, x + 8, y - 4, w - 16, 2, '#f8d4d0')
    }
    for (let k = 0; k < 30; k++) {
      const x = mod(hash(k * 2.3) * W + Math.sin(env.t * 1.5 + k) * 5, W)
      const y = XS_WATER + 4 + hash(k * 3.7) * 70
      px(ctx, x, y, 4 + Math.round(hash(k) * 6), 1, k % 2 ? '#e88aa0' : '#f4b0b8')
    }
  }),
  sp('xs_gray', '잿빛으로 흐린 물과 구름', 8, FULL, (ctx) => {
    sky(ctx, ['#8a9096', '#9aa0a4', '#a8acac'], 98)
    withAlpha(ctx, 0.3, () => px(ctx, 0, XS_WATER, W, H - XS_WATER, '#6a7076'))
  }),
  sp('xs_white', '새하얀 안개', 8, FULL, (ctx, env) => mistBands(ctx, env.t, [96, 104, 112, 124, 136], '#ffffff', 0.7)),
]

// ════════════════════════════════════════════════════════════
// 耿湋〈拜新月〉: 초승달에 절하는 여인
// ════════════════════════════════════════════════════════════
const BX_GROUND = 140
const BX_LADY = { x: 196, y: 124 }
const BX_MOON = { x: 184, y: 46 }

export const baixinyueBackground: Background = {
  id: 'hy058',
  drawBack(ctx) {
    sky(ctx, ['#1e2440', '#2a3050', '#3a3e5a', '#4a4a60'], BX_GROUND)
    stars(ctx, 18, 23, 4, 80, 0, '#c8c8d8')
    // 집과 걷힌 발
    px(ctx, 20, 74, 120, 52, '#7a7064')
    px(ctx, 14, 64, 132, 10, '#2a2e36')
    px(ctx, 18, 62, 124, 2, '#363a42')
    for (let x = 22; x < 140; x += 28) px(ctx, x, 74, 3, 52, '#4a3426')
    px(ctx, 54, 84, 52, 34, '#e0b870')
    px(ctx, 52, 80, 56, 5, '#b8a070')
    for (let x = 54; x < 106; x += 3) dot(ctx, x, 82, '#8a7040')
    // 섬돌과 뜰
    for (let k = 0; k < 3; k++) px(ctx, 40 - k * 6, 126 + k * 5, 100 + k * 12, 4, k % 2 ? '#8a8478' : '#9a9488')
    px(ctx, 0, BX_GROUND, W, H - BX_GROUND, '#3a3e3a')
    for (let k = 0; k < 10; k++) disc(ctx, 250 + k * 8, 136 - (k % 3) * 4, 8, '#1e2a22')
  },
  drawFront() {},
  drawDynamic() {},
}

const BX_SKY = { x: 96, y: 8, w: 160, h: 90 }
const BX_YARD = { x: 136, y: 92, w: 128, h: 72 }

export const BAIXINYUE_SPRITES = [
  sp('bx_moon', '발 걷자 보이는 초승달', 6, BX_SKY, (ctx) => {
    withAlpha(ctx, 0.12, () => disc(ctx, BX_MOON.x, BX_MOON.y, 14, '#fff7d6'))
    disc(ctx, BX_MOON.x, BX_MOON.y, 6, '#fbf6e2')
    disc(ctx, BX_MOON.x + 3, BX_MOON.y - 1, 6, '#2c3252')
  }),
  sp('bx_full', '둥근 보름달', 6, BX_SKY, (ctx) => moon(ctx, BX_MOON.x, BX_MOON.y, 9)),
  sp('bx_sun', '떠오르는 해', 6, BX_SKY, (ctx) => {
    withAlpha(ctx, 0.35, () => px(ctx, 0, 60, W, 80, '#d8906a'))
    sun(ctx, BX_MOON.x, 90, 8, '#f0a050')
  }),

  sp('bx_bow', '섬돌 내려가 달에게 절하는 여인', 22, BX_YARD, (ctx) => {
    lady(ctx, BX_LADY.x, BX_LADY.y, '#c86a7a', 'kneel')
    withAlpha(ctx, 0.25, () => px(ctx, BX_LADY.x - 4, BX_GROUND + 1, 18, 2, '#000000'))
  }),
  sp('bx_dance', '춤추는 여인', 22, BX_YARD, (ctx, env) => {
    lady(ctx, BX_LADY.x + Math.sin(env.t * 2) * 4, BX_LADY.y - 6, '#c86a7a')
    for (let i = 0; i < 12; i++) dot(ctx, BX_LADY.x + 6 + i, BX_LADY.y + Math.sin(env.t * 3 + i * 0.5) * 3, '#f4d0d8')
  }),
  sp('bx_swing', '그네 타는 여인', 22, BX_YARD, (ctx, env) => {
    const s = Math.sin(env.t * 1.5) * 10
    for (const dx of [0, 10]) for (let i = 0; i < 26; i++) dot(ctx, BX_LADY.x + dx + (s * i) / 26, 100 + i, '#8a7a5a')
    lady(ctx, BX_LADY.x + 2 + s, 112, '#c86a7a', 'sit')
  }),

  sp('bx_whisper', '아무도 못 듣게 소곤거리는 말', 24, BX_YARD, (ctx, env) => {
    for (let k = 0; k < 3; k++) {
      const f = mod(env.t * 0.35 + k / 3, 1)
      withAlpha(ctx, 0.8 * (1 - f), () => dot(ctx, BX_LADY.x + 12 + f * 10 + k, BX_LADY.y + 2 - f * 16, '#f4f0dc'))
    }
    withAlpha(ctx, 0.6, () => {
      px(ctx, BX_LADY.x + 14, BX_LADY.y - 12, 12, 6, '#f4f0dc')
      for (let k = 0; k < 3; k++) dot(ctx, BX_LADY.x + 16 + k * 3, BX_LADY.y - 9, '#3a3e5a')
    })
  }),
  sp('bx_shout', '큰 소리로 부르는 여인', 24, BX_YARD, (ctx, env) => soundArcs(ctx, BX_LADY.x + 10, BX_LADY.y + 4, env.t, '#f4f0dc', 30)),
  sp('bx_chat', '시녀와 수다 떠는 여인', 24, BX_YARD, (ctx) => {
    lady(ctx, BX_LADY.x + 22, BX_LADY.y - 6, '#6a8a7a')
    px(ctx, BX_LADY.x + 8, BX_LADY.y - 6, 10, 5, '#f4f0dc')
  }),

  sp('bx_sash', '북풍에 날리는 치마 띠', 26, BX_YARD, (ctx, env) => {
    for (let k = 0; k < 2; k++)
      for (let i = 0; i < 18; i++) {
        const x = BX_LADY.x + 2 - i * 1.2
        const y = BX_LADY.y + 9 + k * 2 + Math.sin(env.t * 6 - i * 0.5 + k) * (i / 6)
        dot(ctx, x, y, k ? '#e8c048' : '#f4d0d8')
      }
    for (let k = 0; k < 5; k++) {
      const x = mod(hash(k) * 300 + env.t * 60, 330) - 10
      withAlpha(ctx, 0.35, () => px(ctx, x, 104 + k * 8, 16, 1, '#c8d0e0'))
    }
  }, { wind: 0.7 }),
  sp('bx_lantern', '손에 든 등불', 26, BX_YARD, (ctx, env) => {
    px(ctx, BX_LADY.x + 12, BX_LADY.y + 4, 4, 5, '#e04a3a')
    withAlpha(ctx, 0.3 + Math.sin(env.t * 5) * 0.05, () => disc(ctx, BX_LADY.x + 14, BX_LADY.y + 6, 7, '#ffd27a'))
  }),
  sp('bx_umbrella', '펼친 우산', 26, BX_YARD, (ctx) => {
    fillRows(ctx, BX_LADY.y - 10, BX_LADY.y - 4, (y) => [BX_LADY.x - 6 - (y - BX_LADY.y + 10) * 2, BX_LADY.x + 14 + (y - BX_LADY.y + 10) * 2], '#4a6a8a')
    px(ctx, BX_LADY.x + 4, BX_LADY.y - 4, 1, 10, '#5a4632')
  }),
]

