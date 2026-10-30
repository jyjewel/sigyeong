import { useState } from 'react'
import { CATALOG, getEntry, getPoet } from '../data/catalog'
import { HUAYI } from '../data/huayi'
import type { CatalogEntry } from '../data/types'
import { huayiProgress } from '../game/storage'
import type { SaveData } from '../game/storage'
import { PoemInfo } from './Finale'
import { Certificate } from './Certificate'

interface Props {
  save: SaveData
  onPlay: (id: string) => void
  onReplay: (id: string) => void
  onRecall: (id: string) => void
  onBack: () => void
}

/** 『唐詩畫意』 차례에 없는 『唐詩三百首』 작품 (부록) */
const IN_HUAYI = new Set(HUAYI.flatMap((s) => s.items.map((i) => i.id)))
const APPENDIX = CATALOG.filter((e) => (e.source ?? 'sanbai') === 'sanbai' && !IN_HUAYI.has(e.id))

export function Collection({ save, onPlay, onReplay, onRecall, onBack }: Props) {
  const [detail, setDetail] = useState<CatalogEntry | null>(null)
  const [info, setInfo] = useState(false)
  const [cert, setCert] = useState(false)
  const huayi = huayiProgress(save)
  const appendixDone = APPENDIX.filter((e) => save.records[e.id]).length
  const allIds = [...IN_HUAYI, ...APPENDIX.map((e) => e.id)]
  const allTotal = huayi.total + APPENDIX.length
  const allDone = huayi.done + appendixDone
  const complete = allDone === allTotal
  const recs = allIds.map((id) => save.records[id]).filter((r) => !!r)

  const card = (e: CatalogEntry, sub?: string) => {
    const rec = save.records[e.id]
    return (
      <button
        key={e.id}
        className={`entry frame ${rec ? 'done' : ''} ${e.playable ? '' : 'locked'}`}
        disabled={!e.playable}
        onClick={() => (rec ? setDetail(e) : onPlay(e.id))}
      >
        {rec?.thumbnail ? (
          <img src={rec.thumbnail} alt="" className="pixel thumb" />
        ) : (
          <div className="thumb empty">{e.playable ? '?' : '…'}</div>
        )}
        <div className="entry-title han">{e.title}</div>
        {sub && <div className="entry-poet han">{sub}</div>}
        <div className="entry-state">
          {!e.playable ? '준비 중' : rec ? `완료${rec.everPerfect ? ' · 完' : ''}${rec.recited ? ' · 誦' : ''}` : '미완료'}
        </div>
      </button>
    )
  }

  return (
    <div className="collection">
      <header className="topbar simple">
        <button className="ghost small" onClick={onBack}>
          ◁ 처음으로
        </button>
        <h1 className="poem-title han">
          <span className="small muted">紫霞 申緯</span> 『唐詩畫意』
        </h1>
        <div className="counter">
          {huayi.done} / {huayi.total}
        </div>
      </header>

      {complete && (
        <button className="cert-banner frame" onClick={() => setCert(true)}>
          <span className="han">賞狀</span> 모두 완성! 상장 보기 ▶
        </button>
      )}

      {HUAYI.map((sec) => {
        const ready = sec.items.filter((i) => getEntry(i.id)?.playable).length
        return (
          <section key={sec.title} className="poet-group">
            <h2>
              <span className="han">{sec.title}</span>
              <span className="small muted">
                {' '}
                · {sec.items.length}수 중 {ready}수 수록
              </span>
            </h2>
            <div className="entries">
              {sec.items.map((i) =>
                card(
                  getEntry(i.id) ?? { id: i.id, title: i.title.replace(/\s*\(.*\)/, ''), poetId: '', playable: false },
                  `${i.label} ${i.poet}`,
                ),
              )}
            </div>
          </section>
        )
      })}

      {APPENDIX.length > 0 && (
        <section className="poet-group appendix">
          <h2>
            부록 <span className="han">『唐詩三百首』</span>
            <span className="small muted">
              {' '}
              · 『唐詩畫意』의 五·六言 절구에 들지 않은 작품 {APPENDIX.length}편 · 완성 {appendixDone}편
            </span>
          </h2>
          <div className="entries">{APPENDIX.map((e) => card(e, getPoet(e.poetId)?.name))}</div>
        </section>
      )}

      <section className={`cert-slot frame ${complete ? 'open' : ''}`}>
        <div className="cert-slot-mark han">賞</div>
        <div>
          <div className="cert-slot-title">상장</div>
          <div className="small muted">
            {complete
              ? '『唐詩畫意』와 부록을 모두 완성했습니다.'
              : `『唐詩畫意』 ${huayi.total}수와 부록 ${APPENDIX.length}수를 모두 완성하면 상장을 드립니다 · ${allDone} / ${allTotal}`}
          </div>
        </div>
        {complete && (
          <button className="primary" onClick={() => setCert(true)}>
            상장 보기
          </button>
        )}
      </section>

      {cert && (
        <Certificate
          huayiTotal={huayi.total}
          appendixTotal={APPENDIX.length}
          perfectCount={recs.filter((r) => r.everPerfect).length}
          recitedCount={recs.filter((r) => r.recited).length}
          date={new Date(Math.max(...recs.map((r) => Date.parse(r.completedAt))))}
          onClose={() => setCert(false)}
        />
      )}

      {detail && detail.poem && (
        <div className="modal-back" onClick={() => setDetail(null)}>
          <div className="modal frame paper" onClick={(ev) => ev.stopPropagation()}>
            <button className="modal-x ghost" onClick={() => setDetail(null)} aria-label="닫기">
              ✕
            </button>
            {(() => {
              const rec = save.records[detail.id]
              const poem = detail.poem!
              return (
                <>
                  <h2>
                    <span className="han">{poem.title}</span>{' '}
                    <span className="han muted">{getPoet(poem.poetId)?.name}</span>
                  </h2>
                  <p className="small muted">
                    {poem.era} · {poem.form} · {rec ? `${new Date(rec.completedAt).toLocaleDateString('ko-KR')} 완료 · ${rec.plays}회` : ''}
                    {rec?.everPerfect && <span className="tag">完</span>}
                    {rec?.recited ? (
                      <span className="tag">誦 암송</span>
                    ) : (
                      !!rec?.recallRound && <span className="tag soft">외워 보기 {rec.recallRound}단계</span>
                    )}
                  </p>
                  {rec?.thumbnail && <img src={rec.thumbnail} alt="완성한 풍경" className="pixel detail-thumb" />}
                  <div className="detail-poem han" lang="zh-Hant">
                    {poem.lines.map((l, i) => (
                      <div key={i}>{l}</div>
                    ))}
                  </div>
                  {rec && (
                    <>
                      <h3>정답 기록 (최근 플레이)</h3>
                      <ol className="answer-log">
                        {rec.answers.map((a, i) => (
                          <li key={i}>
                            <span className="han">{a.line}</span> —{' '}
                            {a.picks.length <= 1 ? (
                              <span className="ok">{a.picks[0]} (한 번에)</span>
                            ) : (
                              <span>{a.picks.join(' → ')}</span>
                            )}
                          </li>
                        ))}
                      </ol>
                    </>
                  )}
                  <div className="row">
                    <button className="primary" onClick={() => onReplay(detail.id)}>
                      완성 애니메이션 다시 보기
                    </button>
                    <button onClick={() => setInfo(true)}>원문과 해설</button>
                    <button onClick={() => onRecall(detail.id)}>외워 보기</button>
                    <button onClick={() => onPlay(detail.id)}>다시 도전</button>
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      )}
      {info && detail?.poem && (
        <PoemInfo poem={detail.poem} answers={save.records[detail.id]?.answers} onClose={() => setInfo(false)} />
      )}
    </div>
  )
}
