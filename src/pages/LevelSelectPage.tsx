import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../components/auth/AuthProvider'
import { useProgress } from '../hooks/useProgress'
import LevelMap from '../components/ui/LevelMap'
import BackgroundScene from '../components/game/BackgroundScene'
import { HOUSES, House } from '../lib/houseData'

export default function LevelSelectPage() {
  const { user, profile, signOut } = useAuthContext()
  const { progress, levelScores, maxUnlockedLevel, loading } = useProgress(user?.id ?? null)
  const navigate = useNavigate()

  // Redirect to sorting ceremony if user has no house yet
  useEffect(() => {
    if (profile !== null && !profile.house) {
      navigate('/sorting', { replace: true })
    }
  }, [profile, navigate])

  const house = profile?.house ? HOUSES[profile.house as House] : null

  return (
    <div className="relative w-full min-h-screen overflow-y-auto overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <BackgroundScene />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div
          className="sticky top-0 z-20 px-6 py-3 flex items-center justify-between"
          style={{ background: 'rgba(13, 7, 32, 0.9)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(201,168,76,0.15)' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🪄</span>
            <span className="font-hp-heading text-hp-gold text-lg hidden sm:block">
              Hogwarts Spellcaster
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* House badge */}
            {house && (
              <div
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-hp-body border"
                style={{
                  background:  `${house.colors.primary}33`,
                  borderColor: `${house.colors.secondary}66`,
                  color:        house.colors.secondary,
                }}
              >
                <span>{house.crest}</span>
                <span className="hidden sm:inline">{house.name}</span>
              </div>
            )}

            {/* Profile info */}
            <div className="flex items-center gap-2">
              {profile?.avatar_url && (
                <img
                  src={profile.avatar_url}
                  alt={profile.display_name ?? ''}
                  className="w-7 h-7 rounded-full border border-hp-gold/30"
                />
              )}
              <span className="text-white/70 font-hp-body text-sm hidden sm:block">
                {profile?.display_name ?? user?.email}
              </span>
            </div>

            <button
              onClick={() => navigate('/stats')}
              className="text-hp-gold/60 hover:text-hp-gold text-sm font-hp-body transition-colors"
            >
              📊 Stats
            </button>

            <button
              onClick={signOut}
              className="text-white/40 hover:text-white/70 text-xs font-hp-body transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Level map */}
        <div className="py-6">
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
          ) : (
            <LevelMap
              maxUnlockedLevel={maxUnlockedLevel()}
              levelScores={levelScores}
            />
          )}
        </div>

        {/* Welcome message for new users */}
        {!loading && !progress?.total_sessions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-md mx-auto px-4 pb-8 text-center"
          >
            <div
              className="rounded-xl px-6 py-4 border border-hp-gold/30"
              style={{ background: 'rgba(45, 27, 105, 0.7)' }}
            >
              <p className="text-hp-gold font-hp-heading text-sm mb-1">Welcome to Hogwarts! 🎩</p>
              <p className="text-white/60 font-hp-body text-sm">
                Start with Level 1 — The Sorting. Place your fingers on the home row
                and type the first letter of each falling spell to cast it!
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
