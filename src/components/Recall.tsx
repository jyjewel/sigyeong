import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Poem } from '../data/types'
import { getPoet } from '../data/catalog'
import { PixelView } from './PixelView'
import { layersFor, sceneFor } from './Play'
import { sfx } from '../game/sound'
import { RECALL_ROUNDS, buildRecall } from '../game/recall'
import { MuteButton } from './MuteButton'

interface Props {
  poem: Poem
  /** 한 단계를 마칠 때마다 (perfect: 그 단계를 한 번도 틀리지 않음) */
  onRound: (round: number, perfect: boolean) => void
  onExit: () => void
}

type Phase = 'ask' | 'line-done' | 'round-done'

export function Recall({ poem, onRound, onExit }: Props) {
  const [round, setRound] = useState(1)
  const [li, setLi] = useState(0)
  const [bi, setBi] = useState(0)
  const [tried, setTried] = useState<string[]>([])
  const [mistakes, setMistakes] = useState(0)
  const [phase, setPhase] = useState<Phase>('ask')

  const lines = useMemo(() => buildRecall(poem, round), [poem, round])
  const total = poem.lines.length
  const cur = lines[li]
  const blank = cur.blanks[bi]
  const poet = getPoet(poem.poetId)

  // 완성 풍경에서 지금 구절의 조각만 깜박이게 한다
  const byQ = useMemo(() => poem.questions.map((q) => q.choices.find((c) => c.correct)!.sprite), [poem])
  const scene = sceneFor(poem, li)
  const mine = byQ[li]
  const placed = layersFor(scene, byQ, byQ.map((_, k) => k)).filter((id) => phase !== 'ask' || id !== mine)

  const startRound = (r: number) => {
    setRound(r)
    setLi(0)
    setBi(0)
    setTried([])
    setMistakes(0)
    setPhase('ask')
  }

  const pick = useCallback(
    (ch: string) => {
      if (phase !== 'ask' || tried.includes(ch)) return
      if (ch !== blank.answer) {
        sfx.wrong()
        setTried((t) => [...t, ch])
        setMistakes((m) => m + 1)
        return
      }
      sfx.correct()
      setTried([])
      if (bi + 1 < cur.blanks.length) setBi(bi + 1)
      else setPhase('line-done')
    },
    [phase, tried, blank, bi, cur],
  )

  // 구절을 다 채우면 잠깐 보여 주고 다음 구절로
  useEffect(() => {
    if (phase !== 'line-done') return
    const id = setTimeout(() => {
      if (li + 1 < total) {
        setLi(li + 1)
        setBi(0)
        setPhase('ask')
      } else {
        sfx.finale()
        setPhase('round-done')
        onRound(round, mistakes === 0)
      }
    }, 1100)
    return () => clearTimeout(id)
  }, [phase, li, total, round, mistakes, onRound])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phase === 'ask' && ['1', '2', '3'].includes(e.key)) pick(blank.options[Number(e.key) - 1])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, pick, blank])

  const recited = phase === 'round-done' && round === RECALL_ROUNDS && mistakes === 0

  return (
    <div className="play recall">
      <header className="topbar">
        <button className="ghost small" onClick={onExit}>
          ◁ 그만하기
        </button>
        <h1 className={`poem-title ${poem.title.length > 5 ? 'long' : ''}`}>
          <span className="han">{poem.title}</span>
          <span className="sep">/</span>
          <span className="han poet">{poet?.name}</span>
        </h1>
        <div className="counter">
          외워 보기 <span className="num">{round}</span> / {RECALL_ROUNDS}단계
        </div>
        <MuteButton />
        <ol className="progress" aria-label="구절 진행도">
          {poem.lines.map((_, k) => (
            <li key={k} className={k < li || phase === 'round-done' || (k === li && phase === 'line-done') ? 'done' : k === li ? 'current' : ''} />
          ))}
        </ol>
      </header>

      <section className="stage frame">
        <PixelView
          background={scene.background}
          placed={placed}
          preview={phase === 'ask' ? mine : null}
          className="stage-canvas"
          label="완성한 풍경"
        />
        {recited && (
          <div className="seal han" title="마지막 단계를 한 번도 틀리지 않고 마쳤습니다">
            誦
          </div>
        )}
      </section>

      {phase === 'round-done' ? (
        <section className="console single">
          <div className="verse frame paper recall-done" role="status">
            <p className="recall-result">
              {recited
                ? '원문을 외웠어요! 마지막 단계를 한 번도 틀리지 않았습니다.'
                : `${round}단계를 마쳤어요. ${mistakes === 0 ? '한 번도 틀리지 않았어요.' : `틀린 횟수 ${mistakes}번.`}`}
            </p>
            <div className="recall-poem han" lang="zh-Hant">
              {poem.lines.map((l, k) => (
                <div key={k}>{l}</div>
              ))}
            </div>
            <div className="row">
              {round < RECALL_ROUNDS && (
                <button className="primary" onClick={() => startRound(round + 1)} autoFocus>
                  {round + 1}단계: 빈칸 {round + 1}개 ▶
                </button>
              )}
              {!recited && <button onClick={() => startRound(round)}>{round}단계 다시</button>}
              <button className={round < RECALL_ROUNDS ? 'ghost' : 'primary'} onClick={onExit}>
                끝내기
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className="console">
          <div className="verse frame paper">
            <div className="verse-line han recall-line" lang="zh-Hant" aria-label="빈칸이 있는 구절">
              {[...cur.line].map((ch, k) => {
                const b = cur.blanks.findIndex((x) => x.pos === k)
                if (b < 0) return <span key={k}>{ch}</span>
                const filled = b < bi || phase === 'line-done'
                return (
                  <span key={k} className={`slot ${filled ? 'filled' : b === bi ? 'now' : ''}`}>
                    {filled ? ch : '　'}
                  </span>
                )
              })}
            </div>
            <p className="prompt">{poem.translation[li]}</p>
            {tried.length > 0 && phase === 'ask' && (
              <p className="feedback wrong" role="status">
                <b>다시 떠올려 보세요.</b> 깜박이는 풍경 조각이 이 구절이에요.
              </p>
            )}
          </div>
          <div className="glyphs" role="group" aria-label="빈칸에 들어갈 글자">
            {blank.options.map((ch, i) => (
              <button
                key={`${round}-${li}-${bi}-${i}`}
                className={`glyph frame han ${tried.includes(ch) ? 'tried' : ''} ${phase === 'line-done' && ch === blank.answer ? 'answer' : ''}`}
                disabled={phase !== 'ask' || tried.includes(ch)}
                onClick={() => pick(ch)}
                lang="zh-Hant"
              >
                <span className="card-num">{'①②③'[i]}</span>
                {ch}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
