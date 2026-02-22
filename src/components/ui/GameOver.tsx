import { motion } from 'framer-motion'
import { GameEndResult } from '../../hooks/useGameState'
import { LevelConfig } from '../../lib/levelConfig'

interface GameOverProps {
  result:     GameEndResult
  config:     LevelConfig
  onReplay:   () => void
  onLevelMap: () => void
}

export default function GameOver({ result, config, onReplay, onLevelMap }: GameOverProps) {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(13, 7, 32, 0.95)', backdropFilter: 'blur(8px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 22, delay: 0.1 }}
        className="text-center max-w-sm w-full mx-4 rounded-2xl p-8"
        style={{
          background: 'rgba(139, 0, 0, 0.15)',
          border:     '2px solid rgba(239, 68, 68, 0.4)',
          boxShadow:  '0 0 60px rgba(139, 0, 0, 0.3)',
        }}
      >
        <motion.div
          animate={{ rotate: [0, -5, 5, -3, 3, 0] }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="text-6xl mb-3"
        >
          💀
        </motion.div>

        <h2 className="font-hp-heading text-3xl text-red-400 text-glow-red mb-1">
          Expelliarmus!
        </h2>
        <p className="font-hp-body text-white/50 italic mb-1">Your health ran out</p>
        <p className="font-hp-body text-white/40 text-sm mb-6">
          {config.name} — Level {config.level}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-hp-navy/60 rounded-lg p-2 text-center">
            <div className="text-red-400/60 text-[10px] uppercase tracking-wide">Cast</div>
            <div className="text-white font-hp-score">{result.spellsTyped}</div>
          </div>
          <div className="bg-hp-navy/60 rounded-lg p-2 text-center">
            <div className="text-red-400/60 text-[10px] uppercase tracking-wide">Missed</div>
            <div className="text-red-400 font-hp-score">{result.spellsMissed}</div>
          </div>
          <div className="bg-hp-navy/60 rounded-lg p-2 text-center">
            <div className="text-red-400/60 text-[10px] uppercase tracking-wide">Accuracy</div>
            <div className="text-white font-hp-score">{result.accuracy}%</div>
          </div>
        </div>

        <p className="font-hp-body italic text-white/40 text-sm mb-6">
          "It is our choices that show what we truly are, far more than our abilities."
          <br />
          <span className="text-hp-gold/40">— Albus Dumbledore</span>
        </p>

        <div className="flex flex-col gap-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onReplay}
            className="btn-hp-primary py-3"
          >
            Try Again ↺
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onLevelMap}
            className="btn-hp py-2 text-sm"
          >
            Level Map
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
