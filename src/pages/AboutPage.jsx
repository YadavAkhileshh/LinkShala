import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Heart, Code, Zap, Users, Github, Twitter, Mail, ArrowRight } from 'lucide-react'

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-[#fefdfb] dark:bg-[#0c0c0c]">
      {/* Hero */}
      <section className="relative py-24 px-6 overflow-hidden">
        {/* Organic background lines */}
        <svg className="absolute top-0 left-0 w-full h-full opacity-[0.04] dark:opacity-[0.02]" viewBox="0 0 1000 600" preserveAspectRatio="none">
          <path d="M0,300 Q250,200 500,300 T1000,300" stroke="currentColor" strokeWidth="1" fill="none" className="text-vintage-gold" />
          <path d="M0,350 Q250,250 500,350 T1000,350" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-vintage-brass" />
        </svg>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm tracking-[0.2em] uppercase text-vintage-gold/80 mb-6"
          >
            About
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-vintage text-gray-900 dark:text-white mb-6"
          >
            Built for developers,
            <br />
            <span className="text-vintage-gold">by a developer</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto"
          >
            LinkShala is a curated collection of the best tools and resources
            for developers. No clutter, no noise-just quality.
          </motion.p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6 text-gray-600 dark:text-gray-400"
          >
            <p className="text-lg leading-relaxed">
              I got tired of bookmarking random links, losing them, and spending hours
              searching for that one tool I saw somewhere. So I built LinkShala-a simple
              place to keep the good stuff organized.
            </p>
            <p className="text-lg leading-relaxed">
              Every link here is something I've actually used or found genuinely useful.
              No sponsored picks, no filler content. Just resources that help you build
              better things faster.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Code, title: "Solo Project", desc: "Built by one dev who understands the struggle" },
              { icon: Zap, title: "Fast", desc: "No bloat, just quick access to resources" },
              { icon: Users, title: "Community", desc: "Growing collection for developers worldwide" },
              { icon: Heart, title: "Open", desc: "Transparent curation, community-driven" }
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-[#111] rounded-xl p-6 border border-gray-100 dark:border-white/[0.06]"
              >
                <div className="w-10 h-10 bg-vintage-gold/10 rounded-lg flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-vintage-gold" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-vintage-gold rounded-2xl p-10 text-center"
          >
            <div className="grid grid-cols-4 gap-6">
              {[
                { num: "500+", label: "Links" },
                { num: "1K+", label: "Visitors" },
                { num: "10+", label: "Categories" },
                { num: "99%", label: "Uptime" }
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.num}</p>
                  <p className="text-sm text-white/70">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Connect */}
      <section className="py-16 px-6">
        <div className="max-w-xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-vintage text-gray-900 dark:text-white mb-6">
              Let's connect
            </h2>

            <div className="flex justify-center gap-4 mb-8">
              {[
                { icon: Github, href: "https://github.com/YadavAkhileshh", label: "GitHub" },
                { icon: Twitter, href: "https://x.com/_Yakhil", label: "Twitter" },
                { icon: Mail, href: "mailto:linkshala.world@gmail.com", label: "Email" }
              ].map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 bg-white dark:bg-[#111] border border-gray-100 dark:border-white/[0.06] rounded-xl flex items-center justify-center text-gray-500 hover:text-vintage-gold transition-colors"
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>

            <p className="text-sm text-gray-400 mb-8">
              Questions or suggestions? <br />
              <a href="mailto:linkshala.world@gmail.com" className="text-vintage-gold hover:underline">
                linkshala.world@gmail.com
              </a>
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 border-t border-gray-100 dark:border-white/[0.04]">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-xl font-vintage text-gray-900 dark:text-white mb-4">
            Ready to explore?
          </h2>
          <Link
            to="/home"
            className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Browse Resources
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default AboutPage