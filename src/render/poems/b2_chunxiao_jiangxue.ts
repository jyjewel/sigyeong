// 孟浩然〈春曉〉, 柳宗元〈江雪〉
import type { Background, Sprite } from '../types'
import { H, W, disc, dot, fillRows, grid, hash, mod, px } from '../pixel'
import type { Ctx } from '../pixel'
import {
  bird, broadTree, bubble, canopyPts, flower, mistBands, person, ridge, sky, snowfall, sparkle, withAlpha,
} from '../kit'

// ════════════════════════ 春曉 ════════════════════════
const CX_WIN = { x: 52, y: 88, w: 44, h: 26 }
const CX_TREE = { x: 236, y: 150, s: 1.7 }
const BLOOM = { dark: '#d9849a', base: '#efa8bb', light: '#f9d3dd' }

export const chunxiaoBackground: Background = {
  id: 'chunxiao',
  drawBack(ctx) {
    sky(ctx, ['#e6c2b2', '#ecd0bc', '#f1dcc6', '#f4e6d2', '#f1ecda'], 104)
    ridge(ctx, (x) => 84 + 8 * Math.sin(x * 0.03 + 2) + hash(x) * 1.2, '#a8b8a8', '#b8c6b4')
    ridge(ctx, (x) => 98 + 4 * Math.sin(x * 0.05) + hash(x + 3) * 1.2, '#8aa47a')
    px(ctx, 0, 112, W, H - 112, '#7d9a5a')
    for (let i = 0; i < 70; i++) px(ctx, hash(i * 3.1) * W, 114 + hash(i * 2.3) * 64, 2, 1, i % 2 ? '#6e8a4c' : '#8eaa68')
  },
  drawFront(ctx) {
    // 집
    px(ctx, 18, 70, 116, 6, '#4a4f57')
    px(ctx, 12, 76, 128, 5, '#3c4048')
    px(ctx, 22, 81, 108, 44, '#e6dfcc')
    for (const c of [22, 48, 100, 129]) px(ctx, c, 81, 2, 44, '#6b4a32')
    px(ctx, 104, 96, 18, 29, '#6b4a32')
    px(ctx, 16, 125, 120, 4, '#9a8f7a')
    // 창 (안쪽은 어두운 방)
    const w = CX_WIN
    px(ctx, w.x - 2, w.y - 2, w.w + 4, w.h + 4, '#6b4a32')
    px(ctx, w.x, w.y, w.w, w.h, '#4a3f3a')
    px(ctx, w.x + 4, w.y + 16, 36, 6, '#6b4a32')
    // 울타리
    for (let x = 140; x < W; x += 6) px(ctx, x, 120, 2, 10, '#8a6a42')
    px(ctx, 140, 123, W - 140, 1, '#8a6a42')
  },
  drawDynamic(ctx) {
    broadTree(ctx, CX_TREE.x, CX_TREE.y, CX_TREE.s, BLOOM)
    canopyPts(CX_TREE.x, CX_TREE.y, CX_TREE.s, 22, 3).forEach((p) => flower(ctx, p.x, p.y, '#fff1f4', '#f7d77a'))
  },
}

const CX_ROOM = { x: 20, y: 66, w: 128, h: 72 }

