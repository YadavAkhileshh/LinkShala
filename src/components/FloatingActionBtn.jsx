import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Sparkles, Upload, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const actions = [
    {
      icon: Upload,
      label: 'Suggest Link',
      color: 'from-blue-500 to-cyan-500',
      onClick: () => {
        window.location.href = 'mailto:your-email@example.com?subject=Link Suggestion&body=Hi,%0D%0A%0D%0AI would like to suggest a link:%0D%0A%0D%0ALink URL: %0D%0ALink Title: %0D%0ACategory: %0D%0A%0D%0AMy Email: %0D%0A%0D%0AThank you!'
        setIsOpen(false)
      }
    }
  ]

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {actions.map((action, index) => {
              const Icon = action.icon
              return (
                <motion.button
                  key={action.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={action.onClick}
                  className={`flex items-center space-x-3 bg-gradient-to-r ${action.color} text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group`}
                >
                  <Icon size={20} />
                  <span className="font-serif font-medium whitespace-nowrap">
                    {action.label}
                  </span>
                </motion.button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-14 h-14 bg-gradient-to-r from-vintage-gold to-vintage-brass text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <X size={24} /> : <Plus size={24} />}
        </motion.div>
      </motion.button>
    </div>
  )
}

export default FloatingActionButton