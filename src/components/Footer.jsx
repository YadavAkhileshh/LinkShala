import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#fefdfb] dark:bg-[#0c0c0c] py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-100 dark:border-white/[0.04]">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          {/* Left - Brand */}
          <div className="flex items-center gap-2">
            <span className="font-vintage text-lg text-vintage-gold">LinkShala</span>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <span className="text-gray-400 dark:text-gray-500">Developer Resources</span>
          </div>

          {/* Center - Made by */}
          <div className="text-gray-400 dark:text-gray-500">
            Crafted with care by{' '}
            <a
              href="https://github.com/YadavAkhileshh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-vintage-gold hover:text-vintage-brass transition-colors"
            >
              Akhilesh
            </a>
          </div>

          {/* Right - Links & Year */}
          <div className="flex items-center gap-4 text-gray-400 dark:text-gray-500">
            <a
              href="mailto:linkshala.world@gmail.com"
              className="hover:text-vintage-gold transition-colors"
            >
              Contact
            </a>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <span>{currentYear}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
