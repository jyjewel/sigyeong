import type { Rect } from '../data/types'
import type { Ctx, Env } from './pixel'

/**
 * 배경. 정적인 부분은 한 번만 그려서 캐시하고(back, front),
 * 바람에 흔들리는 나무처럼 움직이는 부분만 매 프레임 그린다(dynamic).
 *
 * 그리는 순서:
 *   back → z < 20 인 레이어(예: 강물) → front → dynamic → z ≥ 20 인 레이어
 */
export interface Background {
  id: string
  drawBack(ctx: Ctx): void
  drawFront(ctx: Ctx): void
  drawDynamic(ctx: Ctx, env: Env): void
}

/**
 * 스프라이트(레이어) 하나. 정답이든 오답이든 모든 보기는 스프라이트를 하나씩 가진다.
 * - focus: 미리보기 패널·선택지 카드에서 확대해 보여 줄 영역
 * - wind:  이 레이어가 장면에 바람 세기를 부여하면 그 값 (0~1)
 * - image: 이후 개별 PNG 스프라이트로 교체할 때 사용 (있으면 draw 대신 사용)
 */
export interface Sprite {
  id: string
  name: string
  z: number
  focus: Rect
  wind?: number
  /** 이 레이어가 있으면 장면 전체에 거는 상태 플래그 (다른 레이어가 읽는다) */
  fx?: Record<string, number>
  draw(ctx: Ctx, env: Env): void
  image?: { src: string; x: number; y: number; frames?: number; fps?: number }
}
