// ─────────────────────────────────────────────────────────────
//  작품·문제 데이터 타입
//  새 시를 추가할 때는 src/data/poems/ 에 Poem 객체를 하나 만들고
//  src/data/catalog.ts 에 등록하면 된다. 게임 코드는 수정하지 않는다.
// ─────────────────────────────────────────────────────────────

/** 픽셀 캔버스(320×180) 위의 사각 영역 */
export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

/** 3지선다의 보기 하나. sprite 는 src/render/sprites 에 등록된 스프라이트 id */
export interface Choice {
  label: string
  sprite: string
  correct?: boolean
}

export interface Question {
  /** 해당 구절 (원문 그대로, 독음 없음) */
  line: string
  /** 짧은 한국어 질문 */
  prompt: string
  /** 정확히 세 개 */
  choices: [Choice, Choice, Choice]
  /** 정답 확정 후 보여 줄 해설 한 문장 */
  explanation: string
  /** 오답일 때 보여 줄 짧은 안내 */
  hint: string
  /** 획득 오브젝트 이름 */
  acquire: string
  /** 선택적 주석 (예: 원문에 없는 상징 소품이라는 안내) */
  note?: string
}

/**
 * 장면. 시간 변화가 분명한 시는 여러 장면으로 나눌 수 있다.
 * from~to 는 문제 인덱스(0부터) 범위이며, 해당 범위의 문제를 푸는 동안
 * background 에 지정한 배경을 쓴다. 장면이 바뀌어도 획득 오브젝트는
 * 해당 장면의 문제에서 얻은 것만 표시한다.
 */
export interface Scene {
  id: string
  background: string
  from: number
  to: number
  label?: string
}

export interface Poem {
  id: string
  title: string
  poetId: string
  era: string
  form?: string
  /** 원문 각 구 */
  lines: string[]
  /** 구별 현대어 번역 (작업용) */
  translation: string[]
  /** 작품 해설 */
  commentary: string
  questions: Question[]
  scenes: Scene[]
  /** 완성 장면에서 쓸 장면 id (기본: 마지막 장면) */
  finaleScene?: string
}

export interface Badge {
  id: string
  name: string
  description: string
}

export interface Poet {
  id: string
  name: string
  era: string
  badge: Badge
}

/** 도감 목록의 한 항목. playable=false 면 '준비 중' 으로 표시된다 */
export interface CatalogEntry {
  id: string
  title: string
  poetId: string
  playable: boolean
  poem?: Poem
  /** 시대·주제 분류용 태그 */
  tags?: string[]
}
