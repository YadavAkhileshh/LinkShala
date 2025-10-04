import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Edit, Trash2, Save, X, Upload, FileText, 
  BarChart3, Users, Link as LinkIcon, TrendingUp,
  Eye, Share2, Calendar, Search, Filter, Settings
} from 'lucide-react'
import apiService from '../lib/api'
import CategoryManager from '../components/CategoryManager'

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [links, setLinks] = useState([])
  const [allLinks, setAllLinks] = useState([])
  const [stats, setStats] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('overview')
  const [availableCategories, setAvailableCategories] = useState([])
  const [selectedLinks, setSelectedLinks] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState({ show: false, title: '', message: '', onConfirm: null })
  
  // Form states
  const [isEditing, setIsEditing] = useState(false)
  const [editingLink, setEditingLink] = useState(null)
  const [showBulkUpload, setShowBulkUpload] = useState(false)
  const [bulkData, setBulkData] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    category: '',
    tags: '',
    publishedDate: new Date().toISOString().split('T')[0],
    isFeatured: false,
    isPromoted: false
  })

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token')
      if (token) {
        try {
          // Refresh token in service
          apiService.refreshToken()
          // Test the token by making a simple API call
          await apiService.getAdminStats()
          setIsAuthenticated(true)
          loadDashboardData()
        } catch (error) {
          console.error('Auth check failed:', error)
          // Token is invalid, clear it
          apiService.adminLogout()
          setIsAuthenticated(false)
        }
      }
    }
    checkAuth()
  }, [])

  useEffect(() => {
    if (isAuthenticated && activeTab === 'links') {
      loadLinks()
      loadCategories()
    }
  }, [currentPage, isAuthenticated, activeTab])

  // Instant search and category filter
  useEffect(() => {
    let filtered = allLinks
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(link => link.category === categoryFilter)
    }
    
    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(link => 
        link.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    setLinks(filtered)
    setCurrentPage(1)
  }, [searchTerm, categoryFilter, allLinks])

  useEffect(() => {
    // Listen for category updates
    const handleCategoriesUpdated = () => {
      loadCategories()
    }
    
    window.addEventListener('categoriesUpdated', handleCategoriesUpdated)
    
    return () => {
      window.removeEventListener('categoriesUpdated', handleCategoriesUpdated)
    }
  }, [])

  const loadCategories = async () => {
    try {
      const categories = await apiService.getCategories()
      setAvailableCategories(categories)
      // Set default category if none selected
      if (!formData.category && categories.length > 0) {
        setFormData(prev => ({ ...prev, category: categories[0].slug }))
      }
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    
    if (!password.trim()) {
      const event = new CustomEvent('showToast', {
        detail: { message: 'Please enter password', type: 'error' }
      })
      window.dispatchEvent(event)
      return
    }
    
    try {
      setIsLoading(true)
      await apiService.adminLogin(password)
      setIsAuthenticated(true)
      setPassword('')
      
      // Load data in background for faster UX
      setTimeout(() => loadDashboardData(), 100)
      
      const event = new CustomEvent('showToast', {
        detail: { message: 'Welcome to admin dashboard!', type: 'success' }
      })
      window.dispatchEvent(event)
    } catch (error) {
      const event = new CustomEvent('showToast', {
        detail: { message: error.message || 'Invalid password. Please try again.', type: 'error' }
      })
      window.dispatchEvent(event)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    apiService.adminLogout()
    setIsAuthenticated(false)
    setLinks([])
    setStats({})
  }

  const loadDashboardData = async () => {
    try {
      // Load stats first for immediate feedback
      const statsData = await apiService.getAdminStats()
      setStats(statsData)
      
      // Then load links if on links tab
      if (activeTab === 'links') {
        const linksData = await apiService.getAdminLinks({ page: 1, limit: 20 })
        setLinks(linksData.links)
        setTotalPages(linksData.totalPages)
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      const event = new CustomEvent('showToast', {
        detail: { message: 'Error loading dashboard data', type: 'error' }
      })
      window.dispatchEvent(event)
    }
  }

  const loadLinks = async () => {
    try {
      setIsLoading(true)
      const params = { page: currentPage, limit: 100 }
      
      const data = await apiService.getAdminLinks(params)
      setAllLinks(data.links)
      setLinks(data.links)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Error loading links:', error)
      if (error.message.includes('Invalid token')) {
        apiService.adminLogout()
        setIsAuthenticated(false)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (link) => {
    setEditingLink(link)
    setFormData({
      title: link.title,
      url: link.url,
      description: link.description || '',
      category: link.category,
      tags: Array.isArray(link.tags) ? link.tags.join(', ') : link.tags || '',
      publishedDate: link.publishedDate ? new Date(link.publishedDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      isFeatured: link.isFeatured || false,
      isPromoted: link.isPromoted || false
    })
    setIsEditing(true)
  }

  const normalizeUrl = (url) => {
    if (!url) return ''
    const trimmedUrl = url.trim()
    if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
      return trimmedUrl
    }
    return `https://${trimmedUrl}`
  }

  const handleSave = async () => {
    if (!formData.title || !formData.url) {
      const event = new CustomEvent('showToast', {
        detail: { message: 'Please fill in required fields', type: 'error' }
      })
      window.dispatchEvent(event)
      return
    }

    try {
      setIsLoading(true)
      const linkData = {
        title: formData.title,
        url: normalizeUrl(formData.url),
        description: formData.description || '',
        category: formData.category,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        publishedDate: formData.publishedDate ? new Date(formData.publishedDate) : new Date(),
        isFeatured: formData.isFeatured,
        isPromoted: formData.isPromoted
      }
      
      if (editingLink) {
        await apiService.updateLink(editingLink._id, linkData)
        const event = new CustomEvent('showToast', {
          detail: { message: 'Link updated successfully!', type: 'success' }
        })
        window.dispatchEvent(event)
      } else {
        await apiService.createLink(linkData)
        const event = new CustomEvent('showToast', {
          detail: { message: 'Link created successfully!', type: 'success' }
        })
        window.dispatchEvent(event)
      }
      
      setIsEditing(false)
      setEditingLink(null)
      resetForm()
      loadLinks()
      loadDashboardData()
    } catch (error) {
      console.error('Error saving link:', error)
      const event = new CustomEvent('showToast', {
        detail: { message: error.message || 'Error saving link. Please try again.', type: 'error' }
      })
      window.dispatchEvent(event)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    setConfirmDialog({
      show: true,
      title: 'Delete Link',
      message: 'Are you sure you want to delete this link? This action cannot be undone.',
      onConfirm: async () => {
        try {
          setIsLoading(true)
          await apiService.deleteLink(id)
          const event = new CustomEvent('showToast', {
            detail: { message: 'Link deleted successfully!', type: 'success' }
          })
          window.dispatchEvent(event)
          loadLinks()
          loadDashboardData()
        } catch (error) {
          console.error('Error deleting link:', error)
          const event = new CustomEvent('showToast', {
            detail: { message: 'Error deleting link', type: 'error' }
          })
          window.dispatchEvent(event)
        } finally {
          setIsLoading(false)
          setConfirmDialog({ show: false, title: '', message: '', onConfirm: null })
        }
      }
    })
  }

  const handleBulkDelete = async () => {
    if (selectedLinks.length === 0) {
      const event = new CustomEvent('showToast', {
        detail: { message: 'No links selected', type: 'error' }
      })
      window.dispatchEvent(event)
      return
    }

    setConfirmDialog({
      show: true,
      title: 'Delete Multiple Links',
      message: `Are you sure you want to delete ${selectedLinks.length} selected link${selectedLinks.length > 1 ? 's' : ''}? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          setIsLoading(true)
          await apiService.bulkDeleteLinks(selectedLinks)
          const event = new CustomEvent('showToast', {
            detail: { message: `${selectedLinks.length} links deleted successfully!`, type: 'success' }
          })
          window.dispatchEvent(event)
          setSelectedLinks([])
          setSelectAll(false)
          loadLinks()
          loadDashboardData()
        } catch (error) {
          console.error('Error deleting links:', error)
          const event = new CustomEvent('showToast', {
            detail: { message: 'Error deleting links', type: 'error' }
          })
          window.dispatchEvent(event)
        } finally {
          setIsLoading(false)
          setConfirmDialog({ show: false, title: '', message: '', onConfirm: null })
        }
      }
    })
  }

  const handleBulkMoveCategory = async (targetCategory) => {
    if (selectedLinks.length === 0) {
      const event = new CustomEvent('showToast', {
        detail: { message: 'No links selected', type: 'error' }
      })
      window.dispatchEvent(event)
      return
    }

    const categoryName = availableCategories.find(c => c.slug === targetCategory)?.name
    
    try {
      setIsLoading(true)
      await apiService.moveLinkCategory(selectedLinks, targetCategory)
      const event = new CustomEvent('showToast', {
        detail: { message: `${selectedLinks.length} links moved to ${categoryName}!`, type: 'success' }
      })
      window.dispatchEvent(event)
      setSelectedLinks([])
      setSelectAll(false)
      loadLinks()
      loadDashboardData()
    } catch (error) {
      console.error('Error moving links:', error)
      const event = new CustomEvent('showToast', {
        detail: { message: 'Error moving links', type: 'error' }
      })
      window.dispatchEvent(event)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveDuplicates = async () => {
    setConfirmDialog({
      show: true,
      title: 'Remove Duplicate Links',
      message: 'This will scan your database and remove all duplicate links, keeping only the oldest version of each. This action cannot be undone. Continue?',
      onConfirm: async () => {
        try {
          setIsLoading(true)
          const result = await apiService.removeDuplicateLinks()
          const event = new CustomEvent('showToast', {
            detail: { 
              message: result.removedCount > 0 
                ? `Removed ${result.removedCount} duplicate links!` 
                : 'No duplicates found',
              type: 'success' 
            }
          })
          window.dispatchEvent(event)
          loadLinks()
          loadDashboardData()
        } catch (error) {
          console.error('Error removing duplicates:', error)
          const event = new CustomEvent('showToast', {
            detail: { message: 'Error removing duplicates', type: 'error' }
          })
          window.dispatchEvent(event)
        } finally {
          setIsLoading(false)
          setConfirmDialog({ show: false, title: '', message: '', onConfirm: null })
        }
      }
    })
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedLinks([])
    } else {
      setSelectedLinks(links.map(link => link._id))
    }
    setSelectAll(!selectAll)
  }

  const handleSelectLink = (linkId) => {
    if (selectedLinks.includes(linkId)) {
      setSelectedLinks(selectedLinks.filter(id => id !== linkId))
    } else {
      setSelectedLinks([...selectedLinks, linkId])
    }
  }

  const handleBulkUpload = async () => {
    if (!bulkData.trim()) {
      const event = new CustomEvent('showToast', {
        detail: { message: 'Please enter link data', type: 'error' }
      })
      window.dispatchEvent(event)
      return
    }

    try {
      setIsLoading(true)
      let linksData
      
      try {
        linksData = JSON.parse(bulkData)
      } catch (parseError) {
        throw new Error('Invalid JSON format. Please check your data.')
      }
      
      if (!Array.isArray(linksData)) {
        throw new Error('Data must be an array of links')
      }
      
      if (linksData.length === 0) {
        throw new Error('No links found in the data')
      }

      const response = await apiService.bulkCreateLinks(linksData)
      
      setShowBulkUpload(false)
      setBulkData('')
      loadLinks()
      loadDashboardData()
      
      const event = new CustomEvent('showToast', {
        detail: { 
          message: `Successfully uploaded ${response.created || linksData.length} links!`, 
          type: 'success' 
        }
      })
      window.dispatchEvent(event)
    } catch (error) {
      console.error('Error uploading links:', error)
      const event = new CustomEvent('showToast', {
        detail: { 
          message: error.message || 'Error uploading links. Please check your data format.', 
          type: 'error' 
        }
      })
      window.dispatchEvent(event)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      url: '',
      description: '',
      category: availableCategories.length > 0 ? availableCategories[0].slug : '',
      tags: '',
      publishedDate: new Date().toISOString().split('T')[0],
      isFeatured: false,
      isPromoted: false
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditingLink(null)
    setShowBulkUpload(false)
    resetForm()
  }

  // Login Form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-vintage-cream dark:bg-dark-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-8"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-br from-vintage-gold to-vintage-brass rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow"
            >
              <Settings className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-3xl font-vintage font-bold text-vintage-black dark:text-dark-text">
              Admin Portal
            </h2>
            <p className="mt-2 text-vintage-brown dark:text-dark-muted font-serif">
              Enter your credentials to access the dashboard
            </p>
          </div>
          <motion.form 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 space-y-6" 
            onSubmit={handleLogin}
          >
            <div>
              <label htmlFor="password" className="block text-sm font-serif font-medium text-vintage-brown dark:text-dark-muted mb-2">
                Admin Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-vintage-gold/30 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-vintage-gold focus:border-transparent bg-vintage-paper dark:bg-dark-card text-vintage-black dark:text-dark-text"
                  placeholder="Enter admin password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-vintage-brown dark:text-dark-muted hover:text-vintage-gold dark:hover:text-dark-accent transition-colors"
                >
                  {showPassword ? <Eye size={20} /> : <Eye size={20} className="opacity-60" />}
                </button>
              </div>
            </div>
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-vintage-gold to-vintage-brass text-white py-3 px-4 rounded-lg font-serif font-medium hover:from-vintage-brass hover:to-vintage-gold transition-all duration-300 disabled:opacity-50 shadow-glow"
            >
              {isLoading ? 'Authenticating...' : 'Access Dashboard'}
            </motion.button>
          </motion.form>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-vintage-cream dark:bg-dark-bg">
      {/* Header */}
      <header className="bg-vintage-paper dark:bg-dark-card shadow border-b border-vintage-gold/20 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-vintage font-bold text-vintage-black dark:text-dark-text">
                Admin Dashboard
              </h1>
              <p className="text-vintage-brown dark:text-dark-muted font-serif">
                Manage your LinkShala collection
              </p>
            </div>
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-vintage-red text-white px-6 py-2 rounded-lg hover:bg-vintage-red/80 transition-colors font-serif shadow-md"
            >
              Logout
            </motion.button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="bg-vintage-paper dark:bg-dark-card rounded-2xl shadow-vault p-2 mb-8 border border-vintage-gold/20 dark:border-dark-border">
          <div className="flex space-x-2">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'links', name: 'Links', icon: LinkIcon },
              { id: 'categories', name: 'Categories', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-serif font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-vintage-gold to-vintage-brass text-white shadow-md'
                      : 'text-vintage-brown dark:text-dark-muted hover:bg-vintage-gold/10 dark:hover:bg-dark-accent/10'
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.name}</span>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Overview Tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'Total Links', value: stats.totalLinks || 0, icon: LinkIcon, color: 'from-blue-500 to-blue-600' },
                  { label: 'Total Clicks', value: stats.totalClicks || 0, icon: Eye, color: 'from-green-500 to-green-600' },
                  { label: 'Total Shares', value: stats.totalShares || 0, icon: Share2, color: 'from-purple-500 to-purple-600' },
                  { label: 'Active Links', value: stats.activeLinks || 0, icon: TrendingUp, color: 'from-orange-500 to-orange-600' }
                ].map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-vintage-paper dark:bg-dark-card rounded-2xl p-6 shadow-vault border border-vintage-gold/20 dark:border-dark-border"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-serif font-medium text-vintage-brown dark:text-dark-muted">
                            {stat.label}
                          </p>
                          <p className="text-3xl font-vintage font-bold text-vintage-black dark:text-dark-text mt-2">
                            {stat.value.toLocaleString()}
                          </p>
                        </div>
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-md`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
              
              {/* Top Links */}
              <div className="bg-vintage-paper dark:bg-dark-card rounded-2xl p-6 shadow-vault border border-vintage-gold/20 dark:border-dark-border">
                <h3 className="text-xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-6">
                  Top Performing Links
                </h3>
                {stats.topLinks && stats.topLinks.length > 0 ? (
                  <div className="space-y-4">
                    {stats.topLinks.map((link, index) => (
                      <motion.div
                        key={link._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-vintage-cream dark:bg-dark-bg rounded-xl border border-vintage-gold/10 dark:border-dark-border"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-vintage-gold to-vintage-brass text-white rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-serif font-semibold text-vintage-black dark:text-dark-text">
                              {link.title}
                            </h4>
                            <p className="text-sm text-vintage-brown dark:text-dark-muted truncate max-w-md">
                              {link.url}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6 text-sm text-vintage-brown dark:text-dark-muted">
                          <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4 text-vintage-gold" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                            </svg>
                            <span className="font-medium">{link.clickCount.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Share2 size={16} />
                            <span className="font-medium">{link.shareCount.toLocaleString()}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-vintage-brown dark:text-dark-muted font-serif">No data available</p>
                )}
              </div>
            </motion.div>
          )}

          {/* Links Tab */}
          {activeTab === 'links' && (
            <motion.div
              key="links"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Action Buttons */}
              <div className="bg-vintage-paper dark:bg-dark-card rounded-2xl p-6 mb-8 shadow-vault border border-vintage-gold/20 dark:border-dark-border">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                  <div>
                    <h2 className="text-xl font-vintage font-bold text-vintage-black dark:text-dark-text">
                      Link Management
                    </h2>
                    <p className="text-vintage-brown dark:text-dark-muted font-serif">
                      Add, edit, or remove links from your collection
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <motion.button
                      onClick={handleRemoveDuplicates}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 font-serif shadow-md"
                    >
                      <Trash2 size={18} />
                      <span>Remove Duplicates</span>
                    </motion.button>
                    <motion.button
                      onClick={() => setShowBulkUpload(!showBulkUpload)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-serif shadow-md"
                    >
                      <Upload size={18} />
                      <span>Bulk Upload</span>
                    </motion.button>
                    <motion.button
                      onClick={() => setIsEditing(true)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-vintage-gold text-white px-4 py-2 rounded-lg hover:bg-vintage-brass transition-colors flex items-center space-x-2 font-serif shadow-md"
                    >
                      <Plus size={18} />
                      <span>Add Link</span>
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Bulk Upload Form */}
              {showBulkUpload && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-vintage-paper dark:bg-dark-card rounded-2xl p-6 mb-8 shadow-vault border border-vintage-gold/20 dark:border-dark-border"
                >
                  <h3 className="text-lg font-vintage font-bold text-vintage-black dark:text-dark-text mb-4">Bulk Upload Links</h3>
                  <textarea
                    value={bulkData}
                    onChange={(e) => setBulkData(e.target.value)}
                    placeholder='[
  {
    "title": "React Documentation",
    "url": "https://react.dev",
    "description": "Official React documentation",
    "category": "tools",
    "tags": ["react", "documentation"]
  },
  {
    "title": "Tailwind CSS",
    "url": "https://tailwindcss.com",
    "description": "Utility-first CSS framework",
    "category": "tools",
    "tags": ["css", "framework"]
  }
]'
                    rows="12"
                    className="w-full p-4 border border-vintage-gold/30 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-vintage-gold bg-vintage-cream dark:bg-dark-bg text-vintage-black dark:text-dark-text font-mono text-sm"
                  />
                  <div className="flex space-x-3 mt-4">
                    <button
                      onClick={handleBulkUpload}
                      disabled={isLoading}
                      className="bg-vintage-gold text-white px-6 py-2 rounded-lg hover:bg-vintage-brass transition-colors disabled:opacity-50 font-serif"
                    >
                      {isLoading ? 'Uploading...' : 'Upload'}
                    </button>
                    <button
                      onClick={() => setShowBulkUpload(false)}
                      className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors font-serif"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Add/Edit Form */}
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-vintage-paper dark:bg-dark-card rounded-2xl p-6 mb-8 shadow-vault border border-vintage-gold/20 dark:border-dark-border"
                >
                  <h3 className="text-lg font-vintage font-bold text-vintage-black dark:text-dark-text mb-4">
                    {editingLink ? 'Edit Link' : 'Add New Link'}
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Title *"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="p-3 border border-vintage-gold/30 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-vintage-gold bg-vintage-cream dark:bg-dark-bg text-vintage-black dark:text-dark-text"
                      />
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="URL * (e.g., example.com or https://example.com)"
                          value={formData.url}
                          onChange={(e) => setFormData({...formData, url: e.target.value})}
                          className="w-full p-3 border border-vintage-gold/30 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-vintage-gold bg-vintage-cream dark:bg-dark-bg text-vintage-black dark:text-dark-text"
                        />
                        {formData.url && (
                          <p className="text-xs text-vintage-brown dark:text-dark-muted font-serif">
                            Will be saved as: <span className="font-medium">{normalizeUrl(formData.url)}</span>
                          </p>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          list="categories"
                          placeholder="Category * (type or select)"
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="w-full p-3 border border-vintage-gold/30 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-vintage-gold bg-vintage-cream dark:bg-dark-bg text-vintage-black dark:text-dark-text"
                        />
                        <datalist id="categories">
                          {availableCategories.map(category => (
                            <option key={category._id} value={category.slug}>
                              {category.name}
                            </option>
                          ))}
                        </datalist>
                      </div>
                      <input
                        type="date"
                        value={formData.publishedDate}
                        onChange={(e) => setFormData({...formData, publishedDate: e.target.value})}
                        className="p-3 border border-vintage-gold/30 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-vintage-gold bg-vintage-cream dark:bg-dark-bg text-vintage-black dark:text-dark-text"
                        title="Published Date"
                      />
                      <input
                        type="text"
                        placeholder="Tags (comma separated)"
                        value={formData.tags}
                        onChange={(e) => setFormData({...formData, tags: e.target.value})}
                        className="p-3 border border-vintage-gold/30 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-vintage-gold bg-vintage-cream dark:bg-dark-bg text-vintage-black dark:text-dark-text"
                      />
                    </div>
                    <textarea
                      placeholder="Description (optional - AI will generate if empty)"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows="3"
                      className="w-full p-3 border border-vintage-gold/30 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-vintage-gold bg-vintage-cream dark:bg-dark-bg text-vintage-black dark:text-dark-text resize-none"
                    />
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-4 bg-vintage-gold/5 dark:bg-dark-accent/5 rounded-lg border border-vintage-gold/20 dark:border-dark-accent/20">
                        <input
                          type="checkbox"
                          id="isFeatured"
                          checked={formData.isFeatured}
                          onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                          className="w-5 h-5 rounded border-vintage-gold/30 text-vintage-gold focus:ring-vintage-gold cursor-pointer"
                        />
                        <label htmlFor="isFeatured" className="flex items-center space-x-2 cursor-pointer text-vintage-black dark:text-dark-text font-serif">
                          <span className="text-2xl">🔥</span>
                          <span className="font-medium">Mark as Featured (Fire Badge)</span>
                        </label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <input
                          type="checkbox"
                          id="isPromoted"
                          checked={formData.isPromoted}
                          onChange={(e) => setFormData({...formData, isPromoted: e.target.checked})}
                          className="w-5 h-5 rounded border-blue-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                        />
                        <label htmlFor="isPromoted" className="flex items-center space-x-2 cursor-pointer text-vintage-black dark:text-dark-text font-serif">
                          <span className="text-2xl">📢</span>
                          <span className="font-medium">Promote in Hero Section (Only 1 link will show)</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3 mt-4">
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="bg-vintage-gold text-white px-6 py-2 rounded-lg hover:bg-vintage-brass transition-colors disabled:opacity-50 font-serif flex items-center space-x-2"
                    >
                      <Save size={16} />
                      <span>{isLoading ? 'Saving...' : 'Save'}</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors font-serif flex items-center space-x-2"
                    >
                      <X size={16} />
                      <span>Cancel</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Search and Bulk Actions */}
              <div className="bg-vintage-paper dark:bg-dark-card rounded-2xl p-6 mb-8 shadow-vault border border-vintage-gold/20 dark:border-dark-border">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-vintage-brown dark:text-dark-muted" size={20} />
                      <input
                        type="text"
                        placeholder="Search links..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-vintage-gold/30 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-vintage-gold bg-vintage-cream dark:bg-dark-bg text-vintage-black dark:text-dark-text"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Filter size={18} className="text-vintage-brown dark:text-dark-muted" />
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-4 py-3 border border-vintage-gold/30 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-vintage-gold bg-vintage-cream dark:bg-dark-bg text-vintage-black dark:text-dark-text font-serif"
                      >
                        <option value="all">All Categories</option>
                        {availableCategories.map(category => (
                          <option key={category._id} value={category.slug}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {selectedLinks.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-4 bg-vintage-gold/10 dark:bg-dark-accent/10 rounded-lg border border-vintage-gold/20 dark:border-dark-accent/20 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm font-serif text-vintage-brown dark:text-dark-muted">
                            {selectedLinks.length} link{selectedLinks.length > 1 ? 's' : ''} selected
                          </span>
                          <button
                            onClick={() => {
                              setSelectedLinks([])
                              setSelectAll(false)
                            }}
                            className="text-xs text-vintage-gold hover:text-vintage-brass transition-colors font-serif underline"
                          >
                            Clear selection
                          </button>
                        </div>
                        <motion.button
                          onClick={handleBulkDelete}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 font-serif text-sm"
                        >
                          <Trash2 size={16} />
                          <span>Delete Selected</span>
                        </motion.button>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-serif text-vintage-brown dark:text-dark-muted">Move to:</span>
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              handleBulkMoveCategory(e.target.value)
                              e.target.value = ''
                            }
                          }}
                          className="px-4 py-2 border border-vintage-gold/30 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-vintage-gold bg-vintage-cream dark:bg-dark-bg text-vintage-black dark:text-dark-text font-serif text-sm"
                        >
                          <option value="">Select category...</option>
                          {availableCategories.map(category => (
                            <option key={category._id} value={category.slug}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Links Table */}
              <div className="bg-vintage-paper dark:bg-dark-card rounded-2xl shadow-vault border border-vintage-gold/20 dark:border-dark-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-vintage-gold/10 dark:bg-dark-accent/10">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-serif font-medium text-vintage-brown dark:text-dark-muted">
                          <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAll}
                            className="rounded border-vintage-gold/30 text-vintage-gold focus:ring-vintage-gold"
                          />
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-serif font-medium text-vintage-brown dark:text-dark-muted">Title</th>
                        <th className="px-6 py-4 text-left text-sm font-serif font-medium text-vintage-brown dark:text-dark-muted">Category</th>
                        <th className="px-6 py-4 text-left text-sm font-serif font-medium text-vintage-brown dark:text-dark-muted">Stats</th>
                        <th className="px-6 py-4 text-left text-sm font-serif font-medium text-vintage-brown dark:text-dark-muted">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-vintage-gold/10 dark:divide-dark-border">
                      {links.map((link) => (
                        <tr key={link._id} className={`hover:bg-vintage-cream/50 dark:hover:bg-dark-bg/50 transition-colors ${
                          selectedLinks.includes(link._id) ? 'bg-vintage-gold/10 dark:bg-dark-accent/10' : ''
                        }`}>
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedLinks.includes(link._id)}
                              onChange={() => handleSelectLink(link._id)}
                              className="rounded border-vintage-gold/30 text-vintage-gold focus:ring-vintage-gold"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-serif font-medium text-vintage-black dark:text-dark-text flex items-center space-x-2">
                                <span>{link.title}</span>
                                {link.isFeatured && <span className="text-xl">🔥</span>}
                              </div>
                              <div className="text-sm text-vintage-brown dark:text-dark-muted truncate max-w-xs">{link.url}</div>
                              <div className="text-xs text-vintage-brown/60 dark:text-dark-muted/60 mt-1 flex items-center space-x-1">
                                <Calendar size={12} />
                                <span>{new Date(link.publishedDate || link.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-vintage-gold/10 dark:bg-dark-accent/10 text-vintage-brown dark:text-dark-accent text-xs rounded-full capitalize">
                              {link.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-vintage-brown dark:text-dark-muted">
                            <div className="flex space-x-4">
                              <span>👁 {link.clickCount || 0}</span>
                              <span>📤 {link.shareCount || 0}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <motion.button
                                onClick={() => handleEdit(link)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                title="Edit link"
                              >
                                <Edit size={16} />
                              </motion.button>
                              <motion.button
                                onClick={() => handleDelete(link._id)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                title="Delete link"
                              >
                                <Trash2 size={16} />
                              </motion.button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-vintage-gold/10 dark:border-dark-border">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-vintage-brown dark:text-dark-muted font-serif">
                        Page {currentPage} of {totalPages}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-1 bg-vintage-gold/10 dark:bg-dark-accent/10 text-vintage-brown dark:text-dark-accent rounded disabled:opacity-50 font-serif"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1 bg-vintage-gold/10 dark:bg-dark-accent/10 text-vintage-brown dark:text-dark-accent rounded disabled:opacity-50 font-serif"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <CategoryManager />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmDialog.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setConfirmDialog({ show: false, title: '', message: '', onConfirm: null })}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-vintage-paper dark:bg-dark-card rounded-2xl p-6 max-w-md w-full shadow-2xl border border-vintage-gold/20 dark:border-dark-border"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-2">
                    {confirmDialog.title}
                  </h3>
                  <p className="text-vintage-brown dark:text-dark-muted font-serif">
                    {confirmDialog.message}
                  </p>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <motion.button
                  onClick={() => setConfirmDialog({ show: false, title: '', message: '', onConfirm: null })}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-vintage-black dark:text-dark-text px-4 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-serif font-medium"
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={confirmDialog.onConfirm}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors font-serif font-medium shadow-md"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminDashboard