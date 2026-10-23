// 杜甫〈旅夜書懷〉: 넓은 들판과 큰 강의 밤. 배와 시인은 2구의 정답으로 나타난다.
import type { Background, Sprite } from '../types'
import { H, W, disc, dot, fillRows, grid, hash, mod, px } from '../pixel'
import type { Ctx, Env } from '../pixel'
import { bird, boat, grassBlade, moon, sky, sparkle, stars, withAlpha } from '../kit'

const HORIZON = 98
const NEAR_BANK = (x: number) => 150 + x * 0.25 // 왼쪽 아래 언덕 경계 (x<120)

export function boatPos(env: Env) {
  const m = env.fx.boat ?? 0
  if (m === 1) return { x: 205 + Math.sin(env.t * 0.35) * 22 + Math.sin(env.t * 0.9) * 4, y: 142 + Math.sin(env.t * 1.3) * 1.2 }
  if (m === 2) return { x: 205, y: 142 }
  if (m === 3) return { x: 110 + mod(env.t * 9, 230), y: 142 }
  return { x: 205, y: 142 + Math.sin(env.t * 1.2) * 0.6 }
}

function drawRiver(ctx: Ctx) {
  for (let y = HORIZON + 4; y < H; y++) px(ctx, 0, y, W, 1, y < 115 ? '#22304a' : y < 145 ? '#1d2a43' : '#18243b')
  for (let i = 0; i < 40; i++) {
    const y = HORIZON + 6 + hash(i * 3.1) * 74
    px(ctx, hash(i * 1.7) * W, y, 6 + hash(i) * 10, 1, '#26354f')
  }
}

export const lvyeBackground: Background = {
  id: 'lvye',
  drawBack(ctx) {
    sky(ctx, ['#10152b', '#151c36', '#1b2340', '#212a49', '#283255', '#2f3a5e'], HORIZON)
    // 들판 (먼 강 언덕)
    px(ctx, 0, HORIZON - 2, W, 6, '#232b25')
    for (let x = 0; x < W; x += 3) dot(ctx, x, HORIZON - 3 + (hash(x) > 0.6 ? 0 : 1), '#2b342c')
    drawRiver(ctx)
  },
  drawFront(ctx) {
    // 왼쪽 아래 가까운 강 언덕
    fillRows(ctx, 140, H, (y) => [0, Math.min(150, (y - 150) / 0.25 + 40)], '#262520')
    for (let y = 150; y < H; y++) {
      const x = Math.min(150, (y - 150) / 0.25 + 40)
      px(ctx, x - 2, y, 2, 1, '#3a3a30')
    }
    px(ctx, 0, 146, 40, 4, '#262520')
  },
  drawDynamic() {},
}

// ── 1구: 강 언덕의 풀 ───────────────────────────────────────
const BANK_FOCUS = { x: 0, y: 108, w: 128, h: 72 }

const grassGentle: Sprite = {
  id: 'ly_grass_gentle',
  name: '산들바람에 흔들리는 가는 풀',
  z: 30,
  focus: BANK_FOCUS,
  draw(ctx, env) {
    for (let i = 0; i < 70; i++) {
      const x = hash(i * 2.1) * 120
      const top = x < 40 ? 146 : NEAR_BANK(x)
      const y = top + 2 + hash(i * 3.3) * 18
      if (x > (y - 150) / 0.25 + 38) continue
      const lean = Math.sin(env.t * 1.5 + x * 0.1) * 1.5 - 0.5
      grassBlade(ctx, x, y, 5 + hash(i) * 6, lean, i % 3 ? '#6f8a5a' : '#8fa874')
    }
  },
}
const reedsStorm: Sprite = {
  id: 'ly_reeds_storm',
  name: '폭풍에 꺾인 갈대',
  z: 30,
  focus: BANK_FOCUS,
  draw(ctx, env) {
    for (let i = 0; i < 26; i++) {
      const x = 6 + i * 4.4
      const y = 160 + hash(i) * 12
      const lean = -6 - Math.abs(Math.sin(env.t * 6 + i)) * 5
      for (let k = 0; k < 14; k++) {
        const f = k / 14
        px(ctx, x + lean * f * f, y - k, 2, 1, k > 10 ? '#b09a6a' : '#7d6f4a')
      }
    }
    ctx.fillStyle = 'rgba(200,210,225,0.5)'
    for (let i = 0; i < 30; i++) {
      const x = mod(hash(i * 3) * W - env.t * 180, W)
      const y = 110 + hash(i * 7) * 70
      ctx.fillRect(Math.round(x), Math.round(y), 8, 1)
    }
  },
}
const bankBare: Sprite = {
  id: 'ly_bank_bare',
  name: '풀 없는 자갈밭',
  z: 30,
  focus: BANK_FOCUS,
  draw(ctx) {
    for (let i = 0; i < 60; i++) {
      const x = hash(i * 2.7) * 110
      const y = 152 + hash(i * 5.3) * 26
      if (x > (y - 150) / 0.25 + 36) continue
      px(ctx, x, y, 2 + (i % 2), 2, i % 3 ? '#5a5850' : '#77746a')
    }
  },
}

