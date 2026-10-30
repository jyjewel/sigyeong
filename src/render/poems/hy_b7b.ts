// 『唐詩畫意』 卷九 셋째 묶음 (2): 張籍〈梅溪〉〈琵琶臺〉〈寄西峰僧〉, 白居易〈秋夕〉〈湖上夜飲〉, 孫革〈訪羊尊師〉
import type { Background } from '../types'
import { H, W, disc, dot, fillRows, hash, mod, px } from '../pixel'
import type {  } from '../pixel'
import { bird, boat, flower, house, hut, mistBands, moon, person, pine, rain, ridge, sky, snowfall, stars, withAlpha } from '../kit'
import { OTHER_PALS, pal, seatFig, standFig } from '../figures'
import { drift, lotusFlower, lotusPad, shimmer, soundArcs, sp, stone, sun, water } from './hy_kit'
import { vignette } from './hy_b3a'

const MONK = pal({ K: '#8a7a6a', H: '#8a7a6a', R: '#6a6458', r: '#4e4a40', L: '#8a6a3a', B: '#e6c39b' })

// ════════════════════════════════════════════════════════════
// 張籍〈梅溪〉: 매화 시내와 쓸지 않은 돌
// ════════════════════════════════════════════════════════════
const MX_WATER = 152
const MX_PLUM = { x: 86, y: 130 }
const MX_STONES = [0, 1, 2, 3, 4].map((k) => ({ x: 150 + k * 18, y: 142 + (k % 2) * 3 }))
const MX_BLOOMS = Array.from({ length: 30 }, (_, i) => {
  const a = -Math.PI * hash(i * 2.1)
  const r = 12 + hash(i * 3.7) * 30
  return { x: MX_PLUM.x + Math.cos(a) * r * 1.3, y: MX_PLUM.y - 40 + Math.sin(a) * r * 0.7 }
})

export const meixiBackground: Background = {
  id: 'hy091',
  drawBack(ctx) {
    sky(ctx, ['#c8d0d8', '#d4d8da', '#e0e0da'], 132)
    ridge(ctx, (x) => 98 + 10 * Math.sin(x * 0.02 + 2.6), '#a8b2aa', '#b2bcb4', 0, W, 132)
    px(ctx, 0, 124, W, MX_WATER - 124, '#9a9a78')
    water(ctx, MX_WATER, H, '#9ab4bc', '#7a98a4', '#c4d4d8')
    for (const s of MX_STONES) stone(ctx, s.x, s.y, 5, '#b8b4a8', '#8a867a')
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    shimmer(ctx, env.t, MX_WATER + 3, 178, 10, '#dce8e8')
  },
}

const MX_PLUM_F = { x: 16, y: 56, w: 144, h: 81 }
const MX_PATH = { x: 0, y: 104, w: 144, h: 76 }
const MX_YARD = { x: 136, y: 96, w: 144, h: 72 }

export const MEIXI_SPRITES = [
  sp('mx_plum', '새로 핀 매화', 14, MX_PLUM_F, (ctx, env) => {
    px(ctx, MX_PLUM.x - 3, MX_PLUM.y - 30, 6, 30, '#3a2e2a')
    for (const [dx, dy, len, ang] of [[0, -28, 30, -2.6], [2, -24, 34, -0.5], [0, -14, 22, -2.9], [0, -30, 22, -1.5]] as const)
      for (let i = 0; i < len; i++) px(ctx, MX_PLUM.x + dx + Math.cos(ang) * i, MX_PLUM.y + dy + Math.sin(ang) * i + Math.sin(i * 0.5) * 1, 2, 2, '#3a2e2a')
    MX_BLOOMS.forEach((b, i) => {
      disc(ctx, b.x, b.y, 1, i % 3 ? '#f8f0f0' : '#f4c8d4')
      if (Math.sin(env.t * 1.5 + i) > 0.8) dot(ctx, b.x, b.y, '#ffffff')
    })
  }),
  sp('mx_mum', '국화', 14, MX_PLUM_F, (ctx) => {
    for (let k = 0; k < 8; k++) disc(ctx, 60 + k * 8, MX_PLUM.y - 4, 2, '#f0c838')
  }),
  sp('mx_lotus', '연꽃', 14, MX_PLUM_F, (ctx) => {
    for (let k = 0; k < 5; k++) {
      lotusPad(ctx, 60 + k * 14, 162, 5)
      lotusFlower(ctx, 62 + k * 14, 158)
    }
  }),

  sp('mx_path', '비스듬한 오솔길 하나', 10, MX_PATH, (ctx) => {
    for (let t = 0; t <= 1; t += 0.005) px(ctx, 10 + t * 70 + Math.sin(t * 6) * 6, 178 - t * 48, 4 - t * 2, 1, '#c8b88a')
    standFig(ctx, 44, 120, pal())
  }),
  sp('mx_road', '넓은 큰길', 10, MX_PATH, (ctx) => px(ctx, 0, 136, 150, 12, '#c8b88a')),
  sp('mx_bridge', '돌다리', 10, MX_PATH, (ctx) => {
    for (let a = 0; a <= Math.PI; a += 0.02) px(ctx, 80 - Math.cos(a) * 30, MX_WATER + 4 - Math.sin(a) * 8, 3, 3, '#8a8478')
  }),

  sp('mx_nosweep', '돌을 쓸지 말게 하는 시인', 22, MX_YARD, (ctx) => {
    standFig(ctx, 246, 118, pal({ R: '#6e6450', r: '#544c3c' }), true)
    for (let i = 0; i < 16; i++) dot(ctx, 244 - i * 0.2, 124 + i, '#6a4a32')
    px(ctx, 240, 139, 8, 2, '#a8864a')
    standFig(ctx, 212, 118, pal())
    for (let i = 0; i < 5; i++) dot(ctx, 226 + i, 126 - i, '#4b5068')
    dot(ctx, 231, 121, '#e6c39b')
  }),
  sp('mx_sweep', '돌을 깨끗이 쓰는 사람', 22, MX_YARD, (ctx, env) => {
    standFig(ctx, 246, 118, pal({ R: '#6e6450', r: '#544c3c' }), true)
    const s = Math.sin(env.t * 3) * 6
    for (let i = 0; i < 16; i++) dot(ctx, 244 - (s * i) / 16, 124 + i, '#6a4a32')
    px(ctx, 238 - s, 139, 8, 2, '#a8864a')
  }),
  sp('mx_wash', '돌을 물로 씻는 사람', 22, MX_YARD, (ctx) => {
    standFig(ctx, 246, 118, pal({ R: '#6e6450', r: '#544c3c' }), true)
    px(ctx, 236, 132, 7, 6, '#8a6a48')
  }),

  sp('mx_petals', '돌 위에 떨어진 매화잎', 26, MX_YARD, (ctx, env) => {
    for (const s of MX_STONES) for (let i = 0; i < 4; i++) px(ctx, s.x - 5 + hash(s.x + i) * 10, s.y - 5 + hash(s.x * 3 + i) * 2, 2, 1, i % 2 ? '#f8f0f0' : '#f4c8d4')
    drift(ctx, env.t, { x: 60, y: 90, w: 180, h: 60 }, 8, '#f8f0f0', 0.4, 8)
  }),
  sp('mx_moss', '돌 위의 이끼', 26, MX_YARD, (ctx) => {
    for (const s of MX_STONES) px(ctx, s.x - 4, s.y - 4, 8, 2, '#5a8a4a')
  }),
  sp('mx_ants', '줄지은 개미', 26, MX_YARD, (ctx, env) => {
    for (let k = 0; k < 12; k++) dot(ctx, 150 + mod(k * 7 + env.t * 4, 80), 140, '#2a2420')
  }),
]

