import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-vintage-cream dark:bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-vintage-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-vintage-coffee dark:text-dark-muted font-serif">Loading...</p>
        </div>
      </div>
    )
  }

  return user ? children : <Navigate to="/" replace />
}

export default ProtectedRoute
