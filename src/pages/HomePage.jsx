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
  const scrollContainerRef = useRef(null)
  const searchTimeoutRef = useRef(null)
  
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
      
      const params = { page, limit: 20}
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
    <div className="min-h-screen bg-vintage-cream dark:bg-dark-bg transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative py-20 px-6 lg:px-8 bg-vintage-paper dark:bg-dark-card border-b border-vintage-gold/20 dark:border-dark-border overflow-hidden">
        {/* Noise Texture Background - Light Mode */}
        <div
          className="absolute inset-0 z-0 opacity-100 dark:opacity-0 transition-opacity duration-300"
          style={{
            background: "#f5f0e8",
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(218, 165, 32, 0.25) 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />
        {/* Noise Texture Background - Dark Mode */}
        <div
          className="absolute inset-0 z-0 opacity-0 dark:opacity-100 transition-opacity duration-300"
          style={{
            background: "#1a1a1a",
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(218, 165, 32, 0.35) 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <h1 className="text-6xl md:text-8xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-8 leading-tight">
                <motion.span
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  Discover
                </motion.span>
                <br />
                <motion.span
                  className="bg-gradient-to-r from-vintage-gold via-vintage-brass to-vintage-gold bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{ 
                    delay: 0.4, 
                    duration: 0.8,
                    backgroundPosition: {
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear"
                    }
                  }}
                  style={{
                    backgroundSize: '200% 200%'
                  }}
                >
                  Excellence
                </motion.span>
              </h1>
            </motion.div>
            
            {/* Crazy Attractive Subtitle */}
            <motion.div 
              className="mb-12 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.p 
                className="text-2xl md:text-3xl text-vintage-coffee dark:text-dark-muted font-serif leading-relaxed mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                 <span className="font-bold text-vintage-gold">500+ handpicked gems.</span>{' '}
                <span className="font-bold text-vintage-brass">Zero fluff.</span>{' '}
                <span className="font-bold text-vintage-black dark:text-dark-text">Pure fire.</span>
              </motion.p>
              
              <motion.p
                className="text-xl md:text-2xl text-vintage-brown dark:text-dark-muted font-serif leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                From <span className="font-semibold text-vintage-gold">React wizardry</span> to{' '}
                <span className="font-semibold text-vintage-gold">AI sorcery</span> —{' '}
                <span className="font-bold text-vintage-black dark:text-dark-text">everything a dev craves</span>. 🔥
              </motion.p>
              
              <motion.p 
                className="text-2xl md:text-3xl font-bold text-vintage-black dark:text-dark-text mt-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
              >
                ⚡ Stop scrolling. Start building. <span className="text-vintage-gold">Ship faster.</span>
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Promoted Link Section - 3D Effect */}
      {allLinks.filter(link => link.isPromoted).length > 0 && (
        <section className="relative py-16 px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-vintage-gold/5 via-transparent to-vintage-brass/5"></div>
          
          <div className="max-w-6xl mx-auto relative z-10">
            {allLinks.filter(link => link.isPromoted).slice(0, 1).map((link) => {
              const sponsorUrl = link.url.includes('?') 
                ? `${link.url}&ref=linkshala` 
                : `${link.url}?ref=linkshala`
              
              return (
                <motion.div
                  key={link._id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="relative perspective-1000"
                >
                  {/* Floating Badge */}
                  <motion.div
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-30"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ 
                      y: [0, -8, 0],
                      scale: 1,
                      rotate: 0
                    }}
                    transition={{ 
                      y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                      scale: { duration: 0.6, type: "spring" },
                      rotate: { duration: 0.6, type: "spring" }
                    }}
                  >
                    <motion.div 
                      className="relative bg-gradient-to-r from-vintage-gold via-vintage-brass to-vintage-gold text-white px-8 py-3 rounded-full text-sm font-bold shadow-2xl flex items-center space-x-2 overflow-hidden"
                      whileHover={{ scale: 1.1 }}
                      style={{ backgroundSize: '200% 200%' }}
                      animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                      transition={{ backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" } }}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles size={18} className="fill-white" />
                      </motion.div>
                      <span className="text-base">PREMIUM PICK</span>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Star size={18} className="fill-white" />
                      </motion.div>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    whileHover={{ 
                      rotateY: 2,
                      rotateX: -2,
                      scale: 1.02,
                      transition: { duration: 0.3 }
                    }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className="grid md:grid-cols-2 gap-0 bg-vintage-paper dark:bg-dark-card rounded-3xl overflow-hidden shadow-2xl border-2 border-vintage-gold/40"
                  >
                    {/* Left: Visual with 3D effect */}
                    <div className="relative bg-gradient-to-br from-vintage-gold/20 to-vintage-brass/20 p-10 flex items-center justify-center">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(218,165,32,0.2),transparent_70%)]"></div>
                      
                      <div className="relative z-10 text-center">
                        {/* Logo Display with Amazing Look */}
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.6 }}
                          className="relative w-44 h-44 mx-auto mb-8"
                        >
                          {/* Rotating glow rings */}
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 rounded-full border-2 border-dashed border-vintage-gold/40"
                          />
                          <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-3 rounded-full border-2 border-dotted border-vintage-brass/40"
                          />
                          
                          {/* Logo container with pulsing glow */}
                          <motion.div
                            animate={{ 
                              boxShadow: [
                                '0 0 30px rgba(218,165,32,0.4), 0 0 60px rgba(218,165,32,0.2)',
                                '0 0 50px rgba(218,165,32,0.6), 0 0 80px rgba(218,165,32,0.3)',
                                '0 0 30px rgba(218,165,32,0.4), 0 0 60px rgba(218,165,32,0.2)'
                              ]
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute inset-6 bg-white dark:bg-dark-card rounded-2xl flex items-center justify-center overflow-hidden border-4 border-vintage-gold/20"
                            style={{ transform: 'translateZ(50px)' }}
                          >
                            {/* Shimmer effect */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-vintage-gold/20 to-transparent"
                              animate={{ x: ['-200%', '200%'] }}
                              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            />
                            
                            {/* Website Logo/Favicon */}
                            <img
                              src={`https://www.google.com/s2/favicons?domain=${new URL(link.url).hostname}&sz=128`}
                              alt={`${link.title} logo`}
                              className="w-24 h-24 object-contain relative z-10"
                              onError={(e) => {
                                e.target.style.display = 'none'
                                e.target.nextElementSibling.style.display = 'flex'
                              }}
                            />
                            {/* Fallback icon */}
                            <Sparkles size={64} className="text-vintage-gold hidden" style={{ display: 'none' }} />
                          </motion.div>
                        </motion.div>
                        
                        <motion.h3 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-3xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-3"
                        >
                          {link.title}
                        </motion.h3>
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 }}
                          className="inline-flex items-center space-x-2 px-4 py-2 bg-white/50 dark:bg-black/30 rounded-full backdrop-blur-sm"
                        >
                          <Zap size={16} className="text-vintage-gold" />
                          <span className="font-bold text-vintage-brown dark:text-dark-text text-sm uppercase">{link.category}</span>
                        </motion.div>
                      </div>
                      
                      {/* Floating particles */}
                      <motion.div
                        className="absolute top-10 right-10"
                        animate={{ 
                          y: [0, -20, 0],
                          rotate: [0, 180, 360]
                        }}
                        transition={{ duration: 6, repeat: Infinity }}
                      >
                        <Star size={24} className="text-vintage-gold/40" />
                      </motion.div>
                      <motion.div
                        className="absolute bottom-10 left-10"
                        animate={{ 
                          y: [0, 20, 0],
                          rotate: [0, -180, -360]
                        }}
                        transition={{ duration: 5, repeat: Infinity }}
                      >
                        <Sparkles size={20} className="text-vintage-brass/40" />
                      </motion.div>
                    </div>

                    {/* Right: Content */}
                    <div className="p-10 flex flex-col justify-between bg-vintage-cream dark:bg-dark-bg" style={{ transform: 'translateZ(20px)' }}>
                      <div>
                        <div className="flex items-center space-x-1 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ delay: i * 0.1, type: "spring" }}
                            >
                              <Star size={18} className="fill-vintage-gold text-vintage-gold" />
                            </motion.div>
                          ))}
                          <span className="text-sm font-bold text-vintage-brown dark:text-dark-muted ml-2"> Developer's Choice</span>
                        </div>
                        
                        <p className="text-lg text-vintage-black dark:text-dark-text font-sans leading-relaxed mb-6">
                          {link.description || 'Discover this premium resource carefully selected for developers. Experience excellence with our trusted partner.'}
                        </p>

                        {link.tags && link.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-6">
                            {link.tags.slice(0, 5).map((tag, i) => (
                              <motion.span
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ 
                                  delay: 0.6 + i * 0.1,
                                  duration: 0.4
                                }}
                                whileHover={{ 
                                  scale: 1.05,
                                  backgroundColor: 'rgba(218, 165, 32, 0.15)',
                                  transition: { duration: 0.2 }
                                }}
                                className="px-3 py-1.5 bg-vintage-gold/10 text-vintage-brown dark:text-dark-text text-sm font-semibold rounded-lg border border-vintage-gold/30 cursor-pointer"
                              >
                                #{tag}
                              </motion.span>
                            ))}
                          </div>
                        )}
                      </div>

                      <motion.a
                        href={sponsorUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ 
                          scale: 1.05,
                          y: -3,
                          boxShadow: '0 25px 50px rgba(218,165,32,0.5)'
                        }}
                        whileTap={{ scale: 0.97 }}
                        className="relative group block w-full bg-gradient-to-r from-vintage-gold via-vintage-brass to-vintage-gold text-white text-center py-5 rounded-2xl font-bold text-xl shadow-2xl overflow-hidden"
                        style={{ backgroundSize: '200% 200%' }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                          animate={{ x: ['-200%', '200%'] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.div
                          className="absolute inset-0"
                          animate={{ 
                            background: [
                              'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                              'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                              'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)'
                            ]
                          }}
                          transition={{ duration: 3, repeat: Infinity }}
                        />
                        <span className="relative z-10 flex items-center justify-center space-x-3">
                          <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <Sparkles size={22} />
                          </motion.div>
                          <span className="tracking-wide">Explore Now</span>
                        </span>
                      </motion.a>
                    </div>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </section>
      )}

      {/* Recently Added Section */}
      {recentLinks.length > 0 && (
        <section className="py-16 px-6 lg:px-8 bg-vintage-paper dark:bg-dark-card border-b border-vintage-gold/20 dark:border-dark-border">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-8">Recently Added</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      <section className="py-12 px-6 lg:px-8 bg-vintage-cream dark:bg-dark-bg">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-vintage-gold/20 to-vintage-brass/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-vintage-paper/90 dark:bg-dark-card/90 backdrop-blur-sm rounded-2xl p-2 border border-vintage-gold/30 dark:border-dark-border shadow-vault">
                  <div className="relative">
                    <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-vintage-gold group-hover:text-vintage-brass transition-colors" size={22} />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={handleSearch}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                      placeholder="Discover amazing links..."
                      className="w-full pl-16 pr-6 py-4 bg-transparent text-vintage-black dark:text-dark-text placeholder-vintage-brown/60 dark:placeholder-dark-muted/60 text-lg font-serif focus:outline-none"
                    />
                    <div className="absolute inset-x-2 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-vintage-gold to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Show Categories Button - appears when search is focused but empty */}
            {isSearchFocused && !searchTerm && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex justify-center"
              >
                <button
                  onClick={() => {
                    setIsSearchFocused(false)
                    setTimeout(() => {
                      const categoriesSection = document.querySelector('[data-categories-section]')
                      if (categoriesSection) {
                        categoriesSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
                      }
                    }, 100)
                  }}
                  className="text-sm px-4 py-2 bg-vintage-gold/10 dark:bg-dark-accent/10 text-vintage-gold dark:text-dark-accent rounded-lg hover:bg-vintage-gold/20 dark:hover:bg-dark-accent/20 transition-colors font-serif"
                >
                  📂 Show Categories
                </button>
              </motion.div>
            )}
            

          </motion.div>
        </div>
      </section>
      
      {/* Category Selection - Hidden during search or when search is focused */}
      {!searchTerm && !isSearchFocused && (
        <section data-categories-section className="py-12 px-6 lg:px-8 bg-vintage-paper dark:bg-dark-card border-b border-vintage-gold/20 dark:border-dark-border">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-2xl font-vintage font-bold text-vintage-black dark:text-dark-text text-center mb-8">
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
      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-4">
              {searchTerm ? `Search Results for "${searchTerm}"` : 'All Links'}
            </h2>
            <p className="text-vintage-coffee dark:text-dark-muted font-serif">
              {links.length} link{links.length !== 1 ? 's' : ''} found
            </p>
          </motion.div>

          {/* Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {/* Show skeleton cards only when initially loading */}
            {isLoading && displayedLinks.length === 0 && (
              Array.from({ length: 15 }).map((_, index) => (
                <SkeletonCard key={`skeleton-${index}`} />
              ))
            )}
            
            {/* Show actual links */}
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-16"
            >
              <button
                onClick={handleViewMore}
                className="bg-gradient-to-r from-vintage-gold to-vintage-brass text-white px-8 py-3 rounded-xl font-serif font-medium hover:from-vintage-brass hover:to-vintage-gold transition-all duration-200 transform hover:scale-105 shadow-glow"
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
              className="text-center py-24"
            >
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <Search size={48} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-4">
                No links found
              </h3>
              <p className="text-vintage-coffee dark:text-dark-muted mb-8 max-w-md mx-auto font-serif">
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
                  className="text-vintage-gold hover:text-vintage-brass font-serif font-medium"
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
          className="fixed bottom-24 right-8 bg-vintage-brown/80 dark:bg-dark-accent/80 text-white p-3 rounded-full shadow-lg hover:bg-vintage-brown dark:hover:bg-dark-accent transition-colors duration-200 z-40"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}

      {/* Floating Action Button */}
      <FloatingActionButton />

    </div>
  )
}

export default HomePage
