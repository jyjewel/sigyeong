import { useState } from 'react'
import { CATALOG, getPoet } from '../data/catalog'
import type { CatalogEntry } from '../data/types'
import { poetProgress, totalProgress } from '../game/storage'
import type { SaveData } from '../game/storage'
import { PoemInfo } from './Finale'

interface Props {
  save: SaveData
  mode: 'collection' | 'select'
  onPlay: (id: string) => void
  onReplay: (id: string) => void
  onBack: () => void
}

export function Collection({ save, mode, onPlay, onReplay, onBack }: Props) {
  const [detail, setDetail] = useState<CatalogEntry | null>(null)
  const [info, setInfo] = useState(false)
  const progress = poetProgress(save)
  const tot = totalProgress(save)

  return (
    <div className="collection">
      <header className="topbar simple">
        <button className="ghost small" onClick={onBack}>
          ◁ 처음으로
        </button>
        <h1 className="poem-title">{mode === 'collection' ? '도감' : '작품 선택'}</h1>
        <div className="counter">
          {tot.done} / {tot.total}
        </div>
      </header>

      {mode === 'collection' && (
        <section className="frame paper overall">
          <div className="bar">
            <div className="bar-fill" style={{ width: `${(tot.done / tot.total) * 100}%` }} />
          </div>
          <p className="small muted">
            전체 수집 {tot.done} / {tot.total} — 장기 목표는 『唐詩三百首』 한 판본의 전 작품입니다.
          </p>
          <div className="badges">
            {progress.map((p) => (
              <div key={p.poet.id} className={`badge ${p.badge ? 'on' : ''}`} title={p.poet.badge.description}>
                <div className="badge-icon han">{p.poet.name[0]}</div>
                <div className="badge-name">{p.poet.badge.name}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {progress.map((p) => (
        <section key={p.poet.id} className="poet-group">
          <h2>
            <span className="han">{p.poet.name}</span> 작품집
            <span className="small muted">
              {' '}
              · {p.poet.era} · 수록 {p.playableCount}편 중 {p.doneCount}편 완료
            </span>
          </h2>
          <div className="entries">
            {p.entries.map((e) => {
              const rec = save.records[e.id]
              return (
                <button
                  key={e.id}
                  className={`entry frame ${rec ? 'done' : ''} ${e.playable ? '' : 'locked'}`}
                  disabled={!e.playable}
                  onClick={() => (mode === 'select' || !rec ? onPlay(e.id) : setDetail(e))}
                >
                  {rec?.thumbnail ? (
                    <img src={rec.thumbnail} alt="" className="pixel thumb" />
                  ) : (
                    <div className="thumb empty">{e.playable ? '?' : '…'}</div>
                  )}
                  <div className="entry-title han">{e.title}</div>
                  <div className="entry-state">
                    {!e.playable ? '준비 중' : rec ? (rec.everPerfect ? '완료 · 완벽 독해' : '완료') : '미완료'}
                  </div>
                </button>
              )
            })}
          </div>
        </section>
      ))}

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
      {CATALOG.some((e) => !e.playable) && (
        <p className="small muted footnote">
          {CATALOG.filter((e) => !e.playable).length}편은 준비 중입니다. 새 작품은 데이터 파일만 추가하면 이 목록에 나타납니다.
        </p>
      )}
    </div>
  )
}
