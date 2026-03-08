import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../components/auth/AuthProvider'
import { supabase } from '../lib/supabase'
import HouseSortingQuiz from '../components/ui/HouseSortingQuiz'
import { House } from '../lib/houseData'

export default function SortingPage() {
  const { user, profile, loading, refreshProfile } = useAuthContext()
  const navigate = useNavigate()

  // If not logged in, send to login
  useEffect(() => {
    if (!loading && !user) navigate('/', { replace: true })
  }, [loading, user, navigate])

  // If already sorted, skip straight to levels
  useEffect(() => {
    if (!loading && profile?.house) navigate('/levels', { replace: true })
  }, [loading, profile, navigate])

  const handleSorted = async (house: House) => {
    if (!user) return
    await supabase
      .from('profiles')
      .update({ house })
      .eq('id', user.id)
    // Refresh the cached profile so LevelSelectPage sees the new house immediately
    await refreshProfile()
    navigate('/levels', { replace: true })
  }

  if (loading || !user || profile?.house) return null

  return <HouseSortingQuiz onSorted={handleSorted} />
}
