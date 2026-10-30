// 『唐詩畫意』 卷九 둘째 묶음 (1): 王建〈早發汾南〉, 劉商〈曲水寺枳實〉〈酬問師〉, 丘丹〈和韋使君秋夜見寄〉, 權德輿〈曉〉
import type { Background } from '../types'
import { H, W, disc, dot, fillRows, hash, mod, px } from '../pixel'
import type { Ctx } from '../pixel'
import { GREEN, bamboo, bird, boat, broadTree, house, hut, mistBands, moon, person, pine, rain, ridge, sky, stars, withAlpha } from '../kit'
import { OTHER_PALS, pal, seatFig, standFig } from '../figures'
import { mix, notes, shimmer, soundArcs, sp, water } from './hy_kit'
import { vignette } from './hy_b3a'

const FULL = { x: 0, y: 0, w: 320, h: 180 }
const MONK = pal({ K: '#8a7a6a', H: '#8a7a6a', R: '#6a6458', r: '#4e4a40', L: '#8a6a3a', B: '#e6c39b' })

// ════════════════════════════════════════════════════════════
// 王建〈早發汾南〉: 새벽 다리와 고향으로 이어진 산
// ════════════════════════════════════════════════════════════
const FN_WATER = 128
const FN_BRIDGE = { x0: 56, x1: 204, y: 120 }
const FN_HOME = { x: 30, y: 78 }

export const fennanBackground: Background = {
  id: 'hy074',
  drawBack(ctx) {
    sky(ctx, ['#c8ccd8', '#d8d4d4', '#e8dcc8'], FN_WATER)
    px(ctx, 0, 108, W, FN_WATER - 108, '#9aa47a')
    water(ctx, FN_WATER, 152, '#a8b8bc', '#8aa0a8', '#c8d4d4')
    px(ctx, 0, 152, W, H - 152, '#8a9a6a')
    // 다리
    for (let x = FN_BRIDGE.x0; x < FN_BRIDGE.x1; x++) {
      const y = FN_BRIDGE.y - Math.sin(((x - FN_BRIDGE.x0) / (FN_BRIDGE.x1 - FN_BRIDGE.x0)) * Math.PI) * 6
      px(ctx, x, y, 1, 4, '#8a7a62')
      if (x % 6 === 0) px(ctx, x, y - 4, 1, 4, '#6a5a44')
    }
    for (const x of [80, 130, 180]) px(ctx, x, FN_BRIDGE.y + 2, 3, 26, '#6a5a44')
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    shimmer(ctx, env.t, FN_WATER + 2, 150, 10, '#dce4e4')
  },
}

const FN_BRIDGE_F = { x: 48, y: 84, w: 160, h: 81 }
const FN_SOUTH = { x: 152, y: 120, w: 112, h: 60 }
const FN_FAR = { x: 0, y: 40, w: 192, h: 90 }

