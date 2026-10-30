// 『唐詩畫意』 卷八 첫 묶음 (3): 王維〈左掖梨花〉〈闕題〉, 裴迪 輞川集 다섯 수
import type { Background } from '../types'
import { H, W, disc, dot, fillRows, hash, mod, px } from '../pixel'
import type { Ctx } from '../pixel'
import { AUTUMN, GREEN, bird, broadTree, hut, mistBands, person, pine, rain, ridge, sky, snowfall, stars, veil, withAlpha } from '../kit'
import { OTHER_PALS, POET_PAL, drawFigure, pal, standFig } from '../figures'
import { cattails, drift, duck, grasses, gull, shimmer, skiff, soundArcs, sp, stone, sun, water } from './hy_kit'

// ════════════════════════════════════════════════════════════
// 王維〈左掖梨花〉: 관청 뜰의 배나무, 섬돌, 발을 드리운 전각
// ════════════════════════════════════════════════════════════
const ZY_GROUND = 132
const PEAR = { x: 214, y: 128 }

export const zuoyeBackground: Background = {
  id: 'hy010',
  drawBack(ctx) {
    sky(ctx, ['#d8dce4', '#e0e2e6', '#e8e8e6'], ZY_GROUND)
    // 담장
    px(ctx, 0, 92, W, 40, '#c9bfa5')
    px(ctx, 0, 88, W, 4, '#5a5f66')
    fillRows(ctx, ZY_GROUND, H, () => [0, W], (y) => ((y - ZY_GROUND) % 9 === 0 ? '#a8a08c' : '#bab29c'))
  },
  drawFront(ctx) {
    // 전각 (왼쪽)
    px(ctx, 0, 60, 132, 6, '#3c4048')
    px(ctx, 8, 54, 116, 6, '#4a4f57')
    px(ctx, 6, 66, 120, 66, '#b2352a')
    px(ctx, 14, 72, 104, 50, '#3a2a20')
    for (let k = 0; k < 4; k++) px(ctx, 10 + k * 36, 66, 4, 66, '#7a2a20')
    // 섬돌 (階)
    for (let k = 0; k < 4; k++) px(ctx, 30 - k * 4, ZY_GROUND + k * 4, 72 + k * 8, 4, k % 2 ? '#c8c2b2' : '#d8d2c2')
    // 섬돌가 풀
    for (let i = 0; i < 30; i++) dot(ctx, 108 + hash(i) * 60, ZY_GROUND + 4 + hash(i * 3) * 30, '#7a9a5a')
    // 배나무
    px(ctx, PEAR.x, PEAR.y - 44, 4, 44, '#4a3a2a')
    px(ctx, PEAR.x - 16, PEAR.y - 40, 20, 2, '#4a3a2a')
    px(ctx, PEAR.x + 2, PEAR.y - 50, 22, 2, '#4a3a2a')
    // 꽃 덩이: 그늘진 아랫면 위에 흰 꽃을 겹쳐 하늘과 구별되게 한다
    const blobs: [number, number, number][] = [[-22, -50, 9], [-6, -60, 12], [12, -62, 11], [28, -52, 9], [4, -46, 10], [-14, -42, 7], [20, -42, 7]]
    for (const [dx, dy, r] of blobs) disc(ctx, PEAR.x + dx, PEAR.y + dy + 2, r, '#b8beae')
    for (const [dx, dy, r] of blobs) disc(ctx, PEAR.x + dx, PEAR.y + dy, r, (yy) => (yy > r * 0.3 ? '#dcdcd0' : '#f8f6f0'))
    for (let i = 0; i < 70; i++) {
      const a = hash(i * 1.3) * 6.28
      const r = Math.sqrt(hash(i * 2.7)) * 30
      dot(ctx, PEAR.x + 2 + Math.cos(a) * r * 1.3, PEAR.y - 54 + Math.sin(a) * r * 0.7, i % 3 ? '#9aac7e' : '#c8b048')
    }
  },
  drawDynamic(ctx, env) {
    drift(ctx, env.t, { x: 180, y: 70, w: 80, h: 60 }, 6, '#f8f6f0', 0.3, 9)
  },
}

const ZY_STEPS = { x: 60, y: 112, w: 128, h: 68 }
const ZY_HALL = { x: 0, y: 56, w: 144, h: 81 }
const ZY_BIRD = { x: 176, y: 40, w: 128, h: 72 }
const ZY_FAR = { x: 112, y: 0, w: 128, h: 72 }

/** 꾀꼬리 (날개 접은 모습 / 나는 모습) */
function oriole(ctx: Ctx, x: number, y: number, t: number, flying = false, color = '#e0b030') {
  px(ctx, x - 2, y - 2, 6, 3, color)
  px(ctx, x + 3, y - 4, 3, 3, color)
  dot(ctx, x + 6, y - 3, '#d06a2a')
  dot(ctx, x + 4, y - 3, '#1f1d22')
  if (flying) {
    const up = Math.sin(t * 10) > 0
    px(ctx, x - 1, up ? y - 6 : y + 1, 4, 3, '#2a2622')
  } else px(ctx, x - 1, y - 1, 3, 1, '#2a2622')
  px(ctx, x - 4, y - 1, 2, 2, '#2a2622')
}

