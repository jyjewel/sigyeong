// 『唐詩畫意』 卷九 첫 묶음 (1): 暢當〈宿潭上〉〈登鸛雀樓〉, 司空曙〈藥園〉〈石井〉〈雜言〉
import type { Background } from '../types'
import { H, W, disc, dot, fillRows, hash, mod, px } from '../pixel'
import type { Ctx } from '../pixel'
import { GREEN, bird, boat, broadTree, flower, house, mistBands, moon, person, rain, ridge, sky, snowfall, stars, withAlpha } from '../kit'
import { OTHER_PALS, pal, seatFig, standFig } from '../figures'
import { drift, mix, shimmer, soundArcs, sp, stone, sun, water } from './hy_kit'
import { lady } from './hy_b4a'

const FULL = { x: 0, y: 0, w: 320, h: 180 }
const HERMIT = pal({ R: '#8a8a72', r: '#6a6a56', K: '#5a5a4a' })

// ════════════════════════════════════════════════════════════
// 暢當〈宿潭上〉: 달밤의 못과 놀잇배
// ════════════════════════════════════════════════════════════
const TC_WATER = 104
const TC_BOAT = { x: 150, y: 144 }
const TC_MOON = { x: 64, y: 32 }
const TC_YOU = { x: 266, y: 104 }

export const sutanBackground: Background = {
  id: 'hy064',
  drawBack(ctx) {
    sky(ctx, ['#141a2e', '#1c2440', '#28324e'], TC_WATER)
    stars(ctx, 20, 51, 4, 70, 0, '#a8acc4')
    ridge(ctx, (x) => 86 + 8 * Math.sin(x * 0.02 + 0.6), '#161c26', '#1e2430', 0, W, TC_WATER)
    water(ctx, TC_WATER, H, '#24324c', '#1a2640', '#36466a')
    // 오른쪽 기슭
    fillRows(ctx, 120, H, (y) => [244 - (y - 120) * 0.4, W], '#1a2018')
    for (let k = 0; k < 4; k++) broadTree(ctx, 262 + k * 16, 122, 1.1, { dark: '#121a14', base: '#18221a', light: '#202c22' })
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    shimmer(ctx, env.t, TC_WATER + 3, 178, 14, '#46587e', 0, 240)
  },
}

const TC_BOAT_F = { x: 96, y: 108, w: 112, h: 63 }
const TC_SKY = { x: 16, y: 8, w: 192, h: 162 }
const TC_SHORE = { x: 208, y: 76, w: 112, h: 63 }

