// 사용자가 만든 작품을 이 브라우저에 저장하고, 시작할 때 게임에 등록한다.
import { registerUserPoem, unregisterUserPoem } from '../data/catalog'
import { registerBackground, registerSprites } from '../render/registry'
import { compileBackground, compileSprite } from './art'
import type { GeneratedPoem } from './generate'

const KEY = 'sigyeong.user.v1'

function read(): GeneratedPoem[] {
  try {
    const raw = localStorage.getItem(KEY)
    const list = raw ? (JSON.parse(raw) as GeneratedPoem[]) : []
    return Array.isArray(list) ? list.filter((g) => g?.poem?.id && g.art) : []
  } catch {
    return []
  }
}

function write(list: GeneratedPoem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list))
    return true
  } catch {
    return false
  }
}

/** 게임에 등록 (그림 해석 포함) */
export function install(g: GeneratedPoem) {
  const bg = g.poem.scenes[0].background
  registerBackground(compileBackground(bg, g.art.background))
  registerSprites(Object.entries(g.art.layers).map(([id, layer]) => compileSprite(id, layer)))
  registerUserPoem(g.poem)
}

export function loadUserPoems(): GeneratedPoem[] {
  const list = read()
  list.forEach(install)
  return list
}

/** 저장 (같은 id 는 덮어씀). 저장소를 못 쓰면 false — 이번 방문 동안만 남는다 */
export function saveUserPoem(g: GeneratedPoem): boolean {
  install(g)
  return write([g, ...read().filter((x) => x.poem.id !== g.poem.id)])
}

export function deleteUserPoem(id: string) {
  unregisterUserPoem(id)
  write(read().filter((x) => x.poem.id !== id))
}
