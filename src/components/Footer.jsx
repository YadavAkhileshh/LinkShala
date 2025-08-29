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
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-vintage-coffee dark:text-dark-muted space-y-2 md:space-y-0">
          <div>
            linkshala.tools – {currentYear}
          </div>
          
          <div>
            website by <span className="text-vintage-black dark:text-dark-text font-medium"> <a href="http://github.com/YadavAkhileshh" target="_naya">Akhilesh Yadav</a></span>
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