export const ZUOYE_SPRITES = [
  sp('zy_steps', '섬돌가에 흩날린 꽃잎', 21, ZY_STEPS, (ctx, env) => {
    for (let i = 0; i < 40; i++) px(ctx, 90 + hash(i * 1.9) * 90, ZY_GROUND + 2 + hash(i * 4.1) * 40, 2, 1, '#fbfaf4')
    drift(ctx, env.t, { x: 100, y: 110, w: 80, h: 50 }, 8, '#fbfaf4', 0.2, 4)
  }),
  sp('zy_pond', '연못 위의 꽃잎', 21, ZY_STEPS, (ctx) => {
    fillRows(ctx, 150, 172, (y) => [96 + Math.abs(y - 161) * 2, 180 - Math.abs(y - 161) * 2], '#7a9aa8')
    for (let i = 0; i < 12; i++) px(ctx, 110 + hash(i) * 60, 154 + hash(i * 3) * 14, 2, 1, '#fbfaf4')
  }),
  sp('zy_roof', '지붕 위의 꽃잎', 21, ZY_HALL, (ctx) => {
    for (let i = 0; i < 30; i++) px(ctx, 6 + hash(i * 2.3) * 120, 54 + hash(i * 5.7) * 10, 2, 1, '#fbfaf4')
  }),

  sp('zy_blind', '발 밖 바람에 나는 꽃잎', 22, ZY_HALL, (ctx, env) => {
    for (let y = 72; y < 116; y++) px(ctx, 14, y, 104, 1, y % 3 ? '#c9b77a' : '#a8965a')
    const sway = Math.sin(env.t * 1.2) * 2
    px(ctx, 14 + sway, 116, 104, 2, '#8a7a4a')
    for (let i = 0; i < 12; i++) {
      const f = mod(env.t * 0.15 + i / 12, 1)
      px(ctx, 120 + f * 100, 80 + i * 3 + Math.sin(env.t * 2 + i) * 5, 2, 1, '#fbfaf4')
    }
  }),
  sp('zy_stream', '시냇물을 따라가는 꽃잎', 22, ZY_HALL, (ctx, env) => {
    fillRows(ctx, 150, 158, () => [0, 150], '#7a9aa8')
    for (let i = 0; i < 10; i++) px(ctx, mod(hash(i) * 150 + env.t * 10, 150), 152 + (i % 3) * 2, 2, 1, '#fbfaf4')
  }),
  sp('zy_smoke', '굴뚝 연기 속 꽃잎', 22, ZY_HALL, (ctx, env) => {
    px(ctx, 100, 36, 8, 20, '#6a6458')
    withAlpha(ctx, 0.5, () => {
      for (let k = 0; k < 8; k++) {
        const f = mod(env.t * 0.3 + k / 8, 1)
        disc(ctx, 104 + Math.sin(f * 6 + k) * 4 + f * 20, 34 - f * 30, 2 + Math.round(f * 4), '#e8e8e4')
      }
    })
  }),

  sp('zy_oriole', '꽃잎과 노는 꾀꼬리', 30, ZY_BIRD, (ctx, env) => {
    const a = env.t * 0.9
    const x = 214 + Math.cos(a) * 30
    const y = 76 + Math.sin(a * 2) * 10
    oriole(ctx, x, y, env.t, true)
    px(ctx, x + 8 + Math.sin(env.t * 3) * 2, y - 2, 2, 1, '#fbfaf4')
  }),
  sp('zy_crow', '까마귀', 30, ZY_BIRD, (ctx, env) => {
    const x = 214 + Math.cos(env.t * 0.9) * 30
    const y = 76 + Math.sin(env.t * 1.8) * 10
    oriole(ctx, x, y, env.t, true, '#1f1d22')
  }),
  sp('zy_crane', '학', 30, ZY_BIRD, (ctx) => {
    px(ctx, 230, 70, 1, 14, '#2a2622')
    px(ctx, 233, 70, 1, 14, '#2a2622')
    px(ctx, 224, 60, 14, 10, '#f8f6f0')
    px(ctx, 222, 64, 4, 6, '#1f1d22')
    px(ctx, 236, 46, 2, 14, '#f8f6f0')
    px(ctx, 236, 44, 5, 2, '#f8f6f0')
    dot(ctx, 237, 43, '#c0302a')
  }),

  sp('zy_palace', '궁궐로 드는 꾀꼬리', 12, ZY_FAR, (ctx, env) => {
    for (let k = 0; k < 3; k++) {
      const x = 136 + k * 30
      const y = 40 - k * 6
      px(ctx, x, y, 28, 3, '#4a4f57')
      px(ctx, x + 3, y + 3, 22, 12, '#b2352a')
      px(ctx, x - 2, y + 2, 32, 1, '#3c4048')
    }
    const f = mod(env.t * 0.12, 1)
    oriole(ctx, 200 - f * 40, 70 - f * 34, env.t, true)
  }),
  sp('zy_field', '들판의 둥지', 12, ZY_FAR, (ctx, env) => {
    px(ctx, 120, 60, 110, 12, '#9aac7e')
    px(ctx, 170, 54, 16, 5, '#8a6a42')
    const f = mod(env.t * 0.12, 1)
    oriole(ctx, 200 - f * 30, 30 + f * 20, env.t, true)
  }),
  sp('zy_village', '강 건너 마을', 12, ZY_FAR, (ctx, env) => {
    px(ctx, 120, 58, 110, 5, '#8aaab4')
    hut(ctx, 140, 40)
    hut(ctx, 172, 42)
    const f = mod(env.t * 0.12, 1)
    oriole(ctx, 210 - f * 30, 36 - f * 6, env.t, true)
  }),
]

// ════════════════════════════════════════════════════════════
// 王維〈闕題〉(山中): 겨울 산골짜기와 형계(荊溪)
// ════════════════════════════════════════════════════════════
const sz = (x: number) => 150 + Math.sin(x * 0.03) * 6 // 시내 윗선

export const shanzhongBackground: Background = {
  id: 'hy011',
  drawBack(ctx) {
    sky(ctx, ['#c6ccd2', '#cfd3d4', '#d8d8d2'], 90)
    ridge(ctx, (x) => 40 + 18 * Math.sin(x * 0.02 + 0.6) + 5 * Math.sin(x * 0.09), '#6a7468', '#78827a')
    ridge(ctx, (x) => 76 + 12 * Math.sin(x * 0.03 + 2) + 4 * Math.sin(x * 0.11), '#525c50', '#5e685c')
  },
  drawFront(ctx) {
    // 앙상한 나무들 (붉은 잎은 2구 정답이 단다)
    for (let i = 0; i < 9; i++) {
      const x = 170 + i * 16
      const y = 86 + Math.sin(x * 0.03 + 2) * 12 + 12
      px(ctx, x, y - 16, 1, 16, '#3a3028')
      px(ctx, x - 4, y - 12, 4, 1, '#3a3028')
      px(ctx, x + 1, y - 10, 4, 1, '#3a3028')
    }
    // 산길
    for (let x = 0; x < 180; x += 2) px(ctx, x, 132 - x * 0.18 + Math.sin(x * 0.08) * 2, 2, 2, '#8a8070')
    // 시내
    for (let x = 0; x < W; x++) px(ctx, x, sz(x), 1, H - sz(x), x % 9 === 0 ? '#5e7a84' : '#6a8890')
  },
  drawDynamic(ctx, env) {
    shimmer(ctx, env.t, 156, 176, 16, '#c8d8dc')
  },
}