export const FENNAN_SPRITES = [
  sp('fn_cart', '다리 위를 떠나는 수레와 말', 22, FN_BRIDGE_F, (ctx, env) => {
    const x = 90 + mod(env.t * 6, 90)
    const y = FN_BRIDGE.y - Math.sin(((x - FN_BRIDGE.x0) / (FN_BRIDGE.x1 - FN_BRIDGE.x0)) * Math.PI) * 6
    px(ctx, x + 10, y - 6, 10, 4, '#6a4a32')
    px(ctx, x + 18, y - 9, 3, 4, '#6a4a32')
    for (const d of [11, 18]) px(ctx, x + d, y - 2, 1, 2, '#4a3424')
    px(ctx, x - 6, y - 10, 14, 7, '#8a6a48')
    px(ctx, x - 7, y - 11, 16, 2, '#5a4632')
    disc(ctx, x, y - 2, 3, '#4a3424')
    person(ctx, x - 16, y - 8, '#4b5068')
  }),
  sp('fn_market', '다리 위의 장', 22, FN_BRIDGE_F, (ctx) => {
    for (let k = 0; k < 4; k++) {
      px(ctx, 70 + k * 34, 108, 22, 3, ['#b2352a', '#d9a441', '#4f6b4a', '#6b5a7a'][k])
      person(ctx, 78 + k * 34, 110, OTHER_PALS[k].R)
    }
  }),
  sp('fn_empty', '텅 빈 다리', 22, FN_BRIDGE_F, (ctx) => px(ctx, 120, 109, 2, 4, '#e8c048')),

  sp('fn_mist', '다리 남쪽의 안개 걷히는 나무', 12, FN_SOUTH, (ctx, env) => {
    for (let k = 0; k < 6; k++) broadTree(ctx, 164 + k * 18, 168, 1.2 + (k % 2) * 0.2, GREEN)
    const f = mod(env.t * 0.08, 1)
    withAlpha(ctx, 0.6 * (1 - f), () => mistBands(ctx, env.t, [150 - f * 20, 156 - f * 20, 162 - f * 20], '#f4f4f0', 1))
  }),
  sp('fn_fire', '불타는 집', 12, FN_SOUTH, (ctx, env) => {
    hut(ctx, 200, 154)
    for (let k = 0; k < 5; k++) if (Math.sin(env.t * 8 + k) > -0.3) px(ctx, 202 + k * 4, 148 - (k % 2) * 3, 3, 6, k % 2 ? '#ffb040' : '#e8702a')
  }),
  sp('fn_snow', '눈 덮인 들', 12, FN_SOUTH, (ctx) => px(ctx, 152, 152, 168, 28, '#eef2f2')),

  sp('fn_hills', '비스듬히 끝없이 이어진 푸른 산', 8, FN_FAR, (ctx) => {
    for (let k = 0; k < 7; k++) {
      const cx = 300 - k * 46
      const base = 108 - k * 4
      const h = 30 - k * 3
      const c = mix('#5a8a6a', '#a8bcb4', k / 6)
      fillRows(ctx, base - h, base + 2, (y) => {
        const w = ((y - base + h) / h) * 40
        return [cx - w, cx + w * 0.8]
      }, c)
    }
  }),
  sp('fn_peak', '우뚝 솟은 봉우리 하나', 8, FN_FAR, (ctx) => fillRows(ctx, 40, 110, (y) => [160 - (y - 40) * 0.8, 160 + (y - 40) * 0.8], '#6a8a7a')),
  sp('fn_flat', '평평한 들', 8, FN_FAR, (ctx) => px(ctx, 0, 100, W, 8, '#a8b48a')),

  sp('fn_home', '산 끝 아득한 고향', 10, FN_FAR, (ctx, env) => {
    for (let k = 0; k < 3; k++) {
      const x = FN_HOME.x + k * 9
      const y = FN_HOME.y + (k % 2)
      px(ctx, x, y + 2, 7, 4, '#d8d0bc')
      px(ctx, x - 1, y, 9, 2, '#5a5e66')
    }
    withAlpha(ctx, 0.3 + Math.sin(env.t * 1.5) * 0.1, () => disc(ctx, FN_HOME.x + 12, FN_HOME.y + 3, 10, '#ffe0a0'))
    withAlpha(ctx, 0.6, () => {
      for (let t = 0; t < 1; t += 0.03) if (Math.sin(t * 60) > 0) dot(ctx, FN_HOME.x + 26 + t * 120, FN_HOME.y + 8 + t * 24, '#f4ecd8')
    })
  }),
  sp('fn_sea', '넓은 바다', 10, FN_FAR, (ctx) => px(ctx, 0, 84, 120, 20, '#5a8aa0')),
  sp('fn_desert', '모래 사막', 10, FN_FAR, (ctx) => px(ctx, 0, 84, 120, 20, '#d8b880')),
]

// ════════════════════════════════════════════════════════════
// 劉商〈曲水寺枳實〉: 승방을 두른 탱자
// ════════════════════════════════════════════════════════════
const ZH_GROUND = 132
const ZH_MONK = { x: 96, y: 112 }
const ZH_VIG = { cx: 74, cy: 50, rx: 58, ry: 34 }
const ZH_BUSH = Array.from({ length: 9 }, (_, k) => ({ x: 120 + k * 16, y: 128 + (k % 2) * 3 }))
const ZH_ORANGES = Array.from({ length: 10 }, (_, k) => ({ x: 40 + hash(k * 2.3) * 70, y: 54 + hash(k * 4.1) * 14 }))

