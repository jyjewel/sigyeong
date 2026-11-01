import { useEffect, useRef, useState } from 'react'
import { CATALOG, poetNameOf } from '../data/catalog'
import type { Poem } from '../data/types'
import { PixelView } from './PixelView'
import { errorMessage, generatePoem, getSample, openPermissions, splitLines, whyUnavailable } from '../ai/generate'
import type { Unavailable } from '../ai/generate'
import type { GeneratedPoem } from '../ai/generate'
import { saveUserPoem } from '../ai/store'

interface Props {
  poems: GeneratedPoem[]
  onChange: (poems: GeneratedPoem[]) => void
  /** 시와 그 풀이 기록을 함께 지운다 */
  onRemove: (id: string) => void
  onPlay: (id: string) => void
  onBack: () => void
  /** 완성 상태의 배경·레이어 (App 의 fullLayers) */
  layersOf: (poem: Poem) => { background: string; placed: string[] }
}

const SAMPLE = { title: '靜夜思', poet: '李白', text: '床前明月光\n疑是地上霜\n舉頭望明月\n低頭思故鄉' }

type Status = { kind: 'idle' } | { kind: 'working'; chars: number; lines: number } | { kind: 'error'; message: string }

export function Create({ poems, onChange, onRemove, onPlay, onBack, layersOf }: Props) {
  const [available, setAvailable] = useState<boolean | null>(null)
  const [why, setWhy] = useState<Unavailable | null>(null)
  const [panelFailed, setPanelFailed] = useState(false)
  const [text, setText] = useState('')
  const [title, setTitle] = useState('')
  const [poet, setPoet] = useState('')
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const [result, setResult] = useState<GeneratedPoem | null>(null)
  const [compare, setCompare] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)
  const ctl = useRef<AbortController | null>(null)

  useEffect(() => {
    let live = true
    getSample().then(async (s) => {
      if (!live) return
      setAvailable(!!s)
      if (!s) {
        const w = await whyUnavailable()
        if (live) setWhy(w)
      }
    })
    return () => {
      live = false
      ctl.current?.abort()
    }
  }, [])

  const lineCount = splitLines(text).length

  const make = async () => {
    ctl.current = new AbortController()
    setStatus({ kind: 'working', chars: 0, lines: 0 })
    setResult(null)
    setCompare(false)
    try {
      const g = await generatePoem(
        { text, title: title.trim() || undefined, poet: poet.trim() || undefined },
        { signal: ctl.current.signal, onProgress: (chars, lines) => setStatus({ kind: 'working', chars, lines }) },
      )
      saveUserPoem(g)
      onChange([g, ...poems.filter((p) => p.poem.id !== g.poem.id)])
      setResult(g)
      setStatus({ kind: 'idle' })
    } catch (e) {
      setStatus((e as { code?: string })?.code === 'cancelled' ? { kind: 'idle' } : { kind: 'error', message: errorMessage(e) })
    }
  }

  // 한 번 누르면 '정말 지우기'로 바뀌고, 한 번 더 누르면 지운다
  const remove = (id: string) => {
    if (pendingDelete !== id) return setPendingDelete(id)
    setPendingDelete(null)
    onRemove(id)
    if (result?.poem.id === id) setResult(null)
  }

  const working = status.kind === 'working'
  const twin = result && CATALOG.find((e) => e.poem && e.poem.lines.join('') === result.poem.lines.join(''))?.poem

  return (
    <div className="collection create">
      <header className="topbar simple">
        <button className="ghost small" onClick={onBack}>
          ◁ 自編詩畫帖
        </button>
        <h1 className="poem-title">시 넣기</h1>
        <div className="counter small">테스트 중</div>
      </header>

      <section className="frame paper create-form">
        <p className="small muted">
          한시 원문을 넣으면 Claude가 구절별 문제와 픽셀 풍경을 만들어요. 여러분의 Claude 계정 사용량을 쓰고, 처음 한 번은
          허용할지 물어봐요. 만든 작품은 이 브라우저에만 저장돼요.
        </p>
        {available === false && (
          <div className="create-warn" role="alert">
            {why === 'denied' ? (
              <>
                <p>
                  {panelFailed
                    ? '권한 창을 열 수 없어요. 화면 위쪽 아티팩트 메뉴의 권한(Permissions)에서 Claude 사용을 켠 뒤 새로고침해 주세요.'
                    : '이 페이지의 Claude 사용을 거절해 둔 상태예요. 권한을 다시 켜면 만들 수 있어요.'}
                </p>
                {!panelFailed && (
                  <button
                    className="small"
                    onClick={async () => {
                      if (await openPermissions()) location.reload()
                      else setPanelFailed(true)
                    }}
                  >
                    권한 다시 켜기
                  </button>
                )}
              </>
            ) : why === 'no-runtime' ? (
              <p>
                지금은 Claude 화면 밖에서 열려 있어요. 받은 claude.ai/artifact/… 링크를 claude.ai에 로그인한 브라우저나 Claude
                앱에서 열어 주세요.
              </p>
            ) : (
              <p>
                이 화면에서는 Claude에 연결할 수 없어요. claude.ai에 로그인한 뒤 이 페이지를 새로고침해 주세요. 그래도 안 되면
                컴퓨터 브라우저(크롬·사파리)에서 claude.ai로 열어 보세요.
              </p>
            )}
            <p className="small muted">진단 코드: {why ?? '확인 중'}</p>
          </div>
        )}
        <label className="field">
          <span>원문 (한 줄에 한 구)</span>
          <textarea
            className="han"
            lang="zh-Hant"
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={'床前明月光\n疑是地上霜\n…'}
            disabled={working}
          />
        </label>
        <div className="field-row">
          <label className="field">
            <span>제목 (선택)</span>
            <input className="han" value={title} onChange={(e) => setTitle(e.target.value)} disabled={working} />
          </label>
          <label className="field">
            <span>시인 (선택)</span>
            <input className="han" value={poet} onChange={(e) => setPoet(e.target.value)} disabled={working} />
          </label>
        </div>
        <div className="row">
          {working ? (
            <button onClick={() => ctl.current?.abort()}>멈추기</button>
          ) : (
            <button className="primary" onClick={make} disabled={!available || lineCount < 2}>
              만들기 ▶
            </button>
          )}
          <button
            className="ghost"
            disabled={working}
            onClick={() => {
              setText(SAMPLE.text)
              setTitle(SAMPLE.title)
              setPoet(SAMPLE.poet)
            }}
          >
            예시 넣기: 靜夜思
          </button>
          <span className="small muted create-count">{lineCount > 0 && `${lineCount}구`}</span>
        </div>
        {working && (
          <p className="create-status" role="status">
            {status.chars === 0
              ? 'Claude가 생각하는 중… (1~2분 걸릴 수 있어요)'
              : `쓰는 중… ${Math.min(status.lines, lineCount)} / ${lineCount}구`}
          </p>
        )}
        {status.kind === 'error' && <p className="create-warn">{status.message}</p>}
      </section>

      {result && (
        <section className="frame paper create-result">
          <h2>
            <span className="han">{result.poem.title}</span> <span className="han muted">{poetNameOf(result.poem)}</span>
            <span className="tag soft">AI 생성 · 검토 전</span>
          </h2>
          <div className={compare && twin ? 'compare' : ''}>
            <figure>
              <PixelView {...layersOf(result.poem)} className="thumb" label="AI가 그린 완성 풍경" fps={30} />
              {compare && twin && <figcaption className="small muted">AI가 만든 풍경</figcaption>}
            </figure>
            {compare && twin && (
              <figure>
                <PixelView {...layersOf(twin)} className="thumb" label="직접 그린 완성 풍경" fps={30} />
                <figcaption className="small muted">직접 그린 풍경 (완성품)</figcaption>
              </figure>
            )}
          </div>
          <p className="small muted">완성했을 때의 모습이에요. 플레이하면 구절마다 한 조각씩 쌓여요.</p>
          <div className="row">
            <button className="primary" onClick={() => onPlay(result.poem.id)}>
              플레이 ▶
            </button>
            {twin && <button onClick={() => setCompare((c) => !c)}>{compare ? '비교 닫기' : '직접 그린 버전과 비교'}</button>}
          </div>
        </section>
      )}

      {poems.length > 0 && (
        <section className="poet-group">
          <h2>내가 만든 시</h2>
          <div className="entries">
            {poems.map((g) => (
              <div key={g.poem.id} className="entry frame">
                <PixelView {...layersOf(g.poem)} className="thumb" label="완성 풍경" fps={6} />
                <div className="entry-title han">{g.poem.title}</div>
                <div className="entry-state han">{poetNameOf(g.poem)}</div>
                <div className="row center">
                  <button className="small primary" onClick={() => onPlay(g.poem.id)}>
                    플레이
                  </button>
                  <button className="small ghost" onClick={() => remove(g.poem.id)} onBlur={() => setPendingDelete(null)}>
                    {pendingDelete === g.poem.id ? '정말 지우기' : '지우기'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
