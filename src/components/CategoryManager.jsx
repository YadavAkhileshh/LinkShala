import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Save, X } from 'lucide-react'

const CategoryManager = () => {
  const [categories] = useState([
    { id: 'tools', name: 'Tools', count: 25 },
    { id: 'ui-libraries', name: 'UI Libraries', count: 18 },
    { id: 'backgrounds', name: 'Backgrounds', count: 12 },
    { id: 'icons', name: 'Icons', count: 30 },
    { id: 'learning', name: 'Learning', count: 15 }
  ])

  return (
    <div className="bg-vintage-paper dark:bg-dark-card rounded-2xl p-6 shadow-vault border border-vintage-gold/20 dark:border-dark-border">
      <h3 className="text-xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-6">
        Category Management
      </h3>
      
      <div className="space-y-4">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-4 bg-vintage-cream dark:bg-dark-bg rounded-lg border border-vintage-gold/10 dark:border-dark-border"
          >
            <div>
              <h4 className="font-serif font-semibold text-vintage-black dark:text-dark-text capitalize">
                {category.name}
              </h4>
              <p className="text-sm text-vintage-brown dark:text-dark-muted">
                {category.count} links
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors">
                <Edit size={16} />
              </button>
              <button className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-6 w-full bg-vintage-gold text-white py-3 px-4 rounded-lg hover:bg-vintage-brass transition-colors flex items-center justify-center space-x-2 font-serif"
      >
        <Plus size={18} />
        <span>Add Category</span>
      </motion.button>
    </div>
  )
}

export default CategoryManager