export const zhishiBackground: Background = {
  id: 'hy075',
  drawBack(ctx) {
    sky(ctx, ['#c4ccd0', '#d0d4d0', '#dcdcd0'], ZH_GROUND)
    ridge(ctx, (x) => 96 + 10 * Math.sin(x * 0.02 + 2), '#a0aca0', '#aab6aa', 0, W, ZH_GROUND)
    px(ctx, 0, ZH_GROUND, W, H - ZH_GROUND, '#9a9070')
    // 승방
    px(ctx, 140, 96, 110, 36, '#d8d0bc')
    px(ctx, 134, 86, 122, 10, '#3c4048')
    px(ctx, 138, 84, 114, 2, '#4a4f57')
    for (let x = 142; x < 250; x += 18) px(ctx, x, 96, 2, 36, '#6b4a32')
    px(ctx, 186, 108, 16, 24, '#5a4a3a')
  },
  drawFront() {},
  drawDynamic() {},
}

const ZH_BUSH_F = { x: 96, y: 84, w: 176, h: 90 }
const ZH_MONK_F = { x: 56, y: 88, w: 112, h: 63 }
const ZH_VIG_F = { x: 8, y: 10, w: 136, h: 80 }

function thornBush(ctx: Ctx, x: number, y: number) {
  disc(ctx, x, y, 8, '#3e5a34')
  disc(ctx, x - 2, y - 2, 6, '#4e6a40')
  for (let i = 0; i < 6; i++) dot(ctx, x - 7 + i * 3, y - 6 + (i % 2) * 12, '#2a3a24')
}

export const ZHISHI_SPRITES = [
  sp('zh_fruit', '승방을 두른 탱자 열매', 12, ZH_BUSH_F, (ctx) => {
    for (const b of ZH_BUSH) {
      thornBush(ctx, b.x, b.y)
      for (let i = 0; i < 3; i++) disc(ctx, b.x - 4 + i * 4, b.y - 3 + (i % 2) * 4, 1, i % 2 ? '#c8c040' : '#a8b040')
    }
  }),
  sp('zh_bamboo', '대나무', 12, ZH_BUSH_F, (ctx) => {
    for (let k = 0; k < 14; k++) bamboo(ctx, 116 + k * 10, 136, 40 + (k % 3) * 6)
  }),
  sp('zh_lotus', '연꽃', 12, ZH_BUSH_F, (ctx) => {
    px(ctx, 110, 136, 160, 12, '#8ab0bc')
    for (let k = 0; k < 6; k++) disc(ctx, 120 + k * 26, 140, 4, '#5a9a5a')
  }),

  sp('zh_bag', '탱자를 약 주머니에 담는 스님', 24, ZH_MONK_F, (ctx, env) => {
    thornBush(ctx, ZH_MONK.x + 22, ZH_MONK.y + 6)
    standFig(ctx, ZH_MONK.x, ZH_MONK.y, MONK)
    for (let i = 0; i < 6; i++) dot(ctx, ZH_MONK.x + 12 + i, ZH_MONK.y + 10 - i, '#6a6458')
    dot(ctx, ZH_MONK.x + 18, ZH_MONK.y + 4, '#e6c39b')
    px(ctx, ZH_MONK.x - 5, ZH_MONK.y + 12, 6, 8, '#a8864a')
    px(ctx, ZH_MONK.x - 4, ZH_MONK.y + 10, 4, 2, '#8a6a3a')
    const f = mod(env.t * 0.5, 1)
    disc(ctx, ZH_MONK.x + 18 - f * 20, ZH_MONK.y + 4 + f * 8 - Math.sin(f * 3.14) * 6, 1, '#c8c040')
  }),
  sp('zh_swing', '그네 매는 스님', 24, ZH_MONK_F, (ctx) => {
    standFig(ctx, ZH_MONK.x, ZH_MONK.y, MONK)
    for (const dx of [20, 30]) px(ctx, ZH_MONK.x + dx, 96, 1, 30, '#8a7a5a')
  }),
  sp('zh_throw', '꺾어 던지는 스님', 24, ZH_MONK_F, (ctx, env) => {
    standFig(ctx, ZH_MONK.x, ZH_MONK.y, MONK)
    const f = mod(env.t * 0.6, 1)
    px(ctx, ZH_MONK.x + 14 + f * 40, ZH_MONK.y - Math.sin(f * 3.14) * 20, 6, 1, '#4e6a40')
  }),

  sp('zh_orange', '떠올린 동정산의 귤', 20, ZH_VIG_F, (ctx) => vignette(ctx, ZH_VIG.cx, ZH_VIG.cy, ZH_VIG.rx, ZH_VIG.ry, (c) => {
    px(c, 16, 62, 120, 24, '#9ab8c4')
    fillRows(c, 36, 66, (y) => [74 - (y - 36) * 1.6, 74 + (y - 36) * 1.8], '#8aa48a')
    for (const o of ZH_ORANGES) disc(c, o.x, o.y, 3, '#4e7a40')
  })),
  sp('zh_peach', '떠올린 복숭아밭', 20, ZH_VIG_F, (ctx) => vignette(ctx, ZH_VIG.cx, ZH_VIG.cy, ZH_VIG.rx, ZH_VIG.ry, (c) => {
    for (const o of ZH_ORANGES) disc(c, o.x, o.y, 3, '#f2b8c6')
  })),
  sp('zh_grape', '떠올린 포도 덩굴', 20, ZH_VIG_F, (ctx) => vignette(ctx, ZH_VIG.cx, ZH_VIG.cy, ZH_VIG.rx, ZH_VIG.ry, (c) => {
    px(c, 30, 40, 90, 2, '#6a4a32')
    for (let k = 0; k < 6; k++) disc(c, 36 + k * 14, 48, 3, '#5a3a6a')
  })),

  sp('zh_yellow', '서리 내려 노랗게 익은 귤', 26, ZH_VIG_F, (ctx, env) => {
    for (const o of ZH_ORANGES) {
      disc(ctx, o.x + 1, o.y + 1, 1, '#f0a830')
      dot(ctx, o.x + 1, o.y, '#f8d060')
    }
    for (let k = 0; k < 12; k++) if (Math.sin(env.t * 2 + k) > 0.6) dot(ctx, 30 + hash(k * 3.1) * 90, 30 + hash(k * 5.7) * 40, '#ffffff')
  }),
  sp('zh_green', '새파래진 귤', 26, ZH_VIG_F, (ctx) => {
    for (const o of ZH_ORANGES) disc(ctx, o.x + 1, o.y + 1, 1, '#4aa040')
  }),
  sp('zh_rot', '떨어져 썩은 귤', 26, ZH_VIG_F, (ctx) => {
    for (const o of ZH_ORANGES.slice(0, 5)) disc(ctx, o.x, 72, 1, '#5a4a2a')
  }),
]

