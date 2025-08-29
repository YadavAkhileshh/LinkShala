import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, ChevronDown, ArrowUp, Plus } from 'lucide-react'
import apiService from '../lib/api'
import LinkCard from '../components/LinkCard'
import SkeletonCard from '../components/SkeletonCard'
import EnhancedCategorySelector from '../components/EnhancedCategorySelector'
import FloatingActionButton from '../components/FloatingActionButton'
import useScreenSize from '../hooks/use-screen-size'

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [links, setLinks] = useState([])
  const [recentLinks, setRecentLinks] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const scrollContainerRef = useRef(null)
  const screenSize = useScreenSize()
  
  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    loadLinks(true)
  }, [searchTerm, selectedCategory])

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
      const data = await apiService.getLinks({ page: 1, limit: 24 })
      
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
      
      const params = { page, limit: 24 }
      if (searchTerm) params.search = searchTerm
      if (selectedCategory !== 'all') params.category = selectedCategory
      
      const data = await apiService.getLinks(params)
      
      if (reset) {
        setLinks(data.links)
        setCurrentPage(1)
      } else {
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
    loadLinks(false)
  }
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }
  
  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setCurrentPage(1)
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
                <span>Empowering developers with the </span>
                <motion.span
                  className="relative inline-block"
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.span
                    className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-bold cursor-pointer"
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
                    web's finest resources
                  </motion.span>
                  <motion.div
                    className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                    initial={{ width: 0, opacity: 0 }}
                    whileHover={{ width: '100%', opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                </motion.span>
                <span> for creators like you</span>
              </div>
              
              <motion.p 
                className="text-xl text-vintage-coffee dark:text-dark-muted max-w-4xl mx-auto leading-relaxed font-serif"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                Every link is handpicked, every resource is verified, and every discovery is designed to inspire your next breakthrough. 
                Welcome to the future of web curation.
              </motion.p>
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
            className="relative max-w-2xl mx-auto"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-vintage-gold/20 to-vintage-brass/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-vintage-paper/90 dark:bg-dark-card/90 backdrop-blur-sm rounded-2xl p-2 border border-vintage-gold/30 dark:border-dark-border shadow-vault">
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-vintage-gold group-hover:text-vintage-brass transition-colors" size={22} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Discover amazing links..."
                    className="w-full pl-16 pr-6 py-4 bg-transparent text-vintage-black dark:text-dark-text placeholder-vintage-brown/60 dark:placeholder-dark-muted/60 text-lg font-serif focus:outline-none"
                  />
                  <div className="absolute inset-x-2 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-vintage-gold to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Category Selection */}
      <section className="py-12 px-6 lg:px-8 bg-vintage-paper dark:bg-dark-card border-b border-vintage-gold/20 dark:border-dark-border">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-vintage font-bold text-vintage-black dark:text-dark-text text-center mb-8">
              Browse by Category
            </h2>
            <EnhancedCategorySelector 
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </motion.div>
        </div>
      </section>

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
            {isLoading && links.length === 0 && (
              Array.from({ length: 12 }).map((_, index) => (
                <SkeletonCard key={`skeleton-${index}`} />
              ))
            )}
            
            {/* Show actual links */}
            {links.map((link, index) => (
              <LinkCard 
                key={link._id || link.id} 
                link={link} 
                index={index}
              />
            ))}
            
            {/* Show additional skeleton cards for pagination */}
            {isLoading && links.length > 0 && (
              Array.from({ length: 4 }).map((_, index) => (
                <SkeletonCard key={`skeleton-more-${index}`} />
              ))
            )}
          </div>

          {/* View More Button */}
          {!isLoading && hasMore && links.length > 0 && (
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
          {!isLoading && links.length === 0 && (
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
