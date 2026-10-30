import type { CatalogEntry, Poem, Poet } from './types'
import { denggao } from './poems/denggao'
import { chunwang } from './poems/chunwang'
import { lvye } from './poems/lvye'
import { jingyesi } from './poems/jingyesi'
import { huanghelou } from './poems/huanghelou'
import { luzhai } from './poems/luzhai'
import { shanju } from './poems/shanju'
import { chunxiao, fengqiao, guanque, jiangxue, xiajiangling } from './poems/batch2a'
import { chuzhou, jiandejiang, qinhuai, wuyixiang, zhuliguan } from './poems/batch2b'
import { HUAYI_BATCH1 } from './poems/huayi8a'
import { HUAYI_BATCH2 } from './poems/huayi8b'
import { HUAYI_BATCH3 } from './poems/huayi8c'
import { HUAYI_BATCH4 } from './poems/huayi8d'
import { HUAYI_BATCH5 } from './poems/huayi9a'
import { HUAYI_BATCH6 } from './poems/huayi9b'
import { HUAYI_BATCH7 } from './poems/huayi9c'
import { HUAYI_BATCH8 } from './poems/huayi9d'
import { HUAYI_BATCH9 } from './poems/huayi9e'

// 시인 목록과 배지
export const POETS: Poet[] = [
  {
    id: 'dufu',
    name: '杜甫',
    era: '唐',
    badge: { id: 'dufu-journey', name: '두보의 여행', description: '수록된 두보의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'libai',
    name: '李白',
    era: '唐',
    badge: { id: 'libai-moon', name: '이백의 달', description: '수록된 이백의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'wangwei',
    name: '王維',
    era: '唐',
    badge: { id: 'wangwei-landscape', name: '왕유의 산수', description: '수록된 왕유의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'menghaoran',
    name: '孟浩然',
    era: '唐',
    badge: { id: 'menghaoran-spring', name: '맹호연의 봄잠', description: '수록된 맹호연의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'wangzhihuan',
    name: '王之渙',
    era: '唐',
    badge: { id: 'wangzhihuan-tower', name: '왕지환의 누각', description: '수록된 왕지환의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'zhangji',
    name: '張繼',
    era: '唐',
    badge: { id: 'zhangji-bell', name: '장계의 종소리', description: '수록된 장계의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'weiyingwu',
    name: '韋應物',
    era: '唐',
    badge: { id: 'weiyingwu-ferry', name: '위응물의 나루', description: '수록된 위응물의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'liuzongyuan',
    name: '柳宗元',
    era: '唐',
    badge: { id: 'liuzongyuan-snow', name: '유종원의 눈', description: '수록된 유종원의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'liuyuxi',
    name: '劉禹錫',
    era: '唐',
    badge: { id: 'liuyuxi-swallow', name: '유우석의 제비', description: '수록된 유우석의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'dumu',
    name: '杜牧',
    era: '唐',
    badge: { id: 'dumu-river', name: '두목의 진회', description: '수록된 두목의 작품을 모두 완성했습니다.' },
  },
  // 『唐詩畫意』에서 새로 실은 시인 (唐詩三百首 작품집에는 나오지 않는다)
  {
    id: 'luzhaolin',
    name: '盧照鄰',
    era: '唐',
    badge: { id: 'luzhaolin-bird', name: '노조린의 물새', description: '수록된 노조린의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'peidi',
    name: '裴迪',
    era: '唐',
    badge: { id: 'peidi-wangchuan', name: '배적의 망천', description: '수록된 배적의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'chuguangxi',
    name: '儲光羲',
    era: '唐',
    badge: { id: 'chuguangxi-road', name: '저광희의 낙양길', description: '수록된 저광희의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'wangchangling',
    name: '王昌齡',
    era: '唐',
    badge: { id: 'wangchangling-temple', name: '왕창령의 승방', description: '수록된 왕창령의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'liuchangqing',
    name: '劉長卿',
    era: '唐',
    badge: { id: 'liuchangqing-snow', name: '유장경의 눈 오는 밤', description: '수록된 유장경의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'censhen',
    name: '岑參',
    era: '唐',
    badge: { id: 'censhen-tower', name: '잠삼의 높은 집', description: '수록된 잠삼의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'huangfuzeng',
    name: '皇甫曾',
    era: '唐',
    badge: { id: 'huangfuzeng-spring', name: '황보증의 산 아래 샘', description: '수록된 황보증의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'qianqi',
    name: '錢起',
    era: '唐',
    badge: { id: 'qianqi-river', name: '전기의 강길', description: '수록된 전기의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'hanhong',
    name: '韓翃',
    era: '唐',
    badge: { id: 'hanhong-apricot', name: '한굉의 살구꽃', description: '수록된 한굉의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'huangfuran',
    name: '皇甫冉',
    era: '唐',
    badge: { id: 'huangfuran-pink', name: '황보염의 패랭이꽃', description: '수록된 황보염의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'liuzhongyong',
    name: '柳中庸',
    era: '唐',
    badge: { id: 'liuzhongyong-river', name: '유중용의 가을 강', description: '수록된 유중용의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'gukuang',
    name: '顧況',
    era: '唐',
    badge: { id: 'gukuang-spring', name: '고황의 돌샘', description: '수록된 고황의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'gengwei',
    name: '耿湋',
    era: '唐',
    badge: { id: 'gengwei-moon', name: '경위의 초승달', description: '수록된 경위의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'daishulun',
    name: '戴叔倫',
    era: '唐',
    badge: { id: 'daishulun-pavilion', name: '대숙륜의 정자', description: '수록된 대숙륜의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'lulun',
    name: '盧綸',
    era: '唐',
    badge: { id: 'lulun-frontier', name: '노륜의 변방의 눈', description: '수록된 노륜의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'liduan',
    name: '李端',
    era: '唐',
    badge: { id: 'liduan-zheng', name: '이단의 쟁 소리', description: '수록된 이단의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'changdang',
    name: '暢當',
    era: '唐',
    badge: { id: 'changdang-pond', name: '창당의 달밤의 못', description: '수록된 창당의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'sikongshu',
    name: '司空曙',
    era: '唐',
    badge: { id: 'sikongshu-well', name: '사공서의 돌우물', description: '수록된 사공서의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'wangjian',
    name: '王建',
    era: '唐',
    badge: { id: 'wangjian-chrysanthemum', name: '왕건의 들국화', description: '수록된 왕건의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'liushang',
    name: '劉商',
    era: '唐',
    badge: { id: 'liushang-orange', name: '유상의 탱자', description: '수록된 유상의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'qiudan',
    name: '丘丹',
    era: '唐',
    badge: { id: 'qiudan-flute', name: '구단의 퉁소', description: '수록된 구단의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'quandeyu',
    name: '權德輿',
    era: '唐',
    badge: { id: 'quandeyu-sail', name: '권덕여의 조각 돛', description: '수록된 권덕여의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'yangshie',
    name: '羊士諤',
    era: '唐',
    badge: { id: 'yangshie-tree', name: '양사악의 옥 나무', description: '수록된 양사악의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'peidu',
    name: '裴度',
    era: '唐',
    badge: { id: 'peidu-stream', name: '배도의 시냇가 집', description: '수록된 배도의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'hanyu',
    name: '韓愈',
    era: '唐',
    badge: { id: 'hanyu-lotus', name: '한유의 물가 정자', description: '수록된 한유의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'zhangzhongsu',
    name: '張仲素',
    era: '唐',
    badge: { id: 'zhangzhongsu-swing', name: '장중소의 그네', description: '수록된 장중소의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'zhangji2',
    name: '張籍',
    era: '唐',
    badge: { id: 'zhangji2-plum', name: '장적의 매화 시내', description: '수록된 장적의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'baijuyi',
    name: '白居易',
    era: '唐',
    badge: { id: 'baijuyi-candle', name: '백거이의 붉은 촛불', description: '수록된 백거이의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'sunge',
    name: '孫革',
    era: '唐',
    badge: { id: 'sunge-cloud', name: '손혁의 깊은 구름', description: '수록된 손혁의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'xuning',
    name: '徐凝',
    era: '唐',
    badge: { id: 'xuning-shade', name: '서응의 숲 그늘', description: '수록된 서응의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'xuhun',
    name: '許渾',
    era: '唐',
    badge: { id: 'xuhun-willow', name: '허혼의 버들 그늘', description: '수록된 허혼의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'lishangyin',
    name: '李商隱',
    era: '唐',
    badge: { id: 'lishangyin-sunset', name: '이상은의 석양', description: '수록된 이상은의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'madai',
    name: '馬戴',
    era: '唐',
    badge: { id: 'madai-cave', name: '마대의 구름 굴', description: '수록된 마대의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'wentingyun',
    name: '溫庭筠',
    era: '唐',
    badge: { id: 'wentingyun-apricot', name: '온정균의 산살구꽃', description: '수록된 온정균의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'liujia',
    name: '劉駕',
    era: '唐',
    badge: { id: 'liujia-ox', name: '유가의 목동', description: '수록된 유가의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'yuwuling',
    name: '于武陵',
    era: '唐',
    badge: { id: 'yuwuling-tower', name: '우무릉의 달빛 누각', description: '수록된 우무릉의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'sikongtu',
    name: '司空圖',
    era: '唐',
    badge: { id: 'sikongtu-crane', name: '사공도의 학 한 마리', description: '수록된 사공도의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'gaozhongcheng',
    name: '高中丞',
    era: '唐',
    badge: { id: 'gaozhongcheng-boat', name: '고중승의 낚싯배', description: '수록된 고중승의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'tangyanqian',
    name: '唐彥謙',
    era: '唐',
    badge: { id: 'tangyanqian-moon', name: '당언겸의 작은 뜰의 달', description: '수록된 당언겸의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'hanwo',
    name: '韓偓',
    era: '唐',
    badge: { id: 'hanwo-swing', name: '한악의 그네', description: '수록된 한악의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'taishangyinzhe',
    name: '太上隱者',
    era: '唐',
    badge: { id: 'taishangyinzhe-pine', name: '태상은자의 소나무 아래', description: '수록된 태상은자의 작품을 모두 완성했습니다.' },
  },
  {
    id: 'xuanzonggongren',
    name: '宣宗宮人',
    era: '唐',
    badge: { id: 'xuanzonggongren-leaf', name: '선종 궁인의 붉은 잎', description: '수록된 선종 궁인의 작품을 모두 완성했습니다.' },
  },
]

// 도감 목록. 새 작품은 poem 객체를 만들어 playable: true 로 등록한다.
// playable: false 항목은 '준비 중' 으로만 표시된다.
export const CATALOG: CatalogEntry[] = [
  { id: 'denggao', title: '登高', poetId: 'dufu', playable: true, poem: denggao, tags: ['七言律詩', '가을', '나그네'] },
  { id: 'chunwang', title: '春望', poetId: 'dufu', playable: true, poem: chunwang, tags: ['五言律詩', '봄', '전란'] },
  { id: 'lvyeshuhuai', title: '旅夜書懷', poetId: 'dufu', playable: true, poem: lvye, tags: ['五言律詩', '밤', '나그네'] },
  { id: 'jingyesi', title: '靜夜思', poetId: 'libai', playable: true, poem: jingyesi, tags: ['五言絶句', '밤', '고향'] },
  { id: 'huanghelou', title: '黃鶴樓送孟浩然之廣陵', poetId: 'libai', playable: true, poem: huanghelou, tags: ['七言絶句', '봄', '이별'] },
  { id: 'luzhai', title: '鹿柴', poetId: 'wangwei', playable: true, poem: luzhai, tags: ['五言絶句', '저녁', '산수'] },
  { id: 'shanjuqiuming', title: '山居秋暝', poetId: 'wangwei', playable: true, poem: shanju, tags: ['五言律詩', '가을', '산수'] },
  { id: 'chunxiao', title: '春曉', poetId: 'menghaoran', playable: true, poem: chunxiao, tags: ['五言絶句', '봄', '아침'] },
  { id: 'jiandejiang', title: '宿建德江', poetId: 'menghaoran', playable: true, poem: jiandejiang, tags: ['五言絶句', '저녁', '나그네'] },
  { id: 'xiajiangling', title: '下江陵', poetId: 'libai', playable: true, poem: xiajiangling, tags: ['七言絶句', '아침', '강'] },
  { id: 'zhuliguan', title: '竹里館', poetId: 'wangwei', playable: true, poem: zhuliguan, tags: ['五言絶句', '밤', '은거'] },
  { id: 'guanquelou', title: '登鸛雀樓', poetId: 'wangzhihuan', playable: true, poem: guanque, tags: ['五言絶句', '저녁', '누각'] },
  { id: 'fengqiao', title: '楓橋夜泊', poetId: 'zhangji', playable: true, poem: fengqiao, tags: ['七言絶句', '밤', '나그네'] },
  { id: 'chuzhouxijian', title: '滁州西澗', poetId: 'weiyingwu', playable: true, poem: chuzhou, tags: ['七言絶句', '봄', '시내'] },
  { id: 'jiangxue', title: '江雪', poetId: 'liuzongyuan', playable: true, poem: jiangxue, tags: ['五言絶句', '겨울', '강'] },
  { id: 'wuyixiang', title: '烏衣巷', poetId: 'liuyuxi', playable: true, poem: wuyixiang, tags: ['七言絶句', '저녁', '회고'] },
  { id: 'boqinhuai', title: '泊秦淮', poetId: 'dumu', playable: true, poem: qinhuai, tags: ['七言絶句', '밤', '회고'] },
  // 申緯 『唐詩畫意』 (차례는 src/data/huayi.ts)
  ...[...HUAYI_BATCH1, ...HUAYI_BATCH2, ...HUAYI_BATCH3, ...HUAYI_BATCH4, ...HUAYI_BATCH5, ...HUAYI_BATCH6, ...HUAYI_BATCH7, ...HUAYI_BATCH8, ...HUAYI_BATCH9].map((poem): CatalogEntry => ({ id: poem.id, title: poem.title, poetId: poem.poetId, playable: true, poem, source: 'huayi' })),
]

export function getEntry(id: string): CatalogEntry | undefined {
  return CATALOG.find((e) => e.id === id)
}

export function getPoem(id: string): Poem | undefined {
  return CATALOG.find((e) => e.id === id)?.poem
}

export function getPoet(id: string): Poet | undefined {
  return POETS.find((p) => p.id === id)
}

export const FIRST_POEM_ID = 'denggao'
