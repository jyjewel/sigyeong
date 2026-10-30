// 『唐詩畫意』 卷八 둘째 묶음 (2): 劉長卿〈送靈澈上人〉〈江中對月〉, 孟浩然〈尋菊花潭主人不遇〉, 李白〈玉階怨〉
import type { Background } from '../types'
import { H, W, disc, dot, fillRows, hash, mod, px } from '../pixel'
import type { Ctx } from '../pixel'
import { bamboo, flower, hut, mistBands, moon, person, pine, rain, ridge, sky, stars, withAlpha } from '../kit'
import { OTHER_PALS, pal, standFig } from '../figures'
import { lotusFlower, lotusPad, shimmer, skiff, soundArcs, sp, sun, water } from './hy_kit'

/** 스님 (삿갓을 등에 멘 입상). 회색 장삼 */
const MONK = pal({ K: '#8a7a6a', H: '#8a7a6a', R: '#6a6458', r: '#4e4a40', L: '#8a6a3a', B: '#e6c39b' })
function monkWithHat(ctx: Ctx, x: number, y: number, flip = false) {
  standFig(ctx, x, y, MONK, flip)
  const hx = flip ? x + 9 : x - 1
  disc(ctx, hx + 3, y + 12, 5, '#c8a868')
  disc(ctx, hx + 3, y + 12, 2, '#a88848')
}

// ════════════════════════════════════════════════════════════
// 劉長卿〈送靈澈上人〉: 저녁 산과 산길
// ════════════════════════════════════════════════════════════
const slPath = (t: number) => ({ x: 170 + t * 90 - Math.sin(t * 5) * 14, y: 172 - t * 104 })

export const lingcheBackground: Background = {
  id: 'hy022',
  drawBack(ctx) {
    sky(ctx, ['#c8b8b0', '#d8c2aa', '#e4cca4', '#ecd6a8'], 100)
    ridge(ctx, (x) => 44 + 18 * Math.sin(x * 0.016 + 4) + 5 * Math.sin(x * 0.07), '#6e8070', '#7e9080')
    ridge(ctx, (x) => 82 + 10 * Math.sin(x * 0.03 + 1.2) + 3 * Math.sin(x * 0.11), '#5a6a5a', '#667666')
    ridge(ctx, (x) => 120 + 8 * Math.sin(x * 0.025 + 3), '#6a7456', '#7a8466')
    for (let t = 0; t <= 1; t += 0.004) {
      const p = slPath(t)
      px(ctx, p.x, p.y, 2 + (1 - t) * 4, 2, '#a89a7a')
    }
  },
  drawFront() {},
  drawDynamic() {},
}

const SL_GROVE = { x: 10, y: 26, w: 160, h: 90 }
const SL_NEAR = { x: 128, y: 100, w: 128, h: 72 }
const SL_FAR = { x: 168, y: 52, w: 128, h: 72 }

