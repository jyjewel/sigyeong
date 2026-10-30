// 『唐詩畫意』 卷九 넷째 묶음 (2): 李商隱〈早起〉, 馬戴〈秋思〉〈贈道者〉, 溫庭筠〈碧澗驛曉思〉, 劉駕〈牧童〉, 于武陵〈高樓〉
import type { Background } from '../types'
import { H, W, disc, dot, fillRows, hash, mod, px } from '../pixel'
import type { Ctx } from '../pixel'
import { bird, boat, broadTree, flower, house, hut, mistBands, moon, person, rain, ridge, sky, snowfall, stars, withAlpha } from '../kit'
import { OTHER_PALS, pal, seatFig, standFig } from '../figures'
import { drift, shimmer, soundArcs, sp, sun } from './hy_kit'
import { vignette } from './hy_b3a'
import { lady } from './hy_b4a'

const FULL = { x: 0, y: 0, w: 320, h: 180 }
const DAOIST = pal({ R: '#d8dce4', r: '#a8b0c0', K: '#3a3a4a', L: '#4a6a8a' })

// ════════════════════════════════════════════════════════════
// 李商隱〈早起〉: 발 사이로 내다본 봄 뜰
// ════════════════════════════════════════════════════════════
const ZQ_GROUND = 134
const ZQ_BLIND = { x: 50, y: 88, w: 34, h: 46 }
const ZQ_TREE = { x: 236, y: ZQ_GROUND }
const ZQ_BLOOMS = Array.from({ length: 22 }, (_, i) => ({ x: ZQ_TREE.x - 30 + hash(i * 2.1) * 60, y: ZQ_TREE.y - 66 + hash(i * 3.3) * 30 }))

export const zaoqiBackground: Background = {
  id: 'hy102',
  drawBack(ctx) {
    sky(ctx, ['#d0d8e4', '#dcdee4', '#e8e2dc'], ZQ_GROUND)
    ridge(ctx, (x) => 104 + 6 * Math.sin(x * 0.02 + 1), '#b4bcb4', '#bcc4bc', 0, W, ZQ_GROUND)
    px(ctx, 0, ZQ_GROUND, W, H - ZQ_GROUND, '#8aac62')
    px(ctx, 10, 76, 120, 58, '#d8d0bc')
    px(ctx, 4, 66, 132, 10, '#3c4048')
    px(ctx, 8, 64, 124, 2, '#4a4f57')
    px(ctx, ZQ_BLIND.x, ZQ_BLIND.y, ZQ_BLIND.w, ZQ_BLIND.h, '#3a3226')
    px(ctx, ZQ_TREE.x - 3, ZQ_TREE.y - 50, 6, 50, '#4a3426')
    for (const b of ZQ_BLOOMS) disc(ctx, b.x, b.y, 4, '#6a9a4a')
  },
  drawFront() {},
  drawDynamic(ctx) {
    for (let y = ZQ_BLIND.y; y < ZQ_BLIND.y + ZQ_BLIND.h; y += 2) px(ctx, ZQ_BLIND.x, y, ZQ_BLIND.w, 1, 'rgba(184,160,112,0.75)')
  },
}

const ZQ_YARD = { x: 120, y: 100, w: 144, h: 80 }
const ZQ_BLIND_F = { x: 16, y: 76, w: 112, h: 63 }
const ZQ_TREE_F = { x: 184, y: 56, w: 112, h: 72 }

