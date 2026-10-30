// 『唐詩畫意』 卷九 넷째 묶음 (1): 徐凝〈避暑〉, 杜牧〈獨酌〉〈題敬愛寺樓〉, 許渾〈雨後思湖上居〉, 李商隱〈樂遊原〉
import type { Background } from '../types'
import { H, W, disc, dot, hash, mod, px } from '../pixel'
import type { Ctx } from '../pixel'
import { boat, house, hut, mistBands, person, pine, rain, ridge, sky, snowfall, withAlpha } from '../kit'
import { OTHER_PALS, pal, seatFig, standFig } from '../figures'
import { drift, lotusFlower, lotusPad, mix, shimmer, soundArcs, sp, stone, sun, water } from './hy_kit'
import { vignette } from './hy_b3a'

const FULL = { x: 0, y: 0, w: 320, h: 180 }

/** 옆에서 본 작은 말 (x, y 는 발 가운데) */
function pony(ctx: Ctx, x: number, y: number, c = '#6a4a32') {
  px(ctx, x - 8, y - 9, 16, 6, c)
  px(ctx, x + 6, y - 14, 4, 7, c)
  px(ctx, x + 7, y - 16, 6, 3, c)
  for (const d of [-7, -4, 3, 6]) px(ctx, x + d, y - 3, 1, 3, mix(c, '#000000', 0.3))
  px(ctx, x - 10, y - 8, 2, 5, mix(c, '#000000', 0.3))
}

// ════════════════════════════════════════════════════════════
// 徐凝〈避暑〉: 긴 숲 그늘 아래의 노인
// ════════════════════════════════════════════════════════════
const BH_GROUND = 132
const BH_MAN = { x: 150, y: 114 }
const BH_TRUNKS = [20, 60, 100, 210, 250, 290]

export const bishuBackground: Background = {
  id: 'hy097',
  drawBack(ctx) {
    sky(ctx, ['#a8c8e0', '#bcd6e4', '#d0e2e6'], BH_GROUND)
    for (const x of BH_TRUNKS) px(ctx, x - 2, 60, 5, BH_GROUND - 60, '#4a3a2a')
    for (let k = 0; k < 26; k++) disc(ctx, hash(k * 2.1) * W, 40 + hash(k * 3.3) * 34, 14, k % 3 ? '#3e6a3a' : '#527e46')
    px(ctx, 0, BH_GROUND, W, H - BH_GROUND, '#7a9a5a')
    seatFig(ctx, BH_MAN.x, BH_MAN.y, pal({ K: '#a8a49a', H: '#c8c4b8', B: '#d8d4c8', R: '#d8d4c0', r: '#b8b4a0' }))
  },
  drawFront() {},
  drawDynamic() {},
}

const BH_MAN_F = { x: 112, y: 96, w: 96, h: 54 }
const BH_HEAD = { x: 128, y: 92, w: 64, h: 36 }
const BH_TREE = { x: 176, y: 60, w: 128, h: 72 }

