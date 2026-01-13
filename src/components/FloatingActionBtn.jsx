import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Sparkles } from 'lucide-react'

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false)

  const handleSuggest = () => {
    window.location.href = 'mailto:linkshala.world@gmail.com?subject=Link Suggestion for LinkShala&body=Hi there,%0D%0A%0D%0AI found something useful:%0D%0A%0D%0ALink URL: %0D%0ATitle: %0D%0ACategory: %0D%0AWhy it is useful: %0D%0A%0D%0AMy Email: %0D%0A%0D%0AThanks!'
    setIsOpen(false)
  }

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-16 left-0"
          >
            <motion.button
              onClick={handleSuggest}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 bg-vintage-gold hover:bg-vintage-brass text-white px-4 py-2.5 rounded-lg shadow-lg transition-colors text-sm font-medium whitespace-nowrap"
            >
              <Sparkles size={16} />
              Suggest a Gem
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.95 }}
        className="w-12 h-12 bg-vintage-gold hover:bg-vintage-brass text-white rounded-tl-xl rounded-tr-xl rounded-br-xl rounded-bl-sm shadow-lg transition-colors flex items-center justify-center"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? <X size={20} /> : <Plus size={20} />}
        </motion.div>
      </motion.button>
    </div>
  )
}

export default FloatingActionButton