const cxSleeping: Sprite = {
  id: 'cx_sleeping',
  name: '깊은 봄잠',
  z: 30,
  focus: CX_ROOM,
  draw(ctx, env) {
    const w = CX_WIN
    px(ctx, w.x + 6, w.y + 11, 6, 5, '#e6c39b')
    px(ctx, w.x + 5, w.y + 10, 6, 2, '#1f1d22')
    px(ctx, w.x + 12, w.y + 12, 26, 5, '#6e7fa0')
    px(ctx, w.x + 12, w.y + 12, 26, 1, '#8a9aba')
    for (let i = 0; i < 3; i++) {
      const f = mod(env.t * 0.4 + i / 3, 1)
      grid(ctx, ['KKK', '.K.', 'KKK'], w.x + 14 + f * 16 + i, w.y + 8 - f * 22, { K: '#5d4a37' })
    }
    // 창으로 드는 아침 햇살
    withAlpha(ctx, 0.25, () => px(ctx, w.x, w.y, w.w, 4, '#fff2c0'))
  },
}
const cxReading: Sprite = {
  id: 'cx_reading',
  name: '밤새 책 읽는 사람',
  z: 30,
  focus: CX_ROOM,
  draw(ctx, env) {
    const w = CX_WIN
    withAlpha(ctx, 0.35, () => disc(ctx, w.x + 30, w.y + 12, 12, '#ffcf7a'))
    px(ctx, w.x + 32, w.y + 10, 2, 5, '#efe6cf')
    dot(ctx, w.x + 32, w.y + 9 - (Math.sin(env.t * 9) > 0 ? 1 : 0), '#ffd166')
    px(ctx, w.x + 14, w.y + 4, 3, 1, '#1f1d22')
    px(ctx, w.x + 14, w.y + 5, 3, 3, '#e6c39b')
    px(ctx, w.x + 12, w.y + 8, 7, 8, '#4b5068')
    px(ctx, w.x + 18, w.y + 9, 6, 4, '#efe6cf')
  },
}
const cxPlowing: Sprite = {
  id: 'cx_plowing',
  name: '밭 가는 사람',
  z: 40,
  focus: { x: 140, y: 112, w: 128, h: 68 },
  draw(ctx, env) {
    const x = 170 + mod(env.t * 6, 60)
    for (let k = 0; k < 6; k++) px(ctx, 160 + k * 18, 160, 12, 1, '#6a5a3a')
    person(ctx, x, 150, '#8a7a55', { hat: '#c9b07a', step: Math.floor(env.t * 4) % 2 })
    const up = Math.sin(env.t * 4) > 0
    for (let k = 0; k < 7; k++) dot(ctx, x + 3 + k * 0.6, 152 + (up ? -k * 0.4 : k * 0.6), '#8a6a42')
  },
}

const CX_YARD = { x: 112, y: 52, w: 208, h: 117 }
const CX_PERCH = [
  { x: 220, y: 108 },
  { x: 252, y: 104 },
  { x: 236, y: 92 },
  { x: 60, y: 69 },
  { x: 160, y: 118 },
  { x: 290, y: 118 },
]

const cxBirds: Sprite = {
  id: 'cx_birds',
  name: '여기저기 우는 새',
  z: 60,
  focus: CX_YARD,
  draw(ctx, env) {
    CX_PERCH.forEach((p, i) => {
      grid(ctx, ['.KK.', 'KKKy', '.KK.'], p.x, p.y, { K: '#6b5040', y: '#e0a040' })
      const f = mod(env.t * 0.8 + i * 0.37, 1)
      if (f < 0.5) {
        dot(ctx, p.x + 5 + f * 6, p.y - 2 - f * 6, '#5d4a37')
        dot(ctx, p.x + 6 + f * 6, p.y - 3 - f * 6, '#5d4a37')
      }
    })
    const a = env.t * 0.8
    bird(ctx, 180 + Math.cos(a) * 30, 70 + Math.sin(a * 2) * 8, Math.floor(env.t * 6) % 2, '#6b5040')
  },
}
const cxDogs: Sprite = {
  id: 'cx_dogs',
  name: '짖는 개',
  z: 60,
  focus: CX_YARD,
  draw(ctx, env) {
    const x = 180
    const y = 140
    grid(ctx, ['K....KK', 'KKKKKKk', 'KKKKKK.', 'K.K.K.K'], x, y, { K: '#a0703a', k: '#3a2a1c' })
    const bark = Math.sin(env.t * 6) > 0
    if (bark) for (let k = 0; k < 3; k++) dot(ctx, x + 9 + k * 2, y - 1 - k, '#5d4a37')
  },
}
const cxBell: Sprite = {
  id: 'cx_bell',
  name: '먼 절의 종소리',
  z: 15,
  focus: CX_YARD,
  draw(ctx, env) {
    const x = 284
    const y = 86
    px(ctx, x - 1, y - 10, 3, 10, '#6a7a6a')
    for (let k = 0; k < 4; k++) px(ctx, x - 4 + k, y - 10 + k * 3, 9 - k * 2, 1, '#4a5a4a')
    for (let r = 0; r < 3; r++) {
      const rr = mod(env.t * 8 + r * 7, 21)
      withAlpha(ctx, 1 - rr / 21, () => {
        for (let a = 0; a < Math.PI; a += 0.25) dot(ctx, x + Math.cos(a + Math.PI) * rr, y - 6 + Math.sin(a + Math.PI) * rr * 0.6, '#fff6e0')
      })
    }
  },
}