// ════════════════════════════════════════════════════════════
// 張籍〈琵琶臺〉: 푸른 덩굴 덮인 누대
// ════════════════════════════════════════════════════════════
const PP_TAI = { x0: 156, x1: 236, y: 92 }
const ppStep = (t: number) => ({ x: 70 + t * 90, y: 170 - t * 76 })
const PP_TOP = { x: 196, y: 70 }

export const pipataiBackground: Background = {
  id: 'hy092',
  drawBack(ctx) {
    sky(ctx, ['#bcd0dc', '#cadae0', '#d8e2e0'], 120)
    ridge(ctx, (x) => 84 + 12 * Math.sin(x * 0.02 + 0.4), '#9ab0a4', '#a6bcb0', 0, W, 120)
    fillRows(ctx, PP_TAI.y + 6, H, (y) => [PP_TAI.x0 - (y - PP_TAI.y) * 1.2, PP_TAI.x1 + (y - PP_TAI.y) * 0.8], '#7e9a62')
    px(ctx, 0, 150, W, 30, '#7e9a62')
    // 누대
    px(ctx, PP_TAI.x0, PP_TAI.y, PP_TAI.x1 - PP_TAI.x0, 10, '#a49c8c')
    for (let x = PP_TAI.x0; x < PP_TAI.x1; x += 10) px(ctx, x, PP_TAI.y + 4, 9, 1, '#8a8274')
    px(ctx, PP_TAI.x0 - 2, PP_TAI.y - 2, PP_TAI.x1 - PP_TAI.x0 + 4, 2, '#b8b0a0')
    for (let t = 0; t <= 1; t += 0.05) {
      const p = ppStep(t)
      px(ctx, p.x - 5, p.y, 12, 2, '#a8a49a')
    }
  },
  drawFront() {},
  drawDynamic() {},
}

const PP_TAI_F = { x: 136, y: 56, w: 120, h: 68 }
const PP_STEPS = { x: 48, y: 80, w: 160, h: 100 }
const PP_SKY = { x: 0, y: 0, w: 192, h: 108 }

