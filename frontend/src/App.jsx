import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FilterSidebar from './components/FilterSidebar';
import PropertyCard from './components/PropertyCard';
import InteractiveMap from './components/InteractiveMap';
import QuickViewModal from './components/QuickViewModal';
import PropertyDetailsModal from './components/PropertyDetailsModal';
import BookingModal from './components/BookingModal';
import ScheduleVisitModal from './components/ScheduleVisitModal';
import CompareModal from './components/CompareModal';
import OwnerDashboard from './components/OwnerDashboard';
import AddPropertyModal from './components/AddPropertyModal';
import MyBookingsModal from './components/MyBookingsModal';
import Toast from './components/Toast';
import { api, checkBackendHealth } from './services/api';
import { Building2 } from 'lucide-react';

export default function App() {
  // Navigation & View Mode
  const [viewMode, setViewMode] = useState('split'); // 'split', 'grid', 'map'
  const [isOwnerView, setIsOwnerView] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);

  // Filters State
  const [activeCity, setActiveCity] = useState('All Cities');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    pgType: 'ALL',
    sharing: 'ALL',
    maxPrice: 25000,
    amenities: [],
    verified: false
  });

  // Data Store
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredPropertyId, setHoveredPropertyId] = useState(null);

  // Modals & Popups
  const [quickViewProperty, setQuickViewProperty] = useState(null);
  const [detailsProperty, setDetailsProperty] = useState(null);
  const [bookingProperty, setBookingProperty] = useState(null);
  const [bookingInitialRoom, setBookingInitialRoom] = useState(null);
  const [visitProperty, setVisitProperty] = useState(null);
  const [comparedProperties, setComparedProperties] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Fetch properties whenever filters or city change
  const loadProperties = async () => {
    setLoading(true);
    try {
      const activeFilters = {
        ...filters,
        city: activeCity,
        query: searchQuery
      };
      const data = await api.getProperties(activeFilters);
      setProperties(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [activeCity, filters]);

  // Check backend connectivity periodically
  useEffect(() => {
    const check = async () => {
      const online = await checkBackendHealth();
      setBackendOnline(online);
    };
    check();
    const interval = setInterval(check, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleApplySearch = () => {
    loadProperties();
  };

  const handleQuickLocality = (city, locality) => {
    setActiveCity(city);
    setSearchQuery(locality);
    setTimeout(() => loadProperties(), 50);
  };

  const handleResetFilters = () => {
    setFilters({
      pgType: 'ALL',
      sharing: 'ALL',
      maxPrice: 30000,
      amenities: [],
      verified: false
    });
    setSearchQuery('');
  };

  // Comparison toggle
  const handleToggleCompare = (property) => {
    if (comparedProperties.some(p => p.id === property.id)) {
      setComparedProperties(prev => prev.filter(p => p.id !== property.id));
      showToast(`Removed "${property.name}" from comparison`);
    } else {
      if (comparedProperties.length >= 3) {
        showToast('You can compare up to 3 properties simultaneously');
        return;
      }
      setComparedProperties(prev => [...prev, property]);
      showToast(`Added "${property.name}" to comparison`);
    }
  };

  const handleRemoveFromCompare = (id) => {
    setComparedProperties(prev => prev.filter(p => p.id !== id));
  };

  // Bookings & Visits handlers
  const handleBookingConfirmed = async (bookingData) => {
    const res = await api.createBooking(bookingData);
    showToast(`Bed successfully reserved! Reference: ${res.bookingCode}`);
    return res;
  };

  const handleVisitScheduled = async (visitData) => {
    const res = await api.scheduleVisit(visitData);
    showToast(`Tour visit scheduled! Pass code: ${res.visitCode}`);
    return res;
  };

  const handleReviewSubmit = async (propertyId, reviewData) => {
    await api.submitReview(propertyId, reviewData);
    showToast('Thank you! Your verified tenant review was submitted.');
    loadProperties();
    const updated = await api.getPropertyById(propertyId);
    if (updated) setDetailsProperty(updated);
  };

  const handlePropertyAdded = async (propertyData) => {
    await api.createProperty(propertyData);
    showToast(`Property "${propertyData.name}" has been published!`);
    loadProperties();
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-app)' }}>
      
      {/* Top Navigation */}
      <Navbar
        activeCity={activeCity}
        onSelectCity={setActiveCity}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        compareCount={comparedProperties.length}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenMyBookings={() => setIsMyBookingsOpen(true)}
        isOwnerView={isOwnerView}
        onToggleOwnerView={setIsOwnerView}
        backendOnline={backendOnline}
      />

      {/* Main Content Area */}
      {isOwnerView ? (
        // OWNER / LANDLORD PORTAL
        <main style={{ flex: 1 }}>
          <OwnerDashboard
            onOpenAddProperty={() => setIsAddPropertyOpen(true)}
            onViewProperty={(p) => {
              setIsOwnerView(false);
              setDetailsProperty(p);
            }}
            showToast={showToast}
          />
        </main>
      ) : (
        // TENANT PORTAL
        <main style={{ flex: 1 }}>
          {/* Hero Section with Quick Search */}
          <HeroSection
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeCity={activeCity}
            onSelectCity={setActiveCity}
            selectedGender={filters.pgType}
            onSelectGender={(val) => setFilters(prev => ({ ...prev, pgType: val }))}
            selectedSharing={filters.sharing}
            onSelectSharing={(val) => setFilters(prev => ({ ...prev, sharing: val }))}
            onApplySearch={handleApplySearch}
            onQuickLocality={handleQuickLocality}
          />

          {/* Explorer Layout */}
          <div className="re-main-container">
            <div className="re-explorer-grid">
              
              {/* Filter Sidebar */}
              <div>
                <FilterSidebar
                  filters={filters}
                  onChangeFilters={setFilters}
                  onResetFilters={handleResetFilters}
                  totalResults={properties.length}
                />
              </div>

              {/* View Presentation */}
              <div>
                
                {/* 1. Split View: Cards + Sticky Interactive Map */}
                {viewMode === 'split' && (
                  <div className="re-split-grid">
                    {/* Left: Cards List */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: '#94A3B8', paddingBottom: 12 }}>
                        <span>Showing {properties.length} verified spaces</span>
                        <span style={{ color: '#00D2FF', fontWeight: 600 }}>Interactive Map Sync Active</span>
                      </div>

                      {loading ? (
                        <div style={{ padding: '60px 0', textAlign: 'center', color: '#94A3B8' }}>Loading verified listings...</div>
                      ) : properties.length > 0 ? (
                        <div className="re-cards-list">
                          {properties.map((property) => (
                            <PropertyCard
                              key={property.id}
                              property={property}
                              onQuickView={setQuickViewProperty}
                              onOpenDetails={setDetailsProperty}
                              onScheduleVisit={setVisitProperty}
                              onBookNow={(p, r) => {
                                setBookingProperty(p);
                                setBookingInitialRoom(r || null);
                              }}
                              isCompared={comparedProperties.some(cp => cp.id === property.id)}
                              onToggleCompare={handleToggleCompare}
                              isHovered={hoveredPropertyId === property.id}
                              onHover={setHoveredPropertyId}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="glass-panel" style={{ padding: 40, textAlign: 'center', borderRadius: 20 }}>
                          <p style={{ color: '#CBD5E1', marginBottom: 16 }}>No PG spaces match your selected filters.</p>
                          <button onClick={handleResetFilters} className="btn-outline">
                            Reset All Filters
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Right: Sticky Map */}
                    <div>
                      <div className="re-map-sticky-wrap">
                        <InteractiveMap
                          properties={properties}
                          hoveredPropertyId={hoveredPropertyId}
                          onHoverProperty={setHoveredPropertyId}
                          onSelectProperty={setDetailsProperty}
                          activeCity={activeCity}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Grid View: High-Density Cards */}
                {viewMode === 'grid' && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: '#94A3B8', marginBottom: 16 }}>
                      <span>Showing {properties.length} verified spaces in grid</span>
                    </div>
                    {loading ? (
                      <div style={{ padding: '60px 0', textAlign: 'center', color: '#94A3B8' }}>Loading verified listings...</div>
                    ) : (
                      <div className="re-grid-view-list">
                        {properties.map((property) => (
                          <PropertyCard
                            key={property.id}
                            property={property}
                            onQuickView={setQuickViewProperty}
                            onOpenDetails={setDetailsProperty}
                            onScheduleVisit={setVisitProperty}
                            onBookNow={(p, r) => {
                              setBookingProperty(p);
                              setBookingInitialRoom(r || null);
                            }}
                            isCompared={comparedProperties.some(cp => cp.id === property.id)}
                            onToggleCompare={handleToggleCompare}
                            isHovered={hoveredPropertyId === property.id}
                            onHover={setHoveredPropertyId}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Map Only View */}
                {viewMode === 'map' && (
                  <div style={{ height: 750, borderRadius: 20, overflow: 'hidden', border: '1px solid var(--border-dim)' }}>
                    <InteractiveMap
                      properties={properties}
                      hoveredPropertyId={hoveredPropertyId}
                      onHoverProperty={setHoveredPropertyId}
                      onSelectProperty={setDetailsProperty}
                      activeCity={activeCity}
                    />
                  </div>
                )}

              </div>

            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.06)', background: '#050810', padding: '24px 24px', fontSize: 12, color: '#64748B' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Building2 style={{ width: 16, height: 16, color: '#00D2FF' }} />
            <span style={{ fontWeight: 800, color: '#E2E8F0' }}>RentEase</span>
            <span>– Comprehensive Full-Stack PG &amp; Room Finder</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 11 }}>
            <span>React.js</span>
            <span>•</span>
            <span>Java Spring Boot</span>
            <span>•</span>
            <span>MySQL</span>
            <span>•</span>
            <span>REST API</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {quickViewProperty && (
        <QuickViewModal
          property={quickViewProperty}
          onClose={() => setQuickViewProperty(null)}
          onOpenDetails={(p) => {
            setQuickViewProperty(null);
            setDetailsProperty(p);
          }}
          onScheduleVisit={(p) => setVisitProperty(p)}
          onBookNow={(p) => {
            setBookingProperty(p);
            setBookingInitialRoom(null);
          }}
        />
      )}

      {detailsProperty && (
        <PropertyDetailsModal
          property={detailsProperty}
          onClose={() => setDetailsProperty(null)}
          onScheduleVisit={(p) => setVisitProperty(p)}
          onBookNow={(p, r) => {
            setBookingProperty(p);
            setBookingInitialRoom(r || null);
          }}
          onSubmitReview={handleReviewSubmit}
        />
      )}

      {bookingProperty && (
        <BookingModal
          property={bookingProperty}
          initialRoom={bookingInitialRoom}
          onClose={() => {
            setBookingProperty(null);
            setBookingInitialRoom(null);
          }}
          onBookingConfirmed={handleBookingConfirmed}
        />
      )}

      {visitProperty && (
        <ScheduleVisitModal
          property={visitProperty}
          onClose={() => setVisitProperty(null)}
          onVisitScheduled={handleVisitScheduled}
        />
      )}

      {isCompareOpen && (
        <CompareModal
          comparedProperties={comparedProperties}
          onClose={() => setIsCompareOpen(false)}
          onRemoveFromCompare={handleRemoveFromCompare}
          onBookNow={(p) => {
            setIsCompareOpen(false);
            setBookingProperty(p);
          }}
        />
      )}

      {isMyBookingsOpen && (
        <MyBookingsModal
          onClose={() => setIsMyBookingsOpen(false)}
        />
      )}

      {isAddPropertyOpen && (
        <AddPropertyModal
          onClose={() => setIsAddPropertyOpen(false)}
          onPropertyAdded={handlePropertyAdded}
        />
      )}

      {/* Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

    </div>
  );
}
