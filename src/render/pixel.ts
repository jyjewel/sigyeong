// 픽셀 드로잉 기본 도구. 모든 그림은 320×180 저해상도 캔버스에 그린 뒤 확대한다.

export const W = 320
export const H = 180

export type Ctx = CanvasRenderingContext2D

/** 렌더링 시점의 환경값. 스프라이트는 이 값만 보고 그린다(상태 없음). */
export interface Env {
  /** 초 단위 시간 */
  t: number
  /** 바람 세기 0~1 */
  wind: number
  /** 레이어들이 장면에 건 상태 플래그 (예: 인물 자세, 배의 움직임) */
  fx: Record<string, number>
}

export function px(ctx: Ctx, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color
  ctx.fillRect(Math.round(x), Math.round(y), w, h)
}

export function dot(ctx: Ctx, x: number, y: number, color: string) {
  ctx.fillStyle = color
  ctx.fillRect(Math.round(x), Math.round(y), 1, 1)
}

/** 결정적 의사난수 (같은 n 이면 같은 값) */
export function hash(n: number): number {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return s - Math.floor(s)
}

export function mod(a: number, b: number) {
  return ((a % b) + b) % b
}

/** 픽셀 원(채움). shade 함수로 행마다 색을 바꿀 수 있다 */
export function disc(
  ctx: Ctx,
  cx: number,
  cy: number,
  r: number,
  color: string | ((dy: number, dx0: number, dx1: number) => string),
) {
  cx = Math.round(cx)
  cy = Math.round(cy)
  for (let dy = -r; dy <= r; dy++) {
    const half = Math.round(Math.sqrt(Math.max(0, r * r - dy * dy)))
    const c = typeof color === 'string' ? color : color(dy, -half, half)
    ctx.fillStyle = c
    ctx.fillRect(cx - half, cy + dy, half * 2 + 1, 1)
  }
}

/**
 * 문자 격자로 된 스프라이트를 그린다.
 * '.' 와 ' ' 는 투명, 나머지 문자는 palette 로 색을 찾는다.
 */
export function grid(
  ctx: Ctx,
  rows: string[],
  x: number,
  y: number,
  palette: Record<string, string>,
  flip = false,
  scale = 1,
) {
  x = Math.round(x)
  y = Math.round(y)
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r]
    for (let c = 0; c < row.length; c++) {
      const ch = row[c]
      if (ch === '.' || ch === ' ') continue
      const color = palette[ch]
      if (!color) continue
      ctx.fillStyle = color
      const cx = flip ? row.length - 1 - c : c
      ctx.fillRect(x + cx * scale, y + r * scale, scale, scale)
    }
  }
}

/** 강물 다각형처럼 행 단위로 좌우 경계가 정해진 영역을 채운다 */
export function fillRows(
  ctx: Ctx,
  y0: number,
  y1: number,
  bounds: (y: number) => [number, number],
  color: string | ((y: number) => string),
) {
  for (let y = y0; y < y1; y++) {
    const [a, b] = bounds(y)
    if (b <= a) continue
    ctx.fillStyle = typeof color === 'string' ? color : color(y)
    ctx.fillRect(Math.round(a), y, Math.round(b) - Math.round(a), 1)
  }
}

export function makeCanvas(w = W, h = H): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return c
}

export function ctx2d(c: HTMLCanvasElement): Ctx {
  const ctx = c.getContext('2d')!
  ctx.imageSmoothingEnabled = false
  return ctx
}