const CX_BUB = { x: 80, y: 28, w: 64, h: 40 }
function cxBubble(ctx: Ctx) {
  bubble(ctx, CX_BUB.x, CX_BUB.y, CX_BUB.w, CX_BUB.h, CX_WIN.x + 14, CX_WIN.y + 2)
}
const CX_MEM = { x: 40, y: 20, w: 144, h: 81 }

const cxStorm: Sprite = {
  id: 'cx_night_storm',
  name: '간밤의 비바람',
  z: 70,
  focus: CX_MEM,
  draw(ctx, env) {
    cxBubble(ctx)
    const b = CX_BUB
    px(ctx, b.x + 3, b.y + 3, b.w - 6, b.h - 6, '#2a3150')
    for (let i = 0; i < 26; i++) {
      const x = b.x + 4 + mod(hash(i) * 56 + env.t * 10, 56)
      const y = b.y + 4 + mod(hash(i * 3) * 30 + env.t * 40, 30)
      px(ctx, x, y, 1, 3, '#9fb8d8')
    }
    for (let k = 0; k < 3; k++) px(ctx, b.x + 10 + mod(env.t * 30 + k * 20, 40), b.y + 10 + k * 8, 10, 1, '#d8e2f0')
    // 땅에 남은 물웅덩이
    for (const [x, y, w] of [[170, 150, 14], [210, 164, 10], [140, 170, 12]]) {
      px(ctx, x, y, w, 2, '#9fb8c8')
      if (Math.sin(env.t * 2 + x) > 0.5) dot(ctx, x + 3, y, '#e6f2f8')
    }
  },
}
const cxMusic: Sprite = {
  id: 'cx_night_music',
  name: '간밤의 거문고 소리',
  z: 70,
  focus: CX_MEM,
  draw(ctx, env) {
    cxBubble(ctx)
    const b = CX_BUB
    px(ctx, b.x + 10, b.y + 22, 40, 4, '#7a4a2a')
    for (let k = 0; k < 6; k++) px(ctx, b.x + 12, b.y + 22 + (k % 2), 36, 1, '#d9c79a')
    for (let i = 0; i < 3; i++) {
      const f = mod(env.t * 0.6 + i / 3, 1)
      grid(ctx, ['.KK', '.K.', 'KK.'], b.x + 14 + i * 12, b.y + 16 - f * 8, { K: '#5d4a37' })
    }
  },
}
const cxLaugh: Sprite = {
  id: 'cx_night_laugh',
  name: '아이들 웃음소리',
  z: 70,
  focus: CX_MEM,
  draw(ctx, env) {
    cxBubble(ctx)
    const b = CX_BUB
    for (let i = 0; i < 3; i++) {
      const x = b.x + 12 + i * 15
      const y = b.y + 12 + (Math.sin(env.t * 6 + i) > 0 ? 0 : 1)
      disc(ctx, x, y + 6, 5, '#e6c39b')
      px(ctx, x - 3, y + 8, 7, 1, '#7a3a2a')
      dot(ctx, x - 2, y + 4, '#2a2020')
      dot(ctx, x + 2, y + 4, '#2a2020')
      px(ctx, x - 4, y, 9, 2, '#1f1d22')
    }
  },
}

const CX_TREE_FOCUS = { x: 176, y: 96, w: 128, h: 72 }

const cxPetals: Sprite = {
  id: 'cx_petals',
  name: '떨어진 꽃잎',
  z: 80,
  focus: CX_TREE_FOCUS,
  draw(ctx, env) {
    for (let i = 0; i < 70; i++) {
      const x = 190 + hash(i * 2.1) * 100
      const y = 150 + hash(i * 3.7) * 26
      dot(ctx, x, y, i % 3 ? '#f4c0cf' : '#fbe2ea')
    }
    for (let i = 0; i < 14; i++) {
      const f = mod(env.t * 0.25 + hash(i), 1)
      const x = 210 + hash(i * 5) * 60 + Math.sin(f * 8 + i) * 5 - f * 10
      dot(ctx, x, 110 + f * 60, '#f9d3dd')
    }
  },
}
const cxBuds: Sprite = {
  id: 'cx_buds',
  name: '막 맺힌 꽃봉오리',
  z: 80,
  focus: CX_TREE_FOCUS,
  draw(ctx) {
    broadTree(ctx, CX_TREE.x, CX_TREE.y, CX_TREE.s, { dark: '#5a7a3a', base: '#7a9a4a', light: '#9aba62' })
    canopyPts(CX_TREE.x, CX_TREE.y, CX_TREE.s, 26, 8).forEach((p) => {
      px(ctx, p.x, p.y, 1, 2, '#c95a7a')
      dot(ctx, p.x, p.y + 2, '#5a8a3a')
    })
  },
}
const cxFruit: Sprite = {
  id: 'cx_fruit',
  name: '주렁주렁 열린 열매',
  z: 80,
  focus: CX_TREE_FOCUS,
  draw(ctx) {
    broadTree(ctx, CX_TREE.x, CX_TREE.y, CX_TREE.s, { dark: '#3e6a32', base: '#558a42', light: '#74a85a' })
    canopyPts(CX_TREE.x, CX_TREE.y, CX_TREE.s, 18, 12).forEach((p) => {
      px(ctx, p.x, p.y, 2, 2, '#d8402a')
      dot(ctx, p.x, p.y, '#ff8a6a')
    })
  },
}

