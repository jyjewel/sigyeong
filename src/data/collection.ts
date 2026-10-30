import { CATALOG } from './catalog'
import { HUAYI } from './huayi'

/** 『唐詩畫意』 차례에 든 작품 */
export const IN_HUAYI = new Set(HUAYI.flatMap((s) => s.items.map((i) => i.id)))
/** 『唐詩畫意』 차례에 없는 『唐詩三百首』 작품 (부록) */
export const APPENDIX = CATALOG.filter((e) => (e.source ?? 'sanbai') === 'sanbai' && !IN_HUAYI.has(e.id))
/** 상장을 받으려면 완성해야 하는 모든 작품 */
export const ALL_IDS = [...IN_HUAYI, ...APPENDIX.map((e) => e.id)]
