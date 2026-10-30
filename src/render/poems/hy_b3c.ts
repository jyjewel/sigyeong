// 『唐詩畫意』 卷八 셋째 묶음 (3): 錢起〈江行無題〉 其五·其六〈宿洞口館〉〈銜魚翠鳥〉〈田鶴〉, 韓翃〈漢宮曲〉, 皇甫冉〈病中對石竹花〉
import type { Background } from '../types'
import { H, W, disc, dot, fillRows, hash, mod, px } from '../pixel'
import type { Ctx, Env } from '../pixel'
import { bamboo, bird, boat, house, hut, mistBands, moon, person, pine, rain, ridge, sky, snowfall, stars, withAlpha } from '../kit'
import { OTHER_PALS, pal, seatFig, standFig } from '../figures'
import { drift, lotusFlower, lotusPad, mix, shimmer, soundArcs, sp, stone, sun, water } from './hy_kit'

const FULL = { x: 0, y: 0, w: 320, h: 180 }
const FISHER = pal({ R: '#6e6450', r: '#544c3c', K: '#a89567', H: '#1f1d22' })

// ════════════════════════════════════════════════════════════
// 錢起〈江行無題〉 其五: 전란 뒤의 새벽 나루
// ════════════════════════════════════════════════════════════
const J5_WATER = 124
const j5Sand = (y: number): [number, number] => {
  const d = (y - 150) / 8
  const w = 64 * Math.sqrt(Math.max(0, 1 - d * d))
  return [250 - w, 250 + w]
}

export const jiangxing5Background: Background = {
  id: 'hy046',
  drawBack(ctx) {
    sky(ctx, ['#5a6478', '#76808e', '#9aa0a4', '#b4b4ac'], J5_WATER)
    ridge(ctx, (x) => 100 + 6 * Math.sin(x * 0.024 + 1), '#5a6466', '#666e70', 0, W, J5_WATER)
    water(ctx, J5_WATER, H, '#8a9aa2', '#6a7a86', '#aab8bc')
    // 왼쪽 기슭
    fillRows(ctx, 104, H, (y) => [0, 150 - (y - 104) * 1.2], (y) => (y < 108 ? '#7a7a62' : '#686a54'))
    // 나루 말뚝과 널
    px(ctx, 96, 136, 44, 3, '#5a4632')
    for (const x of [100, 118, 136]) px(ctx, x, 139, 2, 10, '#4a3a28')
    fillRows(ctx, 142, 158, j5Sand, (y) => (y < 146 ? '#d0ccbc' : '#b8b4a4'))
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    shimmer(ctx, env.t, J5_WATER + 3, 178, 12, '#c8d0d4', 140, W)
  },
}

const J5_ASH = { x: 0, y: 80, w: 96, h: 54 }
const J5_VILLAGE = { x: 40, y: 72, w: 112, h: 63 }
const J5_FERRY = { x: 72, y: 112, w: 112, h: 63 }
const J5_SAND = { x: 176, y: 96, w: 144, h: 81 }

export const JIANGXING5_SPRITES = [
  sp('j5_ash', '전쟁이 남긴 잿더미', 20, J5_ASH, (ctx, env) => {
    for (const [x, h] of [[14, 14], [24, 8], [44, 16], [58, 6]] as const) {
      px(ctx, x, 120 - h, 3, h, '#2a2422')
      dot(ctx, x + 1, 120 - h - 1, '#3a302a')
    }
    px(ctx, 10, 108, 30, 2, '#2a2422')
    for (let k = 0; k < 6; k++) fillRows(ctx, 118, 124, (y) => [8 + k * 11 - (y - 118), 16 + k * 11 + (y - 118)], '#5a5450')
    for (let k = 0; k < 4; k++) if (Math.sin(env.t * 4 + k * 2) > 0.3) dot(ctx, 14 + k * 14, 121, '#e8702a')
    for (let k = 0; k < 3; k++) {
      const f = mod(env.t * 0.15 + k / 3, 1)
      withAlpha(ctx, 0.5 * (1 - f), () => disc(ctx, 22 + k * 16 + f * 10, 112 - f * 30, 2 + f * 6, '#8a8a8a'))
    }
  }),
  sp('j5_flowers', '꽃밭', 20, J5_ASH, (ctx) => {
    for (let k = 0; k < 14; k++) px(ctx, 8 + k * 5, 116 + (k % 3) * 2, 2, 2, ['#e88aa0', '#f4d060', '#f4f0e0'][k % 3])
  }),
  sp('j5_newhouse', '새로 지은 기와집', 20, J5_ASH, (ctx) => house(ctx, 14, 106)),

  sp('j5_few', '겨우 몇 채뿐인 가난한 마을', 18, J5_VILLAGE, (ctx, env) => {
    for (const [x, y] of [[74, 98], [100, 102], [124, 96]] as const) {
      hut(ctx, x, y)
      px(ctx, x + 1, y + 1, 4, 2, '#8a7a4a')
    }
    withAlpha(ctx, 0.5, () => px(ctx, 108 + Math.sin(env.t) * 2, 88, 2, 10, '#c8c8c0'))
  }),
  sp('j5_many', '수백 채의 집', 18, J5_VILLAGE, (ctx) => {
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) house(ctx, 44 + c * 26 + (r % 2) * 8, 84 + r * 12)
  }),
  sp('j5_feast', '잔치가 열린 집', 18, J5_VILLAGE, (ctx, env) => {
    house(ctx, 84, 96)
    for (let k = 0; k < 5; k++) px(ctx, 80 + k * 8, 92 + (k % 2), 3, 4, Math.sin(env.t * 3 + k) > -0.5 ? '#e04a3a' : '#c03a2a')
    for (let k = 0; k < 4; k++) person(ctx, 76 + k * 10, 108, OTHER_PALS[k].R)
  }),

  sp('j5_empty', '아무도 없는 새벽 나루', 22, J5_FERRY, (ctx, env) => {
    boat(ctx, 156 + Math.sin(env.t * 0.8) * 1, 146, { len: 24 })
    for (let i = 0; i < 12; i++) dot(ctx, 138 + i, 140 + i * 0.4, '#8a7a5a')
    mistBands(ctx, env.t, [138, 150, 160], '#dce2e4', 0.45)
  }),
  sp('j5_crowd', '건너려는 사람이 북적이는 나루', 22, J5_FERRY, (ctx, env) => {
    boat(ctx, 156, 146, { len: 24 })
    for (let k = 0; k < 7; k++) person(ctx, 96 + k * 6, 128 - (Math.sin(env.t * 3 + k) > 0.6 ? 1 : 0), OTHER_PALS[k % 4].R)
  }),
  sp('j5_boats', '배가 여러 척 기다리는 나루', 22, J5_FERRY, (ctx) => {
    for (let k = 0; k < 4; k++) boat(ctx, 110 + k * 22, 150 + (k % 2) * 6, { len: 18 })
  }),

  sp('j5_moon', '차가운 모래톱으로 지는 새벽달', 24, J5_SAND, (ctx, env) => {
    const y = 128 + mod(env.t * 0.3, 4)
    withAlpha(ctx, 0.25, () => disc(ctx, 262, y, 12, '#f4f0dc'))
    disc(ctx, 262, y, 7, (dy) => (dy > 2 ? '#d8d4c0' : '#ece8d8'))
    withAlpha(ctx, 0.45, () => px(ctx, 230, 147, 64, 1, '#f4f0dc'))
    withAlpha(ctx, 0.3, () => {
      for (let yy = 160; yy < 176; yy += 3) px(ctx, 256 + Math.sin(env.t + yy) * 2, yy, 12, 1, '#e8ecec')
    })
  }),
  sp('j5_sun', '떠오르는 해', 24, J5_SAND, (ctx) => {
    withAlpha(ctx, 0.3, () => px(ctx, 0, 0, W, J5_WATER, '#e89a6a'))
    sun(ctx, 262, 116, 9, '#f0a050')
  }),
  sp('j5_geese', '기러기 떼', 24, J5_SAND, (ctx, env) => {
    for (let k = 0; k < 7; k++) {
      const off = Math.abs(k - 3)
      bird(ctx, 220 + k * 9 + mod(env.t * 4, 30), 110 + off * 4, Math.floor(env.t * 4 + k) % 2, '#3a3a40')
    }
  }),
]

