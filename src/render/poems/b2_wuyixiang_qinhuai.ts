// 劉禹錫〈烏衣巷〉, 杜牧〈泊秦淮〉
import type { Background, Sprite } from '../types'
import { H, W, disc, dot, fillRows, grid, hash, mod, px } from '../pixel'
import type { Ctx, Env } from '../pixel'
import { boat, flower, grassBlade, mistBands, moon, person, rain, sky, sparkle, veil, withAlpha } from '../kit'

// ════════════════════════ 烏衣巷 ════════════════════════
const WY_GROUND = 128
const WY_BRIDGE = { x: 10, y: 128 }
const WY_GATE = { x: 150, y: 96 }
const WY_HOUSES = [
  { x: 210, y: 102 },
  { x: 250, y: 108 },
  { x: 288, y: 100 },
]

function humbleHouse(ctx: Ctx, x: number, y: number) {
  for (let r = 0; r < 5; r++) px(ctx, x + 2 - r, y + r, 24 + r * 2, 1, r < 2 ? '#6a6458' : '#5a544a')
  px(ctx, x, y + 5, 24, 12, '#cfc4a8')
  px(ctx, x + 9, y + 9, 5, 8, '#5f4630')
  px(ctx, x + 2, y + 8, 4, 3, '#8a7a5a')
}

export const wuyixiangBackground: Background = {
  id: 'wuyixiang',
  drawBack(ctx) {
    sky(ctx, ['#a8bccb', '#b8c6cf', '#c8cfd0', '#d6d4cc'], 100)
    px(ctx, 0, 92, W, WY_GROUND - 92, '#b8b0a0')
    for (let y = WY_GROUND; y < H; y++) px(ctx, 0, y, W, 1, y < 140 ? '#a89e88' : '#9a907a')
    // 수로
    fillRows(ctx, 140, 180, () => [0, 120], (y) => (y < 150 ? '#7a9aa8' : '#6a8a98'))
  },
  drawFront(ctx) {
    // 주작교 (돌다리)
    const { x, y } = WY_BRIDGE
    for (let k = 0; k < 100; k++) {
      const top = y + Math.round(Math.pow((k - 50) / 50, 2) * 10) - 4
      px(ctx, x + k, top, 1, 4, '#9a8f7c')
      dot(ctx, x + k, top, '#b8ad98')
    }
    for (let k = 0; k < 100; k += 6) px(ctx, x + k, y + Math.round(Math.pow((k - 50) / 50, 2) * 10) - 8, 1, 4, '#7a705e')
    // 오의항 어귀 (골목 입구 기둥)
    const g = WY_GATE
    px(ctx, g.x, g.y, 4, 32, '#5a4a3a')
    px(ctx, g.x + 26, g.y, 4, 32, '#5a4a3a')
    px(ctx, g.x - 4, g.y - 4, 38, 4, '#3c3a36')
    px(ctx, g.x + 4, g.y + 6, 22, 26, '#8a8070')
    WY_HOUSES.forEach((h) => humbleHouse(ctx, h.x, h.y))
  },
  drawDynamic() {},
}

const WY_BRIDGE_FOCUS = { x: 0, y: 96, w: 144, h: 81 }

