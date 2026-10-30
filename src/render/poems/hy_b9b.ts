// 『唐詩畫意』 卷九 다섯째 묶음 (2): 唐彥謙〈小院〉, 韓偓〈效崔國輔體〉 두 수, 太上隱者〈答人〉, 宣宗宮人〈題紅葉〉
import type { Background } from '../types'
import { H, W, disc, dot, fillRows, hash, mod, px } from '../pixel'
import type {  } from '../pixel'
import { AUTUMN, bamboo, bird, boat, broadTree, house, moon, person, pine, rain, ridge, sky, snowfall, stars, withAlpha } from '../kit'
import { OTHER_PALS, pal, seatFig, standFig } from '../figures'
import { drift, soundArcs, sp, stone, sun } from './hy_kit'
import { lady } from './hy_b4a'

const FULL = { x: 0, y: 0, w: 320, h: 180 }

// ════════════════════════════════════════════════════════════
// 唐彥謙〈小院〉: 사람 없는 작은 뜰의 달밤
// ════════════════════════════════════════════════════════════
const XY_GROUND = 132
const XY_GATE = { x: 248, y: 104, w: 30, h: 28 }

export const xiaoyuanBackground: Background = {
  id: 'hy113',
  drawBack(ctx) {
    sky(ctx, ['#121828', '#1a2236', '#242c42'], XY_GROUND)
    stars(ctx, 14, 141, 4, 60, 0, '#8a90a8')
    // 담
    px(ctx, 0, 100, W, 32, '#4a4640')
    px(ctx, 0, 96, W, 4, '#2a2a30')
    px(ctx, 0, XY_GROUND, W, H - XY_GROUND, '#3a3a36')
    // 툇마루 있는 집 (왼쪽)
    px(ctx, 8, 86, 116, 46, '#5a5246')
    px(ctx, 2, 76, 128, 10, '#24262c')
    px(ctx, 8, 128, 116, 4, '#6a5a44')
    // 문
    px(ctx, XY_GATE.x - 4, XY_GATE.y - 6, XY_GATE.w + 8, 6, '#24262c')
    px(ctx, XY_GATE.x, XY_GATE.y, XY_GATE.w, XY_GATE.h, '#2a2218')
  },
  drawFront() {},
  drawDynamic() {},
}

const XY_YARD = { x: 112, y: 96, w: 144, h: 81 }
const XY_SKY = { x: 64, y: 8, w: 192, h: 90 }
const XY_PORCH = { x: 0, y: 84, w: 128, h: 72 }
const XY_GATE_F = { x: 208, y: 84, w: 112, h: 63 }

