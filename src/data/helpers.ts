import type { Question } from './types'

/**
 * 문제 데이터를 짧게 쓰기 위한 도우미.
 * choices 는 [보기 문구, 스프라이트 id, 정답이면 true] 세 개.
 */
export function q(
  line: string,
  prompt: string,
  choices: [string, string, boolean?][],
  explanation: string,
  hint: string,
  acquire: string,
  note?: string,
): Question {
  if (choices.length !== 3) throw new Error(`${line}: 보기는 정확히 세 개여야 합니다`)
  if (choices.filter((c) => c[2]).length !== 1) throw new Error(`${line}: 정답은 하나여야 합니다`)
  return {
    line,
    prompt,
    choices: choices.map(([label, sprite, correct]) => ({ label, sprite, correct: !!correct })) as Question['choices'],
    explanation,
    hint,
    acquire,
    note,
  }
}
