// 『唐詩畫意』 卷八 셋째 묶음 (1): 韋應物〈寄璩師〉〈懷琅琊深標二釋子〉〈閶門懷古〉〈同褒子秋齋獨宿〉〈題桐葉〉, 岑參〈題梁鍠城中高居〉〈題三會寺蒼頡造字臺〉
import type { Background } from '../types'
import { H, W, disc, dot, fillRows, hash, mod, px } from '../pixel'
import type { Ctx } from '../pixel'
import { GREEN, bamboo, bird, broadTree, flower, hut, mistBands, moon, person, pine, rain, ridge, sky, stars, withAlpha } from '../kit'
import { OTHER_PALS, pal, seatFig, standFig } from '../figures'
import { mix, soundArcs, sp, stone, sun } from './hy_kit'

const MONK = pal({ K: '#8a7a6a', H: '#8a7a6a', R: '#6a6458', r: '#4e4a40', L: '#8a6a3a', B: '#e6c39b' })
const FULL = { x: 0, y: 0, w: 320, h: 180 }

/** 기와 지붕 한 채 (x, y 는 용마루 왼쪽 끝, w 는 폭) */
function roof(ctx: Ctx, x: number, y: number, w: number, tile = '#3c4048', ridgeC = '#4a4f57') {
  px(ctx, x + 2, y, w - 4, 2, ridgeC)
  for (let r = 0; r < 4; r++) px(ctx, x - r, y + 2 + r, w + r * 2, 1, tile)
  dot(ctx, x - 4, y + 4, tile)
  dot(ctx, x + w + 3, y + 4, tile)
}

/** 회상 장면을 담는 엷은 타원 */
function vignette(ctx: Ctx, cx: number, cy: number, rx: number, ry: number, inner: (ctx: Ctx) => void) {
  withAlpha(ctx, 0.92, () => fillRows(ctx, cy - ry, cy + ry, (y) => {
    const d = (y - cy) / ry
    const w = rx * Math.sqrt(Math.max(0, 1 - d * d))
    return [cx - w, cx + w]
  }, (y) => (y < cy ? '#e9e4d4' : '#ddd8c4')))
  ctx.save()
  ctx.beginPath()
  ctx.ellipse(cx, cy, rx - 1, ry - 1, 0, 0, Math.PI * 2)
  ctx.clip()
  inner(ctx)
  ctx.restore()
  for (let a = 0; a < Math.PI * 2; a += 0.09) dot(ctx, cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, '#b8ae94')
}

// ════════════════════════════════════════════════════════════
// 韋應物〈寄璩師〉: 숲속 절의 서쪽 회랑, 그리고 떠올린 산승
// ════════════════════════════════════════════════════════════
export const qushiBackground: Background = {
  id: 'hy032',
  drawBack(ctx) {
    sky(ctx, ['#9aa4ae', '#aab2b6', '#bcc0b8'], 92)
  },
  drawFront(ctx) {
    ridge(ctx, (x) => 74 + 8 * Math.sin(x * 0.02 + 1) + 3 * Math.sin(x * 0.09), '#5a6a62', '#66766c')
    // 절을 두른 숲
    for (let k = 0; k < 9; k++) broadTree(ctx, 6 + k * 20, 102 + (k % 2) * 3, 1.5 + (k % 3) * 0.2, { dark: '#24382c', base: '#30483a', light: '#3e5a48' })
    px(ctx, 0, 138, W, H - 138, '#4a5446')
    // 본당 벽과 서쪽 회랑
    px(ctx, 20, 104, 140, 32, '#c9bfa5')
    roof(ctx, 18, 96, 144)
    for (let x = 22; x <= 158; x += 17) px(ctx, x, 104, 2, 32, '#6b4a32')
    px(ctx, 14, 136, 152, 3, '#8a8072')
    for (let x = 30; x < 150; x += 17) px(ctx, x, 112, 9, 12, '#5a4a3a')
    // 오른쪽 언덕
    fillRows(ctx, 96, H, (y) => [190 - (y - 96) * 0.4, W], '#3e4c40')
    for (let k = 0; k < 6; k++) broadTree(ctx, 196 + k * 22, 118 - (k % 2) * 4, 1.2, { dark: '#22342a', base: '#2c4234', light: '#38523f' })
  },
  drawDynamic() {},
}

const QS_HALL = { x: 8, y: 80, w: 160, h: 90 }
const QS_MEM = { x: 168, y: 62, w: 144, h: 81 }
const QS_ONE = { x: 196, y: 84, w: 104, h: 58 }
const MEM = (inner: (ctx: Ctx) => void) => (ctx: Ctx) => vignette(ctx, 240, 110, 64, 40, inner)

function qsLamp(ctx: Ctx, x: number, t: number, lit: boolean) {
  px(ctx, x + 2, 103, 1, 3, '#3a2a1c')
  px(ctx, x, 106, 5, 6, lit ? '#f4dca0' : '#d8d0b8')
  px(ctx, x, 106, 5, 1, '#6b4a32')
  px(ctx, x, 111, 5, 1, '#6b4a32')
  if (lit) withAlpha(ctx, 0.22 + Math.sin(t * 3 + x) * 0.05, () => disc(ctx, x + 2, 109, 8, '#ffd27a'))
}

export const QUSHI_SPRITES = [
  sp('qs_night', '숲속 절에 내리는 밤빛', 4, FULL, (ctx, env) => {
    sky(ctx, ['#1e2440', '#2a3150', '#3c4260', '#5a5a6c'], 92)
    stars(ctx, 26, 3, 4, 56, env.t)
    withAlpha(ctx, 0.35, () => px(ctx, 0, 0, W, H, '#1a2038'))
  }),
  sp('qs_dawn', '아침 햇살', 4, FULL, (ctx) => {
    sky(ctx, ['#e8c8b0', '#f0d6b4', '#f4e2c0'], 92)
    sun(ctx, 60, 70, 8)
  }),
  sp('qs_rain', '한낮의 소나기', 4, FULL, (ctx, env) => {
    sky(ctx, ['#7a8288', '#8a9296', '#9aa0a0'], 92)
    rain(ctx, env.t, 70, 120, 'rgba(200,210,220,0.6)')
  }),

  sp('qs_lamp', '서쪽 회랑의 깁 등불', 22, QS_HALL, (ctx, env) => {
    for (let x = 27; x < 158; x += 17) qsLamp(ctx, x, env.t, true)
  }),
  sp('qs_chime', '처마 끝 풍경', 22, QS_HALL, (ctx, env) => {
    for (const x of [14, 164]) {
      const s = Math.round(Math.sin(env.t * 3 + x) * 1.5)
      px(ctx, x, 100, 1, 4, '#3a2a1c')
      px(ctx, x - 1 + s, 104, 3, 4, '#8a7a3a')
      dot(ctx, x + s, 109, '#c9a441')
      soundArcs(ctx, x, 106, env.t, '#5d4a37', 10)
    }
  }),
  sp('qs_laundry', '널어 둔 빨래', 22, QS_HALL, (ctx, env) => {
    px(ctx, 24, 108, 134, 1, '#6a5a48')
    for (let k = 0; k < 6; k++) {
      const x = 30 + k * 21
      const s = Math.round(Math.sin(env.t * 2 + k) * 1)
      px(ctx, x + s, 109, 10, 10, ['#e8e2d0', '#a8b8c8', '#d8c8a0'][k % 3])
    }
  }),

  sp('qs_pine', '떠올린 큰 소나무', 22, QS_MEM, MEM((ctx) => {
    px(ctx, 170, 130, 140, 30, '#c8c2a8')
    pine(ctx, 228, 134, 1.6, 0, { dark: '#4a6052', base: '#5e7466', light: '#7a8e80' })
    pine(ctx, 262, 132, 1.2, 0, { dark: '#4a6052', base: '#5e7466', light: '#7a8e80' })
  })),
  sp('qs_bamboo', '떠올린 대숲', 22, QS_MEM, MEM((ctx) => {
    px(ctx, 170, 130, 140, 30, '#c8c2a8')
    for (let k = 0; k < 12; k++) bamboo(ctx, 192 + k * 9, 134, 30 + (k % 3) * 8)
  })),
  sp('qs_willow', '떠올린 버드나무', 22, QS_MEM, MEM((ctx) => {
    px(ctx, 170, 130, 140, 30, '#c8c2a8')
    px(ctx, 238, 96, 3, 38, '#5a4632')
    for (let k = 0; k < 14; k++) {
      const x = 222 + k * 3
      const len = 16 + hash(k) * 14
      for (let i = 0; i < len; i++) dot(ctx, x + Math.sin(i * 0.2) * 1.5, 92 + i + Math.abs(k - 7), k % 2 ? '#8aa860' : '#a4bf74')
    }
  })),

  sp('qs_monk', '소나무 아래 홀로 앉은 산승', 26, QS_ONE, (ctx) => {
    px(ctx, 234, 133, 18, 2, '#a89c80')
    seatFig(ctx, 236, 118, MONK)
  }),
  sp('qs_go', '바둑 두는 두 사람', 26, QS_ONE, (ctx) => {
    seatFig(ctx, 218, 118, pal(OTHER_PALS[0]))
    seatFig(ctx, 252, 118, pal(OTHER_PALS[1]), true)
    px(ctx, 234, 128, 16, 6, '#c8a868')
    for (let k = 0; k < 6; k++) dot(ctx, 236 + (k % 3) * 5, 129 + Math.floor(k / 3) * 3, k % 2 ? '#f4f0e4' : '#1f1d22')
  }),
  sp('qs_woodcutter', '나무하는 사람', 26, QS_ONE, (ctx, env) => {
    standFig(ctx, 244, 112, pal(OTHER_PALS[3]))
    const up = Math.sin(env.t * 4) > 0
    px(ctx, 256, up ? 112 : 118, 2, 8, '#5a4632')
    px(ctx, 255, up ? 110 : 124, 5, 3, '#8a8a8a')
    for (let k = 0; k < 3; k++) px(ctx, 214 + k * 4, 128 - k * 2, 14, 2, '#8a6a48')
  }),
]

// ════════════════════════════════════════════════════════════
// 韋應物〈懷琅琊深標二釋子〉: 밤의 큰 골짜기
// ════════════════════════════════════════════════════════════
const lyLeft = (y: number) => 40 + (y - 40) * 0.55 + Math.sin(y * 0.2) * 3
const lyRight = (y: number) => 300 - (y - 50) * 0.75 + Math.sin(y * 0.17) * 3

export const langyaBackground: Background = {
  id: 'hy033',
  drawBack(ctx) {
    sky(ctx, ['#1c2236', '#242c42', '#2e374e'], H)
    stars(ctx, 20, 7, 4, 60, 0)
    ridge(ctx, (x) => 66 + 10 * Math.sin(x * 0.02 + 2), '#262e3a', '#2e3644')
    // 골짜기 바닥
    px(ctx, 0, 150, W, 30, '#1e2620')
    // 서쪽(왼쪽) 벼랑
    fillRows(ctx, 40, H, (y) => [0, lyLeft(y)], (y) => (y % 7 === 0 ? '#3e4640' : '#363e38'))
    for (let y = 46; y < 170; y += 9) px(ctx, lyLeft(y) - 18, y, 14, 1, '#4a524a')
    // 동쪽(오른쪽) 그늘진 벼랑
    fillRows(ctx, 50, H, (y) => [lyRight(y), W], (y) => (y % 6 === 0 ? '#262c2a' : '#2c3230'))
    for (let y = 56; y < 170; y += 8) px(ctx, lyRight(y) + 4, y, 10, 1, '#202624')
    for (let k = 0; k < 5; k++) pine(ctx, 8 + k * 16, 48 + k * 2, 0.7, 0, { dark: '#16241c', base: '#1e3026', light: '#2a3e30' })
  },
  drawFront() {},
  drawDynamic() {},
}

const LY_VALLEY = { x: 60, y: 76, w: 184, h: 104 }
const LY_EAST = { x: 176, y: 70, w: 128, h: 72 }
const LY_WEST = { x: 0, y: 70, w: 144, h: 81 }

