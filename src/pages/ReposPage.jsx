import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Star, GitFork, ExternalLink, Clock, RefreshCw, Bookmark, BookmarkCheck, History, X, ArrowUpRight } from 'lucide-react';
import apiService from '../lib/api';
import bookmarkService from '../lib/bookmarkService';

const ReposPage = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [bookmarkedRepos, setBookmarkedRepos] = useState(new Set());
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
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

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const data = await apiService.getGithubReposHistory();
      setHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      setHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleShowHistory = () => {
    setShowHistory(true);
    fetchHistory();
  };

  useEffect(() => {
    if (showHistory) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showHistory]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fefdfb] dark:bg-[#0c0c0c] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-vintage-gold/30 border-t-vintage-gold rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">Loading repositories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fefdfb] dark:bg-[#0c0c0c] transition-colors duration-300">
      {/* Header */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 md:mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-vintage-gold/10 dark:bg-vintage-gold/5 border border-vintage-gold/20 rounded-full mb-4 md:mb-6">
              <Github size={14} className="text-vintage-gold" />
              <span className="text-xs sm:text-sm font-medium text-vintage-gold">Open Source</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-vintage text-gray-900 dark:text-white mb-3 md:mb-4">
              GitHub Repositories
            </h1>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-lg mx-auto px-4">
              Handpicked open-source projects for developers. Updated daily with the best repos.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 md:mb-12">
            <button
              onClick={handleShowHistory}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/[0.08] text-gray-700 dark:text-gray-300 rounded-lg text-xs sm:text-sm font-medium hover:border-vintage-gold/30 transition-colors"
            >
              <History size={14} />
              <span>History</span>
            </button>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-vintage-gold hover:bg-vintage-brass text-white rounded-lg text-xs sm:text-sm font-medium transition-colors disabled:opacity-50"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Repos Grid */}
      <section className="pb-12 md:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-5">
            {repos.map((repo, index) => (
              <motion.a
                key={repo.id}
                href={`${repo.url}?ref=linkshala`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="group block"
              >
                <div className="h-full bg-white dark:bg-[#141414] rounded-xl border border-gray-200/80 dark:border-white/[0.08] p-5 sm:p-6 hover:border-vintage-gold/30 hover:shadow-sm transition-all duration-200">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-vintage-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Github size={16} className="text-vintage-gold sm:w-[18px] sm:h-[18px]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 truncate">{repo.owner}</p>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {repo.repoName}
                        </h3>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleBookmark(repo);
                      }}
                      className={`p-2 rounded-lg transition-colors flex-shrink-0 ${bookmarkedRepos.has(repo.url)
                          ? 'text-vintage-gold bg-vintage-gold/10'
                          : 'text-gray-300 dark:text-gray-600 hover:text-vintage-gold hover:bg-vintage-gold/5'
                        }`}
                    >
                      {bookmarkedRepos.has(repo.url) ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                    </button>
                  </div>

                  {/* Title */}
                  <h4 className="text-[14px] sm:text-[15px] font-medium text-gray-900 dark:text-white mb-2 line-clamp-2 leading-snug group-hover:text-vintage-gold transition-colors">
                    {repo.title}
                  </h4>

                  {/* Description - Now showing properly */}
                  {repo.description && repo.description !== 'No description available' ? (
                    <p className="text-[12px] sm:text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed mb-4 line-clamp-3">
                      {repo.description}
                    </p>
                  ) : (
                    <p className="text-[12px] sm:text-[13px] text-gray-400 dark:text-gray-500 leading-relaxed mb-4 italic">
                      Open source repository on GitHub
                    </p>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
                    <span className="flex items-center gap-1 text-[9px] sm:text-[10px] text-vintage-gold bg-vintage-gold/10 px-2 py-1 rounded">
                      <Star size={9} />
                      Featured
                    </span>
                    <span className="flex items-center gap-1 text-[9px] sm:text-[10px] text-gray-500 bg-gray-50 dark:bg-white/[0.03] px-2 py-1 rounded">
                      <GitFork size={9} />
                      Open Source
                    </span>
                  </div>

                  {/* Footer - Single CTA */}
                  <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100 dark:border-white/[0.05]">
                    <span className="text-[11px] sm:text-xs text-gray-400 truncate">
                      github.com/{repo.owner}
                    </span>
                    <span className="flex items-center gap-1 text-vintage-gold text-xs sm:text-sm font-medium group-hover:gap-2 transition-all">
                      View Repo
                      <ArrowUpRight size={14} />
                    </span>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>

          {repos.length === 0 && (
            <div className="text-center py-16 sm:py-20">
              <Github size={36} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-vintage text-gray-900 dark:text-white mb-2">
                No repositories found
              </h3>
              <p className="text-gray-500 text-sm">
                Check back later for fresh repositories
              </p>
            </div>
          )}
        </div>
      </section>

      {/* History Modal */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowHistory(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#141414] rounded-xl w-full max-w-lg sm:max-w-2xl max-h-[85vh] sm:max-h-[80vh] overflow-hidden shadow-xl border border-gray-200 dark:border-white/[0.08]"
            >
              {/* Header */}
              <div className="bg-vintage-gold p-4 sm:p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white/20 rounded-lg flex items-center justify-center">
                    <History size={16} className="text-white sm:w-[18px] sm:h-[18px]" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-semibold text-white">Repository History</h2>
                    <p className="text-white/70 text-[10px] sm:text-xs">Previously featured repos</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowHistory(false)}
                  className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
                >
                  <X size={14} className="text-white sm:w-[16px] sm:h-[16px]" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5 overflow-y-auto max-h-[calc(85vh-70px)] sm:max-h-[calc(80vh-80px)]">
                {loadingHistory ? (
                  <div className="text-center py-10 sm:py-12">
                    <div className="w-6 h-6 border-2 border-vintage-gold/30 border-t-vintage-gold rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Loading history...</p>
                  </div>
                ) : history.length === 0 ? (
                  <div className="text-center py-10 sm:py-12">
                    <History size={28} className="text-gray-300 mx-auto mb-3" />
                    <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white mb-1">
                      No history yet
                    </h3>
                    <p className="text-gray-500 text-xs sm:text-sm">
                      Repositories will appear here as they are featured
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {history.map((repo, index) => (
                      <a
                        key={repo.id}
                        href={`${repo.url}?ref=linkshala`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-gray-50 dark:bg-white/[0.02] rounded-lg p-3 sm:p-4 border border-gray-100 dark:border-white/[0.04] hover:border-vintage-gold/20 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3 sm:gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Github size={12} className="text-vintage-gold flex-shrink-0 sm:w-[14px] sm:h-[14px]" />
                              <h3 className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                                {repo.owner}/{repo.repoName}
                              </h3>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 truncate">
                              {repo.title}
                            </p>
                            {repo.addedAt && (
                              <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-gray-400">
                                <Clock size={9} />
                                <span>{new Date(repo.addedAt).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-vintage-gold hover:bg-vintage-brass rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                            <ExternalLink size={12} className="text-white sm:w-[14px] sm:h-[14px]" />
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReposPage;