export const XIAOYUAN_SPRITES = [
  sp('xy_empty', '사람 하나 없는 작은 뜰', 12, XY_YARD, (ctx, env) => {
    px(ctx, 180, 120, 8, 12, '#6a6458')
    px(ctx, 176, 116, 16, 4, '#5a5448')
    px(ctx, 182, 122, 4, 4, '#3a342c')
    drift(ctx, env.t * 0.5, { x: 130, y: 130, w: 100, h: 40 }, 6, '#6a5a3a', 0.2, 3)
  }),
  sp('xy_guests', '손님 북적이는 뜰', 12, XY_YARD, (ctx, env) => {
    for (let k = 0; k < 5; k++) person(ctx, 140 + k * 18, 140 - (Math.sin(env.t * 3 + k) > 0.6 ? 1 : 0), OTHER_PALS[k % 4].R)
  }),
  sp('xy_kids', '뛰노는 아이들', 12, XY_YARD, (ctx, env) => {
    for (let k = 0; k < 3; k++) person(ctx, 150 + k * 22, 144 - Math.abs(Math.sin(env.t * 4 + k)) * 4, OTHER_PALS[k].R)
  }),

  sp('xy_moon', '안개 비끼고 밝아지는 달', 6, XY_SKY, (ctx, env) => {
    const a = 0.6 + Math.min(1, mod(env.t * 0.1, 2)) * 0.4
    withAlpha(ctx, a, () => moon(ctx, 170, 40, 9))
    withAlpha(ctx, 0.5, () => {
      for (let k = 0; k < 5; k++) {
        const x = mod(hash(k) * 300 + env.t * 4, 340) - 20
        for (let i = 0; i < 50; i++) dot(ctx, x + i, 30 + k * 10 + i * 0.3, '#a8b0c8')
      }
    })
  }),
  sp('xy_sun', '떠오르는 해', 6, XY_SKY, (ctx) => {
    sky(ctx, ['#3a3a5a', '#8a6a6a', '#d8906a'], 96)
    sun(ctx, 170, 80, 8, '#f0a050')
  }),
  sp('xy_rain', '내리는 비', 6, XY_SKY, (ctx, env) => rain(ctx, env.t, 60, 140, 'rgba(140,150,170,0.6)')),

  sp('xy_sad', '맑은 밤 쉽게 서글퍼진 사람', 22, XY_PORCH, (ctx, env) => {
    seatFig(ctx, 60, 112, pal())
    const f = mod(env.t * 0.3, 1)
    withAlpha(ctx, 0.6 * (1 - f), () => {
      for (let i = 0; i < 6; i++) dot(ctx, 74 + i + f * 6, 116 - f * 8 + Math.sin(i) * 1, '#c8d0e0')
    })
  }),
  sp('xy_dance', '춤추는 사람', 22, XY_PORCH, (ctx, env) => standFig(ctx, 60 + Math.sin(env.t * 3) * 4, 106, pal())),
  sp('xy_sleep', '잠든 사람', 22, XY_PORCH, (ctx, env) => {
    px(ctx, 50, 124, 24, 4, '#4b5068')
    px(ctx, 74, 123, 4, 4, '#e6c39b')
    for (let k = 0; k < 3; k++) {
      const f = mod(env.t * 0.4 + k / 3, 1)
      withAlpha(ctx, 1 - f, () => px(ctx, 80 + f * 6 + k * 2, 118 - f * 10 - k * 3, 3, 1, '#8a94b0'))
    }
  }),

  sp('xy_gate', '떠나는 이 없는 빈 문', 24, XY_GATE_F, (ctx) => {
    px(ctx, XY_GATE.x, XY_GATE.y, XY_GATE.w, XY_GATE.h, '#46505e')
    withAlpha(ctx, 0.5, () => fillRows(ctx, XY_GATE.y + 14, XY_GATE.y + XY_GATE.h, (y) => [XY_GATE.x + 12 - (y - XY_GATE.y - 14) * 0.3, XY_GATE.x + 18 + (y - XY_GATE.y - 14) * 0.3], '#8a8478'))
    px(ctx, XY_GATE.x - 2, XY_GATE.y, 3, XY_GATE.h, '#5a4632')
    px(ctx, XY_GATE.x + XY_GATE.w - 1, XY_GATE.y, 3, XY_GATE.h, '#5a4632')
  }),
  sp('xy_boat', '떠나는 배', 24, XY_GATE_F, (ctx) => boat(ctx, 280, 150, { len: 24 })),
  sp('xy_rider', '말 탄 나그네', 24, XY_GATE_F, (ctx) => {
    px(ctx, 240, 136, 18, 7, '#6a4a32')
    person(ctx, 246, 126, '#4b5068')
  }),
]

// ════════════════════════════════════════════════════════════
// 韓偓〈效崔國輔體〉 其一: 달빛 뜰의 해당화와 그네
// ════════════════════════════════════════════════════════════
const HO_GROUND = 134
const HO_TREE = { x: 62, y: HO_GROUND }
const HO_STEPS = [0, 1, 2].map((k) => ({ x: 128 - k * 8, y: 134 + k * 6, w: 72 + k * 16 }))
const HO_LADY = { x: 156, y: 112 }
const HO_SWING = { x: 266, top: 92 }
const HO_BLOOMS = Array.from({ length: 22 }, (_, i) => ({ x: HO_TREE.x - 28 + hash(i * 2.1) * 56, y: HO_TREE.y - 66 + hash(i * 3.3) * 32 }))

