// 〈登高〉의 정답·오답 스프라이트. 모든 보기는 고유한 스프라이트를 가진다.
import type { Sprite } from '../types'
import { H, W, disc, dot, fillRows, grid, hash, mod, px } from '../pixel'
import type { Ctx, Env } from '../pixel'
import {
  BAG, CUP, HOUSE, POET, RIVER_TOP, SANDBAR, TREES,
  canopyPoints, riverBounds, riverL, riverR, treeSway,
} from '../backgrounds/denggao'
import {
  OTHER_PALS, POET_PAL, drawCup, drawFigure, drawMiniFigure, drawRaisedArm, hairStrand,
} from '../figures'

// ── 바람 ──────────────────────────────────────────────────────
const LEAF = ['#d9772d', '#b84e2c', '#e8a048', '#9a3d22']

function drawBranch(ctx: Ctx, env: Env, bend: number, flutter: number) {
  // 화면 오른쪽 위에서 드리운 가지
  const pts: { x: number; y: number }[] = []
  const N = 96
  for (let i = 0; i <= N; i++) {
    const s = i / N
    const x = 322 - 86 * s - bend * 0.5 * s * s
    const y = 2 + 24 * s + 5 * Math.sin(s * 3.1) + bend * s * s
    pts.push({ x, y })
  }
  pts.forEach((p, i) => {
    const th = i < 34 ? 3 : i < 68 ? 2 : 1
    px(ctx, p.x, p.y, 1, th, '#4a3426')
    if (i < 60) dot(ctx, p.x, p.y, '#6b4c35')
  })
  const twigs: [number, number, number][] = [
    [8, -6, 12],
    [14, 4, 10],
    [19, -8, 8],
    [24, 3, 9],
    [28, -2, 6],
  ]
  twigs.forEach(([i0, dx, dy], k) => {
    const i = Math.round((i0 / 28) * N)
    const p = pts[i]
    const s = i / N
    const ex = p.x + dx - bend * 0.4 * s
    const ey = p.y + dy + bend * 0.3 * s
    for (let j = 0; j <= 14; j++) {
      const f = j / 14
      dot(ctx, p.x + (ex - p.x) * f, p.y + (ey - p.y) * f, '#5a3f2c')
    }
    // 잎 뭉치
    for (let l = 0; l < 7; l++) {
      const a = hash(k * 31 + l) * 6.28
      const r = 1 + hash(k * 17 + l * 3) * 4
      const fl = flutter * Math.sin(env.t * 12 + l * 2 + k)
      const lx = ex + Math.cos(a) * r + fl
      const ly = ey + Math.sin(a) * r * 0.7 + fl * 0.5
      px(ctx, lx, ly, 2, 2, LEAF[(k + l) % 4])
    }
  })
}

function drawStreaks(ctx: Ctx, env: Env, n: number, speed: number, len: number, alpha: number, top = 6, range = 130) {
  for (let i = 0; i < n; i++) {
    const sp = speed * (0.7 + hash(i * 2.1) * 0.6)
    const y0 = top + hash(i * 5.7 + top) * range
    const L = len * (0.6 + hash(i * 1.3) * 0.8)
    const x = W + 40 - mod(env.t * sp + hash(i * 3.3) * 900, W + 120)
    for (let k = 0; k < L; k++) {
      const yy = y0 + Math.sin((x + k) * 0.08 + i) * 1.5
      ctx.fillStyle = `rgba(255,255,255,${alpha * (1 - k / L)})`
      ctx.fillRect(Math.round(x + k), Math.round(yy), 1, 1)
    }
  }
}

const WIND_FOCUS = { x: 224, y: 0, w: 96, h: 54 }

const windStrong: Sprite = {
  id: 'wind_strong',
  name: '거센 바람',
  z: 90,
  wind: 1,
  focus: WIND_FOCUS,
  draw(ctx, env) {
    const bend = 11 + 3.5 * Math.sin(env.t * 7) + 1.5 * Math.sin(env.t * 13)
    drawStreaks(ctx, env, 18, 210, 26, 0.6)
    drawStreaks(ctx, { ...env, t: env.t + 3 }, 8, 260, 30, 0.7, 4, 50)
    drawBranch(ctx, env, bend, 1.6)
    // 가지에서 뜯겨 날아가는 잎
    for (let i = 0; i < 7; i++) {
      const f = mod(env.t * 0.9 + i / 7, 1)
      const x = 270 + hash(i * 3.1) * 40 - f * 130
      const y = 18 + hash(i * 1.7) * 14 + Math.sin(f * 12 + i) * 5 + f * 18
      px(ctx, x, y, 2, 1, LEAF[i % 4])
    }
  },
}
const windGentle: Sprite = {
  id: 'wind_gentle',
  name: '잔잔한 미풍',
  z: 90,
  wind: 0.25,
  focus: WIND_FOCUS,
  draw(ctx, env) {
    drawStreaks(ctx, env, 3, 30, 10, 0.35, 10, 60)
    drawStreaks(ctx, env, 3, 25, 8, 0.25)
    drawBranch(ctx, env, 0.8 + 1.4 * Math.sin(env.t * 1.6), 0.5)
  },
}
const windNone: Sprite = {
  id: 'wind_none',
  name: '바람 없는 하늘',
  z: 90,
  wind: 0,
  focus: WIND_FOCUS,
  draw(ctx, env) {
    drawBranch(ctx, env, 0, 0)
  },
}

// ── 새 ────────────────────────────────────────────────────────
const BIRD_C = '#2f2f36'
function flyingBird(ctx: Ctx, x: number, y: number, frame: number, small = false) {
  if (small) {
    if (frame) {
      dot(ctx, x - 1, y - 1, BIRD_C)
      dot(ctx, x, y, BIRD_C)
      dot(ctx, x + 1, y - 1, BIRD_C)
    } else px(ctx, x - 1, y, 3, 1, BIRD_C)
    return
  }
  if (frame) {
    dot(ctx, x - 2, y - 1, BIRD_C)
    dot(ctx, x + 2, y - 1, BIRD_C)
    px(ctx, x - 1, y, 3, 1, BIRD_C)
  } else {
    px(ctx, x - 1, y, 3, 1, BIRD_C)
    dot(ctx, x - 2, y + 1, BIRD_C)
    dot(ctx, x + 2, y + 1, BIRD_C)
  }
}
const BIRD_FOCUS = { x: 178, y: 96, w: 96, h: 54 }

const birdCircling: Sprite = {
  id: 'bird_circling',
  name: '선회하는 새',
  z: 60,
  focus: BIRD_FOCUS,
  draw(ctx, env) {
    for (let i = 0; i < 4; i++) {
      const a = env.t * 1.1 + i * 1.57
      const rx = 24 - (i % 2) * 6
      const x = SANDBAR.x + Math.cos(a) * rx
      const y = 122 + Math.sin(a) * 8 - (i % 2) * 4
      flyingBird(ctx, x, y, Math.floor(env.t * 6 + i) % 2)
    }
  },
}
const birdFlying: Sprite = {
  id: 'bird_flying',
  name: '곧장 멀리 날아가는 새',
  z: 60,
  focus: BIRD_FOCUS,
  draw(ctx, env) {
    for (let i = 0; i < 3; i++) {
      const f = mod(env.t / 4 + i * 0.12, 1)
      const x = 236 - f * 58 + i * 4
      const y = 132 - f * 30 - i * 3
      flyingBird(ctx, x, y, Math.floor(env.t * 7 + i) % 2, f > 0.5)
    }
  },
}
const birdResting: Sprite = {
  id: 'bird_resting',
  name: '모래톱에 앉은 새',
  z: 60,
  focus: BIRD_FOCUS,
  draw(ctx) {
    const rows = ['..K.', '.KKK', 'KKK.', '.k..']
    const pal = { K: BIRD_C, k: '#6a5a4a' }
    grid(ctx, rows, SANDBAR.x - 14, SANDBAR.y - 6, pal)
    grid(ctx, rows, SANDBAR.x - 3, SANDBAR.y - 5, pal, true)
    grid(ctx, rows, SANDBAR.x + 9, SANDBAR.y - 6, pal)
  },
}

// ── 나무: 낙엽 / 꽃 / 새싹 ────────────────────────────────────
const LEAVES_FOCUS = { x: 224, y: 76, w: 96, h: 54 }
const NEAR = TREES.filter((t) => !t.far)

