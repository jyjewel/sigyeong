// 『唐詩畫意』 卷八 둘째 묶음 (1): 儲光羲〈洛陽道〉, 王昌齡〈題僧房〉, 劉長卿〈逢雪宿芙蓉山主人〉〈送張十八歸桐廬〉〈入百丈澗見桃花晚開〉
import type { Background } from '../types'
import { H, W, disc, dot, fillRows, hash, mod, px } from '../pixel'
import type { Ctx } from '../pixel'
import { AUTUMN, SPRING, bamboo, broadTree, bubble, flower, house, hut, moon, person, rain, ridge, sky, snowfall, sparkle, veil, withAlpha } from '../kit'
import { OTHER_PALS, POET_PAL, drawFigure, pal, seatFig } from '../figures'
import { drift, shimmer, skiff, soundArcs, sp, stone, sun, water } from './hy_kit'

/** 달리는 말 (x, y 는 몸통 왼쪽 위) */
function horse(ctx: Ctx, x: number, y: number, t: number, color = '#6b4a32', rider?: string) {
  px(ctx, x, y, 16, 6, color)
  px(ctx, x + 14, y - 4, 4, 6, color)
  px(ctx, x + 16, y - 6, 3, 3, color)
  const leg = Math.floor(t * 8) % 2
  for (let k = 0; k < 4; k++) px(ctx, x + 1 + k * 4 + (leg && k % 2 ? 1 : 0), y + 6, 1, 6, '#4a3220')
  px(ctx, x - 3, y + 1, 3, 1, color)
  if (rider) person(ctx, x + 5, y - 9, rider)
}

// ════════════════════════════════════════════════════════════
// 儲光羲〈洛陽道〉: 멀리 낙양성, 가운데 낙수, 앞쪽 큰길
// ════════════════════════════════════════════════════════════
const LY_RIVER = { y0: 68, y1: 100 }
const lyRoad = (y: number): [number, number] => [-20 + (y - 116) * 0.4, 340 - (y - 116) * 1.2]

export const luoyangBackground: Background = {
  id: 'hy017',
  drawBack(ctx) {
    sky(ctx, ['#d2d8d8', '#dcdfda', '#e4e4dc'], 60)
    // 낙양성
    px(ctx, 10, 44, 210, 16, '#9a9284')
    for (let k = 0; k < 210; k += 8) px(ctx, 10 + k, 40, 5, 4, '#9a9284')
    for (const x of [40, 120, 196]) {
      px(ctx, x - 6, 30, 22, 14, '#b2352a')
      px(ctx, x - 9, 27, 28, 3, '#4a4f57')
    }
    px(ctx, 0, 60, W, 8, '#a8a688')
    // 낙수 (물빛은 2구 정답이 칠한다)
    water(ctx, LY_RIVER.y0, LY_RIVER.y1, '#8aa0a4', '#7a9096', '#b0c2c2')
    fillRows(ctx, LY_RIVER.y1, H, () => [0, W], (y) => (y < 118 ? '#9aa078' : '#8a9068'))
    // 큰길
    fillRows(ctx, 116, H, lyRoad, (y) => ((y - 116) % 11 === 0 ? '#b8a888' : '#c8b898'))
    for (let i = 0; i < 6; i++) broadTree(ctx, 20 + i * 56, 114, 0.8, SPRING)
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    shimmer(ctx, env.t, LY_RIVER.y0 + 3, LY_RIVER.y1 - 2, 18, '#dce8e6')
  },
}

const LY_WATER = { x: 40, y: 28, w: 192, h: 108 }
const LY_ALL = { x: 0, y: 0, w: 320, h: 180 }
const LY_ROAD = { x: 40, y: 104, w: 192, h: 76 }

