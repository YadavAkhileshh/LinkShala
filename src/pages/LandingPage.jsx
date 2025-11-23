import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Rocket, Lock, Code, Palette, Brain, Eye, EyeOff, Zap, Shield } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import apiService from '../lib/api'

const LandingPage = () => {
  const [showAuth, setShowAuth] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [recentLinks, setRecentLinks] = useState([])
  const { signIn, signUp, signInWithGoogle, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/home')
    }
  }, [user, navigate])

  useEffect(() => {
    const fetchRecentLinks = async () => {
      try {
        const data = await apiService.getLinks({ limit: 6 })
        setRecentLinks(data.links || [])
      } catch (error) {
        console.error('Error fetching links:', error)
      }
    }
    fetchRecentLinks()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Gmail validation
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/
    if (!gmailRegex.test(email)) {
      setError('Please use a Gmail address (@gmail.com)')
      setLoading(false)
      return
    }

    try {
      if (isLogin) {
        const { error } = await signIn(email, password)
        if (error) throw error
        navigate('/home')
      } else {
        const { data, error } = await signUp(email, password, fullName)
        if (error) throw error
        
        // Check if email confirmation is required
        if (data.user && data.user.identities && data.user.identities.length === 0) {
          setError('✅ Verification email sent! Check your Gmail inbox and click the confirmation link to activate your account.')
        } else if (data.user && !data.session) {
          setError('✅ Verification email sent! Check your Gmail inbox and click the confirmation link.')
        } else if (data.session) {
          navigate('/home')
        }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const features = [
    { icon: Sparkles, title: 'Curated Quality', desc: 'Every link is handpicked and verified', color: 'from-vintage-gold to-vintage-brass' },
    { icon: Zap, title: 'Find Fast', desc: 'Search and discover in seconds', color: 'from-vintage-gold to-vintage-brass' },
    { icon: Shield, title: 'Always Secure', desc: 'Your data stays protected', color: 'from-vintage-gold to-vintage-brass' },
    { icon: Rocket, title: 'Stay Ahead', desc: 'Fresh resources added daily', color: 'from-vintage-gold to-vintage-brass' }
  ]

  const categories = [
    { icon: Code, name: 'React Components', count: '150+' },
    { icon: Brain, name: 'AI Tools', count: '80+' },
    { icon: Palette, name: 'Design Resources', count: '120+' },
    { icon: Rocket, name: 'Dev Platforms', count: '100+' }
  ]

  const stats = [
    { value: '500+', label: 'Quality Links' },
    { value: '50+', label: 'Categories' },
    { value: '1K+', label: 'Developers' },
    { value: '99.9%', label: 'Uptime' }
  ]

  return (
    <div className="min-h-screen bg-vintage-cream dark:bg-dark-bg">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 py-16 sm:py-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 -left-20 w-96 h-96 bg-vintage-gold/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-vintage-brass/10 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto text-center z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 sm:space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-vintage-gold/20 dark:bg-vintage-gold/10 px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-vintage-gold/30"
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-vintage-gold" />
              <span className="text-sm sm:text-base text-vintage-brown dark:text-vintage-gold font-serif font-medium">
                Your Developer Toolkit Awaits
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-vintage font-bold text-vintage-black dark:text-dark-text leading-tight px-4"
            >
              Welcome to the
              <br />
              <span className="bg-gradient-to-r from-vintage-gold via-vintage-brass to-vintage-gold bg-clip-text text-transparent inline-block mt-2">
                Dev Multiverse
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-3xl mx-auto px-4 space-y-3 sm:space-y-4"
            >
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-vintage-coffee dark:text-dark-muted font-serif leading-relaxed">
                <span className="font-semibold text-vintage-brass">React's vibing</span> with{' '}
                <span className="font-semibold text-vintage-brass">AI</span>,{' '}
                <span className="font-semibold text-vintage-brass">design's coding itself</span>, and your next big thing's already{' '}
                <span className="font-semibold text-vintage-brass">compiling</span>.
              </p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-vintage-black dark:text-dark-text">
                ⚡ Dive in. Decode. <span className="text-vintage-gold">Dominate.</span>
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col items-center justify-center gap-3 px-4 pt-4"
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <motion.button
                  onClick={() => { setShowAuth(true); setIsLogin(false) }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-vintage-gold to-vintage-brass text-white rounded-xl font-serif font-bold text-base sm:text-lg shadow-glow flex items-center justify-center space-x-2"
                >
                  <Rocket className="w-5 h-5" />
                  <span>Join Free</span>
                </motion.button>

                <motion.button
                  onClick={() => { setShowAuth(true); setIsLogin(true) }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-vintage-paper dark:bg-dark-card border-2 border-vintage-gold/30 dark:border-dark-border text-vintage-black dark:text-dark-text rounded-xl font-serif font-bold text-base sm:text-lg hover:bg-vintage-gold/10 transition-colors"
                >
                  Login
                </motion.button>
              </div>

              {/* ProductHunt Button */}
              <motion.a
                href="https://www.producthunt.com/posts/linkshala?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-linkshala"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-2 bg-white dark:bg-gray-900 px-3 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all mt-2"
              >
                <svg width="20" height="20" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 40C31.0457 40 40 31.0457 40 20C40 8.95431 31.0457 0 20 0C8.95431 0 0 8.95431 0 20C0 31.0457 8.95431 40 20 40Z" fill="#FF6154"/>
                  <path d="M20 11H15V29H20V23H23C26.3137 23 29 20.3137 29 17C29 13.6863 26.3137 11 23 11H20ZM20 19V15H23C24.1046 15 25 15.8954 25 17C25 18.1046 24.1046 19 23 19H20Z" fill="white"/>
                </svg>
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-tight uppercase tracking-wide">Featured on</span>
                  <span className="text-xs font-bold text-gray-900 dark:text-white leading-tight">Product Hunt</span>
                </div>
              </motion.a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto px-4 pt-8 sm:pt-12"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="bg-vintage-paper/50 dark:bg-dark-card/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-vintage-gold/20 dark:border-dark-border hover:border-vintage-gold/40 transition-colors"
                >
                  <div className="text-2xl sm:text-3xl md:text-4xl font-vintage font-bold text-vintage-gold mb-1 sm:mb-2">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-vintage-coffee dark:text-dark-muted font-serif">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>



      {/* Featured Resources Preview */}
      <section className="py-20 px-6 bg-vintage-paper dark:bg-dark-card border-y border-vintage-gold/20 dark:border-dark-border">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-4">
              Featured Resources
            </h2>
            <p className="text-xl text-vintage-coffee dark:text-dark-muted font-serif">
              Handpicked tools and resources to boost your productivity
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {recentLinks.map((link, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-vintage-cream dark:bg-dark-bg rounded-2xl p-6 border border-vintage-gold/20 dark:border-dark-border shadow-md hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => window.open(`${link.url}?ref=linkshala`, '_blank')}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="px-3 py-1 bg-vintage-gold/10 text-vintage-gold text-xs rounded-full font-serif capitalize">
                    {link.category || 'Resource'}
                  </span>
                  <svg className="w-5 h-5 text-vintage-gold group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
                <h3 className="text-xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-2 group-hover:text-vintage-gold transition-colors">
                  {link.title || link.name}
                </h3>
                <p className="text-sm text-vintage-coffee dark:text-dark-muted font-serif line-clamp-2">
                  {link.description || 'Discover this amazing resource'}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <button
              onClick={() => { setShowAuth(true); setIsLogin(false) }}
              className="px-8 py-3 bg-gradient-to-r from-vintage-gold to-vintage-brass text-white rounded-xl font-serif font-bold hover:from-vintage-brass hover:to-vintage-gold transition-all shadow-md"
            >
              View More Resources →
            </button>
          </motion.div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-20 px-6 bg-vintage-cream dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-4">
              Explore by Category
            </h2>
            <p className="text-xl text-vintage-coffee dark:text-dark-muted font-serif">
              Find exactly what you need, organized perfectly
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-vintage-paper dark:bg-dark-card rounded-2xl p-6 border border-vintage-gold/20 dark:border-dark-border shadow-md cursor-pointer group"
              >
                <category.icon className="w-10 h-10 text-vintage-gold mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-2">
                  {category.name}
                </h3>
                <p className="text-vintage-gold font-serif font-bold text-lg">
                  {category.count}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-vintage-cream dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-4">
              What Makes Us Different?
            </h2>
            <p className="text-xl text-vintage-coffee dark:text-dark-muted font-serif max-w-2xl mx-auto">
              Made by one developer, for all developers. All your tools in one spot.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-vintage-cream dark:bg-dark-bg rounded-2xl p-8 border border-vintage-gold/20 dark:border-dark-border shadow-lg"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-3">
                  {feature.title}
                </h3>
                <p className="text-vintage-coffee dark:text-dark-muted font-serif">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-vintage-gold/10 via-vintage-brass/5 to-vintage-gold/10 dark:from-vintage-gold/5 dark:via-vintage-brass/5 dark:to-vintage-gold/5 border-y-2 border-vintage-gold/30 dark:border-vintage-gold/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-6">
              Ready to Level Up?
            </h2>
            <p className="text-xl text-vintage-coffee dark:text-dark-muted font-serif mb-10">
              Join thousands of developers. Start free, no credit card needed. Build something amazing today.
            </p>
            <motion.button
              onClick={() => { setShowAuth(true); setIsLogin(false) }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-gradient-to-r from-vintage-gold to-vintage-brass text-white rounded-2xl font-serif font-bold text-xl shadow-glow"
            >
              Create Free Account
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuth && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAuth(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-vintage-paper dark:bg-dark-card rounded-3xl p-6 max-w-md w-full border-2 border-vintage-gold/30 dark:border-dark-border shadow-2xl relative"
            >
              <button
                onClick={() => setShowAuth(false)}
                className="absolute top-4 right-4 text-vintage-coffee dark:text-dark-muted hover:text-vintage-black dark:hover:text-dark-text"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-vintage-gold to-vintage-brass rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-1">
                  {isLogin ? 'Welcome Back' : 'Join LinkShala'}
                </h2>
                <p className="text-sm text-vintage-coffee dark:text-dark-muted font-serif">
                  {isLogin ? 'Sign in to access your links' : 'Create your free account'}
                </p>
              </div>

              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={async () => {
                  try {
                    const { error } = await signInWithGoogle()
                    if (error) setError(error.message)
                  } catch (err) {
                    setError(err.message)
                  }
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 mb-4 bg-white dark:bg-dark-bg border-2 border-vintage-gold/30 dark:border-dark-border rounded-xl hover:bg-vintage-cream dark:hover:bg-dark-card transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-sm font-serif font-medium text-vintage-black dark:text-dark-text">Continue with Google</span>
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-vintage-gold/20 dark:border-dark-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-vintage-paper dark:bg-dark-card text-vintage-coffee dark:text-dark-muted font-serif">Or continue with email</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-serif font-medium text-vintage-black dark:text-dark-text mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required={!isLogin}
                      className="w-full px-3 py-2 bg-vintage-cream dark:bg-dark-bg border border-vintage-gold/30 dark:border-dark-border rounded-lg text-vintage-black dark:text-dark-text font-serif text-sm focus:outline-none focus:ring-2 focus:ring-vintage-gold"
                      placeholder="ishowspeed"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-serif font-medium text-vintage-black dark:text-dark-text mb-2">
                    Gmail Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-vintage-cream dark:bg-dark-bg border border-vintage-gold/30 dark:border-dark-border rounded-lg text-vintage-black dark:text-dark-text font-serif text-sm focus:outline-none focus:ring-2 focus:ring-vintage-gold"
                    placeholder="yourname@gmail.com"
                  />
                  <p className="text-xs text-vintage-brown dark:text-dark-muted mt-1 font-serif">
                    Only Gmail addresses are accepted
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-serif font-medium text-vintage-black dark:text-dark-text mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-3 py-2 pr-10 bg-vintage-cream dark:bg-dark-bg border border-vintage-gold/30 dark:border-dark-border rounded-lg text-vintage-black dark:text-dark-text font-serif text-sm focus:outline-none focus:ring-2 focus:ring-vintage-gold"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-vintage-brown dark:text-dark-muted hover:text-vintage-gold transition-colors z-10"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className={`p-3 rounded-xl text-sm font-serif ${
                    error.includes('✅') || error.includes('Verification email sent')
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 border border-green-300 dark:border-green-700'
                      : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 border border-red-300 dark:border-red-700'
                  }`}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-gradient-to-r from-vintage-gold to-vintage-brass text-white rounded-lg font-serif font-bold text-sm hover:from-vintage-brass hover:to-vintage-gold transition-all disabled:opacity-50"
                >
                  {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Create Account'}
                </button>
              </form>

              <div className="mt-4 text-center">
                <button
                  onClick={() => { setIsLogin(!isLogin); setError('') }}
                  className="text-sm text-vintage-gold hover:text-vintage-brass font-serif font-medium"
                >
                  {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LandingPage
