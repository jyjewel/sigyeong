// 李白〈靜夜思〉: 밤의 방 안. 침상(床)과 창은 기본 풍경, 달빛은 1구의 정답으로 나타난다.
import type { Background, Sprite } from '../types'
import { H, W, disc, dot, fillRows, grid, hash, mod, px } from '../pixel'
import type { Ctx, Env } from '../pixel'
import { bubble, house, moon, sparkle, withAlpha } from '../kit'
import { POET_PAL, SEATED, withHead } from '../figures'

const WIN = { x: 196, y: 26, w: 96, h: 70 }
const FLOOR = 128
const BED = { x: 18, y: 116, w: 104 }
const SC = 2 // 방 안 인물은 두 배 크기로 그린다
const POET = { x: 84, y: 92 } // 좌상(座像) 격자 좌상단
const MOON = { x: 262, y: 50 }

// 바닥의 빛 웅덩이 (침상 앞)
const patch = (y: number): [number, number] => {
  const f = (y - 146) / 26
  return [126 - f * 22, 214 - f * 22]
}

export const jingyesiBackground: Background = {
  id: 'jingyesi',
  drawBack(ctx) {
    for (let y = 0; y < FLOOR; y++) px(ctx, 0, y, W, 1, y < 60 ? '#2a2634' : '#2e2938')
    for (let x = 0; x < W; x += 24) px(ctx, x, 0, 1, FLOOR, '#252130')
    for (let y = FLOOR; y < H; y++) px(ctx, 0, y, W, 1, (y - FLOOR) % 9 === 0 ? '#2e2530' : '#3a3040')
    px(ctx, 0, FLOOR - 2, W, 2, '#1e1a26')
    // 창: 바깥 밤하늘
    px(ctx, WIN.x, WIN.y, WIN.w, WIN.h, '#18203d')
    for (let y = WIN.y; y < WIN.y + WIN.h; y++) if (y > WIN.y + 50) px(ctx, WIN.x, y, WIN.w, 1, '#1d2647')
    // 창 밖의 먼 지붕선
    for (let x = WIN.x; x < WIN.x + WIN.w; x++) {
      const y = WIN.y + 58 + Math.round(Math.sin(x * 0.08) * 2)
      px(ctx, x, y, 1, WIN.y + WIN.h - y, '#11152a')
    }
  },
  drawFront(ctx) {
    // 창틀과 살
    const { x, y, w, h } = WIN
    px(ctx, x - 4, y - 4, w + 8, 4, '#5a4632')
    px(ctx, x - 4, y + h, w + 8, 5, '#5a4632')
    px(ctx, x - 4, y, 4, h, '#5a4632')
    px(ctx, x + w, y, 4, h, '#5a4632')
    for (let k = 1; k < 4; k++) px(ctx, x + (w / 4) * k, y, 1, h, '#4a3a2a')
    for (let k = 1; k < 3; k++) px(ctx, x, y + (h / 3) * k, w, 1, '#4a3a2a')
    // 침상
    px(ctx, BED.x, BED.y, BED.w, 4, '#6b4a32')
    px(ctx, BED.x, BED.y + 4, BED.w, 8, '#5a3d28')
    px(ctx, BED.x + 2, BED.y + 12, 4, 8, '#4a3220')
    px(ctx, BED.x + BED.w - 6, BED.y + 12, 4, 8, '#4a3220')
    px(ctx, BED.x, BED.y, BED.w, 1, '#80593d')
    // 침상 뒤 병풍
    px(ctx, BED.x, 70, 6, 46, '#4a3a2a')
    for (let k = 0; k < 4; k++) px(ctx, BED.x + 6 + k * 14, 72, 13, 44, k % 2 ? '#3e3646' : '#423a4b')
    // 이불과 베개
    px(ctx, BED.x + 4, BED.y - 4, 44, 4, '#5a6a8a')
    px(ctx, BED.x + 4, BED.y - 5, 44, 1, '#6e7fa0')
    px(ctx, BED.x + 4, BED.y - 7, 10, 3, '#c9bfa5')
  },
  drawDynamic() {},
}

