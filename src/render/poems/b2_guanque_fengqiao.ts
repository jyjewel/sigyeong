// 王之渙〈登鸛雀樓〉, 張繼〈楓橋夜泊〉
import type { Background, Sprite } from '../types'
import { H, W, disc, dot, grid, hash, mod, px } from '../pixel'
import type { Ctx, Env } from '../pixel'
import { bird, broadTree, moon, person, pine, ridge, sky, stars, veil, withAlpha } from '../kit'
import { STANDING, pal } from '../figures'

// ════════════════════════ 登鸛雀樓 ════════════════════════
const GQ_HORIZON = 104
// 황하: 왼쪽 산에서 나와 오른쪽 하늘 끝(바다)으로
const gqRiverY = (x: number) => 150 - (x - 110) * 0.2 + Math.sin(x * 0.04) * 6
const gqRiverW = (x: number) => Math.max(2, 14 - (x - 110) * 0.055)
const GQ_SUN = { x: 150, y: 70 }
const GQ_FLOORS = [
  { y: 128, x: 70 }, // 2층 난간 (발끝 y)
  { y: 92, x: 64 }, // 3층 난간
]
const GQ_MTN = (x: number) => 62 + Math.abs(Math.sin(x * 0.035 + 0.5)) * 18 + hash(x) * 2 - (x > 160 ? (x - 160) * -0.5 : 0)

function gqTower(ctx: Ctx) {
  const tiers = [
    { top: 128, bottom: 180, w: 96 },
    { top: 92, bottom: 128, w: 80 },
    { top: 62, bottom: 92, w: 64 },
  ]
  tiers.forEach((t, i) => {
    const cx = 52
    const x0 = cx - t.w / 2
    px(ctx, x0, t.top, t.w, t.bottom - t.top, '#e2d4b4')
    for (let k = 0; k <= t.w; k += 8) px(ctx, x0 + k, t.top, 2, t.bottom - t.top, '#8a2a20')
    // 처마
    const rw = t.w + 18
    px(ctx, cx - rw / 2, t.top - 6, rw, 4, '#3c4048')
    px(ctx, cx - rw / 2 + 4, t.top - 9, rw - 8, 3, '#4a4f57')
    dot(ctx, cx - rw / 2 - 1, t.top - 7, '#3c4048')
    dot(ctx, cx + rw / 2, t.top - 7, '#3c4048')
    // 난간
    if (i > 0) {
      px(ctx, x0 - 4, t.bottom - 2, t.w + 8, 2, '#6b4a32')
      for (let k = 0; k < t.w + 8; k += 4) px(ctx, x0 - 4 + k, t.bottom - 6, 1, 4, '#6b4a32')
      px(ctx, x0 - 4, t.bottom - 6, t.w + 8, 1, '#6b4a32')
    }
    if (i === 2) px(ctx, cx - 1, t.top - 16, 2, 7, '#3c4048')
  })
}

export const guanqueBackground: Background = {
  id: 'guanque',
  drawBack(ctx) {
    sky(ctx, ['#9fb6d2', '#b2c0d4', '#c8c8cc', '#dccbbf', '#ebccac', '#efc69e'], GQ_HORIZON)
    // 오른쪽 끝의 바다
    px(ctx, 250, GQ_HORIZON - 4, W - 250, 4, '#a8b8c4')
    px(ctx, 0, GQ_HORIZON, W, H - GQ_HORIZON, '#a99a6a')
    for (let i = 0; i < 60; i++) px(ctx, hash(i * 2.2) * W, GQ_HORIZON + 4 + hash(i * 3.3) * 70, 4, 1, i % 2 ? '#9a8a5a' : '#b8a878')
    // 황하 바탕
    for (let x = 110; x < W; x++) {
      const y = gqRiverY(x)
      const w = gqRiverW(x)
      px(ctx, x, y - w / 2, 1, w, '#c9a86a')
    }
  },
  drawFront(ctx) {
    // 서쪽 산 (해가 그 뒤로 진다)
    ridge(ctx, GQ_MTN, '#6e7484', '#828899', 90, 220, GQ_HORIZON + 4)
    ridge(ctx, (x) => 86 + Math.sin(x * 0.06) * 6 + hash(x) * 2, '#5a6070', undefined, 100, 200, GQ_HORIZON + 6)
    gqTower(ctx)
  },
  drawDynamic() {},
}

