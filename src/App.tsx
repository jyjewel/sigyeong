import { useCallback, useEffect, useState } from 'react'
import { CATALOG, getPoem } from './data/catalog'
import type { Poem } from './data/types'
import { Play, layersFor, sceneFor } from './components/Play'
import { Finale } from './components/Finale'
import { Collection } from './components/Collection'
import { PixelView } from './components/PixelView'
import { SpriteSheet } from './components/SpriteSheet'
import { loadSave, markSaved, recordCompletion, recordRecall, writeSave } from './game/storage'
import type { AnswerLog, SaveData } from './game/storage'
import { setMuted } from './game/sound'
import { Recall } from './components/Recall'
import { RECALL_ROUNDS } from './game/recall'

type Screen =
  | { kind: 'title' }
  | { kind: 'play'; poemId: string; run: number }
  | { kind: 'finale'; poemId: string; placed: string[]; perfect: boolean; answers: AnswerLog[] }
  | { kind: 'replay'; poemId: string }
  | { kind: 'about' }
  | { kind: 'collection' }
  | { kind: 'sprites' }
  | { kind: 'recall'; poemId: string; run: number }

/** 완성 상태의 레이어 (도감에서 다시 보기용) */
function fullLayers(poem: Poem) {
  const scene = poem.finaleScene ? poem.scenes.find((s) => s.id === poem.finaleScene)! : sceneFor(poem, poem.questions.length - 1)
  const byQ = poem.questions.map((q) => q.choices.find((c) => c.correct)!.sprite)
  return { background: scene.background, placed: layersFor(scene, byQ, byQ.map((_, i) => i)) }
}