// ── 1구: 빛 ─────────────────────────────────────────────────
const LIGHT_FOCUS = { x: 88, y: 24, w: 224, h: 126 }

function beam(ctx: Ctx, color: string, alpha: number) {
  withAlpha(ctx, alpha, () => {
    fillRows(ctx, WIN.y + WIN.h, 146, (y) => {
      const f = (y - (WIN.y + WIN.h)) / (146 - WIN.y - WIN.h)
      return [WIN.x - f * 70, WIN.x + WIN.w - f * 78]
    }, color)
  })
  withAlpha(ctx, alpha * 2.2, () => fillRows(ctx, 146, 172, patch, color))
}

const moonlight: Sprite = {
  id: 'jy_moonlight',
  name: '침상 앞의 달빛',
  z: 10,
  focus: LIGHT_FOCUS,
  draw(ctx) {
    moon(ctx, MOON.x, MOON.y, 8)
    beam(ctx, '#dfe6ff', 0.12)
  },
}
const sunlight: Sprite = {
  id: 'jy_sunlight',
  name: '아침 햇살',
  z: 10,
  focus: LIGHT_FOCUS,
  draw(ctx) {
    px(ctx, WIN.x, WIN.y, WIN.w, WIN.h, '#f1b878')
    px(ctx, WIN.x, WIN.y + 40, WIN.w, 30, '#f5cf8e')
    disc(ctx, 250, 66, 9, '#fff1c2')
    beam(ctx, '#ffd28a', 0.18)
  },
}
const candle: Sprite = {
  id: 'jy_candle',
  name: '촛불 빛',
  z: 30,
  focus: LIGHT_FOCUS,
  draw(ctx, env) {
    const x = 160
    const y = 150
    const fl = Math.sin(env.t * 9) + Math.sin(env.t * 13)
    withAlpha(ctx, 0.14 + fl * 0.02, () => disc(ctx, x, y - 8, 30, '#ffb85a'))
    withAlpha(ctx, 0.18, () => disc(ctx, x, y - 8, 14, '#ffcf7a'))
    px(ctx, x - 5, y + 2, 10, 2, '#6b4a32')
    px(ctx, x - 1, y - 6, 3, 8, '#efe6cf')
    px(ctx, x, y - 9 - (fl > 0 ? 1 : 0), 1, 3, '#ffd166')
    dot(ctx, x, y - 10 - (fl > 0 ? 1 : 0), '#fff4c0')
  },
}

// ── 2구: 서리로 착각 ────────────────────────────────────────
const FLOOR_FOCUS = { x: 92, y: 126, w: 128, h: 54 }