export const LANGYA_SPRITES = [
  sp('ly_cloud', '골짜기를 묻은 흰 구름', 24, LY_VALLEY, (ctx, env) => {
    for (let k = 0; k < 12; k++) {
      const x = 80 + hash(k * 3) * 150 + Math.sin(env.t * 0.2 + k) * 4
      const y = 120 + hash(k * 7) * 46
      const r = 8 + Math.round(hash(k) * 6)
      fillRows(ctx, y - r * 0.55, y + r * 0.3, (yy) => {
        const d = (yy - y) / (r * 0.55)
        const w = r * 2 * Math.sqrt(Math.max(0, 1 - d * d))
        return [x - w, x + w]
      }, (yy) => (yy < y - r * 0.2 ? '#f2f2ee' : '#d8dcdc'))
    }
    mistBands(ctx, env.t, [112, 118], '#e8ecec', 0.5)
  }),
  sp('ly_fire', '산불 연기', 24, LY_VALLEY, (ctx, env) => {
    withAlpha(ctx, 0.5, () => px(ctx, 70, 140, 180, 20, '#c8602a'))
    for (let k = 0; k < 10; k++) {
      const f = mod(env.t * 0.15 + k / 10, 1)
      withAlpha(ctx, 0.7 * (1 - f), () => disc(ctx, 100 + k * 14 + f * 10, 150 - f * 70, 6 + f * 8, '#5a5450'))
    }
    for (let k = 0; k < 14; k++) if (Math.sin(env.t * 9 + k) > 0) px(ctx, 80 + k * 11, 146 + (k % 3), 2, 4, '#ffb040')
  }),
  sp('ly_snow', '쏟아진 눈', 24, LY_VALLEY, (ctx) => {
    fillRows(ctx, 120, 168, (y) => [lyLeft(y) - 6, lyRight(y) + 6], (y) => (y < 130 ? '#f4f6f6' : '#dfe6ea'))
    for (let k = 0; k < 10; k++) stone(ctx, 100 + k * 13, 124 + (k % 3) * 6, 4, '#ffffff', '#e4eaee')
  }),

  sp('ly_drip', '벼랑의 밤 샘물', 26, LY_EAST, (ctx, env) => {
    const x = lyRight(92) + 2
    px(ctx, x - 6, 90, 12, 2, '#3a4440')
    for (let k = 0; k < 4; k++) {
      const f = mod(env.t * 0.9 + k / 4, 1)
      px(ctx, x - 3 + k * 2, 92 + f * 44, 1, 2, '#b8d4dc')
    }
    for (let y = 92; y < 136; y += 3) dot(ctx, x + Math.sin(y) * 2, y, 'rgba(160,190,200,0.5)')
    fillRows(ctx, 136, 142, (y) => [x - 14 + (y - 136), x + 14 - (y - 136)], '#3a5a66')
    const r = mod(env.t, 1) * 10
    for (let a = 0; a < 6.28; a += 0.4) dot(ctx, x + Math.cos(a) * r, 138 + Math.sin(a) * r * 0.25, '#8ab0bc')
  }),
  sp('ly_ice', '벼랑의 고드름', 26, LY_EAST, (ctx) => {
    const x = lyRight(92) + 2
    px(ctx, x - 16, 90, 30, 2, '#3a4440')
    for (let k = 0; k < 8; k++) fillRows(ctx, 92, 92 + 6 + (k % 3) * 6, (y) => [x - 15 + k * 4, x - 13 + k * 4 - (y - 92) * 0.08], '#d8eaf0')
  }),
  sp('ly_vine', '벼랑의 붉은 덩굴꽃', 26, LY_EAST, (ctx) => {
    for (let k = 0; k < 5; k++) {
      const x = lyRight(80 + k * 12) + 6 + k * 3
      for (let i = 0; i < 30; i++) dot(ctx, x + Math.sin(i * 0.4 + k) * 2, 80 + k * 6 + i, '#3e5a3a')
      for (let i = 0; i < 4; i++) flower(ctx, x + Math.sin(i * 3) * 3, 88 + k * 6 + i * 7, '#d84a4a', '#f4c040')
    }
  }),

  sp('ly_cave', '서쪽 바위굴 석실', 22, LY_WEST, (ctx, env) => {
    const x = lyLeft(108) - 40
    fillRows(ctx, 96, 116, (y) => {
      const d = (y - 116) / 20
      const w = 14 * Math.sqrt(Math.max(0, 1 - d * d))
      return [x - w, x + w]
    }, '#141816')
    withAlpha(ctx, 0.5 + Math.sin(env.t * 3) * 0.08, () => disc(ctx, x, 110, 5, '#e8b060'))
    px(ctx, x - 1, 108, 2, 3, '#ffd27a')
    for (let k = 0; k < 4; k++) px(ctx, x + 10 + k * 6, 116 + k * 6, 8, 2, '#4e564e')
  }),
  sp('ly_temple', '기와를 인 큰 절', 22, LY_WEST, (ctx) => {
    const x = lyLeft(110) - 70
    px(ctx, x, 104, 52, 14, '#c9bfa5')
    roof(ctx, x - 2, 96, 56)
    px(ctx, x + 22, 108, 8, 10, '#6b4a32')
    px(ctx, x - 6, 118, 64, 3, '#8a8072')
  }),
  sp('ly_hut', '강가의 초막', 22, LY_WEST, (ctx) => {
    px(ctx, 60, 156, 120, 6, '#3a5262')
    hut(ctx, 92, 140)
  }),

  sp('ly_moon', '달빛에 푸르스름한 산', 30, FULL, (ctx) => {
    moon(ctx, 40, 24, 9)
    withAlpha(ctx, 0.22, () => px(ctx, 0, 40, W, H - 40, '#6a9a96'))
    withAlpha(ctx, 0.3, () => {
      for (let y = 46; y < 170; y += 2) px(ctx, lyLeft(y) - 4, y, 4, 1, '#a8c8c0')
    })
  }),
  sp('ly_dusk', '노을에 붉은 산', 30, FULL, (ctx) => {
    sun(ctx, 50, 62, 8, '#e87a3a', '#f4a060')
    withAlpha(ctx, 0.3, () => px(ctx, 0, 0, W, H, '#c8502a'))
  }),
  sp('ly_rain', '비에 젖어 어둑한 산', 30, FULL, (ctx, env) => {
    withAlpha(ctx, 0.35, () => px(ctx, 0, 0, W, H, '#0e1016'))
    rain(ctx, env.t, 80, 140, 'rgba(150,160,175,0.6)')
  }),
]

// ════════════════════════════════════════════════════════════
// 韋應物〈閶門懷古〉: 소주 창문과 오나라 궁원 터
// ════════════════════════════════════════════════════════════
const CM_GROUND = 128
const CM_TREE = { x: 44, y: 128 }

export const changmenBackground: Background = {
  id: 'hy034',
  drawBack(ctx) {
    sky(ctx, ['#b4bcc0', '#c4c8c4', '#d2d2c8'], CM_GROUND)
    ridge(ctx, (x) => 104 + 4 * Math.sin(x * 0.03 + 2), '#8a948e', '#96a098', 0, W, CM_GROUND)
    for (let y = CM_GROUND; y < H; y++) px(ctx, 0, y, W, 1, mix('#9a9a7a', '#7a7a5a', (y - CM_GROUND) / 52))
    // 높은 나무
    px(ctx, CM_TREE.x - 2, 70, 4, 58, '#4a3426')
    for (const [dx, dy, r] of [[-12, 66, 12], [10, 62, 11], [0, 52, 12], [-6, 78, 9], [12, 78, 8]] as const) disc(ctx, CM_TREE.x + dx, dy, r, (d) => (d < -3 ? '#5e7a52' : '#4a6442'))
    // 창문 성벽과 문루
    px(ctx, 196, 112, 124, 52, '#8a8274')
    for (let x = 196; x < W; x += 8) px(ctx, x, 108, 5, 4, '#8a8274')
    for (let y = 118; y < 164; y += 7) px(ctx, 196, y, 124, 1, '#7a7264')
    fillRows(ctx, 128, 164, (y) => {
      const d = (y - 146) / 18
      return y < 140 ? [244 - Math.sqrt(Math.max(0, 1 - ((140 - y) / 12) ** 2)) * 12, 244 + Math.sqrt(Math.max(0, 1 - ((140 - y) / 12) ** 2)) * 12] : [232 + d * 0, 256]
    }, '#2e2a26')
    px(ctx, 220, 96, 48, 12, '#a43a2a')
    roof(ctx, 216, 88, 56, '#3a3e46', '#4a4f57')
    for (let x = 222; x < 268; x += 8) px(ctx, x, 98, 2, 10, '#6b2a1e')
    px(ctx, 190, 164, 130, 16, '#8a8a6a')
  },
  drawFront() {},
  drawDynamic() {},
}

const CM_TREE_F = { x: 0, y: 32, w: 128, h: 72 }
const CM_PLAIN = { x: 70, y: 84, w: 136, h: 76 }
const CM_GATE = { x: 176, y: 72, w: 144, h: 81 }