export const SUTAN_SPRITES = [
  sp('tc_boat', '밤 못의 고운 배', 20, TC_BOAT_F, (ctx, env) => {
    const b = Math.sin(env.t * 0.8) * 1
    boat(ctx, TC_BOAT.x, TC_BOAT.y + b, { len: 40, hull: '#7a3a2a' })
    px(ctx, TC_BOAT.x - 12, TC_BOAT.y - 18 + b, 24, 2, '#c8402a')
    for (const dx of [-11, 10]) px(ctx, TC_BOAT.x + dx, TC_BOAT.y - 16 + b, 1, 9, '#c89a3a')
    px(ctx, TC_BOAT.x + 16, TC_BOAT.y - 12 + b, 3, 4, Math.sin(env.t * 5) > -0.5 ? '#ffcf6a' : '#f0a845')
    withAlpha(ctx, 0.2, () => disc(ctx, TC_BOAT.x + 17, TC_BOAT.y - 10 + b, 6, '#ffd27a'))
  }),
  sp('tc_net', '쳐 놓은 고기 그물', 20, TC_BOAT_F, (ctx) => {
    for (let x = 120; x < 180; x += 10) px(ctx, x, 126, 1, 22, '#4a3a2a')
    for (let x = 120; x < 180; x += 3) for (let y = 128; y < 146; y += 3) dot(ctx, x, y, '#6a6a5a')
  }),
  sp('tc_bridge', '돌다리', 20, TC_BOAT_F, (ctx) => {
    for (let a = 0; a <= Math.PI; a += 0.02) px(ctx, 150 - Math.cos(a) * 40, 140 - Math.sin(a) * 12, 3, 3, '#5a5a62')
  }),

  sp('tc_moon', '물에 비친 달', 12, TC_SKY, (ctx, env) => {
    moon(ctx, TC_MOON.x, TC_MOON.y, 9)
    const rx = TC_BOAT.x - 32
    withAlpha(ctx, 0.85, () => {
      for (let k = -4; k <= 4; k++) {
        const w = 14 - Math.abs(k) * 3 + Math.sin(env.t * 2 + k) * 1.5
        px(ctx, rx - w / 2, TC_BOAT.y + 2 + k * 1.2, w, 1, '#f4ecc8')
      }
    })
    withAlpha(ctx, 0.15, () => px(ctx, 0, 0, W, H, '#8a9ac8'))
  }),
  sp('tc_sun', '떠오르는 해', 12, TC_SKY, (ctx) => {
    sky(ctx, ['#4a4a6a', '#8a6a6a', '#d8906a'], TC_WATER)
    sun(ctx, TC_MOON.x, 80, 8, '#f0a050')
  }),
  sp('tc_lanterns', '줄지은 등불', 12, TC_SKY, (ctx, env) => {
    for (let k = 0; k < 8; k++) {
      const x = 40 + k * 22
      px(ctx, x, 110, 3, 4, Math.sin(env.t * 3 + k) > -0.5 ? '#e04a3a' : '#c03a2a')
      withAlpha(ctx, 0.4, () => px(ctx, x, 118 + (k % 2) * 4, 3, 6, '#e04a3a'))
    }
  }),

  sp('tc_guest', '밝은 달을 즐기는 손님', 24, TC_BOAT_F, (ctx, env) => {
    const b = Math.sin(env.t * 0.8) * 1
    seatFig(ctx, TC_BOAT.x - 6, TC_BOAT.y - 20 + b, pal({ R: '#6a5a7a', r: '#4d405a' }), true)
    for (let i = 0; i < 5; i++) dot(ctx, TC_BOAT.x - 8 - i, TC_BOAT.y - 12 + b - i, '#6a5a7a')
    dot(ctx, TC_BOAT.x - 13, TC_BOAT.y - 17 + b, '#e6c39b')
  }),
  sp('tc_drink', '술 마시기 내기', 24, TC_BOAT_F, (ctx) => {
    seatFig(ctx, TC_BOAT.x - 14, TC_BOAT.y - 20, pal(OTHER_PALS[0]))
    seatFig(ctx, TC_BOAT.x + 2, TC_BOAT.y - 20, pal(OTHER_PALS[1]), true)
    px(ctx, TC_BOAT.x - 1, TC_BOAT.y - 6, 4, 3, '#8a6a4a')
  }),
  sp('tc_flower', '꽃 꺾는 손님', 24, TC_BOAT_F, (ctx) => {
    seatFig(ctx, TC_BOAT.x - 6, TC_BOAT.y - 20, pal({ R: '#6a5a7a', r: '#4d405a' }), true)
    flower(ctx, TC_BOAT.x - 12, TC_BOAT.y - 10, '#e88aa0', '#f4d060')
  }),

  sp('tc_wind', '가을바람에 놀라는 나그네', 26, TC_SHORE, (ctx, env) => {
    standFig(ctx, TC_YOU.x, TC_YOU.y, pal(), true)
    for (let r = 14; r < 20; r++) px(ctx, TC_YOU.x + 13 + Math.round(Math.sin(env.t * 8 + r) * 1.5), TC_YOU.y + r, 2, 1, '#353a4f')
    for (let i = 0; i < 12; i++) {
      const f = mod(hash(i * 2.1) + env.t * 0.12, 1)
      px(ctx, 320 - f * 120, 90 + hash(i * 3.3) * 40 + Math.sin(env.t * 3 + i) * 3, 2, 1, ['#a8662a', '#c88a3a'][i % 2])
    }
    for (let k = 0; k < 4; k++) withAlpha(ctx, 0.4, () => px(ctx, mod(hash(k) * 200 - env.t * 60, 140) + 200, 92 + k * 8, 14, 1, '#8a9ab8'))
  }, { wind: 0.8 }),
  sp('tc_thunder', '천둥소리', 26, TC_SHORE, (ctx, env) => {
    standFig(ctx, TC_YOU.x, TC_YOU.y, pal(), true)
    if (Math.sin(env.t * 2) > 0.85) {
      for (let i = 0; i < 20; i++) dot(ctx, 240 + (i % 3) * 2 - Math.floor(i / 3), 70 + i * 2, '#f4f0c8')
      withAlpha(ctx, 0.2, () => px(ctx, 0, 0, W, H, '#c8d0f0'))
    }
  }),
  sp('tc_dog', '개 짖는 소리', 26, TC_SHORE, (ctx, env) => {
    standFig(ctx, TC_YOU.x, TC_YOU.y, pal(), true)
    px(ctx, 240, 120, 9, 5, '#4a4036')
    px(ctx, 237, 117, 4, 4, '#4a4036')
    if (Math.sin(env.t * 7) > 0) soundArcs(ctx, 236, 118, env.t, '#c8c4b0', 10)
  }),
]

// ════════════════════════════════════════════════════════════
// 暢當〈登鸛雀樓〉: 새 위로 솟은 누각과 끊어진 산
// ════════════════════════════════════════════════════════════
const DQ_PLAIN = 118
const DQ_TOWER = { x: 72, top: 30 }
const DQ_GAP = { a: 246, b: 262 }
const dqMountain = (x: number) => (x > DQ_GAP.a && x < DQ_GAP.b ? 200 : 96 - 14 * Math.exp(-(((x - 230) / 30) ** 2)) - 16 * Math.exp(-(((x - 285) / 26) ** 2)) + 3 * Math.sin(x * 0.1))
const dqRiver = (t: number) => ({ x: 120 + t * 134 + Math.sin(t * 5) * 14, y: 178 - t * 62 })