export const BISHU_SPRITES = [
  sp('bh_mat', '서늘한 얼룩 대자리', 10, BH_MAN_F, (ctx, env) => {
    px(ctx, BH_MAN.x - 12, BH_MAN.y + 14, 40, 6, '#c8b878')
    for (let x = BH_MAN.x - 12; x < BH_MAN.x + 28; x += 3) px(ctx, x, BH_MAN.y + 14, 1, 6, '#a89858')
    for (let k = 0; k < 10; k++) dot(ctx, BH_MAN.x - 10 + hash(k * 3) * 36, BH_MAN.y + 15 + hash(k * 5) * 4, '#7a6a3a')
    withAlpha(ctx, 0.5, () => {
      for (let k = 0; k < 3; k++) px(ctx, BH_MAN.x - 8 + k * 14, BH_MAN.y + 12 - mod(env.t * 3 + k * 3, 8), 6, 1, '#e4f0f4')
    })
  }),
  sp('bh_quilt', '비단 이불', 10, BH_MAN_F, (ctx) => px(ctx, BH_MAN.x - 12, BH_MAN.y + 12, 40, 8, '#c84a5a')),
  sp('bh_fur', '털방석', 10, BH_MAN_F, (ctx) => px(ctx, BH_MAN.x - 8, BH_MAN.y + 12, 30, 8, '#8a6a4a')),

  sp('bh_cap', '시원한 뿔 모양 관', 22, BH_HEAD, (ctx) => {
    px(ctx, BH_MAN.x + 4, BH_MAN.y - 2, 6, 2, '#3a3a40')
    px(ctx, BH_MAN.x + 6, BH_MAN.y - 4, 2, 2, '#3a3a40')
    dot(ctx, BH_MAN.x + 3, BH_MAN.y - 3, '#3a3a40')
    dot(ctx, BH_MAN.x + 10, BH_MAN.y - 3, '#3a3a40')
  }),
  sp('bh_furhat', '털모자', 22, BH_HEAD, (ctx) => px(ctx, BH_MAN.x + 2, BH_MAN.y - 4, 10, 5, '#8a6a4a')),
  sp('bh_helmet', '투구', 22, BH_HEAD, (ctx) => {
    px(ctx, BH_MAN.x + 2, BH_MAN.y - 3, 10, 4, '#8a8478')
    px(ctx, BH_MAN.x + 6, BH_MAN.y - 7, 2, 4, '#a8382a')
  }),

  sp('bh_forest', '긴 숲 아래의 그늘', 6, FULL, (ctx) => {
    withAlpha(ctx, 0.3, () => px(ctx, 0, BH_GROUND, W, H - BH_GROUND, '#1e3a1e'))
    for (let k = 0; k < 14; k++) disc(ctx, k * 24, 22 + (k % 2) * 6, 16, k % 2 ? '#2e5a2e' : '#3e6a3a')
  }),
  sp('bh_swim', '강물 속', 6, FULL, (ctx) => px(ctx, 0, 150, W, 30, '#7aa0b0')),
  sp('bh_room', '방 안', 6, FULL, (ctx) => {
    px(ctx, 100, 70, 120, 6, '#3c4048')
    for (const x of [104, 214]) px(ctx, x, 76, 3, 56, '#6b4a32')
  }),

  sp('bh_cicada', '서늘한 매미 소리', 24, BH_TREE, (ctx, env) => {
    const x = BH_TRUNKS[3] + 3
    px(ctx, x, 90, 3, 5, '#3a2e22')
    px(ctx, x + 3, 90, 2, 6, 'rgba(220,230,230,0.7)')
    soundArcs(ctx, x + 1, 92, env.t * 2, '#2a3a2a', 20)
  }),
  sp('bh_frog', '개구리 소리', 24, BH_TREE, (ctx, env) => {
    px(ctx, 230, 136, 5, 3, '#5a8a3a')
    soundArcs(ctx, 232, 136, env.t, '#2a3a2a', 10)
  }),
  sp('bh_cuckoo', '뻐꾸기 소리', 24, BH_TREE, (ctx, env) => {
    px(ctx, 248, 70, 7, 4, '#6a6a72')
    soundArcs(ctx, 254, 70, env.t, '#2a3a2a', 14)
  }),
]

// ════════════════════════════════════════════════════════════
// 杜牧〈獨酌〉: 눈보라 치는 밤의 화로와 마음속 낚싯배
// ════════════════════════════════════════════════════════════
const DZ_FLOOR = 140
const DZ_WIN = { x: 26, y: 40, w: 62, h: 50 }
const DZ_MAN = { x: 100, y: 122 }
const DZ_VIG = { cx: 220, cy: 112, rx: 70, ry: 38 }

export const duzhuoBackground: Background = {
  id: 'hy098',
  drawBack(ctx) {
    px(ctx, 0, 0, W, DZ_FLOOR, '#5a4a3a')
    for (let x = 0; x < W; x += 40) px(ctx, x, 0, 2, DZ_FLOOR, '#4a3a2a')
    px(ctx, 0, DZ_FLOOR, W, H - DZ_FLOOR, '#6a5440')
    for (let x = 0; x < W; x += 16) px(ctx, x, DZ_FLOOR, 1, H - DZ_FLOOR, '#5a4636')
    px(ctx, DZ_WIN.x, DZ_WIN.y, DZ_WIN.w, DZ_WIN.h, '#1a2234')
    for (let x = DZ_WIN.x; x <= DZ_WIN.x + DZ_WIN.w; x += 10) px(ctx, x, DZ_WIN.y, 2, DZ_WIN.h, '#8a6a48')
    for (let y = DZ_WIN.y; y <= DZ_WIN.y + DZ_WIN.h; y += 12) px(ctx, DZ_WIN.x, y, DZ_WIN.w, 1, '#8a6a48')
    seatFig(ctx, DZ_MAN.x, DZ_MAN.y - 4, pal())
  },
  drawFront() {},
  drawDynamic() {},
}