const SZ_STREAM = { x: 20, y: 120, w: 192, h: 60 }
const SZ_SLOPE = { x: 150, y: 50, w: 170, h: 96 }
const SZ_SKY = { x: 0, y: 0, w: 320, h: 180 }
const SZ_PATH = { x: 40, y: 70, w: 144, h: 81 }

const szTrees = (k: number) => {
  const x = 170 + k * 16
  return { x, y: 86 + Math.sin(x * 0.03 + 2) * 12 + 12 }
}
/** 길 위의 나그네 */
function traveler(ctx: Ctx, env: Parameters<typeof drawFigure>[4]) {
  drawFigure(ctx, 96, 92, POET_PAL, env)
}

export const SHANZHONG_SPRITES = [
  sp('sz_stones', '드러난 흰 돌', 24, SZ_STREAM, (ctx) => {
    for (let i = 0; i < 9; i++) stone(ctx, 30 + i * 20 + hash(i) * 6, 164 + (i % 3) * 4, 4 + Math.round(hash(i * 2) * 3), '#f2f0e8', '#c8c6bc')
  }),
  sp('sz_fish', '물고기 떼', 24, SZ_STREAM, (ctx, env) => {
    for (let i = 0; i < 6; i++) {
      const x = 40 + mod(hash(i) * 160 + env.t * 8, 160)
      px(ctx, x, 162 + (i % 3) * 4, 5, 2, '#9a8a6a')
    }
  }),
  sp('sz_ferry', '나룻배', 24, SZ_STREAM, (ctx, env) => skiff(ctx, 110, 166, env.t, { len: 26 })),

  sp('sz_sparse', '드문드문 남은 붉은 잎', 22, SZ_SLOPE, (ctx) => {
    for (let k = 0; k < 9; k++) {
      const { x, y } = szTrees(k)
      for (let j = 0; j < 3; j++) dot(ctx, x - 3 + hash(k * 3 + j) * 7, y - 18 + hash(k + j * 5) * 8, '#c0402a')
    }
  }),
  sp('sz_full', '온 산이 붉음', 22, SZ_SLOPE, (ctx) => {
    for (let k = 0; k < 9; k++) {
      const { x, y } = szTrees(k)
      disc(ctx, x, y - 18, 6, AUTUMN.base)
      disc(ctx, x - 1, y - 20, 3, AUTUMN.light)
    }
  }),
  sp('sz_green', '아직 푸른 잎', 22, SZ_SLOPE, (ctx) => {
    for (let k = 0; k < 9; k++) {
      const { x, y } = szTrees(k)
      disc(ctx, x, y - 18, 6, GREEN.base)
      disc(ctx, x - 1, y - 20, 3, GREEN.light)
    }
  }),

  sp('sz_clear', '비 없는 산길', 4, SZ_SKY, (ctx) => {
    sky(ctx, ['#a8c4d8', '#bcd2e0', '#d0dee4'], 90)
    sun(ctx, 60, 22, 7, '#f4e0a0', '#fff6d8')
    ridge(ctx, (x) => 40 + 18 * Math.sin(x * 0.02 + 0.6) + 5 * Math.sin(x * 0.09), '#6a7468', '#78827a')
    ridge(ctx, (x) => 76 + 12 * Math.sin(x * 0.03 + 2) + 4 * Math.sin(x * 0.11), '#525c50', '#5e685c')
  }),
  sp('sz_rain', '장대비', 46, SZ_SKY, (ctx, env) => {
    veil(ctx, 0.2, '#4a5660')
    rain(ctx, env.t, 130, 170, 'rgba(210,222,230,0.75)', 6, -1)
  }),
  sp('sz_blizzard', '눈보라', 46, SZ_SKY, (ctx, env) => {
    veil(ctx, 0.25, '#e8eef2')
    snowfall(ctx, env.t, 120)
  }),

  sp('sz_haze', '옷을 적시는 푸른 기운', 40, SZ_PATH, (ctx, env) => {
    traveler(ctx, env)
    ctx.save()
    ctx.beginPath()
    ctx.rect(20, 70, 180, 70)
    ctx.clip()
    mistBands(ctx, env.t, [84, 94, 104, 114, 124], '#7ab89a', 0.45)
    ctx.restore()
    for (let k = 0; k < 4; k++) dot(ctx, 100 + k * 3, 108 + mod(env.t + k / 4, 1) * 6, '#8ac4a8')
  }),
  sp('sz_splash', '튀어 오른 냇물', 40, SZ_PATH, (ctx, env) => {
    traveler(ctx, env)
    for (let k = 0; k < 6; k++) {
      const f = mod(env.t + k / 6, 1)
      dot(ctx, 104 + k * 2, 114 - Math.sin(f * Math.PI) * 14, '#d8e8ec')
    }
  }),
  sp('sz_drip', '나뭇잎의 빗방울', 40, SZ_PATH, (ctx, env) => {
    traveler(ctx, env)
    px(ctx, 80, 70, 40, 6, '#4f6b44')
    for (let k = 0; k < 5; k++) dot(ctx, 86 + k * 7, 76 + mod(env.t * 1.2 + k / 5, 1) * 24, '#a8c4dc')
  }),
]

// ════════════════════════════════════════════════════════════
// 裴迪〈鹿柴〉: 王維 〈鹿柴〉의 배경(luzhai)을 함께 쓴다
// ════════════════════════════════════════════════════════════
const PL_SKY = { x: 0, y: 0, w: 320, h: 120 }
const PL_PATH = { x: 80, y: 96, w: 144, h: 81 }
const PL_WOOD = { x: 176, y: 80, w: 144, h: 81 }
const PL_FLOOR = { x: 16, y: 124, w: 144, h: 56 }

