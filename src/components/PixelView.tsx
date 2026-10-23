import { useEffect, useRef } from 'react'
import type { Rect } from '../data/types'
import { H, W, ctx2d, makeCanvas } from '../render/pixel'
import { renderScene } from '../render/scene'
import type { SceneState } from '../render/scene'

export const now = () => performance.now() / 1000

interface Props {
  background: string
  placed: string[]
  preview?: string | null
  appear?: { id: string; at: number } | null
  /** 지정하면 이 영역만 잘라서 확대해 보여 준다 */
  focus?: Rect
  /** 초당 프레임 (작은 미리보기는 낮춰서 부담을 줄인다) */
  fps?: number
  /** 시간을 고정하고 싶을 때 (정지 화면) */
  frozenAt?: number
  className?: string
  label?: string
}

/** 픽셀아트 장면을 그리는 캔버스. rAF 루프는 하나만 돌고, 최신 props 를 ref 로 읽는다. */
export function PixelView(props: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const propsRef = useRef(props)
  propsRef.current = props

  useEffect(() => {
    const canvas = canvasRef.current!
    const out = ctx2d(canvas)
    const off = makeCanvas()
    const offCtx = ctx2d(off)
    let raf = 0
    let last = 0
    const loop = (ms: number) => {
      raf = requestAnimationFrame(loop)
      const p = propsRef.current
      const interval = 1000 / (p.fps ?? 60)
      if (ms - last < interval - 2) return
      last = ms
      const st: SceneState = {
        background: p.background,
        placed: p.placed,
        preview: p.preview,
        appear: p.appear,
        t: p.frozenAt ?? now(),
      }
      const f = p.focus
      if (!f) {
        if (canvas.width !== W) {
          canvas.width = W
          canvas.height = H
        }
        renderScene(out, st)
      } else {
        if (canvas.width !== f.w || canvas.height !== f.h) {
          canvas.width = f.w
          canvas.height = f.h
          out.imageSmoothingEnabled = false
        }
        renderScene(offCtx, st)
        out.drawImage(off, f.x, f.y, f.w, f.h, 0, 0, f.w, f.h)
      }
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const f = props.focus
  return (
    <canvas
      ref={canvasRef}
      className={`pixel ${props.className ?? ''}`}
      width={f ? f.w : W}
      height={f ? f.h : H}
      style={{ aspectRatio: f ? `${f.w} / ${f.h}` : `${W} / ${H}` }}
      role="img"
      aria-label={props.label}
    />
  )
}

/** 정지된 장면을 이미지(data URL)로 만든다 — 도감 썸네일용 */
export function snapshot(background: string, placed: string[], t = 2.3): string {
  try {
    const c = makeCanvas()
    renderScene(ctx2d(c), { background, placed, t })
    return c.toDataURL('image/png')
  } catch {
    return ''
  }
}
