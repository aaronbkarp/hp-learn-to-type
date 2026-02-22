import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthContext } from '../components/auth/AuthProvider'
import { useProgress } from '../hooks/useProgress'
import ProgressDashboard from '../components/ui/ProgressDashboard'
import BackgroundScene from '../components/game/BackgroundScene'

export default function StatsPage() {
  const { user, profile } = useAuthContext()
  const { progress, levelScores, loading } = useProgress(user?.id ?? null)
  const navigate = useNavigate()

  return (
    <div className="relative w-full min-h-screen overflow-y-auto overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <BackgroundScene />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div
          className="sticky top-0 z-20 px-6 py-3 flex items-center gap-4"
          style={{ background: 'rgba(13, 7, 32, 0.9)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(201,168,76,0.15)' }}
        >
          <button
            onClick={() => navigate('/levels')}
            className="text-hp-gold/60 hover:text-hp-gold transition-colors font-hp-body text-sm"
          >
            ← Level Map
          </button>
          <h1 className="font-hp-heading text-hp-gold text-lg">Your Progress</h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="text-4xl"
            >
              ⚡
            </motion.div>
          </div>
        ) : profile ? (
          <ProgressDashboard
            profile={profile}
            progress={progress}
            levelScores={levelScores}
          />
        ) : (
          <div className="flex items-center justify-center h-64 text-white/40 font-hp-body">
            No profile found.
          </div>
        )}
      </div>
    </div>
  )
}
