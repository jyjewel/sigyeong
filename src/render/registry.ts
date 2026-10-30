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
import { HUAZIGANG_SPRITES, LINHUTING_SPRITES, NANTUO_SPRITES, YULANGNIAO_SPRITES, huazigangBackground, linhutingBackground, nantuoBackground, yulangniaoBackground } from './poems/hy_b1a'
import { BEITUO_SPRITES, LUANJIALAI_SPRITES, LUCIYAN_SPRITES, QIHU_SPRITES, beituoBackground, luanjialaiBackground, luciyanBackground, peiLuanjialaiBackground, qihuBackground } from './poems/hy_b1b'
import {
  BAISHITAN_SPRITES, JINXIEQUAN_SPRITES, PEI_BEITUO_SPRITES, PEI_LUANJIALAI_SPRITES, PEI_LUZHAI_SPRITES, SHANZHONG_SPRITES, ZUOYE_SPRITES,
  baishitanBackground, jinxiequanBackground, shanzhongBackground, zuoyeBackground,
} from './poems/hy_b1c'
import {
  BAIZHANG_SPRITES, FENGXUE_SPRITES, LUOYANG_SPRITES, SENGFANG_SPRITES, ZHANGSHIBA_SPRITES,
  baizhangBackground, fengxueBackground, luoyangBackground, sengfangBackground, zhangshibaBackground,
} from './poems/hy_b2a'
import { JIANGZHONG_SPRITES, JUHUA_SPRITES, LINGCHE_SPRITES, YUJIE_SPRITES, jiangzhongBackground, juhuaBackground, lingcheBackground, yujieBackground } from './poems/hy_b2b'
import {
  BAILU_SPRITES, BAIYING_SPRITES, DONGLIN_SPRITES, QIUPU_SPRITES, XIARI_SPRITES,
  bailuBackground, baiyingBackground, donglinBackground, qiupuBackground, xiariBackground,
} from './poems/hy_b2c'
import {
  CHANGMEN_SPRITES, GAOJU_SPRITES, LANGYA_SPRITES, QIUZHAI_SPRITES, QUSHI_SPRITES, TONGYE_SPRITES, ZAOZITAI_SPRITES,
  changmenBackground, gaojuBackground, langyaBackground, qiuzhaiBackground, qushiBackground, tongyeBackground, zaozitaiBackground,
} from './poems/hy_b3a'
import {
  JIANGXING1_SPRITES, JIANGXING2_SPRITES, JIANGXING3_SPRITES, JIANGXING4_SPRITES, SHANQUAN_SPRITES, SHUIJIAN_SPRITES, ZAOJING_SPRITES,
  jiangxing1Background, jiangxing2Background, jiangxing3Background, jiangxing4Background, shanquanBackground, shuijianBackground, zaojingBackground,
} from './poems/hy_b3b'
import {
  CUINIAO_SPRITES, DONGKOU_SPRITES, HANGONG_SPRITES, JIANGXING5_SPRITES, JIANGXING6_SPRITES, SHIZHU_SPRITES, TIANHE_SPRITES,
  cuiniaoBackground, dongkouBackground, hangongBackground, jiangxing5Background, jiangxing6Background, shizhuBackground, tianheBackground,
} from './poems/hy_b3c'
import {
  BAIXINYUE_SPRITES, JIANGXING_LIU_SPRITES, SHANZHONG_GU_SPRITES, SHIDOU_SPRITES, XISHANG_SPRITES,
  baixinyueBackground, jiangxingLiuBackground, shanzhongGuBackground, shidouBackground, xishangBackground,
} from './poems/hy_b4a'
import {
  BEISHAN_SPRITES, QIUTAN_SPRITES, SAIXIA_SPRITES, SONGCHEN_SPRITES, TINGZHENG_SPRITES,
  beishanBackground, qiutanBackground, saixiaBackground, songchenBackground, tingzhengBackground,
} from './poems/hy_b4b'