// ════════════════════════════════════════════════════════════
// 錢起〈江行無題〉 其六: 대숲 길의 어부 집
// ════════════════════════════════════════════════════════════
const J6_GROUND = 126
const j6Path = (t: number) => ({ x: 34 + t * 168 + Math.sin(t * 6) * 10, y: 178 - t * 52 })
const J6_FISHER = { x: 234, y: 110 }
const J6_GUEST = { x: 204, y: 110 }

export const jiangxing6Background: Background = {
  id: 'hy047',
  drawBack(ctx) {
    sky(ctx, ['#9cc4dc', '#b4d4e4', '#cce0e4'], J6_GROUND)
    ridge(ctx, (x) => 96 + 8 * Math.sin(x * 0.02 + 3), '#8aaaa4', '#96b6ae', 0, W, J6_GROUND)
    px(ctx, 0, 112, W, H - 112, '#8aa66a')
    water(ctx, 158, H, '#8ab0b4', '#6a8e96', '#b4d0d0', 180, W)
    fillRows(ctx, 150, 158, (y) => [180 + (158 - y) * 2, W], '#c8c0a0')
    for (let t = 0; t <= 1; t += 0.004) {
      const p = j6Path(t)
      px(ctx, p.x - 3 + t * 2, p.y, 7 - t * 4, 1, '#c8b88a')
    }
    hut(ctx, 266, 112)
    px(ctx, 196, J6_GROUND, 100, 2, '#b8aa80')
  },
  drawFront() {},
  drawDynamic() {},
}

const J6_PATH = { x: 8, y: 60, w: 192, h: 108 }
const J6_YARD = { x: 184, y: 76, w: 128, h: 72 }

export const JIANGXING6_SPRITES = [
  sp('j6_bamboo', '가는 대숲 사이 어부 집 길', 22, J6_PATH, (ctx, env) => {
    for (let k = 0; k < 18; k++) {
      const t = k / 18
      const p = j6Path(t)
      const side = k % 2 ? 1 : -1
      const x = p.x + side * (14 - t * 6)
      const h = 30 + hash(k) * 16 - t * 10
      for (let i = 0; i < h; i++) dot(ctx, x + Math.sin(env.t + k) * (i / h) * 1.5, p.y - i, i % 7 ? '#6a9a4a' : '#4a7a34')
      for (let i = 6; i < h; i += 6) px(ctx, x + Math.sin(env.t + k) * (i / h) * 1.5 + (i % 12 ? 1 : -4), p.y - i, 4, 1, '#8ab868')
    }
  }),
  sp('j6_pine', '소나무 숲길', 22, J6_PATH, (ctx) => {
    for (let k = 0; k < 6; k++) {
      const p = j6Path(k / 6)
      pine(ctx, p.x + (k % 2 ? 16 : -16), p.y, 1.2 - k * 0.08)
    }
  }),
  sp('j6_rocks', '바위 비탈길', 22, J6_PATH, (ctx) => {
    for (let k = 0; k < 9; k++) {
      const p = j6Path(k / 9)
      stone(ctx, p.x + (k % 2 ? 14 : -14), p.y, 6 - k * 0.4, '#a8a49a', '#7e7a70')
    }
  }),

  sp('j6_line', '맑은 햇볕 아래 낚싯줄 매는 어부', 24, J6_YARD, (ctx, env) => {
    sun(ctx, 40, 30, 8)
    seatFig(ctx, J6_FISHER.x, J6_FISHER.y, FISHER, true)
    px(ctx, J6_FISHER.x - 16, J6_FISHER.y + 11, 20, 1, '#5a4632')
    const k = Math.sin(env.t * 4) > 0 ? 1 : 0
    for (let i = 0; i < 10; i++) dot(ctx, J6_FISHER.x - 16 - i * 0.6, J6_FISHER.y + 12 + i, '#d8d4c4')
    dot(ctx, J6_FISHER.x + 1, J6_FISHER.y + 10 + k, '#e6c39b')
  }),
  sp('j6_nap', '낮잠 자는 어부', 24, J6_YARD, (ctx, env) => {
    px(ctx, J6_FISHER.x - 4, J6_FISHER.y + 13, 18, 3, FISHER.R)
    px(ctx, J6_FISHER.x + 14, J6_FISHER.y + 12, 4, 4, '#e6c39b')
    for (let k = 0; k < 3; k++) {
      const f = mod(env.t * 0.4 + k / 3, 1)
      withAlpha(ctx, 1 - f, () => px(ctx, J6_FISHER.x + 18 + f * 6 + k * 2, J6_FISHER.y + 6 - f * 10 - k * 3, 3, 1, '#4a5a6a'))
    }
  }),
  sp('j6_paint', '배에 칠하는 어부', 24, J6_YARD, (ctx) => {
    boat(ctx, 250, 150, { len: 26, hull: '#8a4a2a' })
    person(ctx, 266, 136, FISHER.R, { hat: '#a89567' })
  }),

  sp('j6_welcome', '반가이 불러 앉힌 손님', 26, J6_YARD, (ctx, env) => {
    px(ctx, J6_GUEST.x - 4, J6_GUEST.y + 15, 50, 2, '#c8a868')
    seatFig(ctx, J6_GUEST.x, J6_GUEST.y, pal())
    for (let k = 0; k < 2; k++) {
      const f = mod(env.t * 0.5 + k / 2, 1)
      withAlpha(ctx, 1 - f, () => {
        px(ctx, 226 + k * 6, 102 - f * 8, 1, 2, '#d8504a')
        px(ctx, 225 + k * 6, 103 - f * 8, 3, 1, '#d8504a')
      })
    }
  }),
  sp('j6_shut', '닫힌 문 앞의 손님', 26, J6_YARD, (ctx) => {
    px(ctx, 273, 121, 6, 6, '#3a2a1c')
    standFig(ctx, J6_GUEST.x, J6_GUEST.y - 6, pal())
  }),
  sp('j6_dog', '손님에게 짖는 개', 26, J6_YARD, (ctx, env) => {
    standFig(ctx, J6_GUEST.x - 10, J6_GUEST.y - 6, pal())
    px(ctx, 214, 120, 9, 5, '#8a6a4a')
    px(ctx, 211, 117, 4, 4, '#8a6a4a')
    if (Math.sin(env.t * 7) > 0) soundArcs(ctx, 210, 118, env.t, '#4a3a2a', 10)
  }),

  sp('j6_caltrop', '나누어 준 마름 열매', 28, J6_YARD, (ctx) => {
    px(ctx, 220, 123, 12, 4, '#a8864a')
    px(ctx, 219, 122, 14, 1, '#c8a868')
    for (let k = 0; k < 4; k++) {
      const x = 221 + k * 3
      px(ctx, x, 120, 2, 2, '#3a2a2a')
      dot(ctx, x - 1, 119, '#3a2a2a')
      dot(ctx, x + 2, 119, '#3a2a2a')
    }
  }),
  sp('j6_wine', '술 한 병', 28, J6_YARD, (ctx) => {
    px(ctx, 223, 116, 6, 10, '#8a6a4a')
    px(ctx, 224, 113, 4, 3, '#6a4a32')
  }),
  sp('j6_fish', '말린 물고기', 28, J6_YARD, (ctx) => {
    px(ctx, 216, 114, 20, 1, '#5a4632')
    for (let k = 0; k < 4; k++) px(ctx, 218 + k * 5, 115, 2, 7, '#a8a08a')
  }),
]