export const xiaocui1Background: Background = {
  id: 'hy114',
  drawBack(ctx) {
    sky(ctx, ['#1e2440', '#2a3050', '#383e5a'], HO_GROUND)
    stars(ctx, 12, 151, 4, 60, 0, '#a8acc4')
    px(ctx, 0, HO_GROUND, W, H - HO_GROUND, '#3e4040')
    for (const s of HO_STEPS) {
      px(ctx, s.x, s.y, s.w, 5, '#6a6862')
      px(ctx, s.x, s.y, s.w, 1, '#7a7872')
    }
    px(ctx, HO_TREE.x - 3, HO_TREE.y - 46, 6, 46, '#3a2e26')
    for (const b of HO_BLOOMS) disc(ctx, b.x, b.y, 4, '#2e4a34')
    for (const dx of [-14, 14]) px(ctx, HO_SWING.x + dx, HO_SWING.top, 2, HO_GROUND - HO_SWING.top, '#5a3a2a')
    px(ctx, HO_SWING.x - 16, HO_SWING.top - 2, 34, 3, '#5a3a2a')
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    const a = env.fx.hoSwing ? Math.sin(env.t * 1.6) * 0.35 : 0
    const len = 30
    const sx = HO_SWING.x + 1 + Math.sin(a) * len
    const sy = HO_SWING.top + Math.cos(a) * len
    for (const dx of [-5, 5]) for (let i = 0; i < len; i++) dot(ctx, HO_SWING.x + 1 + dx + (Math.sin(a) * len * i) / len, HO_SWING.top + (Math.cos(a) * len * i) / len, '#8a7a5a')
    px(ctx, sx - 6, sy, 12, 2, '#6a4a32')
  },
}

const HO_SKY = { x: 64, y: 8, w: 192, h: 108 }
const HO_TREE_F = { x: 8, y: 56, w: 112, h: 90 }
const HO_STEP_F = { x: 112, y: 92, w: 96, h: 54 }
const HO_SWING_F = { x: 216, y: 76, w: 96, h: 72 }

export const XIAOCUI1_SPRITES = [
  sp('ho_moon', '뜰 가운데를 비추는 엷은 달빛', 6, HO_SKY, (ctx) => {
    withAlpha(ctx, 0.7, () => moon(ctx, 180, 36, 8))
    withAlpha(ctx, 0.15, () => fillRows(ctx, HO_GROUND, H, (y) => [120 - (y - HO_GROUND) * 0.4, 230 + (y - HO_GROUND) * 0.4], '#c8d0e0'))
  }),
  sp('ho_lamp', '등불', 6, HO_SKY, (ctx, env) => {
    px(ctx, 220, 110, 4, 6, '#e04a3a')
    withAlpha(ctx, 0.3 + Math.sin(env.t * 4) * 0.05, () => disc(ctx, 222, 113, 10, '#ffd27a'))
  }),
  sp('ho_sun', '한낮 햇살', 6, HO_SKY, (ctx) => {
    sky(ctx, ['#a8c4dc', '#bcd2e2'], 100)
    sun(ctx, 180, 36, 8)
  }),

  sp('ho_petals', '절로 지는 해당화', 20, HO_TREE_F, (ctx, env) => {
    for (const b of HO_BLOOMS) {
      dot(ctx, b.x, b.y, '#f4a8b8')
      dot(ctx, b.x + 2, b.y + 1, '#e88aa0')
    }
    for (let i = 0; i < 12; i++) {
      const f = mod(hash(i * 2.3) + env.t * 0.06, 1)
      px(ctx, HO_TREE.x - 26 + hash(i) * 52 + Math.sin(env.t + i) * 3, HO_TREE.y - 56 + f * 58, 2, 1, '#f4a8b8')
    }
  }),
  sp('ho_bloom', '활짝 핀 꽃', 20, HO_TREE_F, (ctx) => {
    for (const b of HO_BLOOMS) disc(ctx, b.x, b.y, 2, '#f4a8b8')
  }),
  sp('ho_cut', '꺾인 가지', 20, HO_TREE_F, (ctx) => {
    for (let i = 0; i < 14; i++) dot(ctx, HO_TREE.x + 10 + i, HO_TREE.y - 2 - (i % 3), '#3a2e26')
  }),

  sp('ho_lady', '홀로 서서 섬돌을 굽어보는 여인', 24, HO_STEP_F, (ctx) => {
    lady(ctx, HO_LADY.x, HO_LADY.y, '#c8a0c0')
    withAlpha(ctx, 0.25, () => px(ctx, HO_LADY.x - 3, HO_LADY.y + 18, 12, 2, '#000000'))
  }),
  sp('ho_two', '함께 걷는 두 사람', 24, HO_STEP_F, (ctx) => {
    lady(ctx, HO_LADY.x - 8, HO_LADY.y, '#c8a0c0')
    lady(ctx, HO_LADY.x + 8, HO_LADY.y, '#7aa0c8')
  }),
  sp('ho_sew', '앉아서 수놓는 여인', 24, HO_STEP_F, (ctx) => {
    lady(ctx, HO_LADY.x, HO_LADY.y + 4, '#c8a0c0', 'sit')
    px(ctx, HO_LADY.x + 8, HO_LADY.y + 12, 6, 4, '#f4f0e0')
  }),

  sp('ho_swing', '바람이 흔드는 그네 줄', 22, HO_SWING_F, (ctx, env) => {
    for (let k = 0; k < 4; k++) withAlpha(ctx, 0.35, () => px(ctx, mod(hash(k) * 200 + env.t * 40, 160) + 200, 100 + k * 9, 14, 1, '#a8b0c8'))
  }, { fx: { hoSwing: 1 }, wind: 0.5 }),
  sp('ho_chime', '처마 풍경', 22, HO_SWING_F, (ctx, env) => {
    px(ctx, 240, 96, 3, 4, '#8a7a3a')
    soundArcs(ctx, 241, 98, env.t, '#a8b0c8', 10)
  }),
  sp('ho_flag', '깃발', 22, HO_SWING_F, (ctx, env) => {
    px(ctx, 300, 90, 1, 40, '#5a4632')
    px(ctx, 301, 90 + Math.round(Math.sin(env.t * 3)), 10, 5, '#a8382a')
  }),
]

