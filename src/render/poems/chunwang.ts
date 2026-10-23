// 杜甫〈春望〉: 무너진 장안 성벽 앞의 봄. 산과 강은 1구의 정답으로 나타난다.
import type { Background, Sprite } from '../types'
import { H, W, disc, dot, grid, hash, mod, px } from '../pixel'
import type { Ctx } from '../pixel'
import { SPRING, bird, broadTree, flower, grassBlade, person, ridge, sky, snowfall, sparkle, withAlpha } from '../kit'
import { POET_PAL, withHead } from '../figures'

const WALL_TOP = 98
const GROUND = 126
const POET = { x: 44, y: 136 } // 발끝 y=157
const LETTER = { x: 70, y: 150 }
const TREE = { x: 300, y: 134, s: 1.1 }

const farRidge = (x: number) => 62 + 8 * Math.sin(x * 0.03 + 1) + 5 * Math.sin(x * 0.075) + hash(x) * 1.5
const nearRidge = (x: number) => 76 + 7 * Math.sin(x * 0.025 + 3) + 4 * Math.sin(x * 0.1 + 1) + hash(x + 9) * 1.5
const riverY = (x: number) => 92 + 3 * Math.sin(x * 0.05) - x * 0.01

function wallTopAt(x: number) {
  // 무너진 구간
  if (x > 150 && x < 186) return WALL_TOP + 10 + Math.round(Math.abs(Math.sin(x * 0.7)) * 6 + (x > 160 && x < 176 ? 6 : 0))
  return WALL_TOP
}

function drawWall(ctx: Ctx) {
  for (let x = 0; x < W; x++) {
    const top = wallTopAt(x)
    for (let y = top; y < GROUND; y++) {
      let c = '#8b8172'
      if ((y - WALL_TOP) % 5 === 0) c = '#776d60'
      else if ((x + Math.floor((y - WALL_TOP) / 5) * 4) % 9 === 0) c = '#776d60'
      if (hash(x * 3 + y * 7) < 0.04) c = '#9d9383'
      px(ctx, x, y, 1, 1, c)
    }
    // 여장(女牆)
    if (top === WALL_TOP && x % 8 < 5) px(ctx, x, WALL_TOP - 4, 1, 4, x % 8 === 0 ? '#9d9383' : '#8b8172')
  }
  // 무너진 돌무더기
  for (let i = 0; i < 40; i++) {
    const x = 146 + hash(i * 2.1) * 46
    const y = GROUND - 2 - hash(i * 3.7) * 8
    px(ctx, x, y, 3, 2, i % 2 ? '#7d7366' : '#958b7b')
  }
  // 성문 누각 (지붕이 부서진 채)
  const gx = 206
  px(ctx, gx, WALL_TOP - 18, 34, 18, '#8b8172')
  px(ctx, gx + 12, WALL_TOP + 8, 10, GROUND - WALL_TOP - 8, '#3a332c')
  disc(ctx, gx + 17, WALL_TOP + 9, 5, '#3a332c')
  px(ctx, gx - 4, WALL_TOP - 24, 30, 3, '#4a4440')
  px(ctx, gx - 2, WALL_TOP - 21, 26, 3, '#3c3733')
  for (let i = 0; i < 8; i++) px(ctx, gx + 26 + i, WALL_TOP - 22 + i * 1.5, 1, 2, '#4a4440')
  for (const c of [2, 10, 18]) px(ctx, gx + c, WALL_TOP - 18, 2, 18, '#6b4a32')
}

function drawGround(ctx: Ctx) {
  for (let y = GROUND; y < H; y++) {
    px(ctx, 0, y, W, 1, y < 132 ? '#9a9070' : y < 150 ? '#8d8762' : '#857f5a')
  }
  // 길
  for (let y = GROUND; y < H; y++) {
    const c = 223 - (y - GROUND) * 0.2
    const w = 8 + (y - GROUND) * 0.9
    px(ctx, c - w / 2, y, w, 1, '#ab9f80')
  }
  for (let i = 0; i < 70; i++) {
    const x = hash(i * 4.1) * W
    const y = GROUND + 2 + hash(i * 2.9) * (H - GROUND - 2)
    px(ctx, x, y, 2, 1, hash(i) > 0.5 ? '#7c7652' : '#a39878')
  }
  // 시인이 설 무너진 섬돌
  px(ctx, 26, 156, 70, 6, '#9b9282')
  px(ctx, 26, 156, 70, 1, '#b3aa98')
  px(ctx, 26, 162, 70, 3, '#7a7264')
  px(ctx, 90, 158, 8, 7, '#8a8172')
}

export const chunwangBackground: Background = {
  id: 'chunwang',
  drawBack(ctx) {
    sky(ctx, ['#c3cfd6', '#cbd6db', '#d4dddf', '#dce2e1', '#e2e5e0'], 100)
    // 성벽 너머 먼 들
    px(ctx, 0, 94, W, GROUND - 94, '#a9a68c')
    for (let x = 0; x < W; x += 2) dot(ctx, x, 94, '#b8b59c')
  },
  drawFront(ctx) {
    drawWall(ctx)
    drawGround(ctx)
  },
  drawDynamic(ctx) {
    // 오른쪽 앞 나무 (새가 앉는 가지)
    px(ctx, TREE.x - 1, TREE.y - 8, 3, 8, '#4a3426')
    for (let i = 0; i < 12; i++) dot(ctx, TREE.x - i, TREE.y - 14 - i * 0.4, '#4a3426')
    broadTree(ctx, TREE.x, TREE.y, TREE.s, SPRING)
  },
}

// ── 1구: 산과 강 ────────────────────────────────────────────
const LAND_FOCUS = { x: 60, y: 40, w: 192, h: 108 }

function mountains(ctx: Ctx, far: string, near: string) {
  ridge(ctx, farRidge, far, '#c3ccd2', 0, W, 100)
  ridge(ctx, nearRidge, near, undefined, 0, W, 100)
}

const landIntact: Sprite = {
  id: 'cw_land_intact',
  name: '그대로인 산과 강',
  z: 10,
  focus: LAND_FOCUS,
  draw(ctx, env) {
    mountains(ctx, '#a3b2bc', '#8798a5')
    for (let x = 0; x < W; x++) {
      const y = Math.round(riverY(x))
      px(ctx, x, y, 1, 3, '#b9cdd6')
      if (Math.sin(x * 0.4 + env.t * 2) > 0.7) dot(ctx, x, y + 1, '#eef5f7')
    }
  },
}
const landRuined: Sprite = {
  id: 'cw_land_ruined',
  name: '무너져 사라진 산과 강',
  z: 10,
  focus: LAND_FOCUS,
  draw(ctx) {
    for (let x = 0; x < W; x++) {
      const y = Math.round(84 + Math.abs(Math.sin(x * 0.21)) * 6 + hash(x) * 5)
      px(ctx, x, y, 1, 100 - y, x % 7 < 2 ? '#8a7560' : '#9c8670')
    }
    for (let x = 0; x < W; x++) {
      const y = Math.round(riverY(x))
      px(ctx, x, y, 1, 3, '#b8a481')
      if (hash(x * 3) < 0.2) dot(ctx, x, y + 1, '#7d6a50')
    }
  },
}
const landBurning: Sprite = {
  id: 'cw_land_burning',
  name: '불길에 휩싸인 산',
  z: 10,
  focus: LAND_FOCUS,
  draw(ctx, env) {
    mountains(ctx, '#8d7b78', '#6f5e5a')
    for (let i = 0; i < 26; i++) {
      const x = hash(i * 3.3) * W
      const y = nearRidge(x)
      const h = 3 + Math.abs(Math.sin(env.t * 6 + i)) * 4
      px(ctx, x, y - h, 2, h, i % 2 ? '#f08a2a' : '#ffc14d')
      withAlpha(ctx, 0.35, () => px(ctx, x - 1, y - h - 8 - mod(env.t * 6 + i, 10), 4, 6, '#5a514d'))
    }
    for (let x = 0; x < W; x++) px(ctx, x, Math.round(riverY(x)), 1, 3, '#c98b5e')
  },
}

// ── 2구: 풀과 나무 ──────────────────────────────────────────
const CITY_FOCUS = { x: 96, y: 80, w: 160, h: 90 }

const overgrown: Sprite = {
  id: 'cw_overgrown',
  name: '우거진 풀과 나무',
  z: 30,
  focus: CITY_FOCUS,
  draw(ctx) {
    // 성벽 틈과 위로 자란 나무
    broadTree(ctx, 120, WALL_TOP, 0.7, SPRING)
    broadTree(ctx, 168, WALL_TOP + 16, 0.9, SPRING)
    broadTree(ctx, 270, WALL_TOP, 0.6, SPRING)
    broadTree(ctx, 20, WALL_TOP, 0.6, SPRING)
    // 성벽을 타고 내려오는 덩굴
    for (let i = 0; i < 14; i++) {
      const x = 8 + i * 22 + hash(i) * 8
      const len = 6 + hash(i * 3) * 12
      for (let k = 0; k < len; k++) dot(ctx, x + Math.sin(k * 0.6 + i) * 1.2, WALL_TOP + k, k % 3 ? '#5f8a44' : '#7aa858')
    }
    // 땅을 덮은 풀 무더기
    for (let i = 0; i < 55; i++) {
      const cx = hash(i * 2.3) * W
      const cy = GROUND + 4 + hash(i * 5.1) * (H - GROUND - 6)
      if (cx > 22 && cx < 100 && cy > 148) continue
      for (let k = 0; k < 5; k++) {
        const h = 2 + hash(i * 7 + k) * 3
        grassBlade(ctx, cx + k - 2, cy, h, (k - 2) * 0.8, k % 2 ? '#6b9a4a' : '#88b560')
      }
    }
  },
}
const crowd: Sprite = {
  id: 'cw_crowd',
  name: '북적이는 거리',
  z: 30,
  focus: CITY_FOCUS,
  draw(ctx, env) {
    const robes = ['#7a4a3a', '#4f6b4a', '#6b5a7a', '#8a7a55', '#4b5068', '#a0603a']
    for (let i = 0; i < 18; i++) {
      const dir = i % 2 ? 1 : -1
      const lane = GROUND + 6 + (i % 4) * 7
      const x = mod(hash(i * 3.1) * W + dir * env.t * (6 + (i % 3) * 3), W + 10) - 5
      person(ctx, x, lane, robes[i % robes.length], { step: Math.floor(env.t * 4 + i) % 2 })
    }
    // 노점 차양
    for (const x of [110, 260]) {
      px(ctx, x, GROUND + 2, 18, 2, '#b8483a')
      px(ctx, x + 1, GROUND + 4, 1, 6, '#5a3d28')
      px(ctx, x + 16, GROUND + 4, 1, 6, '#5a3d28')
      px(ctx, x + 2, GROUND + 8, 14, 2, '#c9a76a')
    }
  },
}
const snowCity: Sprite = {
  id: 'cw_snow',
  name: '눈 덮인 성',
  z: 30,
  focus: CITY_FOCUS,
  draw(ctx, env) {
    for (let x = 0; x < W; x++) {
      const top = wallTopAt(x)
      px(ctx, x, top - (top === WALL_TOP && x % 8 < 5 ? 5 : 1), 1, 2, '#f4f6f7')
    }
    withAlpha(ctx, 0.85, () => px(ctx, 0, GROUND, W, H - GROUND, '#eef2f4'))
    for (let i = 0; i < 40; i++) px(ctx, hash(i * 3.3) * W, GROUND + 3 + hash(i * 1.7) * 50, 4, 1, '#d6dde2')
    snowfall(ctx, env.t, 70)
  },
}

// ── 3구: 꽃 ─────────────────────────────────────────────────
const FLOWER_FOCUS = { x: 192, y: 120, w: 96, h: 54 }
const BUSHES = [
  { x: 214, y: 156 },
  { x: 238, y: 150 },
  { x: 262, y: 158 },
]
function bush(ctx: Ctx, x: number, y: number, leaf: string) {
  disc(ctx, x, y, 8, (dy) => (dy < -3 ? '#7aa65a' : dy > 4 ? '#3f6a33' : leaf))
}
function bushFlowers(n: number) {
  const pts: { x: number; y: number }[] = []
  BUSHES.forEach((b, k) => {
    for (let i = 0; i < n; i++) {
      const a = hash(k * 17 + i) * 6.28
      const r = Math.sqrt(hash(k * 5 + i * 3)) * 7
      pts.push({ x: b.x + Math.cos(a) * r, y: b.y + Math.sin(a) * r * 0.8 })
    }
  })
  return pts
}

