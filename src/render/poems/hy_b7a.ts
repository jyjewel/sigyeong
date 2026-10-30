// 『唐詩畫意』 卷九 셋째 묶음 (1): 韓愈〈花島〉〈稻畦〉, 劉禹錫〈題壽安甘棠館〉, 張仲素〈宮中樂〉〈春遊曲〉
import type { Background } from '../types'
import { H, W, disc, dot, fillRows, hash, mod, px } from '../pixel'
import type {  } from '../pixel'
import { GREEN, SPRING, bamboo, bird, boat, broadTree, flower, hut, mistBands, moon, person, pine, rain, ridge, sky, snowfall, stars, withAlpha } from '../kit'
import { OTHER_PALS, pal, standFig } from '../figures'
import { drift, grasses, mix, notes, shimmer, soundArcs, sp, sun, water } from './hy_kit'
import { lady } from './hy_b4a'


// ════════════════════════════════════════════════════════════
// 韓愈〈花島〉: 물 위의 붉은 구름
// ════════════════════════════════════════════════════════════
const HD_WATER = 100
const HD_ISLE = { x: 244, y: 120 }
const hdIsle = (y: number): [number, number] => {
  const d = (y - HD_ISLE.y) / 7
  const w = 44 * Math.sqrt(Math.max(0, 1 - d * d))
  return [HD_ISLE.x - w, HD_ISLE.x + w]
}

export const huadaoBackground: Background = {
  id: 'hy085',
  drawBack(ctx) {
    sky(ctx, ['#b8d0e0', '#c8dae4', '#d8e4e4'], HD_WATER)
    ridge(ctx, (x) => 84 + 8 * Math.sin(x * 0.02 + 1), '#9ab4ac', '#a6c0b8', 0, W, HD_WATER)
    water(ctx, HD_WATER, H, '#9ac0c8', '#7aa4b0', '#c4dcdc')
    fillRows(ctx, 128, H, (y) => [0, 80 + (y - 128) * 0.6], '#7e9a62')
    standFig(ctx, 36, 116, pal())
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    shimmer(ctx, env.t, HD_WATER + 3, 178, 14, '#e4eeee', 80, W)
  },
}

const HD_AIR = { x: 40, y: 72, w: 192, h: 81 }
const HD_ISLE_F = { x: 184, y: 88, w: 120, h: 68 }