export const CHANGMEN_SPRITES = [
  sp('cm_bird', '높은 나무에서 내려오는 외로운 새', 24, CM_TREE_F, (ctx, env) => {
    const f = mod(env.t * 0.12, 1)
    const x = CM_TREE.x + 8 + f * 50
    const y = 58 + Math.sin(f * 3.14) * -6 + f * 30
    bird(ctx, x, y, Math.floor(env.t * 5) % 2, '#2a2a30')
  }),
  sp('cm_crows', '까마귀 떼', 24, CM_TREE_F, (ctx, env) => {
    for (let k = 0; k < 9; k++) {
      const x = 20 + mod(hash(k) * 100 + env.t * 8, 110)
      bird(ctx, x, 40 + hash(k * 3) * 26, Math.floor(env.t * 6 + k) % 2, '#1a1a20')
    }
  }),
  sp('cm_monkey', '나무 위 원숭이', 24, CM_TREE_F, (ctx, env) => {
    const s = Math.round(Math.sin(env.t * 2) * 2)
    px(ctx, CM_TREE.x + 12 + s, 82, 6, 6, '#8a6a4a')
    px(ctx, CM_TREE.x + 13 + s, 78, 4, 4, '#a8886a')
    px(ctx, CM_TREE.x + 18 + s, 84, 1, 8, '#8a6a4a')
  }),

  sp('cm_ruin', '오나라 궁원 터', 12, CM_PLAIN, (ctx) => {
    px(ctx, 90, 124, 96, 6, '#a8a08a')
    px(ctx, 96, 120, 84, 4, '#b4ac94')
    for (const [x, h] of [[100, 10], [116, 4], [134, 8], [152, 3], [168, 7]] as const) px(ctx, x, 120 - h, 4, h, '#8a8270')
    for (let k = 0; k < 6; k++) px(ctx, 104 + k * 13, 131 + (k % 2) * 2, 5, 2, '#5a5e62')
  }),
  sp('cm_market', '북적이는 저잣거리', 12, CM_PLAIN, (ctx) => {
    for (let k = 0; k < 4; k++) {
      px(ctx, 92 + k * 24, 116, 20, 3, ['#b2352a', '#d9a441', '#4f6b4a', '#6b5a7a'][k])
      px(ctx, 94 + k * 24, 119, 2, 9, '#5a4632')
      person(ctx, 100 + k * 24, 122, OTHER_PALS[k].R)
    }
  }),
  sp('cm_palace', '새로 지은 궁궐', 12, CM_PLAIN, (ctx) => {
    px(ctx, 96, 110, 80, 18, '#b8352a')
    roof(ctx, 92, 100, 88, '#c89a3a', '#e0b84a')
    for (let x = 100; x < 176; x += 10) px(ctx, x, 112, 2, 16, '#e0b84a')
    px(ctx, 88, 128, 96, 3, '#e6dfcc')
  }),

  sp('cm_weeds', '풀만 우거진 옛터', 20, CM_PLAIN, (ctx, env) => {
    for (let k = 0; k < 46; k++) {
      const x = 84 + hash(k * 2.3) * 108
      const h = 6 + hash(k * 4.1) * 10
      const lean = Math.sin(env.t * 1.5 + k) * 1.5
      for (let i = 0; i < h; i++) dot(ctx, x + lean * (i / h), 134 - i, k % 3 ? '#8a8a4a' : '#a8a05a')
    }
  }),
  sp('cm_feast', '흥겨운 잔치', 20, CM_PLAIN, (ctx, env) => {
    for (let k = 0; k < 5; k++) {
      person(ctx, 96 + k * 18, 124 - (Math.sin(env.t * 4 + k) > 0 ? 1 : 0), OTHER_PALS[k % 4].R)
      px(ctx, 92 + k * 18, 110, 4, 5, Math.sin(env.t * 3 + k) > -0.5 ? '#e04a3a' : '#c03a2a')
    }
  }),
  sp('cm_army', '줄지어 가는 군대', 20, CM_PLAIN, (ctx, env) => {
    for (let k = 0; k < 8; k++) {
      const x = 90 + mod(k * 12 + env.t * 6, 100)
      person(ctx, x, 124, '#6a3a2a', { hat: '#4a4a52' })
      px(ctx, x + 3, 114, 1, 10, '#5a4632')
      if (k % 3 === 0) px(ctx, x + 4, 114, 5, 3, '#c0302a')
    }
  }),

  sp('cm_gate', '해 질 녘 창문에 기댄 시인', 30, CM_GATE, (ctx) => {
    withAlpha(ctx, 0.28, () => px(ctx, 0, 0, W, H, '#d86a2a'))
    sun(ctx, 150, 100, 7, '#e8803a', '#f4a060')
    standFig(ctx, 212, 142, pal(), true)
  }),
  sp('cm_morning', '아침 성문 앞 말 탄 사람', 30, CM_GATE, (ctx) => {
    withAlpha(ctx, 0.15, () => px(ctx, 0, 0, W, H, '#f4f0d8'))
    px(ctx, 200, 152, 18, 7, '#6a4a32')
    px(ctx, 215, 146, 5, 7, '#6a4a32')
    for (const x of [201, 205, 211, 215]) px(ctx, x, 159, 1, 5, '#4a3424')
    person(ctx, 206, 142, '#4b5068')
  }),
  sp('cm_night', '한밤 성벽 위', 30, CM_GATE, (ctx, env) => {
    withAlpha(ctx, 0.5, () => px(ctx, 0, 0, W, H, '#141a30'))
    moon(ctx, 150, 30, 6)
    stars(ctx, 14, 5, 4, 70, env.t)
    person(ctx, 290, 100, '#4b5068')
  }),
]

// ════════════════════════════════════════════════════════════
// 韋應物〈同褒子秋齋獨宿〉: 가을밤 서재
// ════════════════════════════════════════════════════════════
const QZ_GROUND = 146

export const qiuzhaiBackground: Background = {
  id: 'hy035',
  drawBack(ctx) {
    sky(ctx, ['#161c32', '#1e2640', '#2a3250'], QZ_GROUND)
    ridge(ctx, (x) => 92 + 14 * Math.sin(x * 0.018 + 1) + 4 * Math.sin(x * 0.08), '#1e2634', '#262e3e', 0, W, QZ_GROUND)
    px(ctx, 0, QZ_GROUND, W, H - QZ_GROUND, '#22282a')
    // 둥지가 있는 나무
    px(ctx, 150, 92, 3, 54, '#2e241c')
    for (const [dx, dy] of [[-10, 96], [12, 100], [-4, 88]] as const) px(ctx, 151 + Math.min(0, dx), dy, Math.abs(dx), 1, '#2e241c')
    px(ctx, 156, 98, 8, 3, '#4a3a2a')
    // 서재
    px(ctx, 196, 110, 96, 36, '#8a8070')
    roof(ctx, 192, 100, 104, '#2a2e36', '#363a42')
    px(ctx, 214, 118, 30, 20, '#3a3226')
    for (let x = 214; x <= 244; x += 6) px(ctx, x, 118, 1, 20, '#5a4a36')
    px(ctx, 214, 127, 30, 1, '#5a4a36')
    px(ctx, 262, 120, 14, 26, '#3a2c20')
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    for (let k = 0; k < 11; k++) bamboo(ctx, 6 + k * 10, QZ_GROUND + 2, 44 + (k % 4) * 8, Math.sin(env.t * (1 + env.wind * 3) + k) * (0.8 + env.wind * 6), env.t)
  },
}

const QZ_SKY = { x: 0, y: 0, w: 144, h: 81 }
const QZ_BAMBOO = { x: 0, y: 72, w: 128, h: 72 }
const QZ_NEST = { x: 112, y: 70, w: 96, h: 54 }
const QZ_ROOM = { x: 192, y: 96, w: 104, h: 58 }

