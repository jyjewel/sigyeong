// 李白〈下江陵〉, 王維〈竹里館〉
import type { Background, Sprite } from '../types'
import { H, W, disc, dot, fillRows, grid, hash, mod, px } from '../pixel'
import type { Ctx, Env } from '../pixel'
import { bamboo, moon, person, sky, sparkle, stars, veil, withAlpha } from '../kit'
import { SEATED, STANDING, pal, withHead } from '../figures'

// ════════════════════════ 下江陵 ════════════════════════
const XJ_V = { x: 150, y: 70 } // 강이 협곡 안쪽으로 사라지는 곳
const xjRiver = (y: number): [number, number] => {
  const f = (y - XJ_V.y) / (H - XJ_V.y)
  return [XJ_V.x - 6 - f * 90, XJ_V.x + 6 + f * 110]
}
const xjLeftCliff = (y: number) => XJ_V.x - 10 - ((y - 20) / 160) * 100
const xjRightCliff = (y: number) => XJ_V.x + 12 + ((y - 20) / 160) * 120
const XJ_CITY = { x: 30, y: 30 }

export const xiajianglingBackground: Background = {
  id: 'xiajiangling',
  drawBack(ctx) {
    sky(ctx, ['#e8c8b8', '#eed6c0', '#f2e2cc', '#f0e8d8'], 80)
    // 강
    fillRows(ctx, XJ_V.y, H, xjRiver, (y) => (y < 100 ? '#9fb8c0' : y < 140 ? '#88a4b0' : '#7898a6'))
  },
  drawFront(ctx) {
    // 양쪽 벼랑
    for (let y = 16; y < H; y++) {
      const l = xjLeftCliff(y)
      const r = xjRightCliff(y)
      const [rl, rr] = y >= XJ_V.y ? xjRiver(y) : [XJ_V.x, XJ_V.x]
      for (let x = 0; x < (y >= XJ_V.y ? rl : l); x++) {
        const top = 14 + Math.abs(Math.sin(x * 0.06)) * 10 + x * 0.1
        if (y < top) continue
        dot(ctx, x, y, (x + y * 2) % 13 === 0 ? '#4e5a52' : hash(x * 3 + y) < 0.05 ? '#7a8a74' : '#5e6a5e')
      }
      for (let x = y >= XJ_V.y ? rr : r; x < W; x++) {
        const top = 24 + Math.abs(Math.sin(x * 0.05 + 1)) * 12 - (W - x) * 0.02
        if (y < top) continue
        dot(ctx, x, y, (x * 2 + y) % 11 === 0 ? '#4a5650' : hash(x * 5 + y) < 0.05 ? '#768670' : '#5a665a')
      }
    }
    // 벼랑의 나무 덤불
    for (let i = 0; i < 40; i++) {
      const left = i % 2 === 0
      const y = 30 + hash(i * 3.3) * 140
      const x = left ? hash(i * 1.7) * (xjLeftCliff(y) - 6) : xjRightCliff(y) + 6 + hash(i * 2.1) * 60
      disc(ctx, x, y, 2, '#3f5a3a')
    }
    // 백제성
    const { x, y } = XJ_CITY
    px(ctx, x - 12, y + 6, 56, 6, '#8a8272')
    for (let k = 0; k < 56; k += 5) px(ctx, x - 12 + k, y + 3, 3, 3, '#8a8272')
    px(ctx, x, y - 6, 22, 12, '#e2d4b4')
    px(ctx, x - 3, y - 10, 28, 4, '#3c4048')
    px(ctx, x + 26, y - 2, 12, 8, '#e2d4b4')
    px(ctx, x + 24, y - 5, 16, 3, '#3c4048')
  },
  drawDynamic() {},
}

const XJ_SKY = { x: 0, y: 0, w: 192, h: 108 }

