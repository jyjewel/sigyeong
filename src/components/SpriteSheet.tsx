// 개발용 스프라이트 시트 (주소 끝에 #sprites). 모든 보기의 미리보기가 서로 다른지 한눈에 확인한다.
import { CATALOG } from '../data/catalog'
import { getSprite } from '../render/registry'
import { PixelView } from './PixelView'
import { layersFor, sceneFor } from './Play'

export function SpriteSheet({ onBack }: { onBack: () => void }) {
  return (
    <div className="collection">
      <header className="topbar simple">
        <button className="ghost small" onClick={onBack}>
          ◁ 처음으로
        </button>
        <h1 className="poem-title">스프라이트 시트</h1>
        <div />
      </header>
      {CATALOG.filter((e) => e.poem).map((e) => {
        const poem = e.poem!
        const byQ = poem.questions.map((q) => q.choices.find((c) => c.correct)!.sprite)
        return poem.questions.map((q, qi) => {
          const scene = sceneFor(poem, qi)
          const before = layersFor(scene, byQ, byQ.map((_, i) => i).filter((i) => i < qi))
          return (
            <section key={`${e.id}-${qi}`} className="poet-group">
              <h2 className="small">
                {qi + 1}. <span className="han">{q.line}</span>
              </h2>
              <div className="entries">
                {q.choices.map((c) => {
                  const s = getSprite(c.sprite)
                  return (
                    <div key={c.sprite} className="entry frame">
                      <PixelView background={scene.background} placed={[...before, c.sprite]} focus={s.focus} fps={20} className="thumb" />
                      <div className="entry-state">
                        {c.sprite} {c.correct ? '★' : ''}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })
      })}
    </div>
  )
}