export const PEI_LUZHAI_SPRITES = [
  sp('pl_cold', '차가운 저녁 산', 4, PL_SKY, (ctx) => {
    sky(ctx, ['#8a94a8', '#9aa2b2', '#aab0ba', '#c2b8b0'], 96)
    sun(ctx, 250, 88, 6, '#e8a070', '#f0c0a0')
    ridge(ctx, (x) => 46 + 14 * Math.sin(x * 0.022 + 0.5) + 6 * Math.sin(x * 0.07) + hash(x) * 1.5, '#6a7284', '#7a8294', 0, W, 100)
    ridge(ctx, (x) => 66 + 10 * Math.sin(x * 0.03 + 2) + 4 * Math.sin(x * 0.11) + hash(x + 5) * 1.5, '#4e5a62', '#5a6670', 0, W, 100)
    ridge(ctx, (x) => 86 + 6 * Math.sin(x * 0.04 + 1) + hash(x + 9) * 2, '#36443e', undefined, 0, W, 100)
  }),
  sp('pl_spring', '따뜻한 봄 들판', 4, PL_SKY, (ctx) => {
    sky(ctx, ['#b8d4e0', '#c8dce4', '#d8e4e0'], 96)
    ridge(ctx, (x) => 46 + 14 * Math.sin(x * 0.022 + 0.5) + 6 * Math.sin(x * 0.07), '#8ab07a', '#9ac08a', 0, W, 100)
    for (let i = 0; i < 60; i++) dot(ctx, hash(i * 3.3) * W, 60 + hash(i * 1.1) * 36, '#f0b0c0')
    ridge(ctx, (x) => 86 + 6 * Math.sin(x * 0.04 + 1) + hash(x + 9) * 2, '#6a9a5a', undefined, 0, W, 100)
  }),
  sp('pl_stars', '별이 가득한 밤하늘', 4, PL_SKY, (ctx, env) => {
    sky(ctx, ['#1c2238', '#222a44', '#2a3250'], 96)
    stars(ctx, 50, 11, 0, 70, env.t)
    ridge(ctx, (x) => 46 + 14 * Math.sin(x * 0.022 + 0.5) + 6 * Math.sin(x * 0.07), '#1e2630', '#262e3a', 0, W, 100)
    ridge(ctx, (x) => 86 + 6 * Math.sin(x * 0.04 + 1) + hash(x + 9) * 2, '#161c24', undefined, 0, W, 100)
  }),

  sp('pl_alone', '홀로 가는 나그네', 40, PL_PATH, (ctx, env) => {
    const x = 120 + mod(env.t * 3, 50)
    drawFigure(ctx, Math.round(x), 126, POET_PAL, env)
  }),
  sp('pl_friends', '벗과 나란히 걷는 사람', 40, PL_PATH, (ctx, env) => {
    const x = 110 + mod(env.t * 3, 50)
    drawFigure(ctx, Math.round(x), 126, POET_PAL, env)
    drawFigure(ctx, Math.round(x) + 16, 126, OTHER_PALS[0], env)
  }),
  sp('pl_retinue', '말 탄 행렬', 40, PL_PATH, (ctx, env) => {
    for (let k = 0; k < 3; k++) {
      const x = 100 + k * 30 + mod(env.t * 6, 20)
      px(ctx, x, 140, 16, 6, '#6b4a32')
      px(ctx, x + 14, 136, 3, 6, '#6b4a32')
      for (let j = 0; j < 4; j++) px(ctx, x + 1 + j * 4, 146, 1, 6, '#4a3220')
      person(ctx, x + 5, 131, ['#7a4a3a', '#4f6b4a', '#6b5a7a'][k])
    }
  }),

  sp('pl_unknown', '알 수 없는 깊은 숲', 20, PL_WOOD, (ctx, env) => {
    withAlpha(ctx, 0.5, () => fillRows(ctx, 96, 142, (y) => [196 - (y - 96) * 0.3, 300 + (y - 96) * 0.2], '#101814'))
    ctx.save()
    ctx.beginPath()
    ctx.rect(180, 90, 140, 56)
    ctx.clip()
    mistBands(ctx, env.t, [104, 116, 128], '#c8ccc4', 0.45)
    ctx.restore()
  }),
  sp('pl_hunters', '떠들썩한 사냥꾼들', 20, PL_WOOD, (ctx, env) => {
    for (let k = 0; k < 3; k++) {
      const x = 210 + k * 26
      person(ctx, x, 126, '#7a5a3a')
      px(ctx, x + 4, 124, 1, 8, '#5a4632')
      soundArcs(ctx, x + 2, 120, env.t + k, '#f4efe2', 10)
    }
  }),
  sp('pl_bell', '절의 종소리', 20, PL_WOOD, (ctx, env) => {
    px(ctx, 230, 108, 40, 3, '#4a4f57')
    px(ctx, 234, 111, 32, 14, '#c9bfa5')
    px(ctx, 246, 114, 8, 11, '#6b4a32')
    soundArcs(ctx, 250, 100, env.t, '#f4efe2', 30)
  }),

  sp('pl_tracks', '사슴 발자국', 30, PL_FLOOR, (ctx) => {
    for (let k = 0; k < 9; k++) {
      const x = 30 + k * 13
      const y = 160 + (k % 2) * 6 - k * 1.2
      px(ctx, x, y, 1, 3, '#9a8a64')
      px(ctx, x + 2, y, 1, 3, '#9a8a64')
    }
  }),
  sp('pl_tiger', '호랑이 발자국', 30, PL_FLOOR, (ctx) => {
    for (let k = 0; k < 6; k++) {
      const x = 34 + k * 20
      const y = 160 + (k % 2) * 6
      disc(ctx, x, y, 2, '#9a8a64')
      for (let j = 0; j < 4; j++) dot(ctx, x - 3 + j * 2, y - 4, '#9a8a64')
    }
  }),
  sp('pl_shoes', '사람의 신발 자국', 30, PL_FLOOR, (ctx) => {
    for (let k = 0; k < 7; k++) {
      const x = 32 + k * 16
      const y = 160 + (k % 2) * 6
      px(ctx, x, y, 3, 6, '#9a8a64')
    }
  }),
]

