import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link2, Zap, Shield, TrendingUp, Users, Star, Check, X, Sparkles, Rocket, Lock, Code, Palette, Brain } from 'lucide-react'
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
  const [promotedLink, setPromotedLink] = useState(null)
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPromotedLink = async () => {
      try {
        const data = await apiService.getLinks({ page: 1, limit: 100 })
        const promoted = data.links.find(link => link.isPromoted)
        setPromotedLink(promoted)
      } catch (error) {
        console.error('Error fetching promoted link:', error)
      }
    }
    fetchPromotedLink()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        const { error } = await signIn(email, password)
        if (error) throw error
        navigate('/home')
      } else {
        const { error } = await signUp(email, password, fullName)
        if (error) throw error
        setError('Check your email to confirm your account!')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const features = [
    { icon: Link2, title: 'Curated Links', desc: 'Hand-picked resources for developers', color: 'from-blue-500 to-blue-600' },
    { icon: Zap, title: 'Lightning Fast', desc: 'Instant search and filtering', color: 'from-yellow-500 to-orange-500' },
    { icon: Shield, title: 'Secure Access', desc: 'Protected with authentication', color: 'from-green-500 to-emerald-600' },
    { icon: TrendingUp, title: 'Always Updated', desc: 'Fresh content added daily', color: 'from-purple-500 to-pink-500' }
  ]

  const categories = [
    { icon: Code, name: 'React Libraries', count: '150+' },
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
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-vintage-gold/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-vintage-brass/10 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-vintage-gold/20 dark:bg-vintage-gold/10 px-6 py-3 rounded-full mb-8 border border-vintage-gold/30"
            >
              <Sparkles className="w-5 h-5 text-vintage-gold" />
              <span className="text-vintage-brown dark:text-vintage-gold font-serif font-medium">
                Your Developer Toolkit Awaits
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl lg:text-8xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-6 leading-tight"
            >
              Discover the Best
              <br />
              <span className="bg-gradient-to-r from-vintage-gold via-vintage-brass to-vintage-gold bg-clip-text text-transparent">
                Developer Resources
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-vintage-coffee dark:text-dark-muted font-serif max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              Access 500+ curated links to libraries, tools, AI platforms, and design resources. 
              Everything you need to build faster and smarter.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <motion.button
                onClick={() => { setShowAuth(true); setIsLogin(false) }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group px-8 py-4 bg-gradient-to-r from-vintage-gold to-vintage-brass text-white rounded-xl font-serif font-bold text-lg shadow-glow overflow-hidden"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <Rocket className="w-5 h-5" />
                  <span>Get Started Free</span>
                </span>
              </motion.button>

              <motion.button
                onClick={() => { setShowAuth(true); setIsLogin(true) }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-vintage-paper dark:bg-dark-card border-2 border-vintage-gold/30 dark:border-dark-border text-vintage-black dark:text-dark-text rounded-xl font-serif font-bold text-lg hover:bg-vintage-gold/10 transition-colors"
              >
                Sign In
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="bg-vintage-paper/50 dark:bg-dark-card/50 backdrop-blur-sm rounded-2xl p-6 border border-vintage-gold/20 dark:border-dark-border"
                >
                  <div className="text-3xl md:text-4xl font-vintage font-bold text-vintage-gold mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-vintage-coffee dark:text-dark-muted font-serif">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Promoted Link Banner */}
      {promotedLink && (
        <section className="py-12 px-6 bg-gradient-to-br from-vintage-gold/10 via-vintage-brass/5 to-vintage-gold/10 dark:from-vintage-gold/5 dark:via-vintage-brass/5 dark:to-vintage-gold/5 border-y-2 border-vintage-gold/30 dark:border-vintage-gold/20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-vintage-gold via-vintage-brass to-vintage-gold rounded-3xl blur-xl opacity-20"
                animate={{ opacity: [0.2, 0.3, 0.2] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <motion.div 
                className="absolute -top-4 -right-4 z-10"
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="bg-gradient-to-r from-vintage-gold to-vintage-brass text-white text-sm font-bold px-4 py-2 rounded-full shadow-glow flex items-center space-x-1">
                  <span>⭐</span>
                  <span>PROMOTED</span>
                </div>
              </motion.div>

              <div className="relative bg-gradient-to-br from-vintage-paper to-vintage-cream dark:from-dark-card dark:to-dark-bg rounded-3xl p-8 shadow-vault border-2 border-vintage-gold/40 dark:border-vintage-gold/30 overflow-hidden">
                <div className="absolute top-0 left-0 w-24 h-24 border-l-4 border-t-4 border-vintage-gold/40 rounded-tl-3xl" />
                <div className="absolute bottom-0 right-0 w-24 h-24 border-r-4 border-b-4 border-vintage-gold/40 rounded-br-3xl" />
                
                <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center space-x-3">
                      <motion.span 
                        className="text-4xl"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        📢
                      </motion.span>
                      <h3 className="text-3xl md:text-4xl font-vintage font-bold bg-gradient-to-r from-vintage-gold via-vintage-brass to-vintage-gold bg-clip-text text-transparent">
                        {promotedLink.title}
                      </h3>
                    </div>
                    {promotedLink.description && (
                      <p className="text-lg text-vintage-coffee dark:text-dark-muted font-serif leading-relaxed">
                        {promotedLink.description}
                      </p>
                    )}
                    {promotedLink.tags && promotedLink.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {promotedLink.tags.slice(0, 5).map((tag, index) => (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="px-4 py-2 bg-vintage-gold/20 dark:bg-vintage-gold/10 text-vintage-brown dark:text-vintage-gold text-sm rounded-full border border-vintage-gold/30 font-serif font-medium"
                          >
                            {tag}
                          </motion.span>
                        ))}
                      </div>
                    )}
                  </div>
                  <motion.a
                    href={promotedLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group"
                  >
                    <motion.div
                      className="absolute -inset-2 bg-gradient-to-r from-vintage-gold to-vintage-brass rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-300"
                    />
                    <div className="relative bg-gradient-to-r from-vintage-gold to-vintage-brass text-white px-10 py-5 rounded-2xl font-serif font-bold shadow-glow flex items-center space-x-3 text-lg">
                      <span>Explore Now</span>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

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
      <section className="py-20 px-6 bg-vintage-paper dark:bg-dark-card border-y border-vintage-gold/20 dark:border-dark-border">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-4">
              Why Choose LinkShala?
            </h2>
            <p className="text-xl text-vintage-coffee dark:text-dark-muted font-serif max-w-2xl mx-auto">
              Built by developers, for developers. Everything you need in one place.
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

      {/* Social Proof */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center space-x-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-8 h-8 fill-vintage-gold text-vintage-gold" />
              ))}
            </div>
            <h3 className="text-3xl md:text-4xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-4">
              Trusted by 1000+ Developers
            </h3>
            <p className="text-xl text-vintage-coffee dark:text-dark-muted font-serif max-w-2xl mx-auto">
              Join thousands of developers who save hours every week finding the right tools and resources.
            </p>
          </motion.div>
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
              Start exploring curated developer resources today. No credit card required.
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
              className="bg-vintage-paper dark:bg-dark-card rounded-3xl p-8 max-w-md w-full border-2 border-vintage-gold/30 dark:border-dark-border shadow-2xl relative"
            >
              <button
                onClick={() => setShowAuth(false)}
                className="absolute top-4 right-4 text-vintage-coffee dark:text-dark-muted hover:text-vintage-black dark:hover:text-dark-text"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-vintage-gold to-vintage-brass rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-2">
                  {isLogin ? 'Welcome Back' : 'Join LinkShala'}
                </h2>
                <p className="text-vintage-coffee dark:text-dark-muted font-serif">
                  {isLogin ? 'Sign in to access your links' : 'Create your free account'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
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
                      className="w-full px-4 py-3 bg-vintage-cream dark:bg-dark-bg border border-vintage-gold/30 dark:border-dark-border rounded-xl text-vintage-black dark:text-dark-text font-serif focus:outline-none focus:ring-2 focus:ring-vintage-gold"
                      placeholder="Akhilesh Yadav"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-serif font-medium text-vintage-black dark:text-dark-text mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-vintage-cream dark:bg-dark-bg border border-vintage-gold/30 dark:border-dark-border rounded-xl text-vintage-black dark:text-dark-text font-serif focus:outline-none focus:ring-2 focus:ring-vintage-gold"
                    placeholder="you@gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-serif font-medium text-vintage-black dark:text-dark-text mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-vintage-cream dark:bg-dark-bg border border-vintage-gold/30 dark:border-dark-border rounded-xl text-vintage-black dark:text-dark-text font-serif focus:outline-none focus:ring-2 focus:ring-vintage-gold"
                    placeholder="••••••••"
                  />
                </div>

                {error && (
                  <div className={`p-3 rounded-xl text-sm font-serif ${
                    error.includes('Check your email') 
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                      : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
                  }`}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-vintage-gold to-vintage-brass text-white rounded-xl font-serif font-bold hover:from-vintage-brass hover:to-vintage-gold transition-all disabled:opacity-50"
                >
                  {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Create Account'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => { setIsLogin(!isLogin); setError('') }}
                  className="text-vintage-gold hover:text-vintage-brass font-serif font-medium"
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