const xjClouds: Sprite = {
  id: 'xj_clouds',
  name: '채색 구름 사이의 백제성',
  z: 60,
  focus: XJ_SKY,
  draw(ctx, env) {
    const cols = ['#f4b8b0', '#f7d38a', '#d8b8e8', '#f8e0c0']
    for (let k = 0; k < 6; k++) {
      const x = mod(k * 40 + env.t * 2, W + 80) - 80
      const y = 14 + (k % 3) * 12
      withAlpha(ctx, 0.85, () => {
        px(ctx, x, y, 50, 3, cols[k % 4])
        px(ctx, x + 6, y - 2, 34, 2, cols[(k + 1) % 4])
        px(ctx, x + 10, y + 3, 30, 2, cols[(k + 2) % 4])
      })
    }
  },
}
const xjStorm: Sprite = {
  id: 'xj_storm',
  name: '먹구름과 번개',
  z: 60,
  focus: XJ_SKY,
  draw(ctx, env) {
    veil(ctx, 0.35, '#3a3e4a')
    for (let k = 0; k < 5; k++) px(ctx, k * 70 - 20, 8 + (k % 2) * 8, 90, 10, '#4a4e5a')
    if (mod(env.t, 3) < 0.15) {
      let x = 90
      for (let y = 20; y < 60; y += 3) {
        x += hash(y) > 0.5 ? 2 : -2
        px(ctx, x, y, 1, 3, '#fff8c0')
      }
    }
  },
}
const xjNight: Sprite = {
  id: 'xj_night',
  name: '한밤의 어둠',
  z: 60,
  focus: XJ_SKY,
  draw(ctx, env) {
    veil(ctx, 0.7, '#0e1428')
    stars(ctx, 30, 9, 2, 50, env.t)
  },
}

// 배
function xjBoat(ctx: Ctx, f: number) {
  // f: 0(협곡 안쪽) → 1(앞쪽)
  const y = XJ_V.y + 4 + f * (H - XJ_V.y - 16)
  const s = 0.3 + f * 0.9
  const x = XJ_V.x + Math.sin(f * 4) * 10 * f
  const len = Math.max(3, Math.round(18 * s))
  px(ctx, x - len / 2, y, len, Math.max(1, Math.round(3 * s)), '#5a3d28')
  px(ctx, x - len / 4, y - Math.round(4 * s), Math.max(1, len / 2), Math.max(1, Math.round(4 * s)), '#3d3a32')
  return { x, y, s }
}

function xjBoatF(env: Env) {
  if (env.fx.blocked) return 0.55
  if (env.fx.upstream) return 1 - mod(env.t / 10, 1)
  if (env.fx.slow) return mod(env.t / 30, 1)
  return mod(env.t / 3.2, 1)
}

const XJ_RIVER_FOCUS = { x: 40, y: 60, w: 224, h: 120 }

const xjFast: Sprite = {
  id: 'xj_fast',
  name: '천 리를 하루에 가는 배',
  z: 40,
  focus: XJ_RIVER_FOCUS,
  draw(ctx, env) {
    const f = xjBoatF(env)
    const b = xjBoat(ctx, f)
    if (!env.fx.blocked && !env.fx.upstream) {
      for (let k = 1; k < 6; k++) withAlpha(ctx, 0.5 - k * 0.08, () => px(ctx, b.x - 1, b.y - k * 4 * b.s, 2, 2 * b.s, '#e6f0f4'))
      dot(ctx, b.x - 6 * b.s, b.y + 1, '#ffffff')
      dot(ctx, b.x + 6 * b.s, b.y + 1, '#ffffff')
    }
  },
}
const xjSlow: Sprite = {
  id: 'xj_slow',
  name: '느릿느릿 떠가는 배',
  z: 40,
  fx: { slow: 1 },
  focus: XJ_RIVER_FOCUS,
  draw(ctx, env) {
    xjBoat(ctx, xjBoatF(env))
  },
}
const xjUpstream: Sprite = {
  id: 'xj_upstream',
  name: '물살을 거슬러 오르는 배',
  z: 40,
  fx: { upstream: 1 },
  focus: XJ_RIVER_FOCUS,
  draw(ctx, env) {
    const b = xjBoat(ctx, xjBoatF(env))
    // 언덕에서 줄로 끄는 사람들
    for (let k = 0; k < 3; k++) {
      const px0 = xjLeftCliff(b.y - 10) - 8 - k * 6
      person(ctx, px0, b.y - 20 - k * 3, '#6b5a4a', { step: Math.floor(env.t * 3 + k) % 2 })
    }
    for (let k = 0; k < 12; k++) dot(ctx, b.x - k * (b.x - xjLeftCliff(b.y - 10) + 6) / 12, b.y - 2 - k * 1.2, '#c8b890')
  },
}

