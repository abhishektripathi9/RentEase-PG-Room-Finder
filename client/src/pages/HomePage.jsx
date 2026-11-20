import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Building2,
  DollarSign,
  Heart,
  Star,
  Zap,
  Wifi,
  Utensils,
  Sparkles,
  ShieldCheck,
  Map as MapIcon,
  CheckCircle2,
  ArrowRight,
  UserCheck,
  Clock,
  ExternalLink,
  SlidersHorizontal
} from 'lucide-react';
import { api } from '../services/api';
import MapModal from '../components/MapModal';

export default function HomePage() {
  const navigate = useNavigate();

  // Search State
  const [targetLocation, setTargetLocation] = useState('');
  const [roomType, setRoomType] = useState('ALL');
  const [maxBudget, setMaxBudget] = useState(25000);
  const [activeCategory, setActiveCategory] = useState('ALL');

  // Properties State
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [mapOpen, setMapOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const loadProperties = async () => {
    try {
      setLoading(true);
      const filters = {
        query: targetLocation,
        category: activeCategory !== 'ALL' ? activeCategory : undefined,
        maxBudget: maxBudget < 25000 ? maxBudget : undefined,
        roomType: roomType !== 'ALL' ? roomType : undefined
      };
      const data = await api.getProperties(filters);
      setProperties(data || []);
    } catch (err) {
      console.error('Failed to load properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
    // Load local saved IDs
    try {
      const saved = JSON.parse(localStorage.getItem('rentease_saved_pgs') || '[]');
      setWishlistIds(saved);
    } catch (e) {}
  }, [activeCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadProperties();
  };

  const handleToggleWishlist = async (id, e) => {
    e.stopPropagation();
    e.preventDefault();
    const res = await api.toggleWishlist(id);
    if (res.wishlisted) {
      setWishlistIds([...wishlistIds, id]);
      showToast('Saved to your wishlist! View in Saved PGs.');
    } else {
      setWishlistIds(wishlistIds.filter(x => x !== id));
      showToast('Removed from wishlist.');
    }
  };

  const categoryPills = [
    { id: 'ALL', label: 'All PGs' },
    { id: 'Unisex', label: 'Student Hubs' },
    { id: 'Boys', label: 'Techie Stays' },
    { id: 'Girls', label: 'Girls Exclusive' },
    { id: 'Unisex', label: 'Co-Living' }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-body text-slate-800 pb-20 md:pb-12">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-24 right-5 z-50 bg-[#071917] text-white border border-emerald-500/50 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-fade-in">
          <Sparkles size={16} className="text-[#10B981]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================
          1. HERO SECTION (Deep Forest-Slate #071917)
          ======================================================== */}
      <section className="relative bg-[#071917] text-white pt-16 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-emerald-950">
        
        {/* Ambient Gradient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-6 tracking-wide shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Zap size={14} className="text-[#10B981] fill-[#10B981]" />
            <span>India's #1 Zero Brokerage PG &amp; Co-Living Network</span>
          </div>

          {/* Two-Tone Bold Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight leading-none mb-6">
            Find Your Space. <span className="text-[#10B981] inline-block">Live Without Friction.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 font-medium leading-relaxed mb-8">
            Curated student residences and tech-professional co-living across Bangalore, Prayagraj, Delhi NCR, and Banda. 
            0% brokerage, 48hr deposit returns, and instant digital bed reservation.
          </p>

          {/* 3 Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-bold text-slate-300">
            <div className="flex items-center gap-2 bg-slate-900/60 px-3.5 py-1.5 rounded-full border border-emerald-900/40">
              <CheckCircle2 size={16} className="text-[#10B981]" />
              <span>100% Verified Inspection</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/60 px-3.5 py-1.5 rounded-full border border-emerald-900/40">
              <ShieldCheck size={16} className="text-[#10B981]" />
              <span>Direct Owners (No Agents)</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/60 px-3.5 py-1.5 rounded-full border border-emerald-900/40">
              <Zap size={16} className="text-[#10B981]" />
              <span>Instant Move-In Guarantee</span>
            </div>
          </div>

        </div>

      </section>

      {/* ========================================================
          2. FLOATING SEARCH CARD (Overlapping Card)
          ======================================================== */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 relative z-20">
        <form
          onSubmit={handleSearchSubmit}
          className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-7 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Target Location */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Target Location / Hub
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Koramangala, UIT Prayagraj..."
                  value={targetLocation}
                  onChange={(e) => setTargetLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Room Type */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Room Sharing Type
              </label>
              <div className="relative">
                <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="ALL">All Sharing Types</option>
                  <option value="Single">Single Private Studio</option>
                  <option value="Twin">Twin Sharing Room</option>
                  <option value="Triple">Triple Sharing Room</option>
                </select>
              </div>
            </div>

            {/* Max Budget */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Max Monthly Budget
                </label>
                <span className="text-xs font-extrabold text-emerald-600 tabular-nums font-mono">
                  ₹{maxBudget.toLocaleString()} /mo
                </span>
              </div>
              <input
                type="range"
                min={4000}
                max={25000}
                step={500}
                value={maxBudget}
                onChange={(e) => setMaxBudget(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-100 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>₹4,000</span>
                <span>₹15,000</span>
                <span>₹25,000+</span>
              </div>
            </div>

          </div>

          {/* Full-Width Vibrant Emerald CTA Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-2xl bg-[#10B981] hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(16,185,129,0.35)] transition-all cursor-pointer font-heading"
          >
            <Search size={18} strokeWidth={2.5} />
            <span>Find My PG ({properties.length} Verified Available)</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>

      {/* ========================================================
          3. EXPLORE CATEGORIES & VIEW MAP BAR
          ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Horizontal Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categoryPills.map((cat, idx) => {
              const isActive = activeCategory === cat.id && (idx === 0 || activeCategory !== 'ALL');
              return (
                <button
                  key={idx}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#0F172A] text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* "View Map" Toggle Button */}
          <button
            onClick={() => setMapOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-50 shadow-xs transition-all cursor-pointer self-start sm:self-auto"
          >
            <MapIcon size={15} className="text-emerald-600" />
            <span>View Interactive Map</span>
          </button>

        </div>
      </div>

      {/* ========================================================
          4. AVAILABLE NEAR YOU GRID
          ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black font-heading text-slate-900 tracking-tight">
              Available Near You
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Physically verified rooms with live bed inventory &amp; 0% brokerage guarantee
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500 tabular-nums">
            Showing {properties.length} listings
          </span>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-3xl border border-slate-200 h-96 animate-pulse" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
            <Building2 size={40} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-800 font-heading">No listings match your search</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your locality, room sharing type, or monthly budget range.
            </p>
            <button
              onClick={() => {
                setTargetLocation('');
                setRoomType('ALL');
                setMaxBudget(25000);
                setActiveCategory('ALL');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((prop) => {
              const isWish = wishlistIds.includes(prop.id);
              const firstImage = prop.images && prop.images[0]
                ? prop.images[0]
                : 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80';
              const originalRent = Math.round(prop.price_starting * 1.2);

              return (
                <div
                  key={prop.id}
                  onClick={() => navigate(`/pg/${prop.id}`)}
                  className="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer"
                >
                  
                  {/* Top Image Container */}
                  <div className="relative h-56 bg-slate-950 overflow-hidden">
                    <img
                      src={firstImage}
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

                    {/* Top-Left: Zero Brokerage & Category Pills */}
                    <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 flex items-center gap-1 shadow-md">
                        ✓ Zero Brokerage
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 backdrop-blur-xs text-white border border-white/20">
                        {prop.category}
                      </span>
                    </div>

                    {/* Top-Right: Star Rating Badge */}
                    <div className="absolute top-3.5 right-3.5 bg-slate-900/85 backdrop-blur-xs text-white px-2.5 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 border border-white/10 shadow-sm">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      <span>{prop.rating || '4.9'}</span>
                      <span className="text-slate-400 text-[10px]">({prop.reviews_count || 128})</span>
                    </div>

                    {/* Bottom-Left: Amber/Green Availability Pill */}
                    <div className="absolute bottom-3.5 left-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-black flex items-center gap-1 backdrop-blur-xs shadow-md ${
                        prop.available_beds <= 2
                          ? 'bg-amber-500 text-slate-950 animate-pulse'
                          : 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        <Zap size={12} className="fill-current" />
                        <span>
                          {prop.available_beds <= 2
                            ? `Only ${prop.available_beds} Beds Left`
                            : `${prop.available_beds} Beds Available`}
                        </span>
                      </span>
                    </div>

                    {/* Bottom-Right: Heart Wishlist Toggle Button */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleWishlist(prop.id, e)}
                      className={`absolute bottom-3.5 right-3.5 w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-md ${
                        isWish ? 'bg-rose-500 text-white' : 'bg-white/90 backdrop-blur-xs text-slate-700 hover:text-rose-500'
                      }`}
                      title={isWish ? 'Remove from Saved' : 'Save Property'}
                    >
                      <Heart size={16} className={isWish ? 'fill-white' : ''} />
                    </button>

                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    
                    <div>
                      {/* Title + Room Badge */}
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h3 className="font-heading font-extrabold text-base text-slate-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                          {prop.title}
                        </h3>
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 shrink-0">
                          {prop.room_types && prop.room_types[0] ? prop.room_types[0].type.split(' ')[0] : 'STUDIO'}
                        </span>
                      </div>

                      {/* Landmark Proximity */}
                      <div className="flex items-center gap-1 text-xs text-slate-500 mb-2.5">
                        <MapPin size={13} className="text-emerald-600 shrink-0" />
                        <span className="truncate">
                          {prop.landmark_distance || `${prop.locality}, ${prop.city}`}
                        </span>
                      </div>

                      {/* Room Highlight Pills */}
                      <div className="flex flex-wrap gap-1.5 mb-3.5">
                        <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-100">
                          Single / Twin Share
                        </span>
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                          Private Attached Bath
                        </span>
                      </div>

                      {/* 4-Box Amenity Grid */}
                      <div className="grid grid-cols-4 gap-2 py-2.5 px-3 bg-slate-50 rounded-2xl border border-slate-100 mb-4 text-center">
                        <div className="flex flex-col items-center">
                          <Wifi size={14} className="text-emerald-600 mb-0.5" />
                          <span className="text-[9px] font-bold text-slate-600">Fast Wi-Fi</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <Utensils size={14} className="text-emerald-600 mb-0.5" />
                          <span className="text-[9px] font-bold text-slate-600">3x Meals</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <Sparkles size={14} className="text-emerald-600 mb-0.5" />
                          <span className="text-[9px] font-bold text-slate-600">Cleaning</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <ShieldCheck size={14} className="text-emerald-600 mb-0.5" />
                          <span className="text-[9px] font-bold text-slate-600">Biometric</span>
                        </div>
                      </div>
                    </div>

                    {/* Price & Action Row */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-black font-heading text-slate-900 tabular-nums">
                            ₹{prop.price_starting.toLocaleString()}
                          </span>
                          <span className="text-xs text-slate-400 line-through tabular-nums">
                            ₹{originalRent.toLocaleString()}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500">/mo</span>
                        </div>
                        <div className="text-[10px] font-bold text-emerald-600">
                          ✓ Zero Security Lock-in
                        </div>
                      </div>

                      {/* Black "View & Book →" Pill Button */}
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-900 group-hover:bg-[#10B981] text-white group-hover:text-slate-950 font-extrabold text-xs shadow-xs transition-colors">
                        <span>View &amp; Book</span>
                        <ArrowRight size={13} />
                      </span>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* ========================================================
          5. RENTEASE TRUST PROMISE FOOTER BANNER
          ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-[#071917] rounded-3xl p-8 sm:p-12 text-white border border-emerald-950 relative overflow-hidden">
          
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold mb-4">
              <ShieldCheck size={14} />
              <span>RentEase PRO Zero-Brokerage Charter</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight mb-4 text-white">
              Direct host interaction without middlemen. Guaranteed.
            </h2>
            
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
              Every property listed on RentEase PRO undergoes stringent physical audit, biometric check verification, and landlord KYC. 
              Hold your room with just ₹500 token advance—and if your room isn't ready as promised, your deposit is returned within 48 hours or RentEase pays.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-emerald-950/80 text-xs font-bold text-slate-300">
              <div>
                <span className="text-emerald-400 font-extrabold block text-lg font-heading">0%</span>
                Brokerage or Service Fee
              </div>
              <div>
                <span className="text-emerald-400 font-extrabold block text-lg font-heading">48 Hrs</span>
                Deposit Return Guarantee
              </div>
              <div>
                <span className="text-emerald-400 font-extrabold block text-lg font-heading">100%</span>
                Live Bed Inventory Lock
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Map Modal */}
      {mapOpen && (
        <MapModal properties={properties} onClose={() => setMapOpen(false)} />
      )}

    </div>
  );
}
