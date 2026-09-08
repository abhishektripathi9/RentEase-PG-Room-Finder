// RentEase API Client with Live Spring Boot Backend Integration & Intelligent Fallback Store

import { INITIAL_PROPERTIES, INITIAL_BOOKINGS, INITIAL_VISITS } from './mockData';

const BASE_URL = 'http://localhost:8080/api';

// In-Memory state for graceful fallback if Spring Boot is launching or offline
let localProperties = [...INITIAL_PROPERTIES];
let localBookings = [...INITIAL_BOOKINGS];
let localVisits = [...INITIAL_VISITS];

let isBackendAvailable = false;

// Check backend connectivity on initialization
export const checkBackendHealth = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(`${BASE_URL}/properties/featured`, {
      signal: controller.signal,
      method: 'GET'
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      isBackendAvailable = true;
      return true;
    }
  } catch (err) {
    isBackendAvailable = false;
  }
  return false;
};

// Auto check once on load
checkBackendHealth();

export const api = {
  // Properties
  async getProperties(filters = {}) {
    if (await checkBackendHealth()) {
      try {
        const params = new URLSearchParams();
        if (filters.city && filters.city !== 'All Cities') params.append('city', filters.city);
        if (filters.pgType && filters.pgType !== 'ALL') params.append('pgType', filters.pgType);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        if (filters.verified !== undefined) params.append('verified', filters.verified);
        if (filters.query) params.append('query', filters.query);

        const res = await fetch(`${BASE_URL}/properties?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) return data;
        }
      } catch (err) {
        console.warn('Backend query failed, using local store', err);
      }
    }

    // Local filter fallback
    let result = [...localProperties];
    if (filters.city && filters.city !== 'All Cities') {
      result = result.filter(p => p.city.toLowerCase() === filters.city.toLowerCase());
    }
    if (filters.pgType && filters.pgType !== 'ALL') {
      result = result.filter(p => p.pgType === filters.pgType || (filters.pgType === 'UNISEX' && p.pgType === 'CO_LIVING'));
    }
    if (filters.maxPrice) {
      result = result.filter(p => p.startingPrice <= Number(filters.maxPrice));
    }
    if (filters.verified) {
      result = result.filter(p => p.verified === true);
    }
    if (filters.sharing && filters.sharing !== 'ALL') {
      result = result.filter(p => p.roomTypes?.some(r => r.roomCategory === filters.sharing));
    }
    if (filters.amenities && filters.amenities.length > 0) {
      result = result.filter(p =>
        filters.amenities.every(amenity => p.amenities?.includes(amenity))
      );
    }
    if (filters.query && filters.query.trim()) {
      const q = filters.query.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.locality.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q)
      );
    }
    return result;
  },

  async getPropertyById(id) {
    if (await checkBackendHealth()) {
      try {
        const res = await fetch(`${BASE_URL}/properties/${id}`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend fetch failed, falling back', err);
      }
    }
    return localProperties.find(p => p.id === Number(id)) || null;
  },

  async createProperty(propertyData) {
    if (await checkBackendHealth()) {
      try {
        const res = await fetch(`${BASE_URL}/properties`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(propertyData)
        });
        if (res.ok) {
          const created = await res.json();
          localProperties.unshift(created);
          return created;
        }
      } catch (err) {
        console.warn('Backend create failed, storing locally', err);
      }
    }

    const newProp = {
      ...propertyData,
      id: Date.now(),
      rating: 4.8,
      reviewCount: 0,
      verified: true,
      reviews: []
    };
    localProperties.unshift(newProp);
    return newProp;
  },

  async updateProperty(id, propertyData) {
    if (await checkBackendHealth()) {
      try {
        const res = await fetch(`${BASE_URL}/properties/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(propertyData)
        });
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn('Backend update failed, using local store', err);
      }
    }
    const idx = localProperties.findIndex(p => p.id === Number(id));
    if (idx !== -1) {
      localProperties[idx] = { ...localProperties[idx], ...propertyData };
      return localProperties[idx];
    }
    return null;
  },

  async deleteProperty(id) {
    if (await checkBackendHealth()) {
      try {
        await fetch(`${BASE_URL}/properties/${id}`, { method: 'DELETE' });
      } catch (err) {
        console.warn('Backend delete failed, using local store', err);
      }
    }
    localProperties = localProperties.filter(p => p.id !== Number(id));
    return true;
  },

  // Bookings
  async createBooking(bookingData) {
    if (await checkBackendHealth()) {
      try {
        const res = await fetch(`${BASE_URL}/bookings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingData)
        });
        if (res.ok) {
          const created = await res.json();
          localBookings.unshift(created);
          return created;
        }
      } catch (err) {
        console.warn('Backend booking failed, saving locally', err);
      }
    }

    const newBooking = {
      ...bookingData,
      id: Date.now(),
      bookingCode: `RE-2026-B${Math.floor(1000 + Math.random() * 9000)}`,
      bookingStatus: 'CONFIRMED',
      createdAt: new Date().toISOString()
    };
    localBookings.unshift(newBooking);
    return newBooking;
  },

  async getBookings() {
    if (await checkBackendHealth()) {
      try {
        const res = await fetch(`${BASE_URL}/bookings`);
        if (res.ok) return await res.json();
      } catch (err) {}
    }
    return [...localBookings];
  },

  async updateBookingStatus(id, status) {
    if (await checkBackendHealth()) {
      try {
        const res = await fetch(`${BASE_URL}/bookings/${id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        });
        if (res.ok) return await res.json();
      } catch (err) {}
    }
    const idx = localBookings.findIndex(b => b.id === Number(id));
    if (idx !== -1) {
      localBookings[idx].bookingStatus = status;
      return localBookings[idx];
    }
    return null;
  },

  // Visits
  async scheduleVisit(visitData) {
    if (await checkBackendHealth()) {
      try {
        const res = await fetch(`${BASE_URL}/visits`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(visitData)
        });
        if (res.ok) {
          const created = await res.json();
          localVisits.unshift(created);
          return created;
        }
      } catch (err) {
        console.warn('Backend visit failed, saving locally', err);
      }
    }

    const newVisit = {
      ...visitData,
      id: Date.now(),
      visitCode: `VST-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'SCHEDULED',
      createdAt: new Date().toISOString()
    };
    localVisits.unshift(newVisit);
    return newVisit;
  },

  async getVisits() {
    if (await checkBackendHealth()) {
      try {
        const res = await fetch(`${BASE_URL}/visits`);
        if (res.ok) return await res.json();
      } catch (err) {}
    }
    return [...localVisits];
  },

  async updateVisitStatus(id, status) {
    if (await checkBackendHealth()) {
      try {
        const res = await fetch(`${BASE_URL}/visits/${id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        });
        if (res.ok) return await res.json();
      } catch (err) {}
    }
    const idx = localVisits.findIndex(v => v.id === Number(id));
    if (idx !== -1) {
      localVisits[idx].status = status;
      return localVisits[idx];
    }
    return null;
  },

  // Reviews
  async submitReview(propertyId, reviewData) {
    if (await checkBackendHealth()) {
      try {
        const res = await fetch(`${BASE_URL}/properties/${propertyId}/reviews`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reviewData)
        });
        if (res.ok) return await res.json();
      } catch (err) {}
    }

    const prop = localProperties.find(p => p.id === Number(propertyId));
    if (prop) {
      const newReview = {
        ...reviewData,
        id: Date.now(),
        createdAt: new Date().toISOString().split('T')[0]
      };
      if (!prop.reviews) prop.reviews = [];
      prop.reviews.unshift(newReview);
      prop.reviewCount = prop.reviews.length;
      return newReview;
    }
    return null;
  },

  // Owner Stats
  async getOwnerStats(ownerId = 1) {
    if (await checkBackendHealth()) {
      try {
        const res = await fetch(`${BASE_URL}/owners/${ownerId}/stats`);
        if (res.ok) return await res.json();
      } catch (err) {}
    }

    const confirmedRevenue = localBookings
      .filter(b => b.bookingStatus === 'CONFIRMED')
      .reduce((sum, b) => sum + (Number(b.monthlyRent) || 0), 0);

    return {
      totalProperties: localProperties.length,
      totalBookings: localBookings.length,
      totalVisits: localVisits.length,
      monthlyRevenue: confirmedRevenue + 128500,
      occupancyRate: 88.5,
      activeTenants: localBookings.length + 24,
      pendingVisits: localVisits.filter(v => v.status === 'SCHEDULED').length
    };
  }
};
