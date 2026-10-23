// 배경·스프라이트 등록부. 새 작품의 그림은 여기에 등록만 하면 된다.
import type { Background, Sprite } from './types'
import { denggaoBackground } from './backgrounds/denggao'
import { DENGGAO_SPRITES } from './sprites/denggao'
import { CHUNWANG_SPRITES, chunwangBackground } from './poems/chunwang'
import { LVYE_SPRITES, lvyeBackground } from './poems/lvye'
import { JINGYESI_SPRITES, jingyesiBackground } from './poems/jingyesi'
import { HUANGHELOU_SPRITES, huanghelouBackground } from './poems/huanghelou'
import { LUZHAI_SPRITES, luzhaiBackground } from './poems/luzhai'
import { SHANJU_SPRITES, shanjuBackground } from './poems/shanju'
import { CHUNXIAO_SPRITES, JIANGXUE_SPRITES, chunxiaoBackground, jiangxueBackground } from './poems/b2_chunxiao_jiangxue'
import { FENGQIAO_SPRITES, GUANQUE_SPRITES, fengqiaoBackground, guanqueBackground } from './poems/b2_guanque_fengqiao'
import { XIAJIANGLING_SPRITES, ZHULIGUAN_SPRITES, xiajianglingBackground, zhuliguanBackground } from './poems/b2_xiajiangling_zhuliguan'
import { CHUZHOU_SPRITES, JIANDEJIANG_SPRITES, chuzhouBackground, jiandejiangBackground } from './poems/b2_jiandejiang_chuzhou'
import { QINHUAI_SPRITES, WUYIXIANG_SPRITES, qinhuaiBackground, wuyixiangBackground } from './poems/b2_wuyixiang_qinhuai'

const BACKGROUNDS = new Map<string, Background>()
const SPRITES = new Map<string, Sprite>()

export function registerBackground(bg: Background) {
  BACKGROUNDS.set(bg.id, bg)
}
export function registerSprites(list: Sprite[]) {
  for (const s of list) SPRITES.set(s.id, s)
}

registerBackground(denggaoBackground)
registerSprites(DENGGAO_SPRITES)
for (const bg of [
  chunwangBackground, lvyeBackground, jingyesiBackground, huanghelouBackground, luzhaiBackground, shanjuBackground,
  chunxiaoBackground, jiangxueBackground, guanqueBackground, fengqiaoBackground, xiajianglingBackground,
  zhuliguanBackground, jiandejiangBackground, chuzhouBackground, wuyixiangBackground, qinhuaiBackground,
])
  registerBackground(bg)
for (const list of [
  CHUNWANG_SPRITES, LVYE_SPRITES, JINGYESI_SPRITES, HUANGHELOU_SPRITES, LUZHAI_SPRITES, SHANJU_SPRITES,
  CHUNXIAO_SPRITES, JIANGXUE_SPRITES, GUANQUE_SPRITES, FENGQIAO_SPRITES, XIAJIANGLING_SPRITES,
  ZHULIGUAN_SPRITES, JIANDEJIANG_SPRITES, CHUZHOU_SPRITES, WUYIXIANG_SPRITES, QINHUAI_SPRITES,
])
  registerSprites(list)

export function getBackground(id: string) {
  const b = BACKGROUNDS.get(id)
  if (!b) throw new Error(`배경 '${id}' 이(가) 등록되지 않았습니다`)
  return b
}
export function getSprite(id: string) {
  const s = SPRITES.get(id)
  if (!s) throw new Error(`스프라이트 '${id}' 이(가) 등록되지 않았습니다`)
  return s
}
export function hasSprite(id: string) {
  return SPRITES.has(id)
}