const XJ_CLIFF_FOCUS = { x: 0, y: 30, w: 320, h: 150 }

function ape(ctx: Ctx, x: number, y: number, flip: boolean, env: Env, i: number) {
  grid(ctx, ['.KK.', 'KFFK', '.KK.', 'KKKK', 'K..K'], x, y, { K: '#6a4a32', F: '#d8b890' }, flip)
  const tail = Math.round(Math.sin(env.t * 3 + i))
  dot(ctx, flip ? x - 1 : x + 4, y + 3 + tail, '#6a4a32')
  const f = mod(env.t * 0.9 + i * 0.3, 1)
  if (f < 0.6) {
    const r = 3 + f * 8
    for (let a = -0.6; a <= 0.6; a += 0.3) dot(ctx, x + 2 + (flip ? -1 : 1) * Math.cos(a) * r, y + 1 + Math.sin(a) * r, '#fff4e0')
  }
}

const xjApes: Sprite = {
  id: 'xj_apes',
  name: '그치지 않는 원숭이 울음',
  z: 50,
  focus: XJ_CLIFF_FOCUS,
  draw(ctx, env) {
    ;[[60, 70], [36, 110], [90, 50], [14, 150]].forEach(([x, y], i) => ape(ctx, x, y, false, env, i))
    ;[[230, 80], [272, 120], [214, 52], [296, 160]].forEach(([x, y], i) => ape(ctx, x, y, true, env, i + 4))
  },
}
const xjTiger: Sprite = {
  id: 'xj_tiger',
  name: '포효하는 호랑이',
  z: 50,
  focus: XJ_CLIFF_FOCUS,
  draw(ctx, env) {
    const x = 50
    const y = 100
    grid(ctx, ['KK.......', 'KOOOOOOO.', 'OBOBOBOO.', '.OOOOOOOO', '.O.O..O.O'], x, y, { O: '#d98a2a', B: '#2a1e14', K: '#d98a2a' })
    if (Math.sin(env.t * 3) > 0) for (let r = 4; r < 14; r += 4) for (let a = -0.6; a <= 0.6; a += 0.3) dot(ctx, x - Math.cos(a) * r, y + 1 + Math.sin(a) * r, '#fff4e0')
  },
}
const xjCheer: Sprite = {
  id: 'xj_cheer',
  name: '환호하는 사람들',
  z: 50,
  focus: XJ_CLIFF_FOCUS,
  draw(ctx, env) {
    ;[[40, 100], [56, 96], [250, 110], [266, 106]].forEach(([x, y], i) => {
      person(ctx, x, y, ['#7a4a3a', '#4f6b4a', '#6b5a7a', '#8a7a55'][i])
      const up = Math.sin(env.t * 6 + i) > 0
      dot(ctx, x - 1, y + (up ? 0 : 3), '#e6c39b')
      dot(ctx, x + 3, y + (up ? 0 : 3), '#e6c39b')
    })
  },
}