export const ZAOQI_SPRITES = [
  sp('zq_dew', '바람과 이슬이 맑은 새벽', 10, ZQ_YARD, (ctx, env) => {
    for (let k = 0; k < 50; k++) if (Math.sin(env.t * 2 + k) > 0.4) dot(ctx, 90 + hash(k * 2.3) * 230, ZQ_GROUND + 2 + hash(k * 3.1) * 40, '#ffffff')
    for (let k = 0; k < 4; k++) withAlpha(ctx, 0.35, () => px(ctx, mod(hash(k) * 300 + env.t * 20, 330) - 10, 110 + k * 8, 16, 1, '#ffffff'))
  }),
  sp('zq_rain', '쏟아지는 비', 10, ZQ_YARD, (ctx, env) => rain(ctx, env.t, 70, 140, 'rgba(150,165,180,0.7)')),
  sp('zq_snow', '함박눈', 10, ZQ_YARD, (ctx, env) => snowfall(ctx, env.t, 60)),

  sp('zq_alone', '발 사이로 홀로 일어난 사람', 14, ZQ_BLIND_F, (ctx) => {
    withAlpha(ctx, 0.4, () => px(ctx, ZQ_BLIND.x + 1, ZQ_BLIND.y + 1, ZQ_BLIND.w - 2, ZQ_BLIND.h - 2, '#e8d8b0'))
    standFig(ctx, ZQ_BLIND.x + 10, ZQ_BLIND.y + 20, pal())
  }),
  sp('zq_two', '나란히 일어난 두 사람', 14, ZQ_BLIND_F, (ctx) => {
    standFig(ctx, ZQ_BLIND.x + 2, ZQ_BLIND.y + 20, pal())
    standFig(ctx, ZQ_BLIND.x + 18, ZQ_BLIND.y + 20, pal(OTHER_PALS[2]))
  }),
  sp('zq_cat', '기지개 켜는 고양이', 14, ZQ_BLIND_F, (ctx) => {
    px(ctx, ZQ_BLIND.x + 10, ZQ_BLIND.y + 40, 12, 4, '#8a8a8a')
    px(ctx, ZQ_BLIND.x + 20, ZQ_BLIND.y + 36, 5, 5, '#8a8a8a')
  }),

  sp('zq_oriole', '우는 꾀꼬리와 웃는 꽃', 22, ZQ_TREE_F, (ctx, env) => {
    for (const b of ZQ_BLOOMS) {
      disc(ctx, b.x + 1, b.y - 1, 1, '#f49aae')
      dot(ctx, b.x - 2, b.y + 1, '#f8c8d4')
    }
    const x = ZQ_TREE.x + 14
    const y = ZQ_TREE.y - 46
    px(ctx, x, y, 6, 4, '#f0c020')
    px(ctx, x + 5, y - 2, 3, 3, '#f0c020')
    dot(ctx, x + 6, y - 2, '#1f1d22')
    px(ctx, x - 3, y + 1, 3, 1, '#2a2a2a')
    dot(ctx, x + 8, y - 1, '#d88a2a')
    soundArcs(ctx, x + 9, y - 1, env.t * 1.5, '#5d4a37', 14)
  }),
  sp('zq_crow', '우는 까마귀', 22, ZQ_TREE_F, (ctx, env) => {
    px(ctx, ZQ_TREE.x + 14, ZQ_TREE.y - 46, 7, 4, '#1a1a20')
    soundArcs(ctx, ZQ_TREE.x + 22, ZQ_TREE.y - 46, env.t, '#5d4a37', 12)
  }),
  sp('zq_cicada', '우는 매미', 22, ZQ_TREE_F, (ctx, env) => {
    px(ctx, ZQ_TREE.x + 3, ZQ_TREE.y - 30, 3, 5, '#4a3a2a')
    soundArcs(ctx, ZQ_TREE.x + 4, ZQ_TREE.y - 28, env.t * 2, '#5d4a37', 14)
  }),

  sp('zq_spring', '홀로 바라보는 뜰 가득한 봄', 28, FULL, (ctx, env) => {
    withAlpha(ctx, 0.12, () => px(ctx, 0, 0, W, H, '#ffe0e8'))
    drift(ctx, env.t, { x: 100, y: 60, w: 220, h: 110 }, 24, '#f49aae', 0.4, 9)
    for (let k = 0; k < 20; k++) flower(ctx, 110 + hash(k * 1.9) * 200, ZQ_GROUND + 6 + hash(k * 2.7) * 36, ['#f2b8c6', '#f4d060', '#f8f4e8'][k % 3], '#d8a040')
  }),
  sp('zq_feast', '떠들썩한 잔치', 28, FULL, (ctx, env) => {
    for (let k = 0; k < 5; k++) person(ctx, 150 + k * 16, ZQ_GROUND + 4 - (Math.sin(env.t * 4 + k) > 0 ? 1 : 0), OTHER_PALS[k % 4].R)
  }),
  sp('zq_winter', '차가운 겨울', 28, FULL, (ctx) => withAlpha(ctx, 0.5, () => px(ctx, 0, ZQ_GROUND, W, H - ZQ_GROUND, '#eef2f2'))),
]

// ════════════════════════════════════════════════════════════
// 馬戴〈秋思〉: 장마 뒤 외로운 산과 빈 전원
// ════════════════════════════════════════════════════════════
const MD_GROUND = 128
const mdPeak = (x: number) => 112 - 52 * Math.exp(-(((x - 210) / 40) ** 2))
const MD_TREES = Array.from({ length: 12 }, (_, k) => 10 + k * 26)
const MD_VIG = { cx: 80, cy: 50, rx: 64, ry: 34 }

export const qiusiBackground: Background = {
  id: 'hy103',
  drawBack(ctx) {
    sky(ctx, ['#a8acb4', '#b8b8b8', '#c8c2b4'], MD_GROUND)
    ridge(ctx, mdPeak, '#6a7464', '#76806e', 120, 300, MD_GROUND)
    ridge(ctx, (x) => 114 + 4 * Math.sin(x * 0.05), '#5a6650', '#66725a', 0, W, MD_GROUND)
    for (const x of MD_TREES) broadTree(ctx, x, MD_GROUND + 4, 1.1, { dark: '#4a4a2a', base: '#6a6a3a', light: '#8a7a4a' })
    px(ctx, 0, MD_GROUND + 4, W, H - MD_GROUND - 4, '#8a8462')
    for (let r = 0; r < 5; r++) px(ctx, 0, 140 + r * 9, W, 1, '#7a7452')
  },
  drawFront() {},
  drawDynamic() {},
}

const MD_WOOD = { x: 0, y: 92, w: 192, h: 54 }
const MD_PEAK_F = { x: 144, y: 40, w: 144, h: 81 }
const MD_FIELD = { x: 40, y: 132, w: 160, h: 48 }
const MD_VIG_F = { x: 8, y: 12, w: 144, h: 81 }

