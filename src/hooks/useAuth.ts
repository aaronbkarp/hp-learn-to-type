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
    // Load initial session — race against a 5s timeout so we never hang forever
    const sessionPromise = supabase.auth.getSession().then(async ({ data: { session } }) => {
      const profile = session?.user ? await fetchProfile(session.user.id) : null
      return { session, profile }
    })
    const timeoutPromise = new Promise<{ session: null; profile: null }>(resolve =>
      setTimeout(() => resolve({ session: null, profile: null }), 5000),
    )
    Promise.race([sessionPromise, timeoutPromise]).then(({ session, profile }) => {
      setState({ session, user: session?.user ?? null, profile, loading: false, error: null })
    })

    // Subscribe to auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const profile = session?.user ? await fetchProfile(session.user.id) : null
        setState({ session, user: session?.user ?? null, profile, loading: false, error: null })
      },
    )

    return () => subscription.unsubscribe()
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