export const HUADAO_SPRITES = [
  sp('hd_bees', '어지러이 날아가는 벌과 나비', 24, HD_AIR, (ctx, env) => {
    for (let k = 0; k < 16; k++) {
      const f = mod(env.t * 0.08 + hash(k), 1)
      const x = 60 + f * 170
      const y = 110 + Math.sin(env.t * 2 + k * 1.7) * 10 + (k % 4) * 3 - f * 6
      if (k % 2) {
        const o = Math.sin(env.t * 10 + k) > 0
        px(ctx, x - (o ? 2 : 1), y, o ? 2 : 1, 2, ['#f4e060', '#f4f0e0', '#f2b8c6'][k % 3])
        px(ctx, x + 1, y, o ? 2 : 1, 2, ['#f4e060', '#f4f0e0', '#f2b8c6'][k % 3])
      } else {
        px(ctx, x, y, 2, 1, '#e8b830')
        dot(ctx, x + 1, y - 1, '#f4f0e0')
      }
    }
  }),
  sp('hd_birds', '새 떼', 24, HD_AIR, (ctx, env) => {
    for (let k = 0; k < 8; k++) bird(ctx, 60 + mod(k * 22 + env.t * 10, 170), 96 + (k % 3) * 8, Math.floor(env.t * 5 + k) % 2, '#3a3a44')
  }),
  sp('hd_leaves', '낙엽', 24, HD_AIR, (ctx, env) => drift(ctx, env.t, { x: 60, y: 90, w: 170, h: 50 }, 16, '#c88a3a', 0.6, 2)),

  sp('hd_scent', '건너편에서 풍겨 오는 향기로운 바람', 12, HD_AIR, (ctx, env) => {
    for (let k = 0; k < 4; k++) {
      const f = mod(env.t * 0.15 + k / 4, 1)
      withAlpha(ctx, 0.55 * Math.sin(f * Math.PI), () => {
        for (let i = 0; i < 40; i++) dot(ctx, 220 - f * 150 - i * 1.2, 108 + k * 6 + Math.sin(i * 0.4 + env.t * 2 + k) * 3, '#f8d0dc')
      })
    }
  }),
  sp('hd_sand', '모래바람', 12, HD_AIR, (ctx, env) => {
    for (let k = 0; k < 40; k++) dot(ctx, mod(hash(k) * 300 - env.t * 40, 300), 96 + hash(k * 3) * 50, '#c8a868')
  }),
  sp('hd_smoke', '매캐한 연기', 12, HD_AIR, (ctx, env) => {
    for (let k = 0; k < 6; k++) {
      const f = mod(env.t * 0.1 + k / 6, 1)
      withAlpha(ctx, 0.4 * (1 - f), () => disc(ctx, 220 - f * 150, 110 - f * 10, 6 + f * 8, '#8a8a8a'))
    }
  }),

  sp('hd_island', '꽃섬', 10, HD_ISLE_F, (ctx) => {
    fillRows(ctx, HD_ISLE.y - 7, HD_ISLE.y + 7, hdIsle, (y) => (y < HD_ISLE.y - 2 ? '#8aa462' : '#6e8a4e'))
    for (let k = 0; k < 5; k++) broadTree(ctx, HD_ISLE.x - 30 + k * 15, HD_ISLE.y - 2, 0.9, GREEN)
  }),
  sp('hd_boat', '나루의 배', 10, HD_ISLE_F, (ctx) => boat(ctx, HD_ISLE.x, HD_ISLE.y + 4, { len: 26 })),
  sp('hd_bridge', '물 건너는 다리', 10, HD_ISLE_F, (ctx) => {
    for (let a = 0; a <= Math.PI; a += 0.02) px(ctx, HD_ISLE.x - Math.cos(a) * 40, HD_ISLE.y - Math.sin(a) * 10, 3, 3, '#8a7a62')
  }),

  sp('hd_redcloud', '물 위의 붉은 구름 같은 꽃', 22, HD_ISLE_F, (ctx, env) => {
    for (let k = 0; k < 26; k++) {
      const a = hash(k * 2.1) * Math.PI
      const r = Math.sqrt(hash(k * 3.7)) * 30
      const x = HD_ISLE.x + Math.cos(a) * r * 1.4
      const y = HD_ISLE.y - 12 - Math.sin(a) * r * 0.5
      disc(ctx, x + Math.sin(env.t * 0.5 + k) * 0.5, y, 5, k % 3 ? '#e86a8a' : '#f49aae')
    }
    withAlpha(ctx, 0.35, () => {
      for (let k = 0; k < 8; k++) px(ctx, HD_ISLE.x - 40 + k * 10 + Math.sin(env.t * 2 + k) * 2, HD_ISLE.y + 10 + (k % 3) * 3, 8, 1, '#f49aae')
    })
  }),
  sp('hd_mist', '흰 안개', 22, HD_ISLE_F, (ctx, env) => mistBands(ctx, env.t, [108, 114, 120], '#ffffff', 0.7)),
  sp('hd_rainbow', '무지개', 22, HD_ISLE_F, (ctx) => {
    for (const [r, c] of [[40, '#c8504a'], [37, '#d8a040'], [34, '#7aa050'], [31, '#4a6ab0']] as const)
      for (let a = Math.PI; a < Math.PI * 2; a += 0.01) dot(ctx, HD_ISLE.x + Math.cos(a) * r, HD_ISLE.y + Math.sin(a) * r * 0.8, c)
  }),
]

// ════════════════════════════════════════════════════════════
// 韓愈〈稻畦〉: 바둑판 같은 논
// ════════════════════════════════════════════════════════════
const DC_TOP = 96
const DC_ROWS = [0, 1, 2, 3, 4, 5].map((r) => ({ y: DC_TOP + 4 + r * r * 2.2 + r * 4, h: 3 + r * 1.6 }))

export const daoqiBackground: Background = {
  id: 'hy086',
  drawBack(ctx) {
    sky(ctx, ['#b8ccd8', '#c8d6dc', '#d8e0d8'], DC_TOP)
    ridge(ctx, (x) => 78 + 12 * Math.sin(x * 0.018 + 1), '#9ab0a0', '#a6bcac', 0, W, DC_TOP)
    for (let y = DC_TOP; y < H; y++) px(ctx, 0, y, W, 1, mix('#8aa45a', '#6a8a42', (y - DC_TOP) / 84))
  },
  drawFront() {},
  drawDynamic() {},
}

const DC_FIELD = { x: 80, y: 88, w: 160, h: 90 }
const DC_NEAR = { x: 96, y: 128, w: 128, h: 52 }
const DC_CRANE = { x: 200, y: 108, w: 112, h: 63 }

