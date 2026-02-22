import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GameEndResult } from '../../hooks/useGameState'
import { LevelConfig, getStars } from '../../lib/levelConfig'

interface LevelCompleteProps {
  result:      GameEndResult
  config:      LevelConfig
  onNextLevel: () => void
  onReplay:    () => void
  onLevelMap:  () => void
}

function FireworkBurst({ x, y, color, delay }: { x: number; y: number; color: string; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, width: 8, height: 8, background: color }}
      initial={{ scale: 0, opacity: 1 }}
      animate={{ scale: [0, 1, 3], opacity: [1, 0.8, 0] }}
      transition={{ delay, duration: 0.8, ease: 'easeOut' }}
    />
  )
}

const FIREWORK_POSITIONS = [
  { x: 15, y: 15, color: '#c9a84c' },
  { x: 80, y: 20, color: '#00f5d4' },
  { x: 25, y: 70, color: '#f59e0b' },
  { x: 75, y: 65, color: '#c9a84c' },
  { x: 50, y: 10, color: '#a78bfa' },
  { x: 90, y: 50, color: '#00f5d4' },
  { x: 10, y: 45, color: '#fbbf24' },
]

function StarDisplay({ count }: { count: 0 | 1 | 2 | 3 }) {
  const [shown, setShown] = useState(0)
  useEffect(() => {
    if (shown >= count) return
    const id = setTimeout(() => setShown(s => s + 1), 400)
    return () => clearTimeout(id)
  }, [shown, count])

  return (
    <div className="flex gap-3 justify-center my-4">
      {[1, 2, 3].map(i => (
        <AnimatePresence key={i}>
          {shown >= i ? (
            <motion.span
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="text-4xl"
              style={{ filter: 'drop-shadow(0 0 8px #c9a84c)' }}
            >
              ⭐
            </motion.span>
          ) : (
            <span className="text-4xl opacity-20">⭐</span>
          )}
        </AnimatePresence>
      ))}
    </div>
  )
}

export default function LevelComplete({
  result,
  config,
  onNextLevel,
  onReplay,
  onLevelMap,
}: LevelCompleteProps) {
  const stars = getStars(result.accuracy)
  const isLastLevel = config.level === 10

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(13, 7, 32, 0.92)', backdropFilter: 'blur(8px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Fireworks */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {FIREWORK_POSITIONS.map((fw, i) => (
          <FireworkBurst key={i} {...fw} delay={i * 0.15} />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
        className="relative z-10 text-center max-w-sm w-full mx-4 rounded-2xl p-8"
        style={{
          background: 'rgba(45, 27, 105, 0.95)',
          border:     '2px solid rgba(201, 168, 76, 0.6)',
          boxShadow:  '0 0 60px rgba(201, 168, 76, 0.2)',
        }}
      >
        {/* Animated checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.3 }}
          className="text-6xl mb-2"
        >
          {isLastLevel ? '🏆' : '✨'}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-hp-heading text-2xl text-hp-gold text-glow-gold"
        >
          {isLastLevel ? 'Master Wizard!' : 'Level Complete!'}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="font-hp-body text-white/60 italic mt-1 mb-2"
        >
          {config.name}
        </motion.p>

        <StarDisplay count={stars} />

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-2 gap-3 my-4 text-sm font-hp-body"
        >
          <div className="bg-hp-navy/60 rounded-lg p-3">
            <div className="text-hp-gold/60 text-xs uppercase tracking-wide">Spells Cast</div>
            <div className="text-hp-gold font-hp-score text-lg">{result.spellsTyped}</div>
          </div>
          <div className="bg-hp-navy/60 rounded-lg p-3">
            <div className="text-hp-gold/60 text-xs uppercase tracking-wide">Accuracy</div>
            <div className="text-hp-gold font-hp-score text-lg">{result.accuracy}%</div>
          </div>
          <div className="bg-hp-navy/60 rounded-lg p-3">
            <div className="text-hp-gold/60 text-xs uppercase tracking-wide">Score</div>
            <div className="text-hp-gold font-hp-score text-lg">{result.score.toLocaleString()}</div>
          </div>
          <div className="bg-hp-navy/60 rounded-lg p-3">
            <div className="text-hp-gold/60 text-xs uppercase tracking-wide">House Points</div>
            <div className="text-hp-gold font-hp-score text-lg">+{config.housePoints}</div>
          </div>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-col gap-2 mt-4"
        >
          {!isLastLevel && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onNextLevel}
              className="btn-hp-primary py-3 text-base"
            >
              Next Level →
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onReplay}
            className="btn-hp py-2 text-sm"
          >
            Play Again
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onLevelMap}
            className="text-white/40 hover:text-white/70 text-sm font-hp-body transition-colors py-1"
          >
            Level Map
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
