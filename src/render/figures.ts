// 인물 픽셀아트. 오른쪽을 바라보는 측면 입상(14×22)과 좌상(14×16).
import { grid, px, dot } from './pixel'
import type { Ctx, Env } from './pixel'

export const FIG_W = 14
export const FIG_H = 22

export const STANDING = [
  '......KKK.....',
  '.....KKKKK....',
  '.....KKKKKK...',
  '.....HSSSS....',
  '.....HSSES....',
  '.....HSSSSS...',
  '......BSSS....',
  '......BBS.....',
  '....WRRRRR....',
  '...RRRRRRRR...',
  '...rRRRRRrR...',
  '...rRRRRRrR...',
  '...rLLLLLLR...',
  '...rRRRRRrR...',
  '...rRRRRRRR...',
  '...rRRRRRRRR..',
  '..rrRRRRRRRR..',
  '..rrRRRRRRRR..',
  '..rrRRRRRRRR..',
  '..rrRRRRRRRRR.',
  '..rrrRRRRRRRR.',
  '.....FF..FF...',
]

export const SEATED = [
  ...STANDING.slice(0, 12),
  '..rRRRRRRRRR..',
  '.rrRRRRRRRRRR.',
  '.rrRRRRRRRRRRR',
  '..rrrrrrrrrrr.',
]

export interface FigurePalette {
  K: string // 두건(幞頭)
  H: string // 귀밑머리
  S: string // 피부
  E: string // 눈
  B: string // 수염
  W: string // 깃
  R: string // 옷
  r: string // 옷 그림자
  L: string // 띠
  F: string // 신
}

export const POET_PAL: FigurePalette = {
  K: '#1f1d22',
  H: '#26232a',
  S: '#e6c39b',
  E: '#2a2020',
  B: '#4a4440',
  W: '#e8e2d0',
  R: '#4b5068',
  r: '#353a4f',
  L: '#8a6b3a',
  F: '#2a2622',
}

export const OTHER_PALS: FigurePalette[] = [
  { ...POET_PAL, R: '#7a4a3a', r: '#5a3529', L: '#c9a75a', B: '#1f1d22', H: '#1f1d22' },
  { ...POET_PAL, R: '#4f6b4a', r: '#3a5037', L: '#b58a4a', B: '#1f1d22', H: '#1f1d22' },
  { ...POET_PAL, R: '#6b5a7a', r: '#4d405a', L: '#c9a75a', B: '#2a2622', H: '#1f1d22' },
  { ...POET_PAL, R: '#8a7a55', r: '#665a3e', L: '#4b5068', B: '#1f1d22', H: '#1f1d22' },
]

/** 격자 좌표 → 화면 좌표 (flip 이면 좌우 반전) */
function gx(x: number, col: number, flip: boolean) {
  return flip ? x + FIG_W - 1 - col : x + col
}

/** 바람에 날리는 귀밑머리 한 가닥의 픽셀들 (머리 레이어들이 공유) */
export function hairStrand(x: number, y: number, env: Env, flip = false) {
  const n = env.wind > 0.3 ? Math.round(env.wind * 2) : 0
  const pts: [number, number][] = []
  for (let i = 1; i <= n; i++) {
    const wav = Math.round(Math.sin(env.t * 10 - i * 1.4) * 0.6)
    pts.push([gx(x, 5 - i, flip), y + 4 + wav])
  }
  return pts
}

export interface FigureOpts {
  flip?: boolean
  seated?: boolean
}