// ════════════════════════════════════════════════════════════
// 裴迪〈欒家瀨〉: 물이 흐르는 여울과 남쪽 나루 (배경 hy013)
// 배경이 물을 매 프레임 그리므로 정답 레이어는 모두 z ≥ 20 이다
// ════════════════════════════════════════════════════════════
const PJ_ALL = { x: 0, y: 40, w: 320, h: 140 }
const PJ_BANK = { x: 0, y: 96, w: 160, h: 84 }
const PJ_WATER = { x: 96, y: 96, w: 144, h: 81 }
const PJ_NEAR = { x: 0, y: 110, w: 128, h: 70 }

export const PEI_LUANJIALAI_SPRITES = [
  sp('pj_loud', '먼 물가까지 울리는 여울 소리', 24, PJ_ALL, (ctx, env) => {
    for (const [x, y] of [[176, 112], [150, 132], [210, 92]] as const) soundArcs(ctx, x, y, env.t + x * 0.01, '#f8f4ea', 60)
  }),
  sp('pj_quiet', '고요한 여울', 24, PJ_ALL, (ctx) => {
    fillRows(ctx, 60, H, (y) => {
      const f = (y - 60) / 120
      return [200 - f * 170, 270 - f * 120]
    }, '#7a9aa0')
  }),
  sp('pj_bell', '종소리', 24, PJ_ALL, (ctx, env) => {
    px(ctx, 270, 58, 34, 3, '#4a4f57')
    px(ctx, 274, 61, 26, 12, '#c9bfa5')
    soundArcs(ctx, 287, 54, env.t, '#f8f4ea', 40)
  }),

  sp('pj_ferry', '남쪽 나루로 가는 길', 32, PJ_BANK, (ctx, env) => {
    const f = mod(env.t * 0.05, 1)
    drawFigure(ctx, Math.round(120 - f * 60), Math.round(118 + f * 20), POET_PAL, env, { flip: true })
  }),
  sp('pj_climb', '산꼭대기로 오르는 사람', 32, PJ_BANK, (ctx, env) => {
    const f = mod(env.t * 0.05, 1)
    person(ctx, 60 + f * 40, 80 - f * 30, POET_PAL.R)
  }),
  sp('pj_home', '집 안으로 드는 사람', 32, PJ_BANK, (ctx, env) => {
    hut(ctx, 96, 110)
    person(ctx, 102 + Math.sin(env.t) * 2, 117, POET_PAL.R)
  }),

  sp('pj_birds', '떠서 건너는 물새', 28, PJ_WATER, (ctx, env) => {
    for (let k = 0; k < 5; k++) {
      const x = 120 + mod(k * 22 + env.t * 4, 100)
      const y = 120 + (k % 3) * 10
      if (k % 2) gull(ctx, x, y)
      else duck(ctx, x, y)
    }
  }),
  sp('pj_leaves', '떠내려가는 낙엽', 28, PJ_WATER, (ctx, env) => {
    for (let k = 0; k < 10; k++) {
      const f = mod(env.t * 0.08 + k / 10, 1)
      px(ctx, 220 - f * 110, 100 + f * 60 + (k % 3) * 3, 3, 2, AUTUMN.base)
    }
  }),
  sp('pj_raft', '통나무 뗏목', 28, PJ_WATER, (ctx, env) => {
    const f = mod(env.t * 0.05, 1)
    for (let k = 0; k < 4; k++) px(ctx, 200 - f * 60, 120 + f * 30 + k * 2, 26, 2, k % 2 ? '#6a5236' : '#7a6242')
  }),

  sp('pj_near', '다가오는 물새', 36, PJ_NEAR, (ctx, env) => {
    for (let k = 0; k < 3; k++) {
      const f = (Math.sin(env.t * 0.4 + k) + 1) / 2
      duck(ctx, 60 + k * 14 + f * 10, 160 + (k % 2) * 6)
    }
  }),
  sp('pj_flee', '멀리 달아나는 물새', 36, PJ_NEAR, (ctx, env) => {
    for (let k = 0; k < 4; k++) {
      const f = mod(env.t * 0.2 + k / 4, 1)
      bird(ctx, 70 + f * 120, 150 - f * 100, Math.floor(env.t * 8 + k) % 2, '#4a4a46')
    }
  }),
  sp('pj_dive', '물속으로 숨는 물새', 36, PJ_NEAR, (ctx, env) => {
    for (let k = 0; k < 3; k++) {
      const f = mod(env.t * 0.5 + k / 3, 1)
      withAlpha(ctx, 1 - f, () => px(ctx, 60 + k * 18 - f * 6, 166, 6 + f * 12, 1, '#eef4f0'))
    }
  }),
]

// ════════════════════════════════════════════════════════════
// 裴迪〈金屑泉〉: 이끼 낀 바위 사이의 샘
// ════════════════════════════════════════════════════════════
const POOL = { cx: 160, cy: 132, rx: 52, ry: 16 }
const poolRows = (y: number): [number, number] => {
  const d = (y - POOL.cy) / POOL.ry
  const w = POOL.rx * Math.sqrt(Math.max(0, 1 - d * d))
  return [POOL.cx - w, POOL.cx + w]
}

export const jinxiequanBackground: Background = {
  id: 'hy014',
  drawBack(ctx) {
    sky(ctx, ['#b4c0c4', '#c0c8c8', '#ccd0cc'], 80)
    ridge(ctx, (x) => 50 + 10 * Math.sin(x * 0.025 + 1), '#6a7a6a', '#788878')
    for (let i = 0; i < 10; i++) pine(ctx, 10 + i * 32, 98 + (i % 2) * 4, 0.9)
    fillRows(ctx, 96, H, () => [0, W], (y) => (y < 120 ? '#5e6a4e' : '#545e46'))
  },
  drawFront(ctx) {
    // 샘을 두른 바위
    for (let a = 0; a < Math.PI * 2; a += 0.35) {
      const x = POOL.cx + Math.cos(a) * (POOL.rx + 6)
      const y = POOL.cy + Math.sin(a) * (POOL.ry + 5)
      stone(ctx, x, y + 4, 5, '#8a8a78', '#6a6a5a')
      dot(ctx, x - 2, y - 1, '#7a9a5a')
    }
    // 샘 바닥 (1구 정답이 물을 채운다)
    fillRows(ctx, POOL.cy - POOL.ry, POOL.cy + POOL.ry, poolRows, '#4a4a3c')
  },
  drawDynamic() {},
}

