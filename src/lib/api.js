const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? 'https://linkshala-backend.onrender.com/api' : 'http://localhost:5000/api');

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
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
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
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

  async bulkCreateLinks(links) {
    return this.request('/admin/links/bulk', {
      method: 'POST',
      body: JSON.stringify({ links })
    });
  }

  async getAdminStats() {
    return this.request('/admin/stats');
  }

  isAuthenticated() {
    return !!this.token;
  }
}

export default new ApiService();