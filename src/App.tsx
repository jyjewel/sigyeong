import { useCallback, useEffect, useState } from 'react'
import { CATALOG, FIRST_POEM_ID, getPoem } from './data/catalog'
import type { Poem } from './data/types'
import { Play, layersFor, sceneFor } from './components/Play'
import { Finale } from './components/Finale'
import { Collection } from './components/Collection'
import { PixelView } from './components/PixelView'
import { SpriteSheet } from './components/SpriteSheet'
import { loadSave, markSaved, recordCompletion, writeSave } from './game/storage'
import type { AnswerLog, SaveData } from './game/storage'
import { setMuted } from './game/sound'
import { Create } from './components/Create'
import { loadUserPoems } from './ai/store'
import type { GeneratedPoem } from './ai/generate'

/** 「내 시로 만들기」는 Claude 아티팩트 판(`npm run build:artifact`)에만 넣는다 */
const AI = import.meta.env.MODE === 'artifact'

type Screen =
  | { kind: 'title' }
  | { kind: 'play'; poemId: string; run: number }
  | { kind: 'finale'; poemId: string; placed: string[]; perfect: boolean; answers: AnswerLog[] }
  | { kind: 'replay'; poemId: string }
  | { kind: 'collection' }
  | { kind: 'select' }
  | { kind: 'sprites' }
  | { kind: 'create' }

/** 완성 상태의 레이어 (도감에서 다시 보기용) */
function fullLayers(poem: Poem) {
  const scene = poem.finaleScene ? poem.scenes.find((s) => s.id === poem.finaleScene)! : sceneFor(poem, poem.questions.length - 1)
  const byQ = poem.questions.map((q) => q.choices.find((c) => c.correct)!.sprite)
  return { background: scene.background, placed: layersFor(scene, byQ, byQ.map((_, i) => i)) }
}

export default function App() {
  const [save, setSave] = useState<SaveData>(() => loadSave())
  // 화면 상태보다 먼저 등록해야 #finale-작품id 로 바로 열 수 있다
  const [userPoems, setUserPoems] = useState<GeneratedPoem[]>(() => (AI ? loadUserPoems() : []))
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
  const firstPoem = getPoem(FIRST_POEM_ID)!
  const firstLayers = fullLayers(firstPoem)

  let body: React.ReactNode = null
  switch (screen.kind) {
    case 'title': {
      const rec = save.records[FIRST_POEM_ID]
      body = (
        <div className="title-screen">
          <div className="title-bg">
            <PixelView background={firstLayers.background} placed={rec ? firstLayers.placed : []} label="표지 풍경" fps={30} />
          </div>
          <div className="title-card frame paper">
            <h1 className="logo han">詩景</h1>
            <p className="subtitle">한시로 그리는 풍경</p>
            <button className="primary big" onClick={() => start(FIRST_POEM_ID)} autoFocus>
              시작하기 ▶
            </button>
            <div className="row center">
              <button onClick={() => setScreen({ kind: 'select' })}>작품 선택</button>
              <button onClick={() => setScreen({ kind: 'collection' })}>도감</button>
            </div>
            {AI && (
              <button className="create-entry" onClick={() => setScreen({ kind: 'create' })}>
                ✎ 내 시로 만들기 <span className="small muted">시제품</span>
              </button>
            )}
          </div>
        </div>
      )
      break
    }
    case 'play': {
      const poem = getPoem(screen.poemId)!
      body = (
        <Play
          key={screen.run}
          poem={poem}
          onExit={() => setScreen({ kind: poem.aiGenerated ? 'create' : 'title' })}
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
          saved={!!save.records[poem.id]?.saved}
          onSave={() => setSave((s) => markSaved(s, poem.id))}
          onNext={() => {
            if (poem.aiGenerated) return setScreen({ kind: 'create' })
            const playable = CATALOG.filter((e) => e.playable)
            const idx = playable.findIndex((e) => e.id === poem.id)
            const rest = [...playable.slice(idx + 1), ...playable.slice(0, idx)]
            const next = rest.find((e) => !save.records[e.id]) ?? rest[0]
            if (next) start(next.id)
            else setScreen({ kind: 'select' })
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
          onClose={() => setScreen({ kind: 'collection' })}
        />
      )
      break
    }
    case 'collection':
    case 'select':
      body = (
        <Collection
          save={save}
          mode={screen.kind}
          onPlay={start}
          onReplay={(id) => setScreen({ kind: 'replay', poemId: id })}
          onBack={() => setScreen({ kind: 'title' })}
        />
      )
      break
    case 'create':
      body = (
        <Create
          poems={userPoems}
          onChange={setUserPoems}
          onPlay={start}
          onBack={() => setScreen({ kind: 'title' })}
          layersOf={fullLayers}
        />
      )
      break
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
