import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useAuthContext } from './AuthProvider'

// Generate star field data once
function useStars(count: number) {
  return useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id:       i,
      top:      Math.random() * 100,
      left:     Math.random() * 100,
      size:     Math.random() * 2.5 + 0.5,
      delay:    Math.random() * 4,
      duration: Math.random() * 2 + 1.5,
    })),
  [count])
}

// Simple wand SVG illustration
function WandIllustration() {
  return (
    <motion.div
      animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className="text-6xl select-none"
    >
      🪄
    </motion.div>
  )
}

// Hogwarts castle silhouette via CSS shapes
function CastleSilhouette() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none" aria-hidden>
      <svg viewBox="0 0 1200 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Main castle body */}
        <rect x="200" y="80"  width="800" height="80" fill="#0d0720" />
        {/* Towers of varying heights */}
        <rect x="200" y="40"  width="60"  height="120" fill="#0d0720" />
        <rect x="320" y="20"  width="50"  height="140" fill="#0d0720" />
        <rect x="430" y="50"  width="45"  height="110" fill="#0d0720" />
        <rect x="570" y="10"  width="60"  height="150" fill="#0d0720" />
        <rect x="690" y="35"  width="45"  height="125" fill="#0d0720" />
        <rect x="800" y="25"  width="55"  height="135" fill="#0d0720" />
        <rect x="940" y="45"  width="60"  height="115" fill="#0d0720" />
        {/* Tower peaks */}
        <polygon points="200,40 230,5 260,40"  fill="#0d0720" />
        <polygon points="320,20 345,0 370,20"  fill="#0d0720" />
        <polygon points="430,50 452,22 475,50" fill="#0d0720" />
        <polygon points="570,10 600,0 630,10"  fill="#0d0720" />
        <polygon points="690,35 712,10 735,35" fill="#0d0720" />
        <polygon points="800,25 827,0 855,25"  fill="#0d0720" />
        <polygon points="940,45 970,18 1000,45" fill="#0d0720" />
        {/* Glowing windows */}
        <rect x="340" y="60" width="10" height="14" fill="#f0d080" opacity="0.6" rx="2" />
        <rect x="590" y="50" width="10" height="14" fill="#f0d080" opacity="0.5" rx="2" />
        <rect x="815" y="60" width="10" height="14" fill="#f0d080" opacity="0.7" rx="2" />
        <rect x="960" y="80" width="10" height="14" fill="#f0d080" opacity="0.4" rx="2" />
        {/* Ground */}
        <rect x="0" y="140" width="1200" height="20" fill="#0d0720" />
      </svg>
    </div>
  )
}

export default function LoginPage() {
  const { signInWithGoogle, loading, error } = useAuthContext()
  const stars = useStars(120)

  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden bg-hp-navy flex flex-col items-center justify-center">
      {/* Animated starfield */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {stars.map(star => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              top:              `${star.top}%`,
              left:             `${star.left}%`,
              width:            `${star.size}px`,
              height:           `${star.size}px`,
              animationDelay:   `${star.delay}s`,
              animationDuration:`${star.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Hogwarts silhouette */}
      <CastleSilhouette />

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center gap-6 px-8 py-10 rounded-2xl text-center"
        style={{
          background: 'rgba(26, 10, 46, 0.85)',
          border:     '1px solid rgba(201, 168, 76, 0.4)',
          boxShadow:  '0 0 60px rgba(201, 168, 76, 0.1), 0 20px 60px rgba(0,0,0,0.6)',
          backdropFilter: 'blur(12px)',
          maxWidth:   '420px',
          width:      '90%',
        }}
      >
        <WandIllustration />

        <div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-hp-heading text-3xl font-bold text-hp-gold text-glow-gold leading-tight"
          >
            Hogwarts
            <br />
            Spellcaster
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="font-hp-body text-lg text-white/70 mt-2 italic"
          >
            A magical touch-typing adventure
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-white/60 font-hp-body text-sm leading-relaxed"
        >
          Cast spells by typing their first letter before they hit the ground.
          Master the keyboard. Defend Hogwarts.
        </motion.div>

        {error && (
          <div className="text-red-400 text-sm font-hp-body bg-red-900/20 border border-red-500/30 rounded-lg px-4 py-2">
            {error}
          </div>
        )}

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={signInWithGoogle}
          disabled={loading}
          className="flex items-center gap-3 bg-white text-gray-800 font-semibold px-6 py-3 rounded-xl
                     shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {/* Google G logo */}
          <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden>
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          {loading ? 'Signing in…' : 'Sign in with Google'}
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-hp-gold/50 font-hp-body text-sm italic"
        >
          For Johnna & Ruby ⚡
        </motion.p>
      </motion.div>
    </div>
  )
}
