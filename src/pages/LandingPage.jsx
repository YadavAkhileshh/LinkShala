import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Rocket, Lock, Code, Palette, Brain, Eye, EyeOff, Sun, Moon, ArrowRight, Layers, Cpu, Globe } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import apiService from '../lib/api'
import { useTheme } from '../contexts/ThemeContext'

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
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const { signIn, signUp, signInWithGoogle, user } = useAuth()
  const navigate = useNavigate()
  const { isDark, toggleTheme } = useTheme()
  const heroRef = useRef(null)

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

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        setMousePos({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        })
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

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

        if (data.user && data.user.identities && data.user.identities.length === 0) {
          setError('✅ Check your inbox for verification link!')
        } else if (data.user && !data.session) {
          setError('✅ Check your inbox for verification link!')
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

  const categories = [
    { icon: Code, name: 'Frontend', desc: 'React, Tailwind', count: '150+', color: '#3b82f6' },
    { icon: Cpu, name: 'AI & ML', desc: 'Tools & APIs', count: '80+', color: '#8b5cf6' },
    { icon: Palette, name: 'Design', desc: 'UI Kits & Icons', count: '120+', color: '#ec4899' },
    { icon: Globe, name: 'APIs', desc: 'REST & GraphQL', count: '100+', color: '#10b981' },
    { icon: Layers, name: 'Backend', desc: 'Node, Python, Go', count: '90+', color: '#f59e0b' },
    { icon: Rocket, name: 'DevOps', desc: 'CI/CD & Cloud', count: '70+', color: '#ef4444' }
  ]

  return (
    <div className={`min-h-screen overflow-x-hidden transition-colors duration-300 ${isDark ? 'bg-[#0c0c0c]' : 'bg-[#fefdfb]'}`}>

      {/* ===== HERO SECTION ===== */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20"
      >
        {/* Background - Gradient mesh */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: isDark
              ? `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, rgba(218,165,32,0.08), transparent 40%)`
              : `radial-gradient(800px circle at ${mousePos.x}% ${mousePos.y}%, rgba(218,165,32,0.12), transparent 50%)`
          }}
        />

        {/* Grid pattern */}
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${isDark ? 'opacity-[0.03]' : 'opacity-[0.4]'}`}
          style={{
            backgroundImage: `
              linear-gradient(${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} 1px, transparent 1px),
              linear-gradient(90deg, ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, black, transparent)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, black, transparent)'
          }}
        />

        {/* Main content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-8 ${isDark
              ? 'bg-vintage-gold/10 text-vintage-gold border border-vintage-gold/20'
              : 'bg-vintage-gold/10 text-vintage-brass border border-vintage-gold/30'
              }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-vintage-gold animate-pulse" />
            Developer Resource Hub
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-vintage leading-[1.1] mb-6 ${isDark ? 'text-white' : 'text-gray-900'
              }`}
          >
            Find tools.
            <br />
            <span className="bg-gradient-to-r from-vintage-gold to-vintage-brass bg-clip-text text-transparent">
              Ship faster.
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`text-base sm:text-lg max-w-md mx-auto mb-10 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
          >
            500+ curated links for developers who don't have time to search.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <button
              onClick={() => { setShowAuth(true); setIsLogin(false) }}
              className="group px-6 py-3 bg-vintage-gold hover:bg-vintage-brass text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg shadow-vintage-gold/20"
            >
              Get started free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => { setShowAuth(true); setIsLogin(true) }}
              className={`px-6 py-3 font-medium rounded-lg transition-colors ${isDark
                ? 'text-gray-300 hover:text-white hover:bg-white/5'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
            >
              Sign in
            </button>
          </motion.div>

          {/* Product Hunt */}
          <motion.a
            href="https://www.producthunt.com/posts/linkshala"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            className={`inline-flex items-center gap-2.5 mt-10 px-4 py-2 rounded-full text-xs font-medium transition-all ${isDark
              ? 'bg-gradient-to-r from-[#ff6154]/10 to-[#ff6154]/5 text-[#ff8577] border border-[#ff6154]/20 hover:border-[#ff6154]/40'
              : 'bg-gradient-to-r from-[#ff6154]/10 to-orange-50 text-[#ff6154] border border-[#ff6154]/20 hover:border-[#ff6154]/40 shadow-sm'
              }`}
          >
            <svg width="16" height="16" viewBox="0 0 40 40" fill="none">
              <path d="M20 40C31.0457 40 40 31.0457 40 20C40 8.95431 31.0457 0 20 0C8.95431 0 0 8.95431 0 20C0 31.0457 8.95431 40 20 40Z" fill="#FF6154" />
              <path d="M20 11H15V29H20V23H23C26.3137 23 29 20.3137 29 17C29 13.6863 26.3137 11 23 11H20ZM20 19V15H23C24.1046 15 25 15.8954 25 17C25 18.1046 24.1046 19 23 19H20Z" fill="white" />
            </svg>
            <span>Featured on Product Hunt</span>
            <span className="w-1 h-1 rounded-full bg-[#ff6154] animate-pulse" />
          </motion.a>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className={`w-5 h-8 rounded-full border-2 flex justify-center pt-1.5 ${isDark ? 'border-gray-700' : 'border-gray-300'
              }`}
          >
            <div className="w-1 h-1.5 rounded-full bg-vintage-gold" />
          </motion.div>
        </motion.div>
      </section>

      {/* ===== STATS ===== */}
      <section className={`py-12 px-6 ${isDark ? 'bg-white/[0.02]' : 'bg-gray-50/80'}`}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { num: '500+', label: 'Resources' },
            { num: '50+', label: 'Categories' },
            { num: '1K+', label: 'Developers' },
            { num: '24/7', label: 'Updated' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="text-2xl sm:text-3xl font-vintage text-vintage-gold mb-0.5">{stat.num}</div>
              <div className={`text-xs uppercase tracking-wide ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== FEATURED RESOURCES ===== */}
      {recentLinks.length > 0 && (
        <section className={`py-24 px-6 ${isDark ? 'bg-white/[0.01]' : 'bg-gray-50/80'}`}>
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
            >
              <div>
                <h2 className={`text-2xl sm:text-3xl font-vintage mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Featured Resources
                </h2>
                <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  Handpicked tools and resources to boost your productivity
                </p>
              </div>
              <button
                onClick={() => { setShowAuth(true); setIsLogin(false) }}
                className="text-sm text-vintage-gold hover:text-vintage-brass transition-colors flex items-center gap-1 shrink-0"
              >
                View More Resources
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {recentLinks.slice(0, 6).map((link, i) => (
                <motion.a
                  key={i}
                  href={`${link.url}?ref=linkshala`}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={`group p-4 rounded-xl transition-all duration-200 ${isDark
                    ? 'bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10'
                    : 'bg-white hover:bg-gray-50 border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow'
                    }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded ${isDark ? 'bg-vintage-gold/10 text-vintage-gold' : 'bg-vintage-gold/10 text-vintage-brass'
                      }`}>
                      {link.category || 'Resource'}
                    </span>
                    <ArrowRight className={`w-3.5 h-3.5 group-hover:translate-x-0.5 transition-all ${isDark ? 'text-gray-600 group-hover:text-vintage-gold' : 'text-gray-400 group-hover:text-vintage-gold'
                      }`} />
                  </div>
                  <h3 className={`font-medium text-sm mb-1 group-hover:text-vintage-gold transition-colors ${isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                    {link.title || link.name}
                  </h3>
                  <p className={`text-xs line-clamp-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    {link.description || 'Check this out'}
                  </p>
                </motion.a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== CATEGORIES ===== */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section header  */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="flex items-end gap-4 mb-2">
              <h2 className={`text-3xl sm:text-4xl font-vintage ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Explore
              </h2>
              <div className="w-12 h-0.5 bg-vintage-gold mb-3" />
            </div>
            <p className={`text-sm max-w-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              Curated collections for every stack
            </p>
          </motion.div>

          {/* Bento-style grid */}
          <div className="grid grid-cols-12 gap-3">
            {/* Large card  */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={() => { setShowAuth(true); setIsLogin(false) }}
              className={`col-span-12 md:col-span-7 p-6 rounded-2xl cursor-pointer transition-all duration-300 group ${isDark
                ? 'bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 hover:border-blue-500/40'
                : 'bg-gradient-to-br from-blue-50 to-white border border-blue-100 hover:border-blue-200 shadow-sm'
                }`}
            >
              <div className="flex items-start justify-between mb-8">
                <Code className="w-8 h-8 text-blue-500" />
                <span className={`text-xs px-2 py-1 rounded-full ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                  150+ links
                </span>
              </div>
              <h3 className={`text-xl font-vintage mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Frontend & UI
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                React, Tailwind, animations, component libraries
              </p>
            </motion.div>

            {/* Medium card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              onClick={() => { setShowAuth(true); setIsLogin(false) }}
              className={`col-span-6 md:col-span-5 p-5 rounded-2xl cursor-pointer transition-all duration-300 group ${isDark
                ? 'bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 hover:border-purple-500/40'
                : 'bg-gradient-to-br from-purple-50 to-white border border-purple-100 hover:border-purple-200 shadow-sm'
                }`}
            >
              <Cpu className="w-6 h-6 text-purple-500 mb-4" />
              <h3 className={`text-lg font-vintage mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                AI & ML
              </h3>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                80+ tools
              </p>
            </motion.div>

            {/* Small cards row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              onClick={() => { setShowAuth(true); setIsLogin(false) }}
              className={`col-span-6 md:col-span-4 p-5 rounded-2xl cursor-pointer transition-all duration-300 ${isDark
                ? 'bg-gradient-to-br from-pink-500/10 to-transparent border border-pink-500/20 hover:border-pink-500/40'
                : 'bg-gradient-to-br from-pink-50 to-white border border-pink-100 hover:border-pink-200 shadow-sm'
                }`}
            >
              <Palette className="w-6 h-6 text-pink-500 mb-3" />
              <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Design</h3>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>120+ resources</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              onClick={() => { setShowAuth(true); setIsLogin(false) }}
              className={`col-span-6 md:col-span-4 p-5 rounded-2xl cursor-pointer transition-all duration-300 ${isDark
                ? 'bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 hover:border-emerald-500/40'
                : 'bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 hover:border-emerald-200 shadow-sm'
                }`}
            >
              <Globe className="w-6 h-6 text-emerald-500 mb-3" />
              <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>APIs</h3>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>100+ endpoints</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              onClick={() => { setShowAuth(true); setIsLogin(false) }}
              className={`col-span-6 md:col-span-4 p-5 rounded-2xl cursor-pointer transition-all duration-300 ${isDark
                ? 'bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 hover:border-amber-500/40'
                : 'bg-gradient-to-br from-amber-50 to-white border border-amber-100 hover:border-amber-200 shadow-sm'
                }`}
            >
              <Layers className="w-6 h-6 text-amber-500 mb-3" />
              <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Backend</h3>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>90+ tools</p>
            </motion.div>

            {/* Wide card  */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              onClick={() => { setShowAuth(true); setIsLogin(false) }}
              className={`col-span-6 md:col-span-6 p-5 rounded-2xl cursor-pointer transition-all duration-300 flex items-center gap-4 ${isDark
                ? 'bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 hover:border-red-500/40'
                : 'bg-gradient-to-br from-red-50 to-white border border-red-100 hover:border-red-200 shadow-sm'
                }`}
            >
              <Rocket className="w-8 h-8 text-red-500" />
              <div>
                <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>DevOps & Cloud</h3>
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>70+ tools for deployment</p>
              </div>
            </motion.div>

            {/* More categories hint */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 }}
              onClick={() => { setShowAuth(true); setIsLogin(false) }}
              className={`col-span-6 p-5 rounded-2xl cursor-pointer transition-all duration-300 flex items-center justify-center ${isDark
                ? 'bg-white/[0.02] border border-dashed border-white/10 hover:border-vintage-gold/30'
                : 'bg-gray-50/50 border border-dashed border-gray-200 hover:border-vintage-gold/50'
                }`}
            >
              <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                +40 more categories →
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-24 px-6">
        <div className="max-w-xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-3xl sm:text-4xl font-vintage mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Stop searching.
              <br />
              Start building.
            </h2>
            <p className={`text-sm mb-8 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              Free forever. No credit card needed.
            </p>
            <button
              onClick={() => { setShowAuth(true); setIsLogin(false) }}
              className="px-8 py-3.5 bg-vintage-gold hover:bg-vintage-brass text-white font-medium rounded-lg transition-colors shadow-lg shadow-vintage-gold/20"
            >
              Get started free
            </button>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className={`py-6 px-6 border-t ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
        <div className={`max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          <span className="text-vintage-gold font-vintage text-base">LinkShala</span>
          <span>{new Date().getFullYear()} India</span>
        </div>
      </footer>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`fixed bottom-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-40 ${isDark
          ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700'
          : 'bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 shadow-sm'
          }`}
        aria-label="Toggle theme"
      >
        {isDark ? <Sun size={14} /> : <Moon size={14} />}
      </button>

      {/* ===== AUTH MODAL ===== */}
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
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`rounded-2xl p-6 max-w-sm w-full relative ${isDark ? 'bg-[#111] border border-white/10' : 'bg-white border border-gray-200 shadow-xl'
                }`}
            >
              <button
                onClick={() => setShowAuth(false)}
                className={`absolute top-4 right-4 ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="w-10 h-10 bg-vintage-gold/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-4 h-4 text-vintage-gold" />
                </div>
                <h2 className={`text-lg font-vintage ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {isLogin ? 'Welcome back' : 'Create account'}
                </h2>
                <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  {isLogin ? 'Sign in to continue' : 'Get started for free'}
                </p>
              </div>

              {/* Google */}
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
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 mb-4 rounded-lg transition-colors ${isDark
                  ? 'bg-white/5 hover:bg-white/10 border border-white/10'
                  : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                  }`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Continue with Google</span>
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}></div>
                </div>
                <div className="relative flex justify-center">
                  <span className={`px-2 text-xs ${isDark ? 'bg-[#111] text-gray-500' : 'bg-white text-gray-400'}`}>or</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {!isLogin && (
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={!isLogin}
                    placeholder="Name"
                    className={`w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-vintage-gold/50 ${isDark
                      ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500'
                      : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'
                      }`}
                  />
                )}

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Email (Gmail only)"
                  className={`w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-vintage-gold/50 ${isDark
                    ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500'
                    : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'
                    }`}
                />

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Password"
                    className={`w-full px-3 py-2.5 pr-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-vintage-gold/50 ${isDark
                      ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500'
                      : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>

                {error && (
                  <div className={`p-2.5 rounded-lg text-xs ${error.includes('✅')
                    ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                    : 'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-vintage-gold hover:bg-vintage-brass text-white font-medium rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  {loading ? 'Loading...' : isLogin ? 'Sign in' : 'Create account'}
                </button>
              </form>

              <p className={`mt-4 text-center text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {isLogin ? "No account? " : "Have an account? "}
                <button
                  onClick={() => { setIsLogin(!isLogin); setError('') }}
                  className="text-vintage-gold hover:text-vintage-brass"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LandingPage
