import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../components/auth/AuthProvider'
import LoginPageComponent from '../components/auth/LoginPage'

export default function LoginPage() {
  const { isAuthenticated, loading } = useAuthContext()
  const navigate = useNavigate()

  // Redirect authenticated users away from the login page
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/levels', { replace: true })
    }
  }, [isAuthenticated, loading, navigate])

  return <LoginPageComponent />
}