const flowersTears: Sprite = {
  id: 'cw_flowers_tears',
  name: '눈물 젖은 꽃',
  z: 40,
  focus: FLOWER_FOCUS,
  draw(ctx, env) {
    BUSHES.forEach((b) => bush(ctx, b.x, b.y, '#5a8a44'))
    const pts = bushFlowers(7)
    pts.forEach((p) => flower(ctx, p.x, p.y, '#e89aaa', '#f6e08a'))
    // 흩뿌려지는 눈물방울
    pts.forEach((p, i) => {
      if (i % 3) return
      const f = mod(env.t * 0.6 + hash(i) * 3, 1.6)
      if (f > 1) return
      const y = p.y + 2 + f * 10
      px(ctx, p.x, y, 1, 2, '#8fc3e6')
      dot(ctx, p.x, y - 1, '#d6eefa')
    })
    pts.forEach((p, i) => {
      if (i % 4 === 1 && Math.sin(env.t * 2 + i) > 0.3) dot(ctx, p.x + 1, p.y + 1, '#bfe4f7')
    })
  },
}
const flowersBright: Sprite = {
  id: 'cw_flowers_bright',
  name: '활짝 웃는 꽃',
  z: 40,
  focus: FLOWER_FOCUS,
  draw(ctx, env) {
    BUSHES.forEach((b) => bush(ctx, b.x, b.y, '#5a8a44'))
    bushFlowers(9).forEach((p, i) => {
      flower(ctx, p.x, p.y, i % 2 ? '#ff7fa0' : '#ffd166', '#fff6c8')
      if (Math.sin(env.t * 3 + i) > 0.85) sparkle(ctx, p.x + 2, p.y - 3, '#ffffff', true)
    })
  },
}
const flowersWithered: Sprite = {
  id: 'cw_flowers_withered',
  name: '시든 꽃',
  z: 40,
  focus: FLOWER_FOCUS,
  draw(ctx) {
    BUSHES.forEach((b) => bush(ctx, b.x, b.y, '#7d7a4a'))
    bushFlowers(6).forEach((p, i) => {
      dot(ctx, p.x, p.y, '#8a6a52')
      dot(ctx, p.x, p.y + 1, '#6e5440')
      if (i % 2) px(ctx, p.x - 2 + hash(i) * 4, 165 + hash(i * 3) * 5, 2, 1, '#9a7a62')
    })
  },
}

// ── 4구: 새 ─────────────────────────────────────────────────
const BIRD_FOCUS = { x: 256, y: 96, w: 64, h: 36 }
const PERCH = { x: 289, y: 118 }

function perchedBird(ctx: Ctx, x: number, y: number, color = '#4a3a34') {
  grid(ctx, ['.KK.', 'KKKk', '.KKK', '..y.'], x, y, { K: color, k: '#d9a441', y: '#3a2a1c' })
}

const birdStartle: Sprite = {
  id: 'cw_bird_startle',
  name: '놀라 날아오르는 새',
  z: 50,
  focus: BIRD_FOCUS,
  draw(ctx, env) {
    const f = mod(env.t / 2.2, 1)
    for (let i = 0; i < 3; i++) {
      const x = PERCH.x - 4 + i * 5 - f * (14 + i * 8)
      const y = PERCH.y - f * (24 + i * 6) - Math.sin(f * 9 + i) * 2
      bird(ctx, x, y, Math.floor(env.t * 10 + i) % 2, '#4a3a34')
    }
    // 놀람을 나타내는 선과 흩날리는 깃털
    if (f < 0.35) {
      for (let k = 0; k < 6; k++) {
        const a = (k / 6) * Math.PI * 2
        dot(ctx, PERCH.x + Math.cos(a) * 7, PERCH.y + Math.sin(a) * 5, '#fff3c4')
        dot(ctx, PERCH.x + Math.cos(a) * 9, PERCH.y + Math.sin(a) * 6, '#fff3c4')
      }
    }
    dot(ctx, PERCH.x + 3, PERCH.y + 2 + f * 18, '#cbbfb0')
    dot(ctx, PERCH.x - 5, PERCH.y + 1 + f * 14, '#cbbfb0')
  },
}
const birdSing: Sprite = {
  id: 'cw_bird_sing',
  name: '노래하는 새',
  z: 50,
  focus: BIRD_FOCUS,
  draw(ctx, env) {
    perchedBird(ctx, PERCH.x - 2, PERCH.y - 3)
    for (let i = 0; i < 3; i++) {
      const f = mod(env.t * 0.7 + i / 3, 1)
      const x = PERCH.x - 6 - f * 12
      const y = PERCH.y - 6 - f * 12
      grid(ctx, ['.KK', '.K.', 'KK.'], x, y, { K: '#5d4a37' })
    }
  },
}
const birdSleep: Sprite = {
  id: 'cw_bird_sleep',
  name: '둥지에서 잠든 새',
  z: 50,
  focus: BIRD_FOCUS,
  draw(ctx, env) {
    px(ctx, PERCH.x - 5, PERCH.y, 11, 3, '#7a5a3c')
    px(ctx, PERCH.x - 4, PERCH.y + 3, 9, 1, '#5a3d28')
    grid(ctx, ['.KK.', 'KKKK'], PERCH.x - 2, PERCH.y - 2, { K: '#4a3a34' })
    for (let i = 0; i < 2; i++) {
      const f = mod(env.t * 0.5 + i / 2, 1)
      grid(ctx, ['KKK', '.K.', 'KKK'], PERCH.x + 4 + f * 8, PERCH.y - 6 - f * 10, { K: '#5d4a37' })
    }
  },
}

