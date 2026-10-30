// 브라우저 localStorage 기반 도감·진행도 저장. 저장소를 쓸 수 없는 환경에서도 게임은 동작한다.
import { HUAYI } from '../data/huayi'

export interface AnswerLog {
  line: string
  /** 고른 보기 라벨 (순서대로, 마지막이 정답) */
  picks: string[]
}

export interface PoemRecord {
  poemId: string
  completedAt: string
  /** 가장 최근 플레이에서 네 구를 한 번에 맞혔는지 (完) */
  perfect: boolean
  /** 한 번이라도 完을 받았는지 */
  everPerfect: boolean
  plays: number
  answers: AnswerLog[]
  thumbnail?: string
  /** 외워 보기에서 마친 가장 높은 단계 (0~3) */
  recallRound?: number
  /** 마지막 단계를 한 번도 틀리지 않고 마쳤는지 (誦 도장) */
  recited?: boolean
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
  }
  return { ...d, records: { ...d.records, [poemId]: rec } }
}

/** 외워 보기 한 단계를 마쳤을 때. 풍경을 완성한 작품만 기록한다 */
export function recordRecall(d: SaveData, poemId: string, round: number, perfect: boolean, lastRound: number): SaveData {
  const rec = d.records[poemId]
  if (!rec) return d
  const next: PoemRecord = {
    ...rec,
    recallRound: Math.max(rec.recallRound ?? 0, round),
    recited: rec.recited || (round === lastRound && perfect),
  }
  return { ...d, records: { ...d.records, [poemId]: next } }
}

/** 『唐詩畫意』 진행도 (준비 중인 작품까지 전체 수로 센다) */
export function huayiProgress(d: SaveData) {
  const items = HUAYI.flatMap((s) => s.items)
  return { done: items.filter((i) => d.records[i.id]).length, total: items.length }
}