// ════════════════════════════════════════════════════════════
// 韓偓〈效崔國輔體〉 其二: 이끼 낀 뜰과 앵무새
// ════════════════════════════════════════════════════════════
const H2_GROUND = 130
const H2_STEPS = [0, 1, 2].map((k) => ({ x: 120 - k * 8, y: 130 + k * 6, w: 80 + k * 16 }))
const H2_LADY = { x: 52, y: 108 }
const H2_TREE = { x: 214, y: H2_GROUND }

export const xiaocui2Background: Background = {
  id: 'hy115',
  drawBack(ctx) {
    sky(ctx, ['#b8bcc4', '#c4c4c4', '#d0ccc0'], H2_GROUND)
    // 누각 (오른쪽)
    px(ctx, 240, 74, 70, 56, '#8a3a2a')
    px(ctx, 234, 66, 82, 8, '#3c4048')
    for (let x = 244; x < 310; x += 12) px(ctx, x, 76, 2, 54, '#c89a3a')
    // 툇마루 (왼쪽)
    px(ctx, 0, 90, 100, 40, '#d8d0bc')
    px(ctx, 0, 82, 106, 8, '#3c4048')
    px(ctx, 0, 126, 100, 4, '#8a6a48')
    px(ctx, 0, H2_GROUND, W, H - H2_GROUND, '#7a7a62')
    for (const s of H2_STEPS) {
      px(ctx, s.x, s.y, s.w, 5, '#a8a294')
      px(ctx, s.x, s.y, s.w, 1, '#bcb6a8')
    }
    px(ctx, H2_TREE.x - 2, H2_TREE.y - 48, 4, 48, '#4a3426')
    lady(ctx, H2_LADY.x, H2_LADY.y, '#a8889a', 'sit')
  },
  drawFront() {},
  drawDynamic() {},
}

const H2_YARD = { x: 96, y: 112, w: 160, h: 68 }
const H2_TREE_F = { x: 176, y: 56, w: 128, h: 72 }
const H2_STEP_F = { x: 96, y: 96, w: 128, h: 72 }
const H2_LADY_F = { x: 16, y: 88, w: 96, h: 54 }

