// 브라우저 localStorage 기반 도감·진행도 저장. 저장소를 쓸 수 없는 환경에서도 게임은 동작한다.
import { CATALOG, POETS } from '../data/catalog'

export interface AnswerLog {
  line: string
  /** 고른 보기 라벨 (순서대로, 마지막이 정답) */
  picks: string[]
}

export interface PoemRecord {
  poemId: string
  completedAt: string
  /** 가장 최근 플레이의 완벽 독해 여부 */
  perfect: boolean
  /** 한 번이라도 완벽 독해를 했는지 */
  everPerfect: boolean
  plays: number
  answers: AnswerLog[]
  thumbnail?: string
  saved: boolean
}

export interface SaveData {
  version: 1
  records: Record<string, PoemRecord>
  muted: boolean
}

const KEY = 'sigyeong.save.v1'

function empty(): SaveData {
  return { version: 1, records: {}, muted: false }
}

export function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return empty()
    const d = JSON.parse(raw) as SaveData
    if (d.version !== 1 || typeof d.records !== 'object') return empty()
    return { ...empty(), ...d }
  } catch {
    return empty()
  }
}

export function writeSave(d: SaveData) {
  try {
    localStorage.setItem(KEY, JSON.stringify(d))
    return true
  } catch {
    return false
  }
}

export function recordCompletion(
  d: SaveData,
  poemId: string,
  perfect: boolean,
  answers: AnswerLog[],
  thumbnail?: string,
): SaveData {
  const prev = d.records[poemId]
  const rec: PoemRecord = {
    poemId,
    completedAt: new Date().toISOString(),
    perfect,
    everPerfect: perfect || !!prev?.everPerfect,
    plays: (prev?.plays ?? 0) + 1,
    answers,
    thumbnail: thumbnail ?? prev?.thumbnail,
    saved: prev?.saved ?? false,
  }
  return { ...d, records: { ...d.records, [poemId]: rec } }
}

export function markSaved(d: SaveData, poemId: string): SaveData {
  const rec = d.records[poemId]
  if (!rec) return d
  return { ...d, records: { ...d.records, [poemId]: { ...rec, saved: true } } }
}

/** 시인별 진행률과 배지 획득 여부. 배지는 '게임에 수록된(playable)' 작품을 모두 완성하면 얻는다. */
export function poetProgress(d: SaveData) {
  return POETS.map((poet) => {
    const entries = CATALOG.filter((e) => e.poetId === poet.id)
    const playable = entries.filter((e) => e.playable)
    const done = playable.filter((e) => d.records[e.id])
    return {
      poet,
      entries,
      playableCount: playable.length,
      doneCount: done.length,
      badge: playable.length > 0 && done.length === playable.length,
    }
  })
}

export function totalProgress(d: SaveData) {
  const done = CATALOG.filter((e) => d.records[e.id]).length
  return { done, total: CATALOG.length }
}