export const LUOYANG_SPRITES = [
  sp('cy_thaw', '풀리는 강 얼음', 12, LY_WATER, (ctx, env) => {
    for (let i = 0; i < 9; i++) {
      const x = mod(hash(i * 2.3) * W + env.t * (6 + hash(i) * 4), W + 30) - 30
      const y = LY_RIVER.y0 + 4 + (i % 4) * 7
      px(ctx, x, y, 14 + (i % 3) * 4, 3, '#eef4f4')
      px(ctx, x + 1, y + 3, 12 + (i % 3) * 4, 1, '#b8ccd0')
    }
  }),
  sp('cy_frozen', '꽁꽁 언 강', 12, LY_WATER, (ctx) => {
    for (let y = LY_RIVER.y0; y < LY_RIVER.y1; y++) px(ctx, 0, y, W, 1, y % 5 === 0 ? '#e0eaee' : '#cedde2')
  }),
  sp('cy_dry', '바닥이 드러난 강', 12, LY_WATER, (ctx) => {
    for (let y = LY_RIVER.y0; y < LY_RIVER.y1; y++) px(ctx, 0, y, W, 1, y % 4 === 0 ? '#b8a888' : '#c8b898')
    for (let i = 0; i < 14; i++) stone(ctx, hash(i * 3.3) * W, LY_RIVER.y0 + 6 + hash(i) * 24, 3, '#a89a80', '#8a7e68')
  }),

  sp('cy_green', '푸른 봄물', 6, LY_WATER, (ctx) => {
    water(ctx, LY_RIVER.y0, LY_RIVER.y1, '#7ab0a0', '#5e9888', '#a8d0c0')
  }),
  sp('cy_muddy', '누런 흙탕물', 6, LY_WATER, (ctx) => {
    water(ctx, LY_RIVER.y0, LY_RIVER.y1, '#b0a070', '#988a5c', '#c8ba88')
  }),
  sp('cy_red', '붉은 노을빛 물', 6, LY_WATER, (ctx) => {
    water(ctx, LY_RIVER.y0, LY_RIVER.y1, '#c88a70', '#a8705c', '#e8b090')
  }),

  sp('cy_morning', '아침의 큰길', 3, LY_ALL, (ctx) => {
    sun(ctx, 260, 20, 8, '#f4d080', '#fff0c0')
    withAlpha(ctx, 0.1, () => px(ctx, 0, 0, W, H, '#fff0c0'))
  }),
  sp('cy_night', '깊은 밤', 46, LY_ALL, (ctx) => {
    veil(ctx, 0.5, '#141a30')
    moon(ctx, 250, 22, 7)
  }),
  sp('cy_dusk', '해 질 녘', 46, LY_ALL, (ctx) => {
    veil(ctx, 0.25, '#e07a40')
    sun(ctx, 250, 54, 8, '#f09050', '#ffc890')
  }),

  sp('cy_petals', '말발굽의 꽃잎', 30, LY_ROAD, (ctx, env) => {
    for (let k = 0; k < 3; k++) {
      const x = mod(k * 70 + env.t * 26, 260) + 20
      horse(ctx, x, 132 + k * 12, env.t + k, ['#6b4a32', '#e8e2d0', '#4a3a2a'][k], ['#7a4a3a', '#4f6b4a', '#6b5a7a'][k])
      for (let j = 0; j < 8; j++) {
        const f = mod(env.t * 1.3 + j / 8, 1)
        px(ctx, x - 4 - f * 16, 144 + k * 12 - Math.sin(f * Math.PI) * 10, 2, 1, j % 2 ? '#f4c4cc' : '#fbe8ea')
      }
    }
    drift(ctx, env.t, { x: 40, y: 110, w: 220, h: 50 }, 14, '#f6d4dc', 0.6, 5)
  }),
  sp('cy_ox', '눈길을 걷는 소', 30, LY_ROAD, (ctx, env) => {
    snowfall(ctx, env.t, 40)
    const x = 100 + mod(env.t * 4, 80)
    px(ctx, x, 140, 20, 9, '#5a4632')
    px(ctx, x + 18, 136, 6, 7, '#5a4632')
    px(ctx, x + 22, 134, 2, 2, '#e8e2d0')
    for (let k = 0; k < 4; k++) px(ctx, x + 2 + k * 5, 149, 2, 6, '#3a2a1a')
  }),
  sp('cy_leaves', '텅 빈 길의 낙엽', 30, LY_ROAD, (ctx, env) => {
    for (let i = 0; i < 40; i++) px(ctx, 40 + hash(i * 2.1) * 200, 124 + hash(i * 4.7) * 50, 2, 1, i % 2 ? AUTUMN.base : AUTUMN.dark)
    drift(ctx, env.t, { x: 60, y: 100, w: 180, h: 60 }, 8, AUTUMN.light, 0.6, 2)
  }),
]

// ════════════════════════════════════════════════════════════
// 王昌齡〈題僧房〉: 절의 승방과 뜰
// ════════════════════════════════════════════════════════════
const SF_ROOM = { x: 20, y: 62, w: 130, h: 66 } // 방 안 (어두운 부분)
const SF_FLOOR = 128

export const sengfangBackground: Background = {
  id: 'hy018',
  drawBack(ctx) {
    sky(ctx, ['#d6d8d0', '#dddcd2', '#e4e0d4'], 90)
    ridge(ctx, (x) => 62 + 10 * Math.sin(x * 0.02 + 1), '#9aa294', '#a8b0a2', 0, W, 96)
    fillRows(ctx, 90, H, () => [0, W], (y) => ((y - 90) % 10 === 0 ? '#bab09a' : '#c8bea8'))
    // 승방
    px(ctx, 6, 46, 162, 6, '#3c4048')
    px(ctx, 14, 40, 146, 6, '#4a4f57')
    px(ctx, 12, 52, 150, 76, '#c9bfa5')
    px(ctx, SF_ROOM.x, SF_ROOM.y, SF_ROOM.w, SF_ROOM.h, '#3a3028')
    for (const x of [12, 86, 158]) px(ctx, x, 52, 4, 76, '#6b4a32')
    px(ctx, SF_ROOM.x, SF_FLOOR - 4, SF_ROOM.w, 4, '#5a4a3a')
    // 섬돌
    px(ctx, 10, SF_FLOOR, 156, 4, '#a8a08c')
    px(ctx, 16, SF_FLOOR + 4, 144, 4, '#b8b09c')
  },
  drawFront() {},
  drawDynamic() {},
}