export const QIUSI_SPRITES = [
  sp('md_wet', '가을장마가 지난 온갖 나무', 12, MD_WOOD, (ctx, env) => {
    for (const x of MD_TREES) for (let k = 0; k < 3; k++) {
      const f = mod(env.t * 0.6 + k / 3 + hash(x), 1)
      dot(ctx, x - 6 + k * 6, MD_GROUND - 8 + f * 12, '#c8d8e0')
    }
    for (let k = 0; k < 6; k++) fillRows(ctx, 150 + k * 4, 153 + k * 4, (y) => [20 + k * 50 - (y - 150 - k * 4) * 3, 44 + k * 50 + (y - 150 - k * 4) * 3], '#9ab0b8')
  }),
  sp('md_snow', '눈 덮인 숲', 12, MD_WOOD, (ctx) => {
    for (const x of MD_TREES) px(ctx, x - 8, MD_GROUND - 12, 16, 3, '#f4f6f6')
  }),
  sp('md_bloom', '꽃 핀 숲', 12, MD_WOOD, (ctx) => {
    for (const x of MD_TREES) for (let k = 0; k < 4; k++) disc(ctx, x - 6 + k * 4, MD_GROUND - 10 + (k % 2) * 3, 1, '#f2b8c6')
  }),

  sp('md_glow', '외로운 산에 남은 저녁 햇빛', 8, MD_PEAK_F, (ctx) => {
    sun(ctx, 150, 104, 6, '#e8804a', '#f4b070')
    withAlpha(ctx, 0.5, () => {
      for (let x = 172; x < 212; x++) {
        const y = Math.round(mdPeak(x))
        px(ctx, x, y, 1, 10 + (x - 172) * 0.3, '#e8a060')
      }
    })
    withAlpha(ctx, 0.12, () => px(ctx, 0, 0, W, MD_GROUND, '#e8904a'))
  }),
  sp('md_moon', '둥근 달', 8, MD_PEAK_F, (ctx) => {
    withAlpha(ctx, 0.35, () => px(ctx, 0, 0, W, H, '#1a2038'))
    moon(ctx, 160, 40, 7)
  }),
  sp('md_fog', '짙은 안개', 8, MD_PEAK_F, (ctx, env) => mistBands(ctx, env.t, [70, 80, 90, 100], '#e8eaec', 0.7)),

  sp('md_empty', '거둘 것 없이 빈 전원', 20, MD_FIELD, (ctx, env) => {
    for (let r = 0; r < 4; r++) for (let c = 0; c < 18; c++) px(ctx, 44 + c * 9 + (r % 2) * 4, 142 + r * 9, 1, 2, '#6a6442')
    for (let k = 0; k < 4; k++) {
      const x = mod(hash(k) * 200 + env.t * 12, 200) + 40
      withAlpha(ctx, 0.35, () => px(ctx, x, 146 + k * 8, 12, 1, '#c8c4b0'))
    }
  }),
  sp('md_full', '넉넉한 곳간', 20, MD_FIELD, (ctx) => {
    for (let k = 0; k < 5; k++) fillRows(ctx, 140, 156, (y) => [60 + k * 28 - (y - 140) * 0.4, 72 + k * 28 + (y - 140) * 0.4], '#c8a848')
  }),
  sp('md_feast', '잔치', 20, MD_FIELD, (ctx, env) => {
    for (let k = 0; k < 5; k++) person(ctx, 80 + k * 16, 146 - (Math.sin(env.t * 4 + k) > 0 ? 1 : 0), OTHER_PALS[k % 4].R)
  }),

  sp('md_memory', '떠올린 나무꾼과 어부', 24, MD_VIG_F, (ctx, env) => vignette(ctx, MD_VIG.cx, MD_VIG.cy, MD_VIG.rx, MD_VIG.ry, (c) => {
    ridge(c, (x) => 36 + 8 * Math.sin(x * 0.08), '#a8b4a0', undefined, 16, 144, 60)
    px(c, 16, 58, 128, 26, '#a8c0c8')
    person(c, 40, 46, '#6e6450', { hat: '#a89567' })
    for (let k = 0; k < 3; k++) px(c, 34 + k, 44 + k * 2, 10, 1, '#8a6a48')
    boat(c, 104, 70, { len: 20 })
    person(c, 98, 59, '#6e6450', { hat: '#a89567' })
    for (let i = 0; i < 14; i++) dot(c, 101 + i, 62 + i * 0.3 + Math.sin(env.t + i) * 0.3, '#5a4632')
  })),
  sp('md_palace', '궁궐의 잔치', 24, MD_VIG_F, (ctx) => vignette(ctx, MD_VIG.cx, MD_VIG.cy, MD_VIG.rx, MD_VIG.ry, (c) => {
    px(c, 46, 40, 70, 22, '#b8352a')
    px(c, 40, 32, 82, 8, '#c89a3a')
  })),
  sp('md_exam', '과거 시험장', 24, MD_VIG_F, (ctx) => vignette(ctx, MD_VIG.cx, MD_VIG.cy, MD_VIG.rx, MD_VIG.ry, (c) => {
    for (let k = 0; k < 4; k++) {
      px(c, 30 + k * 26, 56, 16, 4, '#8a6a48')
      person(c, 36 + k * 26, 46, '#4b5068')
    }
  })),
]

// ════════════════════════════════════════════════════════════
// 馬戴〈贈道者〉: 구름 굴과 용담과 북두
// ════════════════════════════════════════════════════════════
const DD_CAVE = { x: 58, y: 96 }
const ddCliff = (y: number): [number, number] => [0, 120 - (y - 40) * 0.2 + Math.sin(y * 0.25) * 4]
const DD_POOL = { x: 232, y: 150 }
const DD_STARS: [number, number][] = [[118, 26], [130, 22], [142, 25], [151, 31], [154, 42], [167, 44], [170, 33]]