export const dqBackground: Background = {
  id: 'hy065',
  drawBack(ctx) {
    sky(ctx, ['#a8c0d4', '#bccede', '#d0dce2', '#dee4e0'], DQ_PLAIN)
    ridge(ctx, dqMountain, '#8a9a94', '#96a69e', 170, W, DQ_PLAIN)
    for (let y = DQ_PLAIN; y < H; y++) px(ctx, 0, y, W, 1, mix('#b8b484', '#9aa070', (y - DQ_PLAIN) / 62))
    // 누각이 선 언덕과 누각
    fillRows(ctx, 120, H, (y) => [0, 40 + (y - 120) * 1.6], '#7a7058')
    const { x, top } = DQ_TOWER
    for (let k = 0; k < 4; k++) {
      const y = top + k * 22
      const w = 30 + k * 6
      px(ctx, x - w / 2, y + 6, w, 16, k % 2 ? '#a8382a' : '#b8402e')
      for (let c = -w / 2 + 3; c < w / 2; c += 7) px(ctx, x + c, y + 8, 2, 12, '#e0b84a')
      px(ctx, x - w / 2 - 5, y + 2, w + 10, 4, '#3c4048')
      px(ctx, x - w / 2 - 2, y, w + 4, 2, '#4a4f57')
      dot(ctx, x - w / 2 - 6, y + 1, '#3c4048')
      dot(ctx, x + w / 2 + 5, y + 1, '#3c4048')
    }
    px(ctx, x - 28, top + 94, 56, 26, '#8a8274')
  },
  drawFront() {},
  drawDynamic() {},
}

const DQ_BIRDS = { x: 64, y: 48, w: 144, h: 81 }
const DQ_LOW = { x: 96, y: 92, w: 144, h: 81 }
const DQ_RIVER_F = { x: 112, y: 72, w: 192, h: 108 }

export const DQ_SPRITES = [
  sp('dq_birds', '누각 아래로 나는 새', 22, DQ_BIRDS, (ctx, env) => {
    for (let k = 0; k < 6; k++) {
      const x = 100 + mod(k * 30 + env.t * (8 + k), 110)
      bird(ctx, x, 78 + (k % 3) * 9 + Math.sin(env.t + k) * 3, Math.floor(env.t * 4 + k) % 2, '#3a3a44')
    }
  }),
  sp('dq_roofs', '낮게 깔린 지붕', 22, DQ_BIRDS, (ctx) => {
    for (let k = 0; k < 4; k++) house(ctx, 110 + k * 28, 108 + (k % 2) * 4)
  }),
  sp('dq_willow', '강가의 버들', 22, DQ_BIRDS, (ctx, env) => {
    for (const bx of [120, 170]) {
      px(ctx, bx, 96, 2, 24, '#5a4632')
      for (let k = 0; k < 10; k++) for (let i = 0; i < 18; i++) dot(ctx, bx - 12 + k * 3 + Math.sin(env.t + i * 0.2), 94 + i, '#8aa860')
    }
  }),

  sp('dq_dust', '누각 아래 뿌연 세상의 먼지', 12, DQ_LOW, (ctx, env) => {
    for (let k = 0; k < 10; k++) {
      const x = 110 + k * 18
      px(ctx, x, 124 + (k % 3) * 4, 12, 4, '#8a8274')
      px(ctx, x - 1, 122 + (k % 3) * 4, 14, 2, '#5a5e66')
    }
    withAlpha(ctx, 0.45, () => {
      for (let y = 106; y < 150; y += 2) px(ctx, 0, y, W, 2, y < 120 ? '#d8c8a8' : '#c8b898')
    })
    mistBands(ctx, env.t * 0.5, [112, 120], '#e8dcc0', 0.4)
  }),
  sp('dq_lake', '맑은 호수', 12, DQ_LOW, (ctx) => fillRows(ctx, 124, 150, (y) => [120 + Math.abs(y - 137) * 2, 230 - Math.abs(y - 137) * 2], '#8ab4c4')),
  sp('dq_snow', '눈 덮인 들', 12, DQ_LOW, (ctx) => px(ctx, 60, DQ_PLAIN, W - 60, H - DQ_PLAIN, '#eef2f2')),

  sp('dq_plain', '하늘이 빙 둘러싼 평평한 들', 8, FULL, (ctx) => {
    for (let r = 0; r < 6; r++) for (let c = 0; c < 14; c++) px(ctx, 60 + c * 20 + (r % 2) * 10, DQ_PLAIN + 4 + r * 10, 16, 1, (r + c) % 2 ? '#a8a470' : '#c8c088')
    withAlpha(ctx, 0.3, () => px(ctx, 0, DQ_PLAIN - 8, W, 8, '#f4f0e0'))
  }),
  sp('dq_sea', '넓은 바다', 8, FULL, (ctx, env) => {
    px(ctx, 60, DQ_PLAIN, W - 60, H - DQ_PLAIN, '#5a8aa0')
    for (let k = 0; k < 16; k++) px(ctx, 60 + mod(hash(k) * 260 + env.t * 4, 260), DQ_PLAIN + 4 + hash(k * 3) * 56, 6, 1, '#a8c8d4')
  }),
  sp('dq_forest', '깊은 숲', 8, FULL, (ctx) => {
    for (let k = 0; k < 18; k++) broadTree(ctx, 70 + k * 14, DQ_PLAIN + 14 + (k % 3) * 6, 1.2, GREEN)
  }),

  sp('dq_gorge', '끊어진 산 사이로 흘러드는 강', 14, DQ_RIVER_F, (ctx, env) => {
    for (let t = 0; t <= 1; t += 0.004) {
      const p = dqRiver(t)
      const w = 10 - t * 7
      px(ctx, p.x - w / 2, p.y, w, 2, mix('#c8a868', '#a89060', t))
      if (Math.sin(t * 80 - env.t * 4) > 0.85) px(ctx, p.x - 1, p.y, 2, 1, '#e8d8a8')
    }
    fillRows(ctx, 96, DQ_PLAIN, () => [DQ_GAP.a, DQ_GAP.b], '#b8a070')
    for (let y = 96; y < DQ_PLAIN; y += 3) dot(ctx, DQ_GAP.a + 4 + Math.sin(y + env.t * 3) * 2, y, '#e8d8a8')
  }),
  sp('dq_ocean', '넓은 바다로 가는 강', 14, DQ_RIVER_F, (ctx) => {
    for (let t = 0; t <= 1; t += 0.004) {
      const p = { x: 120 + t * 200, y: 178 - t * 40 }
      px(ctx, p.x - 4, p.y, 8, 2, '#c8a868')
    }
    px(ctx, 270, 124, 50, 16, '#5a8aa0')
  }),
  sp('dq_desert', '모래 사막으로 가는 강', 14, DQ_RIVER_F, (ctx) => {
    px(ctx, 170, 124, 150, 56, '#d8b880')
    for (let t = 0; t <= 0.5; t += 0.004) {
      const p = dqRiver(t)
      px(ctx, p.x - 3, p.y, 6, 2, '#c8a868')
    }
  }),
]

