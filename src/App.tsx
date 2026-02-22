import { Routes, Route, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthContext } from './components/auth/AuthProvider'
import LoginPage from './pages/LoginPage'
import LevelSelectPage from './pages/LevelSelectPage'
import GamePage from './pages/GamePage'
import StatsPage from './pages/StatsPage'

function LoadingScreen() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-hp-navy gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        className="text-5xl"
      >
        ⚡
      </motion.div>
      <p className="font-hp-heading text-hp-gold/60 text-sm animate-pulse">
        Summoning your wand…
      </p>
    </div>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuthContext()
  if (loading) return <LoadingScreen />
  if (!isAuthenticated) return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  const { loading } = useAuthContext()

  if (loading) return <LoadingScreen />

  return (
    <Routes>
      <Route path="/"      element={<LoginPage />} />
      <Route path="/levels" element={<ProtectedRoute><LevelSelectPage /></ProtectedRoute>} />
      <Route path="/game"   element={<ProtectedRoute><GamePage /></ProtectedRoute>} />
      <Route path="/stats"  element={<ProtectedRoute><StatsPage /></ProtectedRoute>} />
      <Route path="*"       element={<Navigate to="/" replace />} />
    </Routes>
  )
}