export const DAOQI_SPRITES = [
  sp('dc_grid', '바둑판처럼 반듯한 논', 8, DC_FIELD, (ctx) => {
    for (const [r, row] of DC_ROWS.entries()) {
      const n = 8 - Math.floor(r / 2)
      const cw = W / n
      for (let c = 0; c <= n; c++) px(ctx, c * cw + (r % 2) * 2, row.y, 1, row.h, '#b8a870')
      px(ctx, 0, row.y + row.h, W, 1, '#b8a870')
      for (let c = 0; c < n; c++) for (let i = 2; i < cw - 2; i += 3) dot(ctx, c * cw + i, row.y + row.h / 2, '#5a8a3a')
    }
  }),
  sp('dc_curvy', '구불구불한 밭', 8, DC_FIELD, (ctx) => {
    for (let k = 0; k < 8; k++) for (let x = 0; x < W; x++) dot(ctx, x, DC_TOP + 8 + k * 10 + Math.sin(x * 0.04 + k) * 4, '#b8a870')
  }),
  sp('dc_empty', '텅 빈 들', 8, DC_FIELD, (ctx) => px(ctx, 0, DC_TOP, W, H - DC_TOP, '#a89a6a')),

  sp('dc_channels', '가지처럼 갈라져 숨은 물길', 10, DC_FIELD, (ctx, env) => {
    const branches: [number, number, number, number][] = [[160, H, 160, DC_TOP + 10], [160, 150, 80, 116], [160, 140, 250, 110], [160, 124, 110, 104], [160, 120, 210, 102]]
    for (const [x0, y0, x1, y1] of branches) {
      for (let t = 0; t <= 1; t += 0.01) {
        const x = x0 + (x1 - x0) * t
        const y = y0 + (y1 - y0) * t
        if (hash(t * 300 + x0) > 0.35) px(ctx, x, y, 2, 1, Math.sin(t * 40 - env.t * 3) > 0.7 ? '#d8eaf0' : '#8ab4c0')
      }
    }
  }),
  sp('dc_canal', '곧게 뻗은 운하', 10, DC_FIELD, (ctx) => px(ctx, 150, DC_TOP, 20, H - DC_TOP, '#8ab4c0')),
  sp('dc_dry', '바닥이 드러난 도랑', 10, DC_FIELD, (ctx) => {
    for (let y = DC_TOP + 10; y < H; y++) px(ctx, 158, y, 4, 1, '#a89a6a')
  }),

  sp('dc_fish', '살찐 물고기', 20, DC_NEAR, (ctx, env) => {
    withAlpha(ctx, 0.7, () => px(ctx, 100, 150, 120, 26, '#7aa0a0'))
    for (let k = 0; k < 4; k++) {
      const x = 110 + mod(k * 30 + env.t * (5 + k), 100)
      const y = 156 + (k % 3) * 6
      fillRows(ctx, y - 2, y + 3, (yy) => [x - 5 + Math.abs(yy - y), x + 5 - Math.abs(yy - y)], '#d8a040')
      px(ctx, x - 7, y - 1, 2, 3, '#d8a040')
    }
    for (let k = 0; k < 12; k++) px(ctx, 100 + k * 10, 146 - (k % 3) * 2, 1, 8, '#5a8a3a')
  }),
  sp('dc_ducks', '오리', 20, DC_NEAR, (ctx) => {
    for (let k = 0; k < 3; k++) {
      px(ctx, 120 + k * 30, 158, 7, 3, '#7a6a4a')
      px(ctx, 126 + k * 30, 155, 3, 3, '#3e5a3a')
    }
  }),
  sp('dc_frog', '개구리', 20, DC_NEAR, (ctx, env) => px(ctx, 150, 160 - Math.abs(Math.sin(env.t * 2)) * 6, 5, 3, '#5a8a3a')),

  sp('dc_crane', '벼 사이로 모습이 잠긴 학', 22, DC_CRANE, (ctx, env) => {
    const x = 250 + Math.sin(env.t * 0.2) * 12
    px(ctx, x, 128, 6, 6, '#f6f4ee')
    px(ctx, x + 5, 116, 2, 12, '#f6f4ee')
    px(ctx, x + 5, 120, 2, 3, '#2a2622')
    px(ctx, x + 5, 114, 4, 2, '#f6f4ee')
    dot(ctx, x + 6, 113, '#d83a2a')
    px(ctx, x + 9, 115, 3, 1, '#c8a441')
    for (let k = 0; k < 30; k++) {
      const gx = 204 + k * 3.6
      const h = 14 + hash(k) * 6
      for (let i = 0; i < h; i++) dot(ctx, gx + Math.sin(env.t + k) * (i / h), 146 - i, i > h - 3 ? '#b8b050' : '#5a9a3a')
    }
  }),
  sp('dc_scarecrow', '허수아비', 22, DC_CRANE, (ctx) => {
    px(ctx, 250, 110, 2, 30, '#6a4a32')
    px(ctx, 240, 118, 22, 2, '#6a4a32')
    disc(ctx, 251, 108, 4, '#c8a868')
  }),
  sp('dc_ox', '소', 22, DC_CRANE, (ctx) => {
    px(ctx, 236, 126, 24, 10, '#6a4a32')
    px(ctx, 258, 122, 8, 8, '#6a4a32')
  }),
]

