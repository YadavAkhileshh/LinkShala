import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center space-x-2 p-2 rounded-xl hover:bg-vintage-gold/10 dark:hover:bg-dark-accent/10 transition-colors"
      >
        <div className="w-10 h-10 bg-gradient-to-br from-vintage-gold to-vintage-brass rounded-full flex items-center justify-center text-white font-bold shadow-md">
          {getInitials(userName)}
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 bg-vintage-paper dark:bg-dark-card rounded-2xl shadow-2xl border border-vintage-gold/30 dark:border-dark-border overflow-hidden z-50"
          >
            <div className="p-4 border-b border-vintage-gold/20 dark:border-dark-border bg-gradient-to-br from-vintage-gold/10 to-vintage-brass/5">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-vintage-gold to-vintage-brass rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {getInitials(userName)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-serif font-bold text-vintage-black dark:text-dark-text truncate">
                    {userName}
                  </p>
                  <p className="text-xs text-vintage-coffee dark:text-dark-muted truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 text-left text-sm font-serif font-medium text-vintage-brown dark:text-dark-text hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProfileDropdown
