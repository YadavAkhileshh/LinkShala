import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative p-3 rounded-full bg-vintage-paper dark:bg-dark-card border border-vintage-gold/20 dark:border-dark-border shadow-md hover:shadow-lg transition-all duration-300"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{
          rotate: theme === 'dark' ? 180 : 0,
          scale: theme === 'dark' ? 0.8 : 1
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-6 h-6 text-vintage-gold dark:text-dark-accent"
      >
        {theme === 'dark' ? <Moon size={24} /> : <Sun size={24} />}
      </motion.div>
      
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-vintage-gold/20 dark:bg-dark-accent/20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: theme === 'dark' ? 0.3 : 0.2,
          scale: theme === 'dark' ? 1.2 : 1
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  )
}

export default ThemeToggle