const leavesFalling: Sprite = {
  id: 'leaves_falling',
  name: '끝없이 떨어지는 낙엽',
  z: 70,
  focus: LEAVES_FOCUS,
  draw(ctx, env) {
    const N = 90
    for (let i = 0; i < N; i++) {
      const vy = 10 + hash(i * 2.1) * 12
      const period = (H + 20) / vy
      const local = mod(env.t + hash(i * 3.7) * period, period)
      const y = local * vy - 10
      const x0 = hash(i * 1.9) * (W + 60)
      const drift = -(env.wind * 26 + 3) * local + Math.sin(env.t * 2.5 + i) * 3
      const x = mod(x0 + drift, W + 20) - 10
      const c = LEAF[i % 4]
      if (Math.floor(env.t * 5 + i) % 2) px(ctx, x, y, 2, 1, c)
      else px(ctx, x, y, 1, 2, c)
    }
    // 나무에서 막 떨어지는 잎
    NEAR.forEach((t, k) => {
      for (let j = 0; j < 4; j++) {
        const p = canopyPoints(t, 4, 50 + k)[j]
        const life = mod(env.t * 0.7 + hash(k * 9 + j) * 3, 3)
        const lx = p.x + treeSway(t, env) - life * (env.wind * 10 + 2) + Math.sin(life * 4 + j) * 2
        const ly = p.y + life * 14
        px(ctx, lx, ly, 1, 1, LEAF[(j + k) % 4])
      }
    })
  },
}
const leavesBloom: Sprite = {
  id: 'leaves_bloom',
  name: '피어나는 꽃',
  z: 70,
  focus: LEAVES_FOCUS,
  draw(ctx, env) {
    TREES.forEach((t, k) => {
      const pts = canopyPoints(t, t.far ? 4 : Math.round(12 * t.s), 7 + k)
      pts.forEach((p, j) => {
        const off = treeSway(t, env, p.k)
        if (t.far) dot(ctx, p.x + off, p.y, '#f2c2cf')
        else {
          px(ctx, p.x + off - 1, p.y, 3, 1, '#f4b3c6')
          px(ctx, p.x + off, p.y - 1, 1, 3, '#f4b3c6')
          dot(ctx, p.x + off, p.y, j % 3 ? '#fff4f6' : '#f7d77a')
        }
      })
    })
  },
}
const leavesSprouting: Sprite = {
  id: 'leaves_sprouting',
  name: '돋아나는 새싹',
  z: 70,
  focus: LEAVES_FOCUS,
  draw(ctx, env) {
    TREES.forEach((t, k) => {
      const pts = canopyPoints(t, t.far ? 3 : Math.round(10 * t.s), 21 + k)
      pts.forEach((p, j) => {
        const off = treeSway(t, env, p.k)
        px(ctx, p.x + off, p.y, 1, 2, j % 2 ? '#a6d36b' : '#7fb04a')
        if (!t.far) dot(ctx, p.x + off + 1, p.y, '#c9ec8f')
      })
    })
    // 땅에서 돋는 싹
    for (let i = 0; i < 26; i++) {
      const right = i % 2 === 0
      const x = right ? 236 + hash(i * 3.1) * 82 : 2 + hash(i * 2.7) * 42
      const y = right ? 118 + hash(i * 1.3) * 16 : 105 + x * 0.27
      px(ctx, x, y - 2, 1, 2, '#7fb04a')
      dot(ctx, x + 1, y - 3, '#a6d36b')
      dot(ctx, x - 1, y - 2, '#a6d36b')
    }
  },
}

// ── 강물 ──────────────────────────────────────────────────────
const RIVER_FOCUS = { x: 150, y: 104, w: 128, h: 72 }

