const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on init
    this.token = localStorage.getItem('mcx_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('mcx_token', token);
    } else {
      localStorage.removeItem('mcx_token');
    }
  }

  getToken() {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'API request failed');
    }

    return data;
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.request<{
      user: any;
      accessToken: string;
      refreshToken: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    this.setToken(response.accessToken);
    localStorage.setItem('mcx_refresh_token', response.refreshToken);

    return response;
  }

  async register(data: { email: string; password: string; name: string; role: string }) {
    const response = await this.request<{
      user: any;
      accessToken: string;
      refreshToken: string;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    this.setToken(response.accessToken);
    localStorage.setItem('mcx_refresh_token', response.refreshToken);

    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.setToken(null);
      localStorage.removeItem('mcx_refresh_token');
    }
  }

  async getCurrentUser() {
    return this.request<{ user: any }>('/auth/me');
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('mcx_refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token');
    }

    const response = await this.request<{
      accessToken: string;
      refreshToken: string;
    }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    this.setToken(response.accessToken);
    localStorage.setItem('mcx_refresh_token', response.refreshToken);

    return response;
  }

  // Admin endpoints
  async getAdminDashboard() {
    return this.request<any>('/admin/dashboard');
  }

  async getAdminUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.role) searchParams.set('role', params.role);
    if (params?.status) searchParams.set('status', params.status);

    const query = searchParams.toString();
    return this.request<{
      users: any[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>(`/admin/users${query ? `?${query}` : ''}`);
  }

  async getAdminUserDetails(userId: string) {
    return this.request<any>(`/admin/users/${userId}`);
  }

  async blockUser(userId: string, reason: string) {
    return this.request<any>(`/admin/users/${userId}/block`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async unblockUser(userId: string) {
    return this.request<any>(`/admin/users/${userId}/unblock`, {
      method: 'POST',
    });
  }

  async verifySeller(userId: string) {
    return this.request<any>(`/admin/users/${userId}/verify-seller`, {
      method: 'POST',
    });
  }

  async getAdminListings(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    isPremium?: boolean;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.isPremium !== undefined) searchParams.set('isPremium', params.isPremium.toString());

    const query = searchParams.toString();
    return this.request<any>(`/admin/listings${query ? `?${query}` : ''}`);
  }

  async approveListing(listingId: string, notes?: string) {
    return this.request<any>(`/admin/listings/${listingId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
  }

  async rejectListing(listingId: string, reason: string) {
    return this.request<any>(`/admin/listings/${listingId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  // Listings endpoints
  async getListings(params?: {
    page?: number;
    limit?: number;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    state?: string;
    amazonStatus?: string;
    sort?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.minPrice) searchParams.set('minPrice', params.minPrice.toString());
    if (params?.maxPrice) searchParams.set('maxPrice', params.maxPrice.toString());
    if (params?.state) searchParams.set('state', params.state);
    if (params?.amazonStatus) searchParams.set('amazonStatus', params.amazonStatus);
    if (params?.sort) searchParams.set('sort', params.sort);

    const query = searchParams.toString();
    return this.request<any>(`/listings${query ? `?${query}` : ''}`);
  }

  async getListing(id: string) {
    return this.request<any>(`/listings/${id}`);
  }

  // FMCSA endpoints
  async fmcsaLookupByMC(mcNumber: string) {
    return this.request<any>(`/fmcsa/mc/${mcNumber}`);
  }

  async fmcsaLookupByDOT(dotNumber: string) {
    return this.request<any>(`/fmcsa/dot/${dotNumber}`);
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string; timestamp: string }>('/health');
  }
}

export const api = new ApiService();
export default api;
