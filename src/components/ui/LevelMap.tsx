import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { LEVEL_CONFIGS } from '../../lib/levelConfig'
import { LevelScore } from '../../lib/supabase'

interface LevelMapProps {
  maxUnlockedLevel: number
  levelScores:      LevelScore[]
}

function StarRating({ stars }: { stars: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3].map(i => (
        <span
          key={i}
          className="text-sm"
          style={{ opacity: i <= stars ? 1 : 0.2, filter: i <= stars ? 'drop-shadow(0 0 4px #c9a84c)' : 'none' }}
        >
          ⭐
        </span>
      ))}
    </div>
  )
}

export default function LevelMap({ maxUnlockedLevel, levelScores }: LevelMapProps) {
  const navigate = useNavigate()

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      {/* Parchment header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="font-hp-heading text-3xl text-hp-gold text-glow-gold">
          The Marauder's Path
        </h2>
        <p className="font-hp-body text-white/50 italic mt-1">
          I solemnly swear that I am up to no good
        </p>
      </motion.div>

      {/* Level grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {LEVEL_CONFIGS.map((config, idx) => {
          const isUnlocked = config.level <= maxUnlockedLevel
          const isCurrent  = config.level === maxUnlockedLevel
          const score      = levelScores.find(s => s.level === config.level)
          const stars      = score
            ? (score.best_accuracy >= 95 ? 3 : score.best_accuracy >= 85 ? 2 : 1)
            : 0
          const isCompleted = (score?.times_completed ?? 0) > 0

          return (
            <motion.div
              key={config.level}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.06 }}
              whileHover={isUnlocked ? { scale: 1.05 } : undefined}
              onClick={() => isUnlocked && navigate(`/game?level=${config.level}`)}
              className={`relative rounded-xl border p-4 flex flex-col items-center gap-2 transition-all duration-200
                ${isUnlocked
                  ? 'cursor-pointer border-hp-gold/40 bg-hp-purple/40 hover:bg-hp-purple/60 hover:border-hp-gold'
                  : 'cursor-not-allowed border-white/10 bg-white/5 opacity-50'
                }
                ${isCurrent && !isCompleted ? 'animate-pulse-gold' : ''}
              `}
              style={isUnlocked ? { boxShadow: '0 0 20px rgba(201,168,76,0.08)' } : undefined}
            >
              {/* Lock overlay */}
              {!isUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl">
                  <span className="text-3xl opacity-40">🔒</span>
                </div>
              )}

              {/* Level number badge */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-hp-score border"
                style={{
                  borderColor: isCompleted ? '#22c55e' : isCurrent ? '#c9a84c' : 'rgba(255,255,255,0.2)',
                  color:       isCompleted ? '#22c55e' : isCurrent ? '#c9a84c' : 'rgba(255,255,255,0.4)',
                  background:  isCompleted ? 'rgba(34,197,94,0.1)' : 'transparent',
                }}
              >
                {isCompleted ? '✓' : config.level}
              </div>

              {/* Icon */}
              <div className="text-3xl">{config.mapIcon}</div>

              {/* Level name */}
              <div className="text-center">
                <p className="font-hp-heading text-xs text-hp-gold leading-tight text-center">
                  {config.name}
                </p>
                <p className="font-hp-body text-white/40 text-[10px] mt-0.5 italic">
                  {config.subtitle}
                </p>
              </div>

              {/* Stars */}
              {isCompleted && <StarRating stars={stars} />}

              {/* Best score */}
              {score && score.best_score > 0 && (
                <p className="text-hp-gold/60 text-[10px] font-hp-score">
                  {score.best_score.toLocaleString()} pts
                </p>
              )}

              {/* Current level play button */}
              {isCurrent && !isCompleted && (
                <div className="text-hp-gold text-xs font-hp-score mt-1">PLAY →</div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Total house points */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center mt-8 text-hp-gold/60 font-hp-body"
      >
        <span className="text-hp-gold font-hp-score text-sm">
          {levelScores.reduce((sum, s) => sum + s.best_score, 0).toLocaleString()}
        </span>
        {' '}total house points earned
      </motion.div>
    </div>
  )
}
