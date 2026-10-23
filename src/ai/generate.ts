// 사용자가 넣은 시를 Claude(보는 사람의 계정)로 게임 데이터 + 그리기 설명으로 만든다.
// Claude 아티팩트 안에서만 동작한다(window.claude.use('sample')).
import type { Choice, Poem, Question } from '../data/types'
import { ELEMENT_DOC } from './art'
import type { ArtLayer, ArtSpec, RawElement } from './art'

export interface UserPoemInput {
  text: string
  title?: string
  poet?: string
}

export interface GeneratedPoem {
  poem: Poem
  art: ArtSpec
}

// ── Claude 아티팩트 런타임 (타입은 필요한 만큼만) ─────────────
interface SampleError {
  code: string
  message: string
  text?: string
}
interface SampleFn {
  json: <T>(input: string, opts?: { onText?: (u: { text: string }) => void; signal?: AbortSignal; modelTier?: string; cache?: boolean }) => Promise<T>
}
declare global {
  interface Window {
    claude?: { use: (name: string) => Promise<unknown> }
  }
}

let samplePromise: Promise<SampleFn | null> | null = null
/** AI를 쓸 수 있으면 sample 함수, 아니면 null (Claude 아티팩트 밖, 로그아웃 등) */
export function getSample(): Promise<SampleFn | null> {
  if (!samplePromise) {
    samplePromise = window.claude?.use
      ? window.claude.use('sample').then((s) => (s as SampleFn) ?? null).catch(() => null)
      : Promise.resolve(null)
  }
  return samplePromise
}

interface PermissionsFn {
  state: (name: string) => Promise<string>
  manage: () => Promise<void>
}

/**
 * AI를 못 쓰는 까닭. 화면 안내와 문제 신고용 진단 코드에 쓴다.
 * - no-runtime: Claude 화면 밖에서 열림 (주소창에 직접 연 아티팩트 주소, 다른 사이트 등)
 * - denied: 이 아티팩트의 Claude 사용을 거절해 둔 상태 (권한 메뉴에서 다시 켤 수 있음)
 * - unavailable: 이 보기(계정·앱·로그인 상태)에서는 아티팩트가 Claude를 쓸 수 없음
 */
export type Unavailable = 'no-runtime' | 'denied' | 'unavailable'

export async function whyUnavailable(): Promise<Unavailable> {
  if (!window.claude?.use) return 'no-runtime'
  try {
    const perms = (await window.claude.use('permissions')) as PermissionsFn | null
    if (perms && (await perms.state('sample')) === 'denied') return 'denied'
  } catch {
    // 권한 상태를 못 읽으면 일반적인 경우로 본다
  }
  return 'unavailable'
}

/** 플랫폼의 권한 패널을 연다. 열리지 않으면 false */
export async function openPermissions(): Promise<boolean> {
  try {
    const perms = (await window.claude?.use('permissions')) as PermissionsFn | null
    if (!perms) return false
    await perms.manage()
    return true
  } catch {
    return false
  }
}

/** 오류 코드를 사용자 안내 문구로 */
export function errorMessage(e: unknown): string {
  const code = (e as SampleError)?.code
  switch (code) {
    case 'cancelled': return '만들기를 멈췄어요.'
    case 'not_granted': return 'Claude 사용을 허용하지 않아서 만들 수 없어요. 페이지를 새로 열면 다시 물어봐요.'
    case 'sampling_disabled': return '이 계정에서는 Claude를 쓸 수 없어요.'
    case 'rate_limited': return 'Claude 사용량 한도에 걸렸어요. 잠시 뒤에 다시 시도해 주세요.'
    case 'session_expired': return 'Claude 로그인이 만료됐어요. 다시 로그인해 주세요.'
    case 'refused': return 'Claude가 이 입력으로는 만들 수 없다고 답했어요. 시 원문만 넣어 보세요.'
    case 'invalid_json': return 'Claude의 답을 게임 형식으로 읽지 못했어요. 한 번 더 시도해 주세요.'
    case 'prompt_too_large': return '시가 너무 길어요. 율시(8구) 정도까지 넣어 주세요.'
    default:
      if (e instanceof Error) return e.message
      return '만드는 중에 문제가 생겼어요. 잠시 뒤 다시 시도해 주세요.'
  }
}

