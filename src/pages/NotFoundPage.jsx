import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Home, ArrowLeft, Search } from 'lucide-react'

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-vintage-cream dark:bg-dark-bg flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl mx-auto"
      >
        {/* 404 Number */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="mb-8"
        >
          <h1 className="text-9xl font-vintage font-bold text-vintage-gold dark:text-vintage-gold mb-4">
            404
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-vintage-gold to-vintage-brass mx-auto rounded-full"></div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-vintage-brown dark:text-dark-muted font-serif leading-relaxed">
           Whoops! Even the best explorers sometimes get lost… welcome to LinkShala!
          </p>
        </motion.div>

        {/* Decorative Element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-vintage-gold/20 to-vintage-brass/20 rounded-full flex items-center justify-center border-2 border-vintage-gold/30 dark:border-vintage-gold/50">
            <Search className="w-10 h-10 text-vintage-gold" />
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-vintage-gold to-vintage-brass text-white px-8 py-3 rounded-lg font-serif font-medium hover:from-vintage-brass hover:to-vintage-gold transition-all duration-300 flex items-center space-x-2 shadow-glow"
          >
            <Home size={20} />
            <span>Go Home</span>
          </motion.button>
          
          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-vintage-paper dark:bg-dark-card text-vintage-black dark:text-dark-text px-8 py-3 rounded-lg font-serif font-medium border border-vintage-gold/30 dark:border-dark-border hover:bg-vintage-gold/10 dark:hover:bg-dark-accent/10 transition-all duration-300 flex items-center space-x-2"
          >
            <ArrowLeft size={20} />
            <span>Go Back</span>
          </motion.button>
        </motion.div>

        {/* Fun Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 p-6 bg-vintage-paper dark:bg-dark-card rounded-2xl border border-vintage-gold/20 dark:border-dark-border shadow-vault"
        >
          <p className="text-sm text-vintage-brown dark:text-dark-muted font-serif italic">
            "Not all heroes wear capes… some just share awesome links." 
            <br />
            <span className="text-vintage-gold">— Akhilesh Yadav</span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFoundPage