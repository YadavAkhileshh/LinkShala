const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? 'https://linkshala-backend.onrender.com/api' : 'http://localhost:5002/api');

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('admin_token');
    this.refreshToken();
  }

  refreshToken() {
    this.token = localStorage.getItem('admin_token');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token && options.requireAuth !== false) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      
      // Handle empty responses
      if (response.status === 204) {
        return {};
      }
      
      const text = await response.text();
      let data;
      
      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError, 'Response text:', text);
        throw new Error('Invalid server response');
      }

      if (!response.ok) {
        if (response.status === 401 && data.error === 'Invalid token.') {
          this.adminLogout();
          window.location.reload();
        }
        throw new Error(data.error || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Public API methods
  async getLinks(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/links?${queryString}`, { requireAuth: false });
  }

  async getLink(id) {
    return this.request(`/links/${id}`, { requireAuth: false });
  }

  async shareLink(id) {
    return this.request(`/links/${id}/share`, {
      method: 'POST',
      requireAuth: false
    });
  }

  async getCategoryStats() {
    return this.request('/links/stats/categories', { requireAuth: false });
  }

  // Admin API methods
  async adminLogin(password) {
    const data = await this.request('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
      requireAuth: false
    });
    
    if (data.token) {
      this.token = data.token;
      localStorage.setItem('admin_token', data.token);
    }
    
    return data;
  }

  async adminLogout() {
    this.token = null;
    localStorage.removeItem('admin_token');
  }

  async getAdminLinks(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/links?${queryString}`);
  }

  async createLink(linkData) {
    return this.request('/admin/links', {
      method: 'POST',
      body: JSON.stringify(linkData)
    });
  }

  async updateLink(id, linkData) {
    return this.request(`/admin/links/${id}`, {
      method: 'PUT',
      body: JSON.stringify(linkData)
    });
  }

  async deleteLink(id) {
    return this.request(`/admin/links/${id}`, {
      method: 'DELETE'
    });
  }

  async bulkDeleteLinks(ids) {
    return this.request('/admin/links/delete-bulk', {
      method: 'POST',
      body: JSON.stringify({ ids })
    });
  }

  async bulkCreateLinks(links) {
    return this.request('/admin/links/create-bulk', {
      method: 'POST',
      body: JSON.stringify({ links })
    });
  }

  async getAdminStats() {
    return this.request('/admin/stats');
  }

  // Category API methods
  async getCategories() {
    return this.request('/admin/categories');
  }

  async createCategory(categoryData) {
    return this.request('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData)
    });
  }

  async updateCategory(id, categoryData) {
    return this.request(`/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData)
    });
  }

  async deleteCategory(id) {
    return this.request(`/admin/categories/${id}`, {
      method: 'DELETE'
    });
  }

  isAuthenticated() {
    return !!this.token;
  }
}

export default new ApiService();