import { useState } from 'react'
import { getEntry, getPoet, poetNameOf } from '../data/catalog'
import { HUAYI } from '../data/huayi'
import { APPENDIX } from '../data/collection'
import type { CatalogEntry, Poem } from '../data/types'
import type { SaveData } from '../game/storage'
import { PoemInfo } from './Finale'
import { MuteButton } from './MuteButton'
import { Shelf } from './Shelf'
import type { BookId, ShelfBook } from './Shelf'

interface Props {
  save: SaveData
  onPlay: (id: string) => void
  onReplay: (id: string) => void
  onRecall: (id: string) => void
  onBack: () => void
  /** 自編詩畫帖에 꽂힌 시 */
  userPoems: Poem[]
  /** 시 넣기 화면으로 (Claude 아티팩트 판에서만) */
  onCreate?: () => void
}

/** 自編詩畫帖 만들기가 도는 Claude 아티팩트 */
const MAKER_URL = 'https://claude.ai/artifact/DUpbFUwW7R3G7PCeKqwKbn'


/** 시를 풀고 돌아왔을 때 보던 책을 다시 펼친다 */
let lastBook: BookId | null = null

const BOOK_NAME: Record<BookId, string> = { v8: '『唐詩畫意』 卷八', v9: '『唐詩畫意』 卷九', app: '부록 『唐詩三百首』', mine: '『自編詩畫帖』' }