export const QIUZHAI_SPRITES = [
  sp('qz_moon', '촛불처럼 환한 산 달', 6, QZ_SKY, (ctx) => {
    moon(ctx, 60, 34, 11)
    withAlpha(ctx, 0.12, () => px(ctx, 0, 0, W, H, '#c8d0f0'))
  }),
  sp('qz_dark', '구름에 가린 그믐', 6, QZ_SKY, (ctx) => {
    disc(ctx, 60, 34, 6, '#c8c4a8')
    disc(ctx, 63, 33, 6, '#1e2640')
    for (const [x, y, w] of [[20, 30, 70], [40, 38, 80]] as const) px(ctx, x, y, w, 5, '#2e3448')
  }),
  sp('qz_red', '붉게 떠오른 달', 6, QZ_SKY, (ctx) => {
    withAlpha(ctx, 0.2, () => disc(ctx, 60, 70, 18, '#e86a3a'))
    disc(ctx, 60, 70, 10, '#d8603a')
  }),

  sp('qz_frost', '대숲을 흔드는 바람과 서리', 24, QZ_BAMBOO, (ctx, env) => {
    for (let k = 0; k < 40; k++) dot(ctx, 4 + hash(k * 3) * 110, 96 + hash(k * 5) * 50, Math.sin(env.t + k) > 0 ? '#e8f0f4' : '#c8d4dc')
    for (let k = 0; k < 6; k++) {
      const x = mod(hash(k) * 140 + env.t * 40, 150) - 10
      withAlpha(ctx, 0.5, () => px(ctx, x, 90 + k * 9, 14, 1, '#c8d4e4'))
    }
    withAlpha(ctx, 0.5, () => px(ctx, 0, QZ_GROUND, 130, 3, '#d8e4ea'))
  }, { wind: 0.8 }),
  sp('qz_rain', '대숲의 소나기', 24, QZ_BAMBOO, (ctx, env) => {
    ctx.save()
    ctx.beginPath()
    ctx.rect(0, 72, 128, 76)
    ctx.clip()
    rain(ctx, env.t, 60, 150, 'rgba(160,180,200,0.7)')
    ctx.restore()
  }, { wind: 0.3 }),
  sp('qz_monkey', '대숲에서 뛰노는 원숭이', 24, QZ_BAMBOO, (ctx, env) => {
    const x = 40 + Math.sin(env.t * 1.5) * 30
    px(ctx, x, 110, 6, 6, '#6a5a4a')
    px(ctx, x + 1, 106, 4, 4, '#8a7a6a')
    px(ctx, x + 6, 112, 1, 8, '#6a5a4a')
  }, { wind: 0.4 }),

  sp('qz_startle', '놀라 퍼덕이는 새', 24, QZ_NEST, (ctx, env) => {
    const up = Math.sin(env.t * 12) > 0
    px(ctx, 156, 91, 8, 6, '#c8c4b4')
    px(ctx, 163, 88, 4, 4, '#c8c4b4')
    dot(ctx, 167, 89, '#e0a040')
    px(ctx, up ? 148 : 150, up ? 84 : 94, 9, 3, '#e8e4d8')
    px(ctx, up ? 162 : 161, up ? 82 : 94, 9, 3, '#e8e4d8')
    for (let k = 0; k < 3; k++) {
      const f = mod(env.t * 0.6 + k / 3, 1)
      px(ctx, 150 + k * 9 + f * 4, 98 + f * 30, 2, 1, '#c8c4b4')
    }
    for (let k = 0; k < 3; k++) px(ctx, 146 + k * 9, 78 - (k % 2) * 2, 3, 1, '#f4f0dc')
  }),
  sp('qz_sing', '노래하는 새', 24, QZ_NEST, (ctx, env) => {
    px(ctx, 158, 94, 5, 4, '#3a3a40')
    px(ctx, 162, 92, 3, 3, '#3a3a40')
    soundArcs(ctx, 166, 92, env.t, '#c8c4b0', 14)
  }),
  sp('qz_nest', '둥지를 짓는 새', 24, QZ_NEST, (ctx, env) => {
    px(ctx, 155, 96, 10, 4, '#6a5a3a')
    const f = mod(env.t * 0.3, 1)
    px(ctx, 130 + f * 26, 86 + f * 8, 5, 3, '#3a3a40')
    px(ctx, 128 + f * 26, 89 + f * 8, 4, 1, '#8a7a4a')
  }),

  sp('qz_alone', '창 안에 홀로 잠든 사람', 26, QZ_ROOM, (ctx) => {
    withAlpha(ctx, 0.5, () => px(ctx, 214, 118, 30, 20, '#c8c4a0'))
    px(ctx, 218, 132, 24, 3, '#6a5a44')
    px(ctx, 220, 129, 16, 3, '#4b5068')
    px(ctx, 236, 128, 4, 4, '#e6c39b')
    dot(ctx, 236, 128, '#1f1d22')
  }),
  sp('qz_friends', '술 마시는 두 벗', 26, QZ_ROOM, (ctx) => {
    withAlpha(ctx, 0.6, () => px(ctx, 214, 118, 30, 20, '#f4d488'))
    person(ctx, 218, 128, '#4b5068')
    person(ctx, 236, 128, '#7a4a3a')
    px(ctx, 226, 133, 6, 2, '#c8a868')
  }),
  sp('qz_read', '밤새 글 읽는 사람', 26, QZ_ROOM, (ctx, env) => {
    withAlpha(ctx, 0.6 + Math.sin(env.t * 5) * 0.05, () => px(ctx, 214, 118, 30, 20, '#f4d488'))
    person(ctx, 224, 128, '#4b5068', { bow: 1 })
    px(ctx, 230, 132, 7, 2, '#f4f0e0')
  }),
]

// ════════════════════════════════════════════════════════════
// 韋應物〈題桐葉〉: 오동나무와 옛 절
// ════════════════════════════════════════════════════════════
const TY_GROUND = 150
const TY_TRUNK = 96
/** 오동잎 하나: 들쭉날쭉한 다섯 갈래 */
function tongLeaf(ctx: Ctx, x: number, y: number, s: number, c: string, d: string) {
  disc(ctx, x, y, Math.round(4 * s), c)
  for (const [dx, dy] of [[-4, -3], [4, -3], [0, -5], [-5, 1], [5, 1]] as const) disc(ctx, x + dx * s, y + dy * s, Math.max(1, Math.round(2 * s)), c)
  px(ctx, x, y - 3 * s, 1, 6 * s, d)
}
const TY_LEAVES = Array.from({ length: 22 }, (_, i) => ({ x: TY_TRUNK - 46 + hash(i * 2.1) * 92, y: 38 + hash(i * 3.7) * 42 }))

export const tongyeBackground: Background = {
  id: 'hy036',
  drawBack(ctx) {
    sky(ctx, ['#c4d0c8', '#d0dace', '#dce2d2'], TY_GROUND)
    ridge(ctx, (x) => 116 + 6 * Math.sin(x * 0.025 + 1), '#a2b0a0', '#aebcac', 0, W, TY_GROUND)
    px(ctx, 0, TY_GROUND, W, H - TY_GROUND, '#a8a088')
    px(ctx, 0, TY_GROUND, W, 1, '#8a8470')
    // 옥처럼 매끈한 오동 줄기
    px(ctx, TY_TRUNK - 3, 70, 7, 80, '#9aa89a')
    px(ctx, TY_TRUNK - 3, 70, 2, 80, '#b8c4b4')
    for (const [dx, dy] of [[-24, 64], [20, 60], [-12, 52], [10, 46]] as const) {
      const n = Math.abs(dx)
      for (let i = 0; i < n; i++) px(ctx, TY_TRUNK + Math.sign(dx) * i, dy + 16 - i * 0.6, 2, 2, '#9aa89a')
    }
  },
  drawFront() {},
  drawDynamic() {},
}