const PQ_POOL = { x: 96, y: 96, w: 128, h: 72 }
const PQ_ALL = { x: 0, y: 0, w: 320, h: 180 }
const PQ_EDGE = { x: 184, y: 84, w: 112, h: 63 }

export const JINXIEQUAN_SPRITES = [
  sp('pq_still', '맑게 고인 샘', 21, PQ_POOL, (ctx, env) => {
    fillRows(ctx, POOL.cy - POOL.ry + 2, POOL.cy + POOL.ry - 1, poolRows, (y) => (y < POOL.cy ? '#7aa0a0' : '#6a9090'))
    const f = mod(env.t * 0.15, 1)
    withAlpha(ctx, 0.6 * (1 - f), () => px(ctx, POOL.cx - 10 - f * 30, POOL.cy, 20 + f * 60, 1, '#c8dcd8'))
  }),
  sp('pq_gush', '콸콸 솟는 샘', 21, PQ_POOL, (ctx, env) => {
    fillRows(ctx, POOL.cy - POOL.ry + 2, POOL.cy + POOL.ry - 1, poolRows, '#6a9090')
    for (let k = 0; k < 14; k++) {
      const f = mod(env.t * 1.5 + k / 14, 1)
      dot(ctx, POOL.cx + (k - 7) * 2, POOL.cy - Math.sin(f * Math.PI) * 22, '#e8f2f2')
    }
  }),
  sp('pq_frozen', '얼어붙은 샘', 21, PQ_POOL, (ctx) => {
    fillRows(ctx, POOL.cy - POOL.ry + 2, POOL.cy + POOL.ry - 1, poolRows, '#d8e8ee')
    px(ctx, POOL.cx - 30, POOL.cy - 4, 40, 1, '#a8c0c8')
    px(ctx, POOL.cx - 4, POOL.cy + 4, 30, 1, '#a8c0c8')
  }),

  sp('pq_gold', '금빛으로 반짝이는 바닥', 22, PQ_POOL, (ctx, env) => {
    for (let k = 0; k < 26; k++) {
      const y = POOL.cy - POOL.ry + 4 + hash(k * 2.3) * (POOL.ry * 2 - 8)
      const [a, b] = poolRows(y)
      const on = Math.sin(env.t * 3 + k * 1.3) > 0
      dot(ctx, a + 4 + hash(k * 5.1) * (b - a - 8), y, on ? '#f4d070' : k % 2 ? '#6aa890' : '#c8a040')
    }
  }),
  sp('pq_mud', '흙탕물', 22, PQ_POOL, (ctx) => {
    withAlpha(ctx, 0.7, () => fillRows(ctx, POOL.cy - POOL.ry + 2, POOL.cy + POOL.ry - 1, poolRows, '#8a7a5a'))
  }),
  sp('pq_leaves', '샘을 덮은 낙엽', 22, PQ_POOL, (ctx) => {
    for (let k = 0; k < 20; k++) {
      const y = POOL.cy - POOL.ry + 3 + hash(k * 2.3) * (POOL.ry * 2 - 6)
      const [a, b] = poolRows(y)
      px(ctx, a + 3 + hash(k * 4.1) * (b - a - 6), y, 3, 2, k % 2 ? AUTUMN.base : AUTUMN.dark)
    }
  }),

  sp('pq_dawn', '새벽빛을 머금은 샘', 2, PQ_ALL, (ctx) => {
    sky(ctx, ['#d8dce8', '#e8e4e8', '#f4ece2'], 80)
    withAlpha(ctx, 0.35, () => fillRows(ctx, POOL.cy - POOL.ry, POOL.cy + POOL.ry, poolRows, '#f8f6f0'))
    withAlpha(ctx, 0.25, () => disc(ctx, 40, 20, 40, '#ffffff'))
  }),
  sp('pq_sunset', '저녁노을', 2, PQ_ALL, (ctx) => {
    sky(ctx, ['#c890a0', '#e0a088', '#f0b878'], 80)
    sun(ctx, 270, 70, 8, '#f09050', '#ffc890')
    withAlpha(ctx, 0.3, () => fillRows(ctx, POOL.cy - POOL.ry, POOL.cy + POOL.ry, poolRows, '#f0a070'))
  }),
  sp('pq_dark', '캄캄한 어둠', 50, PQ_ALL, (ctx) => {
    veil(ctx, 0.6, '#0e121c')
  }),

  sp('pq_draw', '아침 물 긷기', 36, PQ_EDGE, (ctx, env) => {
    const dip = Math.sin(env.t * 1.2) > 0
    standFig(ctx, 212, 110, pal(), true)
    px(ctx, 206, dip ? 132 : 124, 6, 5, '#8a6a42')
    px(ctx, 208, 118, 1, dip ? 14 : 6, '#5a4632')
  }),
  sp('pq_fish', '낚싯대를 드리운 사람', 36, PQ_EDGE, (ctx, env) => {
    standFig(ctx, 212, 110, pal(), true)
    for (let k = 0; k < 16; k++) dot(ctx, 210 - k, 116 + k * 0.4, '#5a4632')
    px(ctx, 194, 122, 1, 10 + Math.sin(env.t) * 2, '#d8d4c8')
  }),
  sp('pq_wash', '빨래하는 사람', 36, PQ_EDGE, (ctx, env) => {
    standFig(ctx, 212, 110, pal(), true)
    const k = Math.sin(env.t * 4) > 0 ? 1 : 0
    px(ctx, 200, 128 + k, 12, 3, '#e8e2d0')
  }),
]

// ════════════════════════════════════════════════════════════
// 裴迪〈白石灘〉: 흰 돌이 깔린 얕은 여울
// ════════════════════════════════════════════════════════════
const PB_WATER = 104