export const zengdaoBackground: Background = {
  id: 'hy104',
  drawBack(ctx) {
    sky(ctx, ['#0e1424', '#161e32', '#202a40'], 140)
    stars(ctx, 20, 121, 4, 90, 0, '#6a7088')
    ridge(ctx, (x) => 100 + 10 * Math.sin(x * 0.02 + 2), '#161c24', '#1e242e', 0, W, 150)
    px(ctx, 0, 140, W, 40, '#161c18')
    fillRows(ctx, 40, H, ddCliff, (y) => (y % 7 === 0 ? '#262a2a' : '#2e3232'))
    fillRows(ctx, DD_CAVE.y - 14, DD_CAVE.y + 4, (y) => {
      const d = (y - DD_CAVE.y - 4) / 18
      const w = 16 * Math.sqrt(Math.max(0, 1 - d * d))
      return [DD_CAVE.x - w, DD_CAVE.x + w]
    }, '#0a0c0e')
    fillRows(ctx, DD_POOL.y - 10, DD_POOL.y + 10, (y) => {
      const d = (y - DD_POOL.y) / 10
      const w = 50 * Math.sqrt(Math.max(0, 1 - d * d))
      return [DD_POOL.x - w, DD_POOL.x + w]
    }, '#14282a')
  },
  drawFront() {},
  drawDynamic() {},
}

const DD_CAVE_F = { x: 8, y: 64, w: 112, h: 63 }
const DD_POOL_F = { x: 168, y: 120, w: 128, h: 60 }
const DD_SKY = { x: 80, y: 4, w: 128, h: 72 }

export const ZENGDAO_SPRITES = [
  sp('dd_cave', '흰 구름 깃든 굴', 10, DD_CAVE_F, (ctx, env) => {
    withAlpha(ctx, 0.4 + Math.sin(env.t) * 0.05, () => disc(ctx, DD_CAVE.x, DD_CAVE.y - 4, 8, '#e8d8a0'))
    for (let k = 0; k < 7; k++) {
      const x = DD_CAVE.x - 30 + k * 10 + Math.sin(env.t * 0.3 + k) * 3
      const y = DD_CAVE.y - 20 + (k % 3) * 10
      fillRows(ctx, y - 4, y + 2, (yy) => {
        const d = (yy - y + 1) / 3.5
        const w = 9 * Math.sqrt(Math.max(0, 1 - d * d))
        return [x - w, x + w]
      }, (yy) => (yy < y - 1 ? '#f4f4f0' : '#d8dce0'))
    }
  }),
  sp('dd_mansion', '큰 저택', 10, DD_CAVE_F, (ctx) => {
    house(ctx, 30, 90)
    house(ctx, 58, 92)
  }),
  sp('dd_boat', '강 위의 배', 10, DD_CAVE_F, (ctx) => {
    px(ctx, 10, 118, 110, 8, '#2a3a50')
    boat(ctx, 60, 120, { len: 24 })
  }),

  sp('dd_scroll', '고요히 경전에 주석을 다는 도사', 20, DD_CAVE_F, (ctx) => {
    seatFig(ctx, DD_CAVE.x + 18, DD_CAVE.y - 12, DAOIST)
    px(ctx, DD_CAVE.x + 4, DD_CAVE.y, 14, 4, '#f0e8d0')
    for (let c = 0; c < 4; c++) dot(ctx, DD_CAVE.x + 6 + c * 3, DD_CAVE.y + 1, '#1f1d22')
  }),
  sp('dd_sword', '칼 가는 사람', 20, DD_CAVE_F, (ctx) => {
    seatFig(ctx, DD_CAVE.x + 18, DD_CAVE.y - 12, DAOIST)
    px(ctx, DD_CAVE.x + 2, DD_CAVE.y + 2, 16, 1, '#c8c8c8')
  }),
  sp('dd_net', '그물 깁는 사람', 20, DD_CAVE_F, (ctx) => {
    seatFig(ctx, DD_CAVE.x + 18, DD_CAVE.y - 12, DAOIST)
    for (let i = 0; i < 12; i += 3) for (let j = 0; j < 6; j += 3) dot(ctx, DD_CAVE.x + 2 + i, DD_CAVE.y - 2 + j, '#8a8a7a')
  }),

  sp('dd_pool', '용이 산다는 깊은 못', 14, DD_POOL_F, (ctx, env) => {
    for (let k = 0; k < 3; k++) {
      const r = 10 + mod(env.t * 0.4 + k / 3, 1) * 36
      for (let a = 0; a < 6.28; a += 0.2) dot(ctx, DD_POOL.x + Math.cos(a) * r, DD_POOL.y + Math.sin(a) * r * 0.2, '#3a6a6a')
    }
    withAlpha(ctx, 0.6, () => {
      for (let i = 0; i < 40; i++) {
        const t = i / 40
        dot(ctx, DD_POOL.x - 30 + t * 60, DD_POOL.y + Math.sin(t * 12 + env.t * 1.5) * 4, '#5a9a8a')
      }
    })
    for (let i = 0; i < 6; i++) dot(ctx, DD_POOL.x - 30 + i * 12, DD_POOL.y - 14 - (i % 2) * 4, '#a8acc4')
  }),
  sp('dd_market', '장터', 14, DD_POOL_F, (ctx) => {
    for (let k = 0; k < 3; k++) {
      px(ctx, 190 + k * 30, 140, 24, 3, ['#b2352a', '#d9a441', '#4f6b4a'][k])
      person(ctx, 198 + k * 30, 144, OTHER_PALS[k].R)
    }
  }),
  sp('dd_office', '관청', 14, DD_POOL_F, (ctx) => {
    px(ctx, 196, 132, 72, 22, '#8a8072')
    px(ctx, 192, 126, 80, 6, '#3c4048')
  }),

  sp('dd_dipper', '향 사르고 절하는 북두칠성', 26, DD_SKY, (ctx, env) => {
    DD_STARS.forEach(([x, y], i) => {
      withAlpha(ctx, 0.25, () => disc(ctx, x, y, 3, '#f4f0c8'))
      dot(ctx, x, y, '#ffffff')
      if (Math.sin(env.t * 2 + i) > 0.3) {
        dot(ctx, x - 1, y, '#f4f0c8')
        dot(ctx, x + 1, y, '#f4f0c8')
      }
    })
    const bx = DD_CAVE.x + 40
    const by = DD_CAVE.y + 2
    px(ctx, bx, by, 5, 3, '#8a6a3a')
    for (let k = 0; k < 3; k++) {
      const f = mod(env.t * 0.25 + k / 3, 1)
      withAlpha(ctx, 0.6 * (1 - f), () => dot(ctx, bx + 2 + Math.sin(f * 8 + k) * 3, by - 2 - f * 30, '#c8c8d0'))
    }
  }),
  sp('dd_sun', '떠오르는 해', 26, DD_SKY, (ctx) => {
    withAlpha(ctx, 0.3, () => px(ctx, 0, 60, W, 60, '#d8906a'))
    sun(ctx, 140, 90, 8, '#f0a050')
  }),
  sp('dd_rainbow', '무지개', 26, DD_SKY, (ctx) => {
    for (const [r, c] of [[44, '#c8504a'], [41, '#d8a040'], [38, '#7aa050'], [35, '#4a6ab0']] as const)
      for (let a = Math.PI; a < Math.PI * 2; a += 0.01) dot(ctx, 144 + Math.cos(a) * r, 80 + Math.sin(a) * r * 0.9, c)
  }),
]