const SF_YARD = { x: 160, y: 40, w: 160, h: 112 }
const SF_DOOR = { x: 10, y: 92, w: 160, h: 60 }
const SF_IN = { x: 16, y: 56, w: 144, h: 81 }
const SF_AIR = { x: 40, y: 0, w: 192, h: 108 }

export const SENGFANG_SPRITES = [
  sp('sf_palm', '뜰 가득한 종려꽃', 14, SF_YARD, (ctx, env) => {
    for (let k = 0; k < 4; k++) {
      const x = 186 + k * 32
      const y = 150 - (k % 2) * 6
      px(ctx, x, y - 40, 3, 40, '#6a5236')
      for (let r = 0; r < 40; r += 4) px(ctx, x - 1, y - r, 5, 1, '#5a4430')
      for (let a = 0; a < 7; a++) {
        const ang = -Math.PI / 2 + (a - 3) * 0.45 + Math.sin(env.t + k) * 0.05
        for (let s = 0; s < 14; s++) dot(ctx, x + 1 + Math.cos(ang) * s, y - 42 + Math.sin(ang) * s * 0.8 + s * s * 0.03, '#4f7a3e')
      }
      for (let j = 0; j < 6; j++) px(ctx, x - 4 + hash(k * 6 + j) * 10, y - 38 + hash(j + k) * 4, 2, 2, '#e8c050')
    }
  }),
  sp('sf_bamboo', '대나무', 14, SF_YARD, (ctx, env) => {
    for (let k = 0; k < 8; k++) bamboo(ctx, 176 + k * 16, 150, 70 + (k % 3) * 10, Math.sin(env.t + k) * 2, env.t)
  }),
  sp('sf_mum', '국화', 14, SF_YARD, (ctx) => {
    for (let i = 0; i < 30; i++) {
      const x = 176 + hash(i * 2.9) * 130
      const y = 120 + hash(i * 1.7) * 30
      px(ctx, x, y, 1, 6, '#4f6b3a')
      flower(ctx, x, y - 1, '#e8b030', '#c88a20')
    }
  }),

  sp('sf_moss', '방까지 든 이끼', 22, SF_DOOR, (ctx) => {
    for (let i = 0; i < 120; i++) {
      const x = 16 + hash(i * 1.7) * 150
      const y = SF_FLOOR - 6 + hash(i * 3.9) * 20
      dot(ctx, x, y, i % 3 ? '#5f8a46' : '#7aa45a')
      if (i % 4 === 0) dot(ctx, x + 1, y, '#4c7438')
    }
  }),
  sp('sf_web', '거미줄', 22, SF_DOOR, (ctx) => {
    for (const [cx, cy] of [[22, 64], [146, 64]] as const) {
      for (let a = 0; a < 5; a++) for (let s = 0; s < 14; s++) dot(ctx, cx + (cx < 80 ? 1 : -1) * s * Math.cos(a * 0.35), cy + s * Math.sin(a * 0.35 + 0.1), '#c8c4b8')
    }
  }),
  sp('sf_snow', '쌓인 눈', 22, SF_DOOR, (ctx) => {
    px(ctx, 10, SF_FLOOR - 2, 156, 4, '#f4f6f6')
    px(ctx, 14, SF_FLOOR + 2, 148, 6, '#eef2f2')
    px(ctx, 6, 38, 162, 3, '#f4f6f6')
  }),

  sp('sf_silent', '말없는 마주 앉음', 30, SF_IN, (ctx) => {
    seatFig(ctx, 44, 100, pal({ K: '#8a7a6a', H: '#8a7a6a', R: '#8a5a32', r: '#6a4220', B: '#e6c39b' }))
    seatFig(ctx, 100, 100, pal(), true)
  }),
  sp('sf_argue', '큰 소리로 논쟁함', 30, SF_IN, (ctx, env) => {
    seatFig(ctx, 44, 100, pal({ K: '#8a7a6a', H: '#8a7a6a', R: '#8a5a32', r: '#6a4220', B: '#e6c39b' }))
    seatFig(ctx, 100, 100, pal(), true)
    const k = Math.floor(env.t * 2) % 2
    bubble(ctx, k ? 30 : 96, 70, 24, 14, k ? 52 : 106, 100)
    px(ctx, (k ? 30 : 96) + 6, 76, 12, 2, '#b2352a')
  }),
  sp('sf_read', '나란히 책을 읽음', 30, SF_IN, (ctx) => {
    seatFig(ctx, 50, 100, pal({ K: '#8a7a6a', H: '#8a7a6a', R: '#8a5a32', r: '#6a4220', B: '#e6c39b' }))
    seatFig(ctx, 82, 100, pal())
    px(ctx, 62, 108, 6, 4, '#e8dcc0')
    px(ctx, 94, 108, 6, 4, '#e8dcc0')
  }),

  sp('sf_scent', '허공의 기이한 향기', 40, SF_AIR, (ctx, env) => {
    px(ctx, 84, 116, 6, 4, '#8a6a42')
    for (let s = 0; s < 3; s++) {
      for (let k = 0; k < 40; k++) {
        const f = mod(env.t * 0.08 + k / 40 + s * 0.33, 1)
        const x = 87 + Math.sin(f * 9 + s * 2 + env.t * 0.5) * (6 + f * 30) + f * 40
        const y = 114 - f * 100
        withAlpha(ctx, 0.7 * (1 - f), () => dot(ctx, x, y, '#efe8f4'))
      }
    }
    for (let k = 0; k < 4; k++) if (Math.sin(env.t * 2 + k * 2) > 0.6) sparkle(ctx, 100 + k * 30, 30 + (k % 2) * 20, '#fff6d8')
  }),
  sp('sf_bell', '종소리', 40, SF_AIR, (ctx, env) => {
    px(ctx, 200, 50, 2, 16, '#5a4632')
    disc(ctx, 201, 70, 6, '#8a6a3a')
    px(ctx, 195, 70, 13, 6, '#8a6a3a')
    soundArcs(ctx, 201, 72, env.t, '#5d4a37', 40)
  }),
  sp('sf_rain', '빗소리', 40, SF_AIR, (ctx, env) => {
    veil(ctx, 0.12, '#5a6670')
    rain(ctx, env.t, 80, 140, 'rgba(120,135,150,0.7)')
  }),
]

