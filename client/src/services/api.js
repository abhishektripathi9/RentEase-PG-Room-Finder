// RentEase PRO API Client with Express + MySQL Backend & Resilient Offline Fallback
import { INITIAL_PROPERTIES, INITIAL_BOOKINGS, INITIAL_VISITS } from './mockData';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Token helpers
export const getAdminToken = () => localStorage.getItem('rentease_admin_token');
export const setAdminToken = (token) => localStorage.setItem('rentease_admin_token', token);
export const removeAdminToken = () => {
  localStorage.removeItem('rentease_admin_token');
  localStorage.removeItem('rentease_admin_user');
};

export const getUserToken = () => localStorage.getItem('rentease_user_token');
export const setUserToken = (token) => localStorage.setItem('rentease_user_token', token);
export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem('rentease_user_profile');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};
export const setCurrentUser = (user) => {
  localStorage.setItem('rentease_user_profile', JSON.stringify(user));
};
export const removeUserToken = () => {
  localStorage.removeItem('rentease_user_token');
  localStorage.removeItem('rentease_user_profile');
};

const authHeaders = (isAdmin = false) => {
  const token = isAdmin ? getAdminToken() : (getUserToken() || getAdminToken());
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Check backend connectivity
export const checkBackendHealth = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(`${BASE_URL}/health`, {
      signal: controller.signal,
      method: 'GET'
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      return true;
    }
  } catch (err) {
    // offline
  }
  return false;
};

