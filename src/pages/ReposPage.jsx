import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Star, GitFork, ExternalLink, Clock, User, RefreshCw, Bookmark, Code2, Eye } from 'lucide-react';
import apiService from '../lib/api';
import bookmarkService from '../lib/bookmarkService';

const ReposPage = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [bookmarkedRepos, setBookmarkedRepos] = useState(new Set());

  useEffect(() => {
    fetchRepos();
    loadBookmarks();
  }, []);

  const loadBookmarks = () => {
    const bookmarks = bookmarkService.getBookmarks();
    const bookmarksArray = Array.isArray(bookmarks) ? bookmarks : [];
    const repoUrls = new Set(bookmarksArray.filter(b => b.url?.includes('github.com')).map(b => b.url));
    setBookmarkedRepos(repoUrls);
  };

  const toggleBookmark = (repo) => {
    const linkData = {
      _id: `github-${repo.owner}-${repo.repoName}`,
      title: repo.repoName,
      description: repo.title,
      url: repo.url,
      category: 'GitHub',
      tags: ['github', 'open-source']
    };

    if (bookmarkedRepos.has(repo.url)) {
      bookmarkService.removeBookmark(linkData._id);
      setBookmarkedRepos(prev => {
        const newSet = new Set(prev);
        newSet.delete(repo.url);
        return newSet;
      });
    } else {
      bookmarkService.addBookmark(linkData);
      setBookmarkedRepos(prev => new Set([...prev, repo.url]));
    }
  };

  const fetchRepos = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      
      const data = await apiService.getGithubRepos();
      
      if (Array.isArray(data)) {
        setRepos(data);
      } else {
        setRepos([]);
      }
    } catch (error) {
      setRepos([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchRepos(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-vintage-cream dark:bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <Github size={48} className="text-vintage-gold animate-pulse mx-auto mb-4" />
          <p className="text-vintage-brown dark:text-dark-muted font-serif">Loading repos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vintage-cream dark:bg-dark-bg transition-colors duration-300">
      {/* Header */}
      <section className="relative py-16 px-6 lg:px-8 bg-vintage-paper dark:bg-dark-card border-b border-vintage-gold/20 dark:border-dark-border">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-vintage-gold to-vintage-brass rounded-2xl flex items-center justify-center shadow-lg">
                  <Github size={32} className="text-white" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-vintage font-bold text-vintage-black dark:text-dark-text">
                    GitHub Repos
                  </h1>
                  <p className="text-vintage-brown dark:text-dark-muted font-serif mt-2">
                    Handpicked repositories • Updated daily
                  </p>
                </div>
              </div>
              
              <motion.button
                onClick={handleRefresh}
                disabled={refreshing}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-4 py-2 bg-vintage-gold text-white rounded-lg font-semibold shadow-md hover:bg-vintage-brass transition-colors disabled:opacity-50"
              >
                <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Repos Grid */}
      <section className="py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.map((repo, index) => (
              <motion.div
                key={repo.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-vintage-gold/20 to-vintage-brass/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative bg-vintage-paper dark:bg-dark-card rounded-2xl p-6 border-2 border-vintage-gold/20 dark:border-dark-border hover:border-vintage-gold/40 transition-all duration-300 shadow-lg h-full flex flex-col">
                  {/* Bookmark Button */}
                  <motion.button
                    onClick={() => toggleBookmark(repo)}
                    className="absolute -top-3 -right-3 z-10"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
                      bookmarkedRepos.has(repo.url)
                        ? 'bg-gradient-to-br from-vintage-gold to-vintage-brass'
                        : 'bg-vintage-paper dark:bg-dark-card border-2 border-vintage-gold/40'
                    }`}>
                      <Bookmark 
                        size={20} 
                        className={bookmarkedRepos.has(repo.url) ? 'text-white fill-white' : 'text-vintage-gold'} 
                      />
                    </div>
                  </motion.button>

                  {/* Owner Badge */}
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-vintage-gold/20 to-vintage-brass/20 rounded-full flex items-center justify-center border-2 border-vintage-gold/30">
                      <User size={18} className="text-vintage-gold" />
                    </div>
                    <div>
                      <p className="text-xs text-vintage-brown/60 dark:text-dark-muted/60 font-semibold">Repository by</p>
                      <p className="text-sm font-bold text-vintage-black dark:text-dark-text">{repo.owner}</p>
                    </div>
                  </div>

                  {/* Repo Name with Icon */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Github size={22} className="text-vintage-gold" />
                      <h3 className="text-2xl font-vintage font-bold text-vintage-black dark:text-dark-text line-clamp-1">
                        {repo.repoName}
                      </h3>
                    </div>
                    <p className="text-base font-semibold text-vintage-brass dark:text-dark-accent line-clamp-2 leading-snug">
                      {repo.title}
                    </p>
                  </div>

                  {/* Description */}
                  {repo.description && repo.description !== 'No description available' && (
                    <p className="text-vintage-brown dark:text-dark-muted font-sans text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                      {repo.description}
                    </p>
                  )}
                  {(!repo.description || repo.description === 'No description available') && (
                    <div className="mb-6 flex-grow" />
                  )}

                  {/* Stats Row */}
                  <div className="flex items-center space-x-4 mb-4 pb-4 border-b border-vintage-gold/20">
                    <motion.div 
                      className="flex items-center space-x-1"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Star size={16} className="text-vintage-gold" />
                      <span className="text-xs font-semibold text-vintage-brown dark:text-dark-muted">Featured</span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center space-x-1"
                      whileHover={{ scale: 1.1 }}
                    >
                      <GitFork size={16} className="text-vintage-brass" />
                      <span className="text-xs font-semibold text-vintage-brown dark:text-dark-muted">Open Source</span>
                    </motion.div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <motion.a
                      href={`${repo.url}?ref=linkshala`}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-vintage-gold to-vintage-brass text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-2xl transition-all relative overflow-hidden group"
                    >
                      <motion.div
                        className="absolute inset-0 bg-white/20"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.5 }}
                      />
                      <Code2 size={18} className="relative z-10" />
                      <span className="relative z-10">Explore Code</span>
                    </motion.a>
                    <motion.a
                      href={`${repo.url}?ref=linkshala`}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                      whileTap={{ scale: 0.9 }}
                      className="w-12 h-12 flex items-center justify-center bg-vintage-paper dark:bg-dark-bg border-2 border-vintage-gold/40 rounded-xl hover:bg-vintage-gold/10 transition-all group"
                    >
                      <Eye size={18} className="text-vintage-gold group-hover:scale-110 transition-transform" />
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {repos.length === 0 && (
            <div className="text-center py-24">
              <Github size={64} className="text-vintage-gold/40 mx-auto mb-4" />
              <h3 className="text-2xl font-vintage font-bold text-vintage-black dark:text-dark-text mb-2">
                No repos found
              </h3>
              <p className="text-vintage-brown dark:text-dark-muted font-serif">
                Check back later for fresh repositories
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ReposPage;