// ════════════════════════════════════════════════════════════
// 劉商〈酬問師〉: 유리 같은 허공과 좌선
// ════════════════════════════════════════════════════════════
const WM_LEDGE = 146
const WM_MONK = { x: 186, y: 128 }

export const choushiBackground: Background = {
  id: 'hy076',
  drawBack(ctx) {
    sky(ctx, ['#b8c4cc', '#c4ccd0', '#d0d4d2'], 150)
    ridge(ctx, (x) => 132 + 8 * Math.sin(x * 0.02 + 1), '#8a9a94', '#96a69e', 0, W, H)
    // 바위 턱
    fillRows(ctx, WM_LEDGE, H, (y) => [20 - (y - WM_LEDGE), 236 + (y - WM_LEDGE) * 0.5], (y) => (y % 5 === 0 ? '#7a766a' : '#8a867a'))
    px(ctx, 20, WM_LEDGE, 216, 1, '#a8a494')
    pine(ctx, 250, 166, 1.2)
  },
  drawFront() {},
  drawDynamic() {},
}

const WM_POET = { x: 40, y: 104, w: 112, h: 63 }
const WM_ZEN = { x: 136, y: 84, w: 112, h: 72 }

export const CHOUSHI_SPRITES = [
  sp('wm_void', '텅 비어 끝없는 허공', 4, FULL, (ctx) => sky(ctx, ['#5a88b8', '#7aa0c8', '#9ab8d4', '#bcd0dc', '#d4e0e4'], 150)),
  sp('wm_clouds', '구름 가득한 하늘', 4, FULL, (ctx) => {
    for (let k = 0; k < 8; k++) px(ctx, hash(k) * 280, 10 + k * 14, 60 + hash(k * 3) * 40, 8, '#e8eaec')
  }),
  sp('wm_birds', '새 떼가 덮은 하늘', 4, FULL, (ctx, env) => {
    for (let k = 0; k < 30; k++) bird(ctx, mod(hash(k) * 320 + env.t * 10, 320), 10 + hash(k * 3) * 100, Math.floor(env.t * 5 + k) % 2, '#3a3a44')
  }),

  sp('wm_glass', '유리 같은 하늘', 6, FULL, (ctx, env) => {
    withAlpha(ctx, 0.25, () => {
      for (let k = 0; k < 5; k++) {
        const o = mod(env.t * 6 + k * 70, 400) - 80
        for (let i = 0; i < 120; i++) px(ctx, o + i * 1.2, 10 + k * 22 + i * 0.5, 6, 1, '#ffffff')
      }
    })
    withAlpha(ctx, 0.12, () => px(ctx, 0, 0, W, 140, '#e8f4f8'))
  }),
  sp('wm_silk', '비단 같은 하늘', 6, FULL, (ctx, env) => {
    withAlpha(ctx, 0.3, () => {
      for (let y = 10; y < 130; y += 6) for (let x = 0; x < W; x += 2) dot(ctx, x, y + Math.sin(x * 0.05 + env.t + y) * 3, '#e8c8d8')
    })
  }),
  sp('wm_iron', '쇠 같은 하늘', 6, FULL, (ctx) => sky(ctx, ['#4a4e54', '#5a5e64', '#6a6e72'], 150)),

  sp('wm_poem', '시의 경지를 구하는 시인', 22, WM_POET, (ctx) => {
    seatFig(ctx, 70, WM_LEDGE - 16, pal())
    px(ctx, 86, WM_LEDGE - 6, 22, 5, '#f4f0e0')
    for (let c = 0; c < 5; c++) for (let r = 0; r < 2; r++) dot(ctx, 88 + c * 4, WM_LEDGE - 5 + r * 2, '#1f1d22')
  }),
  sp('wm_paint', '그림 그리는 사람', 22, WM_POET, (ctx) => {
    seatFig(ctx, 70, WM_LEDGE - 16, pal())
    px(ctx, 86, WM_LEDGE - 16, 16, 12, '#f4f0e0')
    ridge(ctx, (x) => WM_LEDGE - 10 + Math.sin(x * 0.4) * 2, '#5a6a62', undefined, 87, 101, WM_LEDGE - 4)
  }),
  sp('wm_go', '바둑 두는 사람', 22, WM_POET, (ctx) => {
    seatFig(ctx, 64, WM_LEDGE - 16, pal())
    px(ctx, 80, WM_LEDGE - 6, 12, 5, '#c8a868')
  }),

  sp('wm_zen', '시를 넘어선 선의 마음', 24, WM_ZEN, (ctx, env) => {
    withAlpha(ctx, 0.25 + Math.sin(env.t) * 0.05, () => disc(ctx, WM_MONK.x + 7, WM_MONK.y + 2, 18, '#fff4d8'))
    for (let a = 0.3; a < 6.0; a += 0.02) {
      const r = 20 + Math.sin(a * 3) * 0.6
      px(ctx, WM_MONK.x + 7 + Math.cos(a) * r, WM_MONK.y + 2 + Math.sin(a) * r, a < 1 || a > 5.6 ? 1 : 2, 2, '#2a2420')
    }
    seatFig(ctx, WM_MONK.x, WM_MONK.y + 2, MONK)
  }),
  sp('wm_sleep', '깊은 잠', 24, WM_ZEN, (ctx, env) => {
    seatFig(ctx, WM_MONK.x, WM_MONK.y + 2, MONK)
    for (let k = 0; k < 3; k++) {
      const f = mod(env.t * 0.4 + k / 3, 1)
      withAlpha(ctx, 1 - f, () => px(ctx, WM_MONK.x + 14 + f * 6 + k * 2, WM_MONK.y - 2 - f * 10 - k * 3, 3, 1, '#4a5a6a'))
    }
  }),
  sp('wm_martial', '무예 닦는 사람', 24, WM_ZEN, (ctx, env) => {
    standFig(ctx, WM_MONK.x + Math.sin(env.t * 2) * 3, WM_MONK.y - 4, MONK)
    px(ctx, WM_MONK.x + 14, WM_MONK.y + 4, 14, 1, '#5a4632')
  }),
]