export const CHUNXIAO_SPRITES: Sprite[] = [
  cxSleeping, cxReading, cxPlowing,
  cxBirds, cxDogs, cxBell,
  cxStorm, cxMusic, cxLaugh,
  cxPetals, cxBuds, cxFruit,
]

// ════════════════════════ 江雪 ════════════════════════
const JX_RIVER = 124
const JX_OLD = { x: 150, y: 146 }
const jxRidge1 = (x: number) => 44 + 16 * Math.sin(x * 0.03 + 1) + 8 * Math.sin(x * 0.08) + hash(x) * 2
const jxRidge2 = (x: number) => 72 + 12 * Math.sin(x * 0.025 + 3) + 5 * Math.sin(x * 0.1) + hash(x + 7) * 2
const JX_PATHS = [
  (f: number) => ({ x: 20 + f * 70, y: 118 - f * 30 + Math.sin(f * 12) * 4 }),
  (f: number) => ({ x: 200 + f * 90, y: 118 - f * 34 + Math.sin(f * 10 + 1) * 5 }),
  (f: number) => ({ x: 110 + f * 50, y: 110 - f * 26 + Math.sin(f * 14) * 3 }),
]

export const jiangxueBackground: Background = {
  id: 'jiangxue',
  drawBack(ctx) {
    sky(ctx, ['#b9bfc6', '#c3c8ce', '#cdd1d5', '#d6d9dc', '#dddfe1'], 110)
    ridge(ctx, jxRidge1, '#e9ecef', '#ffffff')
    for (let x = 0; x < W; x += 3) {
      const y = jxRidge1(x)
      if (hash(x) < 0.15) px(ctx, x, y + 6 + hash(x * 3) * 20, 1, 2, '#c8ced4')
    }
    ridge(ctx, jxRidge2, '#dfe4e8', '#f6f8f9')
    for (let x = 0; x < W; x += 2) if (hash(x * 7) < 0.12) px(ctx, x, jxRidge2(x) + 5 + hash(x) * 20, 1, 2, '#bcc4cc')
    px(ctx, 0, 108, W, JX_RIVER - 108, '#eef1f3')
    // 산길
    JX_PATHS.forEach((p) => {
      for (let i = 0; i < 60; i++) {
        const q = p(i / 60)
        dot(ctx, q.x, q.y, '#b5bcc4')
      }
    })
    // 차가운 강
    for (let y = JX_RIVER; y < H; y++) px(ctx, 0, y, W, 1, y < 132 ? '#5d6a76' : y < 160 ? '#56626e' : '#4e5a66')
    for (let i = 0; i < 30; i++) px(ctx, hash(i * 3) * W, JX_RIVER + 4 + hash(i * 5) * 52, 8, 1, '#66737f')
  },
  drawFront(ctx) {
    fillRows(ctx, JX_RIVER - 2, JX_RIVER + 2, () => [0, W], '#f2f4f6')
  },
  drawDynamic() {},
}

const JX_SKY = { x: 0, y: 10, w: 224, h: 126 }

