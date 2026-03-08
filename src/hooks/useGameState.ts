import { useState, useEffect, useRef, useCallback } from 'react'
import {
  GameState,
  FallingSpellState,
  createInitialGameState,
  handleKeyPress,
  tickGameState,
  EFFECT_DURATION_MS,
} from '../lib/gameEngine'
import { LevelConfig, calculateScore, getAccuracy } from '../lib/levelConfig'
import { speakSpell, playMissSound } from '../lib/audio'

export interface GameEndResult {
  reason:      'health' | 'complete'
  spellsTyped: number
  spellsMissed: number
  accuracy:    number
  score:       number
  passed:      boolean
  durationSecs: number
}

export function useGameState(
  config: LevelConfig,
  onGameEnd: (result: GameEndResult) => void,
) {
  const [gameState, setGameState] = useState<GameState>(
    () => createInitialGameState(config.level),
  )
  // Mirror in a ref so RAF callbacks always see current state without stale closure
  const gameStateRef = useRef<GameState>(gameState)
  gameStateRef.current = gameState

  const configRef = useRef(config)
  configRef.current = config

  const onGameEndRef = useRef(onGameEnd)
  onGameEndRef.current = onGameEnd

  const animFrameRef = useRef<number>(0)
  const hasEndedRef  = useRef(false)

  // ---- Game loop (RAF-driven) ----
  const gameLoop = useCallback((now: number) => {
    const state = gameStateRef.current
    if (!state.isRunning || state.isPaused || state.isGameOver) return

    const cfg = configRef.current
    const prevMissed = state.spellsMissed
    const { newState, shouldEnd, endReason } = tickGameState(
      state,
      cfg,
      now,
      cfg.spellsToComplete,
    )
    // Play miss sound for each new spell that hit the ground this tick
    if (newState.spellsMissed > prevMissed) {
      playMissSound()
    }

    if (shouldEnd && !hasEndedRef.current) {
      hasEndedRef.current = true
      const accuracy = getAccuracy(newState.spellsTyped, newState.spellsMissed)
      const score = calculateScore(
        newState.spellsTyped,
        newState.spellsMissed,
        cfg.level,
        newState.comboStreak,
      )
      const durationSecs = Math.round((now - state.sessionStartTime) / 1000)

      setGameState(prev => ({
        ...prev,
        ...newState,
        isRunning:  false,
        isGameOver: endReason === 'health',
      }))

      // Use setTimeout to let React flush the state update before calling back
      setTimeout(() => {
        onGameEndRef.current({
          reason:      endReason ?? 'complete',
          spellsTyped: newState.spellsTyped,
          spellsMissed: newState.spellsMissed,
          accuracy,
          score,
          passed:      endReason === 'complete',
          durationSecs,
        })
      }, 0)
      return
    }

    setGameState(prev => ({
      ...prev,
      ...newState,
    }))

    animFrameRef.current = requestAnimationFrame(gameLoop)
  }, [])

  // ---- Start game ----
  const startGame = useCallback(() => {
    hasEndedRef.current = false
    const now = performance.now()
    const initial = createInitialGameState(configRef.current.level)
    const started: GameState = {
      ...initial,
      isRunning:        true,
      // Subtract spawnInterval so first spell appears immediately
      lastSpawnTime:    now - configRef.current.spawnIntervalMs,
      sessionStartTime: now,
    }
    setGameState(started)
    gameStateRef.current = started
    animFrameRef.current = requestAnimationFrame(gameLoop)
  }, [gameLoop])

  // ---- Pause/resume ----
  const togglePause = useCallback(() => {
    setGameState(prev => {
      if (!prev.isRunning) return prev
      const nowPaused = !prev.isPaused
      if (!nowPaused) {
        // Resuming: restart the RAF loop
        animFrameRef.current = requestAnimationFrame(gameLoop)
      }
      return { ...prev, isPaused: nowPaused }
    })
  }, [gameLoop])

  // ---- Key handling ----
  const processKey = useCallback((key: string) => {
    const state = gameStateRef.current
    if (!state.isRunning || state.isPaused) return

    const now = performance.now()
    const { matchedId, matchedSpell } = handleKeyPress(key, state.fallingSpells)

    if (!matchedId || !matchedSpell) return  // No match — no penalty

    speakSpell(matchedSpell.name)

    setGameState(prev => {
      const hitSpell = prev.fallingSpells.find((s): s is FallingSpellState => s.id === matchedId)
      if (!hitSpell) return prev

      const newCombo = prev.comboStreak + 1
      const newTyped = prev.spellsTyped + 1
      const newScore = calculateScore(newTyped, prev.spellsMissed, configRef.current.level, newCombo)

      const yPercent = ((now - hitSpell.startTime) / hitSpell.fallDurationMs) * 88

      return {
        ...prev,
        score:       newScore,
        comboStreak: newCombo,
        spellsTyped: newTyped,
        fallingSpells: prev.fallingSpells.map(s =>
          s.id === matchedId ? { ...s, status: 'hit' as const } : s,
        ),
        effects: [
          ...prev.effects.filter(e => now - e.timestamp < EFFECT_DURATION_MS),
          {
            id:          `hit-${matchedId}`,
            type:        'success' as const,
            xPercent:    hitSpell.xPercent,
            yPercent,
            spellName:   matchedSpell.displayName,
            description: matchedSpell.description,
            timestamp:   now,
          },
        ],
      }
    })
  }, [])

  // ---- Global keyboard listener ----
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        togglePause()
        return
      }
      // Only single printable chars, no modifier combos
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault()
        processKey(e.key)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [processKey, togglePause])

  // ---- RAF management ----
  useEffect(() => {
    if (gameState.isRunning && !gameState.isPaused) {
      animFrameRef.current = requestAnimationFrame(gameLoop)
    }
    return () => cancelAnimationFrame(animFrameRef.current)
  }, [gameState.isRunning, gameState.isPaused, gameLoop])

  return { gameState, startGame, togglePause }
}