export const PIPATAI_SPRITES = [
  sp('pp_vines', '누대 위 푸른 덩굴의 봄', 12, PP_TAI_F, (ctx, env) => {
    for (let k = 0; k < 14; k++) {
      const x = PP_TAI.x0 + 2 + k * 5.6
      const len = 6 + hash(k) * 12
      for (let i = 0; i < len; i++) dot(ctx, x + Math.sin(i * 0.4 + k + env.t * 0.6) * 1.5, PP_TAI.y + i, i % 3 ? '#4a8a3a' : '#6aa84a')
    }
    for (let k = 0; k < 8; k++) flower(ctx, PP_TAI.x0 + 6 + k * 10, PP_TAI.y - 3, '#f2b8c6', '#f4d060')
  }),
  sp('pp_snow', '누대에 쌓인 눈', 12, PP_TAI_F, (ctx) => px(ctx, PP_TAI.x0 - 2, PP_TAI.y - 3, PP_TAI.x1 - PP_TAI.x0 + 4, 3, '#f4f6f6')),
  sp('pp_maple', '붉은 단풍', 12, PP_TAI_F, (ctx) => {
    for (let k = 0; k < 6; k++) disc(ctx, PP_TAI.x0 + 6 + k * 14, PP_TAI.y - 4, 5, '#c8502a')
  }),

  sp('pp_alone', '홀로 한가로이 오르는 사람', 22, PP_STEPS, (ctx, env) => {
    if (env.fx.ppTop) {
      standFig(ctx, PP_TOP.x - 7, PP_TOP.y, pal({ R: '#c8c4b0', r: '#a8a490' }))
      return
    }
    const p = ppStep(0.55 + Math.sin(env.t * 0.2) * 0.05)
    standFig(ctx, p.x - 7, p.y - 22, pal({ R: '#c8c4b0', r: '#a8a490' }))
  }),
  sp('pp_crowd', '줄지어 오르는 행차', 22, PP_STEPS, (ctx) => {
    for (let k = 0; k < 6; k++) {
      const p = ppStep(0.2 + k * 0.12)
      person(ctx, p.x, p.y - 8, OTHER_PALS[k % 4].R)
    }
  }),
  sp('pp_sedan', '가마 타고 오르는 사람', 22, PP_STEPS, (ctx) => {
    const p = ppStep(0.5)
    px(ctx, p.x - 8, p.y - 12, 16, 10, '#8a3a2a')
    px(ctx, p.x - 14, p.y - 4, 28, 1, '#5a4632')
    person(ctx, p.x - 16, p.y - 8, '#6e6450')
    person(ctx, p.x + 12, p.y - 8, '#6e6450')
  }),

  sp('pp_holiday', '쉬는 날의 맑은 하늘', 6, PP_SKY, (ctx, env) => {
    sun(ctx, 60, 30, 8)
    for (let k = 0; k < 3; k++) bird(ctx, 100 + k * 16 + Math.sin(env.t * 0.4 + k) * 8, 40 + k * 4, Math.floor(env.t * 3 + k) % 2, '#4a4a52')
  }),
  sp('pp_night', '비 오는 밤', 6, PP_SKY, (ctx, env) => {
    withAlpha(ctx, 0.5, () => px(ctx, 0, 0, W, H, '#141a30'))
    rain(ctx, env.t, 60, 140, 'rgba(140,150,170,0.6)')
  }),
  sp('pp_busy', '바쁜 장날', 6, PP_SKY, (ctx) => {
    for (let k = 0; k < 4; k++) {
      px(ctx, 20 + k * 30, 150, 24, 3, ['#b2352a', '#d9a441', '#4f6b4a', '#6b5a7a'][k])
      person(ctx, 28 + k * 30, 154, OTHER_PALS[k].R)
    }
  }),

  sp('pp_hat', '신 신고 깁 두건 쓴 편한 차림', 26, PP_TAI_F, (ctx) => {
    withAlpha(ctx, 0.7, () => {
      px(ctx, PP_TOP.x - 4, PP_TOP.y - 3, 8, 3, '#2a2a34')
      px(ctx, PP_TOP.x - 2, PP_TOP.y - 5, 4, 2, '#2a2a34')
      for (let i = 0; i < 4; i++) dot(ctx, PP_TOP.x + 4 + i, PP_TOP.y - 1 + i, '#2a2a34')
    })
    px(ctx, PP_TOP.x - 5, PP_TOP.y + 21, 4, 1, '#8a6a3a')
    px(ctx, PP_TOP.x + 1, PP_TOP.y + 21, 4, 1, '#8a6a3a')
  }, { fx: { ppTop: 1 } }),
  sp('pp_armor', '갑옷과 투구', 26, PP_TAI_F, (ctx) => {
    standFig(ctx, PP_TOP.x - 7, PP_TOP.y, pal({ R: '#8a8478', r: '#6a665c', K: '#5a5a62' }))
  }),
  sp('pp_robe', '관복과 사모', 26, PP_TAI_F, (ctx) => {
    standFig(ctx, PP_TOP.x - 7, PP_TOP.y, pal({ R: '#a8382a', r: '#7a2a20' }))
    px(ctx, PP_TOP.x - 6, PP_TOP.y - 1, 12, 2, '#1f1d22')
  }),
]

// ════════════════════════════════════════════════════════════
// 張籍〈寄西峰僧〉: 잠 못 드는 밤과 서봉의 달
// ════════════════════════════════════════════════════════════
const XF_GROUND = 140
const XF_WIN = { x: 222, y: 116, w: 18, h: 12 }
const XF_PEAK = (x: number) => 46 + Math.abs(x - 70) * 0.9 + 4 * Math.sin(x * 0.1)
const XF_VIG = { cx: 150, cy: 64, rx: 46, ry: 28 }