export function Collection({ save, onPlay, onReplay, onRecall, onBack, userPoems, onCreate }: Props) {
  const [detail, setDetail] = useState<CatalogEntry | null>(null)
  const [info, setInfo] = useState(false)
  const [book, setBookState] = useState<BookId | null>(lastBook)
  const setBook = (b: BookId | null) => {
    lastBook = b
    setBookState(b)
    window.scrollTo(0, 0)
  }
  const appendixDone = APPENDIX.filter((e) => save.records[e.id]).length
  const secDone = (i: number) => HUAYI[i].items.filter((x) => save.records[x.id]).length
  const books: ShelfBook[] = [
    { id: 'v8', title: '唐詩畫意', sub: '卷八', done: secDone(0), total: HUAYI[0].items.length, cover: 'indigo' },
    {
      id: 'v9',
      title: '唐詩畫意',
      sub: '卷九',
      done: secDone(1) + secDone(2),
      total: HUAYI[1].items.length + HUAYI[2].items.length,
      cover: 'indigo',
    },
    { id: 'app', pre: '附錄', title: '唐詩三百首', done: appendixDone, total: APPENDIX.length, cover: 'ochre' },
    { id: 'mine', title: '自編詩畫帖', done: userPoems.length, cover: 'silk' },
  ]
  /** 책을 누르면 먼저 그 책의 소개가 뜬다 */
  const [bookInfo, setBookInfo] = useState<BookId | null>(null)
  const sections = book === 'v8' ? [HUAYI[0]] : book === 'v9' ? [HUAYI[1], HUAYI[2]] : []

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
        {(!e.playable || rec) && (
          <div className="entry-state">
            {!e.playable ? '준비 중' : `완료${rec!.everPerfect ? ' · 完' : ''}${rec!.recited ? ' · 誦' : ''}`}
          </div>
        )}
      </button>
    )
  }

  return (
    <div className="collection">
      <header className="topbar simple">
        <button className="ghost small" onClick={() => (book ? setBook(null) : onBack())}>
          {book ? '◁ 書架' : '◁ 처음으로'}
        </button>
        <h1 className="poem-title han">
          {book ? (
            <>
              {(book === 'v8' || book === 'v9') && <span className="small muted">紫霞 申緯</span>} {BOOK_NAME[book]}
            </>
          ) : null}
        </h1>
        <div className="counter">
          {(() => {
            const b = book && books.find((x) => x.id === book)
            return b ? (b.total === undefined ? `${b.done}수` : `${b.done} / ${b.total}`) : null
          })()}
        </div>
        <MuteButton />
      </header>

      {!book && <Shelf books={books} onOpen={setBookInfo} />}

      {sections.map((sec) => {
        const done = sec.items.filter((i) => save.records[i.id]).length
        return (
          <section key={sec.title} className="poet-group">
            <h2>
              <span className="han">{sec.title}</span>
              <span className="small muted">
                {' '}
                ({done}/{sec.items.length})
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

      {book === 'mine' && (
        <section className="poet-group">
          {onCreate && (
            <div className="row center mine-actions">
              <button className="primary" onClick={onCreate}>
                ✎ 시 넣기
              </button>
            </div>
          )}
          {userPoems.length === 0 ? (
            <p className="muted center-text">아직 꽂힌 시가 없습니다.</p>
          ) : (
            <div className="entries">
              {userPoems.map((p) => card({ id: p.id, title: p.title, poetId: p.poetId, playable: true, poem: p }, poetNameOf(p)))}
            </div>
          )}
        </section>
      )}

      {book === 'app' && (
        <section className="poet-group">
          <div className="entries">{APPENDIX.map((e) => card(e, getPoet(e.poetId)?.name))}</div>
        </section>
      )}


      {bookInfo && (
        <BookInfo
          id={bookInfo}
          book={books.find((x) => x.id === bookInfo)!}
          onOpen={
            bookInfo === 'mine' && !onCreate
              ? undefined
              : () => {
                  setBook(bookInfo)
                  setBookInfo(null)
                }
          }
          onClose={() => setBookInfo(null)}
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
                    <span className="han muted">{poetNameOf(poem)}</span>
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
        <PoemInfo poem={detail.poem} onClose={() => setInfo(false)} />
      )}
    </div>
  )
}

/** 책장에서 책을 눌렀을 때 뜨는 책 소개 */
function BookInfo({ id, book, onOpen, onClose }: { id: BookId; book: ShelfBook; onOpen?: () => void; onClose: () => void }) {
  const huayiIntro = (
    <p>
      『<span className="han">唐詩畫意</span>』는 <span className="han">紫霞 申緯</span>(1769–1847)가 그림의 뜻[<span className="han">畫意</span>]이
      살아 있는 당시를 가려 엮은 필사본 시선집입니다. 15권 5책으로, 권두에 申緯의 自序 2편과 徐耕輔·徐淇修의 서문 한 편씩, 모두 4편의
      서문이 붙어 있습니다. 이어지는 「例言十五則」과 「畫意總目」에서 시를 가려 뽑은 방법과 원칙, 그리고 시인 118명의 작품 540편이
      실렸음을 알 수 있습니다.
    </p>
  )
  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal frame paper book-info" onClick={(ev) => ev.stopPropagation()}>
        <button className="modal-x ghost" onClick={onClose} aria-label="닫기">
          ✕
        </button>
        {id === 'v8' || id === 'v9' ? (
          <>
            <h2 className="han">唐詩畫意 {id === 'v8' ? '卷八' : '卷九'}</h2>
            <p className="muted">
              {id === 'v8' ? '五言絕句 上 63수' : '五言絕句 下 54수 · 六言絕句 9수'}
            </p>
            {huayiIntro}
            <p className="small muted">
              이 앱에는 그 가운데 卷八·卷九의 五言絶句와 六言絶句 126수를 申緯의 차례대로 실었습니다.
            </p>
          </>
        ) : id === 'app' ? (
          <>
            <h2>
              부록 <span className="han">唐詩三百首</span>
            </h2>
            <p className="muted">
              名篇 {book.total}수
            </p>
            <p>
              『<span className="han">唐詩三百首</span>』는 淸 乾隆 연간에 <span className="han">蘅塘退士 孫洙</span>(1711–1778)가 엮은 당시
              선집으로, 시인 77명의 작품 300여 수를 담아 오늘날까지 가장 널리 읽히는 당시 입문서입니다.
            </p>
            <p className="small muted">
              이 앱에는 그 가운데 『唐詩畫意』의 五言·六言 절구에 들지 않은 名篇 {book.total}수를 부록으로 실었습니다. 율시와 칠언절구도 함께
              들어 있습니다.
            </p>
          </>
        ) : (
          <>
            <h2 className="han">自編詩畫帖</h2>
            <p className="muted">내가 고른 시로 엮는 시화첩</p>
            <p>
              원하는 시를 직접 넣어 이 책에 꽂을 수 있습니다. 시를 넣으면 다른 책과 똑같이 구절마다 그림 문제, 원문과 해설, 외워 보기가
              함께 만들어집니다.
            </p>
            <p className="small muted">(테스트 중) · 꽂힌 시 {book.done}수</p>
          </>
        )}
        <div className="row center">
          {onOpen ? (
            <button className="primary" onClick={onOpen} autoFocus>
              책 펼치기 ▶
            </button>
          ) : id === 'mine' ? (
            <>
              <a className="button primary" href={MAKER_URL} target="_blank" rel="noopener">
                Claude로 시 넣기 ↗
              </a>
              <button onClick={onClose}>닫기</button>
            </>
          ) : (
            <button className="primary" onClick={onClose} autoFocus>
              닫기
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
