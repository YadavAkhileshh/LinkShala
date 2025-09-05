import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Palette, Code, Image, BookOpen, Wrench, Grid } from 'lucide-react'
import apiService from '../lib/api'

const CategorySelector = ({ selectedCategory, onCategoryChange }) => {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const iconMap = {
    'ui-libraries': Code,
    'backgrounds': Image,
    'icons': Palette,
    'learning': BookOpen,
    'tools': Wrench,
    'design': Palette,
    'development': Code,
    'resources': Grid,
    'default': Grid
  }

  const colorMap = {
    'ui-libraries': 'from-blue-500 to-cyan-500',
    'backgrounds': 'from-green-500 to-emerald-500',
    'icons': 'from-yellow-500 to-orange-500',
    'learning': 'from-red-500 to-rose-500',
    'tools': 'from-indigo-500 to-purple-500',
    'design': 'from-pink-500 to-rose-500',
    'development': 'from-teal-500 to-cyan-500',
    'resources': 'from-orange-500 to-amber-500',
    'default': 'from-gray-500 to-gray-600'
  }

  useEffect(() => {
    loadCategories()
    
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
      setIsLoading(true)
      const data = await apiService.getCategories()
      
      // Add "All Categories" option
      const allCategories = [
        { 
          id: 'all', 
          name: 'All Categories', 
          slug: 'all',
          linkCount: data.reduce((sum, cat) => sum + (cat.linkCount || 0), 0),
          icon: Palette,
          color: 'from-purple-500 to-pink-500'
        },
        ...data.map(cat => ({
          id: cat._id,
          name: cat.name,
          slug: cat.slug,
          linkCount: cat.linkCount || 0,
          icon: iconMap[cat.slug] || iconMap.default,
          color: colorMap[cat.slug] || colorMap.default
        }))
      ]
      
      setCategories(allCategories)
    } catch (error) {
      console.error('Error loading categories:', error)
      // Fallback to default categories if API fails
      setCategories([
        { 
          id: 'all', 
          name: 'All Categories', 
          slug: 'all',
          linkCount: 0,
          icon: Palette,
          color: 'from-purple-500 to-pink-500'
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-vintage-gold/20 dark:bg-dark-accent/20 rounded-2xl p-6 h-32"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((category, index) => {
        const Icon = category.icon
        const isSelected = selectedCategory === category.slug
        
        return (
          <motion.button
            key={category.id}
            onClick={() => onCategoryChange(category.slug)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative group p-6 rounded-2xl border transition-all duration-300 ${
              isSelected
                ? 'bg-vintage-gold text-white border-vintage-gold shadow-glow'
                : 'bg-vintage-paper dark:bg-dark-card border-vintage-gold/20 dark:border-dark-border hover:border-vintage-gold/40 dark:hover:border-dark-accent/40'
            }`}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
            
            {/* Icon */}
            <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center transition-all duration-300 ${
              isSelected 
                ? 'bg-white/20' 
                : `bg-gradient-to-br ${category.color} text-white group-hover:scale-110`
            }`}>
              <Icon size={24} className={isSelected ? 'text-white' : ''} />
            </div>
            
            {/* Content */}
            <div className="text-center">
              <h3 className={`font-serif font-semibold mb-1 transition-colors ${
                isSelected 
                  ? 'text-white' 
                  : 'text-vintage-black dark:text-dark-text group-hover:text-vintage-gold dark:group-hover:text-dark-accent'
              }`}>
                {category.name}
              </h3>
              <p className={`text-sm transition-colors ${
                isSelected 
                  ? 'text-white/80' 
                  : 'text-vintage-brown dark:text-dark-muted'
              }`}>
                {category.linkCount} links
              </p>
            </div>
            
            {/* Selection Indicator */}
            {isSelected && (
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-vintage-gold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}

export default CategorySelector