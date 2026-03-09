import { useState, useEffect, useCallback } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase, Profile } from '../lib/supabase'

interface AuthState {
  session: Session | null
  user: User | null
  profile: Profile | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    session: null,
    user:    null,
    profile: null,
    loading: true,
    error:   null,
  })

  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (error) {
      console.error('Profile fetch error:', error.message)
      return null
    }
    return data as Profile
  }, [])

  useEffect(() => {
    // OAuth callbacks (code= or access_token=) need more time for the exchange on slow networks
    const hasOAuthCallback = window.location.search.includes('code=') ||
      window.location.hash.includes('access_token=')
    const safetyMs = hasOAuthCallback ? 10000 : 3000

    // Safety net: if onAuthStateChange doesn't fire within the timeout, unblock loading anyway
    const safetyTimer = setTimeout(() => {
      setState(prev => prev.loading ? { ...prev, loading: false } : prev)
    }, safetyMs)

    // onAuthStateChange fires immediately with INITIAL_SESSION — no need for a separate getSession() call
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        // Immediately unblock the UI — don't wait for the profile DB fetch
        setState({ session, user: session?.user ?? null, profile: null, loading: false, error: null })

        // Fetch profile in the background, then slot it in
        if (session?.user) {
          try {
            const profile = await fetchProfile(session.user.id)
            setState(prev => ({ ...prev, profile }))
          } catch {
            // Profile unavailable — user can still navigate
          }
        }
      },
    )

    return () => {
      clearTimeout(safetyTimer)
      subscription.unsubscribe()
    }
  }, [fetchProfile])

  const signInWithGoogle = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/levels`,
      },
    })
    if (error) {
      setState(prev => ({ ...prev, error: error.message, loading: false }))
    }
    // On success the browser will redirect away — no further action needed
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setState({ session: null, user: null, profile: null, loading: false, error: null })
  }, [])

  // Force re-fetch the profile from the DB (e.g. after saving house assignment)
  const refreshProfile = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return
    const profile = await fetchProfile(session.user.id)
    setState(prev => ({ ...prev, profile }))
  }, [fetchProfile])

  return {
    session:         state.session,
    user:            state.user,
    profile:         state.profile,
    loading:         state.loading,
    error:           state.error,
    isAuthenticated: !!state.session,
    signInWithGoogle,
    signOut,
    refreshProfile,
  }
}