export const xifengBackground: Background = {
  id: 'hy093',
  drawBack(ctx) {
    sky(ctx, ['#121828', '#1a2236', '#242c42'], XF_GROUND)
    stars(ctx, 16, 91, 4, 60, 0, '#8a90a8')
    ridge(ctx, XF_PEAK, '#1e2632', '#2a3240', 0, 200, XF_GROUND)
    ridge(ctx, (x) => 104 + 6 * Math.sin(x * 0.03), '#161c24', '#1c222c', 0, W, XF_GROUND)
    px(ctx, 0, XF_GROUND, W, H - XF_GROUND, '#181e1a')
    for (let k = 0; k < 4; k++) pine(ctx, 30 + k * 28, XF_GROUND + 4, 1.3 + (k % 2) * 0.3, 0, { dark: '#0e1612', base: '#141e18', light: '#1a261e' })
    // 집
    px(ctx, 200, 108, 80, 32, '#3a342c')
    for (let r = 0; r < 6; r++) px(ctx, 202 - r, 100 + r, 76 + r * 2, 1, '#2a2620')
    px(ctx, XF_WIN.x, XF_WIN.y, XF_WIN.w, XF_WIN.h, '#1e1a16')
  },
  drawFront() {},
  drawDynamic() {},
}

const XF_BROOK = { x: 0, y: 112, w: 160, h: 68 }
const XF_HOUSE = { x: 184, y: 92, w: 112, h: 63 }
const XF_SKY = { x: 0, y: 8, w: 192, h: 108 }

export const XIFENG_SPRITES = [
  sp('xf_brook', '어두운 솔숲에 졸졸 흐르는 물', 12, XF_BROOK, (ctx, env) => {
    for (let t = 0; t <= 1; t += 0.004) {
      const x = 10 + t * 170
      const y = 150 + Math.sin(t * 8) * 6 + t * 10
      px(ctx, x, y, 2, 3, Math.sin(t * 90 - env.t * 3) > 0.85 ? '#a8b8d0' : '#3a4a62')
    }
    soundArcs(ctx, 80, 154, env.t * 0.8, '#5a6a88', 12)
  }),
  sp('xf_fall', '폭포', 12, XF_BROOK, (ctx, env) => {
    for (let y = 100; y < 160; y++) px(ctx, 100, y, 4, 1, Math.sin(y * 0.5 - env.t * 10) > 0 ? '#8a9ab8' : '#4a5a78')
  }),
  sp('xf_dry', '마른 바위', 12, XF_BROOK, (ctx) => {
    for (let k = 0; k < 5; k++) stone(ctx, 30 + k * 28, 160, 5, '#4a4e50', '#363a3c')
  }),

  sp('xf_awake', '잠 못 드는 사람', 22, XF_HOUSE, (ctx, env) => {
    withAlpha(ctx, 0.7 + Math.sin(env.t * 4) * 0.05, () => px(ctx, XF_WIN.x, XF_WIN.y, XF_WIN.w, XF_WIN.h, '#e0b860'))
    px(ctx, XF_WIN.x + 6, XF_WIN.y + 4, 3, 3, '#e6c39b')
    px(ctx, XF_WIN.x + 5, XF_WIN.y + 7, 5, 5, '#4b5068')
    px(ctx, XF_WIN.x + 6, XF_WIN.y + 3, 3, 1, '#1f1d22')
    withAlpha(ctx, 0.15, () => disc(ctx, XF_WIN.x + 9, XF_WIN.y + 6, 16, '#ffd27a'))
  }),
  sp('xf_asleep', '곤히 잠든 사람', 22, XF_HOUSE, (ctx, env) => {
    for (let k = 0; k < 3; k++) {
      const f = mod(env.t * 0.4 + k / 3, 1)
      withAlpha(ctx, 1 - f, () => px(ctx, XF_WIN.x + 12 + f * 6 + k * 2, XF_WIN.y - 2 - f * 10 - k * 3, 3, 1, '#8a94b0'))
    }
  }),
  sp('xf_drink', '술에 취한 사람', 22, XF_HOUSE, (ctx) => {
    withAlpha(ctx, 0.7, () => px(ctx, XF_WIN.x, XF_WIN.y, XF_WIN.w, XF_WIN.h, '#e0b860'))
    px(ctx, XF_WIN.x + 4, XF_WIN.y + 6, 4, 5, '#8a6a4a')
  }),

  sp('xf_moon', '서쪽 봉우리에 아직 남은 달', 6, XF_SKY, (ctx) => {
    moon(ctx, 52, 30, 8)
    withAlpha(ctx, 0.25, () => {
      for (let x = 20; x < 120; x++) dot(ctx, x, Math.round(XF_PEAK(x)), '#c8d0e0')
    })
  }),
  sp('xf_sun', '떠오르는 해', 6, XF_SKY, (ctx) => {
    sky(ctx, ['#3a3a5a', '#8a6a6a', '#d8906a'], 100)
    sun(ctx, 52, 60, 8, '#f0a050')
    ridge(ctx, XF_PEAK, '#1e2632', '#2a3240', 0, 200, XF_GROUND)
  }),
  sp('xf_cloud', '검은 구름', 6, XF_SKY, (ctx) => {
    for (const [x, y, w] of [[10, 24, 100], [40, 34, 90]] as const) px(ctx, x, y, w, 8, '#2e3448')
  }),

  sp('xf_hut', '그리운 스님의 초당', 24, XF_SKY, (ctx) => vignette(ctx, XF_VIG.cx, XF_VIG.cy, XF_VIG.rx, XF_VIG.ry, (c) => {
    sky(c, ['#c8d0dc', '#d8dce0'], 100)
    for (let k = 0; k < 3; k++) pine(c, 116 + k * 30, 84, 0.9)
    hut(c, XF_VIG.cx - 10, 70)
    seatFig(c, XF_VIG.cx + 14, 68, MONK)
  })),
  sp('xf_palace', '궁궐', 24, XF_SKY, (ctx) => vignette(ctx, XF_VIG.cx, XF_VIG.cy, XF_VIG.rx, XF_VIG.ry, (c) => {
    px(c, 120, 60, 60, 20, '#b8352a')
    px(c, 116, 54, 68, 6, '#c89a3a')
  })),
  sp('xf_market', '저잣거리', 24, XF_SKY, (ctx) => vignette(ctx, XF_VIG.cx, XF_VIG.cy, XF_VIG.rx, XF_VIG.ry, (c) => {
    for (let k = 0; k < 3; k++) house(c, 112 + k * 26, 62)
  })),
]