// ════════════════════════════════════════════════════════════
// 錢起〈宿洞口館〉: 골짜기 어귀의 빈 객관
// ════════════════════════════════════════════════════════════
const DK_DOOR = { x: 152, y: 108, w: 16, h: 22 }
const dkStream = (t: number) => ({ x: 320 - t * 170, y: 150 + Math.sin(t * 5) * 6 - t * 4 })
const DK_STEPS = [0, 1, 2].map((k) => ({ x: 132 - k * 6, y: 130 + k * 5, w: 56 + k * 12 }))

export const dongkouBackground: Background = {
  id: 'hy048',
  drawBack(ctx) {
    sky(ctx, ['#a8acb8', '#b8b8bc', '#c8c4b8'], 120)
    // 골짜기 어귀 벼랑
    fillRows(ctx, 20, H, (y) => [0, 60 + (y - 20) * 0.3 + Math.sin(y * 0.2) * 3], (y) => (y % 8 === 0 ? '#6a6e62' : '#767a6c'))
    fillRows(ctx, 30, H, (y) => [270 - (y - 30) * 0.2 + Math.sin(y * 0.17) * 3, W], (y) => (y % 8 === 0 ? '#62665a' : '#6e7264'))
    for (let k = 0; k < 3; k++) pine(ctx, 10 + k * 18, 28 + k * 6, 0.7)
    px(ctx, 60, 120, 220, 60, '#7a7a5e')
    // 객관
    px(ctx, 110, 98, 100, 32, '#c4bca4')
    px(ctx, 106, 90, 108, 8, '#3c4048')
    px(ctx, 110, 88, 100, 2, '#4a4f57')
    for (let x = 112; x < 210; x += 16) px(ctx, x, 98, 2, 32, '#6b4a32')
    px(ctx, DK_DOOR.x, DK_DOOR.y, DK_DOOR.w, DK_DOOR.h, '#2a2620')
    px(ctx, 122, 106, 14, 10, '#8a8070')
    px(ctx, 184, 106, 14, 10, '#8a8070')
    for (const s of DK_STEPS) {
      px(ctx, s.x, s.y, s.w, 4, '#a8a294')
      px(ctx, s.x, s.y, s.w, 1, '#bcb6a8')
    }
    // 시내
    for (let t = 0; t <= 1; t += 0.005) {
      const p = dkStream(t)
      px(ctx, p.x, p.y, 3, 4 + (1 - t) * 3, '#7a9aa4')
    }
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    for (let k = 0; k < 8; k++) {
      const p = dkStream(mod(k / 8 + env.t * 0.05, 1))
      px(ctx, p.x, p.y + 1, 3, 1, '#c8dce0')
    }
  },
}

const DK_EAST = { x: 192, y: 60, w: 128, h: 108 }
const DK_DOOR_F = { x: 112, y: 88, w: 96, h: 54 }
const DK_HALL = { x: 88, y: 72, w: 144, h: 81 }
const DK_STEP = { x: 112, y: 112, w: 96, h: 54 }

export const DONGKOU_SPRITES = [
  sp('dk_bamboo', '시내까지 이어진 서늘한 들 대나무', 14, DK_EAST, (ctx, env) => {
    for (let k = 0; k < 14; k++) bamboo(ctx, 212 + k * 7, 150 - (k % 3) * 4, 46 + (k % 4) * 8, Math.sin(env.t * 0.8 + k) * 1.5, env.t)
    withAlpha(ctx, 0.12, () => px(ctx, 200, 70, 120, 90, '#9ab8d0'))
  }),
  sp('dk_willow', '늘어진 버들', 14, DK_EAST, (ctx, env) => {
    for (const bx of [232, 286]) {
      px(ctx, bx, 104, 3, 46, '#5a4632')
      for (let k = 0; k < 12; k++) for (let i = 0; i < 26; i++) dot(ctx, bx - 16 + k * 3 + Math.sin(env.t + i * 0.2) * 1.5, 100 + i, k % 2 ? '#8aa860' : '#a4bf74')
    }
  }),
  sp('dk_pine', '키 큰 소나무', 14, DK_EAST, (ctx) => {
    pine(ctx, 240, 150, 2)
    pine(ctx, 290, 150, 1.6)
  }),

  sp('dk_spring', '문 안으로 들어와 우는 가을 샘물', 22, DK_DOOR_F, (ctx, env) => {
    for (let t = 0; t <= 1; t += 0.02) {
      const x = 196 - t * 30
      const y = 150 - t * 22
      px(ctx, x, y, 3, 2, '#7a9aa4')
    }
    px(ctx, DK_DOOR.x + 2, DK_DOOR.y + 16, DK_DOOR.w - 4, 5, '#4a6a78')
    for (let k = 0; k < 3; k++) {
      const r = mod(env.t * 0.8 + k / 3, 1) * 6
      dot(ctx, DK_DOOR.x + 8 + r, DK_DOOR.y + 18, '#a8c8d4')
      dot(ctx, DK_DOOR.x + 8 - r, DK_DOOR.y + 18, '#a8c8d4')
    }
    soundArcs(ctx, DK_DOOR.x + 8, DK_DOOR.y + 12, env.t, '#d8d4c4', 18)
  }),
  sp('dk_moonlight', '문 안에 든 달빛', 22, DK_DOOR_F, (ctx) => {
    moon(ctx, 40, 20, 6)
    withAlpha(ctx, 0.55, () => px(ctx, DK_DOOR.x + 2, DK_DOOR.y + 4, DK_DOOR.w - 4, DK_DOOR.h - 4, '#e8e4c8'))
  }),
  sp('dk_leaves', '문 안에 든 낙엽', 22, DK_DOOR_F, (ctx, env) => drift(ctx, env.t, { x: DK_DOOR.x - 10, y: DK_DOOR.y - 6, w: 36, h: 30 }, 10, '#b8762a', 0.5, 4)),

  sp('dk_none', '난리 뒤로 아무도 오지 않는 객관', 24, DK_HALL, (ctx) => {
    for (let i = 0; i < 8; i++) {
      dot(ctx, DK_DOOR.x + i, DK_DOOR.y + i, '#c8c4b8')
      dot(ctx, DK_DOOR.x + DK_DOOR.w - 1 - i, DK_DOOR.y + i, '#c8c4b8')
    }
    for (let r = 2; r < 8; r += 3) for (let a = 0; a < 1.6; a += 0.3) dot(ctx, DK_DOOR.x + Math.cos(a) * r, DK_DOOR.y + Math.sin(a) * r, '#c8c4b8')
    px(ctx, 122, 106, 14, 10, '#5a5448')
    px(ctx, 184, 106, 14, 10, '#5a5448')
    for (let k = 0; k < 4; k++) px(ctx, 124 + k * 3, 106, 1, 10, '#8a8070')
  }),
  sp('dk_guests', '손님이 북적이는 객관', 24, DK_HALL, (ctx, env) => {
    px(ctx, 122, 106, 14, 10, '#f4d488')
    px(ctx, 184, 106, 14, 10, '#f4d488')
    for (let k = 0; k < 6; k++) person(ctx, 120 + k * 14, 122 - (Math.sin(env.t * 3 + k) > 0.6 ? 1 : 0), OTHER_PALS[k % 4].R)
  }),
  sp('dk_soldiers', '병사들이 지키는 객관', 24, DK_HALL, (ctx) => {
    for (const x of [140, 172]) {
      person(ctx, x, 122, '#6a3a2a', { hat: '#4a4a52' })
      px(ctx, x + 3, 112, 1, 18, '#5a4632')
      px(ctx, x + 3, 110, 1, 2, '#c8c8c8')
    }
  }),

  sp('dk_grass', '섬돌 위에 돋은 향기로운 풀', 26, DK_STEP, (ctx, env) => {
    DK_STEPS.forEach((s, k) => {
      for (let i = 0; i < 10 + k * 2; i++) {
        const x = s.x + 2 + hash(i * 3 + k) * (s.w - 4)
        const h = 2 + Math.round(hash(i * 7 + k) * 3)
        for (let j = 0; j < h; j++) dot(ctx, x + Math.sin(env.t + i) * (j / h), s.y - j, j % 2 ? '#6a9a4a' : '#8ab85a')
      }
      for (let i = 0; i < 3; i++) dot(ctx, s.x + 8 + i * 18 + k * 4, s.y - 3, '#e8d870')
    })
  }),
  sp('dk_snow', '섬돌에 쌓인 눈', 26, DK_STEP, (ctx) => {
    for (const s of DK_STEPS) px(ctx, s.x, s.y - 1, s.w, 2, '#f4f6f6')
  }),
  sp('dk_sandals', '벗어 둔 짚신', 26, DK_STEP, (ctx) => {
    px(ctx, 150, 128, 5, 2, '#c8a868')
    px(ctx, 157, 128, 5, 2, '#c8a868')
  }),
]

