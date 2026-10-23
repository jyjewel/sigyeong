// 孟浩然〈宿建德江〉, 韋應物〈滁州西澗〉
import type { Background, Sprite } from '../types'
import { H, W, disc, dot, fillRows, grid, hash, mod, px } from '../pixel'
import type { Ctx } from '../pixel'
import { bird, boat, broadTree, grassBlade, mistBands, moon, person, rain, ridge, sky, veil, withAlpha } from '../kit'

// ════════════════════════ 宿建德江 ════════════════════════
const JD_HORIZON = 100
const JD_BOAT = { x: 132, y: 146 }

export const jiandejiangBackground: Background = {
  id: 'jiandejiang',
  drawBack(ctx) {
    sky(ctx, ['#4a4a72', '#6a5c80', '#8e6e84', '#b48480', '#d49c7c', '#e8b47e'], JD_HORIZON)
    // 먼 들
    px(ctx, 0, JD_HORIZON - 3, W, 5, '#4a4a4a')
    for (let y = JD_HORIZON + 2; y < H; y++) px(ctx, 0, y, W, 1, y < 112 ? '#7a7a8e' : y < 150 ? '#6a6c84' : '#5c5e78')
    for (let i = 0; i < 30; i++) px(ctx, hash(i * 3) * W, JD_HORIZON + 6 + hash(i * 5) * 70, 10, 1, '#8486a0')
  },
  drawFront() {},
  drawDynamic() {},
}

const JD_ISLET_FOCUS = { x: 64, y: 96, w: 160, h: 84 }

function jdTraveler(ctx: Ctx, x: number, y: number, bow: number) {
  px(ctx, x, y - 7 + bow, 3, 1, '#1f1d22')
  px(ctx, x, y - 6 + bow, 3, 2, '#e6c39b')
  px(ctx, x - 1, y - 4, 5, 4, '#4b5068')
}

const jdIslet: Sprite = {
  id: 'jd_misty_islet',
  name: '안개 낀 물가에 댄 배',
  z: 30,
  focus: JD_ISLET_FOCUS,
  draw(ctx, env) {
    for (let dy = -4; dy <= 4; dy++) {
      const w = Math.round(30 * Math.sqrt(1 - (dy * dy) / 20))
      px(ctx, 96 - w, 148 + dy, w * 2, 1, dy < -2 ? '#9a9a84' : '#7c7c6a')
    }
    for (let i = 0; i < 18; i++) grassBlade(ctx, 74 + i * 2.6, 146, 5 + hash(i) * 5, Math.sin(env.t + i) * 0.8, '#5a6a4a')
    boat(ctx, JD_BOAT.x, JD_BOAT.y, { len: 24, lantern: true, t: env.t })
    for (let k = 0; k < 8; k++) dot(ctx, JD_BOAT.x - 12 - k * 1.5, JD_BOAT.y - 2 + k * 0.3, '#c8b890')
    mistBands(ctx, env.t, [138, 146, 154], '#e8e0e8', 0.4)
  },
}
const jdBusyPier: Sprite = {
  id: 'jd_busy_pier',
  name: '번화한 나루터',
  z: 30,
  focus: JD_ISLET_FOCUS,
  draw(ctx, env) {
    px(ctx, 70, 140, 80, 3, '#6b4a32')
    for (let k = 0; k < 6; k++) px(ctx, 72 + k * 14, 143, 2, 8, '#4a3426')
    ;[90, 116, 142].forEach((x, i) => boat(ctx, x, 156 + (i % 2) * 6, { len: 20, lantern: true, t: env.t + i }))
    for (let i = 0; i < 5; i++) person(ctx, 74 + mod(i * 16 + env.t * 5, 74), 132, ['#7a4a3a', '#4f6b4a', '#6b5a7a', '#8a7a55', '#4b5068'][i])
  },
}
const jdCliff: Sprite = {
  id: 'jd_cliff',
  name: '깎아지른 절벽 아래',
  z: 30,
  focus: JD_ISLET_FOCUS,
  draw(ctx, env) {
    for (let y = 40; y < 170; y++) {
      const w = 40 + (y - 40) * 0.25
      px(ctx, 160, y, w, 1, (y % 7) ? '#4a4844' : '#3a3834')
    }
    boat(ctx, 150, 160, { len: 22, t: env.t })
  },
}