// ════════════════════════════════════════════════════════════
// 溫庭筠〈碧澗驛曉思〉: 역참의 새벽과 뜰 가득한 살구꽃
// ════════════════════════════════════════════════════════════
const BJ_GROUND = 136
const BJ_WIN = { x: 60, y: 94, w: 30, h: 18 }
const BJ_TREES = [200, 236, 272, 302]
const BJ_VIG = { cx: 156, cy: 40, rx: 58, ry: 24 }

export const bijianBackground: Background = {
  id: 'hy105',
  drawBack(ctx) {
    sky(ctx, ['#4a5068', '#6a6a80', '#8a8494', '#a89c9c'], BJ_GROUND)
    ridge(ctx, (x) => 108 + 6 * Math.sin(x * 0.03), '#4a5058', '#545a62', 0, W, BJ_GROUND)
    px(ctx, 0, BJ_GROUND, W, H - BJ_GROUND, '#4a5244')
    px(ctx, 20, 80, 130, 56, '#8a8070')
    px(ctx, 14, 70, 142, 10, '#2a2e36')
    px(ctx, BJ_WIN.x, BJ_WIN.y, BJ_WIN.w, BJ_WIN.h, '#1e1a16')
    for (let x = BJ_WIN.x; x <= BJ_WIN.x + BJ_WIN.w; x += 6) px(ctx, x, BJ_WIN.y, 1, BJ_WIN.h, '#5a4632')
    for (const x of BJ_TREES) {
      px(ctx, x - 2, BJ_GROUND - 40, 4, 40, '#3a2e26')
      for (const [dx, dy] of [[-10, -36], [10, -40], [0, -44]] as const) for (let i = 0; i < 10; i++) dot(ctx, x + (dx * i) / 10, BJ_GROUND + dy + 10 - i, '#3a2e26')
    }
  },
  drawFront() {},
  drawDynamic() {},
}

const BJ_WIN_F = { x: 24, y: 72, w: 104, h: 58 }
const BJ_VIG_F = { x: 88, y: 8, w: 136, h: 64 }
const BJ_GARDEN = { x: 176, y: 72, w: 144, h: 81 }