const DZ_WIN_F = { x: 8, y: 24, w: 112, h: 81 }
const DZ_MAN_F = { x: 56, y: 96, w: 112, h: 63 }
const DZ_VIG_F = { x: 144, y: 70, w: 152, h: 86 }

export const DUZHUO_SPRITES = [
  sp('dz_snow', '창밖의 눈보라', 12, DZ_WIN_F, (ctx, env) => {
    ctx.save()
    ctx.beginPath()
    ctx.rect(DZ_WIN.x, DZ_WIN.y, DZ_WIN.w, DZ_WIN.h)
    ctx.clip()
    for (let i = 0; i < 50; i++) {
      const y = DZ_WIN.y + mod(hash(i * 3.1) * 60 + env.t * (20 + hash(i) * 20), 60)
      const x = DZ_WIN.x + mod(hash(i * 1.3) * 80 - env.t * 30 - (y - DZ_WIN.y) * 0.6, 80)
      px(ctx, x, y, 2, 1, '#f4f6f6')
    }
    ctx.restore()
    for (let x = DZ_WIN.x; x <= DZ_WIN.x + DZ_WIN.w; x += 10) px(ctx, x, DZ_WIN.y, 2, DZ_WIN.h, '#8a6a48')
    px(ctx, DZ_WIN.x, DZ_WIN.y + DZ_WIN.h - 2, DZ_WIN.w, 2, '#f4f6f6')
  }, { wind: 0.4 }),
  sp('dz_petals', '창밖의 꽃비', 12, DZ_WIN_F, (ctx, env) => drift(ctx, env.t, DZ_WIN, 16, '#f2b8c6', 0.4, 2)),
  sp('dz_sun', '창밖의 따스한 햇볕', 12, DZ_WIN_F, (ctx) => px(ctx, DZ_WIN.x + 2, DZ_WIN.y + 2, DZ_WIN.w - 4, DZ_WIN.h - 4, '#c8dce8')),

  sp('dz_stove', '화로를 끼고 연 술 항아리', 22, DZ_MAN_F, (ctx, env) => {
    const x = DZ_MAN.x + 22
    px(ctx, x, DZ_FLOOR - 8, 14, 8, '#4a3a2a')
    px(ctx, x + 1, DZ_FLOOR - 10, 12, 2, '#6a5a4a')
    for (let k = 0; k < 4; k++) if (Math.sin(env.t * 8 + k) > -0.3) px(ctx, x + 2 + k * 3, DZ_FLOOR - 12 - (k % 2), 2, 2, k % 2 ? '#ffb040' : '#e8702a')
    withAlpha(ctx, 0.25 + Math.sin(env.t * 4) * 0.04, () => disc(ctx, x + 7, DZ_FLOOR - 10, 22, '#ffb060'))
    px(ctx, DZ_MAN.x - 14, DZ_FLOOR - 12, 10, 12, '#8a5a3a')
    px(ctx, DZ_MAN.x - 13, DZ_FLOOR - 14, 8, 2, '#d8c8a0')
  }),
  sp('dz_book', '책 읽기', 22, DZ_MAN_F, (ctx) => px(ctx, DZ_MAN.x + 16, DZ_FLOOR - 8, 10, 4, '#f4f0e0')),
  sp('dz_go', '바둑 두기', 22, DZ_MAN_F, (ctx) => px(ctx, DZ_MAN.x + 16, DZ_FLOOR - 6, 14, 6, '#c8a868')),

  sp('dz_boat', '떠올린 빗속의 낚싯배', 24, DZ_VIG_F, (ctx, env) => vignette(ctx, DZ_VIG.cx, DZ_VIG.cy, DZ_VIG.rx, DZ_VIG.ry, (c) => {
    sky(c, ['#9aa4b0', '#aab2b8'], 112)
    ridge(c, (x) => 96 + 6 * Math.sin(x * 0.05), '#8a969a', undefined, 150, 290, 112)
    water(c, 112, 152, '#8a9ca8', '#6a7e8a', '#aab8c0', 150, 290)
    boat(c, DZ_VIG.cx, 130, { len: 38 })
    rain(c, env.t, 40, 100, 'rgba(120,130,145,0.8)', 4)
  })),
  sp('dz_horse', '말 타고 가는 길', 24, DZ_VIG_F, (ctx) => vignette(ctx, DZ_VIG.cx, DZ_VIG.cy, DZ_VIG.rx, DZ_VIG.ry, (c) => {
    px(c, 150, 126, 140, 30, '#a89a78')
    pony(c, DZ_VIG.cx, 132)
    person(c, DZ_VIG.cx - 2, 113, '#4b5068')
  })),
  sp('dz_palace', '궁궐 잔치', 24, DZ_VIG_F, (ctx) => vignette(ctx, DZ_VIG.cx, DZ_VIG.cy, DZ_VIG.rx, DZ_VIG.ry, (c) => {
    px(c, 180, 100, 80, 24, '#b8352a')
    px(c, 174, 92, 92, 8, '#c89a3a')
  })),

  sp('dz_sleep', '뜸 아래 가을 강의 잠', 26, DZ_VIG_F, (ctx, env) => {
    px(ctx, DZ_VIG.cx - 6, 122, 14, 3, '#4b5068')
    px(ctx, DZ_VIG.cx + 8, 121, 3, 3, '#e6c39b')
    for (let k = 0; k < 3; k++) {
      const f = mod(env.t * 0.4 + k / 3, 1)
      withAlpha(ctx, 1 - f, () => px(ctx, DZ_VIG.cx + 12 + f * 6 + k * 2, 116 - f * 10 - k * 3, 3, 1, '#4a5a6a'))
    }
  }),
  sp('dz_sing', '노래하기', 26, DZ_VIG_F, (ctx, env) => {
    for (let k = 0; k < 3; k++) {
      const f = mod(env.t * 0.5 + k / 3, 1)
      withAlpha(ctx, 1 - f, () => px(ctx, DZ_VIG.cx + 4 + f * 20, 116 - f * 16, 2, 3, '#4a3a2a'))
    }
  }),
  sp('dz_fish', '고기잡이', 26, DZ_VIG_F, (ctx) => {
    for (let i = 0; i < 24; i++) dot(ctx, DZ_VIG.cx + 10 + i, 118 - i * 0.3, '#5a4632')
  }),
]

