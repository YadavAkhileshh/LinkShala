import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Share2, ExternalLink, Calendar } from 'lucide-react'
import apiService from '../lib/api'

const LinkDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [link, setLink] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showShareMenu, setShowShareMenu] = useState(false)

  useEffect(() => {
    loadLinkDetails()
  }, [id])

  const loadLinkDetails = async () => {
    try {
      setLoading(true)
      const data = await apiService.getLink(id)
      setLink(data)

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
      const shareText = `Check out ${link.title} - Amazing resource from LinkShala!`
      
      switch (platform) {
        case 'native':
          if (navigator.share) {
            await navigator.share({
              title: link.title,
              text: shareText,
              url: shareUrl,
            })
          }
          break
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`)
          break
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`)
          break
        case 'linkedin':
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`)
          break
        case 'copy':
          await navigator.clipboard.writeText(shareUrl)
          const event = new CustomEvent('showToast', {
            detail: { message: 'Link copied to clipboard!', type: 'success' }
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
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-vintage-brown dark:text-dark-muted hover:text-vintage-gold transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-serif">Back</span>
          </button>
          
          <div className="relative">
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
                  <div className="flex flex-col space-y-1 min-w-[150px]">
                    {navigator.share && (
                      <button
                        onClick={() => handleShare('native')}
                        className="px-3 py-2 text-left hover:bg-vintage-gold/10 dark:hover:bg-vintage-gold/20 rounded text-sm flex items-center space-x-2 text-vintage-black dark:text-white transition-colors"
                      >
                        <span>📱</span><span>Native Share</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleShare('twitter')}
                      className="px-3 py-2 text-left hover:bg-vintage-gold/10 dark:hover:bg-vintage-gold/20 rounded text-sm flex items-center space-x-2 text-vintage-black dark:text-white transition-colors"
                    >
                      <span>🐦</span><span>Twitter</span>
                    </button>
                    <button
                      onClick={() => handleShare('facebook')}
                      className="px-3 py-2 text-left hover:bg-vintage-gold/10 dark:hover:bg-vintage-gold/20 rounded text-sm flex items-center space-x-2 text-vintage-black dark:text-white transition-colors"
                    >
                      <span>📘</span><span>Facebook</span>
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="px-3 py-2 text-left hover:bg-vintage-gold/10 dark:hover:bg-vintage-gold/20 rounded text-sm flex items-center space-x-2 text-vintage-black dark:text-white transition-colors"
                    >
                      <span>💼</span><span>LinkedIn</span>
                    </button>
                    <button
                      onClick={() => handleShare('copy')}
                      className="px-3 py-2 text-left hover:bg-vintage-gold/10 dark:hover:bg-vintage-gold/20 rounded text-sm flex items-center space-x-2 text-vintage-black dark:text-white transition-colors"
                    >
                      <span>📋</span><span>Copy Link</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
              <span className="font-serif">Added {new Date(link.createdAt).toLocaleDateString()}</span>
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
              <span>Visit Website</span>
            </motion.a>
          </div>
        </motion.div>


      </div>
    </div>
  )
}

export default LinkDetailPage