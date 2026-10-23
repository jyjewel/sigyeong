// ─────────────────────────────────────────────────────────────
//  외워 보기: 완성한 풍경을 보며 구절의 빈칸 글자를 3지선다로 맞힌다.
//  단계가 오를수록 구절마다 빈칸이 늘어난다 (1단계 1개 → 3단계 3개).
//  빈칸은 문제 힌트가 짚은 글자(‘月’ 처럼 따옴표 안)부터 뚫는다.
// ─────────────────────────────────────────────────────────────
import { CATALOG } from '../data/catalog'
import type { Poem } from '../data/types'

export const RECALL_ROUNDS = 3

export interface Blank {
  /** 구절 안의 글자 위치 */
  pos: number
  answer: string
  /** 보기 세 개 (정답 포함, 섞인 순서) */
  options: [string, string, string]
}

export interface RecallLine {
  line: string
  /** 채우는 순서대로 (구절 앞쪽부터) */
  blanks: Blank[]
}

/** 같은 입력이면 같은 결과를 내는 난수 */
function rng(seed: string) {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619)
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    h ^= h >>> 16
    return (h >>> 0) / 4294967296
  }
}

function shuffle<T>(list: T[], rand: () => number): T[] {
  const out = [...list]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

const HAN = /[㐀-鿿豈-﫿]/

/** 빈칸으로 쓸 수 있는 글자: 한자이고, 구절 안에서 되풀이되지 않음 (蕭蕭 의 한쪽을 비우면 답이 보인다) */
const blankable = (line: string, k: number) => HAN.test(line[k]) && line.indexOf(line[k]) === line.lastIndexOf(line[k])

/** 힌트·해설이 따옴표로 짚은 글자 중 구절에 있는 것의 위치 (힌트 → 해설 순) */
function keyPositions(poem: Poem, li: number): number[] {
  const line = poem.lines[li]
  const q = poem.questions[li]
  const quoted = [q?.hint ?? '', q?.explanation ?? '']
    .flatMap((t) => [...t.matchAll(/[‘'"“]([^’'"”]+)[’'"”]/g)].map((m) => m[1]))
    .join('')
  const out: number[] = []
  for (const ch of quoted) {
    if (!HAN.test(ch)) continue
    const pos = line.indexOf(ch)
    if (pos >= 0 && blankable(line, pos) && !out.includes(pos)) out.push(pos)
  }
  return out
}

/** 다른 작품들의 같은 자리 글자 (오답 후보) */
function samePositionChars(poem: Poem, pos: number): string[] {
  const out = new Set<string>()
  for (const e of CATALOG) {
    if (!e.poem || e.poem.id === poem.id) continue
    for (const l of e.poem.lines) if (l[pos]) out.add(l[pos])
  }
  return [...out]
}

function pickOptions(poem: Poem, li: number, pos: number, rand: () => number): [string, string, string] {
  const line = poem.lines[li]
  const answer = line[pos]
  // 구절 안에 이미 있는 글자는 오답으로 쓰지 않는다 (헷갈릴 뿐 배우는 것이 없다)
  const ok = (ch: string) => HAN.test(ch) && ch !== answer && !line.includes(ch)
  const ownPoem = shuffle([...new Set(poem.lines.filter((_, k) => k !== li).join(''))].filter(ok), rand)
  const others = shuffle(samePositionChars(poem, pos).filter(ok), rand)
  const picks: string[] = []
  for (const ch of [ownPoem[0], others[0], ...ownPoem.slice(1), ...others.slice(1)]) {
    if (ch && !picks.includes(ch)) picks.push(ch)
    if (picks.length === 2) break
  }
  return shuffle([answer, ...picks], rand) as [string, string, string]
}

/** round: 1부터. 같은 작품·단계면 늘 같은 빈칸과 보기 */
export function buildRecall(poem: Poem, round: number): RecallLine[] {
  return poem.lines.map((line, li) => {
    const rand = rng(`${poem.id}:${round}:${li}`)
    const n = Math.min(round, line.length - 1)
    const keys = keyPositions(poem, li)
    const rest = shuffle(
      [...line].map((_, k) => k).filter((k) => !keys.includes(k) && blankable(line, k)),
      rand,
    )
    const positions = [...keys, ...rest].slice(0, n).sort((a, b) => a - b)
    return {
      line,
      blanks: positions.map((pos) => ({ pos, answer: line[pos], options: pickOptions(poem, li, pos, rand) })),
    }
  })
}
