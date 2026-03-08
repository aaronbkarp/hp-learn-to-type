// ---- Spell name: Web Speech API ----

export function speakSpell(name: string): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return

  // Cancel any in-progress speech so we don't queue up a backlog
  window.speechSynthesis.cancel()

  const utt = new SpeechSynthesisUtterance(name)
  utt.rate   = 0.75  // slow and deliberate
  utt.pitch  = 0.85  // slightly lower — authoritative
  utt.volume = 1.0

  window.speechSynthesis.speak(utt)
}

// ---- Miss sound: voldemort.mp3 ----

let missAudio: HTMLAudioElement | null = null
let missDebounceTimer: ReturnType<typeof setTimeout> | null = null

export function playMissSound(): void {
  if (typeof window === 'undefined') return

  // Debounce: don't stack rapid misses
  if (missDebounceTimer) return
  missDebounceTimer = setTimeout(() => { missDebounceTimer = null }, 600)

  if (!missAudio) {
    missAudio = new Audio('/sfx/voldemort.mp3')
    missAudio.volume = 0.6
  }

  // Rewind and replay
  missAudio.currentTime = 0
  missAudio.play().catch(() => {
    // Browser may block autoplay — silently ignore
  })
}