// ════════════════════════════════════════════════════════════
// 杜牧〈題敬愛寺樓〉: 눈 덮인 천 산과 백 자 누각
// ════════════════════════════════════════════════════════════
const JA_GROUND = 146
const JA_TOWER = { x: 150, top: 40 }
const jaRidge1 = (x: number) => 70 + 18 * Math.sin(x * 0.03 + 1) + 6 * Math.sin(x * 0.11)
const jaRidge2 = (x: number) => 96 + 12 * Math.sin(x * 0.025 + 3) + 4 * Math.sin(x * 0.09)

export const jingaiBackground: Background = {
  id: 'hy099',
  drawBack(ctx) {
    sky(ctx, ['#8a8aa4', '#a49aa8', '#c4aca4', '#d8bca0'], JA_GROUND)
    ridge(ctx, jaRidge1, '#6a7082', '#7a8092', 0, W, JA_GROUND)
    ridge(ctx, jaRidge2, '#5a6070', '#6a7080', 0, W, JA_GROUND)
    px(ctx, 0, JA_GROUND, W, H - JA_GROUND, '#5a5a5a')
  },
  drawFront() {},
  drawDynamic() {},
}

const JA_TOWER_F = { x: 56, y: 30, w: 192, h: 120 }
const JA_TOP = { x: 120, y: 24, w: 64, h: 36 }

