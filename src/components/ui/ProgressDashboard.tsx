import { motion } from 'framer-motion'
import { UserProgress, LevelScore, Profile } from '../../lib/supabase'
import { LEVEL_CONFIGS, getStars } from '../../lib/levelConfig'

interface ProgressDashboardProps {
  profile:     Profile
  progress:    UserProgress | null
  levelScores: LevelScore[]
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-hp-purple/30 border border-hp-gold/20 rounded-xl p-4 flex items-center gap-3"
    >
      <span className="text-2xl">{icon}</span>
      <div>
        <div className="text-hp-gold/60 text-xs uppercase tracking-wide font-hp-body">{label}</div>
        <div className="text-hp-gold font-hp-score text-lg">{value}</div>
      </div>
    </motion.div>
  )
}

export default function ProgressDashboard({ profile, progress, levelScores }: ProgressDashboardProps) {
  const totalSpells = progress?.total_spells_typed ?? 0
  const totalMissed = progress?.total_spells_missed ?? 0
  const overallAccuracy = totalSpells + totalMissed > 0
    ? Math.round((totalSpells / (totalSpells + totalMissed)) * 100)
    : 0
  const levelsCompleted = levelScores.filter(s => s.times_completed > 0).length
  const totalPoints = levelScores.reduce((sum, s) => sum + s.best_score, 0)
  const timePlayed = formatTime(progress?.total_time_played_seconds ?? 0)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 scrollbar-hp overflow-y-auto">
      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-8"
      >
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.display_name ?? profile.username}
            className="w-16 h-16 rounded-full border-2 border-hp-gold/50"
          />
        ) : (
          <div className="w-16 h-16 rounded-full border-2 border-hp-gold/50 bg-hp-purple flex items-center justify-center text-2xl">
            🧙‍♀️
          </div>
        )}
        <div>
          <h2 className="font-hp-heading text-2xl text-hp-gold">
            {profile.display_name ?? profile.username}
          </h2>
          <p className="font-hp-body text-white/50 italic">
            Level {progress?.max_level_reached ?? 1} Witch/Wizard
          </p>
        </div>
      </motion.div>

      {/* Overall progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs font-hp-body text-white/50 mb-1">
          <span>Overall Progress</span>
          <span>{levelsCompleted} / 10 levels complete</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(to right, #2d1b69, #c9a84c)' }}
            initial={{ width: 0 }}
            animate={{ width: `${(levelsCompleted / 10) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <StatCard label="Spells Cast"    value={totalSpells.toLocaleString()} icon="⚡" />
        <StatCard label="Accuracy"       value={`${overallAccuracy}%`}        icon="🎯" />
        <StatCard label="House Points"   value={totalPoints.toLocaleString()} icon="🏆" />
        <StatCard label="Time Played"    value={timePlayed}                    icon="⏰" />
        <StatCard label="Sessions"       value={progress?.total_sessions ?? 0} icon="📚" />
        <StatCard label="Levels Done"    value={`${levelsCompleted}/10`}       icon="🗺️" />
      </div>

      {/* Per-level breakdown */}
      <h3 className="font-hp-heading text-lg text-hp-gold mb-4">Level Records</h3>
      <div className="space-y-2">
        {LEVEL_CONFIGS.map((config, idx) => {
          const score      = levelScores.find(s => s.level === config.level)
          const isUnlocked = config.level <= (progress?.max_level_reached ?? 1)
          const stars      = score ? getStars(score.best_accuracy) : 0
          const isComplete = (score?.times_completed ?? 0) > 0

          return (
            <motion.div
              key={config.level}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.04 }}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 border transition-colors
                ${isUnlocked
                  ? 'border-hp-gold/20 bg-hp-purple/20'
                  : 'border-white/5 bg-white/3 opacity-40'
                }`}
            >
              <span className="text-xl w-7 text-center">{config.mapIcon}</span>

              <div className="flex-1 min-w-0">
                <p className="font-hp-heading text-xs text-hp-gold truncate">{config.name}</p>
                <p className="font-hp-body text-white/40 text-[10px] italic">{config.subtitle}</p>
              </div>

              <div className="flex items-center gap-3 text-right shrink-0">
                {isComplete ? (
                  <>
                    <div className="flex gap-0.5">
                      {[1,2,3].map(i => (
                        <span key={i} className="text-xs" style={{ opacity: i <= stars ? 1 : 0.2 }}>⭐</span>
                      ))}
                    </div>
                    <div className="text-right">
                      <p className="text-hp-gold font-hp-score text-[10px]">
                        {score?.best_score.toLocaleString()}
                      </p>
                      <p className="text-white/40 text-[9px]">{score?.best_accuracy}%</p>
                    </div>
                  </>
                ) : isUnlocked ? (
                  <span className="text-hp-gold/50 text-xs font-hp-body italic">In progress</span>
                ) : (
                  <span className="text-white/20 text-xs">🔒</span>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