const xjPast: Sprite = {
  id: 'xj_past_mountains',
  name: '지나온 만 겹 산',
  z: 15,
  focus: { x: 40, y: 20, w: 240, h: 135 },
  draw(ctx, env) {
    // 협곡 안쪽으로 겹겹이 물러나는 산 그림자
    for (let k = 0; k < 6; k++) {
      const f = mod(k / 6 + env.t * 0.08, 1)
      const y = XJ_V.y - 4 - f * 14
      const w = 30 - f * 22
      withAlpha(ctx, 0.25 + (1 - f) * 0.35, () => {
        for (let x = -w; x < w; x++) {
          const h = (1 - Math.abs(x / w)) * (10 - f * 6) + hash(x + k * 20) * 2
          px(ctx, XJ_V.x + x, y - h, 1, h, k % 2 ? '#7a8a8a' : '#8a9898')
        }
      })
    }
  },
}
const xjBlocked: Sprite = {
  id: 'xj_blocked',
  name: '바위에 막힌 배',
  z: 45,
  fx: { blocked: 1 },
  focus: XJ_RIVER_FOCUS,
  draw(ctx, env) {
    for (let k = 0; k < 5; k++) disc(ctx, 120 + k * 14, 132 + (k % 2) * 3, 5, (dy) => (dy < 0 ? '#8a877c' : '#66635a'))
    for (let k = 0; k < 8; k++) if (Math.sin(env.t * 5 + k) > 0) dot(ctx, 116 + k * 9, 128, '#ffffff')
  },
}
const xjReturn: Sprite = {
  id: 'xj_return',
  name: '백제성으로 돌아가는 배',
  z: 45,
  fx: { upstream: 1 },
  focus: XJ_RIVER_FOCUS,
  draw() {},
}

export const XIAJIANGLING_SPRITES: Sprite[] = [
  xjClouds, xjStorm, xjNight,
  xjFast, xjSlow, xjUpstream,
  xjApes, xjTiger, xjCheer,
  xjPast, xjBlocked, xjReturn,
]

// ════════════════════════ 竹里館 ════════════════════════
const ZL_POET = { x: 150, y: 128 } // 좌상 격자 좌상단 (2배)
const ZL_SC = 2
const ZL_BAMBOO = Array.from({ length: 34 }, (_, i) => ({
  x: Math.round(hash(i * 3.3) * W),
  y: 120 + Math.round(hash(i * 1.9) * 60),
  h: 70 + Math.round(hash(i * 5.1) * 70),
}))
const ZL_PAL = pal({ R: '#e9e4d6', r: '#c9c2b0', L: '#8a7a55' })

export const zhuliguanBackground: Background = {
  id: 'zhuliguan',
  drawBack(ctx) {
    sky(ctx, ['#0f1a24', '#132230', '#182a38', '#1c3040'], 120)
    px(ctx, 0, 120, W, H - 120, '#1e2a22')
    // 공터의 돌자리
    for (let dy = -6; dy <= 6; dy++) {
      const w = Math.round(46 * Math.sqrt(1 - (dy * dy) / 40))
      px(ctx, 164 - w, 162 + dy, w * 2, 1, '#2c3a2e')
    }
  },
  drawFront(ctx) {
    px(ctx, 140, 158, 50, 4, '#4a4a40')
  },
  drawDynamic(ctx, env) {
    ZL_BAMBOO.forEach((b, i) => {
      if (b.x > 120 && b.x < 210 && b.y > 130) return
      withAlpha(ctx, b.y < 150 ? 0.6 : 0.9, () => bamboo(ctx, b.x, b.y, b.h, Math.sin(env.t * 0.6 + i) * 1.2, env.t))
    })
  },
}

const ZL_FOCUS = { x: 100, y: 96, w: 128, h: 72 }

function zlPoet(ctx: Ctx, env: Env) {
  grid(ctx, withHead(env.fx.lookUp ? ['.......KKK....', '......KKKKK...', '......KKKKSS..', '.....HSSSES...', '.....HSSSSSS..', '.....HSSSS....', '......BBS.....', '..............'] : STANDING.slice(0, 8), SEATED), ZL_POET.x, ZL_POET.y - 4, ZL_PAL, false, ZL_SC)
}