// ════════════════════════════════════════════════════════════
// 劉長卿〈逢雪宿芙蓉山主人〉: 눈 덮인 들, 먼 푸른 산, 사립문
// ════════════════════════════════════════════════════════════
const FX_GROUND = 120
const GATE = { x: 214, y: 124 }

export const fengxueBackground: Background = {
  id: 'hy019',
  drawBack(ctx) {
    sky(ctx, ['#b8bcc4', '#c4c6ca', '#cecfce'], FX_GROUND)
    ridge(ctx, (x) => 92 + 10 * Math.sin(x * 0.02 + 0.6) + 4 * Math.sin(x * 0.08), '#6a7a80', '#7a8a90', 0, W, FX_GROUND)
    fillRows(ctx, FX_GROUND - 4, H, () => [0, W], (y) => ((y - FX_GROUND) % 9 === 0 ? '#e4e8ea' : '#eef0f0'))
    for (let i = 0; i < 40; i++) dot(ctx, hash(i * 3.1) * W, FX_GROUND + hash(i * 1.9) * 58, '#c8d0d4')
    // 사립문과 울타리
    for (let k = 0; k < 16; k++) px(ctx, 150 + k * 6, GATE.y + (k > 9 && k < 12 ? 6 : 0), 2, k > 9 && k < 12 ? 10 : 16, '#6a5236')
    px(ctx, 150, GATE.y + 4, 96, 1, '#5a4430')
    px(ctx, GATE.x, GATE.y + 6, 12, 10, '#7a6242')
    for (let k = 0; k < 4; k++) px(ctx, GATE.x + 1 + k * 3, GATE.y + 6, 1, 10, '#5a4430')
  },
  drawFront() {},
  drawDynamic() {},
}

const FX_ALL = { x: 0, y: 0, w: 320, h: 180 }
const FX_HOUSE = { x: 140, y: 60, w: 128, h: 72 }
const FX_GATE = { x: 176, y: 100, w: 112, h: 63 }
const FX_PATH = { x: 0, y: 100, w: 144, h: 80 }

