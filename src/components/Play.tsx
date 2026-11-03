import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Poem, Scene } from '../data/types'
import { poetNameOf } from '../data/catalog'
import { getSprite } from '../render/registry'
import { PixelView, now, snapshot } from './PixelView'
import { sfx } from '../game/sound'
import type { AnswerLog } from '../game/storage'
import { MuteButton } from './MuteButton'
import { HANJA_HUN } from '../data/hanja'
import { TITLE_KO } from '../data/titles'

type Phase = 'title' | 'ask' | 'explain'

export function sceneFor(poem: Poem, qi: number): Scene {
  return poem.scenes.find((s) => qi >= s.from && qi <= s.to) ?? poem.scenes[poem.scenes.length - 1]
}

/** 해당 장면 범위에서 획득한 레이어만 (획득 순서대로) */
export function layersFor(scene: Scene, placedByQ: (string | null)[], order: number[]) {
  return order.filter((qi) => qi >= scene.from && qi <= scene.to && placedByQ[qi]).map((qi) => placedByQ[qi]!)
}

interface Props {
  poem: Poem
  onFinish: (r: { perfect: boolean; answers: AnswerLog[]; thumbnail: string; placed: string[] }) => void
  onExit: () => void
}

export function Play({ poem, onFinish, onExit }: Props) {
  const total = poem.questions.length
  const [qi, setQi] = useState(0)
  /** 눌러서 훈음을 띄운 글자 (제목 't3', 구절 'l2' 처럼 자리로 가리킨다) */
  const [gloss, setGloss] = useState<string | null>(null)
  useEffect(() => {
    if (gloss === null) return
    const close = (e: PointerEvent) => {
      if (!(e.target as Element).closest?.('.gloss-line')) setGloss(null)
    }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [gloss])
  const [placedByQ, setPlacedByQ] = useState<(string | null)[]>(() => poem.questions.map(() => null))
  const [order, setOrder] = useState<number[]>([])
  // 제목 풀이가 있으면 제목부터 보여 준다
  const [phase, setPhase] = useState<Phase>(() => (TITLE_KO[poem.id] ? 'title' : 'ask'))
  useEffect(() => setGloss(null), [qi, phase])
  const [hover, setHover] = useState<number | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [tried, setTried] = useState<number[]>([])
  const [feedback, setFeedback] = useState<string | null>(null)
  const [appear, setAppear] = useState<{ id: string; at: number } | null>(null)
  const logRef = useRef<AnswerLog[]>(poem.questions.map((q) => ({ line: q.line, picks: [] })))
  const mistakesRef = useRef(0)
  const pointerType = useRef<string>('mouse')
  const [touchMode, setTouchMode] = useState(
    () =>
      typeof window !== 'undefined' &&
      (window.matchMedia?.('(hover: none)').matches || navigator.maxTouchPoints > 0 || 'ontouchstart' in window),
  )

  const q = poem.questions[qi]
  const scene = sceneFor(poem, qi)
  const placed = useMemo(() => layersFor(scene, placedByQ, order), [scene, placedByQ, order])
  const active = hover ?? selected
  const previewSprite = phase === 'ask' && active !== null ? q.choices[active].sprite : null
  const correctIdx = q.choices.findIndex((c) => c.correct)

  const judge = useCallback(
    (i: number) => {
      if (phase !== 'ask' || tried.includes(i)) return
      const choice = q.choices[i]
      logRef.current[qi].picks.push(choice.label)
      if (choice.correct) {
        sfx.correct()
        setPlacedByQ((p) => p.map((v, k) => (k === qi ? choice.sprite : v)))
        setOrder((o) => [...o, qi])
        setAppear({ id: choice.sprite, at: now() })
        setPhase('explain')
        setFeedback(null)
        setHover(null)
        setSelected(null)
      } else {
        sfx.wrong()
        mistakesRef.current += 1
        setTried((t) => [...t, i])
        setHover(null)
        setSelected(null)
        setFeedback(q.hint)
      }
    },
    [phase, tried, q, qi],
  )

  const next = useCallback(() => {
    if (qi + 1 >= total) {
      const finalScene = poem.finaleScene ? poem.scenes.find((s) => s.id === poem.finaleScene)! : sceneFor(poem, total - 1)
      const finalPlaced = layersFor(finalScene, placedByQ, order)
      onFinish({
        perfect: mistakesRef.current === 0,
        answers: logRef.current,
        thumbnail: snapshot(finalScene.background, finalPlaced),
        placed: finalPlaced,
      })
      return
    }
    setQi(qi + 1)
    setPhase('ask')
    setTried([])
    setFeedback(null)
    setAppear(null)
    setHover(null)
    setSelected(null)
  }, [qi, total, poem, placedByQ, order, onFinish])

  // 키보드: 1·2·3 으로 미리보기, Enter 로 확정/다음
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest('button') && e.key === 'Enter') return
      if (phase === 'title') {
        if (e.key === 'Enter') setPhase('ask')
      } else if (phase === 'ask' && ['1', '2', '3'].includes(e.key)) {
        const i = Number(e.key) - 1
        if (!tried.includes(i)) setSelected(i)
      } else if (e.key === 'Enter') {
        if (phase === 'explain') next()
        else if (selected !== null) judge(selected)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, tried, selected, judge, next])

  const poetName = poetNameOf(poem)

  /** 글자마다 눌러서 대표 훈음을 볼 수 있게 한다 */
  const glossText = (text: string, key: string) =>
    text.split('').map((ch, k) => {
      const hun = HANJA_HUN[ch]
      if (!hun) return <span key={k}>{ch}</span>
      const id = `${key}${k}`
      const toggle = () => setGloss(gloss === id ? null : id)
      return (
        <span
          key={k}
          className={`gch ${gloss === id ? 'on' : ''}`}
          role="button"
          tabIndex={0}
          aria-label={`${ch} ${hun}`}
          onClick={toggle}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              e.stopPropagation()
              toggle()
            }
          }}
        >
          {ch}
          {gloss === id && (
            <span className="gtip" role="tooltip">
              {hun}
            </span>
          )}
        </span>
      )
    })
  const [mainTitle, series] = (() => {
    const m = poem.title.match(/^(.*?)\s*\((.*)\)$/)
    return m ? [m[1], m[2]] : [poem.title, '']
  })()

  return (
    <div className="play">
      <header className="topbar">
        <button className="ghost small" onClick={onExit} aria-label="처음 화면으로">
          ◁ 처음으로
        </button>
        <h1 className={`poem-title ${poem.title.length > 5 ? 'long' : ''}`}>
          <span className="han">{poem.title}</span>
          <span className="sep">/</span>
          <span className="han poet">{poetName}</span>
          {poem.aiGenerated && <span className="tag soft">AI 생성 · 검토 전</span>}
        </h1>
        <div className="counter">
          <span className="num">{qi + 1}</span> / {total}
        </div>
        <MuteButton />
        <ol className="progress" aria-label="정답 진행도">
          {poem.questions.map((_, k) => (
            <li
              key={k}
              className={placedByQ[k] ? 'done' : k === qi ? 'current' : ''}
              aria-label={`${k + 1}구 ${placedByQ[k] ? '완료' : '미완료'}`}
            />
          ))}
        </ol>
      </header>

      <section className="stage frame">
        <PixelView
          background={scene.background}
          placed={placed}
          preview={previewSprite}
          appear={appear}
          className="stage-canvas"
          label="한시 풍경"
        />
        {previewSprite && <div className="preview-tag">미리보기</div>}
      </section>

      <section className="console">
        <div className="verse frame paper">
          {phase === 'title' ? (
            <>
              <div className="verse-line gloss-line han" lang="zh-Hant">
                {glossText(mainTitle, 't')}
                {series && <span className="title-series"> {series}</span>}
              </div>
              <p className="prompt title-ko">{TITLE_KO[poem.id]}</p>
              <div className="explain">
                <button className="primary" onClick={() => setPhase('ask')} autoFocus>
                  첫 구절 ▶
                </button>
              </div>
            </>
          ) : (
            <div className="verse-line gloss-line han" lang="zh-Hant">
              {glossText(q.line, 'l')}
            </div>
          )}
          {phase === 'title' ? null : phase === 'ask' ? (
            <>
              <p className="prompt">{q.prompt}</p>
              {feedback && (
                <p className="feedback wrong" role="status">
                  <b>다시 생각해 보세요.</b> {feedback}
                </p>
              )}
            </>
          ) : (
            <div className="explain" role="status">
              <p className="explain-text">{q.explanation}</p>
              {q.note && <p className="note">※ {q.note}</p>}
              <button className="primary" onClick={next} autoFocus>
                {qi + 1 >= total ? '풍경 완성하기' : '다음 구절'} ▶
              </button>
            </div>
          )}
        </div>

        {phase !== 'title' && (
        <div className="choices" role="group" aria-label="선택지">
          {q.choices.map((c, i) => {
            const isTried = tried.includes(i)
            const isActive = phase === 'ask' && active === i
            const isAnswer = phase === 'explain' && i === correctIdx
            const sprite = getSprite(c.sprite)
            return (
              <button
                key={`${qi}-${i}`}
                className={`card frame ${isActive ? 'active' : ''} ${isTried ? 'tried' : ''} ${isAnswer ? 'answer' : ''} ${phase === 'explain' && !isAnswer ? 'dim' : ''}`}
                disabled={isTried || phase !== 'ask'}
                aria-pressed={selected === i}
                onPointerDown={(e) => {
                  pointerType.current = e.pointerType
                  if (e.pointerType !== 'mouse') setTouchMode(true)
                }}
                onPointerEnter={(e) => {
                  if (e.pointerType === 'mouse' && phase === 'ask' && !isTried) {
                    setHover(i)
                    sfx.hover()
                  }
                }}
                onPointerLeave={(e) => {
                  if (e.pointerType === 'mouse') setHover(null)
                }}
                onFocus={() => {
                  if (pointerType.current === 'keyboard') setSelected(i)
                }}
                onKeyDown={() => {
                  pointerType.current = 'keyboard'
                }}
                onClick={() => {
                  // 마우스·키보드: 클릭 즉시 판정 / 터치·펜: 미리보기만 하고 '선택' 버튼으로 판정
                  if (pointerType.current === 'touch' || pointerType.current === 'pen') {
                    setSelected(i)
                    sfx.hover()
                  } else judge(i)
                }}
              >
                <PixelView
                  background={scene.background}
                  placed={[...placed, c.sprite]}
                  focus={sprite.focus}
                  fps={15}
                  className="card-img"
                  label={sprite.name}
                />
                <span className="card-label">
                  <span className="card-num">{'①②③'[i]}</span> {c.label}
                </span>
                {isTried && <span className="card-x">✕</span>}
              </button>
            )
          })}
        </div>
        )}

        {touchMode && phase === 'ask' && (
          <div className="confirm-row">
            <button
              className="primary confirm"
              disabled={selected === null}
              onClick={() => selected !== null && judge(selected)}
            >
              선택
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
