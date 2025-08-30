import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeProvider } from './contexts/ThemeContext'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import EnhancedAdminDashboard from './pages/EnhancedAdminDashboard'
import LinkDetailPage from './pages/LinkDetailPage'
import EnhancedAboutPage from './pages/EnhancedAboutPage'
import BookmarksPage from './pages/BookmarksPage'
import GradientBackground from './components/GradientBackground'
import ParticleSystem from './components/ParticleSystem'
import ToastContainer from './components/ToastContainer'

function AnimatedRoutes() {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<EnhancedAboutPage />} />
        <Route path="/bookmarks" element={<BookmarksPage />} />
        <Route path="/dashboard" element={<EnhancedAdminDashboard />} />
        <Route path="/link/:id" element={<LinkDetailPage />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-vintage-cream dark:bg-dark-bg transition-colors duration-300 relative overflow-hidden">
          {/* Particle System Background */}
          <ParticleSystem count={30} color="rgba(218, 165, 32, 0.6)" />
          
          {/* Gradient Background */}
          <GradientBackground variant="default">
            <Header />
            <motion.main
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="pt-20 relative z-10"
            >
              <AnimatedRoutes />
            </motion.main>
            <Footer />
          </GradientBackground>
          
          {/* Toast Notifications */}
          <ToastContainer />
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