// ════════════════════════════════════════════════════════════
// 司空曙〈藥園〉: 봄 약초밭
// ════════════════════════════════════════════════════════════
const YY_GROUND = 112
const YY_BEDS = [0, 1, 2, 3].map((k) => ({ y: 124 + k * 13, x0: 40 + k * 4, x1: 220 - k * 2 }))
const YY_HERMIT = { x: 54, y: 120 }

export const yaoyuanBackground: Background = {
  id: 'hy066',
  drawBack(ctx) {
    sky(ctx, ['#c4d8e0', '#d2e0e2', '#e0e8e0'], YY_GROUND)
    ridge(ctx, (x) => 74 + 16 * Math.sin(x * 0.014 + 2), '#94ae9c', '#a0baa8', 0, W, YY_GROUND)
    ridge(ctx, (x) => 96 + 6 * Math.sin(x * 0.03 + 1), '#7e9a76', '#8aa682', 0, W, YY_GROUND)
    px(ctx, 0, YY_GROUND, W, H - YY_GROUND, '#8aa462')
    for (const b of YY_BEDS) {
      px(ctx, b.x0, b.y, b.x1 - b.x0, 7, '#7a6a48')
      for (let x = b.x0 + 2; x < b.x1 - 2; x += 6) px(ctx, x, b.y - 2, 2, 3, '#5a8a3a')
    }
    // 울타리
    for (let x = 30; x < 240; x += 6) px(ctx, x, 114, 1, 8, '#8a6a48')
    px(ctx, 30, 116, 210, 1, '#8a6a48')
    // 덩굴 시렁
    for (const x of [246, 296]) px(ctx, x, 102, 2, 50, '#6a4a32')
    px(ctx, 244, 100, 56, 2, '#6a4a32')
  },
  drawFront() {},
  drawDynamic() {},
}

const YY_BEDS_F = { x: 32, y: 96, w: 192, h: 84 }
const YY_ARBOR = { x: 224, y: 84, w: 96, h: 72 }
const YY_GATE = { x: 8, y: 84, w: 128, h: 72 }

