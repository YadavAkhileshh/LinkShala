import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Search, ArrowUp } from 'lucide-react'
import apiService from '../lib/api'
import LinkCard from '../components/LinkCard'
import SkeletonCard from '../components/SkeletonCard'
import CategorySelector from '../components/CategorySelector'
import FloatingActionButton from '../components/FloatingActionBtn'
import { trackSearch, trackCategorySelect } from '../lib/analytics'


const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [filterType, setFilterType] = useState('all')
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
    
    // Apply filter type
    if (filterType === 'featured') {
      filtered = filtered.filter(link => link.isFeatured)
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
  }, [searchTerm, allLinks, filterType, selectedCategory])

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
      <section className="relative py-20 px-6 lg:px-8 bg-vintage-paper dark:bg-dark-card border-b border-vintage-gold/20 dark:border-dark-border">
        <div className="max-w-7xl mx-auto text-center">
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
            
            {/* Enhanced Interactive Text */}
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="text-2xl md:text-4xl text-vintage-coffee dark:text-dark-muted font-serif leading-relaxed mb-6">
                <span>Your ultimate </span>
                <motion.span
                  className="relative inline-block"
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.span
                    className="bg-gradient-to-r from-vintage-gold via-vintage-brass to-vintage-gold bg-clip-text text-transparent font-bold cursor-pointer"
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{
                      backgroundSize: '300% 300%'
                    }}
                  >
                    developer toolkit
                  </motion.span>
                  <motion.div
                    className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-vintage-gold via-vintage-brass to-vintage-gold rounded-full"
                    initial={{ width: 0, opacity: 0 }}
                    whileHover={{ width: '100%', opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                </motion.span>
                <span> awaits</span>
              </div>
              
              <motion.div 
                className="text-lg md:text-xl text-vintage-coffee dark:text-dark-muted max-w-4xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="space-y-2">
                  <motion.span 
                    className="block font-medium"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 }}
                  >
                    Curated with <span className="text-vintage-gold font-semibold">precision</span>, 
                    trusted by <span className="text-vintage-gold font-semibold">developers</span> worldwide.
                  </motion.span>
                  
                  <motion.span 
                    className="block"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 }}
                  >
                    From <motion.span 
                      className="font-semibold text-vintage-brass cursor-pointer"
                      whileHover={{ scale: 1.05, color: "#DAA520" }}
                    >
                      React libraries
                    </motion.span> to 
                    <motion.span 
                      className="font-semibold text-vintage-brass cursor-pointer"
                      whileHover={{ scale: 1.05, color: "#DAA520" }}
                    >
                      AI tools
                    </motion.span>, 
                    <motion.span 
                      className="font-semibold text-vintage-brass cursor-pointer"
                      whileHover={{ scale: 1.05, color: "#DAA520" }}
                    >
                      design resources
                    </motion.span> to 
                    <motion.span 
                      className="font-semibold text-vintage-brass cursor-pointer"
                      whileHover={{ scale: 1.05, color: "#DAA520" }}
                    >
                      dev platforms
                    </motion.span> — everything you need.
                  </motion.span>
                  
                  <motion.span 
                    className="block font-medium text-vintage-black dark:text-dark-text mt-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 }}
                  >
                    ⚡ Skip the hunt. Find your tools. <span className="text-vintage-gold">Build faster.</span>
                  </motion.span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

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
            
            {/* Fire Filter Button */}
            <div className="flex justify-center">
              <motion.button
                onClick={() => setFilterType(filterType === 'all' ? 'featured' : 'all')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-serif font-medium transition-all duration-300 shadow-md ${
                  filterType === 'featured'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : 'bg-vintage-paper/90 dark:bg-dark-card/90 border border-vintage-gold/30 dark:border-dark-border text-vintage-black dark:text-dark-text hover:bg-vintage-gold/10 dark:hover:bg-dark-accent/10'
                }`}
              >
                <motion.span 
                  className="text-2xl"
                  animate={filterType === 'featured' ? { 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  } : {}}
                  transition={{ 
                    duration: 0.5,
                    repeat: filterType === 'featured' ? Infinity : 0,
                    repeatDelay: 0.5
                  }}
                >
                  🔥
                </motion.span>
                <span>{filterType === 'featured' ? 'Showing Featured' : 'Show Featured Only'}</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Category Selection - Hidden during search, featured filter, or when search is focused */}
      {!searchTerm && filterType === 'all' && !isSearchFocused && (
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
            <h2 className="text-3xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-4 flex items-center space-x-2">
              <span>{searchTerm ? `Search Results for "${searchTerm}"` : filterType === 'featured' ? 'Featured Links' : 'All Links'}</span>
              {filterType === 'featured' && <span className="text-3xl">🔥</span>}
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