export const XIAOCUI2_SPRITES = [
  sp('h2_moss', '비 온 뒤 푸른 이끼 낀 뜰', 10, H2_YARD, (ctx) => {
    for (let k = 0; k < 70; k++) px(ctx, 96 + hash(k * 1.9) * 220, H2_GROUND + 2 + hash(k * 2.9) * 46, 2 + (k % 3), 1, k % 2 ? '#5a8a4a' : '#7aa85a')
    for (let k = 0; k < 4; k++) fillRows(ctx, 152 + k * 6, 155 + k * 6, (y) => [120 + k * 40 - (y - 152 - k * 6) * 3, 140 + k * 40 + (y - 152 - k * 6) * 3], '#9ab0b8')
  }),
  sp('h2_snow', '쌓인 눈', 10, H2_YARD, (ctx) => withAlpha(ctx, 0.7, () => px(ctx, 96, H2_GROUND, 224, 50, '#eef2f2'))),
  sp('h2_petals', '흩어진 꽃잎', 10, H2_YARD, (ctx) => {
    for (let k = 0; k < 40; k++) px(ctx, 96 + hash(k * 1.9) * 220, H2_GROUND + 2 + hash(k * 2.9) * 46, 2, 1, '#f4a8b8')
  }),

  sp('h2_maple', '서리 맞은 붉은 잎의 누각', 14, H2_TREE_F, (ctx, env) => {
    for (let k = 0; k < 14; k++) disc(ctx, H2_TREE.x - 22 + hash(k * 2.1) * 44, H2_TREE.y - 70 + hash(k * 3.3) * 28, 5, k % 3 ? '#c8402a' : '#e8703a')
    for (let k = 0; k < 10; k++) dot(ctx, H2_TREE.x - 20 + hash(k * 4.1) * 40, H2_TREE.y - 72 + hash(k * 5.3) * 28, '#f4f0f0')
    drift(ctx, env.t, { x: 190, y: 80, w: 60, h: 50 }, 4, '#c8402a', 0.2, 2)
  }),
  sp('h2_vine', '푸른 덩굴', 14, H2_TREE_F, (ctx) => {
    for (let k = 0; k < 10; k++) disc(ctx, H2_TREE.x - 20 + hash(k * 2.1) * 40, H2_TREE.y - 66 + hash(k * 3.3) * 24, 4, '#4a8a3a')
  }),
  sp('h2_lantern', '걸린 등불', 14, H2_TREE_F, (ctx) => {
    for (let k = 0; k < 4; k++) px(ctx, 246 + k * 16, 78, 4, 6, '#e04a3a')
  }),

  sp('h2_sunbeam', '한가한 섬돌에 오르는 비낀 햇살', 20, H2_STEP_F, (ctx, env) => {
    withAlpha(ctx, 0.35 + Math.sin(env.t * 0.5) * 0.05, () => fillRows(ctx, 96, 150, (y) => [180 - (y - 96) * 1.2, 220 - (y - 96) * 0.6], '#f4d490'))
    sun(ctx, 300, 96, 6, '#f0a050', '#f4c080')
  }),
  sp('h2_moon', '달빛', 20, H2_STEP_F, (ctx) => {
    withAlpha(ctx, 0.35, () => px(ctx, 0, 0, W, H, '#1a2038'))
    moon(ctx, 180, 30, 7)
  }),
  sp('h2_rain', '빗물', 20, H2_STEP_F, (ctx, env) => rain(ctx, env.t, 60, 140, 'rgba(150,160,175,0.6)')),

  sp('h2_parrot', '시름과 짝하는 앵무새', 24, H2_LADY_F, (ctx, env) => {
    const x = H2_LADY.x + 22
    const y = H2_LADY.y + 2
    px(ctx, x - 6, y + 10, 14, 1, '#8a6a48')
    px(ctx, x + 1, y + 11, 1, 10, '#8a6a48')
    px(ctx, x - 1, y + 2, 5, 8, '#4aa84a')
    px(ctx, x, y, 4, 3, '#4aa84a')
    dot(ctx, x + 4, y + 1, '#d8a040')
    dot(ctx, x + 2, y, '#1f1d22')
    px(ctx, x - 1, y + 9, 2, 4, '#c8402a')
    if (Math.sin(env.t * 1.5) > 0.6) soundArcs(ctx, x + 5, y + 1, env.t, '#5d4a37', 8)
  }),
  sp('h2_cat', '고양이', 24, H2_LADY_F, (ctx) => {
    px(ctx, H2_LADY.x + 20, H2_LADY.y + 10, 10, 5, '#8a8a8a')
    px(ctx, H2_LADY.x + 28, H2_LADY.y + 7, 5, 4, '#8a8a8a')
  }),
  sp('h2_crane', '학', 24, H2_LADY_F, (ctx) => {
    px(ctx, H2_LADY.x + 24, H2_LADY.y + 4, 6, 4, '#f6f4ee')
    px(ctx, H2_LADY.x + 28, H2_LADY.y - 4, 2, 8, '#f6f4ee')
    dot(ctx, H2_LADY.x + 29, H2_LADY.y - 5, '#d83a2a')
  }),
]

// ════════════════════════════════════════════════════════════
// 太上隱者〈答人〉: 소나무 아래 돌베개
// ════════════════════════════════════════════════════════════
const TA_GROUND = 138
const TA_TREE = { x: 150, y: TA_GROUND }
const taPeak = (x: number) => 60 + Math.abs(Math.sin(x * 0.022 + 0.3)) * 36