export const FENGXUE_SPRITES = [
  sp('fx_dusk', '저물녘의 먼 산', 2, FX_ALL, (ctx) => {
    sky(ctx, ['#6e6a84', '#8a7a8a', '#a8888a', '#b89a90'], 96)
    ridge(ctx, (x) => 92 + 10 * Math.sin(x * 0.02 + 0.6) + 4 * Math.sin(x * 0.08), '#4e5a6a', '#5a6676', 0, W, FX_GROUND)
    withAlpha(ctx, 0.2, () => px(ctx, 0, FX_GROUND - 4, W, H, '#5a5a7a'))
  }),
  sp('fx_noon', '한낮', 2, FX_ALL, (ctx) => {
    sky(ctx, ['#a8c4dc', '#bcd2e2', '#d0dee6'], 96)
    sun(ctx, 160, 20, 8)
    ridge(ctx, (x) => 92 + 10 * Math.sin(x * 0.02 + 0.6) + 4 * Math.sin(x * 0.08), '#6a8a96', '#7a9aa6', 0, W, FX_GROUND)
  }),
  sp('fx_dawn', '동틀 무렵', 2, FX_ALL, (ctx) => {
    sky(ctx, ['#c4c8dc', '#dcc8d4', '#f0d4c8', '#f4e0cc'], 96)
    ridge(ctx, (x) => 92 + 10 * Math.sin(x * 0.02 + 0.6) + 4 * Math.sin(x * 0.08), '#7a8494', '#8a94a4', 0, W, FX_GROUND)
  }),

  sp('fx_hut', '가난한 초가', 14, FX_HOUSE, (ctx) => {
    hut(ctx, 168, 104)
    px(ctx, 164, 102, 30, 3, '#f4f6f6')
    px(ctx, 166, 100, 26, 2, '#f8fafa')
    withAlpha(ctx, 0.6, () => px(ctx, 182, 110, 4, 3, '#f0c070'))
  }),
  sp('fx_mansion', '큰 기와집', 14, FX_HOUSE, (ctx) => {
    house(ctx, 150, 104)
    house(ctx, 180, 100)
  }),
  sp('fx_tower', '높은 누각', 14, FX_HOUSE, (ctx) => {
    for (let k = 0; k < 3; k++) {
      px(ctx, 170 + k * 3, 112 - k * 16, 34 - k * 6, 12, '#b2352a')
      px(ctx, 166 + k * 3, 108 - k * 16, 42 - k * 6, 4, '#4a4f57')
    }
  }),

  sp('fx_dog', '사립문의 개 짖는 소리', 30, FX_GATE, (ctx, env) => {
    const open = Math.sin(env.t * 6) > 0
    px(ctx, 232, 132, 10, 5, '#8a6a42')
    px(ctx, 240, 128, 5, 5, '#8a6a42')
    px(ctx, 244, open ? 131 : 130, 3, open ? 2 : 1, '#6a4a2a')
    for (let k = 0; k < 4; k++) px(ctx, 233 + k * 3, 137, 1, 4, '#6a4a2a')
    px(ctx, 230, 130, 2, 2, '#8a6a42')
    if (open) soundArcs(ctx, 250, 130, env.t * 2, '#3b2a1d', 14)
  }),
  sp('fx_rooster', '닭 우는 소리', 30, FX_GATE, (ctx, env) => {
    px(ctx, 234, 128, 8, 6, '#e8e2d0')
    px(ctx, 240, 124, 4, 5, '#e8e2d0')
    px(ctx, 241, 122, 3, 2, '#c0302a')
    dot(ctx, 244, 126, '#d9a441')
    px(ctx, 232, 124, 3, 6, '#3e4a3a')
    soundArcs(ctx, 248, 124, env.t * 2, '#3b2a1d', 14)
  }),
  sp('fx_child', '아이 웃음소리', 30, FX_GATE, (ctx, env) => {
    const hop = Math.abs(Math.sin(env.t * 5)) * 3
    person(ctx, 236, 128 - hop, '#c0604a')
    soundArcs(ctx, 238, 124, env.t * 1.5, '#b2352a', 12)
  }),

  sp('fx_return', '눈보라 속 돌아오는 사람', 34, FX_PATH, (ctx, env) => {
    const x = 40 + mod(env.t * 3, 70)
    drawFigure(ctx, Math.round(x), 128, POET_PAL, { ...env, wind: 0.9 })
    ctx.save()
    ctx.beginPath()
    ctx.rect(0, 70, 200, 110)
    ctx.clip()
    snowfall(ctx, env.t * 3, 90, '#ffffff')
    for (let k = 0; k < 30; k++) {
      const y = 80 + hash(k * 2.1) * 90
      const x0 = mod(hash(k * 3.3) * 220 - env.t * 70, 220)
      px(ctx, x0, y, 6, 1, 'rgba(255,255,255,0.7)')
    }
    ctx.restore()
  }),
  sp('fx_picnic', '꽃놀이 가는 사람들', 34, FX_PATH, (ctx, env) => {
    for (let k = 0; k < 3; k++) {
      const x = 30 + k * 20 + mod(env.t * 4, 30)
      person(ctx, x, 140, OTHER_PALS[k].R)
      flower(ctx, x + 4, 139, '#f0a0b8', '#e8c050')
    }
  }),
  sp('fx_boat', '배 타고 떠나는 사람', 34, FX_PATH, (ctx, env) => {
    fillRows(ctx, 150, 170, () => [0, 140], '#8aa4ac')
    skiff(ctx, 70 - mod(env.t * 4, 50), 164, env.t, { guest: POET_PAL.R })
  }),
]

// ════════════════════════════════════════════════════════════
// 劉長卿〈送張十八歸桐廬〉: 저녁 강, 건너편 강마을
// ════════════════════════════════════════════════════════════
const ZS_WATER = 92