export const BIJIAN_SPRITES = [
  sp('bj_lamp', '남은 꿈 곁의 향등', 20, BJ_WIN_F, (ctx, env) => {
    withAlpha(ctx, 0.7 + Math.sin(env.t * 4) * 0.05, () => px(ctx, BJ_WIN.x, BJ_WIN.y, BJ_WIN.w, BJ_WIN.h, '#e0b860'))
    for (let x = BJ_WIN.x; x <= BJ_WIN.x + BJ_WIN.w; x += 6) px(ctx, x, BJ_WIN.y, 1, BJ_WIN.h, '#5a4632')
    for (let k = 0; k < 3; k++) {
      const f = mod(env.t * 0.25 + k / 3, 1)
      withAlpha(ctx, 0.6 * (1 - f), () => dot(ctx, BJ_WIN.x + 22 + Math.sin(f * 7) * 2, BJ_WIN.y + 8 - f * 22, '#e8e4d8'))
    }
    withAlpha(ctx, 0.18, () => disc(ctx, BJ_WIN.x + 15, BJ_WIN.y + 9, 22, '#ffd27a'))
  }),
  sp('bj_dark', '꺼진 촛불', 20, BJ_WIN_F, (ctx) => {
    for (let k = 0; k < 3; k++) dot(ctx, BJ_WIN.x + 15, BJ_WIN.y - 2 - k * 3, '#8a8a8a')
  }),
  sp('bj_book', '펼친 책', 20, BJ_WIN_F, (ctx) => {
    withAlpha(ctx, 0.6, () => px(ctx, BJ_WIN.x, BJ_WIN.y, BJ_WIN.w, BJ_WIN.h, '#e0b860'))
    px(ctx, BJ_WIN.x + 10, BJ_WIN.y + 10, 10, 4, '#f4f0e0')
  }),

  sp('bj_far', '하늘 끝 먼 초나라', 22, BJ_VIG_F, (ctx) => vignette(ctx, BJ_VIG.cx, BJ_VIG.cy, BJ_VIG.rx, BJ_VIG.ry, (c) => {
    sky(c, ['#d8dce4', '#e4e4e0'], 64)
    ridge(c, (x) => 34 + 6 * Math.sin(x * 0.09), '#a8b8b0', undefined, 98, 214, 64)
    px(c, 98, 46, 116, 6, '#a8c4cc')
    for (let k = 0; k < 3; k++) hut(c, 120 + k * 26, 38)
  })),
  sp('bj_near', '문 바로 앞', 22, BJ_VIG_F, (ctx) => person(ctx, 160, 124, '#4b5068')),
  sp('bj_river', '강 건너', 22, BJ_VIG_F, (ctx) => px(ctx, 96, 60, 130, 6, '#6a8aa0')),

  sp('bj_cuckoo', '달 지고 그친 두견새 울음', 12, BJ_GARDEN, (ctx) => {
    withAlpha(ctx, 0.6, () => disc(ctx, 296, 104, 7, '#e8e4c8'))
    withAlpha(ctx, 0.15, () => disc(ctx, 296, 104, 14, '#fff7d6'))
    const x = BJ_TREES[1] + 6
    const y = BJ_GROUND - 42
    px(ctx, x, y, 6, 3, '#5a5a62')
    px(ctx, x + 5, y - 2, 3, 3, '#5a5a62')
    px(ctx, x - 4, y + 1, 4, 1, '#5a5a62')
  }),
  sp('bj_rooster', '해 뜨고 우는 닭', 12, BJ_GARDEN, (ctx, env) => {
    sun(ctx, 296, 112, 7, '#f4a050')
    px(ctx, 200, 128, 8, 6, '#e8e2d0')
    px(ctx, 206, 124, 4, 5, '#e8e2d0')
    px(ctx, 207, 122, 3, 2, '#c0302a')
    soundArcs(ctx, 212, 126, env.t * 2, '#e8e4d0', 12)
  }),
  sp('bj_rain', '쏟아지는 비', 12, BJ_GARDEN, (ctx, env) => rain(ctx, env.t, 60, 140, 'rgba(150,160,175,0.7)')),

  sp('bj_apricot', '뜰 가득한 산살구꽃', 24, BJ_GARDEN, (ctx, env) => {
    for (const x of BJ_TREES) for (let k = 0; k < 14; k++) {
      const a = hash(k * 2.1 + x) * 6.28
      const r = Math.sqrt(hash(k * 3.7 + x)) * 14
      disc(ctx, x + Math.cos(a) * r * 1.2, BJ_GROUND - 40 + Math.sin(a) * r * 0.7, 2, k % 3 ? '#f8e0e4' : '#f4b8c4')
    }
    for (let k = 0; k < 40; k++) dot(ctx, 180 + hash(k * 1.9) * 140, BJ_GROUND + 2 + hash(k * 2.7) * 40, k % 2 ? '#f8e0e4' : '#f4b8c4')
    drift(ctx, env.t, { x: 180, y: 80, w: 140, h: 60 }, 10, '#f8e0e4', 0.3, 4)
  }),
  sp('bj_leaves', '쌓인 낙엽', 24, BJ_GARDEN, (ctx) => {
    for (let k = 0; k < 40; k++) px(ctx, 180 + hash(k * 1.9) * 140, BJ_GROUND + 2 + hash(k * 2.7) * 40, 2, 1, '#a8662a')
  }),
  sp('bj_snow', '하얀 눈', 24, BJ_GARDEN, (ctx, env) => {
    withAlpha(ctx, 0.6, () => px(ctx, 170, BJ_GROUND, 150, H - BJ_GROUND, '#eef2f2'))
    snowfall(ctx, env.t, 40)
  }),
]

// ════════════════════════════════════════════════════════════
// 劉駕〈牧童〉: 손님에게 절하는 목동과 비바람 치는 앞 시내
// ════════════════════════════════════════════════════════════
const MT_GROUND = 136
const MT_BOY = { x: 150, y: MT_GROUND }
const MT_GUEST = { x: 114, y: MT_GROUND - 22 }

export const mutongBackground: Background = {
  id: 'hy106',
  drawBack(ctx) {
    sky(ctx, ['#b4c4cc', '#c4d0d2', '#d4dcd6'], MT_GROUND)
    ridge(ctx, (x) => 84 + 14 * Math.sin(x * 0.02 + 1.2), '#8aa08e', '#96ac9a', 0, W, MT_GROUND)
    px(ctx, 0, MT_GROUND, W, H - MT_GROUND, '#7e9a5e')
    fillRows(ctx, 148, H, (y) => [210 - (y - 148) * 1.2, W], '#8aa8b0')
    for (let t = 0; t <= 1; t += 0.006) px(ctx, 20 + t * 200, MT_GROUND + 4 + Math.sin(t * 5) * 3, 3, 1, '#c8b88a')
    standFig(ctx, MT_GUEST.x, MT_GUEST.y, pal())
  },
  drawFront() {},
  drawDynamic() {},
}

const MT_MEET = { x: 96, y: 96, w: 112, h: 63 }
const MT_OX = { x: 136, y: 104, w: 112, h: 63 }
const MT_STREAM = { x: 160, y: 72, w: 160, h: 108 }