export const YAOYUAN_SPRITES = [
  sp('yy_bloom', '꽃이 두루 핀 봄 동산', 12, YY_BEDS_F, (ctx, env) => {
    YY_BEDS.forEach((b, k) => {
      for (let x = b.x0 + 4; x < b.x1 - 2; x += 6) flower(ctx, x + Math.round(Math.sin(env.t + x) * 0.5), b.y - 3, ['#f2b8c6', '#f4d060', '#f8f4e8', '#c8a0e0'][(x + k) % 4], '#d8a040')
    })
    drift(ctx, env.t, { x: 40, y: 100, w: 180, h: 70 }, 10, '#f2b8c6', 0.3, 7)
  }),
  sp('yy_snow', '눈 덮인 동산', 12, YY_BEDS_F, (ctx) => {
    for (const b of YY_BEDS) px(ctx, b.x0, b.y - 2, b.x1 - b.x0, 4, '#f4f6f6')
  }),
  sp('yy_leaves', '낙엽 쌓인 동산', 12, YY_BEDS_F, (ctx) => {
    for (let k = 0; k < 50; k++) px(ctx, 40 + hash(k * 2.1) * 180, 120 + hash(k * 3.3) * 54, 2, 1, ['#a8662a', '#c88a3a'][k % 2])
  }),

  sp('yy_vine', '푸른 덩굴의 붉은 꽃', 14, YY_ARBOR, (ctx, env) => {
    for (let k = 0; k < 8; k++) {
      const x = 250 + k * 6
      for (let i = 0; i < 30; i++) dot(ctx, x + Math.sin(i * 0.4 + k + env.t * 0.5) * 2, 102 + i, i % 3 ? '#4a8a3a' : '#6aa84a')
    }
    for (let k = 0; k < 14; k++) disc(ctx, 248 + hash(k * 3) * 50, 98 + hash(k * 5) * 36, 1, '#d8403a')
    for (let k = 0; k < 10; k++) px(ctx, 246 + k * 5, 98 + (k % 3), 4, 3, '#5a9a4a')
  }),
  sp('yy_grape', '포도송이', 14, YY_ARBOR, (ctx) => {
    for (let k = 0; k < 10; k++) px(ctx, 246 + k * 5, 98, 4, 4, '#5a8a3a')
    for (let k = 0; k < 4; k++) for (let i = 0; i < 4; i++) dot(ctx, 254 + k * 10 + (i % 2), 104 + i, '#5a3a6a')
  }),
  sp('yy_web', '거미줄', 14, YY_ARBOR, (ctx) => {
    for (let a = 0; a < 6.28; a += 0.5) for (let r = 0; r < 18; r++) dot(ctx, 272 + Math.cos(a) * r, 122 + Math.sin(a) * r, '#e8e8e8')
  }),

  sp('yy_hermit', '깊은 산에서 온 나그네', 24, YY_GATE, (ctx) => {
    standFig(ctx, YY_HERMIT.x, YY_HERMIT.y - 6, HERMIT)
    px(ctx, YY_HERMIT.x + 14, YY_HERMIT.y - 10, 1, 26, '#6a4a32')
    px(ctx, YY_HERMIT.x - 6, YY_HERMIT.y + 2, 7, 8, '#a8864a')
    for (let i = 0; i < 6; i++) dot(ctx, YY_HERMIT.x - 5 + i, YY_HERMIT.y + 1, '#5a8a3a')
  }),
  sp('yy_kids', '뛰노는 아이들', 24, YY_GATE, (ctx, env) => {
    for (let k = 0; k < 3; k++) person(ctx, 40 + k * 16, 128 - Math.abs(Math.sin(env.t * 4 + k)) * 4, OTHER_PALS[k].R)
  }),
  sp('yy_soldier', '창 든 병사', 24, YY_GATE, (ctx) => {
    standFig(ctx, YY_HERMIT.x, YY_HERMIT.y - 6, pal({ R: '#6a3a2a', r: '#4a2a1e' }))
    px(ctx, YY_HERMIT.x + 14, YY_HERMIT.y - 18, 1, 34, '#8a8478')
  }),

  sp('yy_name', '약초 이름을 가려내는 나그네', 26, YY_GATE, (ctx, env) => {
    const bx = YY_HERMIT.x + 18
    const by = YY_HERMIT.y - 32
    px(ctx, bx, by, 26, 18, '#fbf6e8')
    for (const [x, y, w, h] of [[bx, by, 26, 1], [bx, by + 17, 26, 1], [bx, by, 1, 18], [bx + 25, by, 1, 18]] as const) px(ctx, x, y, w, h, '#5d4a37')
    px(ctx, bx + 12, by + 5, 1, 10, '#4a8a3a')
    for (const [dx, dy] of [[-4, 6], [3, 4], [-3, 10], [4, 9]] as const) px(ctx, bx + 12 + dx, by + dy, 3, 2, '#5aa04a')
    dot(ctx, bx + 13, by + 4, '#d8403a')
    px(ctx, bx - 2, by + 18, 3, 3, '#fbf6e8')
    px(ctx, YY_HERMIT.x + 12, YY_HERMIT.y + 4, 4, 1, '#e6c39b')
    if (Math.sin(env.t * 2) > 0) dot(ctx, YY_HERMIT.x + 17, YY_HERMIT.y + 6, '#5a8a3a')
  }),
  sp('yy_pick', '꽃을 꺾어 가는 사람', 26, YY_GATE, (ctx) => flower(ctx, YY_HERMIT.x + 14, YY_HERMIT.y - 2, '#f2b8c6', '#d8a040')),
  sp('yy_nap', '나무 그늘에서 조는 사람', 26, YY_GATE, (ctx, env) => {
    for (let k = 0; k < 3; k++) {
      const f = mod(env.t * 0.4 + k / 3, 1)
      withAlpha(ctx, 1 - f, () => px(ctx, YY_HERMIT.x + 14 + f * 6 + k * 2, YY_HERMIT.y - 12 - f * 10 - k * 3, 3, 1, '#4a5a6a'))
    }
  }),
]