// ════════════════════════════════════════════════════════════
// 劉禹錫〈題壽安甘棠館〉: 신선의 집 같은 관사
// ════════════════════════════════════════════════════════════
const GT_GROUND = 120
const GT_LODGE = { x: 46, y: 88 }
const gtCliff = (y: number): [number, number] => [250 - (y - 64) * 0.3 + Math.sin(y * 0.2) * 4, W]
const GT_BLOOMS = Array.from({ length: 8 }, (_, k) => ({ x: gtCliff(90 + k * 5)[0] + 6 + (k % 3) * 8, y: 90 + k * 5 }))

export const gantangBackground: Background = {
  id: 'hy088',
  drawBack(ctx) {
    sky(ctx, ['#c0d0d8', '#ccdadc', '#d8e2dc'], GT_GROUND)
    ridge(ctx, (x) => 70 + 14 * Math.sin(x * 0.02 + 2), '#a0b4a8', '#acc0b4', 0, W, GT_GROUND)
    px(ctx, 0, GT_GROUND, W, H - GT_GROUND, '#7e9a62')
    fillRows(ctx, 64, H, gtCliff, (y) => (y % 7 === 0 ? '#7a766a' : '#8a867a'))
    for (const b of GT_BLOOMS) disc(ctx, b.x, b.y, 4, '#4e6a40')
  },
  drawFront() {},
  drawDynamic() {},
}

const GT_LODGE_F = { x: 8, y: 56, w: 144, h: 81 }
const GT_POND = { x: 64, y: 108, w: 160, h: 72 }
const GT_CLIFF_F = { x: 192, y: 60, w: 128, h: 72 }