export const LINGCHE_SPRITES = [
  sp('sl_temple', '대숲 속의 절', 12, SL_GROVE, (ctx, env) => {
    for (let k = 0; k < 16; k++) bamboo(ctx, 22 + k * 8, 96, 30 + (k % 4) * 6, Math.sin(env.t + k) * 1.5, env.t)
    px(ctx, 64, 66, 44, 4, '#3a3e46')
    px(ctx, 70, 62, 32, 4, '#4a4f57')
    px(ctx, 70, 70, 32, 14, '#c9bfa5')
    px(ctx, 82, 74, 8, 10, '#6b4a32')
  }),
  sp('sl_pavilion', '소나무 아래 정자', 12, SL_GROVE, (ctx) => {
    pine(ctx, 50, 96, 1.4)
    px(ctx, 80, 70, 40, 4, '#3a3e46')
    px(ctx, 84, 74, 2, 20, '#6b4a32')
    px(ctx, 114, 74, 2, 20, '#6b4a32')
  }),
  sp('sl_office', '성안의 관청', 12, SL_GROVE, (ctx) => {
    px(ctx, 30, 74, 120, 20, '#8a8072')
    px(ctx, 60, 60, 60, 4, '#3a3e46')
    px(ctx, 64, 64, 52, 12, '#b2352a')
  }),

  sp('sl_bell', '아득한 저녁 종소리', 20, SL_GROVE, (ctx, env) => soundArcs(ctx, 86, 60, env.t * 0.6, '#5d4a37', 50)),
  sp('sl_rooster', '아침 닭 울음', 20, SL_GROVE, (ctx, env) => {
    px(ctx, 120, 90, 8, 6, '#e8e2d0')
    px(ctx, 126, 86, 4, 5, '#e8e2d0')
    px(ctx, 127, 84, 3, 2, '#c0302a')
    soundArcs(ctx, 132, 86, env.t * 2, '#5d4a37', 12)
  }),
  sp('sl_drum', '둥둥 북소리', 20, SL_GROVE, (ctx, env) => {
    disc(ctx, 86, 60, 7, '#8a3a2a')
    disc(ctx, 86, 60, 5, '#e8d8b0')
    const hit = Math.sin(env.t * 4) > 0.5
    if (hit) for (let k = 0; k < 6; k++) dot(ctx, 86 + Math.cos(k) * 11, 60 + Math.sin(k) * 9, '#5d4a37')
  }),

  sp('sl_monk', '삿갓 멘 스님', 30, SL_NEAR, (ctx) => {
    withAlpha(ctx, 0.3, () => disc(ctx, 190, 130, 22, '#f4b870'))
    monkWithHat(ctx, 184, 118)
  }),
  sp('sl_umbrella', '우산 쓰고 빗속을 걷는 사람', 30, SL_NEAR, (ctx, env) => {
    standFig(ctx, 184, 118, MONK)
    fillRows(ctx, 110, 116, (y) => [180 - (y - 110) * 2, 202 + (y - 110) * 2], '#4a6a8a')
    ctx.save()
    ctx.beginPath()
    ctx.rect(130, 96, 120, 76)
    ctx.clip()
    rain(ctx, env.t, 40, 140, 'rgba(120,135,150,0.8)')
    ctx.restore()
  }),
  sp('sl_torch', '횃불 들고 밤길을 걷는 사람', 30, SL_NEAR, (ctx, env) => {
    withAlpha(ctx, 0.45, () => px(ctx, 128, 100, 128, 72, '#141a30'))
    standFig(ctx, 184, 118, MONK)
    const on = Math.sin(env.t * 7) > -0.4
    px(ctx, 197, 120, 1, 10, '#5a4632')
    px(ctx, 196, 117, 3, 3, on ? '#ffb040' : '#e07a20')
    withAlpha(ctx, 0.25, () => disc(ctx, 197, 119, 8, '#ffcf6a'))
  }),

  sp('sl_away', '푸른 산으로 돌아가는 길', 24, SL_FAR, (ctx, env) => {
    const t = 0.55 + mod(env.t * 0.02, 0.35)
    const p = slPath(t)
    const s = 1 - t * 0.6
    px(ctx, p.x, p.y - 7 * s, 2, 6 * s, MONK.R)
    dot(ctx, p.x, p.y - 8 * s, '#e6c39b')
    disc(ctx, p.x - 1, p.y - 5 * s, 2, '#c8a868')
  }),
  sp('sl_market', '북적이는 저잣거리', 24, SL_FAR, (ctx) => {
    for (let k = 0; k < 4; k++) {
      px(ctx, 190 + k * 24, 90, 20, 3, ['#b2352a', '#d9a441', '#4f6b4a', '#6b5a7a'][k])
      px(ctx, 192 + k * 24, 93, 2, 10, '#5a4632')
      person(ctx, 196 + k * 24, 96, OTHER_PALS[k].R)
    }
  }),
  sp('sl_river', '배 타고 강으로', 24, SL_FAR, (ctx, env) => {
    fillRows(ctx, 100, 112, () => [180, 300], '#7a9aa8')
    skiff(ctx, 230 + Math.sin(env.t * 0.3) * 10, 108, env.t, { guest: MONK.R, len: 20 })
  }),
]