const wyWildflowers: Sprite = {
  id: 'wy_wildflowers',
  name: '다리 곁 들꽃',
  z: 30,
  focus: WY_BRIDGE_FOCUS,
  draw(ctx, env) {
    for (let i = 0; i < 40; i++) {
      const x = 4 + hash(i * 3.1) * 140
      const y = 130 + hash(i * 2.3) * 10
      grassBlade(ctx, x, y, 3 + hash(i) * 4, Math.sin(env.t + i) * 0.6, '#6a8a4a')
      if (i % 3 === 0) flower(ctx, x, y - 4, i % 2 ? '#e8d050' : '#c890d0', '#fff6c8')
    }
  },
}
const wyPots: Sprite = {
  id: 'wy_pots',
  name: '잘 가꾼 화분',
  z: 30,
  focus: WY_BRIDGE_FOCUS,
  draw(ctx) {
    for (let k = 0; k < 6; k++) {
      const x = 14 + k * 20
      px(ctx, x, 132, 6, 5, '#a8603a')
      disc(ctx, x + 3, 129, 3, '#4f7a3a')
      flower(ctx, x + 3, 128, '#e04a5a', '#fff2a0')
    }
  },
}
const wyCarriages: Sprite = {
  id: 'wy_carriages',
  name: '수레 행렬',
  z: 30,
  focus: WY_BRIDGE_FOCUS,
  draw(ctx, env) {
    for (let k = 0; k < 2; k++) {
      const x = mod(env.t * 8 + k * 60, 160) - 20
      const y = 116 + Math.round(Math.pow((x + 10 - 60) / 50, 2) * 10)
      px(ctx, x, y, 8, 5, '#e8e2d0')
      px(ctx, x + 10, y - 2, 12, 8, '#a8352a')
      px(ctx, x + 9, y - 4, 14, 2, '#d9a441')
      disc(ctx, x + 16, y + 7, 2, '#3a2a1c')
    }
  },
}

const WY_LANE_FOCUS = { x: 96, y: 40, w: 192, h: 108 }

const wySunset: Sprite = {
  id: 'wy_sunset',
  name: '비스듬한 저녁 햇살',
  z: 70,
  focus: WY_LANE_FOCUS,
  draw(ctx, env) {
    veil(ctx, 0.18, '#ff9a4a')
    for (let k = 0; k < 4; k++) {
      withAlpha(ctx, 0.14 + 0.03 * Math.sin(env.t + k), () =>
        fillRows(ctx, 20, 150, (y) => {
          const f = (y - 20) / 130
          const c = 330 - k * 30 - f * 160
          return [c - 4, c + 4 + f * 6]
        }, '#ffd28a'),
      )
    }
    // 길게 늘어진 그림자
    withAlpha(ctx, 0.25, () => {
      px(ctx, WY_GATE.x - 30, WY_GATE.y + 32, 30, 2, '#3a2a1c')
      WY_HOUSES.forEach((h) => px(ctx, h.x - 22, h.y + 17, 22, 2, '#3a2a1c'))
    })
  },
}
const wyNoonMarket: Sprite = {
  id: 'wy_noon_market',
  name: '한낮의 장터',
  z: 70,
  focus: WY_LANE_FOCUS,
  draw(ctx, env) {
    veil(ctx, 0.12, '#fff6d8')
    for (let k = 0; k < 3; k++) {
      px(ctx, 120 + k * 50, 124, 18, 2, '#c43a3a')
      px(ctx, 122 + k * 50, 126, 14, 4, '#c9a76a')
    }
    for (let i = 0; i < 8; i++) person(ctx, 110 + mod(i * 22 + env.t * 6, 190), 128, ['#7a4a3a', '#4f6b4a', '#6b5a7a', '#8a7a55'][i % 4])
  },
}
const wyLanterns: Sprite = {
  id: 'wy_lanterns',
  name: '달빛과 등불',
  z: 70,
  focus: WY_LANE_FOCUS,
  draw(ctx, env) {
    veil(ctx, 0.55, '#141a30')
    moon(ctx, 240, 24, 6)
    ;[WY_GATE.x + 2, WY_GATE.x + 26, 230, 266].forEach((x, i) => {
      const fl = Math.sin(env.t * 5 + i) > 0
      px(ctx, x, 100, 4, 5, fl ? '#ff7a4a' : '#e8603a')
      withAlpha(ctx, 0.25, () => disc(ctx, x + 2, 102, 6, '#ffb070'))
    })
  },
}

const WY_HALL_FOCUS = { x: 96, y: 40, w: 160, h: 90 }

function grandHall(ctx: Ctx) {
  const x = 120
  const y = 56
  px(ctx, x - 10, y, 84, 6, '#2a2a30')
  px(ctx, x - 4, y - 4, 72, 4, '#34343c')
  px(ctx, x, y + 6, 64, 30, '#e8dcc0')
  for (let k = 0; k <= 64; k += 10) px(ctx, x + k, y + 6, 3, 30, '#a8352a')
  px(ctx, x - 6, y + 36, 76, 4, '#b8ad98')
}

