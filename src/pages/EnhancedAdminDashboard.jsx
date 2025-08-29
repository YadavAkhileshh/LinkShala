import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Edit, Trash2, Save, X, Upload, FileText, 
  BarChart3, Users, Link as LinkIcon, TrendingUp,
  Eye, Share2, Calendar, Search, Filter, Settings
} from 'lucide-react'
import apiService from '../lib/api'
import CategoryManager from '../components/CategoryManager'

const EnhancedAdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [links, setLinks] = useState([])
  const [stats, setStats] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  
  // Form states
  const [isEditing, setIsEditing] = useState(false)
  const [editingLink, setEditingLink] = useState(null)
  const [showBulkUpload, setShowBulkUpload] = useState(false)
  const [bulkData, setBulkData] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    category: 'tools',
    tags: ''
  })

  useEffect(() => {
    if (apiService.isAuthenticated()) {
      setIsAuthenticated(true)
      loadDashboardData()
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated && activeTab === 'links') {
      loadLinks()
    }
  }, [currentPage, searchTerm, isAuthenticated, activeTab])

  const handleLogin = async (e) => {
    e.preventDefault()
    
    // Password validation
    if (password.length < 8) {
      const event = new CustomEvent('showToast', {
        detail: { message: 'Password must be at least 8 characters', type: 'error' }
      })
      window.dispatchEvent(event)
      return
    }
    
    try {
      setIsLoading(true)
      await apiService.adminLogin(password)
      setIsAuthenticated(true)
      setPassword('')
      loadDashboardData()
      
      const event = new CustomEvent('showToast', {
        detail: { message: 'Welcome to admin dashboard!', type: 'success' }
      })
      window.dispatchEvent(event)
    } catch (error) {
      const event = new CustomEvent('showToast', {
        detail: { message: 'Invalid password. Please try again.', type: 'error' }
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
      const [statsData, linksData] = await Promise.all([
        apiService.getAdminStats(),
        apiService.getAdminLinks({ page: 1, limit: 20 })
      ])
      
      setStats(statsData)
      setLinks(linksData.links)
      setTotalPages(linksData.totalPages)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }

  const loadLinks = async () => {
    try {
      setIsLoading(true)
      const params = { page: currentPage, limit: 20 }
      if (searchTerm) params.search = searchTerm
      
      const data = await apiService.getAdminLinks(params)
      setLinks(data.links)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Error loading links:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (link) => {
    setEditingLink(link)
    setFormData({
      title: link.title,
      url: link.url,
      category: link.category,
      tags: Array.isArray(link.tags) ? link.tags.join(', ') : link.tags || ''
    })
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!formData.title || !formData.url) {
      alert('Please fill in required fields')
      return
    }

    try {
      setIsLoading(true)
      const linkData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      }
      
      if (editingLink) {
        await apiService.updateLink(editingLink._id, linkData)
      } else {
        await apiService.createLink(linkData)
      }
      
      setIsEditing(false)
      setEditingLink(null)
      resetForm()
      loadLinks()
      loadDashboardData()
    } catch (error) {
      console.error('Error saving link:', error)
      alert('Error saving link. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this link?')) {
      try {
        setIsLoading(true)
        await apiService.deleteLink(id)
        loadLinks()
        loadDashboardData()
      } catch (error) {
        console.error('Error deleting link:', error)
        alert('Error deleting link')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleBulkUpload = async () => {
    if (!bulkData.trim()) {
      alert('Please enter link data')
      return
    }

    try {
      setIsLoading(true)
      const linksData = JSON.parse(bulkData)
      
      if (!Array.isArray(linksData)) {
        throw new Error('Data must be an array of links')
      }

      await apiService.bulkCreateLinks(linksData)
      
      setShowBulkUpload(false)
      setBulkData('')
      loadLinks()
      loadDashboardData()
      alert('Links uploaded successfully!')
    } catch (error) {
      console.error('Error uploading links:', error)
      alert('Error uploading links. Please check your data format.')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      url: '',
      category: 'tools',
      tags: ''
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
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-vintage-gold/30 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-vintage-gold focus:border-transparent bg-vintage-paper dark:bg-dark-card text-vintage-black dark:text-dark-text"
                placeholder="Enter admin password"
              />
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
                      onClick={() => setShowBulkUpload(!showBulkUpload)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-serif"
                    >
                      <Upload size={18} />
                      <span>Bulk Upload</span>
                    </motion.button>
                    <motion.button
                      onClick={() => setIsEditing(true)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-vintage-gold text-white px-4 py-2 rounded-lg hover:bg-vintage-brass transition-colors flex items-center space-x-2 font-serif"
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
                    placeholder='[{"title": "Example", "url": "https://example.com", "category": "tools", "tags": ["tag1", "tag2"]}]'
                    rows="8"
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Title *"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="p-3 border border-vintage-gold/30 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-vintage-gold bg-vintage-cream dark:bg-dark-bg text-vintage-black dark:text-dark-text"
                    />
                    <input
                      type="url"
                      placeholder="URL *"
                      value={formData.url}
                      onChange={(e) => setFormData({...formData, url: e.target.value})}
                      className="p-3 border border-vintage-gold/30 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-vintage-gold bg-vintage-cream dark:bg-dark-bg text-vintage-black dark:text-dark-text"
                    />
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="p-3 border border-vintage-gold/30 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-vintage-gold bg-vintage-cream dark:bg-dark-bg text-vintage-black dark:text-dark-text"
                    >
                      <option value="tools">Tools</option>
                      <option value="ui-libraries">UI Libraries</option>
                      <option value="backgrounds">Backgrounds</option>
                      <option value="icons">Icons</option>
                      <option value="learning">Learning</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Tags (comma separated)"
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      className="p-3 border border-vintage-gold/30 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-vintage-gold bg-vintage-cream dark:bg-dark-bg text-vintage-black dark:text-dark-text"
                    />
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

              {/* Search */}
              <div className="bg-vintage-paper dark:bg-dark-card rounded-2xl p-6 mb-8 shadow-vault border border-vintage-gold/20 dark:border-dark-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-vintage-brown dark:text-dark-muted" size={20} />
                  <input
                    type="text"
                    placeholder="Search links..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-vintage-gold/30 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-vintage-gold bg-vintage-cream dark:bg-dark-bg text-vintage-black dark:text-dark-text"
                  />
                </div>
              </div>

              {/* Links Table */}
              <div className="bg-vintage-paper dark:bg-dark-card rounded-2xl shadow-vault border border-vintage-gold/20 dark:border-dark-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-vintage-gold/10 dark:bg-dark-accent/10">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-serif font-medium text-vintage-brown dark:text-dark-muted">Title</th>
                        <th className="px-6 py-4 text-left text-sm font-serif font-medium text-vintage-brown dark:text-dark-muted">Category</th>
                        <th className="px-6 py-4 text-left text-sm font-serif font-medium text-vintage-brown dark:text-dark-muted">Stats</th>
                        <th className="px-6 py-4 text-left text-sm font-serif font-medium text-vintage-brown dark:text-dark-muted">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-vintage-gold/10 dark:divide-dark-border">
                      {links.map((link) => (
                        <tr key={link._id} className="hover:bg-vintage-cream/50 dark:hover:bg-dark-bg/50 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-serif font-medium text-vintage-black dark:text-dark-text">{link.title}</div>
                              <div className="text-sm text-vintage-brown dark:text-dark-muted truncate max-w-xs">{link.url}</div>
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
                              <button
                                onClick={() => handleEdit(link)}
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(link._id)}
                                className="text-red-600 hover:text-red-800 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
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
    </div>
  )
}

export default EnhancedAdminDashboard