const zlAlone: Sprite = {
  id: 'zl_alone',
  name: '대숲 속에 홀로 앉은 시인',
  z: 40,
  focus: ZL_FOCUS,
  draw(ctx, env) {
    zlPoet(ctx, env)
  },
}
const zlGroup: Sprite = {
  id: 'zl_group',
  name: '둘러앉은 사람들',
  z: 40,
  focus: ZL_FOCUS,
  draw(ctx) {
    ;[[100, false], [132, false], [182, true], [214, true]].forEach(([x, f], i) =>
      grid(ctx, SEATED, x as number, 126, pal({ R: ['#e9e4d6', '#7a4a3a', '#4f6b4a', '#6b5a7a'][i] }), f as boolean, 2),
    )
  },
}
const zlWalking: Sprite = {
  id: 'zl_walking',
  name: '서성이며 걷는 시인',
  z: 40,
  focus: ZL_FOCUS,
  draw(ctx, env) {
    const x = 130 + Math.sin(env.t * 0.4) * 30
    grid(ctx, STANDING, x, 116, ZL_PAL, Math.cos(env.t * 0.4) < 0, 2)
  },
}

const zlQin: Sprite = {
  id: 'zl_qin',
  name: '거문고와 휘파람',
  z: 45,
  focus: ZL_FOCUS,
  draw(ctx, env) {
    const x = ZL_POET.x + 14
    const y = ZL_POET.y + 20
    px(ctx, x, y, 30, 4, '#6a3a22')
    for (let k = 0; k < 4; k++) px(ctx, x + 1, y + (k % 2), 28, 1, '#d9c79a')
    const pl = Math.sin(env.t * 6) > 0 ? 1 : 0
    px(ctx, x + 8 + pl * 2, y - 2, 3, 2, '#e6c39b')
    for (let i = 0; i < 3; i++) {
      const f = mod(env.t * 0.5 + i / 3, 1)
      withAlpha(ctx, 1 - f, () => grid(ctx, ['.KK', '.K.', 'KK.'], x + 20 + f * 20, y - 8 - f * 26, { K: '#e8e2c8' }))
    }
    // 길게 부는 휘파람
    for (let k = 0; k < 24; k++) {
      const f = k / 24
      withAlpha(ctx, 0.6 * (1 - f), () => dot(ctx, ZL_POET.x + 22 + k * 2, ZL_POET.y + 9 - k * 0.6 + Math.sin(k * 0.6 - env.t * 4) * 1.5, '#cfe0e8'))
    }
  },
}
const zlGo: Sprite = {
  id: 'zl_go',
  name: '바둑판',
  z: 45,
  focus: ZL_FOCUS,
  draw(ctx) {
    const x = ZL_POET.x + 32
    const y = ZL_POET.y + 22
    px(ctx, x, y, 16, 10, '#c9a76a')
    for (let k = 1; k < 4; k++) {
      px(ctx, x + k * 4, y, 1, 10, '#8a6a42')
      px(ctx, x, y + k * 2.5, 16, 1, '#8a6a42')
    }
    ;[[2, 2, 0], [6, 4, 1], [10, 2, 1], [6, 7, 0], [13, 6, 0]].forEach(([a, b, c]) => px(ctx, x + a, y + b, 2, 2, c ? '#f0ece0' : '#1a1a1e'))
  },
}
const zlRead: Sprite = {
  id: 'zl_read',
  name: '소리 내어 읽는 책',
  z: 45,
  focus: ZL_FOCUS,
  draw(ctx, env) {
    const x = ZL_POET.x + 20
    const y = ZL_POET.y + 16
    px(ctx, x, y, 14, 8, '#efe6cf')
    px(ctx, x - 1, y, 1, 8, '#8a6a42')
    px(ctx, x + 14, y, 1, 8, '#8a6a42')
    for (let r = 0; r < 3; r++) px(ctx, x + 2, y + 2 + r * 2, 10, 1, '#5d4a37')
    if (Math.sin(env.t * 4) > 0) for (let k = 0; k < 3; k++) dot(ctx, x + 18 + k * 3, y - 4 - k, '#e8e2c8')
  },
}

const ZL_WIDE = { x: 0, y: 20, w: 320, h: 160 }