// ════════════════════════════════════════════════════════════
// 司空曙〈石井〉: 오동 그늘 아래 돌우물
// ════════════════════════════════════════════════════════════
const SJ_GROUND = 120
const SJ_WELL = { x: 160, y: 126 }

function well(ctx: Ctx) {
  const { x, y } = SJ_WELL
  px(ctx, x - 20, y, 40, 16, '#9a9284')
  for (let k = 0; k < 5; k++) px(ctx, x - 20 + k * 8, y + (k % 2) * 6, 8, 1, '#867e70')
  fillRows(ctx, y - 6, y + 2, (yy) => {
    const w = 20 * Math.sqrt(Math.max(0, 1 - ((yy - y + 2) / 4) ** 2))
    return [x - w, x + w]
  }, '#b4ac9c')
  fillRows(ctx, y - 5, y + 1, (yy) => {
    const w = 15 * Math.sqrt(Math.max(0, 1 - ((yy - y + 2) / 3) ** 2))
    return [x - w, x + w]
  }, '#1e2a2e')
}

export const shijingBackground: Background = {
  id: 'hy067',
  drawBack(ctx) {
    sky(ctx, ['#c8cccc', '#d4d6cc', '#e0dcc8'], SJ_GROUND)
    ridge(ctx, (x) => 84 + 12 * Math.sin(x * 0.018 + 1.4), '#98a69a', '#a4b2a6', 0, W, SJ_GROUND)
    px(ctx, 0, SJ_GROUND, W, H - SJ_GROUND, '#8a9a6a')
    // 오동 줄기
    px(ctx, 82, 50, 6, 74, '#7a8a72')
    px(ctx, 82, 50, 2, 74, '#9aa890')
    well(ctx)
    for (let k = 0; k < 6; k++) stone(ctx, 60 + k * 44, 150 + (k % 2) * 10, 3, '#a8a49a', '#8a867a')
  },
  drawFront() {},
  drawDynamic() {},
}

const SJ_WELL_F = { x: 112, y: 100, w: 96, h: 54 }
const SJ_TREE = { x: 16, y: 24, w: 192, h: 108 }
const SJ_MAN = { x: 136, y: 84, w: 112, h: 63 }