import {
  DQ_SPRITES, SHIJING_SPRITES, SUTAN_SPRITES, YAOYUAN_SPRITES, ZAYAN_SPRITES, dqBackground, shijingBackground, sutanBackground, yaoyuanBackground, zayanBackground,
} from './poems/hy_b5a'
import {
  HANTANG_SPRITES, HUANGYUAN_SPRITES, TIANJIA_SPRITES, WANDIE_SPRITES, YEJU_SPRITES, hantangBackground, huangyuanBackground, tianjiaBackground, wandieBackground, yejuBackground,
} from './poems/hy_b5b'
import {
  CHOUSHI_SPRITES, FENNAN_SPRITES, QIUYE_SPRITES, XIAO_SPRITES, ZHISHI_SPRITES, choushiBackground, fennanBackground, qiuyeBackground, xiaoBackground, zhishiBackground,
} from './poems/hy_b6a'
import {
  QISHU_SPRITES, WAN_SPRITES, XIJU_SPRITES, ZHOU_SPRITES, ZHUTING_SPRITES, ZHUXI_SPRITES, qishuBackground, wanBackground, xijuBackground, zhouBackground, zhutingBackground, zhuxiBackground,
} from './poems/hy_b6b'
import {
  CHUNYOU_SPRITES, DAOQI_SPRITES, GANTANG_SPRITES, GONGZHONG_SPRITES, HUADAO_SPRITES, chunyouBackground, daoqiBackground, gantangBackground, gongzhongBackground, huadaoBackground,
} from './poems/hy_b7a'
import {
  FANGYANG_SPRITES, HUSHANG_SPRITES, MEIXI_SPRITES, PIPATAI_SPRITES, QIUXI_SPRITES, XIFENG_SPRITES, fangyangBackground, hushangBackground, meixiBackground, pipataiBackground, qiuxiBackground, xifengBackground,
} from './poems/hy_b7b'
import {
  BISHU_SPRITES, DUZHUO_SPRITES, JINGAI_SPRITES, LEYOU_SPRITES, YUHOU_SPRITES, bishuBackground, duzhuoBackground, jingaiBackground, leyouBackground, yuhouBackground,
} from './poems/hy_b8a'
import {
  BIJIAN_SPRITES, GAOLOU_SPRITES, MUTONG_SPRITES, QIUSI_SPRITES, ZAOQI_SPRITES, ZENGDAO_SPRITES, bijianBackground, gaolouBackground, mutongBackground, qiusiBackground, zaoqiBackground, zengdaoBackground,
} from './poems/hy_b8b'
import { titleBackground } from './backgrounds/title'

const BACKGROUNDS = new Map<string, Background>()
const SPRITES = new Map<string, Sprite>()

export function registerBackground(bg: Background) {
  BACKGROUNDS.set(bg.id, bg)
}
export function registerSprites(list: Sprite[]) {
  for (const s of list) SPRITES.set(s.id, s)
}

registerBackground(denggaoBackground)
registerBackground(titleBackground)
registerSprites(DENGGAO_SPRITES)
for (const bg of [
  chunwangBackground, lvyeBackground, jingyesiBackground, huanghelouBackground, luzhaiBackground, shanjuBackground,
  chunxiaoBackground, jiangxueBackground, guanqueBackground, fengqiaoBackground, xiajianglingBackground,
  zhuliguanBackground, jiandejiangBackground, chuzhouBackground, wuyixiangBackground, qinhuaiBackground,
  // 『唐詩畫意』
  yulangniaoBackground, huazigangBackground, linhutingBackground, nantuoBackground, qihuBackground, luanjialaiBackground,
  peiLuanjialaiBackground, beituoBackground, luciyanBackground, zuoyeBackground, shanzhongBackground, jinxiequanBackground,
  baishitanBackground, luoyangBackground, sengfangBackground, fengxueBackground, zhangshibaBackground, baizhangBackground,
  lingcheBackground, jiangzhongBackground, juhuaBackground, yujieBackground, qiupuBackground, donglinBackground,
  bailuBackground, xiariBackground, baiyingBackground, qushiBackground, langyaBackground, changmenBackground, qiuzhaiBackground,
  tongyeBackground, gaojuBackground, zaozitaiBackground, shanquanBackground, zaojingBackground, shuijianBackground,
  jiangxing1Background, jiangxing2Background, jiangxing3Background, jiangxing4Background, jiangxing5Background, jiangxing6Background,
  dongkouBackground, cuiniaoBackground, tianheBackground, hangongBackground, shizhuBackground, jiangxingLiuBackground,
  shidouBackground, shanzhongGuBackground, xishangBackground, baixinyueBackground, beishanBackground, saixiaBackground,
  qiutanBackground, songchenBackground, tingzhengBackground,
  sutanBackground, dqBackground, yaoyuanBackground, shijingBackground, zayanBackground,
  hantangBackground, yejuBackground, huangyuanBackground, wandieBackground, tianjiaBackground,
  fennanBackground, zhishiBackground, choushiBackground, qiuyeBackground, xiaoBackground,
  zhouBackground, wanBackground, qishuBackground, xijuBackground, zhutingBackground, zhuxiBackground,
  huadaoBackground, daoqiBackground, gantangBackground, gongzhongBackground, chunyouBackground,
  meixiBackground, pipataiBackground, xifengBackground, qiuxiBackground, hushangBackground, fangyangBackground,
  bishuBackground, duzhuoBackground, jingaiBackground, yuhouBackground, leyouBackground,
  zaoqiBackground, qiusiBackground, zengdaoBackground, bijianBackground, mutongBackground, gaolouBackground,
])
  registerBackground(bg)