// ════════════════════════════════════════════════════════════
// 劉長卿〈江中對月〉: 가을밤 강과 빈 모래톱
// ════════════════════════════════════════════════════════════
const JD_WATER = 86
const sandbar = (y: number): [number, number] => {
  const d = (y - 120) / 10
  const w = 90 * Math.sqrt(Math.max(0, 1 - d * d))
  return [150 - w, 150 + w]
}

export const jiangzhongBackground: Background = {
  id: 'hy023',
  drawBack(ctx) {
    sky(ctx, ['#1e2840', '#263252', '#2e3c5c'], JD_WATER)
    ridge(ctx, (x) => 74 + 5 * Math.sin(x * 0.03 + 1), '#1a2230', '#222c3c', 0, W, JD_WATER)
    water(ctx, JD_WATER, H, '#34445e', '#24324a', '#4a5a76')
    fillRows(ctx, 110, 131, sandbar, (y) => (y < 114 ? '#a8a490' : '#8a8676'))
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    shimmer(ctx, env.t, JD_WATER + 4, 176, 20, '#56688a')
  },
}

const JD_BAR = { x: 40, y: 76, w: 224, h: 72 }
const JD_SKY = { x: 0, y: 0, w: 320, h: 180 }
const JD_PEOPLE = { x: 72, y: 84, w: 144, h: 54 }
const JD_CROSS = { x: 160, y: 108, w: 128, h: 72 }
const BAR_PEOPLE = [100, 136, 176]

export const JIANGZHONG_SPRITES = [
  sp('jd_clear', '안개 걷힌 모래톱', 10, JD_BAR, (ctx, env) => {
    ctx.save()
    ctx.beginPath()
    ctx.rect(40, 96, 224, 30)
    ctx.clip()
    mistBands(ctx, env.t, [104, 112], '#c8d0e0', 0.18)
    ctx.restore()
    px(ctx, 64, 114, 172, 1, '#c8c4b0')
  }),
  sp('jd_fog', '짙은 안개', 10, JD_BAR, (ctx, env) => mistBands(ctx, env.t, [100, 106, 112, 118, 124], '#c8d0e0', 0.75)),
  sp('jd_snow', '하얀 눈', 10, JD_BAR, (ctx) => fillRows(ctx, 109, 130, sandbar, (y) => (y < 113 ? '#f4f6f6' : '#dfe6ea'))),

  sp('jd_moon', '가을 강의 달', 6, JD_SKY, (ctx, env) => {
    moon(ctx, 70, 30, 10)
    withAlpha(ctx, 0.55, () => {
      for (let y = JD_WATER + 4; y < 176; y += 3) {
        const w = 3 + (y - JD_WATER) * 0.1 + Math.sin(env.t * 2 + y) * 2
        if (y < 108 || y > 132) px(ctx, 70 - w / 2, y, w, 1, '#f4ecc8')
      }
    })
    withAlpha(ctx, 0.15, () => px(ctx, 0, 0, W, H, '#8a9ac8'))
  }),
  sp('jd_sun', '한낮의 해', 6, JD_SKY, (ctx) => {
    sky(ctx, ['#a8c4dc', '#bcd2e2', '#d0dee6'], JD_WATER)
    sun(ctx, 70, 26, 9)
    ridge(ctx, (x) => 74 + 5 * Math.sin(x * 0.03 + 1), '#6a8a96', '#7a9aa6', 0, W, JD_WATER)
  }),
  sp('jd_cloud', '구름에 가린 하늘', 6, JD_SKY, (ctx, env) => {
    const o = Math.sin(env.t * 0.2) * 8
    for (const [x, y, w] of [[20, 20, 100], [110, 30, 120], [200, 16, 90]] as const) {
      px(ctx, x + o, y, w, 8, '#3e4860')
      px(ctx, x + 10 + o, y - 4, w - 20, 4, '#46526a')
    }
  }),

  sp('jd_clearman', '또렷한 모래 위 사람', 20, JD_PEOPLE, (ctx) => {
    for (const x of BAR_PEOPLE) person(ctx, x, 104, '#e8e2d0', { hat: '#2a2622' })
  }),
  sp('jd_blur', '희미한 그림자', 20, JD_PEOPLE, (ctx) => {
    withAlpha(ctx, 0.3, () => {
      for (const x of BAR_PEOPLE) px(ctx, x - 1, 103, 5, 9, '#8a8a9a')
    })
  }),
  sp('jd_empty', '아무도 없는 모래톱', 20, JD_PEOPLE, (ctx) => {
    for (let k = 0; k < 8; k++) dot(ctx, 90 + k * 12, 118 + (k % 2) * 2, '#6a6658')
  }),

  sp('jd_wade', '홀로 건너는 사람', 30, JD_CROSS, (ctx, env) => {
    const f = mod(env.t * 0.04, 1)
    const x = 220 + f * 50
    person(ctx, x, 140, '#e8e2d0', { hat: '#2a2622' })
    for (let k = 0; k < 2; k++) {
      const g = mod(env.t * 0.8 + k / 2, 1)
      withAlpha(ctx, 1 - g, () => px(ctx, x - 2 - g * 8, 148, 6 + g * 16, 1, '#8a9ac0'))
    }
  }),
  sp('jd_bridge', '여럿이 다리를 건넘', 30, JD_CROSS, (ctx, env) => {
    for (let x = 180; x < 290; x++) px(ctx, x, 140 - Math.sin(((x - 180) / 110) * Math.PI) * 10, 1, 3, '#6a6050')
    for (let k = 0; k < 4; k++) {
      const x = 190 + mod(k * 22 + env.t * 6, 90)
      person(ctx, x, 130 - Math.sin(((x - 180) / 110) * Math.PI) * 10, '#e8e2d0')
    }
  }),
  sp('jd_horse', '말을 타고 달림', 30, JD_CROSS, (ctx, env) => {
    const x = 180 + mod(env.t * 20, 100)
    px(ctx, x, 146, 16, 6, '#4a3a2a')
    px(ctx, x + 14, 142, 3, 6, '#4a3a2a')
    for (let k = 0; k < 4; k++) px(ctx, x + 1 + k * 4, 152, 1, 6, '#3a2a1a')
    person(ctx, x + 5, 137, '#e8e2d0')
  }),
]

