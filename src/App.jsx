import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import LandingPage from './pages/LandingPage'
import HomePage from './pages/HomePage'
import AdminDashboard from './pages/AdminDashboard'
import LinkDetailPage from './pages/LinkDetailPage'
import AboutPage from './pages/AboutPage'
import BookmarksPage from './pages/BookmarksPage'
import NotFoundPage from './pages/NotFoundPage'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import GradientBackground from './components/GradientBackground'
import ParticleSystem from './components/ParticleSystem'
import ToastContainer from './components/ToastContainer'

function AnimatedRoutes() {
  const location = useLocation()
  const isLandingPage = location.pathname === '/'
  const { user, loading } = useAuth()
  
  // Redirect to landing if trying to access protected routes without auth
  useEffect(() => {
    if (!loading && !user && location.pathname !== '/') {
      window.location.href = '/'
    }
  }, [user, loading, location.pathname])
  
  return (
    <>
      {!isLandingPage && <Header />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/about" element={<ProtectedRoute><AboutPage /></ProtectedRoute>} />
          <Route path="/bookmarks" element={<ProtectedRoute><BookmarksPage /></ProtectedRoute>} />
          <Route path="/magic" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/link/:id" element={<ProtectedRoute><LinkDetailPage /></ProtectedRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
      {!isLandingPage && <Footer />}
    </>
  )
}

function App() {
  const location = useLocation()
  const isLandingPage = location.pathname === '/'
  
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-vintage-cream dark:bg-dark-bg transition-colors duration-300 relative overflow-x-hidden">
          {/* Particle System Background */}
          <ParticleSystem count={30} color="rgba(218, 165, 32, 0.6)" />
          
          {/* Gradient Background */}
          <GradientBackground variant="default">
            <motion.main
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className={isLandingPage ? 'relative z-10' : 'pt-20 relative z-10'}
              style={{ scrollBehavior: 'smooth' }}
            >
              <AnimatedRoutes />
            </motion.main>
          </GradientBackground>
          
          {/* Toast Notifications */}
          <ToastContainer />
        </div>
      </AuthProvider>
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