// ── 2구: 배 ─────────────────────────────────────────────────
const BOAT_FOCUS = { x: 140, y: 96, w: 128, h: 72 }

function poetOnDeck(ctx: Ctx, x: number, y: number, env: Env) {
  const bow = env.fx.poetBow ? 1 : 0
  const robe = env.fx.robeRed ? '#a8352a' : '#4b5068'
  px(ctx, x, y - 6 + bow, 3, 1, '#1f1d22')
  px(ctx, x, y - 5 + bow, 3, 2, '#e6c39b')
  if (env.fx.poetWhite) dot(ctx, x, y - 5 + bow, '#e8e6df')
  px(ctx, x - 1, y - 3, 5, 4, robe)
}

const boatMast: Sprite = {
  id: 'ly_boat_mast',
  name: '높은 돛대의 외로운 배',
  z: 40,
  focus: BOAT_FOCUS,
  draw(ctx, env) {
    const p = boatPos(env)
    boat(ctx, p.x, p.y, { len: 28, mast: 40, lantern: true, t: env.t })
    poetOnDeck(ctx, p.x - 8, p.y - 3, env)
    withAlpha(ctx, 0.35, () => px(ctx, p.x - 14, p.y + 2, 28, 1, '#5d6d8a'))
  },
}
const fleet: Sprite = {
  id: 'ly_fleet',
  name: '등불 밝힌 여러 배',
  z: 40,
  focus: BOAT_FOCUS,
  draw(ctx, env) {
    ;[
      [160, 128],
      [196, 140],
      [236, 132],
      [262, 150],
      [182, 158],
    ].forEach(([x, y], i) => boat(ctx, x, y + Math.sin(env.t + i) * 0.6, { len: 20, mast: 14, lantern: true, t: env.t + i }))
  },
}
const ferry: Sprite = {
  id: 'ly_ferry',
  name: '노 젓는 나룻배',
  z: 40,
  focus: BOAT_FOCUS,
  draw(ctx, env) {
    const x = 205
    const y = 142
    px(ctx, x - 9, y - 2, 18, 2, '#6b4a32')
    px(ctx, x - 7, y, 14, 1, '#4a3426')
    px(ctx, x + 3, y - 9, 3, 1, '#1f1d22')
    px(ctx, x + 3, y - 8, 3, 2, '#e6c39b')
    px(ctx, x + 2, y - 6, 5, 4, '#6b5a4a')
    const a = Math.sin(env.t * 3)
    for (let k = 0; k < 10; k++) dot(ctx, x + 6 + k * 0.8, y - 5 + k * (0.8 + a * 0.2), '#8a6a42')
  },
}

// ── 3구: 별 ─────────────────────────────────────────────────
const SKY_FOCUS = { x: 40, y: 12, w: 192, h: 108 }