// ════════════════════════════════════════════════════════════
// 孟浩然〈尋菊花潭主人不遇〉: 산 아래 마을, 못, 빈집
// ════════════════════════════════════════════════════════════
const JH_HOUSE = { x: 206, y: 112 }

export const juhuaBackground: Background = {
  id: 'hy024',
  drawBack(ctx) {
    sky(ctx, ['#cdd2d0', '#d8d8cc', '#e2dcc8'], 100)
    ridge(ctx, (x) => 56 + 22 * Math.exp(-((x - 160) ** 2) / 3000) * -1 + 12 * Math.sin(x * 0.02 + 1), '#7a8a72', '#889880')
    ridge(ctx, (x) => 50 + Math.abs(x - 160) * 0.3 + 4 * Math.sin(x * 0.08), '#6a7a62', '#78886e', 80, 240, 110)
    fillRows(ctx, 100, H, () => [0, W], (y) => (y < 120 ? '#9aa078' : '#8e9470'))
    // 못
    fillRows(ctx, 132, 160, (y) => {
      const d = (y - 146) / 14
      const w = 50 * Math.sqrt(Math.max(0, 1 - d * d))
      return [80 - w, 80 + w]
    }, '#7a9aa4')
    // 빈집과 울타리
    hut(ctx, JH_HOUSE.x, JH_HOUSE.y)
    hut(ctx, JH_HOUSE.x + 34, JH_HOUSE.y + 4)
    for (let k = 0; k < 18; k++) px(ctx, 190 + k * 7, 140, 2, 10, '#7a6242')
    px(ctx, 190, 144, 124, 1, '#5a4632')
  },
  drawFront() {},
  drawDynamic() {},
}

