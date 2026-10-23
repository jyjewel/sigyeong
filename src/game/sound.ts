// Web Audio로 만든 짧은 8비트 효과음 (외부 파일 없음)
let ac: AudioContext | null = null
let muted = false

export function setMuted(m: boolean) {
  muted = m
}

function audio() {
  if (!ac) {
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      ac = new AC()
    } catch {
      return null
    }
  }
  if (ac.state === 'suspended') void ac.resume()
  return ac
}

function tone(freq: number, start: number, dur: number, type: OscillatorType, vol = 0.08) {
  const a = audio()
  if (!a || muted) return
  const o = a.createOscillator()
  const g = a.createGain()
  o.type = type
  o.frequency.value = freq
  const t0 = a.currentTime + start
  g.gain.setValueAtTime(0, t0)
  g.gain.linearRampToValueAtTime(vol, t0 + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  o.connect(g).connect(a.destination)
  o.start(t0)
  o.stop(t0 + dur + 0.02)
}

export const sfx = {
  correct() {
    // 오음음계 상행 (궁-상-각-치)
    ;[523.25, 587.33, 659.25, 783.99].forEach((f, i) => tone(f, i * 0.07, 0.18, 'square', 0.06))
    tone(1046.5, 0.3, 0.35, 'triangle', 0.07)
  },
  wrong() {
    tone(196, 0, 0.16, 'square', 0.05)
    tone(164.81, 0.12, 0.22, 'square', 0.05)
  },
  hover() {
    tone(880, 0, 0.04, 'triangle', 0.025)
  },
  finale() {
    const notes = [392, 440, 523.25, 587.33, 659.25, 783.99, 659.25, 587.33]
    notes.forEach((f, i) => tone(f, i * 0.16, 0.4, 'triangle', 0.05))
  },
}