const TY_TREE = { x: 24, y: 24, w: 144, h: 81 }
const TY_MEM = { x: 168, y: 62, w: 144, h: 81 }
const TY_LEAF = { x: 196, y: 96, w: 96, h: 54 }
const TY_MEM_DRAW = (inner: (ctx: Ctx) => void) => (ctx: Ctx) => vignette(ctx, 244, 112, 62, 40, inner)

export const TONGYE_SPRITES = [
  sp('ty_leaf', '오려 낸 푸른 비단 같은 오동잎', 22, TY_TREE, (ctx, env) => {
    TY_LEAVES.forEach((l, i) => tongLeaf(ctx, l.x + Math.sin(env.t + i) * 0.6, l.y, 1.3, i % 3 ? '#4f8a4a' : '#6aa458', '#3a6a36'))
  }),
  sp('ty_needle', '바늘 같은 솔잎', 22, TY_TREE, (ctx) => {
    TY_LEAVES.forEach((l, i) => {
      for (let k = -3; k <= 3; k++) px(ctx, l.x + k * 2, l.y - Math.abs(k), 1, 4, i % 2 ? '#2f5440' : '#4a7258')
    })
  }),
  sp('ty_lotus', '둥근 연잎', 22, TY_TREE, (ctx) => {
    TY_LEAVES.forEach((l, i) => disc(ctx, l.x, l.y, 5, i % 2 ? '#5a9a5a' : '#78b070'))
  }),

  sp('ty_canopy', '옥 가지를 시원스레 덮은 잎', 24, TY_TREE, (ctx, env) => {
    for (let k = 0; k < 16; k++) {
      const x = TY_TRUNK - 54 + k * 7
      const y = 34 + Math.abs(k - 8) * 2.4
      tongLeaf(ctx, x + Math.sin(env.t * 1.2 + k) * 1, y, 1.5, k % 2 ? '#3e7a3e' : '#5a9a50', '#2e5a2e')
    }
    withAlpha(ctx, 0.25, () => fillRows(ctx, TY_GROUND, TY_GROUND + 8, (y) => [TY_TRUNK - 50 + (y - TY_GROUND) * 2, TY_TRUNK + 50 - (y - TY_GROUND) * 2], '#3a4a2a'))
  }),
  sp('ty_wall', '돌담을 덮은 잎', 24, TY_TREE, (ctx) => {
    for (let k = 0; k < 8; k++) stone(ctx, 40 + k * 14, TY_GROUND, 6, '#b8b4a8', '#8a867a')
    for (let k = 0; k < 6; k++) tongLeaf(ctx, 44 + k * 18, TY_GROUND - 8, 1.1, '#5a9a50', '#2e5a2e')
  }),
  sp('ty_pond', '연못을 덮은 잎', 24, TY_TREE, (ctx) => {
    fillRows(ctx, TY_GROUND + 4, TY_GROUND + 18, (y) => [40 + (y - TY_GROUND) * 1.4, 150 - (y - TY_GROUND) * 1.4], '#6a9aa8')
    for (let k = 0; k < 5; k++) tongLeaf(ctx, 64 + k * 14, TY_GROUND + 10, 1, '#5a9a50', '#2e5a2e')
  }),

  sp('ty_temple', '예수 동쪽의 옛 절', 22, TY_MEM, TY_MEM_DRAW((ctx) => {
    px(ctx, 182, 134, 124, 24, '#c8c2a8')
    px(ctx, 214, 112, 60, 22, '#e6dfcc')
    roof(ctx, 210, 102, 68)
    px(ctx, 238, 118, 10, 16, '#6b4a32')
    fillRows(ctx, 140, 152, () => [190, 300], '#9ab4bc')
  })),
  sp('ty_palace', '궁궐 안뜰', 22, TY_MEM, TY_MEM_DRAW((ctx) => {
    px(ctx, 182, 134, 124, 24, '#d8d0b8')
    px(ctx, 206, 110, 76, 24, '#b8352a')
    roof(ctx, 202, 100, 84, '#c89a3a', '#e0b84a')
  })),
  sp('ty_boat', '강 위의 배', 22, TY_MEM, TY_MEM_DRAW((ctx) => {
    px(ctx, 182, 120, 124, 40, '#9ab4bc')
    px(ctx, 220, 124, 46, 4, '#5a3d28')
    px(ctx, 230, 118, 24, 6, '#3d3a32')
  })),

  sp('ty_write', '오동잎에 쓴 글씨', 26, TY_LEAF, (ctx) => {
    tongLeaf(ctx, 244, 122, 3.2, '#5a9a50', '#3e7a3e')
    for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) px(ctx, 236 + c * 6, 112 + r * 5, 3, 1, '#1f1d22')
    for (let r = 0; r < 4; r++) dot(ctx, 237 + (r % 3) * 6, 113 + r * 5, '#1f1d22')
    px(ctx, 270, 108, 1, 18, '#3a2a1c')
    px(ctx, 269, 106, 3, 3, '#1f1d22')
  }),
  sp('ty_fold', '잎을 접어 띄운 배', 26, TY_LEAF, (ctx) => {
    fillRows(ctx, 128, 132, (y) => [226 + (y - 128) * 2, 262 - (y - 128) * 2], '#5a9a50')
    px(ctx, 243, 118, 1, 10, '#3e7a3e')
    px(ctx, 210, 132, 76, 2, '#9ab4bc')
  }),
  sp('ty_burn', '잎을 모아 피운 불', 26, TY_LEAF, (ctx, env) => {
    for (let k = 0; k < 5; k++) px(ctx, 232 + k * 5, 132, 5, 3, '#8a6a3a')
    for (let k = 0; k < 4; k++) if (Math.sin(env.t * 8 + k) > -0.3) px(ctx, 236 + k * 5, 125 + (k % 2) * 2, 3, 6, k % 2 ? '#ffb040' : '#e8702a')
    for (let k = 0; k < 3; k++) {
      const f = mod(env.t * 0.4 + k / 3, 1)
      withAlpha(ctx, 0.5 * (1 - f), () => disc(ctx, 244 + f * 6, 120 - f * 20, 3 + f * 3, '#8a8a8a'))
    }
  }),
]