const starsLow: Sprite = {
  id: 'ly_stars_low',
  name: '들판에 드리운 별',
  z: 5,
  focus: SKY_FOCUS,
  draw(ctx, env) {
    stars(ctx, 90, 3, 2, 70, env.t)
    // 지평선 가까이까지 내려온 별
    stars(ctx, 60, 41, 70, HORIZON - 4, env.t, '#fff6d8')
  },
}
const clouds: Sprite = {
  id: 'ly_clouds',
  name: '별을 가린 구름',
  z: 5,
  focus: SKY_FOCUS,
  draw(ctx, env) {
    for (let k = 0; k < 6; k++) {
      const y = 8 + k * 14
      const x = mod(k * 60 + env.t * 3, W + 120) - 120
      for (let r = 0; r < 8; r++) px(ctx, x - r * 2, y + r, 160 + r * 4, 1, r < 2 ? '#3d4560' : '#323a54')
      px(ctx, x + 140, y + 2, 120, 6, '#2e3650')
    }
  },
}
const meteors: Sprite = {
  id: 'ly_meteors',
  name: '쏟아지는 별똥별',
  z: 5,
  focus: SKY_FOCUS,
  draw(ctx, env) {
    for (let i = 0; i < 6; i++) {
      const f = mod(env.t * 0.6 + i / 6, 1)
      const x0 = 60 + hash(i * 3) * 220
      const y0 = 6 + hash(i * 5) * 30
      for (let k = 0; k < 12; k++) withAlpha(ctx, (1 - k / 12) * (1 - f), () => dot(ctx, x0 - f * 60 - k, y0 + f * 40 + k * 0.7, '#fff6d8'))
    }
  },
}

// ── 4구: 달 ─────────────────────────────────────────────────
const MOON_FOCUS = { x: 176, y: 24, w: 144, h: 144 }
const MOON = { x: 262, y: 40 }

const moonSurge: Sprite = {
  id: 'ly_moon_surge',
  name: '물결에 솟구치는 달빛',
  z: 8,
  focus: MOON_FOCUS,
  draw(ctx, env) {
    moon(ctx, MOON.x, MOON.y, 7)
    for (let y = HORIZON + 6; y < H; y += 2) {
      const f = (y - HORIZON) / (H - HORIZON)
      const w = 4 + f * 22 + Math.sin(env.t * 4 + y * 0.6) * (2 + f * 6)
      const off = Math.sin(env.t * 2.5 + y * 0.3) * (1 + f * 4)
      for (let x = -w / 2; x < w / 2; x += 2 + Math.floor(hash(y + x) * 3)) {
        const bright = Math.sin(env.t * 6 + x * 0.7 + y * 0.9) > 0
        px(ctx, MOON.x + off + x, y, 2, 1, bright ? '#f6edc6' : '#a8a88c')
      }
    }
  },
}
const moonNone: Sprite = {
  id: 'ly_moon_none',
  name: '달 지고 캄캄한 강',
  z: 8,
  focus: MOON_FOCUS,
  draw(ctx) {
    withAlpha(ctx, 0.55, () => px(ctx, 0, HORIZON + 4, W, H - HORIZON - 4, '#070a14'))
    // 지평선 아래로 사라지는 달의 끝
    px(ctx, MOON.x - 4, HORIZON - 3, 8, 1, '#8a826a')
    px(ctx, MOON.x - 2, HORIZON - 4, 4, 1, '#8a826a')
  },
}
const moonIce: Sprite = {
  id: 'ly_moon_ice',
  name: '얼어붙은 강 위의 달',
  z: 8,
  focus: MOON_FOCUS,
  draw(ctx) {
    moon(ctx, MOON.x, MOON.y, 7)
    for (let y = HORIZON + 4; y < H; y++) px(ctx, 0, y, W, 1, y % 6 === 0 ? '#8b9ab3' : '#9aa9c0')
    for (let y = HORIZON + 8; y < H; y += 3) px(ctx, MOON.x - 4, y, 8, 1, '#dfe5ee')
    for (let i = 0; i < 8; i++) {
      let x = hash(i * 3) * W
      let y = HORIZON + 10 + hash(i * 5) * 60
      for (let k = 0; k < 14; k++) {
        dot(ctx, x, y, '#6f7f9a')
        x += hash(i * 7 + k) > 0.5 ? 1 : -1
        y += 1
      }
    }
  },
}

// ── 5·6구: 문장과 벼슬 (배 위의 소품) ───────────────────────
const DECK_FOCUS = { x: 168, y: 112, w: 64, h: 36 }

