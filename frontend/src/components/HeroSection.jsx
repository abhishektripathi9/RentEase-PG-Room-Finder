import React from 'react';
import { Search, Sparkles, ShieldCheck, MapPin, Users, KeyRound, ArrowRight } from 'lucide-react';
import { CITIES } from '../services/mockData';

export default function HeroSection({
  searchQuery,
  onSearchChange,
  activeCity,
  onSelectCity,
  selectedGender,
  onSelectGender,
  selectedSharing,
  onSelectSharing,
  onApplySearch,
  onQuickLocality
}) {
  const trendingLocalities = [
    { city: 'Bangalore', locality: 'Koramangala' },
    { city: 'Bangalore', locality: 'HSR Layout' },
    { city: 'Pune', locality: 'Hinjewadi' },
    { city: 'Delhi NCR', locality: 'Cyber City' },
    { city: 'Hyderabad', locality: 'Hitec City' },
    { city: 'Bangalore', locality: 'Whitefield' }
  ];

  return (
    <section className="re-hero-section">
      <div className="re-hero-container">
        
        {/* Top Badges Row */}
        <div className="re-hero-top-badges">
          <span className="re-year-tag">2026</span>
          <div className="re-featured-badge">
            <Sparkles style={{ width: 14, height: 14, fill: '#FBBF24' }} />
            <span>Featured</span>
          </div>
          <span className="re-fullstack-badge">
            Full Stack
          </span>
        </div>

        {/* Project Title and Description */}
        <h1 className="re-hero-title">
          RentEase – <span className="re-hero-gradient">PG &amp; Room Finder</span>
        </h1>

        <p className="re-hero-desc">
          Comprehensive full-stack PG and rental housing portal with intuitive filter search, booking workflow, verified listings, owner portal, and interactive map interface.
        </p>

        {/* Tech Stack Pills matching portfolio card */}
        <div className="re-tech-pills-row">
          {['React.js', 'Java', 'Spring Boot', 'MySQL', 'REST API', 'Leaflet Maps', 'JPA / Hibernate'].map((tech) => (
            <span key={tech} className="tech-pill">
              {tech}
            </span>
          ))}
        </div>

        {/* Intuitive Quick Search Bar Card */}
        <div className="re-search-panel">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onApplySearch();
            }}
            className="re-search-form"
          >
            {/* City Selector */}
            <div className="re-search-field">
              <MapPin style={{ width: 18, height: 18, color: '#00D2FF', flexShrink: 0 }} />
              <div className="re-field-inner">
                <label className="re-field-label">Target City</label>
                <select
                  value={activeCity}
                  onChange={(e) => onSelectCity(e.target.value)}
                  className="re-field-select"
                >
                  {CITIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Gender / PG Type */}
            <div className="re-search-field">
              <Users style={{ width: 18, height: 18, color: '#9B51E0', flexShrink: 0 }} />
              <div className="re-field-inner">
                <label className="re-field-label">PG Type</label>
                <select
                  value={selectedGender}
                  onChange={(e) => onSelectGender(e.target.value)}
                  className="re-field-select"
                >
                  <option value="ALL">All (Boys/Girls/Unisex)</option>
                  <option value="UNISEX">Unisex / Co-living</option>
                  <option value="GIRLS">Girls Only</option>
                  <option value="BOYS">Boys Only</option>
                </select>
              </div>
            </div>

            {/* Keyword / Locality Search */}
            <div className="re-search-field">
              <Search style={{ width: 18, height: 18, color: '#64748B', flexShrink: 0 }} />
              <div className="re-field-inner">
                <label className="re-field-label">Search Locality or PG Name</label>
                <input
                  type="text"
                  placeholder="e.g. Koramangala, Sony Signal..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="re-field-input"
                />
              </div>
            </div>

            {/* Search Submit CTA Button */}
            <div>
              <button type="submit" className="re-search-submit-btn">
                <span>Find Spaces</span>
                <ArrowRight style={{ width: 16, height: 16, strokeWidth: 2.5 }} />
              </button>
            </div>
          </form>
        </div>

        {/* Trending Localities Tags */}
        <div className="re-trending-row">
          <span className="re-trending-label">
            <KeyRound style={{ width: 14, height: 14, color: '#00D2FF' }} />
            Trending Localities:
          </span>
          {trendingLocalities.map((item) => (
            <button
              key={`${item.city}-${item.locality}`}
              type="button"
              onClick={() => onQuickLocality(item.city, item.locality)}
              className="re-trending-chip"
            >
              <span>{item.locality}</span>
              <span style={{ fontSize: 10, color: '#64748B', marginLeft: 4 }}>({item.city})</span>
            </button>
          ))}
        </div>

        {/* Live Trust Metrics Counter */}
        <div className="re-stats-grid">
          <div className="re-stat-card">
            <div className="re-stat-icon-box" style={{ background: 'rgba(0, 210, 255, 0.12)', borderColor: 'rgba(0, 210, 255, 0.3)' }}>
              <ShieldCheck style={{ width: 22, height: 22, color: '#00D2FF' }} />
            </div>
            <div>
              <div className="re-stat-val">1,200+</div>
              <div className="re-stat-lbl">Verified Beds Available</div>
            </div>
          </div>

          <div className="re-stat-card">
            <div className="re-stat-icon-box" style={{ background: 'rgba(155, 81, 224, 0.12)', borderColor: 'rgba(155, 81, 224, 0.3)' }}>
              <Sparkles style={{ width: 20, height: 20, color: '#9B51E0' }} />
            </div>
            <div>
              <div className="re-stat-val">0% Brokerage</div>
              <div className="re-stat-lbl">Direct Landlord Bookings</div>
            </div>
          </div>

          <div className="re-stat-card">
            <div className="re-stat-icon-box" style={{ background: 'rgba(245, 158, 11, 0.12)', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
              <span style={{ fontSize: 16, fontWeight: 900, color: '#FBBF24' }}>4.8★</span>
            </div>
            <div>
              <div className="re-stat-val">4.8 / 5.0</div>
              <div className="re-stat-lbl">Tenant Satisfaction</div>
            </div>
          </div>

          <div className="re-stat-card">
            <div className="re-stat-icon-box" style={{ background: 'rgba(16, 185, 129, 0.12)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
              <Users style={{ width: 20, height: 20, color: '#10B981' }} />
            </div>
            <div>
              <div className="re-stat-val">&lt; 15 mins</div>
              <div className="re-stat-lbl">Visit Confirmation</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