const GQ_SKY_FOCUS = { x: 80, y: 20, w: 240, h: 108 }

const gqSunset: Sprite = {
  id: 'gq_sunset',
  name: '산에 기대어 지는 해',
  z: 8,
  focus: GQ_SKY_FOCUS,
  draw(ctx, env) {
    const f = mod(env.t / 24, 1)
    const y = GQ_SUN.y + f * 26
    withAlpha(ctx, 0.25, () => disc(ctx, GQ_SUN.x, y, 18, '#ffcf8a'))
    disc(ctx, GQ_SUN.x, y, 9, '#ffe8b0')
    veil(ctx, 0.1, '#ff9a5a', 0, 0, W, GQ_HORIZON)
  },
}
const gqSunrise: Sprite = {
  id: 'gq_sunrise',
  name: '바다 위로 떠오르는 해',
  z: 8,
  focus: GQ_SKY_FOCUS,
  draw(ctx, env) {
    const y = GQ_HORIZON - 4 - mod(env.t * 1.5, 18)
    withAlpha(ctx, 0.25, () => disc(ctx, 296, y, 16, '#ffd0b0'))
    disc(ctx, 296, y, 8, '#fff0d8')
  },
}
const gqNoon: Sprite = {
  id: 'gq_noon',
  name: '하늘 높이 뜬 해',
  z: 8,
  focus: GQ_SKY_FOCUS,
  draw(ctx) {
    veil(ctx, 0.35, '#dfe9f2', 0, 0, W, GQ_HORIZON)
    withAlpha(ctx, 0.3, () => disc(ctx, 200, 22, 16, '#ffffff'))
    disc(ctx, 200, 22, 8, '#fffbe8')
  },
}

const GQ_RIVER_FOCUS = { x: 96, y: 88, w: 224, h: 92 }

const gqRiverSea: Sprite = {
  id: 'gq_river_sea',
  name: '바다로 흐르는 황하',
  z: 10,
  focus: GQ_RIVER_FOCUS,
  draw(ctx, env) {
    for (let i = 0; i < 40; i++) {
      const f = mod(hash(i * 3.1) + env.t * 0.04, 1)
      const x = 110 + f * (W - 110)
      const off = (hash(i * 7) - 0.5) * gqRiverW(x) * 0.8
      px(ctx, x, gqRiverY(x) + off, 3 - f * 2, 1, '#e8d4a0')
    }
    for (let i = 0; i < 12; i++) if (Math.sin(env.t * 3 + i) > 0.4) dot(ctx, 252 + i * 6, GQ_HORIZON - 3 + (i % 2), '#ffffff')
  },
}
const gqRiverFrozen: Sprite = {
  id: 'gq_river_frozen',
  name: '얼어붙은 강',
  z: 10,
  focus: GQ_RIVER_FOCUS,
  draw(ctx) {
    for (let x = 110; x < W; x++) px(ctx, x, gqRiverY(x) - gqRiverW(x) / 2, 1, gqRiverW(x), x % 7 ? '#e8eef2' : '#c8d6e0')
  },
}
const gqRiverDry: Sprite = {
  id: 'gq_river_dry',
  name: '말라붙은 강바닥',
  z: 10,
  focus: GQ_RIVER_FOCUS,
  draw(ctx) {
    for (let x = 110; x < W; x++) {
      px(ctx, x, gqRiverY(x) - gqRiverW(x) / 2, 1, gqRiverW(x), '#a8885a')
      if (hash(x) < 0.3) dot(ctx, x, gqRiverY(x), '#7a6040')
    }
  },
}

const GQ_POET_FOCUS = { x: 16, y: 56, w: 128, h: 72 }
const GQ_PAL = pal({ R: '#5a6a7a', r: '#46525e' })

function gqPoetPos(env: Env) {
  const fl = env.fx.poetFloor ? GQ_FLOORS[1] : GQ_FLOORS[0]
  return { x: fl.x, y: fl.y - 22 }
}

