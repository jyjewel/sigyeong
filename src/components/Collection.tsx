import { useState } from 'react'
import { CATALOG, getEntry, getPoet } from '../data/catalog'
import { HUAYI } from '../data/huayi'
import type { CatalogEntry } from '../data/types'
import { huayiProgress } from '../game/storage'
import type { SaveData } from '../game/storage'
import { PoemInfo } from './Finale'

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
  const huayi = huayiProgress(save)
  const appendixDone = APPENDIX.filter((e) => save.records[e.id]).length

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
          {!e.playable ? '준비 중' : rec ? `완료${rec.everPerfect ? ' · 완벽 독해' : ''}${rec.recited ? ' · 誦' : ''}` : '미완료'}
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
                    {rec?.everPerfect && <span className="tag">완벽 독해</span>}
                    {rec?.recited ? (
                      <span className="tag">誦 암송</span>
                    ) : (
                      !!rec?.recallRound && <span className="tag soft">외워 보기 {rec.recallRound}단계</span>
                    )}
                    {rec?.saved && <span className="tag soft">도감 저장</span>}
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