const riverRolling: Sprite = {
  id: 'river_rolling',
  name: '끝없이 밀려오는 물결',
  z: 10,
  focus: RIVER_FOCUS,
  draw(ctx, env) {
    fillRows(ctx, RIVER_TOP, H, riverBounds, (y) => (y < 112 ? '#8aa3b1' : y < 135 ? '#71909f' : '#628392'))
    const K = 16
    for (let k = 0; k < K; k++) {
      const u = mod(k / K + env.t * 0.17, 1)
      const y = Math.round(RIVER_TOP + 2 + (H - RIVER_TOP) * Math.pow(u, 1.6))
      const a = riverL(y)
      const b = riverR(y)
      const thick = u > 0.55 ? 2 : 1
      const freq = 0.32 - u * 0.2
      for (let x = Math.ceil(a); x < b; x++) {
        const v = Math.sin(x * freq + k * 1.7 + env.t * 1.5)
        if (v > 0.45) px(ctx, x, y, 1, thick, '#dbe7ec')
        else if (v > 0.05) px(ctx, x, y, 1, 1, '#a7bfca')
        else if (v < -0.7) px(ctx, x, y + thick, 1, 1, '#557686')
      }
    }
    // 흰 물마루
    for (let i = 0; i < 26; i++) {
      const u = mod(hash(i * 4.4) + env.t * 0.17, 1)
      const y = RIVER_TOP + 3 + (H - RIVER_TOP - 3) * Math.pow(u, 1.6)
      const a = riverL(y)
      const b = riverR(y)
      const x = a + hash(i * 2.9) * (b - a)
      px(ctx, x, y, 2 + u * 3, 1, '#f1f6f7')
    }
    // 절벽 밑 포말
    for (let y = 150; y < H; y++) {
      const x = riverL(y) + Math.sin(env.t * 6 + y) * 1.5
      px(ctx, x, y, 3, 1, '#e3edf0')
    }
  },
}
const riverFrozen: Sprite = {
  id: 'river_frozen',
  name: '얼어붙은 강물',
  z: 10,
  focus: RIVER_FOCUS,
  draw(ctx, env) {
    fillRows(ctx, RIVER_TOP, H, riverBounds, (y) => (y % 7 === 0 ? '#cfdfe8' : '#dde9ef'))
    // 얼음 금
    for (let i = 0; i < 9; i++) {
      let y = RIVER_TOP + 6 + hash(i * 3.1) * 66
      let x = riverL(y) + 4 + hash(i * 7.3) * (riverR(y) - riverL(y) - 8)
      for (let s = 0; s < 18; s++) {
        dot(ctx, x, y, '#9fb7c6')
        x += hash(i * 11 + s) > 0.5 ? 1 : -1
        y += hash(i * 13 + s * 3) > 0.4 ? 1 : 0
        if (x < riverL(y) || x > riverR(y)) break
      }
    }
    // 반짝임
    for (let i = 0; i < 10; i++) {
      const y = RIVER_TOP + 4 + hash(i * 5.5) * 70
      const x = riverL(y) + hash(i * 8.1) * (riverR(y) - riverL(y))
      if (Math.sin(env.t * 3 + i * 2) > 0.6) {
        dot(ctx, x, y, '#ffffff')
        dot(ctx, x - 1, y, '#f0f6f9')
        dot(ctx, x + 1, y, '#f0f6f9')
      }
    }
  },
}
const riverCalm: Sprite = {
  id: 'river_calm',
  name: '고요하게 멈춘 수면',
  z: 10,
  focus: RIVER_FOCUS,
  draw(ctx, env) {
    fillRows(ctx, RIVER_TOP, H, riverBounds, '#a3bbc7')
    // 수면에 비친 산 그림자
    fillRows(ctx, RIVER_TOP, 124, (y) => [riverL(y), riverL(y) + (124 - y) * 1.6], '#8ea7b4')
    fillRows(ctx, RIVER_TOP, 120, (y) => [riverR(y) - (120 - y) * 2.2, riverR(y)], '#8aa3b0')
    // 아주 느린 반짝임
    for (let i = 0; i < 14; i++) {
      const y = RIVER_TOP + 8 + Math.floor(hash(i * 6.1) * 66)
      const a = riverL(y)
      const b = riverR(y)
      const x = a + 6 + hash(i * 2.3) * Math.max(1, b - a - 18)
      const len = 6 + hash(i) * 10
      px(ctx, x + Math.sin(env.t * 0.4 + i) * 1, y, len, 1, '#c3d5dd')
    }
  },
}

// ── 처지: 행낭 / 고향집 / 손님 맞는 집 ─────────────────────────
function drawHouse(ctx: Ctx, x: number, y: number) {
  // 담장
  px(ctx, x - 6, y + 12, 38, 3, '#b9ac90')
  px(ctx, x - 6, y + 11, 38, 1, '#5b5650')
  // 기와지붕
  px(ctx, x + 1, y, 24, 2, '#4a4f57')
  px(ctx, x - 1, y + 2, 28, 2, '#3c4048')
  dot(ctx, x - 2, y + 1, '#3c4048')
  dot(ctx, x + 27, y + 1, '#3c4048')
  // 벽과 기둥
  px(ctx, x + 1, y + 4, 24, 9, '#e6dfcc')
  for (const c of [1, 9, 17, 24]) px(ctx, x + c, y + 4, 1, 9, '#6b4a32')
  px(ctx, x + 11, y + 7, 4, 6, '#6b4a32')
  px(ctx, x + 3, y + 6, 4, 3, '#c9b98f')
  px(ctx, x + 19, y + 6, 4, 3, '#c9b98f')
}
const HOUSE_FOCUS = { x: 244, y: 92, w: 64, h: 36 }