// ════════════════════════════════════════════════════════════
// 丘丹〈和韋使君秋夜見寄〉: 오동과 계수꽃의 가을밤
// ════════════════════════════════════════════════════════════
const QD_GROUND = 138
const QD_TONG = { x: 56, y: QD_GROUND }
const QD_GUI = { x: 236, y: 132 }
const QD_MAN = { x: 146, y: 116 }
const QD_LEAVES = Array.from({ length: 14 }, (_, i) => ({ x: QD_TONG.x - 30 + hash(i * 2.1) * 60, y: 52 + hash(i * 3.3) * 34 }))

export const qiuyeBackground: Background = {
  id: 'hy077',
  drawBack(ctx) {
    sky(ctx, ['#141c30', '#1c2640', '#28324c'], QD_GROUND)
    stars(ctx, 18, 61, 4, 70, 0, '#a8acc4')
    ridge(ctx, (x) => 96 + 14 * Math.sin(x * 0.018 + 1.2), '#1a2230', '#222a38', 0, W, QD_GROUND)
    px(ctx, 0, QD_GROUND, W, H - QD_GROUND, '#1e2620')
    px(ctx, QD_TONG.x - 3, QD_TONG.y - 70, 6, 70, '#3a4a3a')
    for (const l of QD_LEAVES) disc(ctx, l.x, l.y, 7, '#2a3e2a')
    for (let k = 0; k < 6; k++) disc(ctx, QD_GUI.x - 20 + k * 8, QD_GUI.y - (k % 2) * 4, 9, '#1e3020')
  },
  drawFront() {},
  drawDynamic() {},
}

