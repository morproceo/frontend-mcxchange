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

  async getAdminPendingListings(params?: { page?: number; limit?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    const query = searchParams.toString();
    return this.request<any>(`/admin/listings/pending${query ? `?${query}` : ''}`);
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

  // Admin Create User
  async createAdminUser(data: {
    email: string;
    name: string;
    password: string;
    role: 'BUYER' | 'SELLER' | 'ADMIN';
    phone?: string;
    companyName?: string;
    createStripeAccount?: boolean;
  }) {
    return this.request<{
      success: boolean;
      data: {
        user: any;
        stripeAccount?: {
          accountId: string;
          onboardingUrl: string;
        };
      };
      message: string;
    }>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Admin Create Listing
  async createAdminListing(data: {
    sellerId: string;
    mcNumber: string;
    dotNumber?: string;
    legalName?: string;
    dbaName?: string;
    title: string;
    description?: string;
    askingPrice: number;
    state?: string;
    status?: string;
  }) {
    return this.request<{
      success: boolean;
      data: any;
      message: string;
    }>('/admin/listings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Admin Create User with Listing
  async createAdminUserWithListing(data: {
    user: {
      email: string;
      name: string;
      password: string;
      phone?: string;
      companyName?: string;
    };
    listing: {
      mcNumber: string;
      dotNumber?: string;
      legalName?: string;
      dbaName?: string;
      title: string;
      description?: string;
      askingPrice: number;
      state?: string;
      status?: string;
    };
    createStripeAccount?: boolean;
  }) {
    return this.request<{
      success: boolean;
      data: {
        user: any;
        listing: any;
        stripeAccount?: {
          accountId: string;
          onboardingUrl: string;
        };
      };
      message: string;
    }>('/admin/users/with-listing', {
      method: 'POST',
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

  // Messaging endpoints
  async getMessageConversations() {
    return this.request<{
      success: boolean;
      data: Array<{
        id: string;
        participantId: string;
        participantName: string;
        participantAvatar: string | null;
        lastMessage: string;
        lastMessageAt: string;
        unreadCount: number;
        listingId?: string;
      }>;
    }>('/messages/conversations');
  }

  async getMessageConversation(partnerId: string, params?: { page?: number; limit?: number }) {
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
    }>(`/messages/conversations/${partnerId}${query ? `?${query}` : ''}`);
  }

  async markConversationAsRead(partnerId: string) {
    return this.request<{ success: boolean; message: string }>(`/messages/conversations/${partnerId}/read`, {
      method: 'PUT',
    });
  }

  async sendMessage(receiverId: string, content: string, listingId?: string) {
    return this.request<{
      success: boolean;
      data: any;
      message: string;
    }>('/messages', {
      method: 'POST',
      body: JSON.stringify({ receiverId, content, listingId }),
    });
  }

  async sendInquiryToAdmin(listingId: string | undefined, content: string, contactPhone?: string) {
    return this.request<{
      success: boolean;
      data: any;
      message: string;
    }>('/messages/inquiries', {
      method: 'POST',
      body: JSON.stringify({ listingId, content, contactPhone }),
    });
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

  // Get current user's transactions (returns transactions based on user role)
  async getMyTransactions(params?: { page?: number; limit?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());

    const query = searchParams.toString();
    return this.request<{
      success: boolean;
      data: any[];
    }>(`/transactions${query ? `?${query}` : ''}`);
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

  // Verify deposit status by checking Stripe directly
  // This is a backup when webhooks don't fire (common in local dev)
  async verifyDepositStatus(transactionId: string) {
    return this.request<{
      success: boolean;
      data: {
        status: string;
        depositPaid: boolean;
        depositPaidAt?: string;
        amount?: number;
      };
      message: string;
    }>(`/transactions/${transactionId}/verify-deposit-status`, {
      method: 'POST',
    });
  }

  // Admin transactions endpoint
  async getAdminTransactions(params?: {
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
    }>(`/admin/transactions${query ? `?${query}` : ''}`);
  }

  // Buyer approve transaction
  async buyerApproveTransaction(transactionId: string) {
    return this.request<{
      success: boolean;
      data: any;
      message: string;
    }>(`/transactions/${transactionId}/buyer/approve`, {
      method: 'POST',
    });
  }

  // Seller approve transaction
  async sellerApproveTransaction(transactionId: string) {
    return this.request<{
      success: boolean;
      data: any;
      message: string;
    }>(`/transactions/${transactionId}/seller/approve`, {
      method: 'POST',
    });
  }

  // Admin approve transaction (final approval after buyer/seller approve)
  async adminApproveTransaction(transactionId: string) {
    return this.request<{
      success: boolean;
      data: any;
      message: string;
    }>(`/transactions/${transactionId}/admin/approve`, {
      method: 'POST',
    });
  }

  // Admin update transaction status
  async updateTransactionStatus(transactionId: string, status: string, notes?: string) {
    return this.request<{
      success: boolean;
      data: any;
      message: string;
    }>(`/transactions/${transactionId}/admin/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  }

  // Admin verify deposit payment
  async adminVerifyDeposit(transactionId: string, paymentId: string) {
    return this.request<{
      success: boolean;
      message: string;
    }>(`/transactions/${transactionId}/admin/verify-deposit/${paymentId}`, {
      method: 'POST',
    });
  }

  // Admin verify final payment
  async adminVerifyFinalPayment(transactionId: string, paymentId: string) {
    return this.request<{
      success: boolean;
      message: string;
    }>(`/transactions/${transactionId}/admin/verify-payment/${paymentId}`, {
      method: 'POST',
    });
  }

  // Record final payment (buyer submits payment with proof)
  async recordFinalPayment(
    transactionId: string,
    paymentMethod: 'ZELLE' | 'WIRE',
    reference?: string
  ) {
    return this.request<{
      success: boolean;
      data: {
        id: string;
        type: string;
        amount: number;
        method: string;
        status: string;
      };
      message: string;
    }>(`/transactions/${transactionId}/final-payment`, {
      method: 'POST',
      body: JSON.stringify({ paymentMethod, reference }),
    });
  }

  // Get buyer's Stripe payment history
  async getBuyerStripeHistory() {
    return this.request<{
      success: boolean;
      data: {
        charges: Array<{
          id: string;
          amount: number;
          currency: string;
          status: string;
          description: string | null;
          receiptUrl: string | null;
          created: string;
          paymentMethod: { brand: string; last4: string } | null;
          metadata: Record<string, string>;
        }>;
        paymentIntents: Array<{
          id: string;
          amount: number;
          currency: string;
          status: string;
          description: string | null;
          created: string;
          metadata: Record<string, string>;
        }>;
        checkoutSessions: Array<{
          id: string;
          amountTotal: number;
          currency: string | null;
          status: string | null;
          paymentStatus: string;
          mode: string;
          created: string;
          metadata: Record<string, string> | null;
        }>;
        subscriptions: Array<{
          id: string;
          status: string;
          plan: string;
          currentPeriodStart: string;
          currentPeriodEnd: string;
          created: string;
          cancelAtPeriodEnd: boolean;
        }>;
        stripeCustomerId: string;
      };
    }>('/buyer/stripe-history');
  }

  // Get seller earnings (completed transactions)
  async getSellerEarnings(params?: { page?: number; limit?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());

    const query = searchParams.toString();
    return this.request<{
      success: boolean;
      data: Array<{
        id: string;
        listing: { mcNumber: string; title: string } | null;
        buyer: { name: string } | null;
        agreedPrice: number;
        platformFee: number;
        netEarnings: number;
        completedAt: string;
      }>;
      totals: {
        gross: number;
        fees: number;
        net: number;
      };
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>(`/seller/earnings${query ? `?${query}` : ''}`);
  }

  // Get seller's Stripe payment history
  async getSellerStripeHistory() {
    return this.request<{
      success: boolean;
      data: {
        charges: Array<{
          id: string;
          amount: number;
          currency: string;
          status: string;
          description: string | null;
          receiptUrl: string | null;
          created: string;
          paymentMethod: { brand: string; last4: string } | null;
          metadata: Record<string, string>;
        }>;
        checkoutSessions: Array<{
          id: string;
          amountTotal: number;
          currency: string | null;
          status: string | null;
          paymentStatus: string;
          mode: string;
          created: string;
          metadata: Record<string, string> | null;
          type: string;
          mcNumber: string | null;
        }>;
        stripeCustomerId: string;
      };
    }>('/seller/stripe-history');
  }

  // Upload proof of payment for final payment
  async uploadPaymentProof(transactionId: string, formData: FormData) {
    const url = `${API_BASE_URL}/documents`;

    // Add transactionId to formData
    formData.append('transactionId', transactionId);
    formData.append('type', 'PAYMENT_PROOF');

    const currentToken = this.token || localStorage.getItem('mcx_token');
    const headers: HeadersInit = {};

    if (currentToken) {
      headers['Authorization'] = `Bearer ${currentToken}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Failed to upload payment proof');
    }

    return data as {
      success: boolean;
      data: any;
      message: string;
    };
  }

  // ============================================
  // Creditsafe API Endpoints (Admin Only)
  // ============================================

  /**
   * Check Creditsafe service health and authentication status
   */
  async creditsafeHealthCheck() {
    return this.request<{
      success: boolean;
      data: {
        configured: boolean;
        authenticated: boolean;
        error?: string;
      };
    }>('/admin/creditsafe/health');
  }

  /**
   * Get Creditsafe subscription access details
   */
  async creditsafeGetAccess() {
    return this.request<{
      success: boolean;
      data: {
        countries?: Array<{
          code: string;
          name: string;
          companyReport?: boolean;
          directorReport?: boolean;
          monitoring?: boolean;
        }>;
      };
    }>('/admin/creditsafe/access');
  }

  /**
   * Search companies in Creditsafe database
   */
  async creditsafeSearchCompanies(params: {
    countries: string;
    name?: string;
    regNo?: string;
    vatNo?: string;
    postCode?: string;
    city?: string;
    state?: string;
    exact?: boolean;
    page?: number;
    pageSize?: number;
  }) {
    const searchParams = new URLSearchParams();
    searchParams.set('countries', params.countries);
    if (params.name) searchParams.set('name', params.name);
    if (params.regNo) searchParams.set('regNo', params.regNo);
    if (params.vatNo) searchParams.set('vatNo', params.vatNo);
    if (params.postCode) searchParams.set('postCode', params.postCode);
    if (params.city) searchParams.set('city', params.city);
    if (params.state) searchParams.set('state', params.state);
    if (params.exact !== undefined) searchParams.set('exact', params.exact.toString());
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.pageSize) searchParams.set('pageSize', params.pageSize.toString());

    return this.request<{
      success: boolean;
      data: {
        companies: Array<{
          id: string;
          connectId?: string;
          name: string;
          regNo?: string;
          vatNo?: string;
          address?: {
            simpleValue?: string;
            street?: string;
            city?: string;
            postCode?: string;
            province?: string;
            country?: string;
          };
          status?: string;
          type?: string;
          safeNumber?: string;
        }>;
        totalResults: number;
      };
    }>(`/admin/creditsafe/companies?${searchParams.toString()}`);
  }

  /**
   * Get full credit report for a company
   */
  async creditsafeGetCreditReport(connectId: string, options?: {
    language?: string;
    includeIndicators?: boolean;
  }) {
    const searchParams = new URLSearchParams();
    if (options?.language) searchParams.set('language', options.language);
    if (options?.includeIndicators) searchParams.set('includeIndicators', 'true');
    const query = searchParams.toString();

    return this.request<{
      success: boolean;
      data: any; // Full credit report object
    }>(`/admin/creditsafe/companies/${encodeURIComponent(connectId)}${query ? `?${query}` : ''}`);
  }

  /**
   * Get company assessment with summary (convenient for display)
   */
  async creditsafeGetAssessment(connectId: string) {
    return this.request<{
      success: boolean;
      data: {
        company: any;
        summary: {
          businessName: string;
          registrationNumber: string | null;
          status: string;
          country: string;
          address: string;
          telephone: string | null;
          website: string | null;
          principalActivity: string | null;
          creditRating: string | null;
          creditRatingDescription: string | null;
          creditLimit: number | null;
          creditLimitCurrency: string | null;
          numberOfEmployees: string | number | null;
          dbt: number | null;
          industryDBT: number | null;
          ccjCount: number;
          ccjTotalAmount: number | null;
          ccjCurrency: string | null;
          directorsCount: number;
          latestFinancialsDate: string | null;
          revenue: number | null;
          profitBeforeTax: number | null;
          totalAssets: number | null;
          totalLiabilities: number | null;
          shareholdersEquity: number | null;
        };
      };
    }>(`/admin/creditsafe/companies/${encodeURIComponent(connectId)}/assessment`);
  }

  /**
   * Quick company lookup
   */
  async creditsafeLookup(params: {
    country: string;
    name?: string;
    regNo?: string;
    state?: string;
    city?: string;
  }) {
    return this.request<{
      success: boolean;
      data: {
        searchResults: Array<{
          id: string;
          connectId?: string;
          name: string;
          regNo?: string;
          address?: {
            simpleValue?: string;
          };
          status?: string;
        }>;
        totalResults: number;
      };
    }>('/admin/creditsafe/lookup', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // ===== AI Due Diligence =====

  // Run comprehensive due diligence analysis on an MC number
  async runDueDiligence(mcNumber: string) {
    return this.request<{
      success: boolean;
      data: {
        mcNumber: string;
        dotNumber?: string;
        recommendationScore: number;
        recommendationStatus: 'approved' | 'review' | 'rejected';
        riskLevel: 'low' | 'medium' | 'high' | 'critical';
        summary: string;
        fmcsa: {
          carrier: any;
          authority: any;
          insurance: any[];
          score: number;
          factors: Array<{
            name: string;
            points: number;
            maxPoints: number;
            status: 'pass' | 'fail' | 'warning' | 'na';
            detail?: string;
          }>;
        };
        creditsafe: {
          companyFound: boolean;
          companyName?: string;
          connectId?: string;
          creditScore?: number;
          creditRating?: string;
          creditLimit?: number;
          riskDescription?: string;
          legalFilings: {
            judgments: number;
            taxLiens: number;
            uccFilings: number;
            cautionaryUCC: number;
            bankruptcy: boolean;
            suits: number;
          };
          yearsInBusiness?: string;
          employees?: string;
          score: number;
          factors: Array<{
            name: string;
            points: number;
            maxPoints: number;
            status: 'pass' | 'fail' | 'warning' | 'na';
            detail?: string;
          }>;
          fullReport?: any;
        };
        riskFactors: Array<{
          severity: 'low' | 'medium' | 'high' | 'critical';
          category: 'fmcsa' | 'credit' | 'compliance';
          message: string;
        }>;
        positiveFactors: string[];
        analyzedAt: string;
      };
    }>(`/admin/due-diligence/analyze/${encodeURIComponent(mcNumber)}`);
  }

  // Upload a document (handles FormData for file upload)
  // This uses the existing /documents endpoint
  async uploadTransactionDocument(transactionId: string, formData: FormData) {
    const url = `${API_BASE_URL}/documents`;

    // Add transactionId to formData
    formData.append('transactionId', transactionId);

    const currentToken = this.token || localStorage.getItem('mcx_token');
    const headers: HeadersInit = {};

    if (currentToken) {
      headers['Authorization'] = `Bearer ${currentToken}`;
    }

    // Note: Do NOT set Content-Type header for FormData - browser will set it with boundary
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Failed to upload document');
    }

    return data as {
      success: boolean;
      data: any;
      message: string;
    };
  }
}

export const api = new ApiService();
export default api;