const JD_BOAT_FOCUS = { x: 96, y: 112, w: 80, h: 45 }

const jdSorrow: Sprite = {
  id: 'jd_sorrow',
  name: '저물녘 나그네의 시름',
  z: 40,
  focus: { x: 64, y: 48, w: 192, h: 108 },
  draw(ctx, env) {
    // 지평선으로 반쯤 진 해
    disc(ctx, 230, JD_HORIZON - 2, 8, '#ffb070')
    px(ctx, 220, JD_HORIZON - 2, 20, 10, '#4a4a4a')
    for (let y = JD_HORIZON + 3; y < 150; y += 3) px(ctx, 226 + Math.sin(env.t * 2 + y) * 2, y, 8, 1, '#d89070')
    jdTraveler(ctx, JD_BOAT.x - 6, JD_BOAT.y - 3, 1)
    withAlpha(ctx, 0.3 + 0.1 * Math.sin(env.t), () => disc(ctx, JD_BOAT.x - 5, JD_BOAT.y - 14, 4, '#7a7a90'))
  },
}
const jdMerry: Sprite = {
  id: 'jd_merry',
  name: '들떠서 노래하는 나그네',
  z: 40,
  focus: JD_BOAT_FOCUS,
  draw(ctx, env) {
    const hop = Math.sin(env.t * 6) > 0 ? 1 : 0
    jdTraveler(ctx, JD_BOAT.x - 6, JD_BOAT.y - 3 - hop, 0)
    for (let i = 0; i < 3; i++) {
      const f = mod(env.t * 0.7 + i / 3, 1)
      grid(ctx, ['.KK', '.K.', 'KK.'], JD_BOAT.x - 2 + f * 10, JD_BOAT.y - 14 - f * 14, { K: '#f0e0c0' })
    }
  },
}
const jdAsleep: Sprite = {
  id: 'jd_asleep',
  name: '잠든 나그네',
  z: 40,
  focus: JD_BOAT_FOCUS,
  draw(ctx, env) {
    px(ctx, JD_BOAT.x - 10, JD_BOAT.y - 4, 10, 3, '#4b5068')
    px(ctx, JD_BOAT.x - 13, JD_BOAT.y - 5, 3, 3, '#e6c39b')
    for (let i = 0; i < 3; i++) {
      const f = mod(env.t * 0.4 + i / 3, 1)
      grid(ctx, ['KKK', '.K.', 'KKK'], JD_BOAT.x - 6 + f * 8 + i, JD_BOAT.y - 12 - f * 12, { K: '#e0d8e0' })
    }
  },
}

const JD_PLAIN_FOCUS = { x: 0, y: 40, w: 320, h: 90 }

const jdWidePlain: Sprite = {
  id: 'jd_wide_plain',
  name: '나무보다 낮은 하늘',
  z: 8,
  focus: JD_PLAIN_FOCUS,
  draw(ctx) {
    // 지평선의 작은 나무들: 하늘이 그 위로 낮게 내려앉음
    for (let i = 0; i < 40; i++) {
      const x = i * 8 + hash(i) * 5
      const h = 3 + hash(i * 3) * 3
      px(ctx, x, JD_HORIZON - 3 - h, 3, h, '#3a3a40')
      px(ctx, x + 1, JD_HORIZON - 3, 1, 2, '#2e2e30')
    }
    withAlpha(ctx, 0.4, () => px(ctx, 0, JD_HORIZON - 14, W, 8, '#e8b47e'))
  },
}
const jdMountains: Sprite = {
  id: 'jd_mountains',
  name: '하늘을 가린 높은 산',
  z: 8,
  focus: JD_PLAIN_FOCUS,
  draw(ctx) {
    ridge(ctx, (x) => 30 + Math.abs(Math.sin(x * 0.02 + 1)) * 40 + hash(x) * 2, '#3e3c50', '#55536a', 0, W, JD_HORIZON + 2)
  },
}
const jdForest: Sprite = {
  id: 'jd_forest',
  name: '하늘을 덮은 숲',
  z: 8,
  focus: JD_PLAIN_FOCUS,
  draw(ctx) {
    for (let i = 0; i < 30; i++) disc(ctx, i * 11, 60 + hash(i) * 20, 12, (dy) => (dy < -4 ? '#3a5a3a' : '#2a442c'))
    px(ctx, 0, 70, W, JD_HORIZON - 68, '#2a442c')
  },
}