const QD_TONG_F = { x: 0, y: 40, w: 128, h: 108 }
const QD_GUI_F = { x: 192, y: 104, w: 96, h: 54 }
const QD_MAN_F = { x: 104, y: 92, w: 96, h: 54 }
const QD_NIGHT = { x: 80, y: 8, w: 192, h: 140 }

export const QIUYE_SPRITES = [
  sp('qd_dew', '이슬 듣는 오동잎', 22, QD_TONG_F, (ctx, env) => {
    for (let k = 0; k < 8; k++) {
      const l = QD_LEAVES[k]
      const f = mod(env.t * 0.5 + k / 8, 1)
      dot(ctx, l.x, l.y + 6 + f * 40, '#c8dcf0')
      if (f > 0.9) soundArcs(ctx, l.x, l.y + 6, 0, '#a8b8d0', 4)
    }
    for (const l of QD_LEAVES) dot(ctx, l.x + 2, l.y + 4, '#e8f0f8')
  }),
  sp('qd_rain', '굵은 빗소리', 22, QD_TONG_F, (ctx, env) => rain(ctx, env.t, 60, 140, 'rgba(150,165,190,0.7)')),
  sp('qd_bird', '새 우는 소리', 22, QD_TONG_F, (ctx, env) => {
    px(ctx, QD_TONG.x + 10, 70, 5, 4, '#4a4a52')
    soundArcs(ctx, QD_TONG.x + 14, 70, env.t, '#a8b8d0', 14)
  }),

  sp('qd_osman', '가을바람에 핀 계수꽃', 20, QD_GUI_F, (ctx, env) => {
    for (let k = 0; k < 40; k++) dot(ctx, QD_GUI.x - 26 + hash(k * 2.3) * 52, QD_GUI.y - 10 + hash(k * 3.1) * 14, k % 3 ? '#f4c840' : '#f8e080')
    withAlpha(ctx, 0.5, () => {
      for (let k = 0; k < 3; k++) {
        const f = mod(env.t * 0.3 + k / 3, 1)
        for (let i = 0; i < 10; i++) dot(ctx, QD_GUI.x - 30 - f * 50 + i * 2, QD_GUI.y - 14 - k * 4 + Math.sin(i + env.t * 2) * 2, '#f8e8a0')
      }
    })
  }),
  sp('qd_plum', '매화', 20, QD_GUI_F, (ctx) => {
    for (let k = 0; k < 16; k++) disc(ctx, QD_GUI.x - 24 + hash(k * 2.3) * 48, QD_GUI.y - 10 + hash(k * 3.1) * 12, 1, '#f4f0f0')
  }),
  sp('qd_maple', '붉은 단풍', 20, QD_GUI_F, (ctx) => {
    for (let k = 0; k < 6; k++) disc(ctx, QD_GUI.x - 20 + k * 8, QD_GUI.y - (k % 2) * 4, 8, '#8a3a2a')
  }),

  sp('qd_taoist', '신선을 배우는 벗', 22, QD_MAN_F, (ctx) => {
    standFig(ctx, QD_MAN.x, QD_MAN.y, pal({ R: '#d8dce4', r: '#a8b0c0', K: '#3a3a4a', L: '#4a6a8a' }))
    px(ctx, QD_MAN.x + 5, QD_MAN.y - 2, 3, 2, '#1f1d22')
  }),
  sp('qd_merchant', '짐 진 장사꾼', 22, QD_MAN_F, (ctx) => {
    standFig(ctx, QD_MAN.x, QD_MAN.y, pal(OTHER_PALS[3]))
    px(ctx, QD_MAN.x - 6, QD_MAN.y + 4, 8, 10, '#a8864a')
  }),
  sp('qd_hunter', '활 든 사냥꾼', 22, QD_MAN_F, (ctx) => {
    standFig(ctx, QD_MAN.x, QD_MAN.y, pal({ R: '#6a3a2a', r: '#4a2a1e' }))
    for (let i = 0; i < 14; i++) dot(ctx, QD_MAN.x + 16 + Math.sin((i / 14) * Math.PI) * 4, QD_MAN.y + 2 + i, '#8a6a48')
  }),

  sp('qd_flute', '퉁소 불며 산 달을 즐기는 벗', 26, QD_NIGHT, (ctx, env) => {
    moon(ctx, 196, 64, 9)
    px(ctx, QD_MAN.x + 10, QD_MAN.y + 7, 10, 1, '#c8b890')
    dot(ctx, QD_MAN.x + 10, QD_MAN.y + 6, '#e6c39b')
    notes(ctx, QD_MAN.x + 20, QD_MAN.y + 2, env.t, '#e8e4d0')
    withAlpha(ctx, 0.1, () => px(ctx, 0, 0, W, H, '#c8d0f0'))
  }),
  sp('qd_drum', '북 치는 벗', 26, QD_NIGHT, (ctx, env) => {
    px(ctx, QD_MAN.x + 14, QD_MAN.y + 10, 10, 10, '#8a3a2a')
    if (Math.sin(env.t * 4) > 0.5) soundArcs(ctx, QD_MAN.x + 19, QD_MAN.y + 12, env.t, '#e8e4d0', 14)
  }),
  sp('qd_sleep', '잠든 벗', 26, QD_NIGHT, (ctx, env) => {
    for (let k = 0; k < 3; k++) {
      const f = mod(env.t * 0.4 + k / 3, 1)
      withAlpha(ctx, 1 - f, () => px(ctx, QD_MAN.x + 14 + f * 6 + k * 2, QD_MAN.y - 4 - f * 10 - k * 3, 3, 1, '#8a94b0'))
    }
  }),
]

// ════════════════════════════════════════════════════════════
// 權德輿〈曉〉: 새벽 강의 돌벽과 조각 돛
// ════════════════════════════════════════════════════════════
const XW_WATER = 112
const XW_BOAT = { x: 176, y: 152 }
const XW_MAST = { x: 177, top: 98 }
const xwCliff = (y: number): [number, number] => [0, 92 - (y - 30) * 0.15 + Math.sin(y * 0.3) * 4]

export const xiaoBackground: Background = {
  id: 'hy078',
  drawBack(ctx) {
    sky(ctx, ['#141a2c', '#1e2438', '#2a3046'], XW_WATER)
    stars(ctx, 14, 71, 4, 60, 0, '#8a90a8')
    ridge(ctx, (x) => 98 + 4 * Math.sin(x * 0.03), '#181e28', '#1e2430', 0, W, XW_WATER)
    water(ctx, XW_WATER, H, '#222c40', '#1a2234', '#323e56')
    fillRows(ctx, 30, H, xwCliff, (y) => (y % 7 === 0 ? '#2e302e' : '#363834'))
    boat(ctx, XW_BOAT.x, XW_BOAT.y, { len: 30 })
    px(ctx, XW_MAST.x, XW_MAST.top, 1, XW_BOAT.y - 3 - XW_MAST.top, '#3a2a1c')
  },
  drawFront() {},
  drawDynamic(ctx, env) {
    shimmer(ctx, env.t, XW_WATER + 3, 178, 10, '#3e4c66', 100, W)
  },
}

const XW_MAST_F = { x: 136, y: 80, w: 96, h: 54 }
const XW_CLIFF_F = { x: 0, y: 16, w: 160, h: 120 }
const XW_FAR = { x: 192, y: 80, w: 128, h: 72 }

export const XIAO_SPRITES = [
  sp('xw_vane', '새벽바람에 흔들리는 돛대 끝 바람깃', 22, XW_MAST_F, (ctx, env) => {
    const a = Math.sin(env.t * 3) * 0.4
    for (let i = 0; i < 8; i++) dot(ctx, XW_MAST.x + 1 + Math.cos(a) * i, XW_MAST.top + 1 + Math.sin(a) * i + Math.sin(env.t * 9 + i) * 0.6, i % 2 ? '#e8e4d8' : '#c8c0a8')
    px(ctx, XW_MAST.x - 1, XW_MAST.top - 1, 3, 2, '#5a4632')
    for (let k = 0; k < 4; k++) withAlpha(ctx, 0.35, () => px(ctx, mod(hash(k) * 200 + env.t * 40, 200) + 120, 90 + k * 8, 14, 1, '#6a7a98'))
  }, { wind: 0.5 }),
  sp('xw_flag', '성루의 깃발', 22, XW_MAST_F, (ctx, env) => px(ctx, XW_MAST.x + 1, XW_MAST.top + Math.round(Math.sin(env.t * 3)), 10, 5, '#a8382a')),
  sp('xw_chime', '처마 풍경', 22, XW_MAST_F, (ctx, env) => {
    px(ctx, XW_MAST.x - 1, XW_MAST.top, 3, 4, '#8a7a3a')
    soundArcs(ctx, XW_MAST.x, XW_MAST.top + 2, env.t, '#c8c4b0', 10)
  }),

  sp('xw_cliff', '지는 달이 비추는 돌벽', 12, XW_CLIFF_F, (ctx) => {
    moon(ctx, 118, 36, 6)
    withAlpha(ctx, 0.35, () => {
      for (let y = 34; y < 150; y += 3) {
        const [, b] = xwCliff(y)
        px(ctx, b - 14 - hash(y) * 10, y, 10 + hash(y * 3) * 10, 2, '#c8d0dc')
      }
    })
  }),
  sp('xw_roof', '기와지붕', 12, XW_CLIFF_F, (ctx) => house(ctx, 40, 80)),
  sp('xw_forest', '깊은 숲', 12, XW_CLIFF_F, (ctx) => {
    for (let k = 0; k < 5; k++) pine(ctx, 10 + k * 16, 60 + k * 6, 0.9, 0, { dark: '#141c16', base: '#1a241c', light: '#222e24' })
  }),

  sp('xw_dawn', '차츰 열리는 새벽빛', 8, FULL, (ctx) => {
    for (let y = 40; y < XW_WATER; y++) withAlpha(ctx, ((y - 40) / 72) * 0.55, () => px(ctx, 0, y, W, 1, y > 96 ? '#e8a070' : '#a8b0c8'))
    withAlpha(ctx, 0.25, () => px(ctx, 0, XW_WATER, W, H - XW_WATER, '#c8a080'))
  }),
  sp('xw_dark', '더 짙어지는 어둠', 8, FULL, (ctx) => withAlpha(ctx, 0.4, () => px(ctx, 0, 0, W, H, '#05070c'))),
  sp('xw_lightning', '번개', 8, FULL, (ctx, env) => {
    if (Math.sin(env.t * 2) > 0.85) for (let i = 0; i < 20; i++) dot(ctx, 240 + (i % 3) - Math.floor(i / 3), 30 + i * 3, '#f4f0c8')
  }),

  sp('xw_sail', '빈 푸름 속의 조각 돛', 26, XW_FAR, (ctx, env) => {
    const x = 262 + Math.sin(env.t * 0.2) * 6
    for (let i = 0; i < 9; i++) px(ctx, x, 106 + i, 1 + Math.round(i * 0.5), 1, '#e8e0cc')
    px(ctx, x - 4, 115, 10, 2, '#3a2e22')
    withAlpha(ctx, 0.4, () => px(ctx, x - 6, 118, 14, 1, '#e8e0cc'))
  }),
  sp('xw_sand', '모래톱 위의 돛배', 26, XW_FAR, (ctx) => {
    fillRows(ctx, 118, 126, (y) => [230 - (y - 118) * 2, 300 + (y - 118) * 2], '#8a8470')
    px(ctx, 262, 108, 1, 10, '#e8e0cc')
  }),
  sp('xw_fog', '짙은 안개 속', 26, XW_FAR, (ctx, env) => mistBands(ctx, env.t, [104, 110, 116, 122], '#c8ccd8', 0.7)),
]