export const JINGAI_SPRITES = [
  sp('ja_snow', '저녁 풍경 속 천 산의 눈', 8, FULL, (ctx) => {
    for (let x = 0; x < W; x++) {
      const y1 = Math.round(jaRidge1(x))
      px(ctx, x, y1, 1, 4 + Math.round(hash(x) * 4), '#eef0f4')
      const y2 = Math.round(jaRidge2(x))
      px(ctx, x, y2, 1, 3 + Math.round(hash(x * 3) * 3), '#e4e8ee')
    }
    withAlpha(ctx, 0.3, () => px(ctx, 0, JA_GROUND, W, H - JA_GROUND, '#e4e8ee'))
  }),
  sp('ja_blossom', '꽃 핀 산', 8, FULL, (ctx) => {
    for (let k = 0; k < 60; k++) disc(ctx, hash(k * 2.1) * W, 100 + hash(k * 3.1) * 40, 2, '#f2b8c6')
  }),
  sp('ja_maple', '단풍 든 산', 8, FULL, (ctx) => {
    for (let k = 0; k < 60; k++) disc(ctx, hash(k * 2.1) * W, 100 + hash(k * 3.1) * 40, 2, '#c8502a')
  }),

  sp('ja_tower', '봄추위 속 백 자 누각', 14, JA_TOWER_F, (ctx) => {
    const { x, top } = JA_TOWER
    for (let k = 0; k < 5; k++) {
      const y = top + k * 21
      const w = 22 + k * 6
      px(ctx, x - w / 2, y + 5, w, 16, k % 2 ? '#c9bfa5' : '#d8d0bc')
      for (let c = -w / 2 + 3; c < w / 2; c += 6) px(ctx, x + c, y + 7, 1, 12, '#6b4a32')
      px(ctx, x - w / 2 - 4, y + 2, w + 8, 3, '#3c4048')
      px(ctx, x - w / 2 - 1, y, w + 2, 2, '#4a4f57')
    }
    px(ctx, x - 1, top - 6, 2, 6, '#3c4048')
    px(ctx, x - 26, JA_GROUND - 4, 52, 4, '#8a8274')
  }),
  sp('ja_hut', '낮은 초가', 14, JA_TOWER_F, (ctx) => hut(ctx, JA_TOWER.x - 10, JA_GROUND - 15)),
  sp('ja_bridge', '돌다리', 14, JA_TOWER_F, (ctx) => {
    for (let a = 0; a <= Math.PI; a += 0.02) px(ctx, JA_TOWER.x - Math.cos(a) * 40, JA_GROUND - Math.sin(a) * 10, 3, 3, '#8a8478')
  }),

  sp('ja_alone', '홀로 오르고 홀로 내려오는 사람', 22, JA_TOWER_F, (ctx, env) => {
    const f = mod(env.t * 0.05, 1)
    const up = f < 0.5
    const g = up ? f * 2 : 2 - f * 2
    const y = JA_GROUND - 22 - g * (JA_GROUND - JA_TOWER.top - 26)
    standFig(ctx, JA_TOWER.x + 20 - g * 14, y, pal(), !up)
  }),
  sp('ja_group', '여럿이 함께', 22, JA_TOWER_F, (ctx) => {
    for (let k = 0; k < 4; k++) person(ctx, JA_TOWER.x - 20 + k * 10, JA_GROUND - 10, OTHER_PALS[k].R)
  }),
  sp('ja_horse', '말 타고 가는 사람', 22, JA_TOWER_F, (ctx) => {
    pony(ctx, JA_TOWER.x + 30, JA_GROUND)
    person(ctx, JA_TOWER.x + 28, JA_GROUND - 19, '#4b5068')
  }),

  sp('ja_far', '아무도 모를 아득한 마음', 28, FULL, (ctx, env) => {
    withAlpha(ctx, 0.2, () => px(ctx, 0, 0, W, H, '#2a2a44'))
    withAlpha(ctx, 0.6, () => {
      for (let t = 0; t < 1; t += 0.01) if (Math.sin(t * 80 - env.t * 2) > 0.3) dot(ctx, JA_TOWER.x + 10 + t * 60, JA_TOWER.top - 4 - t * 30 + Math.sin(t * 9) * 3, '#f4ecd8')
    })
    mistBands(ctx, env.t * 0.4, [60, 80], '#e8e0e8', 0.35)
  }),
  sp('ja_laugh', '크게 웃는 사람', 28, JA_TOP, (ctx, env) => {
    for (let k = 0; k < 3; k++) px(ctx, JA_TOWER.x + 10 + k * 4, JA_TOWER.top - 4 - Math.abs(Math.sin(env.t * 3 + k)) * 4, 2, 2, '#f4d060')
  }),
  sp('ja_sleep', '졸음', 28, JA_TOP, (ctx, env) => {
    for (let k = 0; k < 3; k++) {
      const f = mod(env.t * 0.4 + k / 3, 1)
      withAlpha(ctx, 1 - f, () => px(ctx, JA_TOWER.x + 10 + f * 6 + k * 2, JA_TOWER.top - f * 10 - k * 3, 3, 1, '#4a5a6a'))
    }
  }),
]

