import { useState, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useAuthContext } from '../components/auth/AuthProvider'
import { useProgress } from '../hooks/useProgress'
import { getLevelConfig } from '../lib/levelConfig'
import { GameEndResult } from '../hooks/useGameState'
import GameCanvas from '../components/game/GameCanvas'
import LevelComplete from '../components/ui/LevelComplete'
import GameOver from '../components/ui/GameOver'

type GamePhase = 'playing' | 'complete' | 'gameover'

export default function GamePage() {
  const { user } = useAuthContext()
  const { saveGameResult, maxUnlockedLevel } = useProgress(user?.id ?? null)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const requestedLevel = parseInt(searchParams.get('level') ?? '1', 10)
  const [currentLevel, setCurrentLevel] = useState(requestedLevel)
  const [phase, setPhase] = useState<GamePhase>('playing')
  const [lastResult, setLastResult] = useState<GameEndResult | null>(null)
  const [gameKey, setGameKey] = useState(0)  // increment to remount GameCanvas

  // Validate level access
  const maxLevel = maxUnlockedLevel()
  const safeLevel = Math.min(Math.max(1, currentLevel), Math.max(maxLevel, 1))
  const config = getLevelConfig(safeLevel)

  const handleGameEnd = useCallback(async (result: GameEndResult) => {
    setLastResult(result)
    setPhase(result.passed ? 'complete' : 'gameover')

    // Save to Supabase
    await saveGameResult({
      levelPlayed:  safeLevel,
      spellsTyped:  result.spellsTyped,
      spellsMissed: result.spellsMissed,
      score:        result.score,
      completed:    result.passed,
      durationSecs: result.durationSecs,
    })
  }, [safeLevel, saveGameResult])

  const handleReplay = useCallback(() => {
    setPhase('playing')
    setLastResult(null)
    setGameKey(k => k + 1)
  }, [])

  const handleNextLevel = useCallback(() => {
    const next = safeLevel + 1
    if (next > 10) {
      navigate('/levels')
      return
    }
    setCurrentLevel(next)
    setPhase('playing')
    setLastResult(null)
    setGameKey(k => k + 1)
  }, [safeLevel, navigate])

  const handleLevelMap = useCallback(() => {
    navigate('/levels')
  }, [navigate])

  return (
    <div className="w-full h-screen overflow-hidden">
      {/* Game canvas fills the screen and is always mounted during gameplay */}
      <GameCanvas
        key={gameKey}
        config={config}
        onGameEnd={handleGameEnd}
        onQuit={handleLevelMap}
      />

      {/* Post-game overlays rendered on top */}
      <AnimatePresence>
        {phase === 'complete' && lastResult && (
          <LevelComplete
            key="complete"
            result={lastResult}
            config={config}
            onNextLevel={handleNextLevel}
            onReplay={handleReplay}
            onLevelMap={handleLevelMap}
          />
        )}
        {phase === 'gameover' && lastResult && (
          <GameOver
            key="gameover"
            result={lastResult}
            config={config}
            onReplay={handleReplay}
            onLevelMap={handleLevelMap}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