const JH_POND = { x: 16, y: 112, w: 144, h: 68 }
const JH_SKY = { x: 0, y: 0, w: 320, h: 180 }
const JH_HILL = { x: 96, y: 20, w: 128, h: 72 }
const JH_YARD = { x: 184, y: 112, w: 136, h: 68 }

export const JUHUA_SPRITES = [
  sp('jh_mum', '국화 핀 못가', 14, JH_POND, (ctx) => {
    for (let i = 0; i < 30; i++) {
      const a = (i / 30) * Math.PI * 2
      const x = 80 + Math.cos(a) * 56
      const y = 146 + Math.sin(a) * 18
      px(ctx, x, y, 1, 4, '#4f6b3a')
      flower(ctx, x, y - 1, i % 3 ? '#e8b030' : '#f0d060', '#c88a20')
    }
  }),
  sp('jh_lotus', '연꽃 핀 연못', 14, JH_POND, (ctx) => {
    for (let i = 0; i < 9; i++) {
      const x = 46 + (i % 5) * 16
      const y = 140 + Math.floor(i / 5) * 10
      lotusPad(ctx, x, y, 4)
      if (i % 2) lotusFlower(ctx, x, y - 3)
    }
  }),
  sp('jh_ice', '얼어붙은 못', 14, JH_POND, (ctx) => {
    fillRows(ctx, 133, 159, (y) => {
      const d = (y - 146) / 14
      const w = 49 * Math.sqrt(Math.max(0, 1 - d * d))
      return [80 - w, 80 + w]
    }, '#dfe8ee')
  }),

  sp('jh_west', '서쪽으로 기운 해', 4, JH_SKY, (ctx) => {
    withAlpha(ctx, 0.18, () => px(ctx, 0, 0, W, H, '#f0a050'))
    sun(ctx, 36, 52, 8, '#f09050', '#ffc890')
  }),
  sp('jh_noon', '하늘 한가운데 해', 4, JH_SKY, (ctx) => sun(ctx, 160, 14, 9)),
  sp('jh_east', '동쪽에서 떠오르는 해', 4, JH_SKY, (ctx) => {
    withAlpha(ctx, 0.12, () => px(ctx, 0, 0, W, H, '#f8d8c8'))
    sun(ctx, 270, 74, 8, '#f8c890', '#fff0d0')
  }),

  sp('jh_climb', '산에 오른 주인', 20, JH_HILL, (ctx, env) => {
    const f = mod(env.t * 0.03, 1)
    const x = 140 + f * 24
    const y = 50 + Math.abs(x - 160) * 0.3
    px(ctx, x, y - 6, 2, 5, '#4b5068')
    dot(ctx, x, y - 7, '#e6c39b')
    px(ctx, x + 3, y - 6, 1, 6, '#5a4632')
  }),
  sp('jh_nap', '낮잠 자는 주인', 20, JH_YARD, (ctx, env) => {
    px(ctx, 212, 124, 12, 3, '#4b5068')
    dot(ctx, 224, 124, '#e6c39b')
    const g = mod(env.t * 0.5, 1)
    withAlpha(ctx, 1 - g, () => px(ctx, 226 + g * 6, 118 - g * 8, 3, 1, '#3b2a1d'))
  }),
  sp('jh_fish', '낚시하는 주인', 20, JH_POND, (ctx, env) => {
    person(ctx, 128, 138, '#4b5068')
    for (let k = 0; k < 16; k++) dot(ctx, 128 - k * 1.5, 138 - k * 0.6, '#5a4632')
    px(ctx, 104, 129, 1, 14 + Math.sin(env.t) * 2, '#d8d4c8')
  }),

  sp('jh_animals', '빈집의 닭과 개', 30, JH_YARD, (ctx, env) => {
    const peck = Math.sin(env.t * 5) > 0
    px(ctx, 222, 160, 8, 5, '#e8e2d0')
    px(ctx, 228, peck ? 158 : 155, 3, 4, '#e8e2d0')
    px(ctx, 229, peck ? 157 : 154, 2, 1, '#c0302a')
    dot(ctx, 231, peck ? 160 : 157, '#d9a441')
    const wag = Math.sin(env.t * 8) > 0 ? 1 : 0
    px(ctx, 256, 160, 12, 5, '#8a6a42')
    px(ctx, 266, 156, 5, 5, '#8a6a42')
    px(ctx, 254, 157 + wag, 2, 3, '#8a6a42')
    for (let k = 0; k < 4; k++) px(ctx, 257 + k * 3, 165, 1, 4, '#6a4a2a')
  }),
  sp('jh_guests', '모여든 손님들', 30, JH_YARD, (ctx) => {
    for (let k = 0; k < 4; k++) person(ctx, 212 + k * 16, 156, OTHER_PALS[k].R)
  }),
  sp('jh_kids', '뛰노는 아이들', 30, JH_YARD, (ctx, env) => {
    for (let k = 0; k < 3; k++) {
      const hop = Math.abs(Math.sin(env.t * 5 + k)) * 4
      person(ctx, 220 + k * 22 + Math.sin(env.t + k) * 6, 156 - hop, ['#c0604a', '#d9a441', '#6a9ad8'][k])
    }
  }),
]