// ════════════════════════════════════════════════════════════
// 白居易〈秋夕〉: 가을밤 홀로 누운 방
// ════════════════════════════════════════════════════════════
const QX_FLOOR = 146
const QX_WIN = { x: 150, y: 88, w: 30, h: 24 }
const QX_BED = { x: 200, y: 130, w: 84 }
const QX_TREE = { x: 56, y: QX_FLOOR }

export const qiuxiBackground: Background = {
  id: 'hy094',
  drawBack(ctx) {
    sky(ctx, ['#121828', '#1a2236', '#222c40'], QX_FLOOR)
    stars(ctx, 12, 101, 4, 60, 0, '#8a90a8')
    px(ctx, 0, QX_FLOOR, W, H - QX_FLOOR, '#1e2420')
    // 바깥 나무
    px(ctx, QX_TREE.x - 3, QX_TREE.y - 70, 6, 70, '#2e241c')
    for (let k = 0; k < 10; k++) disc(ctx, QX_TREE.x - 26 + hash(k * 2.1) * 52, QX_TREE.y - 86 + hash(k * 3.3) * 30, 7, '#3a3424')
    // 방 (단면)
    px(ctx, 120, 66, 200, 80, '#4a4238')
    px(ctx, 114, 58, 206, 8, '#2a2620')
    px(ctx, 126, 72, 188, 74, '#5a5246')
    px(ctx, QX_WIN.x, QX_WIN.y, QX_WIN.w, QX_WIN.h, '#1a2030')
    for (let x = QX_WIN.x; x <= QX_WIN.x + QX_WIN.w; x += 6) px(ctx, x, QX_WIN.y, 1, QX_WIN.h, '#6b4a32')
    px(ctx, QX_BED.x, QX_BED.y, QX_BED.w, 4, '#6a4a32')
    for (const x of [QX_BED.x + 2, QX_BED.x + QX_BED.w - 4]) px(ctx, x, QX_BED.y + 4, 2, 12, '#4a3424')
    px(ctx, QX_BED.x + 2, QX_BED.y - 2, QX_BED.w - 4, 2, '#8a8270')
  },
  drawFront() {},
  drawDynamic() {},
}

const QX_TREE_F = { x: 0, y: 40, w: 128, h: 108 }
const QX_WIN_F = { x: 120, y: 56, w: 128, h: 90 }
const QX_BED_F = { x: 184, y: 96, w: 112, h: 63 }