export const darenBackground: Background = {
  id: 'hy116',
  drawBack(ctx) {
    sky(ctx, ['#c0ccd4', '#ccd6d8', '#d8dcd6'], TA_GROUND)
    ridge(ctx, taPeak, '#8a9e94', '#96aaa0', 0, W, TA_GROUND)
    ridge(ctx, (x) => 108 + 8 * Math.sin(x * 0.03), '#7a9072', '#86a07e', 0, W, TA_GROUND)
    px(ctx, 0, TA_GROUND, W, H - TA_GROUND, '#7e9462')
  },
  drawFront() {},
  drawDynamic() {},
}

const TA_TREE_F = { x: 80, y: 56, w: 144, h: 90 }
const TA_SLEEP = { x: 112, y: 116, w: 96, h: 54 }

export const DAREN_SPRITES = [
  sp('ta_pine', '우연히 와 앉은 소나무 아래', 12, TA_TREE_F, (ctx, env) => pine(ctx, TA_TREE.x, TA_TREE.y, 2.8, Math.sin(env.t * 0.6) * 1.5)),
  sp('ta_willow', '버드나무 아래', 12, TA_TREE_F, (ctx, env) => {
    px(ctx, TA_TREE.x - 2, TA_TREE.y - 60, 4, 60, '#5a4632')
    for (let k = 0; k < 16; k++) for (let i = 0; i < 36; i++) dot(ctx, TA_TREE.x - 24 + k * 3 + Math.sin(env.t + i * 0.2), TA_TREE.y - 64 + i + Math.abs(k - 8), '#8aa860')
  }),
  sp('ta_bamboo', '대숲 속', 12, TA_TREE_F, (ctx, env) => {
    for (let k = 0; k < 10; k++) bamboo(ctx, TA_TREE.x - 40 + k * 9, TA_TREE.y, 60 + (k % 3) * 10, Math.sin(env.t + k), env.t)
  }),

  sp('ta_stone', '돌을 높이 베고 잠든 은자', 22, TA_SLEEP, (ctx, env) => {
    stone(ctx, TA_TREE.x + 30, TA_GROUND, 5, '#a8a49a', '#7e7a70')
    px(ctx, TA_TREE.x - 2, TA_GROUND - 6, 28, 5, '#d8dce4')
    px(ctx, TA_TREE.x + 24, TA_GROUND - 9, 5, 5, '#e6c39b')
    px(ctx, TA_TREE.x + 24, TA_GROUND - 10, 5, 2, '#d8d4c8')
    for (let k = 0; k < 3; k++) {
      const f = mod(env.t * 0.35 + k / 3, 1)
      withAlpha(ctx, 1 - f, () => px(ctx, TA_TREE.x + 32 + f * 6 + k * 2, TA_GROUND - 14 - f * 10 - k * 3, 3, 1, '#4a5a6a'))
    }
  }),
  sp('ta_book', '책을 베고 잠듦', 22, TA_SLEEP, (ctx) => {
    px(ctx, TA_TREE.x + 24, TA_GROUND - 4, 8, 4, '#f4f0e0')
    px(ctx, TA_TREE.x - 2, TA_GROUND - 6, 28, 5, '#d8dce4')
  }),
  sp('ta_pillow', '비단 베개', 22, TA_SLEEP, (ctx) => {
    px(ctx, TA_TREE.x + 24, TA_GROUND - 4, 8, 4, '#c8402a')
    px(ctx, TA_TREE.x - 2, TA_GROUND - 6, 28, 5, '#d8dce4')
  }),

  sp('ta_seasons', '달력 없이 저절로 바뀌는 계절', 26, FULL, (ctx, env) => {
    const ph = mod(env.t * 0.08, 3)
    const c = ph < 1 ? '#f4b8c8' : ph < 2 ? '#c8662a' : '#f4f6f6'
    for (let i = 0; i < 22; i++) {
      const f = mod(hash(i * 2.3) + env.t * 0.05, 1)
      const x = mod(hash(i * 1.7) * W + f * 60 + Math.sin(env.t + i) * 4, W)
      px(ctx, x, f * TA_GROUND, ph < 2 ? 2 : 1, 1, c)
    }
  }),
  sp('ta_market', '장터', 26, FULL, (ctx) => {
    for (let k = 0; k < 3; k++) {
      px(ctx, 220 + k * 28, 130, 22, 3, ['#b2352a', '#d9a441', '#4f6b4a'][k])
      person(ctx, 228 + k * 28, 133, OTHER_PALS[k].R)
    }
  }),
  sp('ta_office', '관청', 26, FULL, (ctx) => {
    px(ctx, 220, 116, 70, 22, '#8a8072')
    px(ctx, 216, 110, 78, 6, '#3c4048')
  }),

  sp('ta_spring', '추위 다해 모르는 사이 온 봄', 14, FULL, (ctx, env) => {
    for (let x = 0; x < W; x++) {
      const y = Math.round(taPeak(x))
      if (y < 74) px(ctx, x, y, 1, Math.max(0, 74 - y), '#f4f6f6')
    }
    for (let k = 0; k < 30; k++) dot(ctx, hash(k * 1.9) * W, TA_GROUND + 2 + hash(k * 2.7) * 40, '#a8d07a')
    for (let k = 0; k < 6; k++) {
      const x = 20 + k * 54
      if (Math.abs(x - TA_TREE.x) < 30) continue
      px(ctx, x, TA_GROUND - 18, 2, 18, '#4a3426')
      for (let i = 0; i < 8; i++) disc(ctx, x - 6 + hash(i + k) * 14, TA_GROUND - 22 + hash(i * 3 + k) * 8, 1, '#f8e0e8')
    }
    withAlpha(ctx, 0.2 + Math.sin(env.t * 0.3) * 0.05, () => px(ctx, 0, 0, W, TA_GROUND, '#fff4e8'))
  }),
  sp('ta_snow', '큰 눈', 14, FULL, (ctx, env) => snowfall(ctx, env.t, 80)),
  sp('ta_rain', '여름 장마', 14, FULL, (ctx, env) => rain(ctx, env.t, 80, 140, 'rgba(140,150,165,0.7)')),
]

