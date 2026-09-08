import React from 'react';
import { Building2, MapPin, Scale, CalendarCheck, UserCheck, LayoutGrid, Map, Columns } from 'lucide-react';
import { CITIES } from '../services/mockData';

export default function Navbar({
  activeCity,
  onSelectCity,
  viewMode,
  onChangeViewMode,
  compareCount,
  onOpenCompare,
  onOpenMyBookings,
  isOwnerView,
  onToggleOwnerView,
  backendOnline
}) {
  return (
    <header className="re-navbar">
      <div className="re-nav-container">
        
        {/* Brand Group */}
        <div className="re-brand-group" onClick={() => onToggleOwnerView(false)}>
          <div className="re-brand-icon">
            <Building2 style={{ width: 22, height: 22, color: '#030712', strokeWidth: 2.5 }} />
          </div>
          <div>
            <div className="re-brand-title">
              <span className="re-brand-name">
                Rent<span>Ease</span>
              </span>
              <span className="re-brand-pill">
                PG &amp; ROOM FINDER
              </span>
            </div>
            <div className="re-status-indicator">
              <span
                className="re-status-dot"
                style={{
                  backgroundColor: backendOnline ? '#34D399' : '#38BDF8',
                  boxShadow: backendOnline ? '0 0 8px #34D399' : '0 0 8px #38BDF8'
                }}
              />
              <span>{backendOnline ? 'Spring Boot API Live' : 'High-Performance Engine'}</span>
            </div>
          </div>
        </div>

        {/* Center: City Dropdown & View Mode Switcher */}
        {!isOwnerView && (
          <div className="re-nav-center">
            <div className="re-city-dropdown-wrap">
              <MapPin className="re-city-icon" style={{ width: 15, height: 15 }} />
              <select
                value={activeCity}
                onChange={(e) => onSelectCity(e.target.value)}
                className="re-city-select"
              >
                {CITIES.map(city => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="re-view-switcher">
              <button
                onClick={() => onChangeViewMode('split')}
                className={`re-view-btn ${viewMode === 'split' ? 'active' : ''}`}
                title="Split View (Cards + Map)"
              >
                <Columns style={{ width: 14, height: 14 }} />
                <span>Split</span>
              </button>
              <button
                onClick={() => onChangeViewMode('grid')}
                className={`re-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                title="Grid View"
              >
                <LayoutGrid style={{ width: 14, height: 14 }} />
                <span>Grid</span>
              </button>
              <button
                onClick={() => onChangeViewMode('map')}
                className={`re-view-btn ${viewMode === 'map' ? 'active' : ''}`}
                title="Map Only View"
              >
                <Map style={{ width: 14, height: 14 }} />
                <span>Map</span>
              </button>
            </div>
          </div>
        )}

        {/* Right Action CTAs */}
        <div className="re-nav-actions">
          {!isOwnerView && (
            <button onClick={onOpenCompare} className="btn-outline" style={{ padding: '6px 14px', fontSize: 12 }}>
              <Scale style={{ width: 14, height: 14, color: '#00D2FF' }} />
              <span>Compare</span>
              {compareCount > 0 && (
                <span style={{ background: '#00D2FF', color: '#030712', fontWeight: 800, fontSize: 10, padding: '1px 6px', borderRadius: 999, marginLeft: 4 }}>
                  {compareCount}
                </span>
              )}
            </button>
          )}

          {!isOwnerView && (
            <button onClick={onOpenMyBookings} className="btn-outline" style={{ padding: '6px 14px', fontSize: 12 }}>
              <CalendarCheck style={{ width: 14, height: 14, color: '#9B51E0' }} />
              <span>My Visits &amp; Bookings</span>
            </button>
          )}

          <button
            onClick={() => onToggleOwnerView(!isOwnerView)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              fontWeight: 700,
              padding: '7px 16px',
              borderRadius: 999,
              cursor: 'pointer',
              border: isOwnerView ? '1px solid rgba(155, 81, 224, 0.6)' : '1px solid rgba(0, 210, 255, 0.4)',
              background: isOwnerView ? 'linear-gradient(135deg, #7928CA, #4F46E5)' : 'rgba(15, 23, 42, 0.9)',
              color: isOwnerView ? '#FFF' : '#38BDF8',
              boxShadow: isOwnerView ? '0 0 15px rgba(155, 81, 224, 0.4)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <UserCheck style={{ width: 14, height: 14 }} />
            <span>{isOwnerView ? 'Switch to Tenant View' : 'Owner Portal'}</span>
          </button>
        </div>

      </div>
    </header>
  );
}