export const QIUXI_SPRITES = [
  sp('qx_leaves', '비 오듯 지는 잎 소리', 20, QX_TREE_F, (ctx, env) => {
    for (let i = 0; i < 30; i++) {
      const f = mod(hash(i * 2.3) + env.t * (0.12 + hash(i) * 0.08), 1)
      const x = QX_TREE.x - 30 + hash(i * 1.7) * 70 + f * 10 + Math.sin(env.t * 3 + i) * 2
      px(ctx, x, 60 + f * 86, 1, 2, ['#8a6a3a', '#a8762a', '#6a4a2a'][i % 3])
    }
    soundArcs(ctx, QX_TREE.x, 100, env.t, '#6a7488', 30)
  }),
  sp('qx_drum', '북소리', 20, QX_TREE_F, (ctx, env) => {
    disc(ctx, 40, 130, 6, '#8a3a2a')
    if (Math.sin(env.t * 4) > 0.5) soundArcs(ctx, 40, 130, env.t, '#a8b0c8', 16)
  }),
  sp('qx_song', '노랫소리', 20, QX_TREE_F, (ctx, env) => {
    for (let k = 0; k < 3; k++) {
      const f = mod(env.t * 0.5 + k / 3, 1)
      withAlpha(ctx, 1 - f, () => px(ctx, 40 + f * 20, 110 - f * 20, 2, 3, '#a8b0c8'))
    }
  }),

  sp('qx_moon', '서리처럼 흰 달빛', 14, QX_WIN_F, (ctx) => {
    moon(ctx, 98, 34, 8)
    withAlpha(ctx, 0.75, () => px(ctx, QX_WIN.x + 1, QX_WIN.y + 1, QX_WIN.w - 2, QX_WIN.h - 2, '#c8d0e0'))
    for (let x = QX_WIN.x; x <= QX_WIN.x + QX_WIN.w; x += 6) px(ctx, x, QX_WIN.y, 1, QX_WIN.h, '#6b4a32')
    withAlpha(ctx, 0.45, () => fillRows(ctx, QX_WIN.y + QX_WIN.h, QX_FLOOR, (y) => {
      const d = y - QX_WIN.y - QX_WIN.h
      return [QX_WIN.x + d * 0.9, QX_WIN.x + QX_WIN.w + d * 1.6]
    }, '#e8eef4'))
  }),
  sp('qx_red', '붉은 달빛', 14, QX_WIN_F, (ctx) => {
    disc(ctx, 98, 34, 8, '#d8603a')
    withAlpha(ctx, 0.5, () => px(ctx, QX_WIN.x + 1, QX_WIN.y + 1, QX_WIN.w - 2, QX_WIN.h - 2, '#d8603a'))
  }),
  sp('qx_dark', '달 없는 캄캄한 밤', 14, QX_WIN_F, (ctx) => withAlpha(ctx, 0.4, () => px(ctx, 0, 0, W, H, '#05070c'))),

  sp('qx_alone', '밤 깊어 홀로 누운 시인', 22, QX_BED_F, (ctx) => {
    px(ctx, QX_BED.x + 14, QX_BED.y - 6, 50, 4, '#4b5068')
    px(ctx, QX_BED.x + 64, QX_BED.y - 7, 5, 5, '#e6c39b')
    px(ctx, QX_BED.x + 64, QX_BED.y - 8, 5, 2, '#1f1d22')
    px(ctx, QX_BED.x + 68, QX_BED.y - 5, 6, 3, '#d8d0bc')
  }),
  sp('qx_guest', '손님과 담소하는 시인', 22, QX_BED_F, (ctx) => {
    seatFig(ctx, QX_BED.x + 10, QX_BED.y - 18, pal())
    seatFig(ctx, QX_BED.x + 40, QX_BED.y - 18, pal(OTHER_PALS[0]), true)
  }),
  sp('qx_work', '일하러 나가는 시인', 22, QX_BED_F, (ctx) => standFig(ctx, QX_BED.x - 20, QX_FLOOR - 22, pal())),

  sp('qx_dust', '먼지 앉은 침상', 26, QX_BED_F, (ctx, env) => {
    withAlpha(ctx, 0.35, () => px(ctx, QX_BED.x, QX_BED.y - 1, QX_BED.w, 5, '#a8a49a'))
    for (let k = 0; k < 14; k++) {
      const x = QX_BED.x + hash(k * 2.7) * QX_BED.w
      const y = QX_BED.y - 20 + mod(hash(k * 3.1) * 20 + env.t * 2, 20)
      withAlpha(ctx, 0.6, () => dot(ctx, x + Math.sin(env.t + k) * 2, y, '#d8d4c8'))
    }
  }),
  sp('qx_flowers', '꽃으로 꾸민 침상', 26, QX_BED_F, (ctx) => {
    for (let k = 0; k < 8; k++) flower(ctx, QX_BED.x + 6 + k * 10, QX_BED.y - 1, '#e88aa0', '#f4d060')
  }),
  sp('qx_silk', '새 비단을 깐 침상', 26, QX_BED_F, (ctx) => px(ctx, QX_BED.x + 2, QX_BED.y - 3, QX_BED.w - 4, 3, '#c8402a')),
]

// ════════════════════════════════════════════════════════════
// 白居易〈湖上夜飲〉: 성 밖 호수의 밤배
// ════════════════════════════════════════════════════════════
const HB_WATER = 112
const HB_BOAT = { x: 200, y: 150 }
const HB_WILLOW = { x: 110, y: 116 }

export const hushangBackground: Background = {
  id: 'hy095',
  drawBack(ctx) {
    sky(ctx, ['#121a2e', '#1a2440', '#26304c'], HB_WATER)
    stars(ctx, 16, 111, 4, 60, 0, '#a8acc4')
    ridge(ctx, (x) => 96 + 6 * Math.sin(x * 0.02 + 1), '#161c26', '#1e2430', 0, W, HB_WATER)
    // 성벽 (왼쪽)
    px(ctx, 0, 88, 96, 30, '#2e2c2a')
    for (let x = 0; x < 96; x += 8) px(ctx, x, 84, 5, 4, '#2e2c2a')
    px(ctx, 30, 72, 34, 16, '#262422')
    px(ctx, 26, 68, 42, 4, '#1e1c1a')
    water(ctx, HB_WATER, H, '#1e2a42', '#16203a', '#2e3c5a')
    boat(ctx, HB_BOAT.x, HB_BOAT.y, { len: 46, hull: '#4a3020' })
    px(ctx, HB_BOAT.x - 14, HB_BOAT.y - 16, 28, 2, '#3a2a1e')
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    shimmer(ctx, env.t, HB_WATER + 3, 178, 12, '#3e4e6e', 96, W)
    const sway = env.wind * 4 * Math.sin(env.t * 2)
    px(ctx, HB_WILLOW.x - 1, HB_WILLOW.y - 30, 3, 30, '#2a2420')
    for (let k = 0; k < 12; k++) for (let i = 0; i < 26; i++) dot(ctx, HB_WILLOW.x - 16 + k * 3 + sway * (i / 26), HB_WILLOW.y - 32 + i, '#243424')
  },
}

const HB_SKY = { x: 0, y: 8, w: 160, h: 108 }
const HB_SHORE = { x: 64, y: 76, w: 128, h: 72 }
const HB_BOAT_F = { x: 144, y: 112, w: 112, h: 63 }

