import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import EnhancedThemeToggle from './EnhancedThemeToggle'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' }
  ]

  const isActivePath = (path) => {
    return location.pathname === path
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-vintage-cream/90 dark:bg-dark-bg/90 backdrop-blur-xl border-b border-vintage-gold/20 dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative"
            >
              <h1 className="text-3xl font-vintage font-bold bg-gradient-to-r from-vintage-gold to-vintage-brass bg-clip-text text-transparent group-hover:from-vintage-brass group-hover:to-vintage-gold transition-all duration-300">
                LinkShala
              </h1>
              <p className="text-xs text-vintage-brown/60 dark:text-dark-muted -mt-1 font-serif">Developer Resource Hub</p>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative px-4 py-2 text-sm font-serif font-medium transition-all duration-300 rounded-xl ${
                  location.pathname === item.path
                    ? 'text-vintage-gold bg-vintage-gold/10 dark:bg-dark-accent/10'
                    : 'text-vintage-brown dark:text-dark-text hover:text-vintage-gold hover:bg-vintage-gold/10'
                }`}
              >
                {item.name}
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-vintage-gold rounded-full"
                  />
                )}
              </Link>
            ))}
            <EnhancedThemeToggle />
          </nav>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center space-x-3">
            <EnhancedThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-3 rounded-xl hover:bg-vintage-gold/10 dark:hover:bg-dark-accent/10 transition-colors"
            >
              {isMenuOpen ? <X size={24} className="text-vintage-brown dark:text-dark-text" /> : <Menu size={24} className="text-vintage-brown dark:text-dark-text" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-vintage-gold/20 dark:border-dark-border py-6"
          >
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 text-base font-serif font-medium transition-all duration-300 rounded-xl mb-2 ${
                  location.pathname === item.path
                    ? 'text-vintage-gold bg-vintage-gold/10 dark:bg-dark-accent/10'
                    : 'text-vintage-brown dark:text-dark-text hover:text-vintage-gold hover:bg-vintage-gold/10'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </motion.div>
        )}
      </div>
    </header>
  )
}

export default Header