export function drawFigure(ctx: Ctx, x: number, y: number, pal: FigurePalette, env: Env, opts: FigureOpts = {}) {
  const flip = !!opts.flip
  const rows = opts.seated ? SEATED : STANDING
  const top = opts.seated ? y + FIG_H - SEATED.length : y
  const w = env.wind

  // 옷자락 펄럭임 (바람 반대쪽, 즉 등 뒤로)
  if (!opts.seated && w > 0) {
    for (let r = 15; r <= 20; r++) {
      const extra = Math.max(0, Math.round(w * 1.6 + w * 1.3 * Math.sin(env.t * 8 + r * 0.9)))
      for (let i = 1; i <= extra; i++) dot(ctx, gx(x, 2 - i, flip), top + r, pal.r)
    }
  }

  grid(ctx, rows, x, top, pal as unknown as Record<string, string>, flip)

  // 두건 뒷자락: 바람이 없으면 늘어지고, 바람이 불면 뒤로 날린다
  const tailLen = 3 + Math.round(w * 2)
  for (let i = 0; i < tailLen; i++) {
    let cx: number
    let cy: number
    if (w < 0.15) {
      cx = 4
      cy = 3 + i
    } else {
      cx = 4 - i
      cy = 3 + Math.round(Math.sin(env.t * (6 + w * 6) - i * 1.3) * w * 1.3) + (i > 2 ? 1 : 0)
    }
    dot(ctx, gx(x, cx, flip), top + cy, pal.K)
  }
  for (const [hx, hy] of hairStrand(x, top, env, flip)) dot(ctx, hx, hy, pal.H)
}

const CUP_C = '#dcd2bb'
const CUP_D = '#a89c84'

/** 술잔을 입가로 들어 올린 팔 (오른쪽을 볼 때 기준) */
export function drawRaisedArm(ctx: Ctx, x: number, y: number, pal: FigurePalette, flip = false, toMouth = true) {
  const arm: [number, number][] = toMouth
    ? [[9, 9], [10, 9], [10, 8], [11, 8], [11, 7]]
    : [[9, 9], [10, 9], [10, 8], [11, 7], [12, 6]]
  for (const [c, r] of arm) dot(ctx, gx(x, c, flip), y + r, pal.R)
  const hand: [number, number] = toMouth ? [12, 7] : [12, 5]
  dot(ctx, gx(x, hand[0], flip), y + hand[1], pal.S)
  const cup: [number, number][] = toMouth
    ? [[12, 5], [13, 5], [12, 6], [13, 6]]
    : [[12, 3], [13, 3], [12, 4], [13, 4]]
  cup.forEach(([c, r], i) => dot(ctx, gx(x, c, flip), y + r, i < 2 ? CUP_C : CUP_D))
}

/** 작은 술잔 하나 (바닥에 놓인 상태) */
export function drawCup(ctx: Ctx, x: number, y: number) {
  px(ctx, x - 1, y - 1, 6, 1, '#f4ecd9')
  px(ctx, x, y - 1, 4, 1, '#d9cba4') // 탁주(濁酒)
  px(ctx, x - 1, y, 6, 1, CUP_C)
  px(ctx, x, y + 1, 4, 1, CUP_C)
  px(ctx, x + 1, y + 2, 2, 1, CUP_D)
  px(ctx, x - 2, y + 3, 8, 1, 'rgba(40,30,20,0.35)')
}

/** 집 앞에 서는 아주 작은 인물 (3×8) */
export function drawMiniFigure(ctx: Ctx, x: number, y: number, robe: string, bow = 0) {
  px(ctx, x + 1 + bow, y, 2, 1, '#1f1d22')
  px(ctx, x + 1 + bow, y + 1, 2, 2, '#e6c39b')
  px(ctx, x, y + 3, 3, 4, robe)
  px(ctx, x, y + 7, 1, 1, '#2a2622')
  px(ctx, x + 2, y + 7, 1, 1, '#2a2622')
}

/** 머리 부분(앞 8행)만 바꾼 입상 격자 */
export function withHead(head: string[], body: string[] = STANDING) {
  return [...head, ...body.slice(head.length)]
}

export type Pal = Record<string, string>
export const pal = (over: Partial<FigurePalette> = {}): Pal => ({ ...POET_PAL, ...over }) as unknown as Pal

/** 정적인 입상/좌상 (격자 그대로) */
export function standFig(ctx: Ctx, x: number, y: number, p: Pal, flip = false, scale = 1) {
  grid(ctx, STANDING, x, y, p, flip, scale)
}
export function seatFig(ctx: Ctx, x: number, y: number, p: Pal, flip = false, scale = 1) {
  grid(ctx, SEATED, x, y, p, flip, scale)
}
