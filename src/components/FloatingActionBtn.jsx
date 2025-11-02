import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Sparkles, Upload, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const actions = [
    {
      icon: Sparkles,
      label: 'Suggest a Gem',
      color: 'from-vintage-gold to-vintage-brass',
      onClick: () => {
        window.location.href = 'mailto:linkshala.world@gmail.com?subject=🔥 Link Suggestion for LinkShala&body=Hey there! 👋%0D%0A%0D%0AI found something awesome:%0D%0A%0D%0A🔗 Link URL: %0D%0A📝 Title: %0D%0A📂 Category: %0D%0A💡 Why it\'s cool: %0D%0A%0D%0A✉️ My Email: %0D%0A%0D%0AThanks for making LinkShala awesome! 🎉'
        setIsOpen(false)
      }
    }
  ]

  return (
    <div className="fixed bottom-8 left-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-16 left-0 space-y-3"
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
                  whileHover={{ scale: 1.05, x: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative flex items-center space-x-3 bg-gradient-to-r ${action.color} text-white px-5 py-3 rounded-full shadow-glow hover:shadow-xl transition-all duration-300 group overflow-hidden`}
                >
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.5 }}
                  />
                  <Icon size={20} className="relative z-10 group-hover:rotate-12 transition-transform" />
                  <span className="font-serif font-bold whitespace-nowrap relative z-10">
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