const JD_MOON_FOCUS = { x: 64, y: 30, w: 192, h: 135 }

const jdMoonNear: Sprite = {
  id: 'jd_moon_near',
  name: '사람 가까이 비친 달',
  z: 12,
  focus: JD_MOON_FOCUS,
  draw(ctx, env) {
    moon(ctx, 170, 40, 7)
    // 배 바로 곁 물에 비친 달
    const x = JD_BOAT.x + 22
    const y = JD_BOAT.y + 6
    for (let dy = -4; dy <= 4; dy++) {
      const w = Math.round(6 * Math.sqrt(1 - (dy * dy) / 20)) + Math.round(Math.sin(env.t * 3 + dy) * 1)
      px(ctx, x - w, y + dy, w * 2, 1, '#f6edc6')
    }
    for (let k = 0; k < 5; k++) if (Math.sin(env.t * 2 + k) > 0) px(ctx, x - 8 + k * 4, y + 6, 3, 1, '#e8dca8')
  },
}
const jdMoonHidden: Sprite = {
  id: 'jd_moon_hidden',
  name: '구름에 숨은 달',
  z: 12,
  focus: JD_MOON_FOCUS,
  draw(ctx, env) {
    withAlpha(ctx, 0.4, () => disc(ctx, 170, 40, 7, '#d8d0b0'))
    for (let k = 0; k < 4; k++) px(ctx, 120 + mod(env.t * 3 + k * 30, 100), 34 + k * 4, 50, 4, '#4a4a66')
    veil(ctx, 0.25, '#1a1a2a')
  },
}
const jdMoonFar: Sprite = {
  id: 'jd_moon_far',
  name: '먼 산 뒤로 넘어가는 달',
  z: 6,
  focus: JD_MOON_FOCUS,
  draw(ctx) {
    disc(ctx, 290, JD_HORIZON - 6, 4, '#e8dcb0')
    ridge(ctx, (x) => JD_HORIZON - 8 + Math.abs(Math.sin(x * 0.08)) * 4, '#3e3c50', undefined, 260, W, JD_HORIZON)
  },
}

export const JIANDEJIANG_SPRITES: Sprite[] = [
  jdIslet, jdBusyPier, jdCliff,
  jdSorrow, jdMerry, jdAsleep,
  jdWidePlain, jdMountains, jdForest,
  jdMoonNear, jdMoonHidden, jdMoonFar,
]

// ════════════════════════ 滁州西澗 ════════════════════════
// 시내: 오른쪽 위에서 왼쪽 아래로
const czC = (y: number) => 260 - (y - 60) * 1.5
const czW = (y: number) => 6 + (y - 60) * 0.12
const czStream = (y: number): [number, number] => [czC(y) - czW(y), czC(y) + czW(y)]
const CZ_TREE = { x: 70, y: 112 }
const CZ_PIER = { x: 120, y: 160 }

export const chuzhouBackground: Background = {
  id: 'chuzhou',
  drawBack(ctx) {
    sky(ctx, ['#9aa6b0', '#aab2b8', '#bcbfbc', '#ccc8bc'], 70)
    ridge(ctx, (x) => 50 + 10 * Math.sin(x * 0.03 + 1) + hash(x) * 1.5, '#8a9a8e', '#9aa89c', 0, W, 72)
    px(ctx, 0, 66, W, H - 66, '#5e7048')
    for (let i = 0; i < 80; i++) px(ctx, hash(i * 3.3) * W, 70 + hash(i * 2.1) * 110, 2, 1, i % 2 ? '#52633e' : '#6e8256')
    fillRows(ctx, 60, H, czStream, '#7e9aa6')
  },
  drawFront(ctx) {
    // 들판 나루 말뚝
    for (const k of [-10, 6]) px(ctx, CZ_PIER.x + k, CZ_PIER.y - 8, 2, 12, '#4a3426')
    px(ctx, CZ_PIER.x - 16, CZ_PIER.y - 4, 30, 2, '#6b4a32')
  },
  drawDynamic(ctx) {
    // 깊은 나무
    px(ctx, CZ_TREE.x - 2, CZ_TREE.y - 30, 5, 30, '#3a2a1c')
    broadTree(ctx, CZ_TREE.x, CZ_TREE.y - 18, 2.2, { dark: '#24402a', base: '#2f5434', light: '#41683f' })
  },
}