export const zhangshibaBackground: Background = {
  id: 'hy020',
  drawBack(ctx) {
    sky(ctx, ['#7a86a0', '#8a94aa', '#9aa2b2'], ZS_WATER)
    ridge(ctx, (x) => 70 + 8 * Math.sin(x * 0.02 + 2) + 3 * Math.sin(x * 0.09), '#4e5a6a', '#5a6676', 0, W, ZS_WATER)
    // 건너편 강마을
    px(ctx, 160, ZS_WATER - 6, 160, 6, '#5a6450')
    for (let k = 0; k < 5; k++) {
      const x = 172 + k * 24
      px(ctx, x, ZS_WATER - 14, 14, 2, '#3a3e46')
      px(ctx, x + 1, ZS_WATER - 12, 12, 6, '#8a8678')
    }
    water(ctx, ZS_WATER, H, '#6e8496', '#4e6478', '#90a6b4')
    // 이쪽 기슭
    fillRows(ctx, 150, H, (y) => [0, 80 - (y - 150) * 0.5 + (y - 150) * 2], '#4e5a44')
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    shimmer(ctx, env.t, ZS_WATER + 4, 176, 22, '#a8bccc', 80, W)
  },
}

const ZS_NEAR = { x: 40, y: 108, w: 128, h: 72 }
const ZS_MOON = { x: 60, y: 0, w: 192, h: 180 }
const ZS_WAVE = { x: 0, y: 84, w: 171, h: 96 }
const ZS_FAR = { x: 176, y: 56, w: 128, h: 72 }

export const ZHANGSHIBA_SPRITES = [
  sp('zs_boat', '작은 배에 오른 벗', 26, ZS_NEAR, (ctx, env) => {
    skiff(ctx, 116 + Math.sin(env.t * 0.3) * 6, 148, env.t, { guest: '#6b5a7a', len: 26 })
  }),
  sp('zs_horse', '말 탄 벗', 26, ZS_NEAR, (ctx, env) => horse(ctx, 50 + mod(env.t * 6, 30), 150, env.t, '#6b4a32', '#6b5a7a')),
  sp('zs_sedan', '가마 탄 벗', 26, ZS_NEAR, (ctx, env) => {
    const x = 40 + mod(env.t * 5, 30)
    px(ctx, x, 146, 14, 10, '#8a5a3a')
    px(ctx, x - 1, 144, 16, 2, '#d9a441')
    px(ctx, x - 6, 152, 26, 1, '#5a4632')
    person(ctx, x - 6, 148, '#4b5068')
    person(ctx, x + 16, 148, '#4b5068')
  }),

  sp('zs_moon', '달빛 띤 뱃길', 10, ZS_MOON, (ctx, env) => {
    moon(ctx, 150, 30, 8)
    withAlpha(ctx, 0.6, () => {
      for (let y = ZS_WATER + 4; y < 176; y += 3) {
        const w = 4 + (y - ZS_WATER) * 0.12 + Math.sin(env.t * 2 + y) * 2
        px(ctx, 150 - w / 2, y, w, 1, '#f4ecc8')
      }
    })
  }),
  sp('zs_torch', '횃불 행렬', 10, ZS_MOON, (ctx, env) => {
    for (let k = 0; k < 6; k++) {
      const x = 170 + k * 22
      person(ctx, x, ZS_WATER - 14, '#3a3e46')
      const on = Math.sin(env.t * 6 + k) > -0.4
      px(ctx, x + 3, ZS_WATER - 18, 2, 3, on ? '#ffb040' : '#e07a20')
    }
  }),
  sp('zs_rainbow', '무지개', 10, ZS_MOON, (ctx) => {
    const cols = ['#d86a6a', '#e8a85a', '#e8d86a', '#7ab86a', '#6a9ad8']
    cols.forEach((c, k) => {
      for (let a = 0; a <= Math.PI; a += 0.01) dot(ctx, 160 + Math.cos(a) * (90 - k * 3), ZS_WATER - Math.sin(a) * (70 - k * 3), c)
    })
  }),

  sp('zs_ebb', '빠지는 찬 조수', 8, ZS_WAVE, (ctx, env) => {
    // 물이 빠지며 드러난 젖은 갯벌과, 바다 쪽으로 흘러가는 물살
    fillRows(ctx, 136, 152, (y) => [0, 96 + (y - 136) * 1.5], (y) => (y % 3 ? '#8a8268' : '#9a9278'))
    for (let k = 0; k < 4; k++) px(ctx, 10 + k * 22, 138 + k * 3, 14, 1, '#6e8496')
    for (let i = 0; i < 18; i++) {
      const f = mod(env.t * 0.25 + i / 18, 1)
      const y = ZS_WATER + 8 + (i % 6) * 8
      withAlpha(ctx, Math.sin(f * Math.PI), () => {
        px(ctx, 40 + f * 260, y, 8, 1, '#c8d8e4')
        dot(ctx, 46 + f * 260, y - 1, '#c8d8e4')
        dot(ctx, 46 + f * 260, y + 1, '#c8d8e4')
      })
    }
  }),
  sp('zs_flood', '넘쳐흐르는 큰물', 8, ZS_WAVE, (ctx, env) => {
    fillRows(ctx, 140, H, () => [0, 140], '#5e7488')
    for (let k = 0; k < 8; k++) px(ctx, k * 40 + Math.sin(env.t * 2 + k) * 4, 140 + (k % 3) * 10, 18, 2, '#a8bccc')
  }),
  sp('zs_ice', '꽁꽁 언 강', 8, ZS_WAVE, (ctx) => {
    for (let y = ZS_WATER; y < H; y++) px(ctx, 60, y, W - 60, 1, y % 6 === 0 ? '#dfe8ee' : '#c8d6de')
  }),

  sp('zs_door', '밤에 닿는 집 문', 16, ZS_FAR, (ctx, env) => {
    px(ctx, 244, ZS_WATER - 12, 6, 6, '#3a2a1a')
    const on = Math.sin(env.t * 3) > -0.6
    px(ctx, 251, ZS_WATER - 16, 3, 3, on ? '#ffcf6a' : '#f0a845')
    withAlpha(ctx, 0.2, () => disc(ctx, 252, ZS_WATER - 14, 8, '#ffd27a'))
    skiff(ctx, 232, ZS_WATER + 4, env.t, { len: 16, rower: false })
  }),
  sp('zs_temple', '산꼭대기 절', 16, ZS_FAR, (ctx) => {
    px(ctx, 220, 64, 30, 3, '#2e323a')
    px(ctx, 224, 67, 22, 6, '#6a6458')
  }),
  sp('zs_gate', '큰 성문', 16, ZS_FAR, (ctx) => {
    px(ctx, 200, ZS_WATER - 24, 80, 18, '#6a6458')
    px(ctx, 232, ZS_WATER - 16, 14, 10, '#2a2018')
    px(ctx, 196, ZS_WATER - 28, 88, 4, '#3a3e46')
  }),
]

