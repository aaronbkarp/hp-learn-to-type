import { useState, useEffect, useCallback } from 'react'
import { supabase, UserProgress, LevelScore } from '../lib/supabase'
import { getAccuracy } from '../lib/levelConfig'

interface ProgressState {
  progress: UserProgress | null
  levelScores: LevelScore[]
  loading: boolean
  error: string | null
}

export interface GameResultParams {
  levelPlayed:  number
  spellsTyped:  number
  spellsMissed: number
  score:        number
  completed:    boolean
  durationSecs: number
}

export function useProgress(userId: string | null) {
  const [state, setState] = useState<ProgressState>({
    progress:    null,
    levelScores: [],
    loading:     false,
    error:       null,
  })

  const fetchProgress = useCallback(async () => {
    if (!userId) return
    setState(prev => ({ ...prev, loading: true }))

    const [progressRes, scoresRes] = await Promise.all([
      supabase.from('user_progress').select('*').eq('user_id', userId).single(),
      supabase.from('level_scores').select('*').eq('user_id', userId),
    ])

    setState({
      progress:    (progressRes.data as UserProgress | null),
      levelScores: (scoresRes.data as LevelScore[]) ?? [],
      loading:     false,
      error:       progressRes.error?.message ?? scoresRes.error?.message ?? null,
    })
  }, [userId])

  useEffect(() => {
    fetchProgress()
  }, [fetchProgress])

  // Returns the best score entry for a given level, or null
  const getLevelScore = useCallback(
    (level: number): LevelScore | null =>
      state.levelScores.find(s => s.level === level) ?? null,
    [state.levelScores],
  )

  // Returns the highest level the user has unlocked (1-based)
  const maxUnlockedLevel = useCallback((): number => {
    return state.progress?.max_level_reached ?? 1
  }, [state.progress])

  // Called at the end of every game session to persist results
  const saveGameResult = useCallback(
    async (params: GameResultParams) => {
      if (!userId) return

      const { levelPlayed, spellsTyped, spellsMissed, score, completed, durationSecs } = params
      const accuracy = getAccuracy(spellsTyped, spellsMissed)

      // 1. Upsert level score (preserves bests via GREATEST in the RPC)
      await supabase.rpc('upsert_level_score', {
        p_user_id:   userId,
        p_level:     levelPlayed,
        p_score:     score,
        p_accuracy:  accuracy,
        p_completed: completed,
      })

      // 2. Update cumulative progress
      const current = state.progress
      if (current) {
        await supabase
          .from('user_progress')
          .update({
            total_spells_typed:        current.total_spells_typed + spellsTyped,
            total_spells_missed:       current.total_spells_missed + spellsMissed,
            total_sessions:            current.total_sessions + 1,
            total_time_played_seconds: current.total_time_played_seconds + durationSecs,
            max_level_reached:         Math.max(
              current.max_level_reached,
              completed ? levelPlayed + 1 : levelPlayed,
            ),
            last_played_at: new Date().toISOString(),
          })
          .eq('user_id', userId)
      }

      // Refresh local state
      await fetchProgress()
    },
    [userId, state.progress, fetchProgress],
  )

  return {
    progress:         state.progress,
    levelScores:      state.levelScores,
    loading:          state.loading,
    error:            state.error,
    getLevelScore,
    maxUnlockedLevel,
    saveGameResult,
    refetch:          fetchProgress,
  }
}