const CZ_BANK = { x: 120, y: 60, w: 200, h: 112 }

function czBankPts(n: number, seed: number) {
  const out: { x: number; y: number }[] = []
  for (let i = 0; i < n; i++) {
    const y = 64 + hash(seed + i * 3.1) * 110
    const side = i % 2 ? 1 : -1
    out.push({ x: czC(y) + side * (czW(y) + 2 + hash(seed + i) * 8), y })
  }
  return out
}

const czGrass: Sprite = {
  id: 'cz_grass',
  name: '시냇가의 그윽한 풀',
  z: 30,
  focus: CZ_BANK,
  draw(ctx, env) {
    czBankPts(60, 1).forEach((p, i) => {
      for (let k = 0; k < 3; k++) grassBlade(ctx, p.x + k - 1, p.y, 4 + hash(i * 3 + k) * 4, Math.sin(env.t * 0.8 + i) * 0.8 + (k - 1) * 0.6, k % 2 ? '#3e5a32' : '#4f7040')
    })
  },
}
const czPeony: Sprite = {
  id: 'cz_peony',
  name: '화려한 모란',
  z: 30,
  focus: CZ_BANK,
  draw(ctx) {
    czBankPts(14, 5).forEach((p, i) => {
      disc(ctx, p.x, p.y - 2, 3, i % 2 ? '#d83a5a' : '#e86a8a')
      dot(ctx, p.x, p.y - 2, '#f7d77a')
      px(ctx, p.x - 3, p.y + 1, 6, 1, '#4f7040')
    })
  },
}
const czBare: Sprite = {
  id: 'cz_bare',
  name: '풀 없는 맨바위',
  z: 30,
  focus: CZ_BANK,
  draw(ctx) {
    czBankPts(20, 9).forEach((p) => disc(ctx, p.x, p.y, 3, (dy) => (dy < 0 ? '#9a978c' : '#77746a')))
    withAlpha(ctx, 0.35, () => fillRows(ctx, 60, H, (y) => [czC(y) - czW(y) - 12, czC(y) + czW(y) + 12], '#a8987a'))
  },
}

const CZ_TREE_FOCUS = { x: 16, y: 20, w: 112, h: 72 }

const czOriole: Sprite = {
  id: 'cz_oriole',
  name: '깊은 나무 속 꾀꼬리',
  z: 50,
  focus: CZ_TREE_FOCUS,
  draw(ctx, env) {
    ;[[52, 54], [80, 48], [66, 66]].forEach(([x, y], i) => {
      grid(ctx, ['.YY.', 'YYYk', '.YK.'], x, y, { Y: '#f0c030', K: '#1f1d22', k: '#e07a3a' })
      const f = mod(env.t * 0.9 + i * 0.4, 1)
      if (f < 0.5) grid(ctx, ['.KK', '.K.', 'KK.'], x + 5 + f * 6, y - 4 - f * 8, { K: '#f8f0c0' })
    })
  },
}
const czCrows: Sprite = {
  id: 'cz_crows',
  name: '까마귀 떼',
  z: 50,
  focus: CZ_TREE_FOCUS,
  draw(ctx, env) {
    for (let i = 0; i < 7; i++) {
      const a = env.t * 0.7 + i
      bird(ctx, 70 + Math.cos(a) * 34, 40 + Math.sin(a * 1.4) * 10, Math.floor(env.t * 6 + i) % 2, '#0e0e12')
    }
  },
}
const czOwl: Sprite = {
  id: 'cz_owl',
  name: '부엉이',
  z: 50,
  focus: CZ_TREE_FOCUS,
  draw(ctx, env) {
    const blink = mod(env.t, 3) < 0.15
    grid(ctx, ['K..K', 'BBBB', blink ? 'BKKB' : 'YKYK', 'BBBB', '.BB.'], 66, 56, { K: '#3a2a1c', B: '#8a6a4a', Y: '#f0d040' })
  },
}

const CZ_WATER_FOCUS = { x: 96, y: 56, w: 224, h: 124 }