/** 입력에서 구를 나눈다. 한 줄에 한 구, 또는 구두점(，。)으로 나뉜 한 덩어리 */
export function splitLines(text: string): string[] {
  const rows = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
  const parts = rows.flatMap((r) => r.split(/[，,。.；;！!？?、]/))
  return parts.map((p) => p.replace(/[\s「」『』"“”'‘’]/g, '')).filter((p) => p.length >= 3)
}

const EXAMPLE = `{"line":"床前明月光","prompt":"침상 앞에는 무엇이 비치고 있을까?","choices":[{"label":"아침 햇살","correct":false,"z":10,"elements":[...]},{"label":"밝은 달빛","correct":true,"z":10,"elements":[...]},{"label":"흔들리는 촛불 빛","correct":false,"z":10,"elements":[...]}],"explanation":"‘明月光’은 밝은 달빛으로, 고요한 밤 침상 앞 바닥에 달빛이 하얗게 비쳐 든다.","hint":"‘月’이라는 글자를 다시 보세요.","acquire":"침상 앞의 달빛","note":"‘床’을 우물 난간으로 보는 해석도 있습니다. 게임에서는 침상으로 그렸습니다."}`

function buildPrompt(lines: string[], input: UserPoemInput) {
  return `당신은 한시 교육용 픽셀아트 게임 「詩景」의 작품 제작자입니다. 학습자는 한 구절씩 3지선다 문제를 풀고, 정답을 맞힐 때마다 그 구절의 풍경 한 조각(레이어)이 화면에 쌓여 마지막에 시 전체의 풍경이 완성됩니다.

## 작품
${input.title ? `제목: ${input.title}\n` : ''}${input.poet ? `시인: ${input.poet}\n` : ''}원문 (${lines.length}구):
${lines.map((l, i) => `${i + 1}. ${l}`).join('\n')}

## 만들 것
1. 작품 정보: 제목·시인이 비어 있으면 원문으로 판단해 채우되, 확실하지 않으면 title은 첫 구, poet은 "미상"으로 쓰고 commentary에 그 사실을 밝힌다. era(왕조, 한 글자 한자), form(예: 五言絶句).
2. translation: 구별 현대 한국어 번역. commentary: 3~5문장 해설. 판본에 따른 글자 차이나 해석 논란이 있으면 언급한다.
3. 배경(background): 시 전체에 깔리는 기본 무대(하늘 색, 땅, 물, 먼 산 등). 문제의 정답이 될 대상은 배경에 그리지 않는다.
4. 구절마다 문제 하나(questions, 원문 순서대로 정확히 ${lines.length}개):
   - line: 원문 구절 그대로. prompt: 그 구절이 그리는 대상이나 상태를 묻는 짧은 한국어 질문.
   - choices: 정확히 3개, 정답 1개. 오답은 그럴듯하지만 구절의 글자와 맞지 않는 것. 각 보기는 그 보기를 골랐을 때 풍경에 더해질 그림(elements)을 가진다. 세 보기의 그림은 서로 눈에 띄게 달라야 한다.
   - 정답 그림들은 모두 한 화면에 함께 쌓이므로 서로 겹치지 않게 자리를 나눈다(예: 하늘·먼 곳·물가·앞쪽 인물). 같은 문제의 세 보기는 같은 자리에 그린다.
   - explanation: 정답 해설 한 문장(글자 뜻 포함). hint: 오답일 때 볼 글자를 짚는 짧은 안내. acquire: 획득하는 풍경 조각 이름(짧게). note: 해석이 갈리거나 원문에 없는 것을 그렸을 때만.
   - z: 앞뒤 순서 0~30(먼 것 작게, 가까운 것 크게). wind: 그 보기가 바람을 나타내면 0~1.
   - 도형과 사물로 보여 줄 수 없는 마음·생각은 인물과 생각 풍선(bubble) 안의 작은 그림으로 표현한다.

## 그리기 부품 (이 목록의 type만 쓸 수 있음)
${ELEMENT_DOC}

그림 요령: 레이어 하나에 요소 2~12개. 작은 저해상도 픽셀아트이므로 사물은 크고 단순하게, 색은 차분하게. 인물은 보통 x 60~240, 땅 위(y가 지평선 근처)에 둔다.

## 문제 한 개의 예 (elements는 생략해 보임)
${EXAMPLE}

## 출력
JSON 객체 하나만 답한다. 다른 글은 쓰지 않는다.
{"title":"","poet":"","era":"","form":"","translation":[""],"commentary":"","background":{"sky":["#위쪽색","#아래쪽색"],"elements":[]},"questions":[{"line":"","prompt":"","choices":[{"label":"","correct":true,"z":10,"wind":0,"elements":[]}],"explanation":"","hint":"","acquire":"","note":""}]}`
}

interface RawChoice { label?: unknown; correct?: unknown; z?: unknown; wind?: unknown; elements?: unknown }
interface RawQuestion { line?: unknown; prompt?: unknown; choices?: unknown; explanation?: unknown; hint?: unknown; acquire?: unknown; note?: unknown }
interface RawPoem {
  title?: unknown; poet?: unknown; era?: unknown; form?: unknown
  translation?: unknown; commentary?: unknown
  background?: { sky?: unknown; elements?: unknown }
  questions?: unknown
}

const str = (v: unknown, d = '') => (typeof v === 'string' ? v.trim() : d)

function shortHash(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return (h >>> 0).toString(36)
}

/** 정답 위치가 늘 같지 않도록 섞는다 (작품마다 고정) */
function shuffle<T>(list: T[], seed: string): T[] {
  const out = [...list]
  let h = parseInt(shortHash(seed), 36)
  for (let i = out.length - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0
    const j = h % (i + 1)
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/** Claude의 답을 검사해서 게임 데이터로 만든다. 형식이 틀리면 Error */
export function toGame(raw: RawPoem, lines: string[]): GeneratedPoem {
  const qs = Array.isArray(raw.questions) ? (raw.questions as RawQuestion[]) : []
  if (qs.length !== lines.length) throw new Error(`구절 수(${lines.length})와 문제 수(${qs.length})가 맞지 않아요. 다시 시도해 주세요.`)
  const id = `u-${shortHash(lines.join('|'))}-${Date.now().toString(36)}`
  const layers: Record<string, ArtLayer> = {}
  const questions: Question[] = qs.map((q, qi) => {
    const cs = Array.isArray(q.choices) ? (q.choices as RawChoice[]).slice(0, 3) : []
    if (cs.length !== 3) throw new Error(`${qi + 1}구의 보기가 세 개가 아니에요. 다시 시도해 주세요.`)
    let correctCount = cs.filter((c) => c.correct === true).length
    if (correctCount === 0) throw new Error(`${qi + 1}구에 정답이 없어요. 다시 시도해 주세요.`)
    const choices: Choice[] = cs.map((c, ci) => {
      const sprite = `${id}_q${qi}_c${ci}`
      const isCorrect = c.correct === true && correctCount-- > 0 // 정답이 여럿이면 첫 번째만
      layers[sprite] = {
        name: str(isCorrect ? q.acquire : c.label, sprite),
        z: typeof c.z === 'number' ? c.z : 10,
        wind: typeof c.wind === 'number' && c.wind > 0 ? c.wind : undefined,
        elements: Array.isArray(c.elements) ? (c.elements as RawElement[]) : [],
      }
      return { label: str(c.label, `보기 ${ci + 1}`), sprite, correct: isCorrect }
    })
    return {
      line: lines[qi],
      prompt: str(q.prompt, '이 구절은 무엇을 그리고 있을까?'),
      choices: shuffle(choices, id + qi) as Question['choices'],
      explanation: str(q.explanation),
      hint: str(q.hint, '구절의 글자를 다시 살펴보세요.'),
      acquire: str(q.acquire, `${qi + 1}구의 풍경`),
      note: str(q.note) || undefined,
    }
  })
  const translation = Array.isArray(raw.translation) ? raw.translation.map((t) => str(t)) : []
  const poem: Poem = {
    id,
    title: str(raw.title) || lines[0],
    poetId: 'user',
    poetName: str(raw.poet) || '미상',
    era: str(raw.era),
    form: str(raw.form) || undefined,
    lines,
    translation: lines.map((_, i) => translation[i] ?? ''),
    commentary: str(raw.commentary),
    questions,
    scenes: [{ id: `${id}-main`, background: `${id}-bg`, from: 0, to: lines.length - 1 }],
    aiGenerated: true,
  }
  const bg = raw.background ?? {}
  return {
    poem,
    art: {
      background: { sky: Array.isArray(bg.sky) ? (bg.sky as string[]) : [], elements: Array.isArray(bg.elements) ? (bg.elements as RawElement[]) : [] },
      layers,
    },
  }
}

export async function generatePoem(
  input: UserPoemInput,
  opts: { signal: AbortSignal; onProgress: (chars: number, linesDone: number) => void },
): Promise<GeneratedPoem> {
  const sample = await getSample()
  if (!sample) throw new Error('이 기능은 Claude 아티팩트에서 Claude 계정으로 열었을 때만 쓸 수 있어요.')
  const lines = splitLines(input.text)
  if (lines.length < 2) throw new Error('구절을 두 개 이상 넣어 주세요. 한 줄에 한 구씩 쓰면 가장 정확해요.')
  if (lines.length > 16) throw new Error('구절이 너무 많아요. 16구까지 넣을 수 있어요.')
  const raw = await sample.json<RawPoem>(buildPrompt(lines, input), {
    signal: opts.signal,
    cache: false,
    onText: ({ text }) => opts.onProgress(text.length, (text.match(/"line"\s*:/g) ?? []).length),
  })
  return toGame(raw, lines)
}
