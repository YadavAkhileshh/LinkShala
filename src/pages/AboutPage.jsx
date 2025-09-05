import { motion } from 'framer-motion'
import { Heart, Code, Zap, Users, Star, Github, Twitter, Mail } from 'lucide-react'

const AboutPage = () => {
  const features = [
    {
      icon: Code,
      title: "Passion-Driven",
      description: "Created by a developer who understands the daily challenges of finding quality resources and tools."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized performance with instant search, smooth animations, and responsive design across all devices."
    },
    {
      icon: Users,
      title: "Community Focused",
      description: "Growing collection of resources curated for the developer community worldwide."
    },
    {
      icon: Heart,
      title: "Open Source",
      description: "Transparent development. Contribute, suggest improvements, or fork the project on GitHub."
    }
  ]

  const stats = [
    { number: "500+", label: "Curated Links" },
    { number: "50K+", label: "Monthly Visits" },
    { number: "10+", label: "Categories" },
    { number: "99.9%", label: "Uptime" }
  ]

  return (
    <div className="min-h-screen bg-vintage-cream dark:bg-dark-bg">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-6">
              About <span className="text-vintage-gold">LinkShala</span>
            </h1>
            <p className="text-xl text-vintage-brown dark:text-dark-muted font-serif max-w-3xl mx-auto leading-relaxed">
              Your ultimate destination for discovering, organizing, and sharing the best developer tools, 
              resources, and inspiration. Crafted with passion for the developer community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-vintage-paper dark:bg-dark-card rounded-3xl p-8 md:p-12 shadow-vault border border-vintage-gold/20 dark:border-dark-border"
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-6">
                  Our Mission
                </h2>
                <p className="text-vintage-brown dark:text-dark-muted font-serif text-lg leading-relaxed mb-6">
                  I believe that great developers deserve great tools. LinkShala was born from my frustration 
                  of spending countless hours searching for reliable resources, quality libraries, and 
                  inspiration scattered across the web.
                </p>
                <p className="text-vintage-brown dark:text-dark-muted font-serif text-lg leading-relaxed">
                  My mission is simple: to create a centralized, curated collection of the best developer 
                  resources, making it easier for creators to find what they need and focus on what they do best - building amazing things.
                </p>
              </div>
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-br from-vintage-gold to-vintage-brass rounded-2xl p-8 text-white shadow-glow"
                >
                  <Code size={48} className="mb-4" />
                  <h3 className="text-xl font-serif font-semibold mb-2">Quality First</h3>
                  <p className="font-serif opacity-90">
                    Every resource is manually reviewed and tested to ensure it meets my high standards for quality and reliability.
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-4">
              Why Choose LinkShala?
            </h2>
            <p className="text-vintage-brown dark:text-dark-muted font-serif text-lg max-w-2xl mx-auto">
              Discover what makes LinkShala the go-to platform for developers worldwide
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-vintage-paper dark:bg-dark-card rounded-2xl p-6 shadow-vault border border-vintage-gold/20 dark:border-dark-border text-center group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-vintage-gold to-vintage-brass rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-vintage-black dark:text-dark-text mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-vintage-brown dark:text-dark-muted font-serif leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-vintage-gold to-vintage-brass rounded-3xl p-8 md:p-12 text-white shadow-glow"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-vintage font-bold mb-4">
                LinkShala by the Numbers
              </h2>
              <p className="text-white/90 font-serif text-lg">
                Join thousands of developers who trust LinkShala for their daily workflow
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-vintage font-bold mb-2">
                    {stat.number}
                  </div>
                  <div className="text-white/90 font-serif text-lg">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-6">
              Built with ❤️ by a Developer
            </h2>
            <p className="text-vintage-brown dark:text-dark-muted font-serif text-lg leading-relaxed mb-8">
              LinkShala is crafted by a passionate developer who understands the daily challenges 
              of finding quality resources. I'm committed to making the developer experience better, 
              one curated link at a time.
            </p>
            
            <div className="flex justify-center space-x-6">
              <motion.a
                href="https://github.com/YadavAkhileshh"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 bg-vintage-paper dark:bg-dark-card border border-vintage-gold/20 dark:border-dark-border rounded-full flex items-center justify-center text-vintage-brown dark:text-dark-muted hover:text-vintage-gold dark:hover:text-dark-accent transition-colors shadow-md"
              >
                <Github size={24} />
              </motion.a>
              <motion.a
                href="https://x.com/_Yakhil"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 bg-vintage-paper dark:bg-dark-card border border-vintage-gold/20 dark:border-dark-border rounded-full flex items-center justify-center text-vintage-brown dark:text-dark-muted hover:text-vintage-gold dark:hover:text-dark-accent transition-colors shadow-md"
              >
                <Twitter size={24} />
              </motion.a>
              <motion.a
                href="mailto:yadavakhil2501@gmail.com"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 bg-vintage-paper dark:bg-dark-card border border-vintage-gold/20 dark:border-dark-border rounded-full flex items-center justify-center text-vintage-brown dark:text-dark-muted hover:text-vintage-gold dark:hover:text-dark-accent transition-colors shadow-md"
              >
                <Mail size={24} />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-vintage-paper dark:bg-dark-card rounded-3xl p-8 md:p-12 text-center shadow-vault border border-vintage-gold/20 dark:border-dark-border"
          >
            <Star size={48} className="text-vintage-gold mx-auto mb-6" />
            <h2 className="text-3xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-4">
              Ready to Explore?
            </h2>
            <p className="text-vintage-brown dark:text-dark-muted font-serif text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of developers who have already discovered their next favorite tool. 
              Start exploring our curated collection today.
            </p>
            <motion.a
              href="/"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-vintage-gold to-vintage-brass text-white px-8 py-4 rounded-xl font-serif font-medium shadow-glow hover:shadow-xl transition-all duration-300"
            >
              <span>Start Exploring</span>
              <Zap size={20} />
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage