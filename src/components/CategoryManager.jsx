import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Save, X } from 'lucide-react'
import apiService from '../lib/api'

const CategoryManager = () => {
  const [categories, setCategories] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [newCategoryName, setNewCategoryName] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setIsLoading(true)
      const data = await apiService.getCategories()
      setCategories(data)
    } catch (error) {
      showToast('Error loading categories', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const showToast = (message, type) => {
    const event = new CustomEvent('showToast', {
      detail: { message, type }
    })
    window.dispatchEvent(event)
  }

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      showToast('Please enter a category name', 'error')
      return
    }
    
    try {
      setIsLoading(true)
      await apiService.createCategory({ name: newCategoryName })
      
      showToast(`Category "${newCategoryName}" added successfully!`, 'success')
      setNewCategoryName('')
      setIsEditing(false)
      loadCategories()
      
      // Trigger category refresh for other components
      window.dispatchEvent(new CustomEvent('categoriesUpdated'))
    } catch (error) {
      showToast(error.message || 'Error adding category', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCategory = async (categoryId, categoryName) => {
    if (confirm(`Are you sure you want to delete the "${categoryName}" category?`)) {
      try {
        setIsLoading(true)
        await apiService.deleteCategory(categoryId)
        showToast(`Category "${categoryName}" deleted successfully!`, 'success')
        loadCategories()
        
        // Trigger category refresh for other components
        window.dispatchEvent(new CustomEvent('categoriesUpdated'))
      } catch (error) {
        showToast(error.message || 'Error deleting category', 'error')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleEditCategory = (category) => {
    setEditingCategory(category)
    setNewCategoryName(category.name)
    setIsEditing(true)
  }

  const handleUpdateCategory = async () => {
    if (!newCategoryName.trim()) {
      showToast('Please enter a category name', 'error')
      return
    }
    
    try {
      setIsLoading(true)
      await apiService.updateCategory(editingCategory._id, { name: newCategoryName })
      
      showToast(`Category updated to "${newCategoryName}"!`, 'success')
      setIsEditing(false)
      setEditingCategory(null)
      setNewCategoryName('')
      loadCategories()
      
      // Trigger category refresh for other components
      window.dispatchEvent(new CustomEvent('categoriesUpdated'))
    } catch (error) {
      showToast(error.message || 'Error updating category', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditingCategory(null)
    setNewCategoryName('')
  }

  return (
    <div className="bg-vintage-paper dark:bg-dark-card rounded-2xl p-6 shadow-vault border border-vintage-gold/20 dark:border-dark-border">
      <h3 className="text-xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-6">
        Category Management
      </h3>
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vintage-gold mx-auto"></div>
          <p className="text-vintage-brown dark:text-dark-muted mt-2">Loading categories...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((category) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-4 bg-vintage-cream dark:bg-dark-bg rounded-lg border border-vintage-gold/10 dark:border-dark-border"
            >
              <div>
                <h4 className="font-serif font-semibold text-vintage-black dark:text-dark-text capitalize">
                  {category.name}
                </h4>
                <p className="text-sm text-vintage-brown dark:text-dark-muted">
                  {category.linkCount || 0} links
                </p>
              </div>
            
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleDeleteCategory(category._id, category.name)}
                  disabled={isLoading}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {/* Add/Edit Category Form */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-6 p-4 bg-vintage-cream dark:bg-dark-bg rounded-lg border border-vintage-gold/20 dark:border-dark-border"
        >
          <h4 className="font-serif font-semibold text-vintage-black dark:text-dark-text mb-3">
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </h4>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Category name *"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full p-3 border border-vintage-gold/30 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-vintage-gold bg-vintage-paper dark:bg-dark-card text-vintage-black dark:text-dark-text"
              onKeyPress={(e) => e.key === 'Enter' && (editingCategory ? handleUpdateCategory() : handleAddCategory())}
            />
            <div className="flex space-x-3">
              <button
                onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
                disabled={isLoading}
                className="bg-vintage-gold text-white px-4 py-3 rounded-lg hover:bg-vintage-brass transition-colors flex items-center space-x-2 font-serif disabled:opacity-50"
              >
                <Save size={16} />
                <span>{isLoading ? 'Saving...' : (editingCategory ? 'Update' : 'Add')}</span>
              </button>
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2 font-serif disabled:opacity-50"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
      
      {!isEditing && (
        <motion.button
          onClick={() => setIsEditing(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-6 w-full bg-vintage-gold text-white py-3 px-4 rounded-lg hover:bg-vintage-brass transition-colors flex items-center justify-center space-x-2 font-serif"
        >
          <Plus size={18} />
          <span>Add Category</span>
        </motion.button>
      )}
    </div>
  )
}

export default CategoryManager