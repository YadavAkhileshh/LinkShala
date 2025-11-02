import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Palette, Code, Image, BookOpen, Wrench, Grid, 
  Smartphone, Monitor, Database, Cloud, Shield, 
  Zap, Cpu, Globe, Layers, Package, Briefcase,
  Camera, Music, Video, Gamepad2, Heart, Star,
  Rocket, Target, Trophy, Gift, Coffee, Lightbulb
} from 'lucide-react'
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
    'design': Lightbulb,
    'development': Cpu,
    'resources': Grid,
    'frameworks': Layers,
    'mobile': Smartphone,
    'web': Globe,
    'database': Database,
    'cloud': Cloud,
    'security': Shield,
    'performance': Zap,
    'productivity': Briefcase,
    'media': Camera,
    'music': Music,
    'video': Video,
    'games': Gamepad2,
    'health': Heart,
    'favorites': Star,
    'startup': Rocket,
    'marketing': Target,
    'awards': Trophy,
    'freebies': Gift,
    'lifestyle': Coffee,
    'default': Grid
  }

  // Random icon pool for new categories
  const randomIcons = [
    Monitor, Package, Camera, Music, Video, Gamepad2, 
    Heart, Star, Rocket, Target, Trophy, Gift, Coffee, 
    Lightbulb, Smartphone, Database, Cloud, Shield, Zap, 
    Cpu, Globe, Layers, Briefcase
  ]

  // Function to get random icon for unknown categories
  const getRandomIcon = (slug) => {
    const hash = slug.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    return randomIcons[Math.abs(hash) % randomIcons.length]
  }

  const colorMap = {
    'ui-libraries': 'from-blue-500 to-cyan-500',
    'backgrounds': 'from-green-500 to-emerald-500',
    'icons': 'from-yellow-500 to-orange-500',
    'learning': 'from-red-500 to-rose-500',
    'tools': 'from-indigo-500 to-purple-500',
    'design': 'from-pink-500 to-fuchsia-500',
    'development': 'from-teal-500 to-cyan-500',
    'resources': 'from-orange-500 to-amber-500',
    'frameworks': 'from-violet-500 to-purple-500',
    'mobile': 'from-emerald-500 to-teal-500',
    'web': 'from-sky-500 to-blue-500',
    'database': 'from-slate-500 to-gray-600',
    'cloud': 'from-blue-400 to-sky-500',
    'security': 'from-red-600 to-rose-600',
    'performance': 'from-yellow-400 to-orange-500',
    'productivity': 'from-green-600 to-emerald-600',
    'media': 'from-purple-500 to-violet-500',
    'music': 'from-pink-400 to-rose-500',
    'video': 'from-red-400 to-pink-500',
    'games': 'from-indigo-400 to-blue-500',
    'health': 'from-green-400 to-emerald-500',
    'favorites': 'from-yellow-400 to-amber-500',
    'startup': 'from-orange-400 to-red-500',
    'marketing': 'from-blue-400 to-indigo-500',
    'awards': 'from-yellow-500 to-orange-600',
    'freebies': 'from-green-400 to-teal-500',
    'lifestyle': 'from-amber-400 to-orange-500',
    'default': 'from-gray-500 to-gray-600'
  }

  // Random color pool for new categories
  const randomColors = [
    'from-emerald-400 to-teal-500',
    'from-blue-400 to-indigo-500',
    'from-purple-400 to-violet-500',
    'from-pink-400 to-rose-500',
    'from-orange-400 to-red-500',
    'from-yellow-400 to-amber-500',
    'from-cyan-400 to-blue-500',
    'from-lime-400 to-green-500',
    'from-fuchsia-400 to-pink-500',
    'from-rose-400 to-red-500'
  ]

  // Function to get random color for unknown categories
  const getRandomColor = (slug) => {
    const hash = slug.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    return randomColors[Math.abs(hash) % randomColors.length]
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
      const data = await apiService.getPublicCategories()
      
      // Handle both old and new API response formats
      const categoriesData = data.categories || data
      const totalCount = data.totalActiveLinks || categoriesData.reduce((sum, cat) => sum + (cat.linkCount || 0), 0)
      
      // Add "All Categories" option
      const allCategories = [
        { 
          id: 'all', 
          name: 'All Categories', 
          slug: 'all',
          linkCount: totalCount,
          icon: Palette,
          color: 'from-purple-500 to-pink-500'
        },
        ...categoriesData.map(cat => ({
          id: cat._id,
          name: cat.name,
          slug: cat.slug,
          linkCount: cat.linkCount || 0,
          icon: iconMap[cat.slug] || getRandomIcon(cat.slug),
          color: colorMap[cat.slug] || getRandomColor(cat.slug)
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
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10 gap-3">
        {[...Array(10)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-vintage-gold/20 dark:bg-dark-accent/20 rounded-xl p-3 h-24"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10 gap-3">
      {categories.map((category, index) => {
        const Icon = category.icon
        const isSelected = selectedCategory === category.slug
        
        return (
          <motion.button
            key={category.id}
            onClick={() => onCategoryChange(category.slug)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative overflow-hidden group p-3 rounded-lg transition-all duration-200 ${
              isSelected
                ? 'bg-vintage-gold dark:bg-vintage-brass shadow-lg'
                : 'bg-vintage-paper dark:bg-dark-card shadow-sm hover:shadow-md border border-vintage-gold/10 dark:border-dark-border'
            }`}
          >
            {/* Subtle Hover Effect */}
            {!isSelected && (
              <div className="absolute inset-0 bg-vintage-gold/5 dark:bg-vintage-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            )}
            
            {/* Icon */}
            <div className={`relative w-9 h-9 mx-auto mb-2 rounded-md flex items-center justify-center transition-all duration-200 ${
              isSelected 
                ? 'bg-white/20 text-white' 
                : 'bg-vintage-gold/10 dark:bg-vintage-gold/5 text-vintage-gold group-hover:bg-vintage-gold/20'
            }`}>
              <Icon size={16} className="transition-transform group-hover:scale-110" />
            </div>
            
            {/* Content */}
            <div className="relative text-center">
              <h3 className={`font-serif font-semibold text-xs transition-colors line-clamp-1 ${
                isSelected 
                  ? 'text-white' 
                  : 'text-vintage-black dark:text-dark-text group-hover:text-vintage-gold'
              }`}>
                {category.name}
              </h3>
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}

export default CategorySelector