const wyOldHall: Sprite = {
  id: 'wy_old_hall',
  name: '옛 명문가의 제비',
  z: 20,
  focus: WY_HALL_FOCUS,
  draw(ctx, env) {
    // 기억 속에 아른거리는 옛 대저택
    withAlpha(ctx, 0.35 + 0.1 * Math.sin(env.t * 0.8), () => grandHall(ctx))
    for (let i = 0; i < 3; i++) {
      const a = env.t * 1.4 + i * 2
      const x = 150 + Math.cos(a) * 30
      const y = 52 + Math.sin(a * 2) * 6
      grid(ctx, ['K...K', '.KKK.', '..K..'], x, y, { K: '#1a1a24' })
    }
  },
}
const wyCage: Sprite = {
  id: 'wy_cage',
  name: '새장 속 앵무',
  z: 60,
  focus: WY_HALL_FOCUS,
  draw(ctx, env) {
    const x = 186
    const y = 70
    for (let k = 0; k < 7; k++) px(ctx, x + k * 2, y, 1, 14, '#c9a24a')
    px(ctx, x - 1, y - 2, 15, 2, '#c9a24a')
    px(ctx, x - 1, y + 14, 15, 2, '#c9a24a')
    grid(ctx, ['.GG', 'GGR', 'GG.', '.Y.'], x + 5, y + 5 + (Math.sin(env.t * 3) > 0 ? 0 : 1), { G: '#3aa04a', R: '#e04a3a', Y: '#e0a040' })
  },
}
const wyPalace: Sprite = {
  id: 'wy_palace',
  name: '궁궐 연못',
  z: 20,
  focus: WY_HALL_FOCUS,
  draw(ctx, env) {
    px(ctx, 110, 54, 100, 6, '#d9a441')
    px(ctx, 116, 60, 88, 22, '#b8483a')
    for (let dy = -4; dy <= 4; dy++) px(ctx, 130 - 30 * Math.sqrt(1 - (dy * dy) / 20), 92 + dy, 60 * Math.sqrt(1 - (dy * dy) / 20), 1, '#6a9ab8')
    if (Math.sin(env.t * 4) > 0.5) sparkle(ctx, 150, 90, '#ffffff', true)
  },
}

const WY_FLY_FOCUS = { x: 96, y: 30, w: 224, h: 112 }

function swallowAt(ctx: Ctx, x: number, y: number, env: Env, i: number) {
  const f = Math.floor(env.t * 8 + i) % 2
  grid(ctx, f ? ['K...K', '.KKK.', '..K..'] : ['.....', 'KKKKK', '.K.K.'], x, y, { K: '#1a1a24' })
}

const wyCommoners: Sprite = {
  id: 'wy_commoners',
  name: '백성의 집으로 드는 제비',
  z: 75,
  focus: WY_FLY_FOCUS,
  draw(ctx, env) {
    WY_HOUSES.forEach((h, i) => {
      const f = mod(env.t / 5 + i * 0.33, 1)
      const sx = 150
      const sy = 50
      const x = sx + (h.x + 12 - sx) * f
      const y = sy + (h.y + 2 - sy) * f - Math.sin(f * Math.PI) * 14
      if (f < 0.95) swallowAt(ctx, x, y, env, i)
      // 처마 밑 둥지
      px(ctx, h.x + 18, h.y + 5, 4, 2, '#7a5a3c')
    })
  },
}
const wyMansion: Sprite = {
  id: 'wy_mansion',
  name: '큰 저택으로 드는 제비',
  z: 75,
  focus: WY_FLY_FOCUS,
  draw(ctx, env) {
    px(ctx, 230, 60, 80, 6, '#d9a441')
    px(ctx, 236, 66, 68, 30, '#b8483a')
    for (let i = 0; i < 3; i++) {
      const f = mod(env.t / 5 + i * 0.33, 1)
      swallowAt(ctx, 150 + 110 * f, 50 + 14 * f - Math.sin(f * Math.PI) * 14, env, i)
    }
  },
}
const wySea: Sprite = {
  id: 'wy_sea',
  name: '남쪽 바다로 떠나는 제비',
  z: 75,
  focus: WY_FLY_FOCUS,
  draw(ctx, env) {
    for (let i = 0; i < 4; i++) {
      const f = mod(env.t / 7 + i * 0.12, 1)
      swallowAt(ctx, 150 + 200 * f, 50 - 30 * f + i * 4, env, i)
    }
  },
}