// ════════════════════════════════════════════════════════════
// 劉長卿〈入百丈澗見桃花晚開〉: 깊은 골짜기
// ════════════════════════════════════════════════════════════
const cliffL = (y: number) => 110 - y * 0.25 + Math.sin(y * 0.1) * 6
const cliffR = (y: number) => 206 + y * 0.22 + Math.sin(y * 0.09 + 2) * 6

export const baizhangBackground: Background = {
  id: 'hy021',
  drawBack(ctx) {
    sky(ctx, ['#c4d2d8', '#d2dcdc'], 60)
    fillRows(ctx, 0, H, (y) => [0, cliffL(y)], (y) => (y % 13 === 0 ? '#5a5e56' : '#686c62'))
    fillRows(ctx, 0, H, (y) => [cliffR(y), W], (y) => (y % 11 === 0 ? '#5a5e56' : '#686c62'))
    fillRows(ctx, 60, H, (y) => [cliffL(y), cliffR(y)], (y) => (y < 120 ? '#7a8278' : '#6e766c'))
    // 골짜기 바닥 시내
    fillRows(ctx, 166, H, (y) => [cliffL(y) + 10, cliffR(y) - 10], '#7a9aa0')
    for (let i = 0; i < 30; i++) px(ctx, hash(i * 2.2) * 40, hash(i * 5.5) * 180, 3, 1, '#7a7e72')
    for (let i = 0; i < 30; i++) px(ctx, 280 + hash(i * 3.2) * 40, hash(i * 4.5) * 180, 3, 1, '#7a7e72')
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    shimmer(ctx, env.t, 168, 178, 8, '#c8dce0', 130, 200)
  },
}

const BZ_FLOOR = { x: 96, y: 92, w: 128, h: 72 }
const BZ_LEFT = { x: 0, y: 0, w: 144, h: 81 }
const BZ_TREE = { x: 108, y: 96, w: 112, h: 63 }
const BZ_ALL = { x: 0, y: 0, w: 320, h: 180 }
const BZ_AIR = { x: 64, y: 30, w: 192, h: 108 }
const TREE = { x: 158, y: 164 }

/** 골짜기 바닥의 복숭아나무 줄기와 가지 */
function peachTrunk(ctx: Ctx, x: number, y: number) {
  px(ctx, x, y - 30, 3, 30, '#4a3426')
  const br: [number, number, number, number][] = [[0, -26, -14, -10], [2, -24, 14, -12], [1, -30, -6, -14], [2, -30, 8, -16]]
  for (const [ox, oy, dx, dy] of br) for (let k = 0; k <= 12; k++) dot(ctx, x + ox + (dx * k) / 12, y + oy + (dy * k) / 12, '#4a3426')
}
const blossomPts = (n: number) => Array.from({ length: n }, (_, i) => ({ x: TREE.x + (hash(i * 2.3) - 0.5) * 36, y: TREE.y - 40 + (hash(i * 4.1) - 0.5) * 20 }))

