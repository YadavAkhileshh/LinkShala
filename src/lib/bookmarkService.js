import { supabase } from './supabase'

class BookmarkService {
  constructor() {
    this.storageKey = 'linkshala_bookmarks';
  }

  async getBookmarks() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        const bookmarks = localStorage.getItem(this.storageKey)
        return bookmarks ? JSON.parse(bookmarks) : []
      }

      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data.map(b => ({
        ...b.link_data,
        id: b.link_id,
        bookmarkedAt: b.created_at
      }))
    } catch (error) {
      console.error('Error loading bookmarks:', error)
      const bookmarks = localStorage.getItem(this.storageKey)
      return bookmarks ? JSON.parse(bookmarks) : []
    }
  }

  async addBookmark(link) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const linkData = {
        ...link,
        bookmarkedAt: new Date().toISOString(),
        id: link._id || link.id
      }
      
      if (!user) {
        const bookmarks = this.getLocalBookmarks()
        if (!bookmarks.find(b => b.id === linkData.id)) {
          bookmarks.unshift(linkData)
          localStorage.setItem(this.storageKey, JSON.stringify(bookmarks))
          return true
        }
        return false
      }

      const { error } = await supabase
        .from('bookmarks')
        .insert({
          user_id: user.id,
          link_id: linkData.id,
          link_data: linkData
        })

      if (error && error.code !== '23505') throw error
      return true
    } catch (error) {
      console.error('Error adding bookmark:', error)
      return false
    }
  }

  async removeBookmark(linkId) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        const bookmarks = this.getLocalBookmarks()
        const filtered = bookmarks.filter(b => b.id !== linkId)
        localStorage.setItem(this.storageKey, JSON.stringify(filtered))
        return true
      }

      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', user.id)
        .eq('link_id', linkId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error removing bookmark:', error)
      return false
    }
  }

  async isBookmarked(linkId) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        const bookmarks = this.getLocalBookmarks()
        return bookmarks.some(b => b.id === linkId)
      }

      const { data, error } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', user.id)
        .eq('link_id', linkId)
        .single()

      return !error && !!data
    } catch (error) {
      return false
    }
  }

  getLocalBookmarks() {
    try {
      const bookmarks = localStorage.getItem(this.storageKey)
      return bookmarks ? JSON.parse(bookmarks) : []
    } catch (error) {
      return []
    }
  }

  async getBookmarkCount() {
    const bookmarks = await this.getBookmarks()
    return bookmarks.length
  }

  async clearBookmarks() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        localStorage.removeItem(this.storageKey)
        return
      }

      await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', user.id)
    } catch (error) {
      console.error('Error clearing bookmarks:', error)
    }
  }

  async exportBookmarks() {
    const bookmarks = await this.getBookmarks()
    const dataStr = JSON.stringify(bookmarks, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `linkshala-bookmarks-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  async importBookmarks(file) {
    try {
      const text = await file.text()
      const bookmarks = JSON.parse(text)
      
      if (!Array.isArray(bookmarks)) {
        throw new Error('Invalid bookmark file format')
      }

      let imported = 0
      for (const bookmark of bookmarks) {
        const success = await this.addBookmark(bookmark)
        if (success) imported++
      }

      return { success: true, imported, total: bookmarks.length }
    } catch (error) {
      console.error('Error importing bookmarks:', error)
      return { success: false, error: error.message }
    }
  }
}

export default new BookmarkService()