const gqGaze: Sprite = {
  id: 'gq_gaze',
  name: '천 리를 바라보는 시인',
  z: 40,
  focus: GQ_POET_FOCUS,
  draw(ctx, env) {
    if (env.fx.poetDown) {
      // 계단을 내려가는 모습 (아래층 문 앞)
      person(ctx, 60 + mod(env.t * 3, 12), 168, '#5a6a7a', { step: Math.floor(env.t * 4) % 2 })
      return
    }
    const p = gqPoetPos(env)
    if (env.fx.poetSit) {
      grid(ctx, STANDING.slice(0, 12).concat(['..rRRRRRRRRR..', '.rrRRRRRRRRRR.', '.rrRRRRRRRRRRR', '..rrrrrrrrrrr.']), p.x, p.y + 6, GQ_PAL)
      return
    }
    grid(ctx, STANDING, p.x, p.y, GQ_PAL)
    // 이마에 손을 얹고 먼 곳을 봄
    for (const [c, r] of [[10, 9], [11, 8], [11, 7], [11, 6]] as const) dot(ctx, p.x + c, p.y + r, GQ_PAL.R)
    px(ctx, p.x + 10, p.y + 3, 3, 1, GQ_PAL.S)
    for (let k = 0; k < 10; k++) if ((k + Math.floor(env.t * 6)) % 3 === 0) dot(ctx, p.x + 16 + k * 6, p.y + 4 - k * 0.6, '#fff6d8')
  },
}
const gqNap: Sprite = {
  id: 'gq_nap',
  name: '누각에서 낮잠 자는 시인',
  z: 40,
  focus: GQ_POET_FOCUS,
  draw(ctx, env) {
    const y = GQ_FLOORS[0].y - 4
    px(ctx, 62, y, 18, 3, '#5a6a7a')
    px(ctx, 80, y - 1, 4, 4, '#e6c39b')
    px(ctx, 80, y - 2, 4, 1, '#1f1d22')
    for (let i = 0; i < 3; i++) {
      const f = mod(env.t * 0.4 + i / 3, 1)
      grid(ctx, ['KKK', '.K.', 'KKK'], 84 + f * 8 + i, y - 8 - f * 14, { K: '#5d4a37' })
    }
  },
}
const gqDescend: Sprite = {
  id: 'gq_descend',
  name: '서둘러 내려가는 시인',
  z: 40,
  focus: GQ_POET_FOCUS,
  draw(ctx, env) {
    for (let k = 0; k < 8; k++) px(ctx, 100 + k * 3, 128 + k * 6, 4, 2, '#8a6a42')
    const f = mod(env.t / 3, 1)
    person(ctx, 100 + f * 22, 118 + f * 44, '#5a6a7a', { step: Math.floor(env.t * 6) % 2 })
  },
}

const gqClimb: Sprite = {
  id: 'gq_climb',
  name: '한 층 더 오른 시인',
  z: 41,
  fx: { poetFloor: 1 },
  focus: { x: 0, y: 20, w: 320, h: 160 },
  draw(ctx, env) {
    // 높아진 눈높이로 더 멀리 드러나는 바다
    for (let i = 0; i < 20; i++) if (Math.sin(env.t * 2 + i * 1.3) > 0.2) dot(ctx, 230 + i * 4.5, GQ_HORIZON - 6 + (i % 3), '#f4f8fa')
    withAlpha(ctx, 0.5, () => px(ctx, 228, GQ_HORIZON - 7, W - 228, 1, '#c8d6e0'))
  },
}
const gqSit: Sprite = {
  id: 'gq_sit',
  name: '그 자리에 앉아 쉬는 시인',
  z: 41,
  fx: { poetSit: 1 },
  focus: GQ_POET_FOCUS,
  draw() {},
}
const gqGoDown: Sprite = {
  id: 'gq_go_down',
  name: '누각을 내려가는 시인',
  z: 41,
  fx: { poetDown: 1 },
  focus: { x: 16, y: 100, w: 128, h: 80 },
  draw() {},
}

export const GUANQUE_SPRITES: Sprite[] = [
  gqSunset, gqSunrise, gqNoon,
  gqRiverSea, gqRiverFrozen, gqRiverDry,
  gqGaze, gqNap, gqDescend,
  gqClimb, gqSit, gqGoDown,
]

// ════════════════════════ 楓橋夜泊 ════════════════════════
const FQ_RIVER = 118
const FQ_BOAT = { x: 250, y: 150 }
const FQ_TEMPLE = { x: 196, y: 98 }

