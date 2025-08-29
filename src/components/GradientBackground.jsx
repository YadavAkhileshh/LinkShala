import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const GradientBackground = ({ children, variant = 'default' }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const gradientVariants = {
    default: {
      background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(218, 165, 32, 0.1) 0%, rgba(139, 94, 60, 0.05) 25%, rgba(53, 94, 59, 0.03) 50%, transparent 70%)`,
    },
    hero: {
      background: `linear-gradient(135deg, rgba(218, 165, 32, 0.1) 0%, rgba(139, 94, 60, 0.08) 25%, rgba(53, 94, 59, 0.06) 50%, rgba(179, 58, 58, 0.04) 75%, transparent 100%)`,
    },
    card: {
      background: `radial-gradient(ellipse at ${mousePosition.x}% ${mousePosition.y}%, rgba(218, 165, 32, 0.08) 0%, rgba(139, 94, 60, 0.04) 40%, transparent 70%)`,
    }
  }

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={gradientVariants[variant]}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
      
      {/* Floating Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 rounded-full opacity-20 dark:opacity-10"
            style={{
              background: `radial-gradient(circle, ${
                ['#DAA520', '#8B5E3C', '#355E3B', '#B33A3A', '#D4AF37', '#2C2C2C'][i]
              } 0%, transparent 70%)`,
              left: `${10 + (i * 15)}%`,
              top: `${20 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

export default GradientBackground