export const GANTANG_SPRITES = [
  sp('gt_fairy', '신선의 집 같은 관사', 14, GT_LODGE_F, (ctx, env) => {
    const { x, y } = GT_LODGE
    px(ctx, x, y + 6, 70, 24, '#e6dfcc')
    for (let r = 0; r < 5; r++) px(ctx, x - 6 - r + (r === 0 ? 4 : 0), y + r, 82 + r * 2 - (r === 0 ? 8 : 0), 1, r < 2 ? '#4a4f57' : '#3c4048')
    dot(ctx, x - 12, y + 3, '#3c4048')
    dot(ctx, x + 81, y + 3, '#3c4048')
    for (let c = 2; c < 70; c += 12) px(ctx, x + c, y + 6, 2, 24, '#8a3a2a')
    for (let k = 0; k < 4; k++) pine(ctx, x - 20 + k * 34, GT_GROUND, 0.9)
    mistBands(ctx, env.t * 0.4, [y + 26, y + 34, y - 4], '#ffffff', 0.55)
  }),
  sp('gt_office', '북적이는 관청', 14, GT_LODGE_F, (ctx, env) => {
    px(ctx, GT_LODGE.x, GT_LODGE.y + 6, 70, 24, '#8a8072')
    for (let k = 0; k < 6; k++) person(ctx, GT_LODGE.x + 4 + k * 11, GT_LODGE.y + 22 - (Math.sin(env.t * 3 + k) > 0.6 ? 1 : 0), OTHER_PALS[k % 4].R)
  }),
  sp('gt_barn', '허름한 창고', 14, GT_LODGE_F, (ctx) => {
    hut(ctx, GT_LODGE.x + 10, GT_LODGE.y + 12)
    hut(ctx, GT_LODGE.x + 36, GT_LODGE.y + 14)
  }),

  sp('gt_pond', '맑은 못과 비스듬한 대숲길', 12, GT_POND, (ctx, env) => {
    fillRows(ctx, 136, 164, (y) => [110 + Math.abs(y - 150) * 2, 220 - Math.abs(y - 150) * 2], '#9ac8d0')
    withAlpha(ctx, 0.35, () => px(ctx, 120, 144, 40, 10, '#e6dfcc'))
    shimmer(ctx, env.t, 138, 162, 6, '#e4f0f0', 112, 218)
    for (let t = 0; t <= 1; t += 0.01) px(ctx, 80 + t * 40, GT_GROUND + 2 + t * 40, 3, 1, '#c8b88a')
    for (let k = 0; k < 8; k++) bamboo(ctx, 74 + k * 6 + (k % 2) * 30, GT_GROUND + 8 + k * 5, 30 + (k % 3) * 6)
  }),
  sp('gt_swamp', '흐린 늪', 12, GT_POND, (ctx) => fillRows(ctx, 136, 164, (y) => [110 + Math.abs(y - 150) * 2, 220 - Math.abs(y - 150) * 2], '#6a6a4a')),
  sp('gt_stairs', '가파른 돌계단', 12, GT_POND, (ctx) => {
    for (let k = 0; k < 8; k++) px(ctx, 100 + k * 6, GT_GROUND + 4 + k * 6, 14, 3, '#a8a49a')
  }),

  sp('gt_bird', '문득 놀라 날아오르는 산새', 22, GT_CLIFF_F, (ctx, env) => {
    for (let k = 0; k < 4; k++) {
      const f = mod(env.t * 0.3 + k / 4, 1)
      const x = 262 - f * 60 + k * 4
      const y = 100 - f * 30 - k * 3
      const up = Math.sin(env.t * 10 + k) > 0
      px(ctx, x - 2, y, 5, 2, '#6a5a4a')
      px(ctx, x - 3, up ? y - 2 : y + 2, 3, 1, '#6a5a4a')
      px(ctx, x + 2, up ? y - 2 : y + 2, 3, 1, '#6a5a4a')
    }
  }),
  sp('gt_sleep', '둥지에서 잠든 산새', 22, GT_CLIFF_F, (ctx) => {
    px(ctx, GT_BLOOMS[2].x - 4, GT_BLOOMS[2].y - 6, 8, 3, '#8a7a4a')
    px(ctx, GT_BLOOMS[2].x - 2, GT_BLOOMS[2].y - 9, 4, 3, '#6a5a4a')
  }),
  sp('gt_sing', '노래하는 산새', 22, GT_CLIFF_F, (ctx, env) => {
    px(ctx, GT_BLOOMS[2].x - 2, GT_BLOOMS[2].y - 8, 4, 3, '#6a5a4a')
    soundArcs(ctx, GT_BLOOMS[2].x, GT_BLOOMS[2].y - 7, env.t, '#5d4a37', 12)
  }),

  sp('gt_petals', '바위 중턱에서 떨어지는 꽃', 24, GT_CLIFF_F, (ctx, env) => {
    for (const b of GT_BLOOMS) for (let i = 0; i < 4; i++) dot(ctx, b.x - 3 + i * 2, b.y - 2 + (i % 2) * 3, '#f2a0b8')
    for (let i = 0; i < 16; i++) {
      const f = mod(hash(i * 2.3) + env.t * 0.1, 1)
      const b = GT_BLOOMS[i % GT_BLOOMS.length]
      px(ctx, b.x - f * 30 + Math.sin(env.t * 3 + i) * 3, b.y + f * 50, 2, 1, '#f2a0b8')
    }
  }),
  sp('gt_fruit', '떨어지는 열매', 24, GT_CLIFF_F, (ctx, env) => {
    for (let i = 0; i < 5; i++) disc(ctx, GT_BLOOMS[i].x, GT_BLOOMS[i].y + mod(env.t * 20 + i * 10, 50), 1, '#c8402a')
  }),
  sp('gt_rock', '굴러떨어지는 돌', 24, GT_CLIFF_F, (ctx, env) => disc(ctx, GT_BLOOMS[3].x - mod(env.t * 10, 30), GT_BLOOMS[3].y + mod(env.t * 20, 40), 2, '#6a665c')),
]

// ════════════════════════════════════════════════════════════
// 張仲素〈宮中樂〉: 궁궐의 가을밤
// ════════════════════════════════════════════════════════════
const GZ_POND = 140
const GZ_RAIL = { x0: 92, x1: 236, y: 136 }

export const gongzhongBackground: Background = {
  id: 'hy089',
  drawBack(ctx) {
    sky(ctx, ['#141a30', '#1c2440', '#28304e'], GZ_POND)
    stars(ctx, 18, 81, 4, 60, 0, '#a8acc4')
    // 난새 궁전 (왼쪽)
    px(ctx, 16, 84, 110, 40, '#7a2a22')
    px(ctx, 8, 74, 126, 10, '#2a2e36')
    px(ctx, 14, 72, 114, 2, '#363a42')
    for (let x = 22; x < 126; x += 14) px(ctx, x, 86, 2, 38, '#a8802a')
    // 봉황 누각 (오른쪽)
    px(ctx, 242, 92, 46, 34, '#6a2420')
    px(ctx, 236, 84, 58, 8, '#2a2e36')
    px(ctx, 248, 72, 34, 12, '#6a2420')
    px(ctx, 244, 66, 42, 6, '#2a2e36')
    px(ctx, 0, 124, W, GZ_POND - 124, '#3a3a40')
    water(ctx, GZ_POND, H, '#1e2a40', '#16203a', '#2e3c58')
    // 물가 난간
    px(ctx, GZ_RAIL.x0, GZ_RAIL.y, GZ_RAIL.x1 - GZ_RAIL.x0, 2, '#a8382a')
    for (let x = GZ_RAIL.x0; x <= GZ_RAIL.x1; x += 8) px(ctx, x, GZ_RAIL.y, 1, 8, '#a8382a')
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    shimmer(ctx, env.t, GZ_POND + 3, 178, 10, '#3e4e6a')
  },
}