export const baishitanBackground: Background = {
  id: 'hy015',
  drawBack(ctx) {
    sky(ctx, ['#c8cfd4', '#d2d6d6', '#dcdcd6'], PB_WATER)
    ridge(ctx, (x) => 78 + 8 * Math.sin(x * 0.02 + 0.3) + 3 * Math.sin(x * 0.08), '#8a988e', '#98a69c', 0, W, PB_WATER)
    px(ctx, 0, PB_WATER - 4, W, 4, '#8a9070')
    water(ctx, PB_WATER, H, '#a8c0c0', '#8aa8aa', '#d0e0dc')
    for (let i = 0; i < 26; i++) stone(ctx, hash(i * 3.7) * W, PB_WATER + 14 + hash(i * 1.9) * 64, 3 + Math.round(hash(i) * 4), '#f4f2ea', '#cecabe')
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    shimmer(ctx, env.t, PB_WATER + 4, 176, 20, '#eef4f0')
  },
}

const PB_MAN = { x: 80, y: 90, w: 128, h: 72 }
const PB_HANDS = { x: 96, y: 120, w: 112, h: 60 }
const PB_ALL = { x: 0, y: 0, w: 320, h: 180 }
const PB_SKY = { x: 0, y: 0, w: 320, h: 90 }

export const BAISHITAN_SPRITES = [
  sp('pb_stone', '흰 돌 위의 시인', 30, PB_MAN, (ctx, env) => {
    stone(ctx, 136, 150, 9, '#f4f2ea', '#cecabe')
    drawFigure(ctx, 128, 120, POET_PAL, env)
  }),
  sp('pb_bridge', '돌다리 위의 사람', 30, PB_MAN, (ctx, env) => {
    for (let x = 80; x < 200; x++) px(ctx, x, 132 - Math.sin(((x - 80) / 120) * Math.PI) * 10, 1, 4, '#a8a08c')
    drawFigure(ctx, 132, 100, POET_PAL, env)
  }),
  sp('pb_boat', '나룻배 위의 사람', 30, PB_MAN, (ctx, env) => {
    skiff(ctx, 140, 150, env.t, { rower: false, len: 30 })
    drawFigure(ctx, 132, 126, POET_PAL, env)
  }),

  sp('pb_play', '물결 희롱', 34, PB_HANDS, (ctx, env) => {
    for (let k = 0; k < 8; k++) {
      const f = mod(env.t * 1.3 + k / 8, 1)
      dot(ctx, 150 + Math.cos(k) * f * 14, 152 - Math.sin(f * Math.PI) * 10, '#f4f8f6')
    }
    for (let k = 0; k < 2; k++) {
      const f = mod(env.t * 0.6 + k / 2, 1)
      withAlpha(ctx, 1 - f, () => px(ctx, 146 - f * 10, 156, 10 + f * 20, 1, '#f4f8f6'))
    }
  }),
  sp('pb_net', '그물 던지기', 34, PB_HANDS, (ctx) => {
    for (let k = 0; k < 7; k++) {
      px(ctx, 140 + k * 6, 146, 1, 16, '#5a5a4a')
      px(ctx, 140, 146 + k * 2.5, 36, 1, '#5a5a4a')
    }
  }),
  sp('pb_throw', '멀리 던진 돌', 34, PB_HANDS, (ctx, env) => {
    const f = mod(env.t * 0.5, 1)
    disc(ctx, 150 + f * 60, 140 - Math.sin(f * Math.PI) * 30, 2, '#cecabe')
    if (f > 0.9) px(ctx, 206, 160, 8, 1, '#f4f8f6')
  }),

  sp('pb_cold', '싸늘해진 냇가', 50, PB_ALL, (ctx) => {
    veil(ctx, 0.22, '#4a5a78')
    sun(ctx, 260, PB_WATER - 8, 6, '#e8b080', '#f0c8a0')
  }),
  sp('pb_hot', '무더운 냇가', 50, PB_ALL, (ctx, env) => {
    veil(ctx, 0.12, '#f0b040')
    sun(ctx, 160, 22, 12, '#f8d060')
    for (let k = 0; k < 8; k++) px(ctx, 20 + k * 40, PB_WATER - 6 + Math.sin(env.t * 4 + k) * 2, 14, 1, 'rgba(255,240,200,0.6)')
  }),
  sp('pb_lantern', '등불 밝힌 냇가', 50, PB_ALL, (ctx, env) => {
    veil(ctx, 0.2, '#2a2a3a')
    for (let k = 0; k < 6; k++) {
      const x = 20 + k * 54
      px(ctx, x, PB_WATER - 14, 1, 10, '#3a2a1a')
      const on = Math.sin(env.t * 5 + k) > -0.5
      px(ctx, x - 2, PB_WATER - 18, 5, 4, on ? '#ffcf6a' : '#f0a845')
      withAlpha(ctx, 0.15, () => disc(ctx, x, PB_WATER - 16, 6, '#ffd27a'))
    }
  }),

  sp('pb_pale', '빛 잃은 뜬구름', 8, PB_SKY, (ctx, env) => {
    withAlpha(ctx, 0.55, () => {
      const o = Math.sin(env.t * 0.15) * 10
      for (const [x, y, w] of [[40, 26, 70], [150, 18, 90], [236, 32, 60]] as const) {
        px(ctx, x + o, y, w, 3, '#eef0f0')
        px(ctx, x + 10 + o, y - 2, w - 20, 2, '#eef0f0')
      }
    })
  }),
  sp('pb_red', '붉은 노을', 8, PB_SKY, (ctx, env) => {
    const o = Math.sin(env.t * 0.15) * 10
    for (const [x, y, w] of [[40, 26, 70], [150, 18, 90], [236, 32, 60]] as const) {
      px(ctx, x + o, y, w, 3, '#e87a5a')
      px(ctx, x + 10 + o, y - 2, w - 20, 2, '#f0a070')
    }
  }),
  sp('pb_dark', '먹구름', 8, PB_SKY, (ctx, env) => {
    const o = Math.sin(env.t * 0.15) * 10
    for (const [x, y, w] of [[20, 20, 110], [130, 14, 120], [230, 26, 90]] as const) {
      px(ctx, x + o, y, w, 8, '#5a5e66')
      px(ctx, x + 10 + o, y - 4, w - 20, 4, '#6a6e76')
    }
  }),
]