// ════════════════════════════════════════════════════════════
// 錢起〈銜魚翠鳥〉: 연못의 물총새
// ════════════════════════════════════════════════════════════
const CN_WATER = 124
const CN_TREE = { x: 54, top: 50 }
const CN_SPLASH = { x: 176, y: 146 }

/** 물총새. dir 1 이면 오른쪽을 본다 */
function kingfisher(ctx: Ctx, x: number, y: number, dir = 1, fish = false) {
  px(ctx, x - 3, y - 2, 6, 3, '#2a8ab0')
  px(ctx, x - 3, y + 1, 5, 2, '#e07a30')
  px(ctx, x + dir * 2 - 1, y - 4, 3, 3, '#2a7a9a')
  px(ctx, x + dir * 4 + (dir > 0 ? 0 : -3), y - 3, 4, 1, '#2a2622')
  px(ctx, x - dir * 4 - 1, y - 1, 2, 1, '#1e6a88')
  dot(ctx, x + dir * 2, y - 3, '#f4f0e0')
  if (fish) px(ctx, x + dir * 6 + (dir > 0 ? 0 : -4), y - 3, 5, 2, '#c8ccc4')
}

export const cuiniaoBackground: Background = {
  id: 'hy049',
  drawBack(ctx) {
    sky(ctx, ['#b0ccd8', '#c4d8de', '#d4e2e0'], CN_WATER)
    ridge(ctx, (x) => 104 + 6 * Math.sin(x * 0.022), '#94aaa4', '#a0b6ae', 0, W, CN_WATER)
    px(ctx, 0, 116, W, CN_WATER - 116, '#7e9a62')
    water(ctx, CN_WATER, H, '#7aa2a4', '#5a8486', '#a8c8c4')
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    shimmer(ctx, env.t, CN_WATER + 3, 178, 14, '#d0e4e0')
  },
}

const CN_POND = { x: 104, y: 112, w: 144, h: 68 }
const CN_TREE_F = { x: 0, y: 40, w: 192, h: 108 }
const CN_SPLASH_F = { x: 128, y: 112, w: 96, h: 54 }
const CN_SKY = { x: 0, y: 20, w: 224, h: 126 }

export const CUINIAO_SPRITES = [
  sp('cn_lotus', '연잎 사이', 10, CN_POND, (ctx, env) => {
    for (let k = 0; k < 14; k++) {
      const x = 120 + hash(k * 3) * 116
      const y = 132 + hash(k * 7) * 40
      if (Math.abs(x - CN_SPLASH.x) < 10 && Math.abs(y - CN_SPLASH.y) < 6) continue
      lotusPad(ctx, x, y, 5 + Math.round(hash(k) * 3))
      if (k % 4 === 0) lotusFlower(ctx, x + 2, y - 4)
    }
    withAlpha(ctx, 0.35, () => px(ctx, CN_SPLASH.x - 4 + Math.sin(env.t) * 3, CN_SPLASH.y + 4, 6, 2, '#2a3a3a'))
  }),
  sp('cn_reed', '갈대 사이', 10, CN_POND, (ctx, env) => {
    for (let k = 0; k < 24; k++) {
      const x = 116 + k * 5
      const h = 14 + hash(k) * 10
      for (let i = 0; i < h; i++) dot(ctx, x + Math.sin(env.t + k) * (i / h), 160 - i, '#a89a64')
    }
  }),
  sp('cn_rock', '바위 틈', 10, CN_POND, (ctx) => {
    for (let k = 0; k < 5; k++) stone(ctx, 130 + k * 22, 150 + (k % 2) * 6, 7, '#a8a49a', '#7e7a70')
  }),

  sp('cn_tree', '높은 나무에서 언뜻 내려옴', 20, CN_TREE_F, (ctx, env) => {
    px(ctx, CN_TREE.x - 2, CN_TREE.top + 20, 5, CN_WATER - CN_TREE.top - 12, '#4a3426')
    for (const [dx, dy, r] of [[-14, 30, 12], [12, 26, 13], [0, 14, 13], [20, 40, 8]] as const) disc(ctx, CN_TREE.x + dx, CN_TREE.top + dy, r, (d) => (d < -3 ? '#5e8a52' : '#466e40'))
    for (let i = 0; i < 24; i++) px(ctx, CN_TREE.x + 4 + i, CN_TREE.top + 44, 1, 1, '#4a3426')
    const f = mod(env.t * 0.35, 1)
    withAlpha(ctx, 0.5, () => {
      for (let g = 0; g < 1; g += 0.05) {
        const x = CN_TREE.x + 26 + g * (CN_SPLASH.x - CN_TREE.x - 26)
        const y = CN_TREE.top + 42 + g * g * (CN_SPLASH.y - CN_TREE.top - 42)
        if (Math.abs(g - f) < 0.2) dot(ctx, x, y, '#2a8ab0')
      }
    })
    if (f < 0.3) kingfisher(ctx, CN_TREE.x + 26, CN_TREE.top + 41, 1)
  }),
  sp('cn_cloud', '구름 속에서 내려옴', 20, CN_TREE_F, (ctx, env) => {
    px(ctx, 40, 50, 70, 8, '#f4f4f0')
    px(ctx, 50, 44, 50, 6, '#f4f4f0')
    kingfisher(ctx, 80 + mod(env.t * 10, 40), 66 + mod(env.t * 10, 40), 1)
  }),
  sp('cn_roof', '지붕 위에서 내려옴', 20, CN_TREE_F, (ctx) => {
    house(ctx, 30, 100)
    kingfisher(ctx, 46, 98, 1)
  }),

  sp('cn_dive', '물결 가르고 숨은 고기 잡기', 24, CN_SPLASH_F, (ctx, env) => {
    const f = mod(env.t * 0.6, 1)
    for (let k = 0; k < 10; k++) {
      const a = Math.PI + (k / 9) * Math.PI
      const r = 4 + f * 10
      dot(ctx, CN_SPLASH.x + Math.cos(a) * r, CN_SPLASH.y + Math.sin(a) * r * 0.8, '#f4fafa')
    }
    for (let a = 0; a < 6.28; a += 0.3) dot(ctx, CN_SPLASH.x + Math.cos(a) * (6 + f * 12), CN_SPLASH.y + 3 + Math.sin(a) * 2, '#c8e0e0')
    kingfisher(ctx, CN_SPLASH.x, CN_SPLASH.y - 4, 1, true)
  }),
  sp('cn_bathe', '목욕하는 새', 24, CN_SPLASH_F, (ctx, env) => {
    kingfisher(ctx, CN_SPLASH.x, CN_SPLASH.y, 1)
    for (let k = 0; k < 6; k++) if (Math.sin(env.t * 6 + k) > 0) dot(ctx, CN_SPLASH.x - 6 + k * 2, CN_SPLASH.y - 6, '#f4fafa')
  }),
  sp('cn_pluck', '연꽃을 꺾는 새', 24, CN_SPLASH_F, (ctx) => {
    lotusFlower(ctx, CN_SPLASH.x + 6, CN_SPLASH.y - 6)
    kingfisher(ctx, CN_SPLASH.x - 2, CN_SPLASH.y - 4, 1)
  }),

  sp('cn_flash', '한 점 푸른 빛으로 날아감', 30, CN_SKY, (ctx, env) => {
    const f = mod(env.t * 0.4, 1)
    const x = CN_SPLASH.x - f * 150
    const y = CN_SPLASH.y - 20 - f * 80
    for (let k = 1; k < 10; k++) withAlpha(ctx, 0.6 - k * 0.06, () => px(ctx, x + k * 5, y + k * 2.6, 2, 1, '#4ab8d8'))
    withAlpha(ctx, 0.3, () => disc(ctx, x, y, 4, '#6ad8f0'))
    px(ctx, x - 1, y - 1, 3, 2, '#2aa8d0')
    dot(ctx, x - 1, y + 1, '#e07a30')
  }),
  sp('cn_flock', '무리 지어 날아감', 30, CN_SKY, (ctx, env) => {
    for (let k = 0; k < 6; k++) kingfisher(ctx, 60 + k * 14 + mod(env.t * 6, 20), 60 + (k % 2) * 6, -1)
  }),
  sp('cn_walk', '천천히 걸어감', 30, CN_SKY, (ctx, env) => {
    kingfisher(ctx, 120 - mod(env.t * 4, 40), 118, -1)
    px(ctx, 80, 120, 60, 2, '#7e9a62')
  }),
]

