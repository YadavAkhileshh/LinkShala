import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Bookmark } from 'lucide-react'
import apiService from '../lib/api'
import bookmarkService from '../lib/bookmarkService'
import { trackLinkClick } from '../lib/analytics'

const LinkCard = ({ link, index }) => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    clickCount: link.clickCount || 0,
    shareCount: link.shareCount || 0
  })
  const [isHovered, setIsHovered] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    const checkBookmark = async () => {
      const bookmarked = await bookmarkService.isBookmarked(link._id || link.id)
      setIsBookmarked(bookmarked)
    }
    checkBookmark()
  }, [link._id, link.id])

  const handleCardClick = async (e) => {
    // If clicking on action buttons, don't navigate
    if (e.target.closest('.action-button')) {
      return
    }
    
    // Save scroll position before navigating
    sessionStorage.setItem('homeScrollPos', window.scrollY || 0)
    
    // Navigate to detail page
    if (link._id) {
      navigate(`/link/${link._id}`)
    }
  }
  
  const handleVisitLink = async (e) => {
    e.stopPropagation()
    try {
      if (link._id) {
        await apiService.getLink(link._id)
        setStats(prev => ({ ...prev, clickCount: prev.clickCount + 1 }))
      }
      trackLinkClick(link.title || link.name, link.url)
    } catch (err) {
      console.log('Error updating click count:', err)
    }
    
    window.open(link.url, '_blank', 'noopener,noreferrer')
  }

  const handleShare = async (e) => {
    e.stopPropagation()
    setIsSharing(true)
    
    try {
      if (link._id) {
        await apiService.shareLink(link._id)
        setStats(prev => ({ ...prev, shareCount: prev.shareCount + 1 }))
      }
      
      const shareData = {
        title: link.title || link.name,
        text: link.description,
        url: link.url,
      }
      
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(link.url)
        // Show success feedback without alert
        const event = new CustomEvent('showToast', {
          detail: { message: 'Link copied to clipboard!', type: 'success' }
        })
        window.dispatchEvent(event)
      }
    } catch (err) {
      console.log('Error sharing:', err)
      // Show error feedback
      const event = new CustomEvent('showToast', {
        detail: { message: 'Failed to share link', type: 'error' }
      })
      window.dispatchEvent(event)
    }
    
    setTimeout(() => setIsSharing(false), 1000)
  }

  const handleBookmark = async (e) => {
    e.stopPropagation()
    
    if (isBookmarked) {
      await bookmarkService.removeBookmark(link._id || link.id)
      setIsBookmarked(false)
      const event = new CustomEvent('showToast', {
        detail: { message: 'Bookmark removed!', type: 'success' }
      })
      window.dispatchEvent(event)
    } else {
      await bookmarkService.addBookmark(link)
      setIsBookmarked(true)
      const event = new CustomEvent('showToast', {
        detail: { message: 'Bookmarked!', type: 'success' }
      })
      window.dispatchEvent(event)
    }
    
    // Notify other components
    window.dispatchEvent(new CustomEvent('bookmarkChanged'))
  }



  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        y: -8,
        rotateY: 5,
        transition: { duration: 0.3 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group cursor-pointer perspective-1000"
      onClick={handleCardClick}
    >
      <div className="relative bg-gradient-to-br from-vintage-cream to-vintage-paper dark:from-dark-card dark:to-dark-bg border border-vintage-gold/20 dark:border-dark-border rounded-2xl p-6 shadow-vault hover:shadow-vault-lg transition-all duration-500 overflow-hidden">
        
        {/* Decorative Corner Elements */}
        <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-vintage-gold/30 rounded-tl-2xl" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-vintage-gold/30 rounded-br-2xl" />
        
        {/* Animated Background Pattern */}
        <motion.div 
          className="absolute inset-0 opacity-5 dark:opacity-10"
          animate={{
            backgroundPosition: isHovered ? ['0% 0%', '100% 100%'] : '0% 0%',
          }}
          transition={{ duration: 2, ease: "linear" }}
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(218, 165, 32, 0.1) 10px, rgba(218, 165, 32, 0.1) 20px)',
            backgroundSize: '40px 40px'
          }}
        />
        
        {/* Main Content */}
        <div className="relative z-10">
          {/* Title Section */}
          <div className="mb-4">
            <motion.h3 
              className="text-xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-2 leading-tight flex items-center space-x-2"
              animate={{
                color: isHovered ? '#daa520' : undefined
              }}
              transition={{ duration: 0.3 }}
            >
              <span>{link.title || link.name}</span>
              {link.isFeatured && (
                <span className="text-sm">🔥</span>
              )}
            </motion.h3>
            
            {/* Stats Bar */}
            <div className="flex items-center justify-between text-xs text-vintage-brown/50 dark:text-dark-muted/50">
              <div className="flex items-center space-x-2">
                <motion.div 
                  className="w-2 h-2 rounded-full bg-vintage-gold"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="font-serif">{link.category ? link.category.charAt(0).toUpperCase() + link.category.slice(1) : 'Featured'}</span>
              </div>
              <div className="flex items-center space-x-1 text-vintage-brown/40 dark:text-dark-muted/40">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                </svg>
                <span className="font-serif text-xs">
                  {new Date(link.publishedDate || link.createdAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {link.description && (
            <div className="mb-4">
              <p className="text-sm text-vintage-coffee dark:text-dark-muted font-serif leading-relaxed line-clamp-2">
                {link.description}
              </p>
            </div>
          )}

          {/* Interactive Features */}
          <div className="mb-4 space-y-2">
            <motion.div 
              className="flex items-center justify-between p-2 bg-vintage-gold/5 dark:bg-dark-accent/5 rounded-lg border border-vintage-gold/10 dark:border-dark-accent/10"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs text-vintage-brown/70 dark:text-dark-muted/70 font-serif">Live & Active</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-vintage-brown/50 dark:text-dark-muted/50">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span className="font-serif">Curated</span>
              </div>
            </motion.div>
            
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-vintage-brown/60 dark:text-dark-muted/60">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                </svg>
                <span className="font-serif">Quality Assured</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-1 h-1 rounded-full bg-vintage-gold"></div>
                <div className="w-1 h-1 rounded-full bg-vintage-gold"></div>
                <div className="w-1 h-1 rounded-full bg-vintage-gold/50"></div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {link.tags && link.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {link.tags.slice(0, 3).map((tag, tagIndex) => (
                <motion.span
                  key={tagIndex}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 * tagIndex }}
                  className="px-3 py-1 bg-vintage-gold/10 dark:bg-dark-accent/10 text-vintage-brown dark:text-dark-accent text-xs rounded-full border border-vintage-gold/20 dark:border-dark-accent/20"
                >
                  {tag}
                </motion.span>
              ))}
              {link.tags.length > 3 && (
                <span className="text-xs text-vintage-brown/50 dark:text-dark-muted px-2 py-1">
                  +{link.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-vintage-gold/10 dark:border-dark-border">
            <div className="text-xs text-vintage-brown/50 dark:text-dark-muted font-serif">
              {link.category && (
                <span className="capitalize bg-vintage-gold/10 dark:bg-dark-accent/10 px-2 py-1 rounded">
                  {link.category}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={handleBookmark}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`action-button flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-serif transition-all duration-300 ${
                  isBookmarked 
                    ? 'bg-vintage-gold text-white shadow-glow' 
                    : 'bg-vintage-gold/10 dark:bg-dark-accent/10 text-vintage-brown dark:text-dark-accent hover:bg-vintage-gold hover:text-white'
                }`}
              >
                <Bookmark className={`w-3 h-3 ${isBookmarked ? 'fill-current' : ''}`} />
                <span>{isBookmarked ? 'Saved' : 'Save'}</span>
              </motion.button>
              

              
              {/* <motion.button
                onClick={handleVisitLink}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="action-button bg-vintage-gold text-white px-3 py-1 rounded-lg hover:bg-vintage-brass transition-colors text-xs font-serif"
              >
                Visit
              </motion.button> */}
              

            </div>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <motion.div 
          className="absolute inset-0 rounded-2xl"
          animate={{
            boxShadow: isHovered 
              ? '0 0 30px rgba(218, 165, 32, 0.3)' 
              : '0 0 0px rgba(218, 165, 32, 0)'
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  )
}

export default LinkCard