for (const list of [
  CHUNWANG_SPRITES, LVYE_SPRITES, JINGYESI_SPRITES, HUANGHELOU_SPRITES, LUZHAI_SPRITES, SHANJU_SPRITES,
  CHUNXIAO_SPRITES, JIANGXUE_SPRITES, GUANQUE_SPRITES, FENGQIAO_SPRITES, XIAJIANGLING_SPRITES,
  ZHULIGUAN_SPRITES, JIANDEJIANG_SPRITES, CHUZHOU_SPRITES, WUYIXIANG_SPRITES, QINHUAI_SPRITES,
  YULANGNIAO_SPRITES, HUAZIGANG_SPRITES, LINHUTING_SPRITES, NANTUO_SPRITES, QIHU_SPRITES, LUANJIALAI_SPRITES, BEITUO_SPRITES,
  LUCIYAN_SPRITES, ZUOYE_SPRITES, SHANZHONG_SPRITES, PEI_LUZHAI_SPRITES, PEI_LUANJIALAI_SPRITES, JINXIEQUAN_SPRITES,
  BAISHITAN_SPRITES, PEI_BEITUO_SPRITES, LUOYANG_SPRITES, SENGFANG_SPRITES, FENGXUE_SPRITES, ZHANGSHIBA_SPRITES,
  BAIZHANG_SPRITES, LINGCHE_SPRITES, JIANGZHONG_SPRITES, JUHUA_SPRITES, YUJIE_SPRITES, QIUPU_SPRITES, DONGLIN_SPRITES,
  BAILU_SPRITES, XIARI_SPRITES, BAIYING_SPRITES, QUSHI_SPRITES, LANGYA_SPRITES, CHANGMEN_SPRITES, QIUZHAI_SPRITES, TONGYE_SPRITES,
  GAOJU_SPRITES, ZAOZITAI_SPRITES, SHANQUAN_SPRITES, ZAOJING_SPRITES, SHUIJIAN_SPRITES, JIANGXING1_SPRITES, JIANGXING2_SPRITES,
  JIANGXING3_SPRITES, JIANGXING4_SPRITES, JIANGXING5_SPRITES, JIANGXING6_SPRITES, DONGKOU_SPRITES, CUINIAO_SPRITES, TIANHE_SPRITES,
  HANGONG_SPRITES, SHIZHU_SPRITES, JIANGXING_LIU_SPRITES, SHIDOU_SPRITES, SHANZHONG_GU_SPRITES, XISHANG_SPRITES, BAIXINYUE_SPRITES,
  BEISHAN_SPRITES, SAIXIA_SPRITES, QIUTAN_SPRITES, SONGCHEN_SPRITES, TINGZHENG_SPRITES,
  SUTAN_SPRITES, DQ_SPRITES, YAOYUAN_SPRITES, SHIJING_SPRITES, ZAYAN_SPRITES,
  HANTANG_SPRITES, YEJU_SPRITES, HUANGYUAN_SPRITES, WANDIE_SPRITES, TIANJIA_SPRITES,
  FENNAN_SPRITES, ZHISHI_SPRITES, CHOUSHI_SPRITES, QIUYE_SPRITES, XIAO_SPRITES,
  ZHOU_SPRITES, WAN_SPRITES, QISHU_SPRITES, XIJU_SPRITES, ZHUTING_SPRITES, ZHUXI_SPRITES,
  HUADAO_SPRITES, DAOQI_SPRITES, GANTANG_SPRITES, GONGZHONG_SPRITES, CHUNYOU_SPRITES,
  MEIXI_SPRITES, PIPATAI_SPRITES, XIFENG_SPRITES, QIUXI_SPRITES, HUSHANG_SPRITES, FANGYANG_SPRITES,
  BISHU_SPRITES, DUZHUO_SPRITES, JINGAI_SPRITES, YUHOU_SPRITES, LEYOU_SPRITES,
  ZAOQI_SPRITES, QIUSI_SPRITES, ZENGDAO_SPRITES, BIJIAN_SPRITES, MUTONG_SPRITES, GAOLOU_SPRITES,
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
