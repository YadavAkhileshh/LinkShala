import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Share2, ExternalLink, Calendar, Bookmark, BookmarkCheck } from 'lucide-react'
import apiService from '../lib/api'
import bookmarkService from '../lib/bookmarkService'

const LinkDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [link, setLink] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const shareMenuRef = useRef(null)

  useEffect(() => {
    loadLinkDetails()
    
    // Load Chatbase only on this page
    const loadChatbot = () => {
      const script = document.createElement('script')
      script.innerHTML = `
        (function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const script=document.createElement("script");script.src="https://www.chatbase.co/embed.min.js";script.id="u3EUI6O2hCNxZuSrAv9Ij";script.domain="www.chatbase.co";document.body.appendChild(script)};if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}})();
      `
      document.head.appendChild(script)
    }
    
    loadChatbot()
    
    // Cleanup when component unmounts
    return () => {
      const chatbotElements = document.querySelectorAll('[id*="chatbase"], [class*="chatbase"], iframe[src*="chatbase"]')
      chatbotElements.forEach(el => el.remove())
      
      if (window.chatbase) {
        delete window.chatbase
      }
    }
  }, [id])

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
        setShowShareMenu(false)
      }
    }

    if (showShareMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showShareMenu])

  const loadLinkDetails = async () => {
    try {
      setLoading(true)
      const data = await apiService.getLink(id)
      setLink(data)
      const bookmarked = await bookmarkService.isBookmarked(data._id)
      setIsBookmarked(bookmarked)
    } catch (error) {
      console.error('Error loading link details:', error)
    } finally {
      setLoading(false)
    }
  }



  const handleShare = async (platform) => {
    try {
      await apiService.shareLink(id)
      const shareUrl = window.location.href
      const shareText = `🚀 Discover ${link.title} - One of the best curated resources on the internet! Come and explore amazing tools & websites at LinkShala 💎✨`
      
      switch (platform) {
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}&hashtags=webdev,tools,resources`)
          break
        case 'linkedin':
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`)
          break
        case 'github':
          const githubText = `# ${link.title}\n\n${link.description || 'Amazing resource found on LinkShala'}\n\n🔗 ${shareUrl}\n\n> Curated by LinkShala - Explore the best websites on the internet!`
          await navigator.clipboard.writeText(githubText)
          const githubEvent = new CustomEvent('showToast', {
            detail: { message: 'GitHub-formatted text copied to clipboard!', type: 'success' }
          })
          window.dispatchEvent(githubEvent)
          break
        case 'devto':
          const devtoText = `Check out this amazing resource: ${link.title}\n\n${shareUrl}\n\n#webdev #tools #resources`
          window.open(`https://dev.to/new?prefill=${encodeURIComponent(devtoText)}`)
          break
        
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`)
          break
        case 'copy':
          const copyText = `🚀 ${link.title}\n\n${link.description || 'Amazing curated resource'}\n\n✨ Discover more incredible tools and websites at LinkShala - your gateway to the best of the internet!\n\n🔗 ${shareUrl}`
          await navigator.clipboard.writeText(copyText)
          const event = new CustomEvent('showToast', {
            detail: { message: 'Link with description copied to clipboard!', type: 'success' }
          })
          window.dispatchEvent(event)
          break
      }
      setShowShareMenu(false)
    } catch (error) {
      console.error('Error sharing:', error)
      const event = new CustomEvent('showToast', {
        detail: { message: 'Failed to share link', type: 'error' }
      })
      window.dispatchEvent(event)
    }
  }

  const handleBookmark = () => {
    try {
      if (isBookmarked) {
        bookmarkService.removeBookmark(link._id)
        setIsBookmarked(false)
        const event = new CustomEvent('showToast', {
          detail: { message: 'Removed from bookmarks', type: 'success' }
        })
        window.dispatchEvent(event)
      } else {
        bookmarkService.addBookmark(link)
        setIsBookmarked(true)
        const event = new CustomEvent('showToast', {
          detail: { message: 'Added to bookmarks', type: 'success' }
        })
        window.dispatchEvent(event)
      }
    } catch (error) {
      console.error('Error handling bookmark:', error)
      const event = new CustomEvent('showToast', {
        detail: { message: 'Failed to update bookmark', type: 'error' }
      })
      window.dispatchEvent(event)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-vintage-cream dark:bg-dark-bg flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-vintage-gold border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (!link) {
    return (
      <div className="min-h-screen bg-vintage-cream dark:bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-4">
            Link not found
          </h2>
          <button
            onClick={() => navigate('/')}
            className="bg-vintage-gold text-white px-6 py-3 rounded-lg hover:bg-vintage-brass transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-vintage-cream dark:bg-dark-bg py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={() => {
              sessionStorage.setItem('homeScrollPos', window.scrollY || 0)
              navigate(-1)
            }}
            className="flex items-center space-x-2 text-vintage-brown dark:text-dark-muted hover:text-vintage-gold transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-serif">Back</span>
          </button>
          
          <div className="flex items-center space-x-3">
            {/* Bookmark Button */}
            <motion.button
              onClick={handleBookmark}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-3 rounded-lg transition-all duration-300 flex items-center space-x-2 shadow-lg ${
                isBookmarked 
                  ? 'bg-vintage-gold text-white hover:bg-vintage-brass' 
                  : 'bg-vintage-paper dark:bg-dark-card border border-vintage-gold/30 dark:border-dark-border text-vintage-brown dark:text-dark-muted hover:bg-vintage-gold/10 dark:hover:bg-vintage-gold/20'
              }`}
            >
              {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
              <span className="font-serif font-medium hidden sm:inline">
                {isBookmarked ? 'Saved' : 'Save'}
              </span>
            </motion.button>
            
            {/* Share Button */}
            <div className="relative" ref={shareMenuRef}>
              <motion.button
                onClick={() => setShowShareMenu(!showShareMenu)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-vintage-gold to-vintage-brass text-white px-6 py-3 rounded-lg hover:from-vintage-brass hover:to-vintage-gold transition-all duration-300 flex items-center space-x-2 shadow-lg"
              >
                <Share2 size={18} />
                <span className="font-serif font-medium">Share Link</span>
              </motion.button>
            
            <AnimatePresence>
              {showShareMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  className="absolute right-0 top-12 bg-vintage-paper dark:bg-dark-card border border-vintage-gold/20 dark:border-dark-border rounded-lg shadow-vault p-2 z-10"
                >
                  <div className="flex flex-col space-y-1 min-w-[180px]">
                    <button
                      onClick={() => handleShare('twitter')}
                      className="px-3 py-2 text-left hover:bg-vintage-gold/10 dark:hover:bg-vintage-gold/20 rounded text-sm flex items-center space-x-2 text-vintage-black dark:text-white transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                      <span>Twitter</span>
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="px-3 py-2 text-left hover:bg-vintage-gold/10 dark:hover:bg-vintage-gold/20 rounded text-sm flex items-center space-x-2 text-vintage-black dark:text-white transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      <span>LinkedIn</span>
                    </button>
                    <button
                      onClick={() => handleShare('github')}
                      className="px-3 py-2 text-left hover:bg-vintage-gold/10 dark:hover:bg-vintage-gold/20 rounded text-sm flex items-center space-x-2 text-vintage-black dark:text-white transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                      <span>GitHub</span>
                    </button>
                    <button
                      onClick={() => handleShare('devto')}
                      className="px-3 py-2 text-left hover:bg-vintage-gold/10 dark:hover:bg-vintage-gold/20 rounded text-sm flex items-center space-x-2 text-vintage-black dark:text-white transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45h.56c.42 0 .63-.05.83-.26.24-.25.26-.38.26-2.2 0-1.91-.02-1.96-.29-2.2zM0 4.94v14.12h24V4.94H0zM8.56 15.3c-.44.58-1.06.77-2.53.77H4.71V8.53h1.4c1.67 0 2.16.18 2.6.9.27.43.29.6.32 2.57.05 2.23-.02 2.73-.47 3.3zm5.09-5.47h-2.47v1.77h1.52v1.28l-.72.04-.75.03v1.77l1.22.03 1.2.04v1.28h-1.6c-1.53 0-1.6-.01-1.87-.3l-.3-.28v-3.16c0-3.02.01-3.18.25-3.48.23-.31.25-.31 1.88-.31h1.64v1.3zm4.68 5.45c-.17.43-.64.79-1 .79-.18 0-.45-.15-.67-.39-.32-.32-.45-.63-.82-2.08l-.9-3.39-.45-1.67h.76c.4 0 .75.02.75.05 0 .06 1.16 4.54 1.26 4.83.04.15.32-.7.73-2.3l.66-2.52.74-.04c.4-.02.73 0 .73.04 0 .14-1.67 6.38-1.8 6.68z"/></svg>
                      <span>Dev.to</span>
                    </button>
                    
                    <button
                      onClick={() => handleShare('whatsapp')}
                      className="px-3 py-2 text-left hover:bg-vintage-gold/10 dark:hover:bg-vintage-gold/20 rounded text-sm flex items-center space-x-2 text-vintage-black dark:text-white transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/></svg>
                      <span>WhatsApp</span>
                    </button>
                    <button
                      onClick={() => handleShare('copy')}
                      className="px-3 py-2 text-left hover:bg-vintage-gold/10 dark:hover:bg-vintage-gold/20 rounded text-sm flex items-center space-x-2 text-vintage-black dark:text-white transition-colors border-t border-vintage-gold/20 dark:border-dark-border"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                      <span>Copy Link</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-vintage-paper dark:bg-dark-card rounded-2xl p-8 shadow-vault border border-vintage-gold/20 dark:border-dark-border mb-8"
        >
          {/* Title and Stats */}
          <div className="mb-6">
            <h1 className="text-4xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-4">
              {link.title}
            </h1>
            
            <div className="flex items-center space-x-2 text-vintage-brown dark:text-dark-muted mb-4">
              <Calendar size={16} />
              <span className="font-serif">Published {new Date(link.publishedDate || link.createdAt).toLocaleDateString()}</span>
            </div>
            
            {/* Description */}
            {link.description && (
              <div className="mb-6 p-4 bg-vintage-gold/5 dark:bg-dark-accent/5 rounded-xl border border-vintage-gold/10 dark:border-dark-accent/10">
                <p className="text-vintage-coffee dark:text-dark-muted font-serif leading-relaxed">
                  {link.description}
                </p>
              </div>
            )}
            
            {/* Tags */}
            {link.tags && link.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {link.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-vintage-gold/10 dark:bg-dark-accent/10 text-vintage-brown dark:text-dark-accent text-sm rounded-full border border-vintage-gold/20 dark:border-dark-accent/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            {/* Visit Link Button */}
            <motion.a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-vintage-gold to-vintage-brass text-white px-8 py-4 rounded-lg font-serif font-medium hover:from-vintage-brass hover:to-vintage-gold transition-all duration-300 shadow-glow"
            >
              <ExternalLink size={20} />
              <span>Explore Now →</span>
            </motion.a>
          </div>
        </motion.div>

      </div>
    </div>
  )
}

export default LinkDetailPage