export const BAIZHANG_SPRITES = [
  sp('bz_deep', '깊은 골짜기의 나무', 14, BZ_FLOOR, (ctx) => peachTrunk(ctx, TREE.x, TREE.y)),
  sp('bz_cliff', '벼랑 꼭대기의 나무', 14, BZ_LEFT, (ctx) => {
    peachTrunk(ctx, 50, 44)
    px(ctx, 30, 44, 50, 2, '#5a5e56')
  }),
  sp('bz_village', '마을 담장 옆 나무', 14, BZ_FLOOR, (ctx) => {
    px(ctx, 120, 148, 80, 14, '#c9bfa5')
    px(ctx, 118, 146, 84, 2, '#5a5f66')
    peachTrunk(ctx, TREE.x, TREE.y - 16)
  }),

  sp('bz_bloom', '늦게 핀 복숭아꽃', 20, BZ_TREE, (ctx) => {
    for (const p of blossomPts(30)) flower(ctx, p.x, p.y, '#f0a0b4', '#f8e0a0')
  }),
  sp('bz_fruit', '주렁주렁 맺힌 열매', 20, BZ_TREE, (ctx) => {
    for (const p of blossomPts(14)) {
      disc(ctx, p.x, p.y, 2, '#f0a070')
      dot(ctx, p.x - 1, p.y - 2, '#5f8a46')
    }
  }),
  sp('bz_bare', '잎이 모두 진 나무', 20, BZ_TREE, (ctx) => {
    for (let i = 0; i < 12; i++) px(ctx, 130 + hash(i) * 56, 164 + hash(i * 3) * 6, 2, 1, AUTUMN.dark)
  }),

  sp('bz_low', '깊이 낮은 땅', 6, BZ_ALL, (ctx) => {
    withAlpha(ctx, 0.35, () => fillRows(ctx, 40, H, (y) => [cliffL(y), cliffR(y)], '#2a3040'))
    // 벼랑 위에만 드는 햇살
    withAlpha(ctx, 0.5, () => {
      fillRows(ctx, 0, 40, (y) => [0, cliffL(y)], '#f4e8b8')
      fillRows(ctx, 0, 30, (y) => [cliffR(y), W], '#f4e8b8')
    })
    sun(ctx, 60, 10, 6)
  }),
  sp('bz_planter', '늦게 나무를 심는 사람', 26, BZ_FLOOR, (ctx, env) => {
    drawFigure(ctx, 132, 142, POET_PAL, env)
    const k = Math.sin(env.t * 3) > 0
    px(ctx, 146, k ? 150 : 154, 1, 10, '#5a4632')
    px(ctx, 144, k ? 160 : 164, 5, 2, '#8a8a8a')
  }),
  sp('bz_rain', '그치지 않는 비', 46, BZ_ALL, (ctx, env) => {
    veil(ctx, 0.15, '#4a5660')
    rain(ctx, env.t, 90, 150, 'rgba(210,222,230,0.7)')
  }),

  sp('bz_breeze', '늦게 든 봄바람', 30, BZ_AIR, (ctx, env) => {
    for (let k = 0; k < 7; k++) {
      const f = mod(env.t * 0.3 + k / 7, 1)
      const x0 = 70 + f * 90
      const y0 = 40 + f * 90
      withAlpha(ctx, Math.sin(f * Math.PI), () => {
        for (let s = 0; s < 12; s++) dot(ctx, x0 + s * 2, y0 + s * 0.6 + Math.sin(s * 0.8 + env.t * 3) * 1.5, '#f4f8f0')
      })
    }
    drift(ctx, env.t, { x: 120, y: 100, w: 90, h: 60 }, 10, '#f4b8c4', 0.8, 3)
  }),
  sp('bz_winter', '세찬 겨울바람', 30, BZ_AIR, (ctx, env) => {
    ctx.save()
    ctx.beginPath()
    ctx.rect(60, 20, 200, 150)
    ctx.clip()
    snowfall(ctx, env.t * 2, 60)
    for (let k = 0; k < 16; k++) px(ctx, mod(hash(k) * 200 - env.t * 90, 200) + 60, 30 + hash(k * 3) * 130, 10, 1, '#ffffff')
    ctx.restore()
  }),
  sp('bz_still', '바람 한 점 없음', 30, BZ_AIR, (ctx) => {
    withAlpha(ctx, 0.5, () => {
      for (let k = 0; k < 4; k++) px(ctx, 110 + k * 4, 70 + k * 12, 100 - k * 8, 1, '#e8ecee')
    })
    px(ctx, 120, 120, 1, 20, '#d8d8d0')
  }),
]