export const fengqiaoBackground: Background = {
  id: 'fengqiao',
  drawBack(ctx) {
    sky(ctx, ['#0f1428', '#151b34', '#1b2240', '#222a4a', '#2a3254'], FQ_RIVER)
    // 고소성 성벽 실루엣
    px(ctx, 60, 100, 200, FQ_RIVER - 100, '#161a2a')
    for (let x = 60; x < 260; x += 6) px(ctx, x, 97, 4, 3, '#161a2a')
    px(ctx, 140, 90, 20, 10, '#161a2a')
    px(ctx, 136, 87, 28, 3, '#1c2134')
    for (let y = FQ_RIVER; y < H; y++) px(ctx, 0, y, W, 1, y < 130 ? '#1c2640' : '#18213a')
    for (let i = 0; i < 30; i++) px(ctx, hash(i * 3) * W, FQ_RIVER + 4 + hash(i * 5) * 58, 8, 1, '#22304c')
  },
  drawFront(ctx) {
    // 강둑
    px(ctx, 0, FQ_RIVER - 6, W, 6, '#1a1e24')
    // 풍교: 돌 아치 다리
    const bx = 30
    const by = FQ_RIVER + 2
    for (let x = 0; x < 80; x++) {
      const top = by - 18 + Math.round(Math.pow((x - 40) / 40, 2) * 10)
      const archTop = by + 2 - Math.round(Math.sqrt(Math.max(0, 1 - Math.pow((x - 40) / 22, 2))) * 16)
      for (let y = top; y < by + 4; y++) if (!(Math.abs(x - 40) < 22 && y > archTop)) dot(ctx, bx + x, y, y === top ? '#5a5e6a' : '#3c404c')
    }
    // 나그네 배 (客船)
    const { x, y } = FQ_BOAT
    px(ctx, x - 18, y, 36, 3, '#3a2a1c')
    px(ctx, x - 14, y + 3, 28, 1, '#2a1e14')
    px(ctx, x - 8, y - 7, 16, 7, '#2e2a24')
    px(ctx, x - 9, y - 8, 18, 1, '#3e3a30')
    px(ctx, x + 10, y - 4, 2, 2, '#ffcf6a')
  },
  drawDynamic(ctx, env) {
    withAlpha(ctx, 0.25 + 0.05 * Math.sin(env.t * 5), () => disc(ctx, FQ_BOAT.x + 11, FQ_BOAT.y - 3, 4, '#ffd27a'))
  },
}

const FQ_SKY = { x: 64, y: 0, w: 256, h: 120 }

const fqMoonset: Sprite = {
  id: 'fq_moonset',
  name: '지는 달과 우는 까마귀',
  z: 5,
  focus: FQ_SKY,
  draw(ctx, env) {
    // 지평선에 반쯤 걸린 달
    disc(ctx, 290, 98, 8, (dy) => (dy > 0 ? '#c9b98a' : '#e8dcb0'))
    px(ctx, 280, 100, 20, 10, '#161a2a')
    // 서리 기운
    for (let i = 0; i < 50; i++) {
      const x = hash(i * 2.7) * W
      const y = hash(i * 4.1) * 90
      if (Math.sin(env.t * 1.5 + i) > 0.3) dot(ctx, x, y, '#cfe0f0')
    }
    // 까마귀
    for (let i = 0; i < 3; i++) {
      const x = 220 - mod(env.t * 8 + i * 30, 160)
      const y = 40 + i * 8 + Math.sin(env.t + i) * 3
      bird(ctx, x, y, Math.floor(env.t * 5 + i) % 2, '#05070c')
      if (Math.sin(env.t * 2 + i) > 0.7) {
        dot(ctx, x - 4, y - 3, '#a0a8c0')
        dot(ctx, x - 6, y - 4, '#a0a8c0')
      }
    }
  },
}
const fqFullMoon: Sprite = {
  id: 'fq_full_moon',
  name: '높이 뜬 보름달',
  z: 5,
  focus: FQ_SKY,
  draw(ctx, env) {
    moon(ctx, 240, 30, 10)
    stars(ctx, 30, 5, 4, 80, env.t)
  },
}
const fqDawn: Sprite = {
  id: 'fq_dawn',
  name: '해 뜨는 아침',
  z: 5,
  focus: FQ_SKY,
  draw(ctx) {
    veil(ctx, 0.55, '#e8a070', 0, 0, W, FQ_RIVER)
    veil(ctx, 0.35, '#f8d8a0', 0, 60, W, FQ_RIVER - 60)
    disc(ctx, 290, 100, 9, '#fff0c8')
  },
}