export const SHIJING_SPRITES = [
  sp('sj_moss', '이끼 낀 돌우물', 14, SJ_WELL_F, (ctx) => {
    for (let k = 0; k < 30; k++) px(ctx, SJ_WELL.x - 20 + hash(k * 2.3) * 38, SJ_WELL.y + hash(k * 3.1) * 15, 2 + (k % 2), 1, k % 3 ? '#5a8a4a' : '#7aa85a')
    for (let k = 0; k < 10; k++) dot(ctx, SJ_WELL.x - 18 + k * 4, SJ_WELL.y - 3 + (k % 2), '#6a9a4a')
  }),
  sp('sj_snow', '돌에 쌓인 눈', 14, SJ_WELL_F, (ctx) => px(ctx, SJ_WELL.x - 21, SJ_WELL.y - 6, 42, 3, '#f4f6f6')),
  sp('sj_carve', '새겨 놓은 글씨', 14, SJ_WELL_F, (ctx) => {
    for (let k = 0; k < 4; k++) px(ctx, SJ_WELL.x - 12 + k * 7, SJ_WELL.y + 4, 4, 6, '#5a5448')
  }),

  sp('sj_tung', '우물에 드는 오동 그늘', 12, SJ_TREE, (ctx, env) => {
    for (let k = 0; k < 22; k++) {
      const a = hash(k * 2.1) * 6.28
      const r = Math.sqrt(hash(k * 3.7)) * 34
      const x = 96 + Math.cos(a) * r * 1.4
      const y = 50 + Math.sin(a) * r * 0.6
      disc(ctx, x + Math.sin(env.t + k) * 0.6, y, 7, k % 3 ? '#4a7a40' : '#5e9050')
    }
    withAlpha(ctx, 0.3, () => fillRows(ctx, SJ_GROUND + 2, SJ_WELL.y + 18, (y) => {
      const d = (y - SJ_WELL.y - 6) / 14
      const w = 50 * Math.sqrt(Math.max(0, 1 - d * d))
      return [128 - w, 128 + w]
    }, '#2a3a2a'))
  }),
  sp('sj_moon', '우물에 든 달빛', 12, SJ_TREE, (ctx) => {
    moon(ctx, 60, 30, 7)
    px(ctx, SJ_WELL.x - 3, SJ_WELL.y - 3, 6, 2, '#f4ecc8')
  }),
  sp('sj_rain', '우물에 드는 빗물', 12, SJ_TREE, (ctx, env) => rain(ctx, env.t, 60, 120, 'rgba(160,175,190,0.7)')),

  sp('sj_hermit', '홀로 물 긷는 은자', 22, SJ_MAN, (ctx, env) => {
    standFig(ctx, SJ_WELL.x + 22, SJ_WELL.y - 18, HERMIT, true)
    const y = SJ_WELL.y - 12 + Math.round(Math.sin(env.t) * 4)
    px(ctx, SJ_WELL.x + 4, 96, 1, y - 96, '#8a7a5a')
    px(ctx, SJ_WELL.x - 4, 94, 30, 2, '#6a4a32')
    for (const x of [SJ_WELL.x - 4, SJ_WELL.x + 24]) px(ctx, x, 94, 2, SJ_WELL.y - 94, '#6a4a32')
    px(ctx, SJ_WELL.x + 1, y, 7, 6, '#8a6a48')
  }),
  sp('sj_women', '여럿이 모인 아낙들', 22, SJ_MAN, (ctx) => {
    for (let k = 0; k < 3; k++) lady(ctx, SJ_WELL.x + 22 + k * 12, SJ_WELL.y - 16, ['#c86a7a', '#6a8a9a', '#a89a5a'][k])
  }),
  sp('sj_ox', '물 마시는 소', 22, SJ_MAN, (ctx) => {
    px(ctx, SJ_WELL.x + 24, SJ_WELL.y - 6, 22, 10, '#6a4a32')
    px(ctx, SJ_WELL.x + 18, SJ_WELL.y - 4, 7, 6, '#6a4a32')
  }),

  sp('sj_sunset', '우물에 비친 지는 햇빛', 30, FULL, (ctx, env) => {
    withAlpha(ctx, 0.25, () => px(ctx, 0, 0, W, H, '#e8904a'))
    sun(ctx, 270, 92, 8, '#f08040', '#f4b070')
    withAlpha(ctx, 0.85, () => {
      for (let k = -2; k <= 2; k++) px(ctx, SJ_WELL.x - 8 + Math.abs(k) * 2 + Math.sin(env.t * 2 + k), SJ_WELL.y - 2 + k, 16 - Math.abs(k) * 4, 1, '#f4c060')
    })
  }),
  sp('sj_moonlit', '둥근 달', 30, FULL, (ctx) => {
    withAlpha(ctx, 0.4, () => px(ctx, 0, 0, W, H, '#1a2038'))
    moon(ctx, 270, 40, 8)
  }),
  sp('sj_birds', '새소리', 30, FULL, (ctx, env) => {
    for (let k = 0; k < 3; k++) bird(ctx, 120 + k * 20 + Math.sin(env.t + k) * 6, 50 + k * 4, Math.floor(env.t * 4 + k) % 2)
    soundArcs(ctx, 140, 54, env.t, '#5d4a37', 16)
  }),
]

// ════════════════════════════════════════════════════════════
// 司空曙〈雜言〉: 여름 끝의 풀밭
// ════════════════════════════════════════════════════════════
const ZN_GROUND = 120
const ZN_MAN = { x: 140, y: 104 }
const ZN_TREE = { x: 262, y: 128 }
const ZN_LEAVES = Array.from({ length: 16 }, (_, i) => ({ x: ZN_TREE.x - 26 + hash(i * 2.3) * 52, y: 76 + hash(i * 3.9) * 34 }))

export const zayanBackground: Background = {
  id: 'hy068',
  drawBack(ctx) {
    sky(ctx, ['#b8ccd8', '#c8d6dc', '#d8e0dc'], ZN_GROUND)
    ridge(ctx, (x) => 96 + 8 * Math.sin(x * 0.022 + 2), '#94aa9c', '#a0b6a8', 0, W, ZN_GROUND)
    px(ctx, 0, ZN_GROUND, W, H - ZN_GROUND, '#7aa058')
    for (let k = 0; k < 80; k++) dot(ctx, hash(k * 1.7) * W, ZN_GROUND + 4 + hash(k * 2.9) * 56, '#6a9048')
    px(ctx, ZN_TREE.x - 2, ZN_TREE.y - 52, 4, 52, '#4a3426')
    for (const l of ZN_LEAVES) disc(ctx, l.x, l.y, 5, '#5a8a48')
  },
  drawFront() {},
  drawDynamic() {},
}

const ZN_MAN_F = { x: 88, y: 76, w: 112, h: 63 }
const ZN_FIELD = { x: 48, y: 108, w: 160, h: 72 }
const ZN_TREE_F = { x: 208, y: 64, w: 112, h: 72 }

/** 얇은 갈포 옷의 사람. 바람이 불면 옷자락이 날린다 */
function znMan(ctx: Ctx, t: number, wind: number) {
  standFig(ctx, ZN_MAN.x, ZN_MAN.y, pal({ R: '#d8d4c0', r: '#b8b4a0', L: '#8a8a72' }))
  if (wind) for (let r = 14; r < 21; r++) px(ctx, ZN_MAN.x - 2 - Math.round(wind * (1 + Math.sin(t * 8 + r))), ZN_MAN.y + r, 2, 1, '#b8b4a0')
}