const jxNoBirds: Sprite = {
  id: 'jx_no_birds',
  name: '새 끊긴 고요한 산',
  z: 85,
  focus: JX_SKY,
  draw(ctx, env) {
    mistBands(ctx, env.t, [60, 90], '#f4f6f8', 0.35)
  },
}
const jxFlock: Sprite = {
  id: 'jx_birds_flock',
  name: '어지럽게 나는 새 떼',
  z: 85,
  focus: JX_SKY,
  draw(ctx, env) {
    for (let i = 0; i < 16; i++) {
      const a = env.t * (0.5 + hash(i) * 0.4) + i
      bird(ctx, 110 + Math.cos(a) * (40 + hash(i * 3) * 50), 50 + Math.sin(a * 1.3) * 20, Math.floor(env.t * 6 + i) % 2)
    }
  },
}
const jxHawk: Sprite = {
  id: 'jx_hawk',
  name: '맴도는 매',
  z: 85,
  focus: JX_SKY,
  draw(ctx, env) {
    const a = env.t * 0.6
    const x = 110 + Math.cos(a) * 46
    const y = 40 + Math.sin(a) * 12
    px(ctx, x - 6, y, 13, 1, '#3a3430')
    px(ctx, x - 1, y - 1, 3, 3, '#4a4038')
    dot(ctx, x + 2, y - 1, '#d9a441')
  },
}

const JX_PATH_FOCUS = { x: 8, y: 30, w: 192, h: 108 }

const jxNoTracks: Sprite = {
  id: 'jx_no_tracks',
  name: '자취 사라진 길',
  z: 20,
  focus: JX_PATH_FOCUS,
  draw(ctx, env) {
    JX_PATHS.forEach((p, k) => {
      for (let i = 0; i < 60; i++) {
        const q = p(i / 60)
        dot(ctx, q.x, q.y, '#e6eaee')
        if (i % 9 === 0 && Math.sin(env.t * 2 + i + k) > 0.6) sparkle(ctx, q.x, q.y - 1, '#ffffff')
      }
    })
  },
}
const jxTracks: Sprite = {
  id: 'jx_tracks',
  name: '어지러운 발자국',
  z: 20,
  focus: JX_PATH_FOCUS,
  draw(ctx) {
    JX_PATHS.forEach((p) => {
      for (let i = 0; i < 60; i += 2) {
        const q = p(i / 60)
        dot(ctx, q.x + (i % 4 ? 1 : -1), q.y, '#7a828c')
      }
    })
  },
}
const jxTravelers: Sprite = {
  id: 'jx_travelers',
  name: '오가는 나그네',
  z: 20,
  focus: JX_PATH_FOCUS,
  draw(ctx, env) {
    JX_PATHS.forEach((p, k) => {
      for (let j = 0; j < 2; j++) {
        const f = mod(env.t / 16 + j * 0.5 + k * 0.2, 1)
        const q = p(f)
        person(ctx, q.x - 1, q.y - 8, ['#6b5a4a', '#4b5068', '#7a4a3a'][k], { step: Math.floor(env.t * 4 + j) % 2 })
      }
    })
  },
}

const JX_BOAT_FOCUS = { x: 104, y: 112, w: 96, h: 54 }

function smallBoat(ctx: Ctx, x: number, y: number, len = 26) {
  px(ctx, x - len / 2, y, len, 2, '#4a3426')
  px(ctx, x - len / 2 + 2, y + 2, len - 4, 1, '#3a2a1c')
  px(ctx, x - len / 2 - 1, y - 1, 2, 1, '#4a3426')
  px(ctx, x + len / 2 - 1, y - 1, 2, 1, '#4a3426')
}
function oldMan(ctx: Ctx, x: number, y: number, slump = 0) {
  // 삿갓
  px(ctx, x - 3, y - 9 + slump, 9, 1, '#a88a50')
  px(ctx, x - 1, y - 10 + slump, 5, 1, '#b89a5e')
  dot(ctx, x + 1, y - 11 + slump, '#b89a5e')
  px(ctx, x, y - 8 + slump, 3, 2, '#e6c39b')
  // 도롱이
  for (let r = 0; r < 6; r++) px(ctx, x - 2 - (r > 2 ? 1 : 0), y - 6 + r, 7 + (r > 2 ? 2 : 0), 1, r % 2 ? '#6e6a44' : '#807a50')
  for (let k = 0; k < 4; k++) dot(ctx, x - 2 + k * 2, y, '#5a5638')
}

