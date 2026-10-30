import { useState } from 'react'
import { CATALOG, getEntry, getPoet } from '../data/catalog'
import { HUAYI } from '../data/huayi'
import type { CatalogEntry } from '../data/types'
import { huayiProgress, poetProgress, totalProgress } from '../game/storage'
import type { SaveData } from '../game/storage'
import { PoemInfo } from './Finale'

interface Props {
  save: SaveData
  mode: 'collection' | 'select'
  onPlay: (id: string) => void
  onReplay: (id: string) => void
  onRecall: (id: string) => void
  onBack: () => void
}

type Book = 'huayi' | 'sanbai'

const BOOK_KEY = 'sigyeong.book'
function loadBook(): Book {
  try {
    return localStorage.getItem(BOOK_KEY) === 'sanbai' ? 'sanbai' : 'huayi'
  } catch {
    return 'huayi'
  }
}

export function Collection({ save, mode, onPlay, onReplay, onRecall, onBack }: Props) {
  const [detail, setDetail] = useState<CatalogEntry | null>(null)
  const [info, setInfo] = useState(false)
  const [book, setBook] = useState<Book>(loadBook)
  const progress = poetProgress(save)
  const tot = book === 'huayi' ? huayiProgress(save) : totalProgress(save)

  const chooseBook = (b: Book) => {
    setBook(b)
    try {
      localStorage.setItem(BOOK_KEY, b)
    } catch {
      // 저장소를 못 쓰면 이번 방문 동안만 기억한다
    }
  }

  const card = (e: CatalogEntry, sub?: string) => {
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
        <h1 className="poem-title">{mode === 'collection' ? '도감' : '작품 선택'}</h1>
        <div className="counter">
          {tot.done} / {tot.total}
        </div>
      </header>

      <div className="books" role="tablist" aria-label="선집">
        <button role="tab" aria-selected={book === 'huayi'} className={book === 'huayi' ? 'primary' : ''} onClick={() => chooseBook('huayi')}>
          <span className="han">唐詩畫意</span> <span className="small">申緯 엮음</span>
        </button>
        <button role="tab" aria-selected={book === 'sanbai'} className={book === 'sanbai' ? 'primary' : ''} onClick={() => chooseBook('sanbai')}>
          <span className="han">唐詩三百首</span>
        </button>
      </div>

      {mode === 'collection' && (
        <section className="frame paper overall">
          <div className="bar">
            <div className="bar-fill" style={{ width: `${(tot.done / tot.total) * 100}%` }} />
          </div>
          <p className="small muted">
            {book === 'huayi'
              ? `수집 ${tot.done} / ${tot.total} — 紫霞 申緯가 그림이 되는 시를 골라 엮은 『唐詩畫意』의 五言·六言 절구입니다.`
              : `수집 ${tot.done} / ${tot.total} — 장기 목표는 『唐詩三百首』 한 판본의 전 작품입니다.`}
          </p>
          {book === 'sanbai' && (
            <div className="badges">
              {progress.map((p) => (
                <div key={p.poet.id} className={`badge ${p.badge ? 'on' : ''}`} title={p.poet.badge.description}>
                  <div className="badge-icon han">{p.poet.name[0]}</div>
                  <div className="badge-name">{p.poet.badge.name}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {book === 'huayi'
        ? HUAYI.map((sec) => {
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
          })
        : progress.map((p) => (
            <section key={p.poet.id} className="poet-group">
              <h2>
                <span className="han">{p.poet.name}</span> 작품집
                <span className="small muted">
                  {' '}
                  · {p.poet.era} · 수록 {p.playableCount}편 중 {p.doneCount}편 완료
                </span>
              </h2>
              <div className="entries">{p.entries.map((e) => card(e))}</div>
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
      {book === 'sanbai' && CATALOG.some((e) => !e.playable) && (
        <p className="small muted footnote">
          {CATALOG.filter((e) => !e.playable).length}편은 준비 중입니다. 새 작품은 데이터 파일만 추가하면 이 목록에 나타납니다.
        </p>
      )}
    </div>
  )
}
