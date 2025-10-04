import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, CheckCircle, XCircle, Loader } from 'lucide-react'
import { supabase } from '../lib/supabase'

const TestEmailPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const testSignup = async () => {
    setLoading(true)
    setStatus('Sending signup request...')
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: 'Test User'
          }
        }
      })

      if (error) throw error

      setResult({
        success: true,
        message: 'Signup successful! Check your email for verification link.',
        data: {
          user: data.user,
          session: data.session,
          emailSent: !data.session // If no session, email confirmation is required
        }
      })
      setStatus('✅ Success')
    } catch (error) {
      setResult({
        success: false,
        message: error.message,
        error: error
      })
      setStatus('❌ Error')
    } finally {
      setLoading(false)
    }
  }

  const checkEmailSettings = async () => {
    setLoading(true)
    setStatus('Checking Supabase settings...')
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      setResult({
        success: true,
        message: 'Supabase connection successful',
        data: {
          connected: true,
          currentSession: session ? 'Active session found' : 'No active session',
          supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
          redirectUrl: `${window.location.origin}/auth/callback`
        }
      })
      setStatus('✅ Connected')
    } catch (error) {
      setResult({
        success: false,
        message: error.message,
        error: error
      })
      setStatus('❌ Error')
    } finally {
      setLoading(false)
    }
  }

  const resendVerification = async () => {
    if (!email) {
      setResult({
        success: false,
        message: 'Please enter your email address'
      })
      return
    }

    setLoading(true)
    setStatus('Resending verification email...')
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error

      setResult({
        success: true,
        message: 'Verification email resent! Check your inbox and spam folder.'
      })
      setStatus('✅ Email sent')
    } catch (error) {
      setResult({
        success: false,
        message: error.message,
        error: error
      })
      setStatus('❌ Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-vintage-cream dark:bg-dark-bg py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-vintage-paper dark:bg-dark-card rounded-2xl p-8 shadow-vault border border-vintage-gold/20 dark:border-dark-border"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Mail className="w-8 h-8 text-vintage-gold" />
            <h1 className="text-3xl font-vintage font-bold text-vintage-black dark:text-dark-text">
              Email Verification Test
            </h1>
          </div>

          <div className="space-y-6">
            {/* Test Connection */}
            <div className="bg-vintage-cream dark:bg-dark-bg rounded-xl p-6 border border-vintage-gold/10 dark:border-dark-border">
              <h2 className="text-xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-4">
                1. Test Supabase Connection
              </h2>
              <button
                onClick={checkEmailSettings}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-serif flex items-center space-x-2"
              >
                {loading ? <Loader className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                <span>Check Connection</span>
              </button>
            </div>

            {/* Test Signup */}
            <div className="bg-vintage-cream dark:bg-dark-bg rounded-xl p-6 border border-vintage-gold/10 dark:border-dark-border">
              <h2 className="text-xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-4">
                2. Test Email Signup
              </h2>
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="test@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-vintage-paper dark:bg-dark-card border border-vintage-gold/30 dark:border-dark-border rounded-lg text-vintage-black dark:text-dark-text font-serif"
                />
                <input
                  type="password"
                  placeholder="Password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-vintage-paper dark:bg-dark-card border border-vintage-gold/30 dark:border-dark-border rounded-lg text-vintage-black dark:text-dark-text font-serif"
                />
                <button
                  onClick={testSignup}
                  disabled={loading || !email || !password}
                  className="bg-vintage-gold text-white px-6 py-3 rounded-lg hover:bg-vintage-brass transition-colors disabled:opacity-50 font-serif flex items-center space-x-2"
                >
                  {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
                  <span>Test Signup & Send Email</span>
                </button>
              </div>
            </div>

            {/* Resend Email */}
            <div className="bg-vintage-cream dark:bg-dark-bg rounded-xl p-6 border border-vintage-gold/10 dark:border-dark-border">
              <h2 className="text-xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-4">
                3. Resend Verification Email
              </h2>
              <button
                onClick={resendVerification}
                disabled={loading || !email}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 font-serif flex items-center space-x-2"
              >
                {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
                <span>Resend Verification</span>
              </button>
            </div>

            {/* Status */}
            {status && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-vintage-gold/10 dark:bg-dark-accent/10 rounded-xl p-4 border border-vintage-gold/20 dark:border-dark-accent/20"
              >
                <p className="text-vintage-brown dark:text-dark-accent font-serif font-medium">
                  Status: {status}
                </p>
              </motion.div>
            )}

            {/* Result */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl p-6 border ${
                  result.success
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                }`}
              >
                <div className="flex items-start space-x-3">
                  {result.success ? (
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1">
                    <h3 className={`text-lg font-vintage font-bold mb-2 ${
                      result.success ? 'text-green-800 dark:text-green-400' : 'text-red-800 dark:text-red-400'
                    }`}>
                      {result.success ? 'Success!' : 'Error'}
                    </h3>
                    <p className={`font-serif mb-4 ${
                      result.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                    }`}>
                      {result.message}
                    </p>
                    {result.data && (
                      <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4 font-mono text-sm overflow-auto">
                        <pre>{JSON.stringify(result.data, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-vintage font-bold text-blue-800 dark:text-blue-400 mb-3">
                📋 Testing Instructions
              </h3>
              <ol className="space-y-2 text-blue-700 dark:text-blue-300 font-serif text-sm">
                <li>1. Click "Check Connection" to verify Supabase is configured</li>
                <li>2. Enter a test email and password (min 6 characters)</li>
                <li>3. Click "Test Signup & Send Email"</li>
                <li>4. Check your email inbox (and spam folder)</li>
                <li>5. Click the verification link in the email</li>
                <li>6. You should be redirected to /auth/callback then /home</li>
              </ol>
            </div>

            {/* Configuration Info */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
              <h3 className="text-lg font-vintage font-bold text-yellow-800 dark:text-yellow-400 mb-3">
                ⚙️ Current Configuration
              </h3>
              <div className="space-y-2 text-yellow-700 dark:text-yellow-300 font-mono text-sm">
                <p><strong>Supabase URL:</strong> {import.meta.env.VITE_SUPABASE_URL}</p>
                <p><strong>Redirect URL:</strong> {window.location.origin}/auth/callback</p>
                <p><strong>Site URL:</strong> {window.location.origin}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default TestEmailPage