export const ZAYAN_SPRITES = [
  sp('zn_west', '서쪽으로 기우는 해', 6, FULL, (ctx) => {
    withAlpha(ctx, 0.2, () => px(ctx, 0, 0, W, ZN_GROUND, '#f4c080'))
    sun(ctx, 30, 84, 8, '#f0a050', '#f4c080')
    withAlpha(ctx, 0.3, () => px(ctx, ZN_MAN.x + 12, ZN_MAN.y + 21, 40, 2, '#3a4a2a'))
  }),
  sp('zn_noon', '한가운데 뜬 해', 6, FULL, (ctx) => sun(ctx, 160, 20, 8)),
  sp('zn_east', '동쪽에서 떠오르는 해', 6, FULL, (ctx) => {
    withAlpha(ctx, 0.2, () => px(ctx, 0, 0, W, ZN_GROUND, '#f4d0b0'))
    sun(ctx, 210, 88, 8, '#f4c060')
  }),

  sp('zn_rain', '얇은 옷에 뿌리는 비바람', 20, ZN_MAN_F, (ctx, env) => {
    znMan(ctx, env.t, 1)
    rain(ctx, env.t, 70, 130, 'rgba(170,185,200,0.6)', 5, -1.6)
  }, { wind: 0.8 }),
  sp('zn_petals', '꽃잎 맞는 사람', 20, ZN_MAN_F, (ctx, env) => {
    znMan(ctx, env.t, 0)
    drift(ctx, env.t, { x: 90, y: 70, w: 110, h: 60 }, 16, '#f2b8c6', 0.5, 3)
  }),
  sp('zn_snow', '함박눈 맞는 사람', 20, ZN_MAN_F, (ctx, env) => {
    znMan(ctx, env.t, 0)
    snowfall(ctx, env.t, 60)
  }),

  sp('zn_swallow', '푸른 풀밭을 스치는 제비', 22, ZN_FIELD, (ctx, env) => {
    for (let k = 0; k < 3; k++) {
      const f = mod(env.t * 0.25 + k / 3, 1)
      const x = 40 + f * 200
      const y = 150 - Math.sin(f * Math.PI * 2) * 10 + k * 6
      px(ctx, x, y, 4, 1, '#2a2a3a')
      dot(ctx, x + 4, y - 1, '#2a2a3a')
      const up = Math.sin(env.t * 8 + k) > 0
      px(ctx, x + 1, up ? y - 2 : y + 1, 3, 1, '#2a2a3a')
      px(ctx, x - 3, y + 1, 3, 1, '#2a2a3a')
      dot(ctx, x + 4, y, '#c8402a')
    }
  }),
  sp('zn_butterfly', '나비', 22, ZN_FIELD, (ctx, env) => {
    for (let k = 0; k < 4; k++) {
      const x = 70 + k * 30 + Math.sin(env.t + k) * 8
      const o = Math.sin(env.t * 10 + k) > 0
      px(ctx, x - (o ? 3 : 1), 140, o ? 3 : 1, 2, '#f4e060')
      px(ctx, x + 1, 140, o ? 3 : 1, 2, '#f4e060')
    }
  }),
  sp('zn_kite', '종이 연', 22, ZN_FIELD, (ctx) => {
    fillRows(ctx, 112, 124, (y) => [100 - (6 - Math.abs(y - 118)), 100 + (6 - Math.abs(y - 118))], '#e8c048')
    for (let i = 0; i < 30; i++) dot(ctx, 100 + i * 1.2, 124 + i * 1.6, '#5a4632')
  }),

  sp('zn_cicada', '붉은 잎 가지에서 우는 매미', 24, ZN_TREE_F, (ctx, env) => {
    ZN_LEAVES.forEach((l, i) => {
      if (i % 2) disc(ctx, l.x, l.y, 5, i % 4 === 1 ? '#c8502a' : '#d8703a')
    })
    const cx = ZN_TREE.x + 2
    const cy = 112
    px(ctx, cx, cy, 3, 5, '#4a3a2a')
    px(ctx, cx + 3, cy, 2, 6, 'rgba(220,230,230,0.7)')
    soundArcs(ctx, cx + 1, cy + 2, env.t * 2, '#5d4a37', 18)
  }),
  sp('zn_magpie', '까치', 24, ZN_TREE_F, (ctx) => {
    px(ctx, ZN_TREE.x + 4, 104, 6, 4, '#1f1d22')
    px(ctx, ZN_TREE.x + 6, 106, 3, 2, '#f4f4f0')
    px(ctx, ZN_TREE.x - 2, 106, 6, 1, '#1f1d22')
  }),
  sp('zn_monkey', '원숭이', 24, ZN_TREE_F, (ctx, env) => {
    const s = Math.round(Math.sin(env.t * 2) * 2)
    px(ctx, ZN_TREE.x + 4 + s, 100, 6, 6, '#8a6a4a')
    px(ctx, ZN_TREE.x + 5 + s, 96, 4, 4, '#a8886a')
  }),
]

