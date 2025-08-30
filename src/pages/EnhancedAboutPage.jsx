import { motion } from 'framer-motion'
import { Heart, Star, Users, Globe, Zap, Shield, Award, Coffee } from 'lucide-react'
import SocialIcons from '../components/SocialIcons'

const EnhancedAboutPage = () => {
  const features = [
    {
      icon: Globe,
      title: 'Personal Curation',
      description: 'Personally selected links from across the web, chosen for their exceptional quality and developer value.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Built with modern technologies for optimal performance and user experience.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is protected with industry-standard security measures.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Users,
      title: 'Smart Organization',
      description: 'Intelligent categorization and tagging system for easy discovery and navigation.',
      color: 'from-purple-500 to-pink-500'
    }
  ]

  const stats = [
    { label: 'Quality Links', value: '50+', icon: Globe },
    { label: 'Early Users', value: '25+', icon: Users },
    { label: 'Categories', value: '5', icon: Star },
    { label: 'Weekly Visits', value: '100+', icon: Heart }
  ]

  const team = [
    {
      name: 'Alex Johnson',
      role: 'Founder & Developer',
      description: 'Passionate about creating beautiful web experiences and curating the best resources.',
      avatar: '👨‍💻'
    },
    {
      name: 'Sarah Chen',
      role: 'Design Lead',
      description: 'Crafting intuitive interfaces and ensuring every pixel serves a purpose.',
      avatar: '👩‍🎨'
    },
    {
      name: 'Mike Rodriguez',
      role: 'Content Curator',
      description: 'Discovering and evaluating the finest resources across the web.',
      avatar: '👨‍🔬'
    }
  ]

  return (
    <div className="min-h-screen bg-vintage-cream dark:bg-dark-bg">
      {/* Hero Section */}
      <section className="relative py-20 px-6 lg:px-8 bg-vintage-paper dark:bg-dark-card border-b border-vintage-gold/20 dark:border-dark-border">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-24 h-24 bg-gradient-to-br from-vintage-gold to-vintage-brass rounded-full flex items-center justify-center mx-auto mb-8 shadow-glow">
              <Heart className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-6">
              Meet{' '}
              <span className="bg-gradient-to-r from-vintage-gold via-vintage-brass to-vintage-gold bg-clip-text text-transparent animate-pulse">
                LinkShala
              </span>
            </h1>
            
            <div className="mb-8">
              <motion.p 
                className="text-2xl md:text-3xl text-vintage-coffee dark:text-dark-muted font-serif leading-relaxed mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Where{' '}
                <motion.span
                  className="relative inline-block"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.span
                    className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-clip-text text-transparent font-bold cursor-pointer"
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{
                      backgroundSize: '200% 200%'
                    }}
                  >
                    creativity meets curation
                  </motion.span>
                  <motion.div
                    className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.span>
              </motion.p>
              
              <p className="text-xl text-vintage-coffee dark:text-dark-muted max-w-4xl mx-auto leading-relaxed font-serif">
                Curating the web's finest resources for creators like you
              </p>
            </div>
            

          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-vintage-gold to-vintage-brass rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-2">
                    {stat.value}
                  </div>
                  <div className="text-vintage-brown dark:text-dark-muted font-serif">
                    {stat.label}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 lg:px-8 bg-vintage-paper dark:bg-dark-card">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-4">
              Why Choose LinkShala?
            </h2>
            <p className="text-xl text-vintage-coffee dark:text-dark-muted font-serif max-w-3xl mx-auto">
              I want every developer to make their website interactive and best with the finest resources on the internet.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ y: -5 }}
                  className="bg-vintage-cream dark:bg-dark-bg p-8 rounded-2xl border border-vintage-gold/20 dark:border-dark-border shadow-vault"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 shadow-md`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-vintage-coffee dark:text-dark-muted font-serif leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>



      {/* Mission Section */}
      <section className="py-16 px-6 lg:px-8 bg-vintage-paper dark:bg-dark-card">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-vintage-gold to-vintage-brass rounded-full flex items-center justify-center mx-auto mb-8 shadow-glow">
              <Award className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-4xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-6">
              My Mission
            </h2>
            
            <p className="text-xl text-vintage-coffee dark:text-dark-muted font-serif leading-relaxed mb-8">
              I want every developer to make their website interactive and best with the finest resources on the internet. 
              My goal is to provide developers with the tools they need to create exceptional web experiences.
            </p>
            
            <div className="bg-vintage-cream dark:bg-dark-bg p-8 rounded-2xl border border-vintage-gold/20 dark:border-dark-border">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Coffee className="w-6 h-6 text-vintage-gold" />
                <span className="text-vintage-brown dark:text-dark-muted font-serif">
                  Built with passion, one link at a time
                </span>
              </div>
              <p className="text-vintage-coffee dark:text-dark-muted font-serif italic">
                "Every great project starts with a single link. We're here to help you find yours."
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-6">
              Join the Journey
            </h2>
            <p className="text-xl text-vintage-coffee dark:text-dark-muted font-serif mb-8 max-w-2xl mx-auto">
              Be part of a growing community of developers and creators who believe in building 
              exceptional websites with the best resources available.
            </p>
            

            
            {/* Social Media Links */}
            <div className="text-center">
              <p className="text-vintage-brown dark:text-dark-muted font-serif mb-4">
                Connect with me
              </p>
              <div className="flex justify-center space-x-4">
                <a href="https://x.com/_Yakhil" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors shadow-lg">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="https://github.com/YadavAkhileshh" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-900 transition-colors shadow-lg">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a href="https://www.linkedin.com/in/yakhilesh/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="https://whatsapp.com/channel/0029VaPBQL1D38CL7TSJbM3q" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors shadow-lg">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                  </svg>
                </a>
                <a href="mailto:infinityy2501@gmail.com" className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.749L12 10.724l9.615-6.903h.749c.904 0 1.636.732 1.636 1.636z"/>
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default EnhancedAboutPage