/** 아이 (x 는 가운데, y 는 발) */
function child(ctx: Ctx, x: number, y: number, bow: boolean) {
  const c = '#8a6a3a'
  if (bow) {
    px(ctx, x - 3, y - 7, 6, 7, c)
    px(ctx, x - 6, y - 9, 4, 4, '#e6c39b')
    px(ctx, x - 6, y - 10, 3, 2, '#1f1d22')
  } else {
    px(ctx, x - 3, y - 9, 6, 9, c)
    px(ctx, x - 2, y - 13, 4, 4, '#e6c39b')
    px(ctx, x - 2, y - 14, 4, 2, '#1f1d22')
  }
}

export const MUTONG_SPRITES = [
  sp('mt_bow', '손님을 보고 절하는 목동', 22, MT_MEET, (ctx, env) => child(ctx, MT_BOY.x, MT_BOY.y, Math.sin(env.t * 1.5) > -0.3)),
  sp('mt_run', '도망치는 목동', 22, MT_MEET, (ctx, env) => child(ctx, MT_BOY.x + mod(env.t * 10, 40), MT_BOY.y, false)),
  sp('mt_flute', '피리 부는 목동', 22, MT_MEET, (ctx, env) => {
    child(ctx, MT_BOY.x, MT_BOY.y, false)
    px(ctx, MT_BOY.x + 2, MT_BOY.y - 11, 6, 1, '#c8b890')
    soundArcs(ctx, MT_BOY.x + 9, MT_BOY.y - 11, env.t, '#5d4a37', 10)
  }),

  sp('mt_fruit', '품속에서 떨어지는 산 열매', 24, MT_MEET, (ctx, env) => {
    for (let k = 0; k < 4; k++) {
      const f = mod(env.t * 0.5 + k / 4, 1)
      const x = MT_BOY.x - 4 + k * 3 + f * (k - 1.5) * 6
      const y = MT_BOY.y - 6 + Math.min(f * 2, 1) * 6 - Math.abs(Math.sin(f * 9)) * 3 * (1 - f)
      disc(ctx, x, y, 1, k % 2 ? '#c8302a' : '#e88a2a')
    }
  }),
  sp('mt_book', '떨어지는 책', 24, MT_MEET, (ctx) => px(ctx, MT_BOY.x - 4, MT_BOY.y - 3, 7, 3, '#f4f0e0')),
  sp('mt_bird', '날아가는 작은 새', 24, MT_MEET, (ctx, env) => bird(ctx, MT_BOY.x + mod(env.t * 10, 40), MT_BOY.y - 14 - mod(env.t * 6, 24), Math.floor(env.t * 6) % 2, '#5a4a3a')),

  sp('mt_ox', '한낮에 소를 몰아 돌아가는 목동', 20, MT_OX, (ctx, env) => {
    const s = Math.round(Math.sin(env.t * 2))
    px(ctx, 172 + s, MT_GROUND - 12, 26, 10, '#5a4a3a')
    px(ctx, 196 + s, MT_GROUND - 14, 8, 8, '#5a4a3a')
    px(ctx, 197 + s, MT_GROUND - 16, 2, 2, '#d8d4c8')
    px(ctx, 202 + s, MT_GROUND - 16, 2, 2, '#d8d4c8')
    for (const d of [174, 178, 192, 196]) px(ctx, d + s, MT_GROUND - 2, 2, 3, '#3a2e22')
    for (let i = 0; i < 18; i++) dot(ctx, MT_BOY.x + 4 + i, MT_BOY.y - 7 + i * 0.1, '#8a7a5a')
    sun(ctx, 150, 20, 7)
  }),
  sp('mt_sheep', '양 떼', 20, MT_OX, (ctx) => {
    for (let k = 0; k < 4; k++) disc(ctx, 176 + k * 12, MT_GROUND - 5, 4, '#f4f0e8')
  }),
  sp('mt_horse', '말', 20, MT_OX, (ctx) => {
    px(ctx, 176, MT_GROUND - 14, 20, 7, '#8a6a4a')
    px(ctx, 194, MT_GROUND - 20, 4, 8, '#8a6a4a')
  }),

  sp('mt_storm', '앞 시내의 사나운 비바람', 28, MT_STREAM, (ctx, env) => {
    for (const [x, y, w] of [[160, 20, 160], [200, 34, 120]] as const) px(ctx, x, y, w, 12, '#5a6068')
    ctx.save()
    ctx.beginPath()
    ctx.rect(150, 40, 170, 140)
    ctx.clip()
    rain(ctx, env.t, 90, 160, 'rgba(120,130,145,0.8)', 5, -2)
    ctx.restore()
    for (let k = 0; k < 14; k++) px(ctx, 220 + mod(hash(k) * 100 + env.t * 30, 100), 152 + hash(k * 3) * 26, 6, 1, '#e8f0f4')
  }, { wind: 0.9 }),
  sp('mt_calm', '잔잔한 시내', 28, MT_STREAM, (ctx, env) => shimmer(ctx, env.t, 152, 178, 8, '#e4eeee', 200, W)),
  sp('mt_ice', '꽁꽁 언 시내', 28, MT_STREAM, (ctx) => fillRows(ctx, 148, H, (y) => [210 - (y - 148) * 1.2, W], '#dce8ee')),
]

// ════════════════════════════════════════════════════════════
// 于武陵〈高樓〉: 달빛 받은 높은 누각
// ════════════════════════════════════════════════════════════
const GL_GROUND = 150
const GL_TOWER = { x: 150, top: 56 }
const GL_LADY = { x: 146, y: 54 }