// ════════════════════════════════════════════════════════════
// 許渾〈雨後思湖上居〉: 버들 아래 쉬는 길손과 남쪽 도랑
// ════════════════════════════════════════════════════════════
const HX_GROUND = 128
const HX_CANAL = 152
const HX_WILLOW = { x: 120, y: HX_GROUND }

export const yuhouBackground: Background = {
  id: 'hy100',
  drawBack(ctx) {
    sky(ctx, ['#b8c4cc', '#c8d0d2', '#d8dcd6'], HX_GROUND)
    ridge(ctx, (x) => 60 + 30 * Math.exp(-(((x - 90) / 70) ** 2)) * -1 + 40 + 6 * Math.sin(x * 0.05), '#7e9488', '#8aa094', 0, W, HX_GROUND)
    px(ctx, 0, HX_GROUND, W, HX_CANAL - HX_GROUND, '#8aa262')
    px(ctx, 0, HX_GROUND + 6, W, 6, '#b8aa86')
    water(ctx, HX_CANAL, H, '#8aa8a8', '#6a8a8c', '#b0c8c4')
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    shimmer(ctx, env.t, HX_CANAL + 3, 178, 10, '#d8e4e0')
  },
}

const HX_MT = { x: 0, y: 16, w: 192, h: 108 }
const HX_WILLOW_F = { x: 64, y: 80, w: 128, h: 72 }
const HX_CANAL_F = { x: 160, y: 120, w: 112, h: 60 }