const FQ_BANK = { x: 0, y: 60, w: 320, h: 120 }

const fqMapleFire: Sprite = {
  id: 'fq_maple_fire',
  name: '강가 단풍과 고깃배 불빛',
  z: 30,
  focus: FQ_BANK,
  draw(ctx, env) {
    const dark = { dark: '#5a1e14', base: '#7a2a1c', light: '#9a3a24' }
    ;[[12, 112, 1.1], [124, 112, 0.9], [150, 112, 0.8], [300, 112, 1.2]].forEach(([x, y, s]) => broadTree(ctx, x, y, s, dark))
    ;[[70, 140], [140, 160], [196, 136]].forEach(([x, y], i) => {
      px(ctx, x - 7, y, 14, 2, '#2a1e14')
      const fl = Math.sin(env.t * 8 + i) > 0 ? 1 : 0
      px(ctx, x + 4, y - 3 - fl, 2, 3, '#ff9a2e')
      dot(ctx, x + 4, y - 4 - fl, '#ffe08a')
      withAlpha(ctx, 0.2, () => disc(ctx, x + 5, y - 2, 6, '#ffb85a'))
      for (let k = 0; k < 4; k++) if (Math.sin(env.t * 4 + k + i) > 0) px(ctx, x + 3, y + 4 + k * 2, 3, 1, '#c8803a')
    })
  },
}
const fqWillowLantern: Sprite = {
  id: 'fq_willow_lantern',
  name: '버드나무와 연등',
  z: 30,
  focus: FQ_BANK,
  draw(ctx, env) {
    ;[20, 130, 300].forEach((x) => {
      px(ctx, x - 1, 96, 2, 16, '#2a2a20')
      for (let k = 0; k < 9; k++) for (let j = 0; j < 14; j++) dot(ctx, x - 8 + k * 2 + Math.sin(env.t + j * 0.3) * 0.5, 94 + j, '#3a5a3a')
    })
    for (let i = 0; i < 6; i++) {
      const x = mod(40 + i * 45 + env.t * 3, W)
      const y = 128 + (i % 3) * 14
      px(ctx, x, y, 4, 3, '#e86a8a')
      dot(ctx, x + 1, y - 1, '#ffe08a')
    }
  },
}
const fqPineTorch: Sprite = {
  id: 'fq_pine_torch',
  name: '소나무와 횃불 행렬',
  z: 30,
  focus: FQ_BANK,
  draw(ctx, env) {
    ;[18, 140, 300].forEach((x) => pine(ctx, x, 112, 0.9, 0, { dark: '#0e1810', base: '#16241a', light: '#22362a' }))
    for (let i = 0; i < 6; i++) {
      const x = mod(i * 20 + env.t * 6, W)
      person(ctx, x, 104, '#2a2420')
      px(ctx, x + 2, 99 - (Math.sin(env.t * 9 + i) > 0 ? 1 : 0), 2, 3, '#ff9a2e')
    }
  },
}

const FQ_TEMPLE_FOCUS = { x: 128, y: 56, w: 128, h: 72 }