// ════════════════════════════════════════════════════════════
// 宣宗宮人〈題紅葉〉: 궁궐 도랑을 따라 나가는 붉은 잎
// ════════════════════════════════════════════════════════════
const RY_GROUND = 132
const RY_WALL = { x: 196, w: 14 }
const ryCanal = (x: number) => 150 + Math.sin(x * 0.03) * 3
const RY_LADY = { x: 120, y: 112 }

export const tihongyeBackground: Background = {
  id: 'hy117',
  drawBack(ctx) {
    sky(ctx, ['#c0c4cc', '#ccccca', '#d8d4c8'], RY_GROUND)
    ridge(ctx, (x) => 100 + 6 * Math.sin(x * 0.03 + 1), '#a4aca4', '#aeb6ae', 0, W, RY_GROUND)
    px(ctx, 0, RY_GROUND, W, H - RY_GROUND, '#9a9478')
    // 궁궐 전각 (왼쪽)
    px(ctx, 10, 80, 120, 40, '#a8382a')
    px(ctx, 4, 70, 132, 10, '#3c4048')
    for (let x = 16; x < 130; x += 14) px(ctx, x, 82, 2, 38, '#e0b84a')
    px(ctx, 0, 120, RY_WALL.x, 12, '#8a8274')
    // 궁궐 담과 수문
    px(ctx, RY_WALL.x, 64, RY_WALL.w, 100, '#a8382a')
    px(ctx, RY_WALL.x - 2, 60, RY_WALL.w + 4, 4, '#3c4048')
    fillRows(ctx, 142, 158, () => [RY_WALL.x, RY_WALL.x + RY_WALL.w], '#2a2620')
    // 도랑
    for (let x = 0; x < W; x++) px(ctx, x, ryCanal(x) - 3, 1, 7, '#7a9aa8')
    // 바깥 마을
    for (let k = 0; k < 3; k++) house(ctx, 228 + k * 30, 118 + (k % 2) * 2)
  },
  drawFront() {},
  drawDynamic() {},
}

const RY_CANAL = { x: 40, y: 108, w: 128, h: 72 }
const RY_LADY_F = { x: 64, y: 72, w: 128, h: 72 }
const RY_OUT = { x: 160, y: 104, w: 160, h: 76 }

