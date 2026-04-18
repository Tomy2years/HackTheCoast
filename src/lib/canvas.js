export class CanvasAPI {
  constructor() {
    this.baseUrl = '/api'; // Proxied by Vite to Python backend
  }

  async fetch(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = {
      'Accept': 'application/json',
      ...(options.headers || {}),
    };

    if (options.body) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getCourses() {
    return this.fetch('/courses');
  }

  async getAnnouncements() {
    return this.fetch('/announcements');
  }
}

// Global instance getter
let _canvasApiInstance = new CanvasAPI();

export const getCanvasAPI = () => {
  return _canvasApiInstance;
};

