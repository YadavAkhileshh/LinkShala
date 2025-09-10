import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeProvider } from './contexts/ThemeContext'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import AdminDashboard from './pages/AdminDashboard'
import LinkDetailPage from './pages/LinkDetailPage'
import AboutPage from './pages/AboutPage'
import BookmarksPage from './pages/BookmarksPage'
import NotFoundPage from './pages/NotFoundPage'
import ErrorBoundary from './components/ErrorBoundary'
import GradientBackground from './components/GradientBackground'
import ParticleSystem from './components/ParticleSystem'
import ToastContainer from './components/ToastContainer'

function AnimatedRoutes() {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/bookmarks" element={<BookmarksPage />} />
        <Route path="/magic" element={<AdminDashboard />} />
        <Route path="/link/:id" element={<LinkDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </AnimatePresence>
  )
}

function App() {
  const location = useLocation()
  
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-vintage-cream dark:bg-dark-bg transition-colors duration-300 relative overflow-x-hidden">
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
            style={{ scrollBehavior: 'smooth' }}
          >
            <AnimatedRoutes />
          </motion.main>
          <Footer />
        </GradientBackground>
        
        {/* Toast Notifications */}
        <ToastContainer />
      </div>
    </ThemeProvider>
  )
}

function AppWrapper() {
  return (
    <ErrorBoundary>
      <Router>
        <App />
      </Router>
    </ErrorBoundary>
  )
}

export default AppWrapper