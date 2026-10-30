import { createContext, useContext } from 'react'

export const MuteContext = createContext<{ muted: boolean; toggle: () => void }>({ muted: false, toggle: () => {} })

/** 스피커 아이콘 소리 버튼. 소리를 끄면 대각선이 그어진다 */
export function MuteButton({ floating }: { floating?: boolean }) {
  const { muted, toggle } = useContext(MuteContext)
  return (
    <button
      className={`mute ghost ${floating ? 'floating' : ''}`}
      onClick={toggle}
      aria-label={muted ? '소리 켜기' : '소리 끄기'}
      aria-pressed={muted}
      title={muted ? '소리 켜기' : '소리 끄기'}
    >
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
        {muted ? (
          <path d="M3 3l18 18" />
        ) : (
          <>
            <path d="M16 9.5a3.5 3.5 0 0 1 0 5" />
            <path d="M18.5 7a7 7 0 0 1 0 10" />
          </>
        )}
      </svg>
    </button>
  )
}