export const YUHOU_SPRITES = [
  sp('hx_rain', '앞산의 서늘한 비바람', 6, HX_MT, (ctx, env) => {
    ctx.save()
    ctx.beginPath()
    ctx.rect(0, 20, 200, 100)
    ctx.clip()
    rain(ctx, env.t, 70, 120, 'rgba(150,165,180,0.7)', 5, -1.4)
    ctx.restore()
    mistBands(ctx, env.t, [60, 76, 92], '#d8e0e4', 0.45)
  }),
  sp('hx_sun', '따가운 햇볕', 6, HX_MT, (ctx) => sun(ctx, 60, 30, 8)),
  sp('hx_snow', '함박눈', 6, HX_MT, (ctx, env) => snowfall(ctx, env.t, 60)),

  sp('hx_willow', '늘어진 버들 아래 쉬는 길손', 20, HX_WILLOW_F, (ctx, env) => {
    px(ctx, HX_WILLOW.x - 2, HX_WILLOW.y - 46, 4, 46, '#5a4632')
    for (let k = 0; k < 16; k++) for (let i = 0; i < 32; i++) dot(ctx, HX_WILLOW.x - 24 + k * 3 + Math.sin(env.t + i * 0.2) * 1.5 * (i / 32), HX_WILLOW.y - 50 + i + Math.abs(k - 8), k % 2 ? '#7a9a50' : '#94b462')
    seatFig(ctx, HX_WILLOW.x - 22, HX_WILLOW.y - 16, pal())
    pony(ctx, HX_WILLOW.x + 26, HX_WILLOW.y)
    for (let i = 0; i < 12; i++) dot(ctx, HX_WILLOW.x + 2 + i * 1.4, HX_WILLOW.y - 20 + i * 0.6, '#8a7a5a')
  }),
  sp('hx_pine', '소나무 아래', 20, HX_WILLOW_F, (ctx) => {
    pine(ctx, HX_WILLOW.x, HX_WILLOW.y, 1.6)
    seatFig(ctx, HX_WILLOW.x - 22, HX_WILLOW.y - 16, pal())
  }),
  sp('hx_rock', '바위 위', 20, HX_WILLOW_F, (ctx) => {
    stone(ctx, HX_WILLOW.x, HX_WILLOW.y, 10, '#a8a49a', '#7e7a70')
    seatFig(ctx, HX_WILLOW.x - 6, HX_WILLOW.y - 26, pal())
  }),

  sp('hx_lotus', '남쪽 도랑에 지는 연꽃', 14, HX_CANAL_F, (ctx, env) => {
    for (let k = 0; k < 6; k++) {
      lotusPad(ctx, 172 + k * 16, 160 + (k % 2) * 8, 5)
      if (k % 2) lotusFlower(ctx, 174 + k * 16, 156 + (k % 2) * 8)
    }
    for (let k = 0; k < 6; k++) {
      const f = mod(env.t * 0.2 + k / 6, 1)
      px(ctx, 180 + k * 14 + f * 6, 150 + f * 20, 2, 1, '#f49aae')
    }
  }),
  sp('hx_plum', '매화', 14, HX_CANAL_F, (ctx) => {
    for (let k = 0; k < 8; k++) disc(ctx, 176 + k * 10, 146, 1, '#f8f0f0')
  }),
  sp('hx_mum', '국화', 14, HX_CANAL_F, (ctx) => {
    for (let k = 0; k < 8; k++) disc(ctx, 176 + k * 10, 146, 2, '#f0c838')
  }),

  sp('hx_scent', '향기로운 가을 물', 24, HX_CANAL_F, (ctx, env) => {
    for (let k = 0; k < 4; k++) {
      const f = mod(env.t * 0.3 + k / 4, 1)
      withAlpha(ctx, 0.6 * (1 - f), () => {
        for (let i = 0; i < 14; i++) dot(ctx, 176 + k * 22 + i * 1.5, 150 - f * 26 + Math.sin(i * 0.7 + env.t * 2 + k) * 2, '#f8d8e0')
      })
    }
  }),
  sp('hx_ice', '꽁꽁 언 도랑', 24, HX_CANAL_F, (ctx) => withAlpha(ctx, 0.7, () => px(ctx, 0, HX_CANAL, W, H - HX_CANAL, '#dce8ee'))),
  sp('hx_dry', '말라 버린 도랑', 24, HX_CANAL_F, (ctx) => px(ctx, 0, HX_CANAL, W, H - HX_CANAL, '#a89a7a')),
]

// ════════════════════════════════════════════════════════════
// 李商隱〈樂遊原〉: 옛 언덕의 석양
// ════════════════════════════════════════════════════════════
const LE_GROUND = 120
const leHill = (x: number) => 104 - 16 * Math.exp(-(((x - 170) / 70) ** 2))
const LE_SUN = { x: 250, y: 104 }

export const leyouBackground: Background = {
  id: 'hy101',
  drawBack(ctx) {
    sky(ctx, ['#a4acbc', '#b4b8c0', '#c4c4c0'], LE_GROUND)
    ridge(ctx, (x) => 108 + 4 * Math.sin(x * 0.04), '#8a8e94', '#94989e', 0, W, LE_GROUND)
    ridge(ctx, leHill, '#7a7a5e', '#8a8a6a', 0, W, H)
    px(ctx, 0, LE_GROUND, W, H - LE_GROUND, '#6e6e52')
    house(ctx, 18, 132)
  },
  drawFront() {},
  drawDynamic() {},
}

const LE_HOME = { x: 0, y: 108, w: 96, h: 54 }
const LE_HILL_F = { x: 104, y: 60, w: 128, h: 72 }

