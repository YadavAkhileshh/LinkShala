import { motion } from 'framer-motion'
import { Link as LinkIcon, Eye, Share2, TrendingUp, ExternalLink, Calendar, BarChart3 } from 'lucide-react'

const AdminOverview = ({ stats }) => {
  const statCards = [
    { label: 'Total Links', value: stats.totalLinks || 0, icon: LinkIcon, color: 'from-vintage-gold to-vintage-brass', change: '+12%' },
    { label: 'Total Clicks', value: stats.totalClicks || 0, icon: Eye, color: 'from-vintage-gold to-vintage-brass', change: '+24%' },
    { label: 'Total Shares', value: stats.totalShares || 0, icon: Share2, color: 'from-vintage-gold to-vintage-brass', change: '+8%' },
    { label: 'Referrals', value: stats.totalReferrals || 0, icon: ExternalLink, color: 'from-vintage-gold to-vintage-brass', change: '+15%' },
    { label: 'Categories', value: stats.totalCategories || 0, icon: BarChart3, color: 'from-vintage-gold to-vintage-brass', change: stats.totalCategories || 0 }
  ]

  const conversionRate = stats.totalClicks > 0 ? ((stats.totalReferrals / stats.totalClicks) * 100).toFixed(1) : 0
  const engagementRate = stats.totalLinks > 0 ? ((stats.totalClicks / stats.totalLinks) / 10).toFixed(1) : 0

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-vintage-paper dark:bg-dark-card rounded-2xl p-6 shadow-vault border border-vintage-gold/20 dark:border-dark-border hover:shadow-vault-lg transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-serif font-medium text-vintage-brown dark:text-dark-muted">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-vintage font-bold text-vintage-black dark:text-dark-text mt-2">
                    {stat.value.toLocaleString()}
                  </p>
                  {stat.change && (
                    <p className="text-xs font-serif text-green-600 dark:text-green-400 mt-1">
                      {stat.change}
                    </p>
                  )}
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-md`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-vintage-gold/10 to-vintage-brass/10 dark:from-dark-accent/10 dark:to-dark-accent/5 rounded-2xl p-6 border border-vintage-gold/30 dark:border-dark-accent/30"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-vintage font-bold text-vintage-black dark:text-dark-text">Conversion Rate</h3>
            <TrendingUp className="w-5 h-5 text-vintage-gold" />
          </div>
          <div className="text-4xl font-vintage font-bold text-vintage-gold mb-2">{conversionRate}%</div>
          <p className="text-sm text-vintage-brown dark:text-dark-muted font-serif">Clicks to Referrals</p>
          <div className="mt-4 bg-vintage-cream dark:bg-dark-bg rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${conversionRate}%` }}
              transition={{ duration: 1, delay: 0.8 }}
              className="h-full bg-gradient-to-r from-vintage-gold to-vintage-brass"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-vintage-brass/10 to-vintage-gold/10 rounded-2xl p-6 border border-vintage-brass/30"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-vintage font-bold text-vintage-black dark:text-dark-text">Engagement</h3>
            <Eye className="w-5 h-5 text-vintage-brass" />
          </div>
          <div className="text-4xl font-vintage font-bold text-vintage-brass mb-2">{engagementRate}%</div>
          <p className="text-sm text-vintage-brown dark:text-dark-muted font-serif">Average per Link</p>
          <div className="mt-4 bg-vintage-cream dark:bg-dark-bg rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(engagementRate, 100)}%` }}
              transition={{ duration: 1, delay: 0.9 }}
              className="h-full bg-gradient-to-r from-vintage-brass to-vintage-gold"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-br from-vintage-gold/10 to-vintage-brass/10 rounded-2xl p-6 border border-vintage-gold/30"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-vintage font-bold text-vintage-black dark:text-dark-text">Share Rate</h3>
            <Share2 className="w-5 h-5 text-vintage-gold" />
          </div>
          <div className="text-4xl font-vintage font-bold text-vintage-gold mb-2">
            {stats.totalClicks > 0 ? ((stats.totalShares / stats.totalClicks) * 100).toFixed(1) : 0}%
          </div>
          <p className="text-sm text-vintage-brown dark:text-dark-muted font-serif">Clicks to Shares</p>
          <div className="mt-4 bg-vintage-cream dark:bg-dark-bg rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((stats.totalShares / stats.totalClicks) * 100, 100)}%` }}
              transition={{ duration: 1, delay: 1 }}
              className="h-full bg-gradient-to-r from-vintage-gold to-vintage-brass"
            />
          </div>
        </motion.div>
      </div>

      {/* Top Links & Category Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Links */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-vintage-paper dark:bg-dark-card rounded-2xl p-6 shadow-vault border border-vintage-gold/20 dark:border-dark-border"
        >
          <h3 className="text-xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-6 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-vintage-gold" />
            <span>Top Performing Links</span>
          </h3>
          {stats.topLinks && stats.topLinks.length > 0 ? (
            <div className="space-y-3">
              {stats.topLinks.slice(0, 5).map((link, index) => (
                <motion.div
                  key={link._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-vintage-cream dark:bg-dark-bg rounded-xl border border-vintage-gold/10 dark:border-dark-border hover:border-vintage-gold/30 transition-all"
                >
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-vintage-gold to-vintage-brass text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif font-semibold text-vintage-black dark:text-dark-text truncate">
                        {link.title}
                      </h4>
                      <p className="text-xs text-vintage-brown dark:text-dark-muted truncate">
                        {link.url}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-vintage-brown dark:text-dark-muted ml-4">
                    <div className="flex items-center space-x-1">
                      <Eye size={14} className="text-vintage-gold" />
                      <span className="font-medium">{link.clickCount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ExternalLink size={14} className="text-vintage-brass" />
                      <span className="font-medium">{link.referralCount || 0}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-vintage-brown dark:text-dark-muted font-serif">No data available</p>
          )}
        </motion.div>

        {/* Category Performance */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
          className="bg-vintage-paper dark:bg-dark-card rounded-2xl p-6 shadow-vault border border-vintage-gold/20 dark:border-dark-border"
        >
          <h3 className="text-xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-6 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-vintage-gold" />
            <span>Category Performance</span>
          </h3>
          {stats.categoryStats && stats.categoryStats.length > 0 ? (
            <div className="space-y-4">
              {stats.categoryStats.slice(0, 6).map((cat, index) => {
                const maxCount = Math.max(...stats.categoryStats.map(c => c.count))
                const percentage = (cat.count / maxCount) * 100
                return (
                  <motion.div
                    key={cat._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 + index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-serif font-medium text-vintage-black dark:text-dark-text capitalize">
                        {cat._id}
                      </span>
                      <div className="flex items-center space-x-3 text-xs text-vintage-brown dark:text-dark-muted">
                        <span className="font-medium">{cat.count} links</span>
                        <span className="text-vintage-gold">{cat.clicks || 0} clicks</span>
                      </div>
                    </div>
                    <div className="bg-vintage-cream dark:bg-dark-bg rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, delay: 1.2 + index * 0.1 }}
                        className="h-full bg-gradient-to-r from-vintage-gold to-vintage-brass"
                      />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <p className="text-vintage-brown dark:text-dark-muted font-serif">No data available</p>
          )}
        </motion.div>
      </div>

      {/* Recent Activity */}
      {stats.recentLinks && stats.recentLinks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="bg-vintage-paper dark:bg-dark-card rounded-2xl p-6 shadow-vault border border-vintage-gold/20 dark:border-dark-border"
        >
          <h3 className="text-xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-6 flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-vintage-gold" />
            <span>Recently Added</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.recentLinks.map((link, index) => (
              <motion.div
                key={link._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.6 + index * 0.1 }}
                className="p-4 bg-vintage-cream dark:bg-dark-bg rounded-xl border border-vintage-gold/10 dark:border-dark-border hover:border-vintage-gold/30 transition-all"
              >
                <h4 className="font-serif font-semibold text-vintage-black dark:text-dark-text mb-2 truncate">
                  {link.title}
                </h4>
                <div className="flex items-center justify-between text-xs text-vintage-brown dark:text-dark-muted">
                  <span className="capitalize bg-vintage-gold/10 px-2 py-1 rounded">{link.category}</span>
                  <span>{new Date(link.createdAt).toLocaleDateString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default AdminOverview
