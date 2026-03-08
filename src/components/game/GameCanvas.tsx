import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LevelConfig } from '../../lib/levelConfig'
import { useGameState, GameEndResult } from '../../hooks/useGameState'
import BackgroundScene from './BackgroundScene'
import FallingSpell from './FallingSpell'
import HealthBar from './HealthBar'
import ScoreDisplay from './ScoreDisplay'
import { SpellEffectOverlay } from './SpellEffect'

interface GameCanvasProps {
  config:     LevelConfig
  onGameEnd:  (result: GameEndResult) => void
  onQuit:     () => void
}

// Countdown before game starts
function Countdown({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(3)

  useEffect(() => {
    if (count === 0) {
      onComplete()
      return
    }
    const id = setTimeout(() => setCount(c => c - 1), 1000)
    return () => clearTimeout(id)
  }, [count, onComplete])

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={count}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 1 }}
          exit={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="font-hp-heading text-8xl font-bold text-hp-gold text-glow-gold"
        >
          {count > 0 ? count : '⚡'}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

// Pre-game overlay
function StartOverlay({
  config,
  onStartCountdown,
  onQuit,
}: {
  config: LevelConfig
  onStartCountdown: () => void
  onQuit: () => void
}) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-30"
      style={{ background: 'rgba(13, 7, 32, 0.85)', backdropFilter: 'blur(6px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Back to map button */}
      <button
        onClick={onQuit}
        className="absolute top-4 left-4 text-white/40 hover:text-white/70 text-sm font-hp-body transition-colors flex items-center gap-1"
      >
        ← Level Map
      </button>

      <div className="text-center max-w-md px-6">
        <div className="text-5xl mb-4">{config.mapIcon}</div>
        <h2 className="font-hp-heading text-3xl text-hp-gold text-glow-gold mb-1">
          {config.name}
        </h2>
        <p className="font-hp-body text-hp-gold/70 italic mb-2">{config.subtitle}</p>
        <p className="font-hp-body text-white/70 mb-6">{config.description}</p>

        <div className="flex gap-4 justify-center text-sm font-hp-body text-white/60 mb-8">
          <span>🎯 Cast {config.spellsToComplete} spells</span>
          <span>✅ {config.requiredAccuracy}% accuracy</span>
        </div>

        {/* Letters for this level */}
        {config.newLetters.length > 0 && (
          <div className="mb-6">
            <p className="text-hp-gold/60 text-xs font-hp-score mb-2">NEW KEYS THIS LEVEL</p>
            <div className="flex gap-2 justify-center flex-wrap">
              {config.newLetters.map(l => (
                <span
                  key={l}
                  className="w-8 h-8 flex items-center justify-center rounded-md border border-hp-gold text-hp-gold font-hp-score text-sm animate-pulse-gold"
                >
                  {l}
                </span>
              ))}
            </div>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={onStartCountdown}
          className="btn-hp-primary text-lg px-8 py-4"
        >
          Cast Spells! ✨
        </motion.button>

        <p className="text-white/30 text-xs font-hp-body mt-4">Press Escape to pause during play</p>
      </div>
    </motion.div>
  )
}

// Pause overlay
function PauseOverlay({ onResume, onQuit }: { onResume: () => void; onQuit: () => void }) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-40"
      style={{ background: 'rgba(13, 7, 32, 0.9)', backdropFilter: 'blur(8px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center">
        <div className="text-6xl mb-4 animate-float">🧙‍♀️</div>
        <h2 className="font-hp-heading text-4xl text-hp-gold text-glow-gold mb-4">Paused</h2>
        <p className="font-hp-body text-white/60 mb-8 italic">
          "Even the greatest wizards must rest…"
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={onResume}
          className="btn-hp-primary px-8 py-3"
        >
          Resume ▶
        </motion.button>
        <p className="text-white/30 text-xs font-hp-body mt-3">or press Escape</p>
        <button
          onClick={onQuit}
          className="mt-6 text-white/40 hover:text-white/70 text-sm font-hp-body transition-colors block mx-auto"
        >
          ← Quit to Level Map
        </button>
      </div>
    </motion.div>
  )
}

export default function GameCanvas({ config, onGameEnd, onQuit }: GameCanvasProps) {
  const [phase, setPhase] = useState<'pregame' | 'countdown' | 'playing'>('pregame')

  // Separate RAF just for smooth visual position updates (doesn't touch game logic)
  const [now, setNow] = useState(() => performance.now())
  useEffect(() => {
    let id: number
    const tick = () => {
      setNow(performance.now())
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [])

  const handleGameEnd = useCallback((result: GameEndResult) => {
    onGameEnd(result)
  }, [onGameEnd])

  const { gameState, startGame, togglePause } = useGameState(config, handleGameEnd)

  const handleStartCountdown = useCallback(() => {
    setPhase('countdown')
  }, [])

  const handleCountdownComplete = useCallback(() => {
    setPhase('playing')
    startGame()
  }, [startGame])

  return (
    <div className="relative w-full h-full game-area overflow-hidden select-none">
      {/* Layer 1: Starfield + castle background */}
      <BackgroundScene />

      {/* Layer 2: HUD (score + health) */}
      {phase === 'playing' && (
        <div className="absolute top-0 left-0 right-0 z-20 px-4 pt-3 pb-2"
          style={{ background: 'linear-gradient(to bottom, rgba(13,7,32,0.8) 0%, transparent 100%)' }}
        >
          <div className="flex justify-between items-start gap-4">
            <ScoreDisplay
              score={gameState.score}
              comboStreak={gameState.comboStreak}
              spellsTyped={gameState.spellsTyped}
              level={config.level}
              levelName={config.name}
            />
            <HealthBar health={gameState.health} />
          </div>

          {/* Progress bar toward level completion */}
          <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width:      `${Math.min(100, (gameState.spellsTyped / config.spellsToComplete) * 100)}%`,
                background: 'linear-gradient(to right, #2d1b69, #c9a84c)',
              }}
            />
          </div>
        </div>
      )}

      {/* Layer 3: Falling spells */}
      <div className="absolute inset-0 z-10">
        {gameState.fallingSpells.map(spell => (
          <FallingSpell key={spell.id} spell={spell} now={now} />
        ))}
      </div>

      {/* Layer 4: Spell effects (sparkles, smoke) */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        {gameState.effects.map(effect => (
          <SpellEffectOverlay key={effect.id} effect={effect} />
        ))}
      </div>

      {/* Layer 5: Overlays (pre-game, countdown, pause) */}
      <AnimatePresence>
        {phase === 'pregame' && (
          <StartOverlay key="start" config={config} onStartCountdown={handleStartCountdown} onQuit={onQuit} />
        )}
        {phase === 'countdown' && (
          <Countdown key="countdown" onComplete={handleCountdownComplete} />
        )}
        {phase === 'playing' && gameState.isPaused && (
          <PauseOverlay key="pause" onResume={togglePause} onQuit={onQuit} />
        )}
      </AnimatePresence>
    </div>
  )
}
