// 장면 합성기: 배경 + 획득한 레이어 + (반투명) 미리보기 레이어
import { H, W, ctx2d, makeCanvas, px } from './pixel'
import type { Ctx, Env } from './pixel'
import { getBackground, getSprite } from './registry'
import type { Sprite } from './types'

export interface SceneState {
  background: string
  /** 정답으로 획득한 스프라이트 id (획득 순서) */
  placed: string[]
  /** 미리보기 중인 스프라이트 id */
  preview?: string | null
  /** 막 획득한 레이어의 등장 연출 */
  appear?: { id: string; at: number } | null
  t: number
}

const bgCache = new Map<string, { back: HTMLCanvasElement; front: HTMLCanvasElement }>()
function cached(id: string) {
  let c = bgCache.get(id)
  if (!c) {
    const bg = getBackground(id)
    const back = makeCanvas()
    const front = makeCanvas()
    bg.drawBack(ctx2d(back))
    bg.drawFront(ctx2d(front))
    c = { back, front }
    bgCache.set(id, c)
  }
  return c
}

// 이미지 스프라이트 (이후 PNG 교체용)
const imgCache = new Map<string, HTMLImageElement>()
function drawSprite(ctx: Ctx, s: Sprite, env: Env) {
  if (s.image) {
    let img = imgCache.get(s.image.src)
    if (!img) {
      img = new Image()
      img.src = s.image.src
      imgCache.set(s.image.src, img)
    }
    if (img.complete && img.naturalWidth) {
      const frames = s.image.frames ?? 1
      const fw = img.naturalWidth / frames
      const f = Math.floor(env.t * (s.image.fps ?? 6)) % frames
      ctx.drawImage(img, f * fw, 0, fw, img.naturalHeight, s.image.x, s.image.y, fw, img.naturalHeight)
      return
    }
  }
  s.draw(ctx, env)
}

let scratch: HTMLCanvasElement | null = null
function drawWithAlpha(ctx: Ctx, s: Sprite, env: Env, alpha: number) {
  if (!scratch) scratch = makeCanvas()
  const sc = ctx2d(scratch)
  sc.clearRect(0, 0, W, H)
  drawSprite(sc, s, env)
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.drawImage(scratch, 0, 0)
  ctx.restore()
}

export function sceneWind(placed: string[], preview?: string | null) {
  let wind = 0
  for (const id of placed) {
    const s = getSprite(id)
    if (s.wind !== undefined) wind = s.wind
  }
  if (preview) {
    const p = getSprite(preview)
    if (p.wind !== undefined) wind = p.wind
  }
  return wind
}

export function sceneFx(placed: string[], preview?: string | null) {
  const fx: Record<string, number> = {}
  for (const id of preview && !placed.includes(preview) ? [...placed, preview] : placed) {
    const s = getSprite(id)
    if (s.fx) Object.assign(fx, s.fx)
  }
  return fx
}

export function renderScene(ctx: Ctx, st: SceneState) {
  const bg = getBackground(st.background)
  const { back, front } = cached(st.background)
  const env: Env = { t: st.t, wind: sceneWind(st.placed, st.preview), fx: sceneFx(st.placed, st.preview) }

  type Item = { s: Sprite; alpha: number }
  const items: Item[] = st.placed.map((id) => {
    let alpha = 1
    if (st.appear && st.appear.id === id) alpha = Math.min(1, Math.max(0, (st.t - st.appear.at) / 0.6))
    return { s: getSprite(id), alpha }
  })
  if (st.preview && !st.placed.includes(st.preview)) {
    items.push({ s: getSprite(st.preview), alpha: 0.55 + 0.13 * Math.sin(st.t * 5) })
  }
  items.sort((a, b) => a.s.z - b.s.z)

  const draw = (it: Item) => {
    if (it.alpha >= 1) drawSprite(ctx, it.s, env)
    else if (it.alpha > 0) drawWithAlpha(ctx, it.s, env, it.alpha)
  }

  ctx.imageSmoothingEnabled = false
  ctx.clearRect(0, 0, W, H)
  ctx.drawImage(back, 0, 0)
  items.filter((i) => i.s.z < 20).forEach(draw)
  ctx.drawImage(front, 0, 0)
  bg.drawDynamic(ctx, env)
  items.filter((i) => i.s.z >= 20).forEach(draw)

  // 획득 반짝임
  if (st.appear) {
    const dt = st.t - st.appear.at
    if (dt >= 0 && dt < 1.2) {
      const f = getSprite(st.appear.id).focus
      const cx = f.x + f.w / 2
      const cy = f.y + f.h / 2
      const R = Math.max(f.w, f.h) * 0.25 + dt * 30
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2 + dt
        const x = cx + Math.cos(a) * R
        const y = cy + Math.sin(a) * R * 0.6
        const c = i % 2 ? '#fff6c8' : '#ffffff'
        ctx.globalAlpha = 1 - dt / 1.2
        px(ctx, x, y, 1, 1, c)
        px(ctx, x - 1, y, 3, 1, c)
        px(ctx, x, y - 1, 1, 3, c)
        ctx.globalAlpha = 1
      }
    }
  }
}