const czFlood: Sprite = {
  id: 'cz_flood',
  name: '비 머금은 세찬 물살',
  z: 10,
  focus: CZ_WATER_FOCUS,
  draw(ctx, env) {
    fillRows(ctx, 60, H, (y) => [czC(y) - czW(y) - 6, czC(y) + czW(y) + 6], '#6e8c9a')
    for (let i = 0; i < 60; i++) {
      const f = mod(hash(i * 2.1) + env.t * 0.35, 1)
      const y = 60 + f * (H - 60)
      const x = czC(y) + (hash(i * 5) - 0.5) * czW(y) * 2
      px(ctx, x, y, 3, 1, f > 0.5 ? '#e6f2f8' : '#bcd6e6')
    }
    rain(ctx, env.t, 90, 170, 'rgba(200,215,230,0.55)', 5, -1)
  },
}
const czEbb: Sprite = {
  id: 'cz_ebb',
  name: '잔잔히 빠지는 물',
  z: 10,
  focus: CZ_WATER_FOCUS,
  draw(ctx) {
    fillRows(ctx, 60, H, czStream, '#b8a882')
    fillRows(ctx, 60, H, (y) => [czC(y) - czW(y) * 0.4, czC(y) + czW(y) * 0.4], '#8eaab6')
  },
}
const czFrozen: Sprite = {
  id: 'cz_frozen',
  name: '꽁꽁 언 시내',
  z: 10,
  focus: CZ_WATER_FOCUS,
  draw(ctx) {
    fillRows(ctx, 60, H, czStream, (y) => (y % 6 ? '#e2ecf2' : '#c8d8e4'))
  },
}

const CZ_PIER_FOCUS = { x: 64, y: 120, w: 112, h: 60 }

const czEmptyBoat: Sprite = {
  id: 'cz_empty_boat',
  name: '홀로 가로놓인 배',
  z: 40,
  focus: CZ_PIER_FOCUS,
  draw(ctx, env) {
    // 사람 없는 배가 물살에 비스듬히 돌아감
    const a = Math.sin(env.t * 0.4) * 0.35 + 0.5
    const cx = CZ_PIER.x + 20
    const cy = CZ_PIER.y + 2
    for (let k = -12; k <= 12; k++) {
      const x = cx + Math.cos(a) * k
      const y = cy + Math.sin(a) * k * 0.5
      px(ctx, x, y, 1, 3, Math.abs(k) > 10 ? '#4a3426' : '#5a3d28')
    }
    for (let k = 0; k < 10; k++) dot(ctx, CZ_PIER.x + 6 + k * (cx - Math.cos(a) * 12 - CZ_PIER.x - 6) / 10, CZ_PIER.y - 3 + k * 0.4 + Math.sin(k * 0.6) * 1, '#c8b890')
  },
}
const czFerryman: Sprite = {
  id: 'cz_ferryman',
  name: '손님 태운 사공',
  z: 40,
  focus: CZ_PIER_FOCUS,
  draw(ctx, env) {
    const x = CZ_PIER.x + 22 + Math.sin(env.t * 0.5) * 10
    const y = CZ_PIER.y + 2
    px(ctx, x - 12, y, 24, 3, '#5a3d28')
    person(ctx, x - 6, y - 8, '#6b5a4a', { hat: '#c9b07a' })
    person(ctx, x + 4, y - 8, '#4b5068')
    for (let k = 0; k < 14; k++) dot(ctx, x - 4 - k * 0.3, y - 6 + k, '#8a6a42')
  },
}
const czBoatsTied: Sprite = {
  id: 'cz_boats_tied',
  name: '줄지어 매인 배들',
  z: 40,
  focus: CZ_PIER_FOCUS,
  draw(ctx) {
    for (let k = 0; k < 3; k++) {
      px(ctx, CZ_PIER.x - 14 + k * 4, CZ_PIER.y + 4 + k * 5, 26, 3, '#5a3d28')
      dot(ctx, CZ_PIER.x - 16 + k * 4, CZ_PIER.y + 3 + k * 5, '#c8b890')
    }
  },
}

export const CHUZHOU_SPRITES: Sprite[] = [
  czGrass, czPeony, czBare,
  czOriole, czCrows, czOwl,
  czFlood, czEbb, czFrozen,
  czEmptyBoat, czFerryman, czBoatsTied,
]