const frost: Sprite = {
  id: 'jy_frost',
  name: '서리 같은 달빛',
  z: 15,
  focus: FLOOR_FOCUS,
  draw(ctx, env) {
    withAlpha(ctx, 0.35, () => fillRows(ctx, 146, 172, patch, '#eef3ff'))
    for (let i = 0; i < 60; i++) {
      const y = 147 + Math.floor(hash(i * 3.1) * 24)
      const [a, b] = patch(y)
      const x = a + hash(i * 7.7) * (b - a)
      const on = Math.sin(env.t * 2 + i) > 0.2
      dot(ctx, x, y, on ? '#ffffff' : '#cfd9f0')
      if (i % 9 === 0 && on) sparkle(ctx, x, y, '#ffffff', true)
    }
  },
}
const puddle: Sprite = {
  id: 'jy_puddle',
  name: '바닥에 쏟아진 물',
  z: 15,
  focus: FLOOR_FOCUS,
  draw(ctx, env) {
    withAlpha(ctx, 0.75, () => {
      for (let dy = -6; dy <= 6; dy++) {
        const w = Math.round(30 * Math.sqrt(1 - (dy * dy) / 40))
        px(ctx, 160 - w, 160 + dy, w * 2, 1, '#4a6a9a')
      }
    })
    for (let r = 0; r < 2; r++) {
      const rr = mod(env.t * 6 + r * 8, 16)
      withAlpha(ctx, 1 - rr / 16, () => {
        px(ctx, 160 - rr * 1.5, 160 - rr * 0.3, rr * 3, 1, '#9ab8e0')
        px(ctx, 160 - rr * 1.5, 160 + rr * 0.3, rr * 3, 1, '#9ab8e0')
      })
    }
    // 엎어진 그릇
    px(ctx, 190, 156, 6, 3, '#9a8a6a')
  },
}
const petals: Sprite = {
  id: 'jy_petals',
  name: '흩어진 흰 꽃잎',
  z: 15,
  focus: FLOOR_FOCUS,
  draw(ctx, env) {
    for (let i = 0; i < 30; i++) {
      const y = 147 + hash(i * 3.3) * 24
      const [a, b] = patch(y)
      const x = a + hash(i * 5.1) * (b - a) + Math.sin(env.t + i) * 0.5
      px(ctx, x, y, 2, 1, '#f6f1ea')
      dot(ctx, x + 1, y + 1, '#e2d8e6')
    }
  },
}

// ── 3·4구: 시인 ─────────────────────────────────────────────
const POET_FOCUS = { x: 40, y: 66, w: 128, h: 72 }

const HEAD_UP = [
  '.......KKK....',
  '......KKKKK...',
  '......KKKKSS..',
  '.....HSSSES...',
  '.....HSSSSSS..',
  '.....HSSSS....',
  '......BBS.....',
  '..............',
]
const HEAD_DOWN = [
  '..............',
  '.....KKKK.....',
  '....KKKKKK....',
  '....HSSSSS....',
  '....HSSSSSS...',
  '....HSSSES....',
  '.....BSSS.....',
  '.....BBS......',
]
const PAL = POET_PAL as unknown as Record<string, string>

function seatedPoet(ctx: Ctx, env: Env, head?: string[]) {
  const h = head ?? (env.fx.headDown ? HEAD_DOWN : HEAD_UP)
  grid(ctx, withHead(h, SEATED), POET.x, POET.y, PAL, false, SC)
}

const lookUp: Sprite = {
  id: 'jy_look_up',
  name: '달을 바라보는 시인',
  z: 40,
  focus: POET_FOCUS,
  draw(ctx, env) {
    seatedPoet(ctx, env)
  },
}
const reading: Sprite = {
  id: 'jy_reading',
  name: '책을 읽는 시인',
  z: 40,
  focus: POET_FOCUS,
  draw(ctx, env) {
    seatedPoet(ctx, env, HEAD_DOWN)
    px(ctx, POET.x + 18, POET.y + 18, 12, 7, '#efe6cf')
    px(ctx, POET.x + 24, POET.y + 18, 1, 7, '#b8ab8c')
    for (let r = 0; r < 3; r++) px(ctx, POET.x + 19, POET.y + 19 + r * 2, 4, 1, '#5d4a37')
    for (let r = 0; r < 3; r++) px(ctx, POET.x + 26, POET.y + 19 + r * 2, 3, 1, '#5d4a37')
    if (Math.sin(env.t) > 0.9) px(ctx, POET.x + 26, POET.y + 17, 4, 1, '#efe6cf')
  },
}
const sleeping: Sprite = {
  id: 'jy_sleeping',
  name: '누워 잠든 시인',
  z: 40,
  focus: POET_FOCUS,
  draw(ctx, env) {
    px(ctx, BED.x + 12, BED.y - 12, 8, 7, '#e6c39b')
    px(ctx, BED.x + 11, BED.y - 13, 9, 3, '#1f1d22')
    dot(ctx, BED.x + 17, BED.y - 9, '#2a2020')
    px(ctx, BED.x + 20, BED.y - 10, 50, 8, '#6e7fa0')
    px(ctx, BED.x + 20, BED.y - 10, 50, 1, '#8a9aba')
    for (let i = 0; i < 3; i++) {
      const f = mod(env.t * 0.4 + i / 3, 1)
      grid(ctx, ['KKK', '.K.', 'KKK'], BED.x + 20 + f * 10 + i * 2, BED.y - 14 - f * 16, { K: '#c9bfa5' })
    }
  },
}