const fqTemple: Sprite = {
  id: 'fq_temple',
  name: '성 밖의 한산사',
  z: 6,
  focus: FQ_TEMPLE_FOCUS,
  draw(ctx) {
    const { x, y } = FQ_TEMPLE
    // 탑
    for (let k = 0; k < 5; k++) {
      px(ctx, x + 30 - (5 - k), y - 8 - k * 7, 10 - k * 0 + (5 - k) * 2, 2, '#0c0f1c')
      px(ctx, x + 32 - (5 - k) / 2, y - 6 - k * 7, 6 + (5 - k), 5, '#121628')
    }
    px(ctx, x + 35, y - 46, 1, 6, '#0c0f1c')
    // 법당
    px(ctx, x - 12, y - 4, 34, 3, '#0c0f1c')
    px(ctx, x - 8, y - 1, 26, 10, '#121628')
    px(ctx, x + 3, y + 2, 4, 3, '#e8b860')
  },
}
const fqMarket: Sprite = {
  id: 'fq_market',
  name: '북적이는 시장',
  z: 32,
  focus: FQ_TEMPLE_FOCUS,
  draw(ctx, env) {
    for (let k = 0; k < 5; k++) {
      const x = 160 + k * 18
      px(ctx, x, 96, 14, 2, '#8a3a2a')
      px(ctx, x + 2, 98, 10, 6, '#3a2a24')
      const fl = Math.sin(env.t * 6 + k) > 0
      px(ctx, x + 5, 92, 3, 3, fl ? '#ffd27a' : '#ffbf5a')
    }
    for (let i = 0; i < 6; i++) person(ctx, 162 + mod(i * 15 + env.t * 4, 90), 103, '#4a4038')
  },
}
const fqCamp: Sprite = {
  id: 'fq_camp',
  name: '군사들의 진영',
  z: 32,
  focus: FQ_TEMPLE_FOCUS,
  draw(ctx, env) {
    for (let k = 0; k < 4; k++) {
      const x = 166 + k * 22
      for (let r = 0; r < 8; r++) px(ctx, x + 8 - r, 96 + r, r * 2 + 1, 1, r % 3 ? '#5a5040' : '#6a6050')
      px(ctx, x + 8, 84, 1, 12, '#3a2a1c')
      px(ctx, x + 9, 84 + (Math.sin(env.t * 3 + k) > 0 ? 0 : 1), 5, 3, '#b2352a')
    }
    px(ctx, 240, 100, 3, 3, '#ff9a2e')
  },
}

const FQ_SOUND_FOCUS = { x: 160, y: 40, w: 160, h: 135 }

function rings(ctx: Ctx, env: Env, color: string) {
  const sx = FQ_TEMPLE.x + 4
  const sy = FQ_TEMPLE.y - 2
  for (let r = 0; r < 3; r++) {
    const f = mod(env.t / 3 + r / 3, 1)
    const x = sx + (FQ_BOAT.x - sx) * f
    const y = sy + (FQ_BOAT.y - 8 - sy) * f
    const rr = 3 + f * 10
    withAlpha(ctx, 1 - f * 0.7, () => {
      for (let a = 0; a < Math.PI * 2; a += 0.35) dot(ctx, x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.6, color)
    })
  }
}

const fqBell: Sprite = {
  id: 'fq_bell',
  name: '배에 닿는 종소리',
  z: 60,
  focus: FQ_SOUND_FOCUS,
  draw(ctx, env) {
    const { x, y } = FQ_TEMPLE
    grid(ctx, ['.KK.', 'KKKK', 'KKKK', 'KKKK', 'K..K'], x + 2, y - 18 + (Math.sin(env.t * 2) > 0 ? 0 : 1), { K: '#c9a24a' })
    rings(ctx, env, '#f6e8b8')
  },
}
const fqDrum: Sprite = {
  id: 'fq_drum',
  name: '북소리',
  z: 60,
  focus: FQ_SOUND_FOCUS,
  draw(ctx, env) {
    const { x, y } = FQ_TEMPLE
    grid(ctx, ['.WWWW.', 'RRRRRR', 'RRRRRR', '.RRRR.'], x, y - 18, { W: '#e8dcc0', R: '#a8352a' })
    rings(ctx, env, '#f0b8a8')
  },
}
const fqFlute: Sprite = {
  id: 'fq_flute',
  name: '피리 소리',
  z: 60,
  focus: FQ_SOUND_FOCUS,
  draw(ctx, env) {
    for (let i = 0; i < 4; i++) {
      const f = mod(env.t / 4 + i / 4, 1)
      const x = FQ_TEMPLE.x + (FQ_BOAT.x - FQ_TEMPLE.x) * f
      const y = FQ_TEMPLE.y - 8 + (FQ_BOAT.y - FQ_TEMPLE.y) * f + Math.sin(f * 12) * 4
      grid(ctx, ['.KK', '.K.', 'KK.'], x, y, { K: '#cfe0b8' })
    }
    px(ctx, FQ_TEMPLE.x - 2, FQ_TEMPLE.y - 14, 10, 1, '#c9a24a')
  },
}

export const FENGQIAO_SPRITES: Sprite[] = [
  fqMoonset, fqFullMoon, fqDawn,
  fqMapleFire, fqWillowLantern, fqPineTorch,
  fqTemple, fqMarket, fqCamp,
  fqBell, fqDrum, fqFlute,
]

