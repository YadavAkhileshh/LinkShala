import { motion } from 'framer-motion'
import { Palette, Code, Image, BookOpen, Wrench } from 'lucide-react'

const EnhancedCategorySelector = ({ selectedCategory, onCategoryChange }) => {
  const categories = [
    { 
      id: 'all', 
      name: 'All Categories', 
      icon: Palette,
      color: 'from-purple-500 to-pink-500',
      count: '∞'
    },
    { 
      id: 'ui-libraries', 
      name: 'UI Libraries', 
      icon: Code,
      color: 'from-blue-500 to-cyan-500',
      count: '25+'
    },
    { 
      id: 'backgrounds', 
      name: 'Backgrounds', 
      icon: Image,
      color: 'from-green-500 to-emerald-500',
      count: '15+'
    },
    { 
      id: 'icons', 
      name: 'Icons', 
      icon: Palette,
      color: 'from-yellow-500 to-orange-500',
      count: '30+'
    },
    { 
      id: 'learning', 
      name: 'Learning', 
      icon: BookOpen,
      color: 'from-red-500 to-rose-500',
      count: '20+'
    },
    { 
      id: 'tools', 
      name: 'Tools', 
      icon: Wrench,
      color: 'from-indigo-500 to-purple-500',
      count: '40+'
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((category, index) => {
        const Icon = category.icon
        const isSelected = selectedCategory === category.id
        
        return (
          <motion.button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
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
                {category.count} links
              </p>
            </div>
            
            {/* Selection Indicator */}
            {isSelected && (
              <motion.div
                layoutId="categorySelector"
                className="absolute inset-0 rounded-2xl border-2 border-vintage-gold"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}

export default EnhancedCategorySelector