// ── 5구: 봉화 ───────────────────────────────────────────────
const BEACON_FOCUS = { x: 0, y: 30, w: 224, h: 126 }
const BEACON_XS = [24, 70, 118, 196, 290]

function beaconTower(ctx: Ctx, x: number, y: number) {
  px(ctx, x - 2, y - 5, 5, 5, '#6d6458')
  px(ctx, x - 3, y - 6, 7, 1, '#857b6c')
}

const beacons: Sprite = {
  id: 'cw_beacons',
  name: '이어지는 봉화',
  z: 25,
  focus: BEACON_FOCUS,
  draw(ctx, env) {
    BEACON_XS.forEach((x, i) => {
      const y = Math.round(nearRidge(x))
      beaconTower(ctx, x, y)
      const h = 3 + Math.abs(Math.sin(env.t * 7 + i)) * 3
      px(ctx, x - 1, y - 6 - h, 3, h, '#ff9a2e')
      dot(ctx, x, y - 7 - h, '#ffd166')
      for (let k = 0; k < 7; k++) {
        const f = mod(env.t * 0.4 + k / 7, 1)
        withAlpha(ctx, 0.5 * (1 - f), () => px(ctx, x - 1 + f * 10, y - 10 - f * 34, 3 + f * 3, 2, '#5f5853'))
      }
    })
  },
}
const beaconOut: Sprite = {
  id: 'cw_beacon_out',
  name: '꺼져 버린 봉화',
  z: 25,
  focus: BEACON_FOCUS,
  draw(ctx, env) {
    const x = 118
    const y = Math.round(nearRidge(x))
    beaconTower(ctx, x, y)
    for (let k = 0; k < 3; k++) {
      const f = mod(env.t * 0.3 + k / 3, 1)
      withAlpha(ctx, 0.3 * (1 - f), () => dot(ctx, x + f * 4, y - 8 - f * 14, '#8a837c'))
    }
  },
}
const fireworks: Sprite = {
  id: 'cw_fireworks',
  name: '축제의 불꽃놀이',
  z: 25,
  focus: BEACON_FOCUS,
  draw(ctx, env) {
    const colors = ['#ff6b8a', '#ffd166', '#6be0ff', '#b98cff']
    for (let i = 0; i < 4; i++) {
      const f = mod(env.t * 0.5 + i * 0.27, 1)
      const cx = 40 + i * 50
      const cy = 30 + (i % 2) * 14
      const r = f * 16
      for (let k = 0; k < 12; k++) {
        const a = (k / 12) * Math.PI * 2
        withAlpha(ctx, 1 - f, () => px(ctx, cx + Math.cos(a) * r, cy + Math.sin(a) * r + f * f * 5, 2, 2, colors[i]))
      }
    }
  },
}

// ── 6구: 집 편지 ────────────────────────────────────────────
const LETTER_FOCUS = { x: 56, y: 132, w: 64, h: 36 }