const scrollHumble: Sprite = {
  id: 'ly_scroll_humble',
  name: '말아 둔 두루마리',
  z: 45,
  fx: { poetBow: 1 },
  focus: DECK_FOCUS,
  draw(ctx, env) {
    const p = boatPos(env)
    px(ctx, p.x - 2, p.y - 5, 8, 2, '#e8dcbc')
    dot(ctx, p.x - 3, p.y - 5, '#8a6a42')
    dot(ctx, p.x + 6, p.y - 5, '#8a6a42')
    px(ctx, p.x + 1, p.y - 5, 1, 2, '#b2352a')
  },
}
const scrollProud: Sprite = {
  id: 'ly_scroll_proud',
  name: '펼쳐 든 두루마리',
  z: 45,
  focus: DECK_FOCUS,
  draw(ctx, env) {
    const p = boatPos(env)
    const x = p.x - 9
    const y = p.y - 20
    px(ctx, x, y, 12, 9, '#f3ead2')
    px(ctx, x - 1, y, 1, 9, '#8a6a42')
    px(ctx, x + 12, y, 1, 9, '#8a6a42')
    for (let r = 0; r < 4; r++) px(ctx, x + 2, y + 2 + r * 2, 8, 1, '#5d4a37')
    for (let i = 0; i < 4; i++) if (Math.sin(env.t * 4 + i * 1.6) > 0.5) sparkle(ctx, x - 4 + i * 6, y - 3, '#fff3b0', true)
  },
}
const exam: Sprite = {
  id: 'ly_exam',
  name: '장원 급제의 어사화',
  z: 45,
  focus: DECK_FOCUS,
  draw(ctx, env) {
    const p = boatPos(env)
    const x = p.x - 8
    const y = p.y - 9
    for (let k = 0; k < 6; k++) dot(ctx, x + 2 + k, y - 1 - Math.round(Math.sin(k * 0.6) * 3), k % 2 ? '#e05a6a' : '#f5c84a')
    px(ctx, p.x + 4, p.y - 22, 10, 6, '#b2352a')
    px(ctx, p.x + 5, p.y - 21, 8, 4, '#d9a441')
    if (Math.sin(env.t * 4) > 0.4) sparkle(ctx, p.x + 9, p.y - 24, '#fffbe0', true)
  },
}

const hatDown: Sprite = {
  id: 'ly_hat_down',
  name: '내려놓은 관모',
  z: 46,
  focus: DECK_FOCUS,
  draw(ctx, env) {
    const p = boatPos(env)
    grid(ctx, ['.KKK.', 'KKKKK', 'kKKKk'], p.x - 2, p.y - 6, { K: '#1f1d22', k: '#3a3840' })
    for (let k = 0; k < 9; k++) dot(ctx, p.x - 14 + k * 0.3, p.y - 3 - k, '#8a6a42')
    px(ctx, p.x - 15, p.y - 12, 3, 1, '#8a6a42')
  },
}
const promoted: Sprite = {
  id: 'ly_promoted',
  name: '붉은 관복',
  z: 46,
  fx: { robeRed: 1 },
  focus: DECK_FOCUS,
  draw(ctx, env) {
    const p = boatPos(env)
    if (Math.sin(env.t * 3) > 0.2) sparkle(ctx, p.x - 6, p.y - 12, '#fffbe0', true)
    px(ctx, p.x - 10, p.y - 4, 3, 1, '#d9a441')
  },
}
const seal: Sprite = {
  id: 'ly_seal',
  name: '새 관인',
  z: 46,
  focus: DECK_FOCUS,
  draw(ctx, env) {
    const p = boatPos(env)
    withAlpha(ctx, 0.3 + 0.1 * Math.sin(env.t * 3), () => disc(ctx, p.x + 1, p.y - 7, 6, '#ffe08a'))
    px(ctx, p.x - 2, p.y - 8, 6, 5, '#d9a441')
    px(ctx, p.x - 1, p.y - 10, 4, 2, '#b07a20')
    px(ctx, p.x, p.y - 7, 2, 2, '#b2352a')
  },
}

// ── 7구: 배의 움직임 ────────────────────────────────────────
const DRIFT_FOCUS = { x: 112, y: 96, w: 192, h: 84 }

