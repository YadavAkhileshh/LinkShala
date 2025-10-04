import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Bookmark, Search, Trash2, ExternalLink, Calendar, Heart, Download, Upload, Filter } from 'lucide-react'
import bookmarkService from '../lib/bookmarkService'
import LinkCard from '../components/LinkCard'

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredBookmarks, setFilteredBookmarks] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const fileInputRef = useRef(null)

  useEffect(() => {
    loadBookmarks()
    
    // Listen for bookmark changes
    const handleBookmarkChange = () => loadBookmarks()
    window.addEventListener('bookmarkChanged', handleBookmarkChange)
    
    return () => window.removeEventListener('bookmarkChanged', handleBookmarkChange)
  }, [])

  useEffect(() => {
    let filtered = bookmarks
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(b => b.category === selectedCategory)
    }
    
    if (searchTerm) {
      filtered = filtered.filter(bookmark =>
        bookmark.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }
    
    setFilteredBookmarks(filtered)
  }, [searchTerm, bookmarks, selectedCategory])

  const loadBookmarks = async () => {
    const savedBookmarks = await bookmarkService.getBookmarks()
    setBookmarks(savedBookmarks)
  }

  const handleRemoveBookmark = async (linkId) => {
    await bookmarkService.removeBookmark(linkId)
    loadBookmarks()
    
    // Show toast notification
    const event = new CustomEvent('showToast', {
      detail: { message: 'Bookmark removed!', type: 'success' }
    })
    window.dispatchEvent(event)
  }

  const handleClearAll = async () => {
    if (confirm('Are you sure you want to clear all bookmarks?')) {
      await bookmarkService.clearBookmarks()
      loadBookmarks()
      
      const event = new CustomEvent('showToast', {
        detail: { message: 'All bookmarks cleared!', type: 'success' }
      })
      window.dispatchEvent(event)
    }
  }

  const handleExport = async () => {
    await bookmarkService.exportBookmarks()
    const event = new CustomEvent('showToast', {
      detail: { message: 'Bookmarks exported!', type: 'success' }
    })
    window.dispatchEvent(event)
  }

  const handleImport = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const result = await bookmarkService.importBookmarks(file)
    if (result.success) {
      loadBookmarks()
      const event = new CustomEvent('showToast', {
        detail: { message: `Imported ${result.imported} of ${result.total} bookmarks!`, type: 'success' }
      })
      window.dispatchEvent(event)
    } else {
      const event = new CustomEvent('showToast', {
        detail: { message: `Import failed: ${result.error}`, type: 'error' }
      })
      window.dispatchEvent(event)
    }
    e.target.value = ''
  }

  const categories = ['all', ...new Set(bookmarks.map(b => b.category).filter(Boolean))]

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
              <Heart className="w-5 h-5 text-vintage-gold fill-vintage-gold" />
              <span className="font-serif font-medium">{bookmarks.length} bookmark{bookmarks.length !== 1 ? 's' : ''}</span>
            </div>
            {bookmarks.length > 0 && (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleExport}
                  className="flex items-center space-x-2 text-vintage-gold hover:text-vintage-brass transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span className="font-serif text-sm">Export</span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span className="font-serif text-sm">Import</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
                <button
                  onClick={handleClearAll}
                  className="flex items-center space-x-2 text-vintage-red hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="font-serif text-sm">Clear All</span>
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Search and Filter */}
        {bookmarks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto mb-12 space-y-4"
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
            
            {/* Category Filter */}
            {categories.length > 1 && (
              <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                <Filter className="w-4 h-4 text-vintage-brown dark:text-dark-muted flex-shrink-0" />
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg font-serif text-sm whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-vintage-gold text-white'
                        : 'bg-vintage-paper dark:bg-dark-card text-vintage-brown dark:text-dark-muted hover:bg-vintage-gold/10'
                    }`}
                  >
                    {cat === 'all' ? 'All' : cat}
                  </button>
                ))}
              </div>
            )}
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
                  {bookmark.bookmarkedAt && (
                    <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-vintage-black/80 text-white px-2 py-1 rounded-lg text-xs font-serif flex items-center space-x-1">
                        <Calendar size={12} />
                        <span>
                          Saved {new Date(bookmark.bookmarkedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  )}
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