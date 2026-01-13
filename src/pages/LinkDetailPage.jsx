import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Share2, ExternalLink, Calendar, Bookmark, BookmarkCheck, Globe, Copy, Clock, Eye, Tag, ArrowRight } from 'lucide-react'
import apiService from '../lib/api'
import bookmarkService from '../lib/bookmarkService'

const LinkDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [link, setLink] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [copied, setCopied] = useState(false)
  const [relatedLinks, setRelatedLinks] = useState([])
  const shareMenuRef = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    loadLinkDetails()

    // Load chatbase chatbot
    const loadChatbot = () => {
      const script = document.createElement('script')
      script.innerHTML = `(function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const script=document.createElement("script");script.src="https://www.chatbase.co/embed.min.js";script.id="u3EUI6O2hCNxZuSrAv9Ij";script.domain="www.chatbase.co";document.body.appendChild(script)};if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}})();`
      document.head.appendChild(script)
    }
    loadChatbot()

    return () => {
      const chatbotElements = document.querySelectorAll('[id*="chatbase"], [class*="chatbase"], iframe[src*="chatbase"]')
      chatbotElements.forEach(el => el.remove())
      if (window.chatbase) delete window.chatbase
    }
  }, [id])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
        setShowShareMenu(false)
      }
    }
    if (showShareMenu) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showShareMenu])

  const loadLinkDetails = async () => {
    try {
      setLoading(true)
      const data = await apiService.getLink(id)
      setLink(data)
      const bookmarked = await bookmarkService.isBookmarked(data._id)
      setIsBookmarked(bookmarked)

      // Load related links from same category
      if (data.category) {
        try {
          const allLinks = await apiService.getLinks()
          const related = allLinks
            .filter(l => l.category === data.category && l._id !== data._id)
            .slice(0, 3)
          setRelatedLinks(related)
        } catch (e) {
          console.log('Could not load related links')
        }
      }
    } catch (error) {
      console.error('Error loading link details:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDomain = () => {
    try {
      return new URL(link?.url).hostname.replace('www.', '')
    } catch {
      return 'link'
    }
  }

  const handleShare = async (type) => {
    try {
      await apiService.shareLink(id)
      const url = window.location.href
      const text = `Check out ${link.title} on LinkShala`

      if (type === 'twitter') window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`)
      else if (type === 'linkedin') window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`)
      else if (type === 'copy') {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (error) {
      console.error('Error sharing:', error)
    }
    setShowShareMenu(false)
  }

  const handleBookmark = async () => {
    try {
      if (isBookmarked) {
        await bookmarkService.removeBookmark(link._id)
        setIsBookmarked(false)
      } else {
        await bookmarkService.addBookmark(link)
        setIsBookmarked(true)
      }
      window.dispatchEvent(new CustomEvent('bookmarkChanged'))
    } catch (error) {
      console.error('Error bookmarking:', error)
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fefdfb] dark:bg-[#0c0c0c] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-vintage-gold/30 border-t-vintage-gold rounded-full animate-spin" />
      </div>
    )
  }

  if (!link) {
    return (
      <div className="min-h-screen bg-[#fefdfb] dark:bg-[#0c0c0c] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-vintage text-gray-900 dark:text-white mb-2">Link not found</h2>
          <button onClick={() => navigate('/home')} className="text-vintage-gold hover:text-vintage-brass">
            Go back home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fefdfb] dark:bg-[#0c0c0c] transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Back</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/[0.06] overflow-hidden shadow-sm"
          >
            {/* Header with gradient */}
            <div className="relative p-6 sm:p-8 border-b border-gray-100 dark:border-white/[0.06] bg-gradient-to-br from-vintage-gold/5 to-transparent">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-white dark:bg-[#1a1a1a] rounded-xl flex items-center justify-center border border-gray-100 dark:border-white/[0.08] shadow-sm">
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${getDomain()}&sz=64`}
                    alt=""
                    className="w-9 h-9"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-vintage-gold bg-vintage-gold/10 px-2 py-0.5 rounded">
                      {link.category}
                    </span>
                    {link.isPromoted && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 bg-amber-100 dark:bg-amber-900/20 px-2 py-0.5 rounded">
                        Featured
                      </span>
                    )}
                  </div>
                  <h1 className="text-xl sm:text-2xl font-vintage text-gray-900 dark:text-white leading-tight">
                    {link.title}
                  </h1>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
              {/* Description */}
              {link.description && (
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 text-base">
                  {link.description}
                </p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-6 pb-6 border-b border-gray-100 dark:border-white/[0.06]">
                <div className="flex items-center gap-1.5">
                  <Globe size={14} />
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-vintage-gold transition-colors"
                  >
                    {getDomain()}
                  </a>
                </div>
                {link.createdAt && (
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    <span>Added {formatDate(link.createdAt)}</span>
                  </div>
                )}
                {link.clicks > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Eye size={14} />
                    <span>{link.clicks} views</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              {link.tags && link.tags.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                    <Tag size={12} />
                    <span>Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {link.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-white/[0.03] px-3 py-1.5 rounded-lg border border-gray-100 dark:border-white/[0.06]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-gray-100 dark:border-white/[0.06]">
                <motion.a
                  href={`${link.url}${link.url.includes('?') ? '&' : '?'}ref=linkshala`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-vintage-gold hover:bg-vintage-brass text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-sm"
                >
                  <ExternalLink size={16} />
                  Visit Website
                </motion.a>

                <motion.button
                  onClick={handleBookmark}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3.5 rounded-xl border transition-colors ${isBookmarked
                    ? 'bg-vintage-gold/10 border-vintage-gold/30 text-vintage-gold'
                    : 'border-gray-200 dark:border-white/10 text-gray-500 hover:border-vintage-gold hover:text-vintage-gold'
                    }`}
                >
                  {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                </motion.button>

                <div className="relative" ref={shareMenuRef}>
                  <motion.button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    whileTap={{ scale: 0.95 }}
                    className="p-3.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-500 hover:border-vintage-gold hover:text-vintage-gold transition-colors"
                  >
                    <Share2 size={18} />
                  </motion.button>

                  <AnimatePresence>
                    {showShareMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute bottom-full right-0 mb-2 bg-white dark:bg-[#111] border border-gray-100 dark:border-white/10 rounded-xl shadow-lg p-2 min-w-[140px]"
                      >
                        {[
                          { id: 'twitter', label: 'Twitter' },
                          { id: 'linkedin', label: 'LinkedIn' },
                          { id: 'copy', label: copied ? 'Copied!' : 'Copy link' }
                        ].map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleShare(item.id)}
                            className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                          >
                            {item.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.article>

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Quick Info Card */}
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Quick Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Category</span>
                  <span className="text-gray-900 dark:text-white font-medium">{link.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Domain</span>
                  <span className="text-gray-900 dark:text-white font-medium truncate max-w-[120px]">{getDomain()}</span>
                </div>
                {link.createdAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Added</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {new Date(link.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Related Links */}
            {relatedLinks.length > 0 && (
              <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-5">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">More in {link.category}</h3>
                <div className="space-y-3">
                  {relatedLinks.map((related) => (
                    <Link
                      key={related._id}
                      to={`/link/${related._id}`}
                      className="block group"
                    >
                      <div className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors">
                        <div className="w-8 h-8 bg-gray-50 dark:bg-white/[0.03] rounded-lg flex items-center justify-center flex-shrink-0">
                          <img
                            src={`https://www.google.com/s2/favicons?domain=${new URL(related.url).hostname}&sz=32`}
                            alt=""
                            className="w-4 h-4"
                            onError={(e) => { e.target.style.display = 'none' }}
                          />
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-vintage-gold transition-colors line-clamp-1">
                          {related.title}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  to="/home"
                  className="flex items-center justify-center gap-1 mt-4 text-xs text-vintage-gold hover:text-vintage-brass transition-colors"
                >
                  <span>Browse all</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            )}

            {/* CTA Card */}
            <div className="bg-gradient-to-br from-vintage-gold/10 to-amber-50/50 dark:from-vintage-gold/5 dark:to-transparent rounded-2xl border border-vintage-gold/20 p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Found this useful?</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Bookmark it to access later or share with your team.
              </p>
              <button
                onClick={handleBookmark}
                className={`w-full text-sm font-medium py-2.5 rounded-lg transition-colors ${isBookmarked
                  ? 'bg-vintage-gold/20 text-vintage-gold'
                  : 'bg-vintage-gold hover:bg-vintage-brass text-white'
                  }`}
              >
                {isBookmarked ? 'Bookmarked' : 'Save for later'}
              </button>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  )
}

export default LinkDetailPage