export const TIHONGYE_SPRITES = [
  sp('ry_rapid', '급히 흐르는 궁궐 도랑물', 12, RY_CANAL, (ctx, env) => {
    for (let k = 0; k < 18; k++) {
      const x = mod(hash(k) * 320 + env.t * 50, 330) - 10
      px(ctx, x, ryCanal(x) - 2 + (k % 3) * 2, 6, 1, '#e4f0f4')
    }
  }),
  sp('ry_still', '고요히 고인 물', 12, RY_CANAL, (ctx) => {
    for (let x = 0; x < W; x += 2) dot(ctx, x, ryCanal(x), '#9abcc8')
  }),
  sp('ry_ice', '꽁꽁 언 도랑', 12, RY_CANAL, (ctx) => {
    for (let x = 0; x < W; x++) px(ctx, x, ryCanal(x) - 3, 1, 7, '#dce8ee')
  }),

  sp('ry_palace', '종일 한가로운 깊은 궁궐', 14, RY_LADY_F, (ctx, env) => {
    broadTree(ctx, 160, RY_GROUND, 1.6, AUTUMN)
    lady(ctx, RY_LADY.x, RY_LADY.y + 4, '#c8a0c0', 'sit')
    drift(ctx, env.t * 0.5, { x: 140, y: 90, w: 40, h: 40 }, 4, '#c8502a', 0.2, 5)
  }),
  sp('ry_feast', '잔치', 14, RY_LADY_F, (ctx, env) => {
    for (let k = 0; k < 5; k++) lady(ctx, 80 + k * 16, RY_LADY.y - (Math.sin(env.t * 4 + k) > 0.5 ? 1 : 0), ['#c86a7a', '#c8a0c0', '#6a8a9a', '#d8a040', '#7aa0c8'][k])
  }),
  sp('ry_army', '오가는 군사', 14, RY_LADY_F, (ctx, env) => {
    for (let k = 0; k < 4; k++) {
      const x = 80 + mod(k * 22 + env.t * 8, 100)
      person(ctx, x, 120, '#6a3a2a', { hat: '#4a4a52' })
      px(ctx, x + 3, 110, 1, 10, '#8a8478')
    }
  }),

  sp('ry_leaf', '시를 쓴 붉은 잎', 22, RY_LADY_F, (ctx) => {
    const x = RY_LADY.x + 14
    const y = RY_LADY.y + 4
    fillRows(ctx, y, y + 8, (yy) => [x + Math.abs(yy - y - 4) * 0.8, x + 10 - Math.abs(yy - y - 4) * 0.8], '#c8302a')
    px(ctx, x + 1, y + 4, 9, 1, '#8a2a1a')
    for (let i = 0; i < 3; i++) dot(ctx, x + 3 + i * 2, y + 2 + (i % 2) * 4, '#1f1d22')
    px(ctx, x - 3, y + 2, 1, 6, '#3a2a1c')
  }),
  sp('ry_bird', '날아가는 새', 22, RY_LADY_F, (ctx, env) => bird(ctx, 140 + Math.sin(env.t * 0.5) * 20, 90, Math.floor(env.t * 4) % 2, '#4a4a52')),
  sp('ry_kite', '종이 연', 22, RY_LADY_F, (ctx) => {
    fillRows(ctx, 80, 92, (y) => [160 - (6 - Math.abs(y - 86)), 160 + (6 - Math.abs(y - 86))], '#e8c048')
    for (let i = 0; i < 20; i++) dot(ctx, 160 - i * 1.6, 92 + i * 1.2, '#5a4632')
  }),

  sp('ry_out', '인간 세상으로 흘러가는 붉은 잎', 26, RY_OUT, (ctx, env) => {
    const f = mod(env.t * 0.06, 1)
    const x = 140 + f * 170
    const y = ryCanal(x) - 1 + Math.sin(env.t * 2) * 0.6
    fillRows(ctx, y - 2, y + 2, (yy) => [x - 3 + Math.abs(yy - y), x + 3 - Math.abs(yy - y)], '#c8302a')
    withAlpha(ctx, 0.5, () => {
      for (let a = 0; a < 6.28; a += 0.5) dot(ctx, x + Math.cos(a) * 5, y + Math.sin(a) * 1.5, '#e4f0f4')
    })
    standFig(ctx, 276, 128, pal({ R: '#4a6a8a', r: '#34506a' }), true)
  }),
  sp('ry_pond', '궁궐 연못', 26, RY_OUT, (ctx) => fillRows(ctx, 150, 166, (y) => [60 + Math.abs(y - 158) * 3, 140 - Math.abs(y - 158) * 3], '#8ab0bc')),
  sp('ry_sky', '하늘 높이', 26, RY_OUT, (ctx, env) => px(ctx, 160, 60 - mod(env.t * 6, 40), 6, 3, '#c8302a')),
]