const GZ_HALL = { x: 0, y: 16, w: 160, h: 108 }
const GZ_TOWER = { x: 192, y: 56, w: 128, h: 72 }
const GZ_RAIL_F = { x: 80, y: 100, w: 160, h: 80 }

export const GONGZHONG_SPRITES = [
  sp('gz_moon', '난새 궁전 위에 뜬 달빛', 6, GZ_HALL, (ctx) => {
    moon(ctx, 70, 36, 9)
    withAlpha(ctx, 0.3, () => px(ctx, 8, 72, 126, 3, '#e8e4c8'))
  }),
  sp('gz_sun', '한낮의 해', 6, GZ_HALL, (ctx) => {
    sky(ctx, ['#a8c4dc', '#bcd2e2'], 72)
    sun(ctx, 70, 34, 9)
  }),
  sp('gz_rain', '비구름', 6, GZ_HALL, (ctx, env) => {
    for (const [x, y, w] of [[10, 20, 120], [40, 30, 100]] as const) px(ctx, x, y, w, 10, '#3a4256')
    rain(ctx, env.t, 50, 120, 'rgba(140,150,170,0.6)')
  }),

  sp('gz_anvil', '봉황 누각 너머의 다듬이 소리', 20, GZ_TOWER, (ctx, env) => {
    for (let k = 0; k < 2; k++) soundArcs(ctx, 300 - k * 30, 100 + k * 4, env.t * 1.2 + k * 0.4, '#c8c4b0', 26)
    withAlpha(ctx, 0.5, () => px(ctx, 300, 104, 6, 2, '#c8c4b0'))
  }),
  sp('gz_bell', '종소리', 20, GZ_TOWER, (ctx, env) => {
    px(ctx, 262, 94, 8, 10, '#8a7a3a')
    soundArcs(ctx, 266, 100, env.t, '#c8c4b0', 22)
  }),
  sp('gz_drum', '북소리', 20, GZ_TOWER, (ctx, env) => {
    disc(ctx, 266, 104, 6, '#8a3a2a')
    if (Math.sin(env.t * 4) > 0.5) soundArcs(ctx, 266, 104, env.t, '#c8c4b0', 16)
  }),

  sp('gz_music', '물가 난간의 생황 노래', 22, GZ_RAIL_F, (ctx, env) => {
    for (let k = 0; k < 4; k++) {
      const x = 110 + k * 30
      lady(ctx, x, GZ_RAIL.y - 18, ['#c86a7a', '#c8a0c0', '#6a8a9a', '#d8a040'][k])
      if (k % 2 === 0) for (let i = 0; i < 4; i++) px(ctx, x + 6 + i, GZ_RAIL.y - 16 - i, 1, 3, '#c8a441')
    }
    notes(ctx, 150, GZ_RAIL.y - 24, env.t, '#e8e4d0')
  }),
  sp('gz_fish', '낚시하는 사람', 22, GZ_RAIL_F, (ctx) => {
    person(ctx, 150, GZ_RAIL.y - 10, '#4b5068')
    for (let i = 0; i < 20; i++) dot(ctx, 153 + i, GZ_RAIL.y - 6 + i * 0.3, '#5a4632')
  }),
  sp('gz_guard', '창 든 군사', 22, GZ_RAIL_F, (ctx) => {
    for (const x of [120, 200]) {
      person(ctx, x, GZ_RAIL.y - 10, '#6a3a2a', { hat: '#4a4a52' })
      px(ctx, x + 3, GZ_RAIL.y - 20, 1, 18, '#8a8478')
    }
  }),

  sp('gz_candle', '가을을 맞는 붉은 촛불', 26, GZ_RAIL_F, (ctx, env) => {
    for (let x = GZ_RAIL.x0 + 4; x < GZ_RAIL.x1; x += 24) {
      px(ctx, x, GZ_RAIL.y - 6, 2, 6, '#c8302a')
      const fl = Math.sin(env.t * 7 + x) > -0.4
      px(ctx, x, GZ_RAIL.y - 8, 2, 2, fl ? '#ffd27a' : '#f0a845')
      withAlpha(ctx, 0.22, () => disc(ctx, x + 1, GZ_RAIL.y - 8, 6, '#ffb060'))
      withAlpha(ctx, 0.4, () => px(ctx, x, GZ_POND + 6 + (x % 3), 2, 6, '#ffb060'))
    }
    drift(ctx, env.t, { x: 90, y: 100, w: 150, h: 60 }, 6, '#c86a2a', 0.4, 6)
  }),
  sp('gz_out', '꺼진 촛불', 26, GZ_RAIL_F, (ctx) => {
    for (let x = GZ_RAIL.x0 + 4; x < GZ_RAIL.x1; x += 24) px(ctx, x, GZ_RAIL.y - 6, 2, 6, '#8a8a8a')
  }),
  sp('gz_torch', '횃불', 26, GZ_RAIL_F, (ctx, env) => {
    for (const x of [100, 230]) {
      px(ctx, x, GZ_RAIL.y - 16, 2, 16, '#5a4632')
      px(ctx, x - 1, GZ_RAIL.y - 20, 4, 4, Math.sin(env.t * 8) > 0 ? '#ffb040' : '#e8702a')
    }
  }),
]