// ════════════════════════════════════════════════════════════
// 李白〈玉階怨〉: 밤의 궁전, 옥 섬돌, 창
// ════════════════════════════════════════════════════════════
const YJ_STEP = 132
const WIN = { x: 196, y: 64, w: 84, h: 52 }
const WOMAN = pal({ K: '#1f1d22', H: '#1f1d22', R: '#b07a8a', r: '#8a5a6a', L: '#d9a441', B: '#e6c39b', W: '#f4ecd8' })

export const yujieBackground: Background = {
  id: 'hy026',
  drawBack(ctx) {
    sky(ctx, ['#141a30', '#1a2240', '#222a4a'], 60)
    // 궁전
    px(ctx, 140, 40, 180, 6, '#20242c')
    px(ctx, 150, 34, 160, 6, '#282c36')
    px(ctx, 146, 46, 170, 86, '#5a2a24')
    px(ctx, WIN.x - 4, WIN.y - 4, WIN.w + 8, WIN.h + 8, '#3a1a16')
    px(ctx, WIN.x, WIN.y, WIN.w, WIN.h, '#2a2230')
    for (const x of [150, 300]) px(ctx, x, 46, 6, 86, '#3a1a16')
    fillRows(ctx, 60, YJ_STEP, () => [0, 140], '#20263a')
    // 옥 섬돌
    for (let k = 0; k < 5; k++) px(ctx, 70 - k * 8, YJ_STEP + k * 10, 200 + k * 16, 10, k % 2 ? '#b8bcc4' : '#c8ccd2')
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    stars(ctx, 16, 31, 0, 40, env.t)
  },
}

const YJ_STEPS = { x: 56, y: 108, w: 128, h: 72 }
const YJ_WOMAN = { x: 64, y: 84, w: 128, h: 72 }
const YJ_WIN = { x: 176, y: 52, w: 128, h: 72 }
const YJ_SKY = { x: 0, y: 0, w: 192, h: 108 }