export const WUYIXIANG_SPRITES: Sprite[] = [
  wyWildflowers, wyPots, wyCarriages,
  wySunset, wyNoonMarket, wyLanterns,
  wyOldHall, wyCage, wyPalace,
  wyCommoners, wyMansion, wySea,
]

// ════════════════════════ 泊秦淮 ════════════════════════
const QH_FAR = 92 // 건너편 기슭
const QH_NEAR = 150 // 이쪽 기슭
const QH_BOAT = { x: 92, y: 146 }
const QH_SINGER = { x: 210, y: 76 }

export const qinhuaiBackground: Background = {
  id: 'qinhuai',
  drawBack(ctx) {
    sky(ctx, ['#0e1226', '#131830', '#191f3a', '#1f2644'], QH_FAR)
    // 건너편 기슭의 집들
    for (let i = 0; i < 12; i++) {
      const x = i * 28 + hash(i) * 6
      const h = 10 + hash(i * 3) * 10
      px(ctx, x, QH_FAR - h, 24, h, '#151a2a')
      px(ctx, x - 2, QH_FAR - h - 2, 28, 2, '#1c2236')
    }
    for (let y = QH_FAR; y < H; y++) px(ctx, 0, y, W, 1, y < 110 ? '#1e2840' : '#1a233a')
    for (let i = 0; i < 26; i++) px(ctx, hash(i * 3) * W, QH_FAR + 4 + hash(i * 5) * 60, 8, 1, '#24304c')
  },
  drawFront(ctx) {
    // 이쪽 기슭과 모래톱
    fillRows(ctx, QH_NEAR, H, () => [0, W], '#2a2a2c')
    for (let dy = -3; dy <= 3; dy++) px(ctx, 180 - 50 * Math.sqrt(1 - (dy * dy) / 12), QH_NEAR - 4 + dy, 100 * Math.sqrt(1 - (dy * dy) / 12), 1, '#5a5a56')
  },
  drawDynamic() {},
}

const QH_WATER_FOCUS = { x: 0, y: 0, w: 320, h: 180 }

const qhMistMoon: Sprite = {
  id: 'qh_mist_moon',
  name: '물을 감싼 안개와 모래를 감싼 달빛',
  z: 8,
  focus: QH_WATER_FOCUS,
  draw(ctx, env) {
    moon(ctx, 270, 28, 7)
    mistBands(ctx, env.t, [100, 110, 120, 132], '#c8d0e0', 0.35)
    // 달빛에 젖은 모래톱
    withAlpha(ctx, 0.45, () => {
      for (let dy = -3; dy <= 3; dy++) px(ctx, 180 - 50 * Math.sqrt(1 - (dy * dy) / 12), QH_NEAR - 4 + dy, 100 * Math.sqrt(1 - (dy * dy) / 12), 1, '#e8e4cc')
    })
  },
}
const qhSunny: Sprite = {
  id: 'qh_sunny',
  name: '햇살 아래 반짝이는 물',
  z: 8,
  focus: QH_WATER_FOCUS,
  draw(ctx, env) {
    veil(ctx, 0.6, '#a8c8e0')
    for (let i = 0; i < 30; i++) if (Math.sin(env.t * 3 + i) > 0.5) sparkle(ctx, hash(i * 3) * W, QH_FAR + 6 + hash(i * 5) * 50, '#ffffff', true)
  },
}
const qhFlood: Sprite = {
  id: 'qh_flood',
  name: '폭우에 불어난 강',
  z: 8,
  focus: QH_WATER_FOCUS,
  draw(ctx, env) {
    for (let i = 0; i < 40; i++) {
      const x = mod(hash(i) * W + env.t * 30, W)
      px(ctx, x, QH_FAR + 4 + hash(i * 3) * 56, 6, 1, '#4a5a7a')
    }
    rain(ctx, env.t, 120, 200, 'rgba(180,195,220,0.5)', 5, -1)
  },
}