const drifting: Sprite = {
  id: 'ly_drifting',
  name: '정처 없이 떠도는 배',
  z: 35,
  fx: { boat: 1 },
  focus: DRIFT_FOCUS,
  draw(ctx, env) {
    // 구불구불한 물자국
    for (let k = 1; k < 30; k++) {
      const t = env.t - k * 0.25
      const x = 205 + Math.sin(t * 0.35) * 22 + Math.sin(t * 0.9) * 4
      withAlpha(ctx, 0.5 * (1 - k / 30), () => px(ctx, x - 3, 145 + k * 0.2, 6, 1, '#6d7f9e'))
    }
  },
}
const anchored: Sprite = {
  id: 'ly_anchored',
  name: '닻을 내린 배',
  z: 45,
  fx: { boat: 2 },
  focus: DRIFT_FOCUS,
  draw(ctx) {
    for (let k = 0; k < 14; k++) dot(ctx, 220 + k * 0.4, 142 + k, '#8a8a7a')
    grid(ctx, ['..K..', 'K.K.K', '.KKK.'], 223, 155, { K: '#4a4a52' })
    for (const r of [4, 8]) px(ctx, 218 - r, 142, r * 2 + 4, 1, '#3a4a66')
  },
}
const rowing: Sprite = {
  id: 'ly_rowing',
  name: '노 저어 나아가는 배',
  z: 45,
  fx: { boat: 3 },
  focus: DRIFT_FOCUS,
  draw(ctx, env) {
    const p = boatPos(env)
    const a = Math.sin(env.t * 4)
    for (let k = 0; k < 12; k++) dot(ctx, p.x - 12 - k * 0.6, p.y - 4 + k * (0.7 + a * 0.3), '#8a6a42')
    px(ctx, p.x - 13, p.y - 10, 3, 1, '#1f1d22')
    px(ctx, p.x - 13, p.y - 9, 3, 2, '#e6c39b')
    px(ctx, p.x - 14, p.y - 7, 5, 4, '#6b5a4a')
    for (let k = 1; k < 16; k++) withAlpha(ctx, 0.5 * (1 - k / 16), () => px(ctx, p.x - 14 - k * 4, p.y + 2, 3, 1, '#6d7f9e'))
  },
}

// ── 8구: 새 ─────────────────────────────────────────────────
const BIRD_FOCUS = { x: 40, y: 24, w: 240, h: 135 }

const gullOne: Sprite = {
  id: 'ly_gull_one',
  name: '한 마리 갈매기',
  z: 50,
  focus: BIRD_FOCUS,
  draw(ctx, env) {
    // 모래톱
    px(ctx, 96, 120, 30, 2, '#6b6650')
    px(ctx, 100, 119, 20, 1, '#7d7860')
    const a = env.t * 0.35
    const x = 160 + Math.cos(a) * 90
    const y = 70 + Math.sin(a * 2) * 18
    const f = Math.floor(env.t * 3) % 2
    if (f) {
      px(ctx, x - 4, y - 1, 3, 1, '#f2f2ea')
      px(ctx, x + 2, y - 1, 3, 1, '#f2f2ea')
      px(ctx, x - 1, y, 3, 1, '#f2f2ea')
    } else {
      px(ctx, x - 4, y + 1, 3, 1, '#f2f2ea')
      px(ctx, x + 2, y + 1, 3, 1, '#f2f2ea')
      px(ctx, x - 1, y, 3, 1, '#f2f2ea')
    }
    dot(ctx, x + 1, y, '#e0a040')
  },
}
const geese: Sprite = {
  id: 'ly_geese',
  name: '떼 지어 나는 기러기',
  z: 50,
  focus: BIRD_FOCUS,
  draw(ctx, env) {
    const lead = { x: mod(env.t * 12, W + 80) - 40, y: 50 }
    for (let i = 0; i < 9; i++) {
      const side = i % 2 ? 1 : -1
      const k = Math.ceil(i / 2)
      bird(ctx, lead.x - k * 7, lead.y + side * k * 4, Math.floor(env.t * 5 + i) % 2, '#c8c6b8')
    }
  },
}
const swallows: Sprite = {
  id: 'ly_swallows',
  name: '짝지어 나는 제비',
  z: 50,
  focus: BIRD_FOCUS,
  draw(ctx, env) {
    for (let i = 0; i < 2; i++) {
      const a = env.t * 1.6 + i * 0.6
      const x = 150 + Math.cos(a) * 60
      const y = 80 + Math.sin(a * 2) * 14 + i * 4
      grid(ctx, ['K...K', '.KKK.', 'K.K.K'], x, y, { K: '#0b0d18' })
      dot(ctx, x + 2, y + 1, '#d9d4c4')
    }
  },
}

export const LVYE_SPRITES: Sprite[] = [
  grassGentle, reedsStorm, bankBare,
  boatMast, fleet, ferry,
  starsLow, clouds, meteors,
  moonSurge, moonNone, moonIce,
  scrollHumble, scrollProud, exam,
  hatDown, promoted, seal,
  drifting, anchored, rowing,
  gullOne, geese, swallows,
]