const homeHouse: Sprite = {
  id: 'home_house',
  name: '고향집',
  z: 30,
  focus: HOUSE_FOCUS,
  draw(ctx) {
    drawHouse(ctx, HOUSE.x, HOUSE.y)
  },
}
const hostHouse: Sprite = {
  id: 'host_house',
  name: '손님 맞는 집',
  z: 30,
  focus: HOUSE_FOCUS,
  draw(ctx, env) {
    drawHouse(ctx, HOUSE.x, HOUSE.y)
    const bow = Math.sin(env.t * 2) > 0 ? 1 : 0
    drawMiniFigure(ctx, HOUSE.x + 10, HOUSE.y + 7, '#7a4a3a', bow)
    drawMiniFigure(ctx, HOUSE.x - 4, HOUSE.y + 7, '#4f6b4a', -bow)
  },
}
const travelerBag: Sprite = {
  id: 'traveler_bag',
  name: '여행 행낭',
  z: 35,
  focus: { x: 44, y: 92, w: 48, h: 27 },
  draw(ctx) {
    const { x, y } = BAG
    // 지팡이
    for (let i = 0; i < 14; i++) dot(ctx, x + 2 + i * 0.7, y + 11 - i, '#6b4a2b')
    // 보따리
    disc(ctx, x + 3, y + 8, 4, (dy) => (dy < -1 ? '#a8703f' : dy > 2 ? '#6a4026' : '#8c5a33'))
    px(ctx, x + 1, y + 3, 5, 2, '#8c5a33')
    px(ctx, x + 2, y + 2, 2, 1, '#a8703f')
    px(ctx, x + 4, y + 2, 2, 1, '#6a4026')
    px(ctx, x - 1, y + 7, 8, 1, '#5a3520')
    px(ctx, x - 1, y + 12, 9, 1, 'rgba(40,30,20,0.35)')
  },
}

// ── 인물 ──────────────────────────────────────────────────────
const FIG_FOCUS = { x: 50, y: 84, w: 80, h: 45 }

const poetAlone: Sprite = {
  id: 'poet_alone',
  name: '홀로 선 시인',
  z: 40,
  focus: FIG_FOCUS,
  draw(ctx, env) {
    drawFigure(ctx, POET.x, POET.y, POET_PAL, env)
  },
}
const friendsTwo: Sprite = {
  id: 'friends_two',
  name: '함께 온 친구들',
  z: 40,
  focus: FIG_FOCUS,
  draw(ctx, env) {
    drawFigure(ctx, POET.x - 8, POET.y, OTHER_PALS[0], env)
    drawFigure(ctx, POET.x + 10, POET.y, OTHER_PALS[1], env, { flip: true })
  },
}
const literatiGroup: Sprite = {
  id: 'literati_group',
  name: '술잔을 나누는 문인들',
  z: 40,
  focus: FIG_FOCUS,
  draw(ctx, env) {
    const xs = [60, 76, 100, 116]
    xs.forEach((x, i) => {
      const flip = i >= 2
      drawFigure(ctx, x, POET.y, OTHER_PALS[i], env, { seated: true, flip })
    })
    // 가운데 술동이와 잔
    disc(ctx, 95, 112, 3, (dy) => (dy < 0 ? '#8a6a48' : '#6b4f35'))
    px(ctx, 94, 108, 3, 1, '#4a3426')
    drawCup(ctx, 86, 113)
    drawCup(ctx, 102, 113)
    drawRaisedArm(ctx, 76, POET.y + 6, OTHER_PALS[1], false, false)
    drawRaisedArm(ctx, 100, POET.y + 6, OTHER_PALS[2], true, false)
  },
}