export const HUSHANG_SPRITES = [
  sp('hb_moon', '성 밖에서 사람을 맞는 달', 6, HB_SKY, (ctx, env) => {
    moon(ctx, 120, 36, 9)
    withAlpha(ctx, 0.5, () => {
      for (let y = HB_WATER + 4; y < 176; y += 3) {
        const w = 4 + (y - HB_WATER) * 0.12 + Math.sin(env.t * 2 + y) * 2
        px(ctx, 120 - w / 2 + (y - HB_WATER) * 0.6, y, w, 1, '#f4ecc8')
      }
    })
  }),
  sp('hb_sun', '한낮의 해', 6, HB_SKY, (ctx) => {
    sky(ctx, ['#a8c4dc', '#bcd2e2'], 84)
    sun(ctx, 120, 36, 9)
  }),
  sp('hb_lanterns', '등불 행렬', 6, HB_SKY, (ctx, env) => {
    for (let k = 0; k < 8; k++) px(ctx, 6 + k * 11, 82, 3, 4, Math.sin(env.t * 3 + k) > -0.5 ? '#e04a3a' : '#c03a2a')
  }),

  sp('hb_wind', '호숫가의 술 깨는 바람', 12, HB_SHORE, (ctx, env) => {
    for (let k = 0; k < 8; k++) withAlpha(ctx, 0.4, () => px(ctx, mod(hash(k) * 300 + env.t * 40, 330) - 10, 100 + k * 9, 16, 1, '#8a9ab8'))
  }, { wind: 0.7 }),
  sp('hb_rain', '장대비', 12, HB_SHORE, (ctx, env) => rain(ctx, env.t, 70, 140, 'rgba(140,150,170,0.6)')),
  sp('hb_snow', '눈보라', 12, HB_SHORE, (ctx, env) => snowfall(ctx, env.t, 80)),

  sp('hb_party', '사또를 붙드는 배 위의 술자리', 22, HB_BOAT_F, (ctx) => {
    seatFig(ctx, HB_BOAT.x - 22, HB_BOAT.y - 19, pal({ R: '#a8382a', r: '#7a2a20' }))
    seatFig(ctx, HB_BOAT.x + 6, HB_BOAT.y - 19, pal(OTHER_PALS[1]), true)
    px(ctx, HB_BOAT.x - 4, HB_BOAT.y - 6, 8, 3, '#8a6a4a')
    px(ctx, HB_BOAT.x - 2, HB_BOAT.y - 9, 3, 3, '#6a4a32')
  }),
  sp('hb_alone', '홀로 앉은 사람', 22, HB_BOAT_F, (ctx) => seatFig(ctx, HB_BOAT.x - 8, HB_BOAT.y - 19, pal())),
  sp('hb_child', '잠든 아이', 22, HB_BOAT_F, (ctx) => px(ctx, HB_BOAT.x - 6, HB_BOAT.y - 6, 12, 3, '#d8a040')),

  sp('hb_candle', '배 안의 붉은 촛불', 26, HB_BOAT_F, (ctx, env) => {
    for (const dx of [-18, 18]) {
      const x = HB_BOAT.x + dx
      px(ctx, x, HB_BOAT.y - 12, 2, 6, '#c8302a')
      px(ctx, x, HB_BOAT.y - 14, 2, 2, Math.sin(env.t * 7 + dx) > -0.4 ? '#ffd27a' : '#f0a845')
      withAlpha(ctx, 0.25, () => disc(ctx, x + 1, HB_BOAT.y - 12, 9, '#ffb060'))
      withAlpha(ctx, 0.45, () => {
        for (let y = HB_BOAT.y + 3; y < 176; y += 3) px(ctx, x - 1 + Math.sin(env.t * 2 + y) * 1.5, y, 3, 1, '#ffb060')
      })
    }
  }),
  sp('hb_dark', '꺼진 등', 26, HB_BOAT_F, (ctx) => withAlpha(ctx, 0.3, () => px(ctx, HB_BOAT.x - 30, HB_BOAT.y - 24, 60, 30, '#05070c'))),
  sp('hb_torch', '횃불', 26, HB_BOAT_F, (ctx, env) => {
    px(ctx, HB_BOAT.x + 22, HB_BOAT.y - 22, 2, 18, '#5a4632')
    px(ctx, HB_BOAT.x + 21, HB_BOAT.y - 26, 4, 4, Math.sin(env.t * 8) > 0 ? '#ffb040' : '#e8702a')
  }),
]

// ════════════════════════════════════════════════════════════
// 孫革〈訪羊尊師〉: 소나무 아래 동자와 구름 깊은 산
// ════════════════════════════════════════════════════════════
const YZ_GROUND = 144
const YZ_PINE = { x: 70, y: YZ_GROUND }
const YZ_HERB = { x: 196, y: 100 }
const yzMountain = (x: number) => 50 + Math.abs(x - 200) * 0.62 + 6 * Math.sin(x * 0.08)

export const fangyangBackground: Background = {
  id: 'hy096',
  drawBack(ctx) {
    sky(ctx, ['#c0d0dc', '#ccdae0', '#d8e2e0'], YZ_GROUND)
    ridge(ctx, yzMountain, '#7a9a84', '#86a690', 60, W, YZ_GROUND)
    ridge(ctx, (x) => 118 + 6 * Math.sin(x * 0.03), '#6a8a6a', '#769676', 0, W, YZ_GROUND)
    px(ctx, 0, YZ_GROUND, W, H - YZ_GROUND, '#7e9a62')
    pine(ctx, YZ_PINE.x, YZ_PINE.y, 2.2)
    standFig(ctx, 20, YZ_GROUND - 22, pal())
  },
  drawFront() {},
  drawDynamic() {},
}