const QH_NEAR_FOCUS = { x: 24, y: 96, w: 144, h: 81 }

const qhTavern: Sprite = {
  id: 'qh_tavern',
  name: '술집 가까이 댄 배',
  z: 40,
  focus: QH_NEAR_FOCUS,
  draw(ctx, env) {
    // 기슭의 술집
    const x = 30
    const y = 128
    px(ctx, x - 4, y, 44, 4, '#2a2a30')
    px(ctx, x, y + 4, 36, 18, '#5a4030')
    for (let k = 0; k < 3; k++) {
      const fl = Math.sin(env.t * 5 + k) > 0
      px(ctx, x + 4 + k * 12, y + 8, 5, 6, fl ? '#ffcf6a' : '#f0b050')
      withAlpha(ctx, 0.2, () => disc(ctx, x + 6 + k * 12, y + 11, 7, '#ffd27a'))
    }
    // 주기(酒旗)
    px(ctx, x + 40, y - 18, 1, 22, '#4a3426')
    px(ctx, x + 41, y - 18 + (Math.sin(env.t * 2) > 0 ? 0 : 1), 7, 9, '#c8402a')
    boat(ctx, QH_BOAT.x, QH_BOAT.y, { len: 26, lantern: true, t: env.t })
  },
}
const qhReeds: Sprite = {
  id: 'qh_reeds',
  name: '쓸쓸한 갈대밭',
  z: 40,
  focus: QH_NEAR_FOCUS,
  draw(ctx, env) {
    boat(ctx, QH_BOAT.x, QH_BOAT.y, { len: 26, t: env.t })
    for (let i = 0; i < 30; i++) grassBlade(ctx, 30 + i * 4.2, 152, 10 + hash(i) * 8, Math.sin(env.t + i) * 1.2 - 1, '#6a6450')
  },
}
const qhOffice: Sprite = {
  id: 'qh_office',
  name: '관청 나루',
  z: 40,
  focus: QH_NEAR_FOCUS,
  draw(ctx, env) {
    px(ctx, 40, 138, 70, 3, '#6b4a32')
    for (let k = 0; k < 3; k++) {
      px(ctx, 46 + k * 26, 114, 1, 24, '#4a3426')
      px(ctx, 47 + k * 26, 114 + (Math.sin(env.t * 2 + k) > 0 ? 0 : 1), 8, 6, '#2a4a8a')
    }
    boat(ctx, QH_BOAT.x, QH_BOAT.y, { len: 26, t: env.t })
  },
}

const QH_FAR_FOCUS = { x: 150, y: 50, w: 128, h: 72 }

function pavilion(ctx: Ctx) {
  const { x, y } = QH_SINGER
  px(ctx, x - 16, y - 6, 40, 4, '#2a2a34')
  px(ctx, x - 12, y - 2, 32, 18, '#3a2a30')
  withAlpha(ctx, 0.14, () => disc(ctx, x + 4, y + 6, 12, '#ffb070'))
  px(ctx, x - 10, y, 28, 14, '#7a4a3a')
}
function singer(ctx: Ctx, robe: string) {
  const { x, y } = QH_SINGER
  px(ctx, x, y + 1, 3, 1, '#1f1d22')
  dot(ctx, x + 1, y, '#1f1d22')
  px(ctx, x, y + 2, 3, 2, '#e6c39b')
  px(ctx, x - 1, y + 4, 5, 7, robe)
}