// ── 귀밑머리 ──────────────────────────────────────────────────
const HAIR_FOCUS = { x: 88, y: 90, w: 32, h: 18 }
const HAIR_CELLS: [number, number][] = [[5, 3], [5, 4], [5, 5]]

function paintHair(ctx: Ctx, env: Env, color: string) {
  for (const [c, r] of HAIR_CELLS) dot(ctx, POET.x + c, POET.y + r, color)
  for (const [hx, hy] of hairStrand(POET.x, POET.y, env)) dot(ctx, hx, hy, color)
}

const poetWhiteHair: Sprite = {
  id: 'poet_white_hair',
  name: '서리처럼 흰 귀밑머리',
  z: 45,
  focus: HAIR_FOCUS,
  draw(ctx, env) {
    paintHair(ctx, env, '#efeee8')
    dot(ctx, POET.x + 6, POET.y + 6, '#d8d6cf')
    dot(ctx, POET.x + 6, POET.y + 7, '#bdbab2')
  },
}
const hairBlack: Sprite = {
  id: 'hair_black',
  name: '검고 윤기 나는 머리',
  z: 45,
  focus: HAIR_FOCUS,
  draw(ctx, env) {
    paintHair(ctx, env, '#111014')
    dot(ctx, POET.x + 6, POET.y + 6, '#111014')
    dot(ctx, POET.x + 6, POET.y + 7, '#111014')
    if (Math.sin(env.t * 3) > -0.2) dot(ctx, POET.x + 5, POET.y + 3, '#8a90aa')
    if (Math.sin(env.t * 3 + 2) > 0.3) dot(ctx, POET.x + 7, POET.y + 1, '#6a7090')
  },
}
const hairSnow: Sprite = {
  id: 'hair_snow',
  name: '눈 덮인 머리',
  z: 45,
  focus: HAIR_FOCUS,
  draw(ctx, env) {
    const { x, y } = POET
    px(ctx, x + 6, y - 1, 3, 1, '#ffffff')
    px(ctx, x + 5, y, 5, 1, '#ffffff')
    px(ctx, x + 5, y + 1, 6, 1, '#f1f5f8')
    dot(ctx, x + 4, y + 8, '#ffffff')
    px(ctx, x + 4, y + 8, 3, 1, '#f1f5f8')
    px(ctx, x + 8, y + 8, 2, 1, '#f1f5f8')
    for (let i = 0; i < 14; i++) {
      const fx = x - 6 + hash(i * 3.3) * 28 + Math.sin(env.t * 2 + i) * 1.5
      const fy = mod(y - 8 + hash(i * 7.1) * 26 + env.t * 7, 30) + y - 10
      dot(ctx, fx, fy, '#ffffff')
    }
  },
}

// ── 술잔 ──────────────────────────────────────────────────────
const CUP_FOCUS = { x: 82, y: 88, w: 48, h: 27 }

const wineCupStopped: Sprite = {
  id: 'wine_cup_stopped',
  name: '내려놓은 탁주잔',
  z: 45,
  focus: CUP_FOCUS,
  draw(ctx) {
    drawCup(ctx, CUP.x, CUP.y)
  },
}
const drinking: Sprite = {
  id: 'drinking',
  name: '술을 마시는 시인',
  z: 46,
  focus: CUP_FOCUS,
  draw(ctx) {
    drawRaisedArm(ctx, POET.x, POET.y, POET_PAL, false, true)
  },
}
const toasting: Sprite = {
  id: 'toasting',
  name: '건배하는 사람들',
  z: 46,
  focus: CUP_FOCUS,
  draw(ctx, env) {
    drawFigure(ctx, POET.x + 13, POET.y, OTHER_PALS[0], env, { flip: true })
    drawRaisedArm(ctx, POET.x + 13, POET.y + 1, OTHER_PALS[0], true, false)
    drawRaisedArm(ctx, POET.x, POET.y + 1, POET_PAL, false, false)
  },
}

export const DENGGAO_SPRITES: Sprite[] = [
  windGentle, windStrong, windNone,
  birdResting, birdFlying, birdCircling,
  leavesBloom, leavesFalling, leavesSprouting,
  riverRolling, riverFrozen, riverCalm,
  homeHouse, travelerBag, hostHouse,
  poetAlone, friendsTwo, literatiGroup,
  hairSnow, hairBlack, poetWhiteHair,
  drinking, wineCupStopped, toasting,
]
