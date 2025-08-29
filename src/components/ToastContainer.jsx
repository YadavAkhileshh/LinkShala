import { useState, useEffect } from 'react'
import NotificationToast from './NotificationToast'

const ToastContainer = () => {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const handleShowToast = (event) => {
      const { message, type = 'info', duration = 3000 } = event.detail
      const id = Date.now()
      
      setToasts(prev => [...prev, { id, message, type, duration }])
    }

    window.addEventListener('showToast', handleShowToast)
    return () => window.removeEventListener('showToast', handleShowToast)
  }, [])

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-2">
      {toasts.map(toast => (
        <NotificationToast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}

export default ToastContainer