// ════════════════════════════════════════════════════════════
// 張仲素〈春遊曲〉: 버들솜 날리는 꽃밭의 그네
// ════════════════════════════════════════════════════════════
const CQ_GROUND = 132
const CQ_WILLOW = { x: 48, y: CQ_GROUND }
const CQ_ELM = { x: 270, y: CQ_GROUND }
const CQ_SWING = { x: 158, top: 74 }

export const chunyouBackground: Background = {
  id: 'hy090',
  drawBack(ctx) {
    sky(ctx, ['#c4d8e4', '#d0e0e6', '#e0e8e4'], CQ_GROUND)
    ridge(ctx, (x) => 100 + 8 * Math.sin(x * 0.02 + 0.5), '#a4bcac', '#b0c8b8', 0, W, CQ_GROUND)
    px(ctx, 0, CQ_GROUND, W, H - CQ_GROUND, '#8aac62')
    // 버드나무
    px(ctx, CQ_WILLOW.x - 2, CQ_WILLOW.y - 60, 4, 60, '#5a4632')
    for (let k = 0; k < 16; k++) for (let i = 0; i < 34; i++) dot(ctx, CQ_WILLOW.x - 24 + k * 3 + Math.sin(i * 0.2) * 1.5, CQ_WILLOW.y - 64 + i + Math.abs(k - 8), k % 2 ? '#8aa860' : '#a4bf74')
    // 느릅나무
    broadTree(ctx, CQ_ELM.x, CQ_ELM.y, 2.4, SPRING)
    // 그네 틀
    for (const dx of [-16, 16]) px(ctx, CQ_SWING.x + dx, CQ_SWING.top, 2, CQ_GROUND - CQ_SWING.top, '#8a3a2a')
    px(ctx, CQ_SWING.x - 18, CQ_SWING.top - 2, 38, 3, '#8a3a2a')
  },
  drawFront() {},
  drawDynamic() {},
}

const CQ_WILLOW_F = { x: 0, y: 48, w: 128, h: 90 }
const CQ_ELM_F = { x: 208, y: 64, w: 112, h: 90 }
const CQ_GARDEN = { x: 80, y: 100, w: 144, h: 80 }
const CQ_SWING_F = { x: 104, y: 60, w: 112, h: 90 }

