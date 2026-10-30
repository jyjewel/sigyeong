import { useState } from 'react'

interface Props {
  huayiTotal: number
  appendixTotal: number
  /** 完 (네 구를 한 번에 모두 맞힌 작품) 수 */
  perfectCount: number
  /** 誦 (외워 보기 마지막 단계를 다 맞힌 작품) 수 */
  recitedCount: number
  /** 마지막으로 완성한 날 */
  date: Date
  onClose: () => void
}

const NAME_KEY = 'sigyeong.cert.name'

function loadName() {
  try {
    return localStorage.getItem(NAME_KEY) ?? ''
  } catch {
    return ''
  }
}

/** 『唐詩畫意』와 부록을 모두 완성했을 때 주는 상장 */
export function Certificate(props: Props) {
  const [name, setName] = useState(loadName)
  const total = props.huayiTotal + props.appendixTotal
  const changeName = (v: string) => {
    setName(v)
    try {
      localStorage.setItem(NAME_KEY, v)
    } catch {
      /* 저장할 수 없어도 상장은 보인다 */
    }
  }

  return (
    <div className="modal-back cert-back" onClick={props.onClose}>
      <div className="cert" onClick={(ev) => ev.stopPropagation()}>
        <div className="cert-inner">
          <h2 className="cert-title han">賞 狀</h2>
          <label className="cert-name">
            <span className="muted small">이름</span>
            <input value={name} onChange={(e) => changeName(e.target.value)} placeholder="이름 쓰기" maxLength={20} />
          </label>
          <p className="cert-body">
            위 사람은 <span className="han">紫霞 申緯</span>의 『<span className="han">唐詩畫意</span>』에 실린 五言·六言 절구{' '}
            {props.huayiTotal}수와 부록 『<span className="han">唐詩三百首</span>』 {props.appendixTotal}수, 모두 {total}수의 풍경을
            하나하나 그려 내며 시 속에 담긴 그림의 뜻[<span className="han">畫意</span>]을 두루 익혔기에 이 상장을 드립니다.
          </p>
          <p className="cert-stats">
            <span>
              <b className="han">完</b> {props.perfectCount}수
            </span>
            <span>
              <b className="han">誦</b> {props.recitedCount}수
            </span>
          </p>
          <p className="cert-date">
            {props.date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <div className="cert-issuer">
            <span className="han">詩畫</span> — 한시의 풍경
            <span className="cert-seal han" aria-hidden>
              詩畫
              <br />
              之印
            </span>
          </div>
        </div>
        <div className="row center cert-actions">
          <button onClick={() => window.print()}>인쇄하기</button>
          <button className="primary" onClick={props.onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}