// ════════════════════════════════════════════════════════════
// 裴迪〈北垞〉: 王維 〈北垞〉의 배경(hy008)을 함께 쓴다
// ════════════════════════════════════════════════════════════
const PT_MT = { x: 40, y: 0, w: 240, h: 135 }
const PT_HOUSE = { x: 0, y: 92, w: 144, h: 81 }
const PT_MAN = { x: 64, y: 100, w: 128, h: 72 }
const PT_BOAT = { x: 160, y: 108, w: 160, h: 72 }

/** 집이 앉을 호숫가 땅 */
function ptLand(ctx: Ctx) {
  // 언덕은 오른쪽에서 비스듬히 물가로 내려간다 (깎아지른 절벽처럼 끊기지 않게)
  ridge(ctx, (x) => (x < 150 ? 132 - 10 * Math.sin((x / 180) * Math.PI) : Math.min(H, 127 + (x - 150) ** 1.35 * 0.5)), '#6e7e56', '#86966a')
}

export const PEI_BEITUO_SPRITES = [
  sp('pt_mountain', '언덕 위로 솟은 남산', 4, PT_MT, (ctx) => {
    ridge(ctx, (x) => 18 + Math.abs(x - 160) * 0.35 + 4 * Math.sin(x * 0.08), '#6a8070', '#7a9080', 40, 280, 54)
  }),
  sp('pt_tower', '높은 탑', 4, PT_MT, (ctx) => {
    for (let k = 0; k < 7; k++) {
      const w = 18 - k * 2
      px(ctx, 160 - w / 2, 50 - k * 6, w, 2, '#4a4f57')
      px(ctx, 160 - w / 2 + 2, 52 - k * 6, w - 4, 4, '#c9bfa5')
    }
  }),
  sp('pt_gate', '큰 성문', 4, PT_MT, (ctx) => {
    px(ctx, 120, 34, 80, 18, '#8a8072')
    px(ctx, 148, 40, 24, 12, '#3a2a20')
    px(ctx, 116, 30, 88, 4, '#4a4f57')
  }),

  sp('pt_house', '호숫가의 집', 14, PT_HOUSE, (ctx) => {
    ptLand(ctx)
    hut(ctx, 40, 108)
    broadTree(ctx, 24, 124, 0.8, GREEN)
  }),
  sp('pt_cave', '바위 동굴', 14, PT_HOUSE, (ctx) => {
    ptLand(ctx)
    stone(ctx, 60, 128, 16, '#8a8678', '#6a665a')
    disc(ctx, 60, 124, 5, '#24221e')
  }),
  sp('pt_tent', '들판의 천막', 14, PT_HOUSE, (ctx) => {
    ptLand(ctx)
    fillRows(ctx, 106, 124, (y) => [56 - (y - 106) * 0.8, 56 + (y - 106) * 0.8], '#d8cfba')
    px(ctx, 55, 102, 2, 6, '#5a4632')
  }),

  sp('pt_firewood', '나무하러 가는 길', 30, PT_MAN, (ctx, env) => {
    const x = 92 + Math.sin(env.t * 0.3) * 8
    standFig(ctx, Math.round(x), 110, pal())
    px(ctx, Math.round(x) - 3, 112, 8, 2, '#8a6a42')
    px(ctx, Math.round(x) - 2, 114, 7, 2, '#7a5a3a')
    px(ctx, Math.round(x) + 2, 110, 1, 14, '#5a4632')
  }),
  sp('pt_fishing', '낚시하러 가는 길', 30, PT_MAN, (ctx, env) => {
    const x = 92 + Math.sin(env.t * 0.3) * 8
    standFig(ctx, Math.round(x), 110, pal())
    for (let k = 0; k < 18; k++) dot(ctx, Math.round(x) + 12 + k, 112 - k * 0.6, '#5a4632')
  }),
  sp('pt_market', '장 보러 가는 길', 30, PT_MAN, (ctx, env) => {
    const x = 92 + Math.sin(env.t * 0.3) * 8
    standFig(ctx, Math.round(x), 110, pal())
    px(ctx, Math.round(x) + 10, 122, 8, 6, '#a8965a')
    px(ctx, Math.round(x) + 11, 120, 6, 2, '#8a7a4a')
  }),

  sp('pt_skiff', '물풀 사이로 나가는 배', 26, PT_BOAT, (ctx, env) => {
    cattails(ctx, 180, 310, 176, env, 14, 18)
    grasses(ctx, 176, 316, 178, env, '#7a9a4a', 30, 10)
    skiff(ctx, 236 + Math.sin(env.t * 0.2) * 10, 160, env.t, { len: 26 })
  }),
  sp('pt_horse', '말 타고 큰길로', 26, PT_BOAT, (ctx, env) => {
    const x = 200 + mod(env.t * 8, 90)
    // 큰길이 놓인 물가 둑
    ridge(ctx, (x) => (x < 168 ? H : 147 + 2 * Math.sin(x * 0.05)), '#6e7e56', '#86966a', 160, W)
    px(ctx, 170, 152, 150, 4, '#a8987a')
    px(ctx, x, 138, 16, 6, '#6b4a32')
    px(ctx, x + 14, 134, 3, 6, '#6b4a32')
    for (let j = 0; j < 4; j++) px(ctx, x + 1 + j * 4, 144, 1, 6, '#4a3220')
    person(ctx, x + 5, 129, POET_PAL.R)
  }),
  sp('pt_bridge', '걸어서 다리를 건넘', 26, PT_BOAT, (ctx, env) => {
    // 다리 건너편 기슭
    ridge(ctx, (x) => (x < 298 ? H : 150 - (x - 298) * 0.3), '#6e7e56', '#86966a', 290, W)
    for (let x = 180; x < 310; x++) px(ctx, x, 150 - Math.sin(((x - 180) / 130) * Math.PI) * 12, 1, 4, '#a8a08c')
    const f = mod(env.t * 0.08, 1)
    const x = 186 + f * 110
    person(ctx, x, 140 - Math.sin(((x - 180) / 130) * Math.PI) * 12, POET_PAL.R)
  }),
]
