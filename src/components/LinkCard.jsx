import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Bookmark, BookmarkCheck, ArrowUpRight, ExternalLink } from 'lucide-react'
import apiService from '../lib/api'
import bookmarkService from '../lib/bookmarkService'
import { trackLinkClick } from '../lib/analytics'

const LinkCard = ({ link, index }) => {
  const navigate = useNavigate()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [faviconError, setFaviconError] = useState(false)

  useEffect(() => {
    const checkBookmark = async () => {
      const bookmarked = await bookmarkService.isBookmarked(link._id || link.id)
      setIsBookmarked(bookmarked)
    }
    checkBookmark()
  }, [link._id, link.id])

  const handleCardClick = async (e) => {
    if (e.target.closest('.action-button')) return
    sessionStorage.setItem('homeScrollPos', window.scrollY || 0)
    navigate(`/link/${link._id || link.id}`)
  }

  const handleBookmark = async (e) => {
    e.stopPropagation()
    if (isBookmarked) {
      await bookmarkService.removeBookmark(link._id || link.id)
      setIsBookmarked(false)
      window.dispatchEvent(new CustomEvent('showToast', {
        detail: { message: 'Removed from bookmarks', type: 'success' }
      }))
    } else {
      await bookmarkService.addBookmark(link)
      setIsBookmarked(true)
      window.dispatchEvent(new CustomEvent('showToast', {
        detail: { message: 'Bookmarked!', type: 'success' }
      }))
    }
    window.dispatchEvent(new CustomEvent('bookmarkChanged'))
  }

  const getDomain = () => {
    try {
      return new URL(link.url).hostname.replace('www.', '')
    } catch {
      return 'link'
    }
  }

  const getFaviconUrl = () => {
    try {
      const url = new URL(link.url)
      return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=64`
    } catch {
      return null
    }
  }

  const getInitial = () => {
    return (link.title || 'L')[0].toUpperCase()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.02, 0.15) }}
      className="group cursor-pointer h-full"
      onClick={handleCardClick}
    >
      <div className="relative h-full bg-white dark:bg-[#141414] rounded-xl border border-gray-200/80 dark:border-white/[0.08] p-4 sm:p-5 hover:border-gray-300 dark:hover:border-white/[0.12] hover:shadow-sm transition-all duration-200">

        {/* Header */}
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gray-50 dark:bg-white/[0.05] flex items-center justify-center overflow-hidden border border-gray-100 dark:border-white/[0.06] flex-shrink-0">
              {!faviconError ? (
                <img
                  src={getFaviconUrl()}
                  alt=""
                  className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                  onError={() => setFaviconError(true)}
                />
              ) : (
                <span className="text-xs sm:text-sm font-semibold text-gray-400">{getInitial()}</span>
              )}
            </div>
            <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-vintage-gold bg-vintage-gold/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
              {link.category || 'Resource'}
            </span>
          </div>

          <motion.button
            onClick={handleBookmark}
            whileTap={{ scale: 0.9 }}
            className={`action-button p-1 sm:p-1.5 rounded-lg transition-colors flex-shrink-0 ${isBookmarked
                ? 'text-vintage-gold'
                : 'text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400'
              }`}
          >
            {isBookmarked ? <BookmarkCheck size={15} className="sm:w-4 sm:h-4" /> : <Bookmark size={15} className="sm:w-4 sm:h-4" />}
          </motion.button>
        </div>

        {/* Title */}
        <h3 className="text-[14px] sm:text-[15px] font-semibold text-gray-900 dark:text-white leading-snug mb-1.5 sm:mb-2 line-clamp-2 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
          {link.title || link.name}
        </h3>

        {/* Description */}
        {link.description && (
          <p className="text-[12px] sm:text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 mb-3 sm:mb-4">
            {link.description}
          </p>
        )}

        {/* Tags */}
        {link.tags && link.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3 sm:mb-4">
            {link.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="text-[9px] sm:text-[10px] text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-white/[0.03] px-1.5 sm:px-2 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2.5 sm:pt-3 border-t border-gray-100 dark:border-white/[0.05]">
          <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-gray-400">
            <ExternalLink size={10} className="sm:w-[11px] sm:h-[11px]" />
            <span className="truncate max-w-[80px] sm:max-w-[100px]">{getDomain()}</span>
          </div>

          <motion.a
            href={`${link.url}${link.url.includes('?') ? '&' : '?'}ref=linkshala`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={async (e) => {
              e.stopPropagation()
              if (link._id) {
                try { await apiService.trackReferral(link._id) } catch { }
              }
              trackLinkClick(link.title, link.url)
            }}
            whileTap={{ scale: 0.97 }}
            className="action-button flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-medium text-vintage-gold border border-vintage-gold/30 hover:bg-vintage-gold/10 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-colors"
          >
            Visit
            <ArrowUpRight size={11} className="sm:w-3 sm:h-3" />
          </motion.a>
        </div>
      </div>
    </motion.div>
  )
}

export default LinkCard
