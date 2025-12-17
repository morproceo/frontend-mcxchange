import type {
  ApiResponse,
  AuthLoginResponse,
  AuthRegisterResponse,
  AuthTokens,
  SubscriptionResponse,
  CheckoutSessionResponse,
  UserResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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
    // Always check localStorage as fallback to handle hot-reload and timing issues
    return this.token || localStorage.getItem('mcx_token');
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

    // Always check localStorage for the most current token
    // This ensures we pick up tokens set by other tabs or after hot-reload
    const currentToken = this.token || localStorage.getItem('mcx_token');
    if (currentToken) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${currentToken}`;
      // Sync instance token if it was only in localStorage
      if (!this.token && currentToken) {
        this.token = currentToken;
      }
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
    const response = await this.request<ApiResponse<AuthLoginResponse>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (!response.data) {
      throw new Error('Invalid response from server');
    }

    // Backend returns tokens in a nested object: data.tokens.accessToken
    this.setToken(response.data.tokens.accessToken);
    localStorage.setItem('mcx_refresh_token', response.data.tokens.refreshToken);

    // Return flattened structure for compatibility with rest of app
    return {
      user: response.data.user,
      accessToken: response.data.tokens.accessToken,
      refreshToken: response.data.tokens.refreshToken,
    };
  }

  async register(data: { email: string; password: string; name: string; role: string }) {
    const response = await this.request<ApiResponse<AuthRegisterResponse>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.data) {
      throw new Error('Invalid response from server');
    }

    // Backend returns tokens in a nested object: data.tokens.accessToken
    this.setToken(response.data.tokens.accessToken);
    localStorage.setItem('mcx_refresh_token', response.data.tokens.refreshToken);

    // Return flattened structure for compatibility with rest of app
    return {
      user: response.data.user,
      accessToken: response.data.tokens.accessToken,
      refreshToken: response.data.tokens.refreshToken,
    };
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
    const response = await this.request<{ success: boolean; data: any }>('/auth/me');
    return { user: response.data };
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('mcx_refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token');
    }

    const response = await this.request<{
      success: boolean;
      data: {
        accessToken: string;
        refreshToken: string;
      };
    }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    this.setToken(response.data.accessToken);
    localStorage.setItem('mcx_refresh_token', response.data.refreshToken);

    return response.data;
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

  async getAdminListing(listingId: string) {
    return this.request<any>(`/admin/listings/${listingId}`);
  }

  async updateAdminListing(listingId: string, data: {
    mcNumber?: string;
    dotNumber?: string;
    legalName?: string;
    dbaName?: string;
    title?: string;
    description?: string;
    price?: number;
    city?: string;
    state?: string;
    address?: string;
    yearsActive?: number;
    fleetSize?: number;
    totalDrivers?: number;
    safetyRating?: string;
    saferScore?: string;
    insuranceOnFile?: boolean;
    bipdCoverage?: number;
    cargoCoverage?: number;
    bondAmount?: number;
    amazonStatus?: string;
    amazonRelayScore?: string;
    highwaySetup?: boolean;
    sellingWithEmail?: boolean;
    sellingWithPhone?: boolean;
    contactEmail?: string;
    contactPhone?: string;
    cargoTypes?: string[];
    reviewNotes?: string;
    status?: string;
    visibility?: string;
    isPremium?: boolean;
  }) {
    return this.request<any>(`/admin/listings/${listingId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
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

  // Buyer subscription endpoints
  async getSubscription() {
    return this.request<ApiResponse<SubscriptionResponse>>('/buyer/subscription');
  }

  async createSubscriptionCheckout(plan: string, isYearly: boolean) {
    return this.request<ApiResponse<CheckoutSessionResponse>>('/buyer/subscription/checkout', {
      method: 'POST',
      body: JSON.stringify({ plan, isYearly }),
    });
  }

  async cancelSubscription() {
    return this.request<ApiResponse<{ message: string; subscription: SubscriptionResponse['subscription'] }>>('/buyer/subscription/cancel', {
      method: 'POST',
    });
  }

  async verifySubscription() {
    return this.request<ApiResponse<{
      fulfilled: boolean;
      message: string;
      subscription?: SubscriptionResponse;
    }>>('/buyer/subscription/verify', {
      method: 'POST',
    });
  }

  // Seller endpoints
  async getSellerDashboard() {
    return this.request<any>('/seller/dashboard');
  }

  async getSellerListings(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.status) searchParams.set('status', params.status);

    const query = searchParams.toString();
    return this.request<{
      success: boolean;
      data: any[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>(`/seller/listings${query ? `?${query}` : ''}`);
  }

  async getSellerOffers(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.status) searchParams.set('status', params.status);

    const query = searchParams.toString();
    return this.request<any>(`/seller/offers${query ? `?${query}` : ''}`);
  }

  // Listing fee checkout
  async createListingFeeCheckout(mcNumber: string, successUrl: string, cancelUrl: string) {
    return this.request<{
      success: boolean;
      data: {
        sessionId: string;
        url: string;
      };
    }>('/seller/listing-fee/checkout', {
      method: 'POST',
      body: JSON.stringify({ mcNumber, successUrl, cancelUrl }),
    });
  }

  // Create listing
  async createListing(data: {
    mcNumber: string;
    dotNumber: string;
    legalName: string;
    dbaName?: string;
    title: string;
    description?: string;
    price: number;
    city: string;
    state: string;
    address?: string;
    yearsActive?: number;
    fleetSize?: number;
    totalDrivers?: number;
    safetyRating?: string;
    insuranceOnFile?: boolean;
    bipdCoverage?: number;
    cargoCoverage?: number;
    bondAmount?: number;
    amazonStatus?: string;
    amazonRelayScore?: string;
    highwaySetup?: boolean;
    sellingWithEmail?: boolean;
    sellingWithPhone?: boolean;
    contactEmail?: string;
    contactPhone?: string;
    cargoTypes?: string[];
    submitForReview?: boolean;
  }) {
    return this.request<{
      success: boolean;
      data: any;
      message: string;
    }>('/listings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Unlock a listing (uses 1 credit)
  async unlockListing(listingId: string) {
    return this.request<{
      success: boolean;
      data: {
        alreadyUnlocked?: boolean;
      };
      message: string;
    }>(`/listings/${listingId}/unlock`, {
      method: 'POST',
    });
  }

  // Get user's unlocked listings
  async getUnlockedListings(params?: { page?: number; limit?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());

    const query = searchParams.toString();
    return this.request<{
      success: boolean;
      data: any[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>(`/listings/unlocked${query ? `?${query}` : ''}`);
  }

  // Check if a specific listing is unlocked by the user
  async checkListingUnlocked(listingId: string) {
    try {
      const response = await this.getUnlockedListings({ limit: 1000 });
      const unlockedIds = response.data.map((item: any) => item.id);
      return unlockedIds.includes(listingId);
    } catch {
      return false;
    }
  }

  // Offer endpoints
  async createOffer(data: {
    listingId: string;
    amount: number;
    message?: string;
    isBuyNow?: boolean;
  }) {
    return this.request<{
      success: boolean;
      data: any;
      message: string;
    }>('/offers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getBuyerOffers(params?: { status?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    const query = searchParams.toString();
    return this.request<{
      success: boolean;
      data: any[];
    }>(`/offers/my-offers${query ? `?${query}` : ''}`);
  }

  // Admin offer endpoints
  async getAdminOffers(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.status) searchParams.set('status', params.status);
    const query = searchParams.toString();
    return this.request<{
      success: boolean;
      data: any[];
      pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>(`/admin/offers${query ? `?${query}` : ''}`);
  }

  async approveOffer(offerId: string, notes?: string) {
    return this.request<{
      success: boolean;
      data: any;
      message: string;
    }>(`/admin/offers/${offerId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
  }

  async rejectOffer(offerId: string, reason: string) {
    return this.request<{
      success: boolean;
      data: any;
      message: string;
    }>(`/admin/offers/${offerId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  // Buyer offer actions
  async withdrawOffer(offerId: string) {
    return this.request<{
      success: boolean;
      data: any;
      message: string;
    }>(`/offers/${offerId}/withdraw`, {
      method: 'POST',
    });
  }

  async acceptCounterOffer(offerId: string) {
    return this.request<{
      success: boolean;
      data: any;
      message: string;
    }>(`/offers/${offerId}/accept-counter`, {
      method: 'POST',
    });
  }

  // Get single offer by ID
  async getOffer(offerId: string) {
    return this.request<{
      success: boolean;
      data: any;
    }>(`/offers/${offerId}`);
  }

  // Deposit payment for an offer/transaction
  async createDepositCheckout(offerId: string) {
    return this.request<{
      success: boolean;
      data: {
        sessionId: string;
        url: string;
      };
    }>(`/offers/${offerId}/deposit-checkout`, {
      method: 'POST',
    });
  }

  // Get buyer's transactions
  async getBuyerTransactions(params?: { page?: number; limit?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());

    const query = searchParams.toString();
    return this.request<{
      success: boolean;
      data: any[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>(`/buyer/transactions${query ? `?${query}` : ''}`);
  }

  // Get single transaction by ID
  async getTransaction(transactionId: string) {
    return this.request<{
      success: boolean;
      data: any;
    }>(`/transactions/${transactionId}`);
  }

  // Create deposit checkout for a transaction (Stripe)
  async createTransactionDepositCheckout(transactionId: string) {
    return this.request<{
      success: boolean;
      data: {
        sessionId: string;
        url: string;
      };
    }>(`/transactions/${transactionId}/deposit-checkout`, {
      method: 'POST',
    });
  }

  // Record deposit payment (Zelle/Wire/Check)
  async recordDeposit(transactionId: string, paymentMethod: 'STRIPE' | 'ZELLE' | 'WIRE' | 'CHECK', reference?: string) {
    return this.request<{
      success: boolean;
      data: any;
      message: string;
    }>(`/transactions/${transactionId}/deposit`, {
      method: 'POST',
      body: JSON.stringify({ paymentMethod, reference }),
    });
  }
}

export const api = new ApiService();
export default api;
