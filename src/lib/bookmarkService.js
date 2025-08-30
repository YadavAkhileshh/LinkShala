class BookmarkService {
  constructor() {
    this.storageKey = 'linkshala_bookmarks';
  }

  // Get all bookmarks
  getBookmarks() {
    try {
      const bookmarks = localStorage.getItem(this.storageKey);
      return bookmarks ? JSON.parse(bookmarks) : [];
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      return [];
    }
  }

  // Add bookmark
  addBookmark(link) {
    try {
      const bookmarks = this.getBookmarks();
      const bookmark = {
        ...link,
        bookmarkedAt: new Date().toISOString(),
        id: link._id || link.id
      };
      
      // Check if already bookmarked
      if (!bookmarks.find(b => b.id === bookmark.id)) {
        bookmarks.unshift(bookmark);
        localStorage.setItem(this.storageKey, JSON.stringify(bookmarks));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding bookmark:', error);
      return false;
    }
  }

  // Remove bookmark
  removeBookmark(linkId) {
    try {
      const bookmarks = this.getBookmarks();
      const filtered = bookmarks.filter(b => b.id !== linkId);
      localStorage.setItem(this.storageKey, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error removing bookmark:', error);
      return false;
    }
  }

  // Check if bookmarked
  isBookmarked(linkId) {
    const bookmarks = this.getBookmarks();
    return bookmarks.some(b => b.id === linkId);
  }

  // Get bookmark count
  getBookmarkCount() {
    return this.getBookmarks().length;
  }

  // Clear all bookmarks
  clearBookmarks() {
    localStorage.removeItem(this.storageKey);
  }
}

export default new BookmarkService();