export const api = {
  // ==========================================
  // Public Storefront APIs
  // ==========================================
  async getProperties(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.city && filters.city !== 'All Cities' && filters.city !== 'ALL') params.append('city', filters.city);
      if (filters.category && filters.category !== 'ALL') params.append('category', filters.category);
      if (filters.pgType && filters.pgType !== 'ALL') params.append('category', filters.pgType);
      if (filters.roomType && filters.roomType !== 'ALL') params.append('roomType', filters.roomType);
      if (filters.maxPrice) params.append('maxBudget', filters.maxPrice);
      if (filters.maxBudget) params.append('maxBudget', filters.maxBudget);
      if (filters.query) params.append('query', filters.query);
      if (filters.locality) params.append('locality', filters.locality);
      if (filters.sort) params.append('sort', filters.sort);

      const res = await fetch(`${BASE_URL}/properties?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch (err) {
      console.warn('Backend unavailable, using initial properties store:', err.message);
    }

    // Graceful fallback store
    let result = [...INITIAL_PROPERTIES];
    if (filters.city && filters.city !== 'All Cities') {
      result = result.filter(p => p.city?.toLowerCase() === filters.city.toLowerCase());
    }
    if (filters.pgType && filters.pgType !== 'ALL') {
      result = result.filter(p => p.pgType === filters.pgType || p.category === filters.pgType);
    }
    const maxB = filters.maxPrice || filters.maxBudget;
    if (maxB) {
      result = result.filter(p => (p.priceStarting || p.price_starting) <= maxB);
    }
    if (filters.query) {
      const q = filters.query.toLowerCase();
      result = result.filter(p => (p.title + p.locality + p.address).toLowerCase().includes(q));
    }
    return result;
  },

  async getPropertyById(id) {
    try {
      const res = await fetch(`${BASE_URL}/properties/${id}`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      // fallback
    }
    return INITIAL_PROPERTIES.find(p => p.id === parseInt(id, 10));
  },

  async getPublicSettings() {
    try {
      const res = await fetch(`${BASE_URL}/settings/public`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {}
    return {
      token_amount: 500,
      zero_brokerage_text: '100% Zero Brokerage Guarantee on all Verified PGs',
      featured_cities: ['Bangalore', 'Prayagraj', 'Delhi NCR', 'Banda']
    };
  },

  // ==========================================
  // Student Actions & Bookings
  // ==========================================
  async createBooking(bookingData) {
    try {
      const res = await fetch(`${BASE_URL}/bookings`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(bookingData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Booking creation failed');
      return data;
    } catch (err) {
      console.warn('Creating local offline booking pass:', err.message);
      const randomCode = `RE-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      return {
        success: true,
        message: bookingData.booking_type === 'token_booking'
          ? 'Token booking confirmed! Bed hold issued.'
          : 'Visit scheduled successfully! Digital pass created.',
        booking: {
          id: Date.now(),
          booking_code: randomCode,
          ...bookingData,
          status: 'confirmed',
          created_at: new Date().toISOString()
        }
      };
    }
  },

  async getMyBookings() {
    try {
      const res = await fetch(`${BASE_URL}/bookings/my`, {
        headers: authHeaders()
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {}
    return [...INITIAL_BOOKINGS, ...INITIAL_VISITS];
  },

  // ==========================================
  // Wishlist / Saved PGs
  // ==========================================
  async toggleWishlist(propertyId) {
    try {
      if (getUserToken()) {
        const res = await fetch(`${BASE_URL}/wishlist/toggle`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({ property_id: propertyId })
        });
        if (res.ok) {
          const data = await res.json();
          return data;
        }
      }
    } catch (err) {}

    // Local storage fallback for wishlist
    let saved = JSON.parse(localStorage.getItem('rentease_saved_pgs') || '[]');
    const exists = saved.includes(propertyId);
    if (exists) {
      saved = saved.filter(id => id !== propertyId);
    } else {
      saved.push(propertyId);
    }
    localStorage.setItem('rentease_saved_pgs', JSON.stringify(saved));
    return { success: true, wishlisted: !exists };
  },

  async getWishlist() {
    try {
      if (getUserToken()) {
        const res = await fetch(`${BASE_URL}/wishlist`, {
          headers: authHeaders()
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) return json.data;
        }
      }
    } catch (err) {}

    // Fallback to local storage saved IDs matching properties
    const savedIds = JSON.parse(localStorage.getItem('rentease_saved_pgs') || '[]');
    const all = await this.getProperties();
    return all.filter(p => savedIds.includes(p.id));
  },

  isWishlisted(propertyId) {
    const savedIds = JSON.parse(localStorage.getItem('rentease_saved_pgs') || '[]');
    return savedIds.includes(propertyId);
  },

  // ==========================================
  // Owner PG Listing & Management
  // ==========================================
  async submitOwnerProperty(propertyData) {
    const res = await fetch(`${BASE_URL}/owner/properties`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(propertyData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to submit PG property');
    return data;
  },

  async getOwnerProperties() {
    const res = await fetch(`${BASE_URL}/owner/properties`, {
      headers: authHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to load owner properties');
    return data.data;
  },

  // ==========================================
  // Auth APIs
  // ==========================================
  async register(userData) {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    if (data.token) {
      setUserToken(data.token);
      setCurrentUser(data.user);
    }
    return data;
  },

  async login(email, password) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    if (data.token) {
      setUserToken(data.token);
      setCurrentUser(data.user);
    }
    return data;
  },

  async adminLogin(email, password) {
    const res = await fetch(`${BASE_URL}/auth/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Administrative login failed');
    if (data.token) {
      setAdminToken(data.token);
      localStorage.setItem('rentease_admin_user', JSON.stringify(data.user));
    }
    return data;
  },

  // ==========================================
  // Admin Portal Control APIs (/api/admin/*)
  // ==========================================
  async getAdminStats() {
    const res = await fetch(`${BASE_URL}/admin/stats`, {
      headers: authHeaders(true)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch admin stats');
    return data;
  },

  async getAdminProperties(status = 'all', city = 'all') {
    const params = new URLSearchParams();
    if (status && status !== 'all') params.append('status', status);
    if (city && city !== 'all') params.append('city', city);

    const res = await fetch(`${BASE_URL}/admin/properties?${params.toString()}`, {
      headers: authHeaders(true)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch properties');
    return data.data;
  },

  async verifyAdminProperty(id, verificationStatus, rejectionReason = '') {
    const res = await fetch(`${BASE_URL}/admin/properties/${id}/verify`, {
      method: 'PATCH',
      headers: authHeaders(true),
      body: JSON.stringify({
        verification_status: verificationStatus,
        rejection_reason: rejectionReason
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update property verification');
    return data;
  },

  async editAdminProperty(id, propertyData) {
    const res = await fetch(`${BASE_URL}/admin/properties/${id}`, {
      method: 'PATCH',
      headers: authHeaders(true),
      body: JSON.stringify(propertyData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to edit property');
    return data;
  },

  async deleteAdminProperty(id) {
    const res = await fetch(`${BASE_URL}/admin/properties/${id}`, {
      method: 'DELETE',
      headers: authHeaders(true)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete property');
    return data;
  },

  async getAdminBookings(type = 'all', status = 'all') {
    const params = new URLSearchParams();
    if (type && type !== 'all') params.append('type', type);
    if (status && status !== 'all') params.append('status', status);

    const res = await fetch(`${BASE_URL}/admin/bookings?${params.toString()}`, {
      headers: authHeaders(true)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch bookings');
    return data.data;
  },

  async updateAdminBooking(id, updateData) {
    const res = await fetch(`${BASE_URL}/admin/bookings/${id}`, {
      method: 'PATCH',
      headers: authHeaders(true),
      body: JSON.stringify(updateData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update booking');
    return data;
  },

  async getAdminUsers(role = 'all') {
    const params = new URLSearchParams();
    if (role && role !== 'all') params.append('role', role);

    const res = await fetch(`${BASE_URL}/admin/users?${params.toString()}`, {
      headers: authHeaders(true)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch users');
    return data.data;
  },

  async updateAdminUserStatus(id, updateData) {
    const res = await fetch(`${BASE_URL}/admin/users/${id}/status`, {
      method: 'PATCH',
      headers: authHeaders(true),
      body: JSON.stringify(updateData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update user status');
    return data;
  },

  async getAdminSettings() {
    const res = await fetch(`${BASE_URL}/admin/settings`, {
      headers: authHeaders(true)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch settings');
    return data.data;
  },

  async updateAdminSettings(settingsData) {
    const res = await fetch(`${BASE_URL}/admin/settings`, {
      method: 'PUT',
      headers: authHeaders(true),
      body: JSON.stringify(settingsData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update settings');
    return data;
  },

  // ==========================================
  // Security & Access Control APIs (/api/admin/security/*)
  // ==========================================
  async getSecurityAccessList() {
    const res = await fetch(`${BASE_URL}/admin/security/access-list`, {
      headers: authHeaders(true)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch security access list');
    return data.data;
  },

  async grantSecurityAccess(accessData) {
    const res = await fetch(`${BASE_URL}/admin/security/grant-access`, {
      method: 'POST',
      headers: authHeaders(true),
      body: JSON.stringify(accessData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to grant security access');
    return data;
  },

  async updateSecurityPermissions(id, permissionsData) {
    const res = await fetch(`${BASE_URL}/admin/security/update-permissions/${id}`, {
      method: 'PATCH',
      headers: authHeaders(true),
      body: JSON.stringify(permissionsData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update security permissions');
    return data;
  },

  async revokeSecurityAccess(id) {
    const res = await fetch(`${BASE_URL}/admin/security/revoke-access/${id}`, {
      method: 'DELETE',
      headers: authHeaders(true)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to revoke security access');
    return data;
  },

  async getSecurityAuditLogs() {
    const res = await fetch(`${BASE_URL}/admin/security/audit-logs`, {
      headers: authHeaders(true)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to load security audit logs');
    return data.data;
  }
};