const jxOldMan: Sprite = {
  id: 'jx_old_man',
  name: '도롱이 입은 늙은이의 배',
  z: 40,
  focus: JX_BOAT_FOCUS,
  draw(ctx, env) {
    const bob = Math.sin(env.t * 0.8) * 0.5
    smallBoat(ctx, JX_OLD.x + 4, JX_OLD.y + 1 + bob)
    oldMan(ctx, JX_OLD.x, JX_OLD.y + bob, env.fx.slump ? 2 : 0)
    // 쌓인 눈
    px(ctx, JX_OLD.x - 3, JX_OLD.y - 10 + bob, 9, 1, '#ffffff')
    withAlpha(ctx, 0.4, () => px(ctx, JX_OLD.x - 10, JX_OLD.y + 4, 30, 1, '#7a8692'))
  },
}
const jxPleasure: Sprite = {
  id: 'jx_pleasure_boat',
  name: '화려한 놀잇배',
  z: 40,
  focus: JX_BOAT_FOCUS,
  draw(ctx, env) {
    const x = JX_OLD.x
    const y = JX_OLD.y + 2
    px(ctx, x - 22, y, 46, 3, '#8a3a2a')
    px(ctx, x - 16, y - 12, 32, 12, '#b8483a')
    px(ctx, x - 19, y - 15, 38, 3, '#d9a441')
    for (let k = 0; k < 4; k++) {
      const fl = Math.sin(env.t * 5 + k) > 0
      px(ctx, x - 14 + k * 9, y - 10, 3, 4, fl ? '#ffd27a' : '#ffbf5a')
    }
  },
}
const jxFerryCrowd: Sprite = {
  id: 'jx_ferry_crowd',
  name: '사람 가득한 나룻배',
  z: 40,
  focus: JX_BOAT_FOCUS,
  draw(ctx) {
    smallBoat(ctx, JX_OLD.x + 4, JX_OLD.y + 1, 36)
    for (let k = 0; k < 5; k++) person(ctx, JX_OLD.x - 10 + k * 6, JX_OLD.y - 7, ['#6b5a4a', '#4b5068', '#7a4a3a', '#4f6b4a', '#8a7a55'][k])
  },
}

const JX_FISH_FOCUS = { x: 120, y: 120, w: 80, h: 45 }

const jxFishing: Sprite = {
  id: 'jx_fishing',
  name: '홀로 드리운 낚싯대',
  z: 45,
  focus: JX_FISH_FOCUS,
  draw(ctx, env) {
    const sx = JX_OLD.x + 4
    const sy = JX_OLD.y - 5
    for (let k = 0; k < 16; k++) dot(ctx, sx + k, sy - k * 0.55, '#5a3d28')
    const tx = sx + 16
    const ty = sy - 9
    const bob = Math.sin(env.t * 1.5) * 0.6
    for (let k = 0; k < 18; k++) dot(ctx, tx + k * 0.15, ty + k + (k > 15 ? bob : 0), '#d8dde2')
    const r = mod(env.t * 3, 6)
    withAlpha(ctx, 1 - r / 6, () => px(ctx, tx + 2 - r, ty + 19, r * 2 + 1, 1, '#c8d2da'))
    // 마지막 글자 ‘雪’에 이르러 비로소 눈이 내린다
    snowfall(ctx, env.t, 160)
    snowfall(ctx, env.t * 0.6 + 20, 60, '#eef2f6')
  },
}
const jxNet: Sprite = {
  id: 'jx_net',
  name: '던진 그물',
  z: 45,
  focus: JX_FISH_FOCUS,
  draw(ctx, env) {
    const f = mod(env.t / 3, 1)
    const r = 4 + f * 12
    for (let a = -Math.PI; a <= 0; a += 0.15) dot(ctx, JX_OLD.x + 18 + Math.cos(a) * r, JX_OLD.y - 4 + Math.sin(a) * r * 0.6 + f * 6, '#c8c0a8')
    for (let k = -2; k <= 2; k++) for (let j = 0; j < 6; j++) dot(ctx, JX_OLD.x + 18 + k * r * 0.4, JX_OLD.y - 4 - r * 0.5 + j * 2 + f * 6, '#b8b098')
  },
}
const jxSleep: Sprite = {
  id: 'jx_sleep',
  name: '배 위에서 잠든 늙은이',
  z: 45,
  fx: { slump: 1 },
  focus: JX_FISH_FOCUS,
  draw(ctx, env) {
    for (let i = 0; i < 3; i++) {
      const f = mod(env.t * 0.4 + i / 3, 1)
      grid(ctx, ['KKK', '.K.', 'KKK'], JX_OLD.x + 6 + f * 10 + i, JX_OLD.y - 12 - f * 14, { K: '#5d6670' })
    }
  },
}

export const JIANGXUE_SPRITES: Sprite[] = [
  jxNoBirds, jxFlock, jxHawk,
  jxNoTracks, jxTracks, jxTravelers,
  jxOldMan, jxPleasure, jxFerryCrowd,
  jxFishing, jxNet, jxSleep,
]