const THINK_FOCUS = { x: 56, y: 22, w: 160, h: 90 }
const BUB = { x: 112, y: 30, w: 60, h: 40 }

function thinkBubble(ctx: Ctx) {
  bubble(ctx, BUB.x, BUB.y, BUB.w, BUB.h, POET.x + 16, POET.y - 4)
}

const thinkHome: Sprite = {
  id: 'jy_think_home',
  name: '고향 생각',
  z: 50,
  fx: { headDown: 1 },
  focus: THINK_FOCUS,
  draw(ctx) {
    thinkBubble(ctx)
    const x = BUB.x + 3
    const y = BUB.y + 3
    px(ctx, x, y, BUB.w - 6, 20, '#c9d8e6')
    for (let i = 0; i < BUB.w - 6; i++) px(ctx, x + i, y + 12 - Math.round(Math.sin(i * 0.12) * 5), 1, 9, '#8fa6b8')
    px(ctx, x, y + 20, BUB.w - 6, BUB.h - 26, '#9fbf7a')
    house(ctx, x + 12, y + 14)
    px(ctx, x + 44, y + 24, 6, 1, '#7da0c8')
    moon(ctx, x + 46, y + 5, 2, false)
  },
}
const thinkFeast: Sprite = {
  id: 'jy_think_feast',
  name: '잔치 생각',
  z: 50,
  fx: { headDown: 1 },
  focus: THINK_FOCUS,
  draw(ctx, env) {
    thinkBubble(ctx)
    const x = BUB.x + 8
    const y = BUB.y + 18
    px(ctx, x, y, 44, 4, '#9a3a2a')
    px(ctx, x + 2, y + 4, 2, 10, '#6b2a1c')
    px(ctx, x + 40, y + 4, 2, 10, '#6b2a1c')
    for (let i = 0; i < 5; i++) {
      px(ctx, x + 3 + i * 8, y - 3, 6, 3, '#efe6cf')
      dot(ctx, x + 5 + i * 8, y - 4, i % 2 ? '#e0703a' : '#8ab04a')
    }
    if (Math.sin(env.t * 3) > 0) for (let i = 0; i < 3; i++) dot(ctx, x + 10 + i * 12, y - 8 - i, '#d8d8d8')
  },
}
const thinkOffice: Sprite = {
  id: 'jy_think_office',
  name: '벼슬 생각',
  z: 50,
  fx: { headDown: 1 },
  focus: THINK_FOCUS,
  draw(ctx, env) {
    thinkBubble(ctx)
    const x = BUB.x + 14
    const y = BUB.y + 8
    grid(ctx, ['....KKKK....', '...KKKKKK...', 'KKKKKKKKKKKK', '...KKKKKK...'], x, y + 6, { K: '#1f1d22' })
    px(ctx, x + 18, y + 18, 10, 8, '#d9a441')
    px(ctx, x + 20, y + 15, 6, 3, '#b07a20')
    if (Math.sin(env.t * 4) > 0.4) sparkle(ctx, x + 28, y + 14, '#fffbe0', true)
  },
}

export const JINGYESI_SPRITES: Sprite[] = [
  moonlight, sunlight, candle,
  frost, puddle, petals,
  lookUp, reading, sleeping,
  thinkHome, thinkFeast, thinkOffice,
]