// ════════════════════════════════════════════════════════════
// 岑參〈題梁鍠城中高居〉: 성안 가장 높은 집
// ════════════════════════════════════════════════════════════
export const gaojuBackground: Background = {
  id: 'hy037',
  drawBack(ctx) {
    sky(ctx, ['#a8c0d0', '#bccede', '#d0dce2'], 120)
    // 여러 봉우리
    ridge(ctx, (x) => 40 + Math.abs(Math.sin(x * 0.03 + 0.5)) * 30 + 6 * Math.sin(x * 0.11), '#7a92a0', '#8aa2ae', 0, W, 130)
    ridge(ctx, (x) => 70 + Math.abs(Math.sin(x * 0.04 + 2)) * 20, '#6a8290', '#7a92a0', 0, W, 130)
    // 성안 아래쪽
    px(ctx, 0, 130, W, 50, '#a89c80')
    px(ctx, 120, 130, W - 120, 1, '#8a8070')
    // 높은 언덕 (왼쪽)
    fillRows(ctx, 70, H, (y) => [0, Math.min(150, 70 + (y - 70) * 1.1)], (y) => (y < 74 ? '#7a8a5a' : '#6a7450'))
    px(ctx, 0, 70, 70, 2, '#8a9a64')
  },
  drawFront() {},
  drawDynamic() {},
}

const GJ_TOP = { x: 0, y: 34, w: 128, h: 72 }
const GJ_CITY = { x: 120, y: 100, w: 144, h: 81 }
const GJ_HOUSE = { x: 8, y: 40, w: 96, h: 54 }
const GJ_WIDE = { x: 0, y: 20, w: 256, h: 144 }

/** 높은 집 (위치 x,y 는 지붕 왼쪽) */
function gjHouse(ctx: Ctx, x: number, y: number) {
  px(ctx, x + 2, y + 6, 40, 18, '#e6dfcc')
  roof(ctx, x, y, 44)
  px(ctx, x + 6, y + 10, 12, 8, '#c9b98f')
  for (let k = 0; k < 4; k++) px(ctx, x + 7 + k * 3, y + 10, 1, 8, '#6b4a32')
  px(ctx, x + 26, y + 12, 8, 12, '#6b4a32')
}

export const GAOJU_SPRITES = [
  sp('gj_top', '가장 높은 곳의 집', 12, GJ_TOP, (ctx) => gjHouse(ctx, 14, 46)),
  sp('gj_river', '강가 낮은 곳의 집', 12, GJ_CITY, (ctx) => {
    px(ctx, 120, 166, 200, 14, '#7a9aa8')
    gjHouse(ctx, 180, 142)
  }),
  sp('gj_alley', '좁은 골목 안 집', 12, GJ_CITY, (ctx) => {
    px(ctx, 160, 134, 10, 46, '#8a8072')
    px(ctx, 210, 134, 10, 46, '#8a8072')
    gjHouse(ctx, 168, 146)
  }),

  sp('gj_houses', '눈앞의 천 집', 14, GJ_CITY, (ctx) => {
    for (let r = 0; r < 5; r++)
      for (let c = 0; c < 11; c++) {
        const w = 10 + Math.round(hash(r * 17 + c) * 8)
        const x = 126 + c * 18 + (r % 2) * 9 + Math.round(hash(c * 5 + r) * 4)
        const y = 132 + r * 9
        if (hash(r * 3 + c * 7) < 0.12) {
          broadTree(ctx, x + 5, y + 8, 0.6, GREEN)
          continue
        }
        px(ctx, x + 1, y + 3, w - 2, 5, (r + c) % 2 ? '#d8d0bc' : '#e6dfcc')
        dot(ctx, x + w / 2, y + 5, '#6b4a32')
        px(ctx, x + 1, y, w - 2, 1, '#5a5e66')
        px(ctx, x - 1, y + 1, w + 2, 2, (r + c) % 3 ? '#4a4f57' : '#3c4048')
      }
  }),
  sp('gj_sea', '넓은 바다', 14, GJ_CITY, (ctx, env) => {
    px(ctx, 120, 130, 200, 50, '#5a8aa0')
    for (let k = 0; k < 20; k++) px(ctx, 120 + mod(hash(k) * 200 + env.t * 4, 200), 134 + hash(k * 3) * 44, 6, 1, '#a8c8d4')
  }),
  sp('gj_desert', '모래 사막', 14, GJ_CITY, (ctx) => {
    px(ctx, 120, 130, 200, 50, '#d8b880')
    for (let k = 0; k < 4; k++) fillRows(ctx, 140 + k * 9, 148 + k * 9, (y) => [130 + k * 40 - (y - 140 - k * 9) * 3, 170 + k * 40 + (y - 140 - k * 9) * 3], '#c8a46a')
  }),

  sp('gj_poem', '시를 짓고 술을 마시는 주인', 24, GJ_HOUSE, (ctx) => {
    seatFig(ctx, 60, 54, pal())
    px(ctx, 74, 64, 12, 6, '#f4f0e0')
    for (let k = 0; k < 3; k++) px(ctx, 76 + k * 3, 65, 1, 4, '#1f1d22')
    px(ctx, 52, 66, 4, 4, '#8a6a4a')
    px(ctx, 53, 64, 2, 2, '#6a4a32')
  }),
  sp('gj_chess', '장기 두는 주인', 24, GJ_HOUSE, (ctx) => {
    seatFig(ctx, 56, 54, pal())
    px(ctx, 72, 64, 12, 6, '#c8a868')
    for (let k = 0; k < 4; k++) dot(ctx, 74 + k * 3, 66, k % 2 ? '#b2352a' : '#1f1d22')
  }),
  sp('gj_farm', '밭 가는 주인', 24, GJ_HOUSE, (ctx, env) => {
    for (let k = 0; k < 4; k++) px(ctx, 60, 72 + k * 3, 40, 1, '#5a5a3a')
    standFig(ctx, 70 + Math.sin(env.t) * 6, 50, pal())
  }),

  sp('gj_sleep', '봉우리를 마주하고 잠든 주인', 28, GJ_WIDE, (ctx, env) => {
    px(ctx, 54, 68, 24, 2, '#6a5a44')
    px(ctx, 56, 65, 16, 3, '#4b5068')
    px(ctx, 72, 64, 4, 4, '#e6c39b')
    px(ctx, 50, 66, 4, 4, '#8a6a4a')
    for (let k = 0; k < 3; k++) {
      const f = mod(env.t * 0.4 + k / 3, 1)
      withAlpha(ctx, 1 - f, () => px(ctx, 80 + f * 8 + k * 2, 58 - f * 10 - k * 3, 3, 1, '#4a5a6a'))
    }
    for (let a = 0; a < 6; a++) dot(ctx, 90 + a * 22, 56 - a * 1.5, '#e8eef2')
  }),
  sp('gj_ride', '말 타고 떠나는 주인', 28, GJ_WIDE, (ctx, env) => {
    const x = 90 + mod(env.t * 8, 40)
    px(ctx, x, 104, 16, 6, '#6a4a32')
    px(ctx, x + 13, 98, 4, 7, '#6a4a32')
    for (const d of [1, 5, 10, 14]) px(ctx, x + d, 110, 1, 5, '#4a3424')
    person(ctx, x + 5, 95, '#4b5068')
  }),
  sp('gj_book', '등불 아래 책 읽는 주인', 28, GJ_WIDE, (ctx, env) => {
    withAlpha(ctx, 0.35, () => px(ctx, 0, 0, W, H, '#1a2038'))
    withAlpha(ctx, 0.35 + Math.sin(env.t * 5) * 0.05, () => disc(ctx, 64, 64, 12, '#ffd27a'))
    person(ctx, 60, 60, '#4b5068', { bow: 1 })
    px(ctx, 66, 66, 6, 2, '#f4f0e0')
  }),
]