// ════════════════════════════════════════════════════════════
// 錢起〈田鶴〉: 논에서 날아오르는 학
// ════════════════════════════════════════════════════════════
const TH_FIELD = 132
const TH_STAND = { x: 236, y: 156 }
const TH_RISE = { x: 178, y: 98 }
const TH_FAR = { x: 140, y: 70 }

function crane(ctx: Ctx, x: number, y: number, pose: 'up' | 'down' | 'nest') {
  const Wc = '#f6f4ee'
  px(ctx, x, y - 10, 1, 10, '#3a3530')
  px(ctx, x + 3, y - 10, 1, 10, '#3a3530')
  px(ctx, x - 3, y - 16, 10, 6, Wc)
  px(ctx, x - 5, y - 14, 3, 3, '#2a2622')
  if (pose === 'up') {
    px(ctx, x + 5, y - 26, 2, 11, Wc)
    px(ctx, x + 5, y - 22, 2, 4, '#2a2622')
    px(ctx, x + 5, y - 29, 3, 3, Wc)
    dot(ctx, x + 6, y - 30, '#d83a2a')
    px(ctx, x + 7, y - 33, 1, 4, '#c8a441')
  } else {
    for (let i = 0; i < 10; i++) px(ctx, x + 6 + i * 0.6, y - 17 + i, 2, 1, i > 6 ? Wc : i > 3 ? '#2a2622' : Wc)
    dot(ctx, x + 12, y - 7, '#d83a2a')
    px(ctx, x + 13, y - 6, 1, 4, '#c8a441')
  }
  if (pose === 'nest') px(ctx, x - 8, y - 4, 20, 5, '#8a7a4a')
}
function craneFlying(ctx: Ctx, x: number, y: number, t: number, s = 1) {
  const Wc = '#f6f4ee'
  const up = Math.sin(t * 5) > 0
  px(ctx, x - 5 * s, y - 1, 10 * s, 3 * s, Wc)
  px(ctx, x - 9 * s, y, 4 * s, 1, '#2a2622')
  px(ctx, x + 5 * s, y, 6 * s, 1, Wc)
  dot(ctx, x + 11 * s, y, '#d83a2a')
  px(ctx, x - 12 * s, y + 1, 4 * s, 1, '#3a3530')
  if (up) {
    px(ctx, x - 4 * s, y - 5 * s, 6 * s, 4 * s, Wc)
    px(ctx, x - 6 * s, y - 7 * s, 3 * s, 2 * s, '#2a2622')
  } else {
    px(ctx, x - 4 * s, y + 2, 6 * s, 4 * s, Wc)
    px(ctx, x - 6 * s, y + 5 * s, 3 * s, 2 * s, '#2a2622')
  }
}

export const tianheBackground: Background = {
  id: 'hy050',
  drawBack(ctx) {
    sky(ctx, ['#7ab0d8', '#94c0de', '#b0d0e2', '#c8dce0'], TH_FIELD)
    ridge(ctx, (x) => 112 + 8 * Math.sin(x * 0.02 + 2), '#8aa8a8', '#96b4b0', 0, W, TH_FIELD)
    for (let y = TH_FIELD; y < H; y++) px(ctx, 0, y, W, 1, y % 9 === 0 ? '#6a8a52' : mix('#9ab8b0', '#7a9a90', (y - TH_FIELD) / 48))
    for (let r = 0; r < 5; r++) for (let c = 0; c < 30; c++) px(ctx, c * 11 + (r % 2) * 5, TH_FIELD + 4 + r * 9, 1, 3, '#6a9a4a')
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    shimmer(ctx, env.t, TH_FIELD + 2, 178, 12, '#d8eaea')
  },
}

const TH_STAND_F = { x: 176, y: 108, w: 112, h: 63 }
const TH_MID = { x: 112, y: 52, w: 144, h: 81 }
const TH_FAR_F = { x: 88, y: 36, w: 112, h: 63 }
const TH_AHEAD = { x: 0, y: 24, w: 192, h: 108 }