const zlUnknown: Sprite = {
  id: 'zl_unknown',
  name: '아무도 모르는 깊은 숲',
  z: 70,
  focus: ZL_WIDE,
  draw(ctx, env) {
    for (let i = 0; i < 16; i++) {
      const x = i < 8 ? i * 12 : 320 - (i - 8) * 12
      bamboo(ctx, x, 182, 150, Math.sin(env.t * 0.5 + i) * 1.5, env.t)
    }
    withAlpha(ctx, 0.3, () => {
      px(ctx, 0, 0, 90, H, '#0a120e')
      px(ctx, 230, 0, 90, H, '#0a120e')
    })
  },
}
const zlCrowd: Sprite = {
  id: 'zl_crowd',
  name: '몰려든 구경꾼',
  z: 70,
  focus: ZL_WIDE,
  draw(ctx, env) {
    ;[[40, false], [76, false], [214, true], [250, true]].forEach(([x, f], i) => {
      const lean = Math.sin(env.t * 1.5 + i) > 0.6 ? 2 : 0
      grid(ctx, STANDING, (x as number) + (f ? -lean : lean), 112, pal({ R: ['#7a4a3a', '#4f6b4a', '#6b5a7a', '#8a7a55'][i], r: '#3a3030' }), f as boolean, 2)
    })
  },
}
const zlServant: Sprite = {
  id: 'zl_servant',
  name: '시중드는 하인',
  z: 70,
  focus: ZL_FOCUS,
  draw(ctx) {
    grid(ctx, STANDING, 206, 112, pal({ R: '#5a5a4a', r: '#44443a', K: '#2a2a24' }), true, 2)
    px(ctx, 204, 138, 12, 2, '#8a6a42')
    px(ctx, 207, 135, 4, 3, '#dcd2bb')
  },
}

const ZL_SKY = { x: 64, y: 0, w: 192, h: 108 }

const zlMoon: Sprite = {
  id: 'zl_moon',
  name: '찾아와 비추는 밝은 달',
  z: 8,
  fx: { lookUp: 1 },
  focus: ZL_SKY,
  draw(ctx, env) {
    moon(ctx, 196, 30, 9)
    withAlpha(ctx, 0.12 + 0.03 * Math.sin(env.t), () =>
      fillRows(ctx, 40, 168, (y) => {
        const f = (y - 40) / 128
        return [190 - f * 50, 202 - f * 10]
      }, '#fff7d6'),
    )
  },
}
const zlFriendLamp: Sprite = {
  id: 'zl_friend_lamp',
  name: '등불 든 벗',
  z: 72,
  focus: ZL_WIDE,
  draw(ctx, env) {
    const x = 250 - mod(env.t * 4, 30)
    grid(ctx, STANDING, x, 116, pal({ R: '#6b5a7a', r: '#4d405a' }), true, 2)
    const fl = Math.sin(env.t * 6) > 0
    px(ctx, x - 4, 134, 5, 6, fl ? '#ffd27a' : '#ffbf5a')
    withAlpha(ctx, 0.2, () => disc(ctx, x - 2, 137, 14, '#ffd27a'))
  },
}
const zlFireflies: Sprite = {
  id: 'zl_fireflies',
  name: '반딧불이 떼',
  z: 72,
  focus: ZL_WIDE,
  draw(ctx, env) {
    for (let i = 0; i < 24; i++) {
      const x = 60 + hash(i * 3) * 200 + Math.sin(env.t * 0.7 + i) * 10
      const y = 70 + hash(i * 5) * 90 + Math.cos(env.t * 0.9 + i) * 6
      if (Math.sin(env.t * 2 + i * 1.3) > -0.2) sparkle(ctx, x, y, '#d8ff8a', i % 4 === 0)
    }
  },
}

export const ZHULIGUAN_SPRITES: Sprite[] = [
  zlAlone, zlGroup, zlWalking,
  zlQin, zlGo, zlRead,
  zlUnknown, zlCrowd, zlServant,
  zlMoon, zlFriendLamp, zlFireflies,
]

