import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'

const EnhancedThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-12 h-6 bg-vintage-gold/30 dark:bg-slate-600 rounded-full p-0.5 transition-all duration-500"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Toggle Circle */}
      <motion.div
        className="w-5 h-5 bg-white rounded-full shadow-sm flex items-center justify-center"
        animate={{
          x: isDark ? 20 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30
        }}
      >
        <motion.div
          animate={{ rotate: isDark ? 0 : 180 }}
          transition={{ duration: 0.4 }}
          className="text-xs"
        >
          {isDark ? '🌙' : '☀️'}
        </motion.div>
      </motion.div>
    </motion.button>
  )
}

export default EnhancedThemeToggle