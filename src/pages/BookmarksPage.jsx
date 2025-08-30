import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bookmark, Search, Trash2, ExternalLink, Calendar, Heart } from 'lucide-react'
import bookmarkService from '../lib/bookmarkService'
import LinkCard from '../components/LinkCard'

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredBookmarks, setFilteredBookmarks] = useState([])

  useEffect(() => {
    loadBookmarks()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = bookmarks.filter(bookmark =>
        bookmark.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      setFilteredBookmarks(filtered)
    } else {
      setFilteredBookmarks(bookmarks)
    }
  }, [searchTerm, bookmarks])

  const loadBookmarks = () => {
    const savedBookmarks = bookmarkService.getBookmarks()
    setBookmarks(savedBookmarks)
  }

  const handleRemoveBookmark = (linkId) => {
    bookmarkService.removeBookmark(linkId)
    loadBookmarks()
    
    // Show toast notification
    const event = new CustomEvent('showToast', {
      detail: { message: 'Bookmark removed!', type: 'success' }
    })
    window.dispatchEvent(event)
  }

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all bookmarks?')) {
      bookmarkService.clearBookmarks()
      loadBookmarks()
      
      const event = new CustomEvent('showToast', {
        detail: { message: 'All bookmarks cleared!', type: 'success' }
      })
      window.dispatchEvent(event)
    }
  }

  return (
    <div className="min-h-screen bg-vintage-cream dark:bg-dark-bg py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-vintage-gold to-vintage-brass rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
            <Bookmark className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-4">
            My Bookmarks
          </h1>
          
          <p className="text-xl text-vintage-coffee dark:text-dark-muted font-serif max-w-2xl mx-auto">
            Your personal collection of saved resources
          </p>
          
          <div className="flex items-center justify-center space-x-4 mt-6">
            <div className="flex items-center space-x-2 text-vintage-brown dark:text-dark-muted">
              <Heart className="w-5 h-5 text-vintage-gold" />
              <span className="font-serif">{bookmarks.length} saved</span>
            </div>
            {bookmarks.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center space-x-2 text-vintage-red hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span className="font-serif text-sm">Clear All</span>
              </button>
            )}
          </div>
        </motion.div>

        {/* Search */}
        {bookmarks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-vintage-brown dark:text-dark-muted" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search your bookmarks..."
                className="w-full pl-12 pr-4 py-4 bg-vintage-paper dark:bg-dark-card border border-vintage-gold/30 dark:border-dark-border rounded-2xl focus:ring-2 focus:ring-vintage-gold focus:border-transparent text-vintage-black dark:text-dark-text placeholder-vintage-brown/60 dark:placeholder-dark-muted/60 font-serif shadow-vault"
              />
            </div>
          </motion.div>
        )}

        {/* Bookmarks Grid */}
        {filteredBookmarks.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredBookmarks.map((bookmark, index) => (
              <motion.div
                key={bookmark.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                {/* Enhanced LinkCard with bookmark features */}
                <div className="relative">
                  <LinkCard link={bookmark} index={index} />
                  
                  {/* Bookmark Actions Overlay */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex flex-col space-y-2">
                      <motion.button
                        onClick={() => handleRemoveBookmark(bookmark.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-8 h-8 bg-vintage-red text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                        title="Remove bookmark"
                      >
                        <Trash2 size={14} />
                      </motion.button>
                      
                      <motion.a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-8 h-8 bg-vintage-gold text-white rounded-full flex items-center justify-center shadow-lg hover:bg-vintage-brass transition-colors"
                        title="Open link"
                      >
                        <ExternalLink size={14} />
                      </motion.a>
                    </div>
                  </div>
                  
                  {/* Bookmark Date */}
                  <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-vintage-black/80 text-white px-2 py-1 rounded-lg text-xs font-serif flex items-center space-x-1">
                      <Calendar size={12} />
                      <span>
                        {new Date(bookmark.bookmarkedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : bookmarks.length > 0 ? (
          // No search results
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <Search size={64} className="text-vintage-brown/30 dark:text-dark-muted/30 mx-auto mb-6" />
            <h3 className="text-2xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-4">
              No bookmarks found
            </h3>
            <p className="text-vintage-coffee dark:text-dark-muted font-serif mb-6">
              No bookmarks match "{searchTerm}". Try a different search term.
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="text-vintage-gold hover:text-vintage-brass font-serif font-medium"
            >
              Clear search
            </button>
          </motion.div>
        ) : (
          // Empty state
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <Bookmark size={64} className="text-vintage-brown/30 dark:text-dark-muted/30 mx-auto mb-6" />
            <h3 className="text-2xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-4">
              No bookmarks yet
            </h3>
            <p className="text-vintage-coffee dark:text-dark-muted font-serif mb-8 max-w-md mx-auto">
              Start bookmarking your favorite resources! Click the bookmark icon on any link card to save it here.
            </p>
            <motion.a
              href="/"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-vintage-gold to-vintage-brass text-white px-8 py-4 rounded-xl font-serif font-medium hover:from-vintage-brass hover:to-vintage-gold transition-all duration-300 shadow-glow"
            >
              <span>Explore Links</span>
              <ExternalLink size={18} />
            </motion.a>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default BookmarksPage