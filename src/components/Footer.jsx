import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const lastUpdated = new Date().toLocaleDateString('en-US', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric'
  })

  return (
    <footer className="bg-vintage-paper dark:bg-dark-card py-6 px-6 lg:px-8 border-t border-vintage-gold/20 dark:border-dark-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-vintage-coffee dark:text-dark-muted space-y-3 md:space-y-0">
          <div className="flex flex-col items-center md:items-start space-y-1">
            <div>linkshala – {currentYear}</div>
            <a href="mailto:linkshala.world@gmail.com" className="text-vintage-gold hover:text-vintage-brass transition-colors flex items-center space-x-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
              <span>Support</span>
            </a>
          </div>
          
          <div>
            website by <a href="https://github.com/YadavAkhileshh" target="_blank" rel="noopener noreferrer" className="text-vintage-black dark:text-dark-text font-medium hover:text-vintage-gold transition-colors cursor-pointer">Akhilesh</a>
          </div>
          
          <div>
            last updated: {lastUpdated}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