function letter(ctx: Ctx, x: number, y: number) {
  px(ctx, x, y, 12, 8, '#efe6cf')
  px(ctx, x, y, 12, 1, '#cfc2a2')
  for (let i = 0; i < 6; i++) dot(ctx, x + i, y + 1 + Math.floor(i / 1.5), '#cfc2a2')
  for (let i = 0; i < 6; i++) dot(ctx, x + 11 - i, y + 1 + Math.floor(i / 1.5), '#cfc2a2')
  px(ctx, x + 5, y + 4, 2, 2, '#b2352a')
}

const letterGold: Sprite = {
  id: 'cw_letter_gold',
  name: '만금 같은 집 편지',
  z: 45,
  focus: LETTER_FOCUS,
  draw(ctx, env) {
    withAlpha(ctx, 0.25 + 0.1 * Math.sin(env.t * 3), () => disc(ctx, LETTER.x + 6, LETTER.y + 3, 11, '#ffe08a'))
    letter(ctx, LETTER.x, LETTER.y - 1)
    // 저울처럼 맞먹는 금덩이 더미
    for (let i = 0; i < 9; i++) {
      const row = i < 4 ? 0 : i < 7 ? 1 : 2
      const col = i < 4 ? i : i < 7 ? i - 4 : 0
      px(ctx, LETTER.x + 18 + col * 5 + row * 2.5, LETTER.y + 5 - row * 3, 4, 3, i % 2 ? '#e8b84a' : '#f5d06a')
      dot(ctx, LETTER.x + 19 + col * 5 + row * 2.5, LETTER.y + 5 - row * 3, '#fff2b8')
    }
    for (let i = 0; i < 4; i++) {
      if (Math.sin(env.t * 4 + i * 1.7) > 0.6) sparkle(ctx, LETTER.x + hash(i) * 34, LETTER.y - 6 + hash(i * 3) * 8, '#fffbe0', true)
    }
  },
}
const letterTossed: Sprite = {
  id: 'cw_letter_tossed',
  name: '버려진 편지',
  z: 45,
  focus: LETTER_FOCUS,
  draw(ctx, env) {
    const x = LETTER.x + 8 + Math.sin(env.t) * 3
    grid(ctx, ['.WWW.', 'WwWWW', 'WWwW.', '.WWw.'], x, LETTER.y + 3, { W: '#e3d9bf', w: '#b8ab8c' })
    grid(ctx, ['WW.', 'wWW'], LETTER.x + 22, LETTER.y + 6, { W: '#e3d9bf', w: '#b8ab8c' })
  },
}
const letterPile: Sprite = {
  id: 'cw_letter_pile',
  name: '산더미 같은 편지',
  z: 45,
  focus: LETTER_FOCUS,
  draw(ctx) {
    for (let i = 0; i < 8; i++) letter(ctx, LETTER.x + (i % 2) * 2 - 1, LETTER.y + 2 - i * 2)
    for (let i = 0; i < 4; i++) letter(ctx, LETTER.x + 16 + (i % 2), LETTER.y + 2 - i * 2)
  },
}

// ── 7·8구: 시인 ─────────────────────────────────────────────
const POET_FOCUS = { x: 28, y: 124, w: 56, h: 31.5 }
const HEAD_FOCUS = { x: 38, y: 126, w: 32, h: 18 }

const HEAD_SPARSE = [
  '..............',
  '.......T......',
  '......H.HH....',
  '.....H.SSSS...',
  '.....HSSSES...',
  '.....SSSSSSS..',
  '......BSSS....',
  '......BBS.....',
]
const HEAD_FULL = [
  '.......TT.....',
  '......TTTT....',
  '.....HHHHHH...',
  '.....HHSSSS...',
  '.....HSSSES...',
  '.....HSSSSSS..',
  '......BSSS....',
  '......BBS.....',
]
const OLD = { ...POET_PAL, H: '#e8e6df', T: '#dcd9d0', B: '#cfcbc2', R: '#5f6170', r: '#45475a' } as Record<string, string>
const YOUNG = { ...POET_PAL, H: '#141216', T: '#141216', B: '#141216' } as Record<string, string>