export const TIANHE_SPRITES = [
  sp('th_sky', '푸른 하늘을 바라보는 논의 학', 20, TH_STAND_F, (ctx, env) => {
    if (env.fx.thUp) {
      for (let k = 0; k < 2; k++) {
        const r = 3 + mod(env.t * 0.6 + k / 2, 1) * 12
        for (let a = 0; a < 6.28; a += 0.35) dot(ctx, TH_STAND.x + 2 + Math.cos(a) * r, TH_STAND.y + 1 + Math.sin(a) * r * 0.3, '#e4f0f0')
      }
      return
    }
    crane(ctx, TH_STAND.x, TH_STAND.y, 'up')
    withAlpha(ctx, 0.5, () => px(ctx, TH_STAND.x - 4, TH_STAND.y + 1, 14, 1, '#e4f0f0'))
  }),
  sp('th_water', '물속을 들여다보는 학', 20, TH_STAND_F, (ctx) => crane(ctx, TH_STAND.x, TH_STAND.y, 'down')),
  sp('th_nest', '둥지에 앉은 학', 20, TH_STAND_F, (ctx) => crane(ctx, TH_STAND.x, TH_STAND.y, 'nest')),

  sp('th_rise', '바람 없이도 스스로 날아오르는 학', 24, TH_MID, (ctx, env) => {
    if (env.fx.thFar) craneFlying(ctx, TH_FAR.x + Math.sin(env.t * 0.4) * 3, TH_FAR.y + Math.sin(env.t * 0.7) * 2, env.t, 0.6)
    else craneFlying(ctx, TH_RISE.x + Math.sin(env.t * 0.4) * 3, TH_RISE.y + Math.sin(env.t * 0.7) * 2, env.t)
    withAlpha(ctx, 0.35, () => {
      for (let k = 0; k < 5; k++) dot(ctx, TH_STAND.x - 10 + k * 6, TH_STAND.y - 2 - k * 6, '#ffffff')
    })
  }, { fx: { thUp: 1 } }),
  sp('th_blown', '바람에 떠밀려 가는 학', 24, TH_MID, (ctx, env) => {
    craneFlying(ctx, TH_RISE.x + mod(env.t * 12, 60) - 30, TH_RISE.y + 10, env.t * 2)
    for (let k = 0; k < 6; k++) withAlpha(ctx, 0.6, () => px(ctx, mod(hash(k) * 300 + env.t * 60, 320), 70 + k * 10, 18, 1, '#e8f0f4'))
  }, { fx: { thUp: 1 }, wind: 0.9 }),
  sp('th_doze', '앉아서 조는 학', 24, TH_MID, (ctx, env) => {
    for (let k = 0; k < 3; k++) {
      const f = mod(env.t * 0.4 + k / 3, 1)
      withAlpha(ctx, 1 - f, () => px(ctx, TH_STAND.x + 10 + f * 6 + k * 2, TH_STAND.y - 34 - f * 8 - k * 3, 3, 1, '#4a5a6a'))
    }
  }),

  sp('th_flake', '홀로 나는 눈 한 조각 같은 학', 26, TH_FAR_F, (ctx, env) => {
    withAlpha(ctx, 0.35 + Math.sin(env.t * 2) * 0.1, () => disc(ctx, TH_FAR.x, TH_FAR.y, 10, '#ffffff'))
    for (let k = 0; k < 6; k++) {
      const a = (k * Math.PI) / 3 + env.t * 0.2
      withAlpha(ctx, 0.6, () => {
        for (let r = 9; r < 14; r++) dot(ctx, TH_FAR.x + Math.cos(a) * r, TH_FAR.y + Math.sin(a) * r, '#ffffff')
      })
    }
  }, { fx: { thFar: 1 } }),
  sp('th_crow', '검은 까마귀 같은 새', 26, TH_FAR_F, (ctx, env) => bird(ctx, TH_FAR.x, TH_FAR.y, Math.floor(env.t * 4) % 2, '#1a1a20')),
  sp('th_kite', '종이 연', 26, TH_FAR_F, (ctx) => {
    fillRows(ctx, TH_FAR.y - 6, TH_FAR.y + 6, (y) => [TH_FAR.x - (6 - Math.abs(y - TH_FAR.y)), TH_FAR.x + (6 - Math.abs(y - TH_FAR.y))], '#e8c048')
    for (let i = 0; i < 30; i++) dot(ctx, TH_FAR.x + i * 1.2, TH_FAR.y + 6 + i * 2, '#5a4632')
  }),

  sp('th_flock', '앞서간 짝들', 28, TH_AHEAD, (ctx, env) => {
    for (let k = 0; k < 4; k++) craneFlying(ctx, 30 + k * 18 + Math.sin(env.t * 0.3) * 2, 40 + k * 5, env.t + k * 0.7, 0.5)
  }),
  sp('th_hunter', '활 든 사냥꾼', 28, TH_AHEAD, (ctx) => {
    standFig(ctx, 40, 110, pal({ R: '#6a3a2a', r: '#4a2a1e' }))
    for (let i = 0; i < 14; i++) dot(ctx, 56 + Math.sin((i / 14) * Math.PI) * 4, 110 + i, '#5a4632')
  }),
  sp('th_storm', '검은 비구름', 28, TH_AHEAD, (ctx, env) => {
    for (const [x, y, w] of [[10, 30, 90], [30, 22, 70], [60, 36, 80]] as const) px(ctx, x, y, w, 10, '#4a5058')
    ctx.save()
    ctx.beginPath()
    ctx.rect(10, 40, 130, 60)
    ctx.clip()
    rain(ctx, env.t, 30, 120, 'rgba(90,100,110,0.8)')
    ctx.restore()
  }),
]

// ════════════════════════════════════════════════════════════
// 韓翃〈漢宮曲〉: 궁궐 앞 큰길의 준마
// ════════════════════════════════════════════════════════════
const HG_ROAD = 116
const HG_HORSE = { x: 138, y: 150 }
const HG_TREE = { x: 270, y: 132 }

/** 옆에서 본 말. cloth 가 있으면 수놓은 말다래를 늘어뜨린다 */
function horse(ctx: Ctx, x: number, y: number, t: number, body: string, cloth?: string) {
  const g = Math.sin(t * 8)
  px(ctx, x - 12, y - 14, 24, 8, body)
  px(ctx, x + 10, y - 22, 5, 10, body)
  px(ctx, x + 12, y - 24, 8, 5, body)
  px(ctx, x + 11, y - 25, 2, 2, body)
  dot(ctx, x + 17, y - 23, '#1f1d22')
  px(ctx, x + 9, y - 23, 3, 8, '#2a2220')
  px(ctx, x - 15, y - 13, 3, 8, '#2a2220')
  const legs = [[-10, g], [-6, -g], [6, -g], [10, g]]
  for (const [lx, s] of legs) px(ctx, x + lx + Math.round(s * 2), y - 6, 2, 8, body)
  for (const [lx, s] of legs) px(ctx, x + lx + Math.round(s * 2), y + 1, 2, 1, '#2a2220')
  if (cloth) {
    px(ctx, x - 6, y - 16, 12, 2, '#6a3a2a')
    px(ctx, x - 7, y - 14, 14, 9, cloth)
    for (let i = 0; i < 6; i++) dot(ctx, x - 5 + i * 2, y - 11 + (i % 2) * 2, '#f4d060')
    px(ctx, x - 7, y - 6, 14, 1, '#f4d060')
  }
}