const YZ_PINE_F = { x: 8, y: 96, w: 128, h: 72 }
const YZ_SLOPE = { x: 144, y: 60, w: 112, h: 63 }
const YZ_MT = { x: 80, y: 32, w: 240, h: 135 }

export const FANGYANG_SPRITES = [
  sp('yz_boy', '소나무 아래 동자', 22, YZ_PINE_F, (ctx) => {
    standFig(ctx, YZ_PINE.x + 8, YZ_GROUND - 17, pal({ R: '#d8c8a0', r: '#b8a880', K: '#1f1d22', B: '#e6c39b' }), true, 0.78)
    for (let i = 0; i < 6; i++) dot(ctx, YZ_PINE.x + 20 + i * 1.5, YZ_GROUND - 12 - i, '#d8c8a0')
  }),
  sp('yz_old', '나무하는 노인', 22, YZ_PINE_F, (ctx) => {
    standFig(ctx, YZ_PINE.x + 8, YZ_GROUND - 22, pal({ B: '#d8d4c8', H: '#d8d4c8' }), true)
    px(ctx, YZ_PINE.x + 22, YZ_GROUND - 18, 8, 12, '#8a6a48')
  }),
  sp('yz_deer', '사슴', 22, YZ_PINE_F, (ctx) => {
    px(ctx, YZ_PINE.x + 10, YZ_GROUND - 12, 14, 6, '#a8764a')
    px(ctx, YZ_PINE.x + 22, YZ_GROUND - 18, 4, 7, '#a8764a')
    for (const d of [11, 14, 20, 23]) px(ctx, YZ_PINE.x + d, YZ_GROUND - 6, 1, 6, '#6a4a2a')
  }),

  sp('yz_herb', '약 캐러 간 스승', 20, YZ_SLOPE, (ctx, env) => {
    const b = Math.sin(env.t * 2) > 0 ? 1 : 0
    person(ctx, YZ_HERB.x, YZ_HERB.y + b, '#d8dce4', { hat: '#3a3a4a' })
    px(ctx, YZ_HERB.x + 3, YZ_HERB.y + 3, 4, 4, '#a8864a')
    px(ctx, YZ_HERB.x - 2, YZ_HERB.y - 2, 1, 10, '#6a4a32')
    for (let i = 0; i < 3; i++) dot(ctx, YZ_HERB.x + 4 + i, YZ_HERB.y + 2, '#5a9a4a')
  }),
  sp('yz_fish', '낚시하러 간 스승', 20, YZ_SLOPE, (ctx) => {
    px(ctx, 150, 130, 80, 6, '#8ab4c0')
    person(ctx, 190, 120, '#d8dce4')
  }),
  sp('yz_market', '장 보러 간 스승', 20, YZ_SLOPE, (ctx) => {
    for (let k = 0; k < 3; k++) house(ctx, 160 + k * 26, 108)
  }),

  sp('yz_mountain', '이 산속', 10, YZ_MT, (ctx) => {
    for (let k = 0; k < 24; k++) {
      const x = 110 + hash(k * 2.3) * 180
      const top = yzMountain(x)
      const y = top + 10 + hash(k * 3.7) * Math.max(4, YZ_GROUND - top - 30)
      pine(ctx, x, y, 0.5, 0, { dark: '#3e5a44', base: '#4e6a52', light: '#5e7a62' })
    }
    withAlpha(ctx, 0.6, () => {
      for (let t = 0; t < 1; t += 0.02) if (Math.sin(t * 60) > 0) dot(ctx, YZ_PINE.x + 30 + t * 110, YZ_GROUND - 4 - t * 40 + Math.sin(t * 8) * 4, '#e8dcc0')
    })
  }),
  sp('yz_river', '강 건너', 10, YZ_MT, (ctx) => px(ctx, 100, 126, 220, 10, '#8ab4c0')),
  sp('yz_city', '성안', 10, YZ_MT, (ctx) => {
    px(ctx, 140, 110, 120, 16, '#8a8274')
    for (let x = 140; x < 260; x += 8) px(ctx, x, 106, 5, 4, '#8a8274')
  }),

  sp('yz_clouds', '구름이 깊어 알 수 없는 곳', 28, YZ_MT, (ctx, env) => {
    for (let k = 0; k < 14; k++) {
      const x = 110 + mod(hash(k * 2.1) * 200 + env.t * 1.5, 200)
      const y = 70 + hash(k * 3.9) * 40
      const r = 8 + Math.round(hash(k) * 6)
      fillRows(ctx, y - r * 0.5, y + r * 0.3, (yy) => {
        const d = (yy - y) / (r * 0.5)
        const w = r * 2 * Math.sqrt(Math.max(0, 1 - d * d))
        return [x - w, x + w]
      }, (yy) => (yy < y - r * 0.15 ? '#fbfbf8' : '#e4e8ea'))
    }
    mistBands(ctx, env.t * 0.5, [84, 96, 108], '#ffffff', 0.6)
  }),
  sp('yz_clear', '맑게 갠 산', 28, YZ_MT, (ctx) => sun(ctx, 120, 40, 8)),
  sp('yz_rain', '비 쏟아지는 산', 28, YZ_MT, (ctx, env) => rain(ctx, env.t, 70, 140, 'rgba(150,165,180,0.7)')),
]