export const YUJIE_SPRITES = [
  sp('yj_dew', '섬돌의 흰 이슬', 12, YJ_STEPS, (ctx, env) => {
    for (let i = 0; i < 40; i++) {
      const k = i % 5
      const x = 66 - k * 8 + hash(i * 2.3) * (200 + k * 16)
      const y = YJ_STEP + k * 10 + 1 + hash(i) * 3
      const on = Math.sin(env.t * 2 + i) > 0.3
      dot(ctx, x, y, on ? '#ffffff' : '#dfe6f0')
    }
  }),
  sp('yj_petals', '섬돌의 붉은 꽃잎', 12, YJ_STEPS, (ctx) => {
    for (let i = 0; i < 30; i++) {
      const k = i % 5
      px(ctx, 66 - k * 8 + hash(i * 2.3) * (200 + k * 16), YJ_STEP + k * 10 + 3, 2, 1, '#d0405a')
    }
  }),
  sp('yj_snow', '섬돌의 하얀 눈', 12, YJ_STEPS, (ctx) => {
    for (let k = 0; k < 5; k++) px(ctx, 70 - k * 8, YJ_STEP + k * 10, 200 + k * 16, 3, '#f4f6f8')
  }),

  sp('yj_stand', '이슬에 젖은 버선', 26, YJ_WOMAN, (ctx, env) => {
    standFig(ctx, 116, 110, WOMAN)
    for (let k = 0; k < 4; k++) if (Math.sin(env.t * 2 + k * 1.6) > 0.4) dot(ctx, 120 + k * 2, 132, '#ffffff')
  }),
  sp('yj_dance', '춤추며 노는 여인', 26, YJ_WOMAN, (ctx, env) => {
    const bob = Math.round(Math.sin(env.t * 6))
    standFig(ctx, 116 + Math.round(Math.sin(env.t * 2) * 6), 110 + bob, WOMAN, Math.sin(env.t * 3) > 0)
    for (let k = 0; k < 8; k++) dot(ctx, 110 + Math.cos(env.t * 3 + k) * 16, 118 + Math.sin(env.t * 3 + k) * 6, '#e8c0cc')
  }),
  sp('yj_sleep', '방에서 잠든 여인', 26, YJ_WIN, (ctx) => {
    px(ctx, WIN.x + 10, WIN.y + 34, 50, 6, '#6a4a3a')
    px(ctx, WIN.x + 14, WIN.y + 30, 30, 4, WOMAN.R)
    px(ctx, WIN.x + 44, WIN.y + 30, 6, 4, '#e6c39b')
  }),

  sp('yj_curtain', '드리운 수정 발', 30, YJ_WIN, (ctx, env) => {
    for (let k = 0; k < 14; k++) {
      const x = WIN.x + 3 + k * 6
      for (let y = WIN.y; y < WIN.y + WIN.h; y += 3) {
        const on = Math.sin(env.t * 2 + k + y * 0.3) > 0.7
        dot(ctx, x + Math.sin(env.t + k) * 0.5, y, on ? '#ffffff' : '#a8b8d8')
      }
    }
  }),
  sp('yj_door', '활짝 연 문', 30, YJ_WIN, (ctx) => {
    px(ctx, WIN.x, WIN.y, WIN.w, WIN.h, '#c8a878')
    px(ctx, WIN.x - 10, WIN.y, 10, WIN.h, '#6a2a20')
    px(ctx, WIN.x + WIN.w, WIN.y, 10, WIN.h, '#6a2a20')
  }),
  sp('yj_candle', '밝힌 촛불', 30, YJ_WIN, (ctx, env) => {
    withAlpha(ctx, 0.35, () => disc(ctx, WIN.x + 42, WIN.y + 26, 22, '#ffcf6a'))
    px(ctx, WIN.x + 41, WIN.y + 26, 3, 12, '#f4ecd8')
    const fl = Math.sin(env.t * 8) > 0
    px(ctx, WIN.x + 41, WIN.y + (fl ? 21 : 22), 3, 4, '#ffb040')
  }),

  sp('yj_moon', '발 너머의 가을 달', 4, YJ_SKY, (ctx) => moon(ctx, 96, 30, 11)),
  sp('yj_meteor', '떨어지는 별똥별', 4, YJ_SKY, (ctx, env) => {
    const f = mod(env.t * 0.4, 1)
    for (let k = 0; k < 10; k++) withAlpha(ctx, 1 - k / 10, () => dot(ctx, 40 + f * 100 - k * 2, 10 + f * 40 - k, '#ffffff'))
  }),
  sp('yj_lanterns', '줄지은 등불', 4, YJ_SKY, (ctx, env) => {
    px(ctx, 10, 40, 130, 1, '#5a4632')
    for (let k = 0; k < 8; k++) {
      const on = Math.sin(env.t * 4 + k) > -0.5
      px(ctx, 16 + k * 16, 42, 5, 6, on ? '#f06a40' : '#c04a30')
      withAlpha(ctx, 0.2, () => disc(ctx, 18 + k * 16, 45, 6, '#ff9a60'))
    }
  }),
]