function glTower(ctx: Ctx, lit: boolean) {
  const { x, top } = GL_TOWER
  for (let k = 0; k < 3; k++) {
    const y = top + k * 30
    const w = 34 + k * 8
    px(ctx, x - w / 2, y + 6, w, 24, lit ? (k % 2 ? '#b8a070' : '#c8b080') : k % 2 ? '#3a3228' : '#443a2e')
    px(ctx, x - w / 2 - 6, y + 2, w + 12, 4, lit ? '#6a6a70' : '#1e1e24')
    px(ctx, x - w / 2 - 2, y, w + 4, 2, lit ? '#7a7a80' : '#26262c')
  }
  px(ctx, x - 22, top + 4, 44, 1, lit ? '#d8c890' : '#5a4a3a')
  for (let c = -21; c < 22; c += 4) px(ctx, x + c, top + 4, 1, 4, lit ? '#d8c890' : '#5a4a3a')
}

export const gaolouBackground: Background = {
  id: 'hy107',
  drawBack(ctx) {
    sky(ctx, ['#121828', '#1a2236', '#242c42'], GL_GROUND)
    stars(ctx, 16, 131, 4, 60, 0, '#8a90a8')
    ridge(ctx, (x) => 116 + 8 * Math.sin(x * 0.02 + 2), '#161c24', '#1e242e', 0, W, GL_GROUND)
    px(ctx, 0, GL_GROUND, W, H - GL_GROUND, '#1a201c')
    glTower(ctx, false)
    for (let k = 0; k < 4; k++) broadTree(ctx, 220 + k * 24, GL_GROUND, 1.3, { dark: '#121a14', base: '#18221a', light: '#202c22' })
  },
  drawFront() {},
  drawDynamic() {},
}

const GL_SKY = { x: 0, y: 24, w: 128, h: 72 }
const GL_TOWER_F = { x: 72, y: 44, w: 160, h: 110 }
const GL_TOP = { x: 104, y: 24, w: 96, h: 54 }

export const GAOLOU_SPRITES = [
  sp('gl_moon', '먼 하늘에 뜬 밝은 달', 6, GL_SKY, (ctx) => moon(ctx, 44, 64, 10)),
  sp('gl_sun', '한낮의 해', 6, GL_SKY, (ctx) => {
    sky(ctx, ['#a8c4dc', '#bcd2e2'], 116)
    sun(ctx, 44, 54, 9)
  }),
  sp('gl_meteor', '별똥별', 6, GL_SKY, (ctx, env) => {
    const f = mod(env.t * 0.5, 1)
    for (let i = 0; i < 10; i++) withAlpha(ctx, 1 - i / 10, () => dot(ctx, 20 + f * 90 - i * 2, 40 + f * 30 - i, '#f4f0c8'))
  }),

  sp('gl_tower', '달빛 받은 누각', 14, GL_TOWER_F, (ctx) => {
    glTower(ctx, true)
    withAlpha(ctx, 0.12, () => fillRows(ctx, 64, GL_GROUND, (y) => [44 + (y - 64) * 0.6, 80 + (y - 64) * 1.2], '#f4ecc8'))
  }),
  sp('gl_bridge', '달빛 받은 다리', 14, GL_TOWER_F, (ctx) => {
    for (let a = 0; a <= Math.PI; a += 0.02) px(ctx, 230 - Math.cos(a) * 30, GL_GROUND - Math.sin(a) * 8, 3, 3, '#c8b890')
  }),
  sp('gl_boat', '달빛 받은 배', 14, GL_TOWER_F, (ctx) => {
    px(ctx, 180, GL_GROUND + 4, 120, 10, '#2a3a50')
    boat(ctx, 240, GL_GROUND + 8, { len: 24, hull: '#a89060' })
  }),

  sp('gl_lady', '누각 위 비단옷 입은 사람', 22, GL_TOP, (ctx) => lady(ctx, GL_LADY.x, GL_LADY.y - 14, '#d8a0b8')),
  sp('gl_soldier', '창 든 병사', 22, GL_TOP, (ctx) => {
    person(ctx, GL_LADY.x, GL_LADY.y - 8, '#6a3a2a', { hat: '#4a4a52' })
    px(ctx, GL_LADY.x + 3, GL_LADY.y - 18, 1, 16, '#8a8478')
  }),
  sp('gl_bird', '앉은 새', 22, GL_TOP, (ctx) => px(ctx, GL_LADY.x, GL_LADY.y - 2, 5, 3, '#4a4a52')),

  sp('gl_wind', '쉬지 않는 서늘한 바람', 26, GL_TOP, (ctx, env) => {
    for (let k = 0; k < 2; k++)
      for (let i = 0; i < 16; i++) dot(ctx, GL_LADY.x + 6 + i * 1.2, GL_LADY.y - 10 + k * 3 + Math.sin(env.t * 6 - i * 0.5 + k) * (i / 5), k ? '#e8c048' : '#f4d0dc')
    for (let k = 0; k < 6; k++) withAlpha(ctx, 0.35, () => px(ctx, mod(hash(k) * 300 + env.t * 50, 330) - 10, 30 + k * 12, 16, 1, '#8a94b0'))
    drift(ctx, env.t, { x: 120, y: 40, w: 160, h: 80 }, 6, '#6a5a3a', 1, 3)
  }, { wind: 0.8 }),
  sp('gl_rain', '쏟아지는 비', 26, GL_TOP, (ctx, env) => rain(ctx, env.t, 70, 140, 'rgba(120,130,150,0.7)')),
  sp('gl_still', '바람 한 점 없는 밤', 26, GL_TOP, (ctx) => withAlpha(ctx, 0.4, () => px(ctx, GL_LADY.x - 20, GL_LADY.y + 6, 50, 1, '#8a94b0'))),
]

