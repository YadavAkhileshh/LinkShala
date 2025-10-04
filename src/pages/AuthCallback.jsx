import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const AuthCallback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the OAuth callback or email verification
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          const event = new CustomEvent('showToast', {
            detail: { message: 'Authentication failed. Please try again.', type: 'error' }
          })
          window.dispatchEvent(event)
          navigate('/')
          return
        }

        if (session) {
          // Successfully authenticated
          const event = new CustomEvent('showToast', {
            detail: { message: 'Email verified successfully! Welcome to LinkShala.', type: 'success' }
          })
          window.dispatchEvent(event)
          navigate('/home')
        } else {
          navigate('/')
        }
      } catch (error) {
        console.error('Unexpected error:', error)
        navigate('/')
      }
    }

    handleAuthCallback()
  }, [navigate])

  return (
    <div className="min-h-screen bg-vintage-cream dark:bg-dark-bg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vintage-gold mx-auto mb-4"></div>
        <p className="text-vintage-brown dark:text-dark-muted font-serif text-lg mb-2">
          Verifying your email...
        </p>
        <p className="text-vintage-coffee dark:text-dark-muted/70 font-serif text-sm">
          Please wait while we confirm your account
        </p>
      </div>
    </div>
  )
}

export default AuthCallback