const qhSinger: Sprite = {
  id: 'qh_singer',
  name: '노래하는 여인',
  z: 50,
  focus: QH_FAR_FOCUS,
  draw(ctx, env) {
    pavilion(ctx)
    singer(ctx, '#d86a8a')
    // 비파
    px(ctx, QH_SINGER.x + 3, QH_SINGER.y + 6, 4, 4, '#b07a3a')
    px(ctx, QH_SINGER.x + 6, QH_SINGER.y + 3, 1, 4, '#8a5a2a')
    for (let i = 0; i < 2; i++) {
      const f = mod(env.t * 0.7 + i / 2, 1)
      grid(ctx, ['.KK', '.K.', 'KK.'], QH_SINGER.x + 8 + f * 8, QH_SINGER.y - 4 - f * 8, { K: '#ffd8e0' })
    }
  },
}
const qhWeeping: Sprite = {
  id: 'qh_weeping',
  name: '눈물 흘리는 여인',
  z: 50,
  focus: QH_FAR_FOCUS,
  draw(ctx, env) {
    pavilion(ctx)
    singer(ctx, '#8a8aa0')
    const f = mod(env.t, 1)
    dot(ctx, QH_SINGER.x + 2, QH_SINGER.y + 4 + f * 6, '#8fc3e6')
  },
}
const qhFleeing: Sprite = {
  id: 'qh_fleeing',
  name: '피란하는 사람들',
  z: 50,
  focus: QH_FAR_FOCUS,
  draw(ctx, env) {
    for (let i = 0; i < 5; i++) {
      const x = 160 + mod(i * 22 + env.t * 7, 120)
      person(ctx, x, 82, '#5a5048', { step: Math.floor(env.t * 4 + i) % 2 })
      px(ctx, x + 2, 84, 3, 3, '#8c5a33')
    }
  },
}

const QH_RIVER_FOCUS = { x: 64, y: 50, w: 224, h: 126 }

const qhSongAcross: Sprite = {
  id: 'qh_song_across',
  name: '강 건너의 노랫소리',
  z: 60,
  focus: QH_RIVER_FOCUS,
  draw(ctx, env) {
    for (let i = 0; i < 5; i++) {
      const f = mod(env.t / 6 + i / 5, 1)
      const x = QH_SINGER.x + (QH_BOAT.x - QH_SINGER.x) * f
      const y = QH_SINGER.y + 4 + (QH_BOAT.y - 14 - QH_SINGER.y) * f + Math.sin(f * 10 + i) * 4
      withAlpha(ctx, f > 0.85 ? (1 - f) / 0.15 : 1, () => grid(ctx, ['.KK', '.K.', 'KK.'], x, y, { K: '#ffd8e0' }))
    }
  },
}
const qhSilent: Sprite = {
  id: 'qh_silent',
  name: '노래 그친 고요',
  z: 60,
  focus: QH_RIVER_FOCUS,
  draw(ctx) {
    veil(ctx, 0.4, '#05070f', 0, 0, W, QH_NEAR)
  },
}
const qhDrums: Sprite = {
  id: 'qh_drums',
  name: '군대의 북소리',
  z: 60,
  focus: QH_RIVER_FOCUS,
  draw(ctx, env) {
    const x = 250
    const y = 74
    grid(ctx, ['.WWWW.', 'RRRRRR', 'RRRRRR', '.RRRR.'], x, y, { W: '#e8dcc0', R: '#a8352a' })
    for (let r = 0; r < 3; r++) {
      const rr = mod(env.t * 10 + r * 6, 18)
      withAlpha(ctx, 1 - rr / 18, () => {
        for (let a = 0; a < Math.PI * 2; a += 0.35) dot(ctx, x + 3 + Math.cos(a) * rr, y + 2 + Math.sin(a) * rr * 0.6, '#f0b8a8')
      })
    }
    for (let k = 0; k < 3; k++) {
      px(ctx, 220 + k * 12, 62, 1, 16, '#3a2a1c')
      px(ctx, 221 + k * 12, 62, 6, 4, '#c43a3a')
    }
  },
}

export const QINHUAI_SPRITES: Sprite[] = [
  qhMistMoon, qhSunny, qhFlood,
  qhTavern, qhReeds, qhOffice,
  qhSinger, qhWeeping, qhFleeing,
  qhSongAcross, qhSilent, qhDrums,
]