// ════════════════════════════════════════════════════════════
// 岑參〈題三會寺蒼頡造字臺〉: 들판 절의 황폐한 누대
// ════════════════════════════════════════════════════════════
const CJ_GROUND = 132
/** 섬돌 계단 */
const CJ_STEPS = [0, 1, 2, 3].map((k) => ({ x: 150 - k * 4, y: 150 + k * 6, w: 80 + k * 8 }))

export const zaozitaiBackground: Background = {
  id: 'hy038',
  drawBack(ctx) {
    sky(ctx, ['#a0a4ac', '#b0b0b0', '#c4bcae', '#d0c4ac'], CJ_GROUND)
    ridge(ctx, (x) => 110 + 4 * Math.sin(x * 0.02), '#8a8a84', '#96968e', 0, W, CJ_GROUND)
    px(ctx, 0, CJ_GROUND, W, H - CJ_GROUND, '#8a8466')
    // 누대의 축대와 섬돌
    px(ctx, 140, 118, 104, 32, '#9a9284')
    for (let y = 122; y < 150; y += 6) px(ctx, 140, y, 104, 1, '#867e70')
    for (const s of CJ_STEPS) {
      px(ctx, s.x, s.y, s.w, 5, '#b4ac9c')
      px(ctx, s.x, s.y, s.w, 1, '#c8c0ae')
    }
  },
  drawFront() {},
  drawDynamic() {},
}

const CJ_TAI = { x: 120, y: 60, w: 144, h: 81 }
const CJ_TREE = { x: 0, y: 36, w: 128, h: 72 }
const CJ_STEP = { x: 140, y: 140, w: 72, h: 40 }

export const ZAOZITAI_SPRITES = [
  sp('cj_ruin', '허물어진 누대', 12, CJ_TAI, (ctx) => {
    for (const x of [150, 178, 206, 232]) px(ctx, x, x === 206 ? 104 : 92, 4, x === 206 ? 14 : 26, '#6a5a48')
    px(ctx, 146, 88, 50, 3, '#4a4a4a')
    for (let k = 0; k < 6; k++) px(ctx, 196 + k * 7, 90 + k * 4, 6, 2, '#4a4a4a')
    for (let k = 0; k < 8; k++) px(ctx, 150 + hash(k) * 86, 114 + hash(k * 3) * 4, 3, 2, '#5a5a5a')
    for (let k = 0; k < 20; k++) dot(ctx, 142 + hash(k * 5) * 100, 116 + hash(k * 7) * 3, '#7a8a4a')
  }),
  sp('cj_new', '새로 단청한 누대', 12, CJ_TAI, (ctx) => {
    px(ctx, 148, 92, 88, 26, '#b8352a')
    for (let x = 150; x < 236; x += 12) px(ctx, x, 92, 3, 26, '#2a6a5a')
    roof(ctx, 144, 82, 96, '#2e5a6a', '#3e7a8a')
  }),
  sp('cj_crowd', '사람으로 북적이는 누대', 12, CJ_TAI, (ctx, env) => {
    for (const x of [150, 178, 206, 232]) px(ctx, x, 92, 4, 26, '#6b4a32')
    roof(ctx, 144, 82, 96)
    for (let k = 0; k < 8; k++) person(ctx, 150 + k * 11, 108 - (Math.sin(env.t * 3 + k) > 0.6 ? 1 : 0), OTHER_PALS[k % 4].R)
  }),

  sp('cj_oldtree', '차가운 하늘의 앙상한 고목', 20, CJ_TREE, (ctx, env) => {
    px(ctx, 56, 64, 6, CJ_GROUND - 64, '#3e3228')
    const br: [number, number, number, number][] = [[58, 70, -28, -20], [60, 76, 30, -24], [58, 90, -22, -10], [60, 86, 26, -6], [42, 56, -10, -12], [82, 58, 12, -10]]
    for (const [x, y, dx, dy] of br) for (let i = 0; i <= 20; i++) px(ctx, x + (dx * i) / 20, y + (dy * i) / 20, 2, 2, '#3e3228')
    bird(ctx, 30 + Math.sin(env.t * 0.3) * 20, 44, Math.floor(env.t * 4) % 2, '#3a3a40')
  }),
  sp('cj_peach', '꽃 핀 복숭아나무', 20, CJ_TREE, (ctx) => broadTree(ctx, 58, CJ_GROUND, 2.2, { dark: '#c86a8a', base: '#e48aa4', light: '#f4b8c8' })),
  sp('cj_bamboo', '푸른 대숲', 20, CJ_TREE, (ctx, env) => {
    for (let k = 0; k < 10; k++) bamboo(ctx, 14 + k * 10, CJ_GROUND, 50 + (k % 3) * 8, Math.sin(env.t + k), env.t)
  }),

  sp('cj_tracks', '빈 섬돌의 새 발자국', 24, CJ_STEP, (ctx, env) => {
    for (let k = 0; k < 7; k++) {
      const s = CJ_STEPS[k % 4]
      const x = s.x + 8 + k * 8
      const y = s.y + 2
      dot(ctx, x, y + 1, '#4a3a2a')
      dot(ctx, x - 1, y, '#4a3a2a')
      dot(ctx, x + 1, y, '#4a3a2a')
      dot(ctx, x, y - 1, '#4a3a2a')
    }
    const hop = Math.abs(Math.sin(env.t * 3)) * 3
    px(ctx, 204, 144 - hop, 5, 4, '#6a5a4a')
    px(ctx, 208, 142 - hop, 3, 3, '#6a5a4a')
  }),
  sp('cj_leaves', '섬돌에 쌓인 낙엽', 24, CJ_STEP, (ctx) => {
    for (let k = 0; k < 24; k++) {
      const s = CJ_STEPS[k % 4]
      px(ctx, s.x + 4 + hash(k * 3) * (s.w - 8), s.y + 1 + (k % 2), 3, 2, k % 3 ? '#b8762a' : '#8a5a2a')
    }
  }),
  sp('cj_shoes', '벗어 둔 신발', 24, CJ_STEP, (ctx) => {
    px(ctx, 170, 152, 6, 3, '#2a2622')
    px(ctx, 178, 152, 6, 3, '#2a2622')
  }),

  sp('cj_glyph', '글자처럼 보이는 발자국', 30, CJ_STEP, (ctx, env) => {
    const a = 0.45 + Math.sin(env.t * 1.5) * 0.25
    withAlpha(ctx, a, () => {
      const g = [[0, 0, 7, 1], [3, 0, 1, 9], [0, 4, 7, 1], [1, 8, 5, 1]]
      for (let k = 0; k < 3; k++) for (const [x, y, w, h] of g) px(ctx, 160 + k * 18 + x, 156 + (k % 2) * 6 + y, w, h, '#2a1a10')
    })
  }),
  sp('cj_map', '길을 그린 지도', 30, CJ_STEP, (ctx) => {
    px(ctx, 162, 150, 40, 22, '#e8dcb8')
    for (let i = 0; i < 36; i++) dot(ctx, 164 + i, 160 + Math.sin(i * 0.3) * 6, '#b2352a')
  }),
  sp('cj_painting', '산수를 그린 그림', 30, CJ_STEP, (ctx) => {
    px(ctx, 162, 148, 40, 26, '#f0e8d0')
    ridge(ctx, (x) => 164 + Math.sin(x * 0.3) * 4, '#5a6a62', undefined, 164, 200, 172)
  }),
]