export const CHUNYOU_SPRITES = [
  sp('cq_catkin', '안개 낀 버들에서 날리는 버들솜', 24, CQ_WILLOW_F, (ctx, env) => {
    withAlpha(ctx, 0.3, () => mistBands(ctx, env.t * 0.3, [78, 90], '#ffffff', 1))
    for (let i = 0; i < 26; i++) {
      const f = mod(hash(i * 2.1) + env.t * (0.03 + hash(i) * 0.03), 1)
      const x = CQ_WILLOW.x - 20 + f * 160 + Math.sin(env.t * 1.5 + i) * 6
      const y = 70 + hash(i * 3.3) * 50 + Math.sin(env.t + i) * 4
      dot(ctx, x, y, '#fbfaf4')
      if (i % 3 === 0) dot(ctx, x + 1, y, '#fbfaf4')
    }
  }),
  sp('cq_snow', '흰 눈송이', 24, CQ_WILLOW_F, (ctx, env) => snowfall(ctx, env.t, 60)),
  sp('cq_smoke', '연기', 24, CQ_WILLOW_F, (ctx, env) => {
    for (let k = 0; k < 5; k++) {
      const f = mod(env.t * 0.15 + k / 5, 1)
      withAlpha(ctx, 0.4 * (1 - f), () => disc(ctx, CQ_WILLOW.x + f * 20, 100 - f * 40, 4 + f * 8, '#8a8a8a'))
    }
  }),

  sp('cq_elm', '바람 부는 느릅나무의 동전 같은 열매', 24, CQ_ELM_F, (ctx, env) => {
    for (let i = 0; i < 18; i++) {
      const f = mod(hash(i * 1.9) + env.t * 0.08, 1)
      const x = CQ_ELM.x - 24 + hash(i * 2.7) * 48 - f * 30 + Math.sin(env.t * 2 + i) * 3
      const y = CQ_ELM.y - 40 + f * 44
      disc(ctx, x, y, 1, '#d8e8a0')
      dot(ctx, x, y, '#a8c060')
    }
    for (let k = 0; k < 10; k++) disc(ctx, CQ_ELM.x - 30 + hash(k * 4.3) * 60, CQ_GROUND + 2 + hash(k * 2.1) * 6, 1, '#d8e8a0')
  }, { wind: 0.4 }),
  sp('cq_cone', '솔방울', 24, CQ_ELM_F, (ctx) => {
    for (let k = 0; k < 6; k++) px(ctx, CQ_ELM.x - 20 + k * 8, CQ_GROUND + 2, 3, 4, '#8a5a2a')
  }),
  sp('cq_petal', '꽃잎', 24, CQ_ELM_F, (ctx, env) => drift(ctx, env.t, { x: 220, y: 90, w: 90, h: 50 }, 14, '#f2b8c6', 0.3, 5)),

  sp('cq_flowers', '자욱한 온갖 꽃', 12, CQ_GARDEN, (ctx, env) => {
    for (let k = 0; k < 90; k++) {
      const x = hash(k * 1.7) * W
      const y = CQ_GROUND + 2 + hash(k * 2.9) * 44
      flower(ctx, x, y, ['#f2b8c6', '#f4d060', '#f8f4e8', '#c8a0e0', '#e86a8a'][k % 5], '#d8a040')
    }
    withAlpha(ctx, 0.15, () => mistBands(ctx, env.t * 0.3, [124, 136, 150], '#f8e0e8', 1))
  }),
  sp('cq_snowfield', '눈밭', 12, CQ_GARDEN, (ctx) => px(ctx, 0, CQ_GROUND, W, H - CQ_GROUND, '#eef2f2')),
  sp('cq_reeds', '갈대밭', 12, CQ_GARDEN, (ctx, env) => grasses(ctx, 0, W, H, env, '#b8a870', 80, 16)),

  sp('cq_swing', '다투어 그네 타는 비단옷 여인들', 26, CQ_SWING_F, (ctx, env) => {
    const a = Math.sin(env.t * 1.6) * 0.6
    const len = 44
    const sx = CQ_SWING.x + 1 + Math.sin(a) * len
    const sy = CQ_SWING.top + Math.cos(a) * len
    for (const dx of [-5, 5]) for (let i = 0; i < len; i++) dot(ctx, CQ_SWING.x + 1 + dx + (Math.sin(a) * len * i) / len, CQ_SWING.top + (Math.cos(a) * len * i) / len, '#8a7a5a')
    px(ctx, sx - 6, sy, 12, 2, '#6a4a32')
    lady(ctx, sx - 3, sy - 18, '#e86a8a')
    for (let i = 0; i < 8; i++) dot(ctx, sx - 4 - i * (a > 0 ? 1 : -1), sy - 8 + Math.sin(env.t * 6 + i) * 1.5, '#f8d0d8')
    lady(ctx, CQ_SWING.x - 40, CQ_GROUND - 18, '#7aa0c8')
    lady(ctx, CQ_SWING.x + 30, CQ_GROUND - 18, '#d8a040')
  }),
  sp('cq_kite', '연날리기', 26, CQ_SWING_F, (ctx) => {
    lady(ctx, CQ_SWING.x - 30, CQ_GROUND - 18, '#e86a8a')
    fillRows(ctx, 66, 78, (y) => [190 - (6 - Math.abs(y - 72)), 190 + (6 - Math.abs(y - 72))], '#e8c048')
    for (let i = 0; i < 30; i++) dot(ctx, CQ_SWING.x - 24 + i * 2.2, CQ_GROUND - 12 - i * 1.6, '#5a4632')
  }),
  sp('cq_go', '바둑 두는 여인들', 26, CQ_SWING_F, (ctx) => {
    lady(ctx, CQ_SWING.x - 14, CQ_GROUND - 14, '#e86a8a', 'sit')
    lady(ctx, CQ_SWING.x + 10, CQ_GROUND - 14, '#7aa0c8', 'sit')
    px(ctx, CQ_SWING.x - 2, CQ_GROUND - 4, 10, 4, '#c8a868')
  }),
]