/** 궁궐 담·문루·큰길·살구나무 줄기 */
function hgStreet(ctx: Ctx, skyCols: string[]) {
  sky(ctx, skyCols, HG_ROAD)
  px(ctx, 0, 86, 130, 30, '#a8382a')
  px(ctx, 0, 82, 130, 4, '#3c4048')
  px(ctx, 30, 60, 60, 20, '#b8402e')
  px(ctx, 24, 54, 72, 6, '#3c4048')
  px(ctx, 28, 52, 64, 2, '#4a4f57')
  for (let x = 34; x < 90; x += 10) px(ctx, x, 62, 2, 18, '#e0b84a')
  fillRows(ctx, 96, HG_ROAD, () => [50, 70], '#4a2a22')
  px(ctx, 0, HG_ROAD, W, H - HG_ROAD, '#b8a888')
  for (let y = HG_ROAD + 4; y < H; y += 8) px(ctx, 0, y, W, 1, '#a89878')
  px(ctx, HG_TREE.x - 2, HG_TREE.y - 44, 4, 44, '#4a3426')
  for (const [dx, dy] of [[-16, -40], [14, -46], [-8, -54], [20, -30]] as const) {
    const n = Math.abs(dx)
    for (let i = 0; i < n; i++) dot(ctx, HG_TREE.x + Math.sign(dx) * i, HG_TREE.y + dy + i * 0.8 + 10, '#4a3426')
  }
}

export const hangongBackground: Background = {
  id: 'hy051',
  drawBack(ctx) {
    hgStreet(ctx, ['#b8c4d0', '#c8d0d4', '#d8dad4'])
  },
  drawFront() {},
  drawDynamic() {},
}

const HG_HORSE_F = { x: 88, y: 104, w: 112, h: 63 }
const HG_TREE_F = { x: 208, y: 64, w: 112, h: 81 }

export const HANGONG_SPRITES = [
  sp('hg_horse', '수놓은 말다래의 준마', 22, HG_HORSE_F, (ctx, env) => {
    horse(ctx, HG_HORSE.x, HG_HORSE.y, env.t, '#e8e2d4', '#b8352a')
    person(ctx, HG_HORSE.x - 2, HG_HORSE.y - 25, '#4b5068', { hat: '#2a2622' })
    px(ctx, HG_HORSE.x - 3, HG_HORSE.y - 18, 5, 3, '#4b5068')
  }),
  sp('hg_mule', '짐 실은 노새', 22, HG_HORSE_F, (ctx, env) => {
    horse(ctx, HG_HORSE.x, HG_HORSE.y, env.t * 0.4, '#6a5a4a')
    px(ctx, HG_HORSE.x - 10, HG_HORSE.y - 22, 18, 8, '#a8864a')
  }),
  sp('hg_ox', '소달구지', 22, HG_HORSE_F, (ctx) => {
    px(ctx, HG_HORSE.x - 4, HG_HORSE.y - 14, 22, 9, '#5a4a3a')
    px(ctx, HG_HORSE.x + 16, HG_HORSE.y - 16, 6, 6, '#5a4a3a')
    px(ctx, HG_HORSE.x - 30, HG_HORSE.y - 20, 24, 12, '#8a6a48')
    disc(ctx, HG_HORSE.x - 20, HG_HORSE.y - 4, 5, '#4a3426')
  }),

  sp('hg_dust', '네 발굽을 치는 붉은 먼지', 26, HG_HORSE_F, (ctx, env) => {
    for (let k = 0; k < 16; k++) {
      const f = mod(env.t * 0.8 + k / 16, 1)
      const x = HG_HORSE.x - 12 - f * 40 + (k % 4) * 6
      const y = HG_HORSE.y - 2 - f * 10 - (k % 3) * 2
      withAlpha(ctx, 0.7 * (1 - f), () => disc(ctx, x, y, 2 + Math.round(f * 4), k % 2 ? '#c8704a' : '#d88a60'))
    }
  }),
  sp('hg_snow', '발굽 아래 흰 눈', 26, HG_HORSE_F, (ctx, env) => {
    px(ctx, 0, HG_ROAD, W, H - HG_ROAD, '#eef2f2')
    snowfall(ctx, env.t, 40)
  }),
  sp('hg_mud', '발굽 아래 진흙탕', 26, HG_HORSE_F, (ctx) => {
    for (let k = 0; k < 6; k++) fillRows(ctx, 146 + (k % 3) * 6, 152 + (k % 3) * 6, (y) => [90 + k * 20 - (y - 146) % 6, 108 + k * 20], '#6a5a3a')
  }),

  sp('hg_late', '늦은 저녁에 돌아옴', 8, FULL, (ctx) => {
    hgStreet(ctx, ['#c88a6a', '#e0a070', '#f0bc80'])
    sun(ctx, 160, 96, 9, '#f08040', '#f4b070')
    withAlpha(ctx, 0.3, () => fillRows(ctx, HG_ROAD + 26, HG_ROAD + 34, (y) => [HG_HORSE.x + 14, HG_HORSE.x + 64 + (y - HG_ROAD - 26) * 2], '#5a3a2a'))
  }),
  sp('hg_early', '이른 아침에 돌아옴', 8, FULL, (ctx) => {
    hgStreet(ctx, ['#d8e0ec', '#e4e8ee', '#f0eee8'])
    sun(ctx, 200, 92, 7, '#f4d890')
  }),
  sp('hg_midnight', '깊은 한밤에 돌아옴', 8, FULL, (ctx, env) => {
    hgStreet(ctx, ['#121828', '#1a2236', '#222c42'])
    withAlpha(ctx, 0.5, () => px(ctx, 0, 52, W, H - 52, '#141a30'))
    stars(ctx, 20, 5, 4, 50, env.t)
    moon(ctx, 150, 30, 6)
  }),
  sp('hg_apricot', '해가 비추는 살구꽃', 24, HG_TREE_F, (ctx, env) => {
    for (let k = 0; k < 60; k++) {
      const a = hash(k * 2.3) * 6.28
      const r = Math.sqrt(hash(k * 5.7)) * 26
      const x = HG_TREE.x + Math.cos(a) * r * 1.3
      const y = HG_TREE.y - 46 + Math.sin(a) * r * 0.8
      const lit = x < HG_TREE.x
      px(ctx, x, y, 2, 2, lit ? (k % 3 ? '#f8d8d0' : '#f4b8b0') : k % 3 ? '#e8b8b8' : '#d898a0')
    }
    withAlpha(ctx, 0.2 + Math.sin(env.t) * 0.04, () => fillRows(ctx, HG_TREE.y - 76, HG_TREE.y - 20, (y) => [HG_TREE.x - 40, HG_TREE.x - (y - HG_TREE.y + 76) * 0.2], '#ffe0a0'))
    drift(ctx, env.t, { x: 220, y: 100, w: 90, h: 40 }, 8, '#f4c8c0', 0.4, 2)
  }),
  sp('hg_bamboo', '대숲', 24, HG_TREE_F, (ctx, env) => {
    for (let k = 0; k < 8; k++) bamboo(ctx, 240 + k * 9, HG_TREE.y, 50 + (k % 3) * 6, Math.sin(env.t + k), env.t)
  }),
  sp('hg_pond', '연못', 24, HG_TREE_F, (ctx) => {
    fillRows(ctx, 126, 142, (y) => [228 + Math.abs(y - 134) * 3, 310 - Math.abs(y - 134) * 3], '#7aa2b0')
  }),
]

// ════════════════════════════════════════════════════════════
// 皇甫冉〈病中對石竹花〉: 빈 섬돌 아래 패랭이꽃
// ════════════════════════════════════════════════════════════
const SC_WIN = { x: 196, y: 94, w: 40, h: 22 }
const SC_STEPS = [0, 1, 2].map((k) => ({ x: 176 - k * 8, y: 130 + k * 6, w: 92 + k * 16 }))
const SC_FLOWERS = Array.from({ length: 16 }, (_, i) => ({ x: 40 + hash(i * 2.7) * 140, y: 154 + hash(i * 4.3) * 20 }))

