import React, { useState } from 'react';
import { ShieldCheck, MapPin, Eye, Calendar, Check, ChevronLeft, ChevronRight, Utensils, Wifi } from 'lucide-react';

export default function PropertyCard({
  property,
  onQuickView,
  onOpenDetails,
  onScheduleVisit,
  onBookNow,
  isCompared,
  onToggleCompare,
  isHovered,
  onHover
}) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const images = property.images && property.images.length > 0
    ? property.images
    : ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80"];

  const nextImage = (e) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const getGenderBadge = (type) => {
    switch (type) {
      case 'GIRLS':
        return <span style={{ background: 'rgba(244, 63, 94, 0.2)', color: '#FDA4AF', border: '1px solid rgba(244, 63, 94, 0.3)', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>Girls PG</span>;
      case 'BOYS':
        return <span style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#93C5FD', border: '1px solid rgba(59, 130, 246, 0.3)', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>Boys PG</span>;
      default:
        return <span style={{ background: 'rgba(0, 210, 255, 0.2)', color: '#67E8F9', border: '1px solid rgba(0, 210, 255, 0.3)', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>Unisex / Co-living</span>;
    }
  };

  return (
    <div
      onMouseEnter={() => onHover && onHover(property.id)}
      onMouseLeave={() => onHover && onHover(null)}
      className="re-property-card"
      style={{
        borderColor: isHovered ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.08)',
        boxShadow: isHovered ? '0 10px 35px rgba(0, 210, 255, 0.3)' : 'var(--shadow-card)',
        transform: isHovered ? 'translateY(-3px)' : 'none'
      }}
    >
      {/* Media Box */}
      <div className="re-card-media">
        <img
          src={images[activeImgIndex]}
          alt={property.name}
          className="re-card-img"
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,11,20,0.85) 0%, transparent 50%, rgba(0,0,0,0.4) 100%)', pointerEvents: 'none' }} />

        {/* Top Badges */}
        <div className="re-card-top-badges">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, pointerEvents: 'auto' }}>
            {getGenderBadge(property.pgType)}
            {property.verified && (
              <span style={{ background: '#10B981', color: '#020617', fontWeight: 900, fontSize: 10, padding: '2px 8px', borderRadius: 999, display: 'inline-flex', alignItems: 'center', gap: 4, letterSpacing: '0.04em' }}>
                <ShieldCheck style={{ width: 12, height: 12, strokeWidth: 3 }} />
                VERIFIED
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(property);
            }}
            style={{
              pointerEvents: 'auto',
              fontSize: 11,
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: 999,
              cursor: 'pointer',
              border: isCompared ? '1px solid #00D2FF' : '1px solid rgba(255,255,255,0.2)',
              background: isCompared ? '#00D2FF' : 'rgba(0,0,0,0.6)',
              color: isCompared ? '#030712' : '#FFF',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              transition: 'all 0.2s'
            }}
          >
            {isCompared ? <Check style={{ width: 12, height: 12, strokeWidth: 3 }} /> : null}
            <span>{isCompared ? 'Comparing' : '+ Compare'}</span>
          </button>
        </div>

        {/* Carousel controls */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImage}
              style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', width: 26, height: 26, borderRadius: '50%', background: 'rgba(0,0,0,0.65)', border: 'none', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <ChevronLeft style={{ width: 16, height: 16 }} />
            </button>
            <button
              type="button"
              onClick={nextImage}
              style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', width: 26, height: 26, borderRadius: '50%', background: 'rgba(0,0,0,0.65)', border: 'none', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <ChevronRight style={{ width: 16, height: 16 }} />
            </button>
          </>
        )}

        {/* Quick View Button Hover Overlay (Exact portfolio card match) */}
        <div className="re-card-hover-overlay">
          <button
            type="button"
            onClick={() => onQuickView(property)}
            className="btn-cyber re-card-quickview-btn"
          >
            <Eye style={{ width: 16, height: 16, strokeWidth: 2.5 }} />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Details Body */}
      <div className="re-card-body">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: '#94A3B8', marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#00D2FF', fontWeight: 800 }}>
              <span>★ {property.rating || '4.8'}</span>
              <span style={{ color: '#64748B', fontWeight: 500 }}>({property.reviewCount || 24})</span>
            </div>
            {property.distanceToLandmark && (
              <span style={{ color: '#94A3B8', fontSize: 11, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {property.distanceToLandmark}
              </span>
            )}
          </div>

          <h3
            onClick={() => onOpenDetails(property)}
            className="re-card-title"
          >
            {property.name}
          </h3>

          <div className="re-card-locality">
            <MapPin style={{ width: 13, height: 13, color: '#64748B', flexShrink: 0 }} />
            <span>{property.locality}, {property.city}</span>
          </div>

          <div className="re-card-amenities">
            {property.foodIncluded && (
              <span className="re-amenity-chip" style={{ color: '#6EE7B7', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                <Utensils style={{ width: 12, height: 12 }} />
                Meals
              </span>
            )}
            <span className="re-amenity-chip" style={{ color: '#67E8F9', borderColor: 'rgba(0, 210, 255, 0.3)' }}>
              <Wifi style={{ width: 12, height: 12 }} />
              Wi-Fi
            </span>
            <span className="re-amenity-chip">
              {property.gateClosingTime === 'No Curfew' ? 'No Curfew' : `Curfew: ${property.gateClosingTime}`}
            </span>
          </div>
        </div>

        {/* Card Footer */}
        <div className="re-card-footer">
          <div>
            <div className="re-price-label">Starting from</div>
            <div className="re-price-amount">
              ₹{Number(property.startingPrice).toLocaleString('en-IN')}
              <span>/mo</span>
            </div>
          </div>

          <div className="re-card-actions">
            <button
              type="button"
              onClick={() => onScheduleVisit(property)}
              title="Schedule a Free Visit"
              style={{ padding: '8px 10px', borderRadius: 10, background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(51, 65, 85, 0.8)', color: '#00D2FF', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <Calendar style={{ width: 16, height: 16 }} />
            </button>

            <button
              type="button"
              onClick={() => onBookNow(property)}
              className="btn-cyber"
              style={{ fontSize: 12, padding: '7px 14px', borderRadius: 10 }}
            >
              Book Bed
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