export const LEYOU_SPRITES = [
  sp('le_uneasy', '해 질 녘 편치 않은 마음', 22, LE_HOME, (ctx, env) => {
    standFig(ctx, 52, 124, pal())
    const f = mod(env.t * 0.4, 1)
    withAlpha(ctx, 1 - f, () => {
      for (let i = 0; i < 6; i++) dot(ctx, 66 + i + f * 6, 126 - f * 8 + Math.sin(i) * 1, '#d8d8e0')
    })
  }),
  sp('le_happy', '기쁘고 들뜬 마음', 22, LE_HOME, (ctx, env) => {
    standFig(ctx, 52, 124 - (Math.sin(env.t * 4) > 0 ? 2 : 0), pal())
  }),
  sp('le_sleep', '졸린 마음', 22, LE_HOME, (ctx, env) => {
    standFig(ctx, 52, 124, pal())
    for (let k = 0; k < 3; k++) {
      const f = mod(env.t * 0.4 + k / 3, 1)
      withAlpha(ctx, 1 - f, () => px(ctx, 66 + f * 6 + k * 2, 120 - f * 10 - k * 3, 3, 1, '#4a5a6a'))
    }
  }),

  sp('le_cart', '수레 몰아 오른 옛 언덕', 24, LE_HILL_F, (ctx) => {
    const x = 160
    const y = Math.round(leHill(x))
    pony(ctx, x + 22, y)
    px(ctx, x - 8, y - 12, 18, 8, '#8a5a3a')
    px(ctx, x - 9, y - 14, 20, 2, '#5a3a2a')
    disc(ctx, x, y - 3, 4, '#3a2a1c')
    px(ctx, x + 10, y - 8, 8, 1, '#5a3a2a')
    person(ctx, x - 2, y - 22, '#4b5068')
  }),
  sp('le_walk', '걸어서 강가로', 24, LE_HILL_F, (ctx) => {
    px(ctx, 104, 128, 128, 8, '#8ab4c0')
    person(ctx, 160, 116, '#4b5068')
  }),
  sp('le_boat', '배를 띄움', 24, LE_HILL_F, (ctx) => {
    px(ctx, 104, 126, 128, 10, '#8ab4c0')
    boat(ctx, 168, 130, { len: 22 })
  }),

  sp('le_sunset', '한없이 좋은 석양', 4, FULL, (ctx) => {
    sky(ctx, ['#6a5a8a', '#c86a7a', '#f0905a', '#f8c070'], LE_GROUND)
    sun(ctx, LE_SUN.x, LE_SUN.y, 12, '#f4703a', '#f8b070')
    ridge(ctx, (x) => 108 + 4 * Math.sin(x * 0.04), '#8a6a6a', '#9a7a72', 0, W, LE_GROUND)
    ridge(ctx, leHill, '#6a5a4a', '#7a6a52', 0, W, H)
    px(ctx, 0, LE_GROUND, W, H - LE_GROUND, '#5e5444')
    house(ctx, 18, 132)
    withAlpha(ctx, 0.3, () => {
      for (const [y, w] of [[60, 120], [74, 160], [86, 100]] as const) px(ctx, LE_SUN.x - w, y, w, 2, '#f8d0a0')
    })
  }),
  sp('le_rain', '쏟아지는 비', 4, FULL, (ctx, env) => rain(ctx, env.t, 70, 130, 'rgba(140,150,165,0.7)')),
  sp('le_noon', '한낮의 해', 4, FULL, (ctx) => sun(ctx, 160, 20, 9)),

  sp('le_dusk', '다가오는 황혼', 30, FULL, (ctx) => {
    for (let y = 0; y < 60; y++) withAlpha(ctx, (1 - y / 60) * 0.55, () => px(ctx, 0, y, W, 1, '#1e1a38'))
    withAlpha(ctx, 0.15, () => px(ctx, 0, LE_GROUND, W, H - LE_GROUND, '#1e1a38'))
  }),
  sp('le_dawn', '새벽', 30, FULL, (ctx) => withAlpha(ctx, 0.3, () => px(ctx, 0, 0, W, 60, '#e8e4f0'))),
  sp('le_rainbow', '무지개', 30, FULL, (ctx) => {
    for (const [r, c] of [[60, '#c8504a'], [57, '#d8a040'], [54, '#7aa050'], [51, '#4a6ab0']] as const)
      for (let a = Math.PI; a < Math.PI * 2; a += 0.01) dot(ctx, 120 + Math.cos(a) * r, 110 + Math.sin(a) * r * 0.8, c)
  }),
]