const poetScratch: Sprite = {
  id: 'cw_poet_scratch',
  name: '흰머리를 긁는 시인',
  z: 60,
  focus: POET_FOCUS,
  draw(ctx, env) {
    const { x, y } = POET
    grid(ctx, withHead(HEAD_SPARSE), x, y, OLD)
    // 머리를 긁는 손
    const k = Math.round(Math.sin(env.t * 8))
    for (const [c, r] of [[10, 9], [11, 8], [11, 7], [11, 6], [10, 5]] as const) dot(ctx, x + c, y + r, OLD.R)
    dot(ctx, x + 9 + k, y + 3, OLD.S)
    dot(ctx, x + 10 + k, y + 3, OLD.S)
    // 빠져 떨어지는 흰머리
    for (let i = 0; i < 3; i++) {
      const f = mod(env.t * 0.5 + i / 3, 1)
      dot(ctx, x + 7 + i * 2 + Math.sin(f * 6) * 1.5, y + 3 + f * 18, '#efeee8')
    }
  },
}
const poetLongHair: Sprite = {
  id: 'cw_poet_longhair',
  name: '검고 긴 머리의 시인',
  z: 60,
  focus: POET_FOCUS,
  draw(ctx) {
    const { x, y } = POET
    grid(ctx, withHead(HEAD_FULL), x, y, YOUNG)
    px(ctx, x + 4, y + 3, 2, 12, '#141216')
    px(ctx, x + 3, y + 8, 1, 6, '#141216')
  },
}
const poetCombed: Sprite = {
  id: 'cw_poet_combed',
  name: '곱게 빗어 올린 머리',
  z: 60,
  focus: POET_FOCUS,
  draw(ctx, env) {
    const { x, y } = POET
    grid(ctx, withHead(HEAD_FULL), x, y, YOUNG)
    if (Math.sin(env.t * 2) > -0.3) {
      dot(ctx, x + 8, y + 1, '#7a809c')
      dot(ctx, x + 7, y + 3, '#5d6380')
    }
    // 빗
    px(ctx, x + 12, y + 9, 3, 1, '#b08a5a')
    for (let i = 0; i < 3; i++) dot(ctx, x + 12 + i, y + 10, '#8a6a42')
  },
}

const pinFalling: Sprite = {
  id: 'cw_pin_falling',
  name: '빠져나가는 비녀',
  z: 65,
  focus: HEAD_FOCUS,
  draw(ctx, env) {
    const { x, y } = POET
    const f = mod(env.t / 3, 1)
    // 0~0.5: 비녀가 미끄러져 나옴, 0.5~1: 떨어짐
    let px0 = x + 5 - Math.min(f, 0.5) * 6
    let py0 = y + 1
    if (f > 0.5) {
      px0 = x + 2 - (f - 0.5) * 6
      py0 = y + 1 + Math.pow((f - 0.5) * 2, 2) * 20
    }
    px(ctx, px0, py0, 6, 1, '#c9a24a')
    dot(ctx, px0, py0, '#f0d27a')
  },
}
const pinFirm: Sprite = {
  id: 'cw_pin_firm',
  name: '단단히 꽂힌 비녀',
  z: 65,
  focus: HEAD_FOCUS,
  draw(ctx, env) {
    const { x, y } = POET
    px(ctx, x + 4, y + 1, 9, 1, '#c9a24a')
    dot(ctx, x + 12, y + 1, '#f0d27a')
    dot(ctx, x + 4, y + 1, '#8a6a2a')
    if (Math.sin(env.t * 3) > 0.5) sparkle(ctx, x + 10, y, '#fffbe0', true)
  },
}
const crown: Sprite = {
  id: 'cw_crown',
  name: '화려한 관',
  z: 65,
  focus: HEAD_FOCUS,
  draw(ctx, env) {
    const { x, y } = POET
    grid(ctx, ['.G.G.G.', 'GGGGGGG', 'GgRgRgG', 'GGGGGGG'], x + 4, y - 1, { G: '#d9a441', g: '#b07a20', R: '#c43a3a' })
    if (Math.sin(env.t * 4) > 0.4) sparkle(ctx, x + 10, y - 2, '#fffbe0', true)
  },
}

export const CHUNWANG_SPRITES: Sprite[] = [
  landIntact, landRuined, landBurning,
  overgrown, crowd, snowCity,
  flowersTears, flowersBright, flowersWithered,
  birdStartle, birdSing, birdSleep,
  beacons, beaconOut, fireworks,
  letterGold, letterTossed, letterPile,
  poetScratch, poetLongHair, poetCombed,
  pinFalling, pinFirm, crown,
]
