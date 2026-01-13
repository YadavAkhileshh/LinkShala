import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Search, ArrowUp, Sparkles, Star, Zap } from 'lucide-react'
import apiService from '../lib/api'
import LinkCard from '../components/LinkCard'
import SkeletonCard from '../components/SkeletonCard'
import CategorySelector from '../components/CategorySelector'
import FloatingActionButton from '../components/FloatingActionBtn'
import { trackSearch, trackCategorySelect } from '../lib/analytics'


const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [links, setLinks] = useState([])
  const [allLinks, setAllLinks] = useState([])
  const [displayedLinks, setDisplayedLinks] = useState([])
  const [displayCount, setDisplayCount] = useState(20)
  const [recentLinks, setRecentLinks] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const scrollContainerRef = useRef(null)
  const searchTimeoutRef = useRef(null)
  const heroRef = useRef(null)

  // Mouse tracking for subtle cursor effect
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

  useEffect(() => {
    loadInitialData()

    // Restore scroll position
    const savedScrollPos = sessionStorage.getItem('homeScrollPos')
    if (savedScrollPos) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScrollPos))
        sessionStorage.removeItem('homeScrollPos')
      }, 100)
    }
  }, [])

  // Instant filtering with client-side logic
  useEffect(() => {
    let filtered = allLinks

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(link => link.category === selectedCategory)
    }

    // Apply search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(link =>
        link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      if (searchTerm.length > 2) {
        trackSearch(searchTerm)
      }
    }

    setLinks(filtered)
    setDisplayCount(20) // Reset display count when filters change
  }, [searchTerm, allLinks, selectedCategory])

  // Lazy loading - display limited links
  useEffect(() => {
    setDisplayedLinks(links.slice(0, displayCount))
  }, [links, displayCount])

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const loadInitialData = async () => {
    try {
      setIsLoading(true)
      const data = await apiService.getLinks({ page: 1, limit: 1000 })

      setAllLinks(data.links)
      setLinks(data.links)
      setRecentLinks(data.links.slice(0, 6))

      setHasMore(data.currentPage < data.totalPages)
      setCurrentPage(1)
    } catch (error) {
      console.error('Error loading initial data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadLinks = async (reset = false) => {
    try {
      setIsLoading(true)
      const page = reset ? 1 : currentPage + 1

      const params = { page, limit: 20 }
      if (selectedCategory !== 'all') params.category = selectedCategory

      const data = await apiService.getLinks(params)

      if (reset) {
        setAllLinks(data.links)
        setLinks(data.links)
        setCurrentPage(1)
      } else {
        setAllLinks(prev => [...prev, ...data.links])
        setLinks(prev => [...prev, ...data.links])
        setCurrentPage(page)
      }

      setHasMore(data.currentPage < data.totalPages)
    } catch (error) {
      console.error('Error loading links:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewMore = () => {
    setDisplayCount(prev => prev + 20)
  }

  const handleSearch = (e) => {
    const term = e.target.value
    setSearchTerm(term)
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setSearchTerm('')
    setCurrentPage(1)
    trackCategorySelect(category)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fefdfb] via-[#fffef9] to-[#fefdfb] dark:from-[#0c0c0c] dark:via-[#0f0f0f] dark:to-[#0c0c0c] transition-colors duration-300">
      {/* Hero Section */}
      <section ref={heroRef} className="relative py-20 md:py-28 px-6 lg:px-8 overflow-hidden">
        {/* Cursor-following glow */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, rgba(218,165,32,0.06), transparent 40%)`
          }}
        />

        {/* Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating gradient blobs */}
          <motion.div
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              rotate: [0, 10, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-gradient-to-br from-vintage-gold/30 via-amber-300/20 to-transparent rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -40, 0],
              y: [0, 40, 0],
              rotate: [0, -15, 0]
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-amber-200/20 via-vintage-brass/15 to-transparent rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/3 right-1/4 w-72 h-72 bg-gradient-to-br from-rose-300/10 to-violet-300/10 rounded-full blur-2xl"
          />

          {/* Flowing lines */}
          <svg className="absolute inset-0 w-full h-full opacity-20 dark:opacity-10" preserveAspectRatio="none">
            <motion.path
              d="M0,100 Q200,50 400,100 T800,100 T1200,100"
              stroke="url(#gold-gradient)"
              strokeWidth="1"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            <motion.path
              d="M0,200 Q300,150 600,200 T1200,200"
              stroke="url(#gold-gradient)"
              strokeWidth="0.5"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.5, delay: 0.5 }}
            />
            <defs>
              <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#DAA520" stopOpacity="0" />
                <stop offset="50%" stopColor="#DAA520" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#B8860B" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* Floating particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${10 + (i * 7) % 80}%`,
                top: `${15 + (i * 11) % 70}%`,
                width: `${4 + (i % 3) * 2}px`,
                height: `${4 + (i % 3) * 2}px`,
                background: i % 2 === 0
                  ? 'linear-gradient(135deg, #DAA520 0%, #B8860B 100%)'
                  : 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)'
              }}
              animate={{
                y: [0, -30 - (i % 4) * 10, 0],
                x: [0, (i % 2 === 0 ? 10 : -10), 0],
                opacity: [0.3, 0.7, 0.3],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-vintage-gold/10 dark:bg-vintage-gold/5 border border-vintage-gold/20 rounded-full mb-8"
            >
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              <span className="text-sm font-medium text-vintage-gold">500+ Curated Resources</span>
            </motion.div>

            {/* Main Headline with shimmer */}
            <div className="relative">
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-vintage text-gray-900 dark:text-white mb-6 leading-[1.1]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Fuel Your
                <br />
                <span className="relative inline-block">
                  <motion.span
                    className="bg-gradient-to-r from-vintage-gold via-amber-400 to-vintage-brass bg-clip-text text-transparent bg-[length:200%_auto]"
                    animate={{ backgroundPosition: ['0% center', '200% center'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    Next Project
                  </motion.span>
                  {/* Animated underline */}
                  <motion.svg
                    className="absolute -bottom-2 left-0 w-full h-4"
                    viewBox="0 0 200 10"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                  >
                    <motion.path
                      d="M0,5 Q50,0 100,5 T200,5"
                      stroke="url(#underline-gradient)"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="underline-gradient">
                        <stop offset="0%" stopColor="#DAA520" />
                        <stop offset="100%" stopColor="#B8860B" />
                      </linearGradient>
                    </defs>
                  </motion.svg>
                </span>
              </motion.h1>
            </div>

            <motion.p
              className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Handpicked tools, libraries, and resources for developers.
              <span className="block mt-2 text-gray-500 dark:text-gray-500 text-base">
                <motion.span
                  className="inline-block mx-2 font-medium text-gray-800 dark:text-white"
                  whileHover={{ scale: 1.1, color: '#DAA520' }}
                >React</motion.span>•
                <motion.span
                  className="inline-block mx-2 font-medium text-gray-800 dark:text-white"
                  whileHover={{ scale: 1.1, color: '#DAA520' }}
                >AI Tools</motion.span>•
                <motion.span
                  className="inline-block mx-2 font-medium text-gray-800 dark:text-white"
                  whileHover={{ scale: 1.1, color: '#DAA520' }}
                >Design</motion.span>•
                <motion.span
                  className="inline-block mx-2 font-medium text-gray-800 dark:text-white"
                  whileHover={{ scale: 1.1, color: '#DAA520' }}
                >More</motion.span>
              </span>
            </motion.p>

            {/* Stats row */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                Updated daily
              </span>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <span className="text-gray-500 dark:text-gray-400">Free forever</span>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <span className="text-gray-500 dark:text-gray-400">Community driven</span>
            </motion.div>
          </motion.div>
        </div>
      </section>


      {/* Premium Pick Section */}
      {allLinks.filter(link => link.isPromoted).length > 0 && (
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 via-transparent to-vintage-gold/5 dark:from-vintage-gold/[0.03] dark:via-transparent dark:to-amber-900/[0.02]" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-vintage-gold/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-vintage-gold/30 to-transparent" />

          <div className="max-w-4xl mx-auto relative z-10">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mb-8"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-vintage-gold text-white text-[10px] sm:text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
                <Star size={12} className="fill-white" />
                Premium Pick
              </span>
            </motion.div>

            {allLinks.filter(link => link.isPromoted).slice(0, 1).map((link) => {
              const sponsorUrl = link.url.includes('?') ? `${link.url}&ref=linkshala` : `${link.url}?ref=linkshala`

              return (
                <motion.div
                  key={link._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative"
                >
                  {/* Glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-vintage-gold/20 via-amber-400/20 to-vintage-brass/20 rounded-2xl blur-xl opacity-60" />

                  <div className="relative bg-white dark:bg-[#111] rounded-2xl border border-vintage-gold/20 overflow-hidden shadow-lg">
                    {/* Top accent */}
                    <div className="h-1 bg-gradient-to-r from-vintage-gold via-amber-400 to-vintage-brass" />

                    <div className="p-6 sm:p-8 md:p-10">
                      <div className="flex flex-col md:flex-row md:items-start gap-5 sm:gap-6">
                        {/* Logo */}
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-vintage-gold/10 to-amber-100/50 dark:from-vintage-gold/10 dark:to-transparent rounded-xl border border-vintage-gold/20 flex items-center justify-center flex-shrink-0">
                          <img
                            src={`https://www.google.com/s2/favicons?domain=${new URL(link.url).hostname}&sz=64`}
                            alt=""
                            className="w-7 h-7 sm:w-8 sm:h-8"
                            onError={(e) => { e.target.style.display = 'none' }}
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-vintage-gold bg-vintage-gold/10 px-2 py-0.5 rounded mb-2 inline-block">
                            {link.category}
                          </span>
                          <h3 className="text-xl sm:text-2xl font-vintage text-gray-900 dark:text-white mb-2 sm:mb-3">
                            {link.title}
                          </h3>
                          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-5 sm:mb-6 leading-relaxed">
                            {link.description || 'A premium resource handpicked for developers.'}
                          </p>

                          {link.tags && link.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-5 sm:mb-6">
                              {link.tags.slice(0, 4).map((tag, i) => (
                                <span key={i} className="text-[10px] sm:text-xs text-gray-500 bg-gray-50 dark:bg-white/[0.03] px-2 py-0.5 sm:py-1 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          <motion.a
                            href={sponsorUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center gap-2 bg-vintage-gold hover:bg-vintage-brass text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-colors shadow-md shadow-vintage-gold/20"
                          >
                            <Sparkles size={16} />
                            Explore Now
                          </motion.a>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </section>
      )}


      {/* Recently Added Section */}
      {recentLinks.length > 0 && (
        <section className="py-16 px-6 lg:px-8 bg-gray-50/80 dark:bg-white/[0.01]">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-vintage text-gray-900 dark:text-white mb-6">Recently Added</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentLinks.map((link, index) => (
                  <LinkCard
                    key={link._id || link.id}
                    link={link}
                    index={index}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Search Section */}
      <section className="py-10 px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                placeholder="Search resources..."
                className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-vintage-gold/50 focus:border-vintage-gold/50 transition-all"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Selection */}
      {!searchTerm && !isSearchFocused && (
        <section data-categories-section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50 dark:bg-white/[0.01]">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-xl font-vintage text-gray-900 dark:text-white text-center mb-6">
                Browse by Category
              </h2>
              <CategorySelector
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-vintage text-gray-900 dark:text-white mb-2">
              {searchTerm ? `Search Results for "${searchTerm}"` : 'All Links'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {links.length} link{links.length !== 1 ? 's' : ''} found
            </p>
          </motion.div>

          {/* Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {isLoading && displayedLinks.length === 0 && (
              Array.from({ length: 12 }).map((_, index) => (
                <SkeletonCard key={`skeleton-${index}`} />
              ))
            )}

            {displayedLinks.map((link, index) => (
              <LinkCard
                key={link._id || link.id}
                link={link}
                index={index}
              />
            ))}
          </div>

          {/* View More Button */}
          {!isLoading && displayCount < links.length && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-12"
            >
              <button
                onClick={handleViewMore}
                className="px-8 py-3 bg-vintage-gold hover:bg-vintage-brass text-white font-medium rounded-lg transition-colors"
              >
                View More Links
              </button>
            </motion.div>
          )}

          {/* Empty State */}
          {!isLoading && displayedLinks.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-vintage text-gray-900 dark:text-white mb-2">
                No links found
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {searchTerm
                  ? `No links match "${searchTerm}". Try adjusting your search.`
                  : 'No links available yet.'
                }
              </p>
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('all')
                  }}
                  className="text-vintage-gold hover:text-vintage-brass font-medium"
                >
                  Clear search
                </button>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* Back to Top Button */}
      {showBackToTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-20 right-6 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-colors z-40"
        >
          <ArrowUp size={18} />
        </motion.button>
      )}

      {/* Floating Action Button */}
      <FloatingActionButton />

    </div>
  )
}

export default HomePage
