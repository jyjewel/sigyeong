import { useEffect, useState } from 'react'
import type { Poem } from '../data/types'
import { getPoet } from '../data/catalog'
import { PixelView } from './PixelView'
import { sfx } from '../game/sound'
import type { AnswerLog } from '../game/storage'

interface Props {
  poem: Poem
  background: string
  placed: string[]
  perfect?: boolean
  answers?: AnswerLog[]
  /** 'complete': 방금 완성 / 'replay': 작품 목록에서 다시 보기 */
  mode: 'complete' | 'replay'
  onNext?: () => void
  onClose?: () => void
  /** 외워 보기 시작 */
  onRecall?: () => void
}

export function Finale(props: Props) {
  const { poem } = props
  const poet = getPoet(poem.poetId)
  const [run, setRun] = useState(0)
  const [info, setInfo] = useState(false)

  useEffect(() => {
    sfx.finale()
  }, [run])

  return (
    <div className="finale" role="dialog" aria-label={`${poem.title} 완성 풍경`}>
      <div className="finale-stage" key={run}>
        <PixelView background={props.background} placed={props.placed} className="finale-canvas" label="완성된 풍경" />
        <div className="finale-poem paper" lang="zh-Hant">
          <div className={`fp-title han ${poem.title.length > 5 ? 'long' : ''}`}>
            {poem.title}
            <span className="fp-poet">{poet?.name}</span>
          </div>
          {poem.lines.map((l, i) => (
            <div key={i} className="fp-line han" style={{ animationDelay: `${1.4 + i * 0.25}s` }}>
              {l}
            </div>
          ))}
        </div>
        {props.perfect && (
          <div className="seal han" title="첫 시도에 모든 구절을 맞혔습니다">
            完
          </div>
        )}
      </div>

      <div className="finale-bar">
        <button onClick={() => setRun((r) => r + 1)}>다시 감상</button>
        <button onClick={() => setInfo(true)}>원문과 해설</button>
        {props.onRecall && <button onClick={props.onRecall}>외워 보기</button>}
        {props.mode === 'complete' ? (
          <button className="primary" onClick={props.onNext}>
            다음 시 도전 ▶
          </button>
        ) : (
          <button className="primary" onClick={props.onClose}>
            닫기
          </button>
        )}
      </div>

      {info && <PoemInfo poem={poem} onClose={() => setInfo(false)} />}
    </div>
  )
}

export function PoemInfo({ poem, onClose }: { poem: Poem; onClose: () => void }) {
  const poet = getPoet(poem.poetId)
  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal frame paper" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="원문과 해설">
        <button className="modal-x ghost" onClick={onClose} aria-label="닫기">
          ✕
        </button>
        <h2>
          <span className="han">{poem.title}</span> <span className="han muted">{poet?.name}</span>
        </h2>
        <p className="muted small">
          {poem.era}
          {poem.form ? ` · ${poem.form}` : ''}
        </p>
        <table className="lines">
          <tbody>
            {poem.lines.map((l, i) => {
              return (
                <tr key={i}>
                  <td className="han orig" lang="zh-Hant">
                    {l}
                  </td>
                  <td>
                    {poem.translation[i]}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <h3>해설</h3>
        <p>{poem.commentary}</p>
        <h3>구절별 풀이</h3>
        <ol className="explains">
          {poem.questions.map((q, i) => (
            <li key={i}>
              {q.explanation}
              {q.note && <div className="note">※ {q.note}</div>}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