export default function App() {
  const [save, setSave] = useState<SaveData>(() => loadSave())
  const [screen, setScreen] = useState<Screen>(() =>
    location.hash === '#sprites'
      ? { kind: 'sprites' }
      : location.hash.startsWith('#finale-') && getPoem(location.hash.slice(8))
        ? { kind: 'replay', poemId: location.hash.slice(8) }
        : { kind: 'title' },
  )

  useEffect(() => {
    setMuted(save.muted)
    writeSave(save)
  }, [save])

  const start = useCallback((poemId: string) => {
    setScreen({ kind: 'play', poemId, run: Date.now() })
  }, [])

  const toggleMute = () => setSave((s) => ({ ...s, muted: !s.muted }))

  let body: React.ReactNode = null
  switch (screen.kind) {
    case 'title':
      body = (
        <div className="title-screen">
          <div className="title-bg">
            <PixelView background="title-spring" placed={[]} label="표지 풍경" fps={30} />
          </div>
          <div className="title-card frame paper">
            <h1 className="logo han">詩畫</h1>
            <p className="subtitle">한시의 풍경</p>
            <button className="primary big" onClick={() => setScreen({ kind: 'about' })} autoFocus>
              시작하기 ▶
            </button>
          </div>
        </div>
      )
      break
    case 'about':
      body = (
        <div className="title-screen">
          <div className="title-bg">
            <PixelView background="title-spring" placed={[]} label="표지 풍경" fps={30} />
          </div>
          <div className="about-card frame paper">
            <h1 className="about-title">시를 읽고, 풍경을 그리다</h1>
            <p>
              <span className="han">詩畫</span>는 한시 한 구절 한 구절이 그려 내는 이미지를 골라 풍경을 쌓아 가며 한시를 배우는 앱입니다.
              옛사람이 시 속에 담은 그림의 뜻[<span className="han">畫意</span>]을 직접 화면에 구성해 보면서, 글자의 뜻과 시의 짜임을 함께
              익힙니다.
            </p>
            <ol className="about-steps">
              <li>구절마다 보기 셋 가운데 그 구절의 이미지를 고르면, 풍경에 한 층이 더해집니다.</li>
              <li>네 구를 모두 맞히면 완성한 풍경과 함께 원문·번역·해설이 펼쳐집니다.</li>
              <li>완성한 풍경을 보며 「외워 보기」로 빈칸 글자를 채우다 보면 원문이 외워집니다.</li>
            </ol>
            <p className="about-source">
              작품 출처 · <span className="han">紫霞 申緯</span>(1769–1847)가 엮은 『<span className="han">唐詩畫意</span>』의 五言·六言 절구
            </p>
            <div className="row center">
              <button className="ghost" onClick={() => setScreen({ kind: 'title' })}>
                ◁ 처음으로
              </button>
              <button className="primary" onClick={() => setScreen({ kind: 'collection' })} autoFocus>
                작품 고르기 ▶
              </button>
            </div>
          </div>
        </div>
      )
      break
    case 'play': {
      const poem = getPoem(screen.poemId)!
      body = (
        <Play
          key={screen.run}
          poem={poem}
          onExit={() => setScreen({ kind: 'collection' })}
          onFinish={(r) => {
            setSave((s) => recordCompletion(s, poem.id, r.perfect, r.answers, r.thumbnail))
            setScreen({ kind: 'finale', poemId: poem.id, placed: r.placed, perfect: r.perfect, answers: r.answers })
          }}
        />
      )
      break
    }
    case 'finale': {
      const poem = getPoem(screen.poemId)!
      const bg = fullLayers(poem).background
      body = (
        <Finale
          poem={poem}
          background={bg}
          placed={screen.placed}
          perfect={screen.perfect}
          answers={screen.answers}
          mode="complete"
          onRecall={() => setScreen({ kind: 'recall', poemId: poem.id, run: Date.now() })}
          saved={!!save.records[poem.id]?.saved}
          onSave={() => setSave((s) => markSaved(s, poem.id))}
          onNext={() => {
            const playable = CATALOG.filter((e) => e.playable)
            const idx = playable.findIndex((e) => e.id === poem.id)
            const rest = [...playable.slice(idx + 1), ...playable.slice(0, idx)]
            const next = rest.find((e) => !save.records[e.id]) ?? rest[0]
            if (next) start(next.id)
            else setScreen({ kind: 'collection' })
          }}
        />
      )
      break
    }
    case 'replay': {
      const poem = getPoem(screen.poemId)!
      const L = fullLayers(poem)
      const rec = save.records[poem.id]
      body = (
        <Finale
          poem={poem}
          background={L.background}
          placed={L.placed}
          perfect={rec?.everPerfect}
          answers={rec?.answers}
          mode="replay"
          onRecall={() => setScreen({ kind: 'recall', poemId: poem.id, run: Date.now() })}
          onClose={() => setScreen({ kind: 'collection' })}
        />
      )
      break
    }
    case 'collection':
      body = (
        <Collection
          save={save}
          onPlay={start}
          onReplay={(id) => setScreen({ kind: 'replay', poemId: id })}
          onRecall={(id) => setScreen({ kind: 'recall', poemId: id, run: Date.now() })}
          onBack={() => setScreen({ kind: 'title' })}
        />
      )
      break
    case 'recall': {
      const poem = getPoem(screen.poemId)!
      body = (
        <Recall
          key={screen.run}
          poem={poem}
          onRound={(round, perfect) => setSave((s) => recordRecall(s, poem.id, round, perfect, RECALL_ROUNDS))}
          onExit={() => setScreen({ kind: 'collection' })}
        />
      )
      break
    }
    case 'sprites':
      body = <SpriteSheet onBack={() => setScreen({ kind: 'title' })} />
      break
  }

  return (
    <div className="app">
      {body}
      {screen.kind !== 'finale' && screen.kind !== 'replay' && (
      <button className="mute ghost small" onClick={toggleMute} aria-label={save.muted ? '소리 켜기' : '소리 끄기'}>
        {save.muted ? '소리 꺼짐' : '소리 켜짐'}
      </button>
      )}
      {CATALOG.length === 0 && <p>작품 데이터가 없습니다.</p>}
    </div>
  )
}