/** 패랭이꽃 한 송이 (톱니 꽃잎) */
function dianthus(ctx: Ctx, x: number, y: number, c: string, env?: Env) {
  const s = env ? Math.round(Math.sin(env.t * 1.3 + x) * 0.6) : 0
  px(ctx, x, y - 5, 1, 6, '#5a8a5a')
  dot(ctx, x - 1, y - 2, '#5a8a5a')
  px(ctx, x - 2 + s, y - 7, 5, 2, c)
  dot(ctx, x - 1 + s, y - 8, c)
  dot(ctx, x + 1 + s, y - 8, c)
  dot(ctx, x + s, y - 7, '#8a2a4a')
}

export const shizhuBackground: Background = {
  id: 'hy052',
  drawBack(ctx) {
    sky(ctx, ['#b8bcc0', '#c4c6c2', '#d0d0c8'], 110)
    // 담
    px(ctx, 0, 100, W, 12, '#a49c8c')
    px(ctx, 0, 98, W, 2, '#5a5e66')
    // 뜰
    px(ctx, 0, 112, W, H - 112, '#8a8a70')
    for (let y = 116; y < H; y += 7) px(ctx, 0, y, W, 1, '#828268')
    // 병자의 방
    px(ctx, 168, 70, 152, 60, '#d8d0bc')
    px(ctx, 164, 60, 160, 10, '#3c4048')
    px(ctx, 168, 58, 152, 2, '#4a4f57')
    for (let x = 170; x < W; x += 24) px(ctx, x, 70, 2, 60, '#6b4a32')
    px(ctx, SC_WIN.x, SC_WIN.y, SC_WIN.w, SC_WIN.h, '#3a3226')
    for (let x = SC_WIN.x; x <= SC_WIN.x + SC_WIN.w; x += 8) px(ctx, x, SC_WIN.y, 1, SC_WIN.h, '#8a6a48')
    for (const s of SC_STEPS) {
      px(ctx, s.x, s.y, s.w, 5, '#b4ac9c')
      px(ctx, s.x, s.y, s.w, 1, '#c8c0ae')
    }
  },
  drawFront() {},
  drawDynamic() {},
}

const SC_YARD = { x: 24, y: 96, w: 150, h: 84 }
const SC_ROOM = { x: 168, y: 72, w: 112, h: 63 }

export const SHIZHU_SPRITES = [
  sp('sc_scatter', '빈 섬돌 아래 흩어진 패랭이꽃', 12, SC_YARD, (ctx, env) => {
    SC_FLOWERS.forEach((f, i) => dianthus(ctx, f.x, f.y, i % 3 ? '#e86a8a' : '#f4a0b8', env.fx.scFall ? undefined : env))
  }),
  sp('sc_pot', '화분 속 가지런한 꽃', 12, SC_YARD, (ctx) => {
    for (let k = 0; k < 3; k++) {
      const x = 60 + k * 40
      px(ctx, x - 6, 160, 12, 8, '#a86a3a')
      for (let i = 0; i < 3; i++) dianthus(ctx, x - 3 + i * 3, 160, '#e86a8a')
    }
  }),
  sp('sc_wall', '담장 위의 꽃', 12, SC_YARD, (ctx) => {
    for (let k = 0; k < 10; k++) dianthus(ctx, 20 + k * 14, 100, '#e86a8a')
  }),

  sp('sc_drizzle', '가랑비 속에 한가로이 머금은 꽃', 22, SC_YARD, (ctx, env) => {
    rain(ctx, env.t, 50, 50, 'rgba(200,210,220,0.55)', 2)
    SC_FLOWERS.forEach((f, i) => {
      if (Math.sin(env.t * 1.5 + i) > 0.3) dot(ctx, f.x + 2, f.y - 6, '#e8f2f8')
    })
    withAlpha(ctx, 0.15, () => px(ctx, 0, 0, W, H, '#8a96a4'))
  }),
  sp('sc_sun', '한낮 햇볕', 22, SC_YARD, (ctx) => {
    sun(ctx, 60, 40, 9)
    withAlpha(ctx, 0.12, () => px(ctx, 0, 0, W, H, '#ffe8a0'))
  }),
  sp('sc_snow', '흰 눈', 22, SC_YARD, (ctx, env) => {
    snowfall(ctx, env.t, 60)
    SC_FLOWERS.forEach((f) => px(ctx, f.x - 2, f.y - 8, 5, 1, '#f4f6f6'))
  }),

  sp('sc_window', '창가에 누워 꽃을 마주한 병자', 26, SC_ROOM, (ctx) => {
    withAlpha(ctx, 0.5, () => px(ctx, SC_WIN.x, SC_WIN.y, SC_WIN.w, SC_WIN.h, '#c8c0a0'))
    px(ctx, SC_WIN.x + 2, SC_WIN.y + 14, 36, 4, '#6a5a44')
    px(ctx, SC_WIN.x + 10, SC_WIN.y + 10, 22, 5, '#8a9ab0')
    px(ctx, SC_WIN.x + 4, SC_WIN.y + 9, 6, 5, '#e6c39b')
    px(ctx, SC_WIN.x + 4, SC_WIN.y + 8, 6, 2, '#1f1d22')
    dot(ctx, SC_WIN.x + 4, SC_WIN.y + 11, '#1f1d22')
    for (let x = SC_WIN.x; x <= SC_WIN.x + SC_WIN.w; x += 8) px(ctx, x, SC_WIN.y, 1, 3, '#8a6a48')
  }),
  sp('sc_pick', '꽃을 꺾어 가는 사람', 26, SC_ROOM, (ctx) => {
    standFig(ctx, 248, 112, pal(), true)
    dianthus(ctx, 246, 126, '#e86a8a')
  }),
  sp('sc_walk', '꽃밭을 거니는 사람', 26, SC_ROOM, (ctx, env) => standFig(ctx, 236 + Math.sin(env.t * 0.3) * 20, 112, pal())),

  sp('sc_fall', '가을바람에 지는 꽃', 28, SC_YARD, (ctx, env) => {
    for (let k = 0; k < 14; k++) {
      const f = mod(env.t * 0.25 + k / 14, 1)
      const x = 40 + hash(k * 3) * 140 + f * 90
      const y = 160 - Math.sin(f * 3.14) * 30 + f * 4
      withAlpha(ctx, 1 - f * 0.6, () => px(ctx, x, y, 2, 1, k % 3 ? '#e86a8a' : '#c8a050'))
    }
    for (let k = 0; k < 4; k++) withAlpha(ctx, 0.4, () => px(ctx, mod(hash(k) * 300 + env.t * 50, 320), 130 + k * 10, 16, 1, '#e8e4d8'))
    SC_FLOWERS.forEach((f, i) => {
      if (i % 2) px(ctx, f.x - 2, f.y - 7, 5, 2, '#8a8a70')
    })
  }, { fx: { scFall: 1 }, wind: 0.7 }),
  sp('sc_bees', '모여드는 벌', 28, SC_YARD, (ctx, env) => {
    for (let k = 0; k < 6; k++) {
      const a = env.t * 2 + k
      px(ctx, 100 + Math.cos(a) * 40, 150 + Math.sin(a * 1.3) * 10, 2, 1, '#e8b830')
    }
  }),
  sp('sc_fruit', '열매를 맺은 꽃', 28, SC_YARD, (ctx) => {
    SC_FLOWERS.forEach((f) => disc(ctx, f.x, f.y - 7, 1, '#8a6a3a'))
  }),
]
