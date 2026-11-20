import React from 'react';
import { RotateCcw, Check, SlidersHorizontal, ShieldCheck } from 'lucide-react';
import { AMENITIES_LIST } from '../services/mockData';

export default function FilterSidebar({
  filters,
  onChangeFilters,
  onResetFilters,
  totalResults
}) {
  const handleGenderChange = (val) => {
    onChangeFilters({ ...filters, pgType: val });
  };

  const handleSharingChange = (val) => {
    onChangeFilters({ ...filters, sharing: val });
  };

  const handlePriceChange = (e) => {
    onChangeFilters({ ...filters, maxPrice: Number(e.target.value) });
  };

  const toggleAmenity = (amenity) => {
    const current = filters.amenities || [];
    const updated = current.includes(amenity)
      ? current.filter(a => a !== amenity)
      : [...current, amenity];
    onChangeFilters({ ...filters, amenities: updated });
  };

  const toggleVerified = () => {
    onChangeFilters({ ...filters, verified: !filters.verified });
  };

  return (
    <aside className="re-filter-sidebar">
      
      {/* Header */}
      <div className="re-filter-header">
        <div className="re-filter-title-wrap">
          <SlidersHorizontal style={{ width: 16, height: 16, color: '#00D2FF' }} />
          <h2 className="re-filter-title">Filters</h2>
          <span className="re-count-badge">
            {totalResults} results
          </span>
        </div>
        <button
          type="button"
          onClick={onResetFilters}
          className="re-reset-btn"
        >
          <RotateCcw style={{ width: 12, height: 12 }} />
          <span>Reset</span>
        </button>
      </div>

      {/* Verified Only Toggle */}
      <div className="re-verified-toggle-box" onClick={toggleVerified}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ShieldCheck style={{ width: 18, height: 18, color: '#34D399', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#FFF' }}>RentEase Verified Only</div>
            <div style={{ fontSize: 10, color: '#94A3B8' }}>KYC and physical inspection passed</div>
          </div>
        </div>
        <div className={`re-switch ${filters.verified ? 'active' : ''}`}>
          <div className="re-switch-handle" />
        </div>
      </div>

      {/* PG Type / Gender Filter */}
      <div>
        <div className="re-filter-group-label">PG Type / Gender</div>
        <div className="re-gender-options">
          {[
            { id: 'ALL', label: 'All Spaces' },
            { id: 'UNISEX', label: 'Unisex / Co-living' },
            { id: 'GIRLS', label: 'Girls Only' },
            { id: 'BOYS', label: 'Boys Only' }
          ].map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => handleGenderChange(type.id)}
              className={`re-option-btn ${filters.pgType === type.id ? 'active' : ''}`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Room Sharing Type Filter */}
      <div>
        <div className="re-filter-group-label">Room Sharing</div>
        <div className="re-sharing-options">
          {[
            { id: 'ALL', label: 'Any' },
            { id: 'SINGLE', label: '1 Bed (Single)' },
            { id: 'DOUBLE', label: '2 Sharing' },
            { id: 'TRIPLE', label: '3 Sharing' }
          ].map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => handleSharingChange(s.id)}
              className={`re-sharing-btn ${filters.sharing === s.id ? 'active' : ''}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div>
        <div className="re-slider-header">
          <span className="re-filter-group-label" style={{ marginBottom: 0 }}>Max Monthly Budget</span>
          <span className="re-slider-val">
            ₹{filters.maxPrice ? filters.maxPrice.toLocaleString('en-IN') : '25,000'}/mo
          </span>
        </div>
        <input
          type="range"
          min="5000"
          max="30000"
          step="500"
          value={filters.maxPrice || 25000}
          onChange={handlePriceChange}
          className="re-range-input"
        />
        <div className="re-range-scale">
          <span>₹5,000</span>
          <span>₹17,500</span>
          <span>₹30,000+</span>
        </div>
      </div>

      {/* Amenities Multi-Select */}
      <div>
        <div className="re-filter-group-label">Must-Have Amenities</div>
        <div className="re-amenities-wrap">
          {AMENITIES_LIST.map((amenity) => {
            const isSelected = filters.amenities?.includes(amenity);
            return (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                className={`re-amenity-pill ${isSelected ? 'active' : ''}`}
              >
                {isSelected && <Check style={{ width: 12, height: 12, strokeWidth: 3 }} />}
                <span>{amenity}</span>
              </button>
            );
          })}
        </div>
      </div>

    </aside>
  );
}
