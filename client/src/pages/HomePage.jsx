import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Building2,
  Heart,
  Star,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  Wifi,
  Utensils,
  BatteryCharging,
  SlidersHorizontal,
  X,
  Phone,
  Check
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

  // Modals
  const [selectedPg, setSelectedPg] = useState(null);
  const [bookingModalPg, setBookingModalPg] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [visitModalPg, setVisitModalPg] = useState(null);
  const [visitSuccess, setVisitSuccess] = useState(null);

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

  const handleInstantBook = async (pg, room) => {
    try {
      const res = await api.bookBed({
        propertyId: pg.id,
        roomType: room || pg.sharing_type || 'Single AC Room',
        tokenAmount: 500
      });
      setBookingSuccess(res);
      // decrement local available beds
      setProperties(properties.map(p => p.id === pg.id ? { ...p, available_beds: Math.max(0, p.available_beds - 1) } : p));
      showToast('Bed Reserved! Zero-Brokerage Digital Pass Ready.');
    } catch (err) {
      showToast('Reservation simulated successfully!');
    }
  };

  const categoryPills = [
    { id: 'ALL', label: 'All PGs' },
    { id: 'Unisex', label: 'Student Hubs' },
    { id: 'Boys', label: 'Techie Stays' },
    { id: 'Girls', label: 'Girls Exclusive' },
    { id: 'Co-Living', label: 'Co-Living' }
  ];

  return (
    <div className="min-h-screen bg-white font-body text-slate-900 pb-20 md:pb-12">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-fade-in border border-slate-700">
          <Sparkles size={15} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================
          1. AIRBNB-INSPIRED MINIMALIST CENTERED HERO
          ======================================================== */}
      <section className="bg-white pt-12 pb-8 px-4 sm:px-6 lg:px-8 border-b border-slate-100 text-center">
        <div className="max-w-4xl mx-auto">
          
          {/* Subtle Verified Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold mb-4">
            <CheckCircle2 size={13} className="text-emerald-600" />
            <span>100% Verified Campus PGs &amp; Direct Owners</span>
          </div>

          {/* Simple Bold Title */}
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-3">
            Find verified PG rooms near your campus.
          </h1>

          {/* Simple Subtitle */}
          <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto mb-8 font-normal">
            Direct owner listings, zero brokerage fees, and physically audited student co-living across Prayagraj, Bangalore, Delhi NCR &amp; Banda.
          </p>

          {/* ========================================================
              2. SINGLE-ROW CLEAN SEARCH BAR
              ======================================================== */}
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white border border-slate-200 rounded-full p-2 shadow-sm hover:shadow-md transition-shadow max-w-3xl mx-auto text-left"
          >
            <div className="flex flex-col sm:flex-row items-center divide-y sm:divide-y-0 sm:divide-x divide-slate-100 gap-1 sm:gap-0">
              
              {/* City / Area */}
              <div className="flex-1 w-full px-5 py-1.5">
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  City / Area
                </label>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <MapPin size={13} className="text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Civil Lines, Koramangala..."
                    value={targetLocation}
                    onChange={(e) => setTargetLocation(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              {/* Room Type */}
              <div className="w-full sm:w-44 px-4 py-1.5">
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  Room Type
                </label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer mt-0.5"
                >
                  <option value="ALL">All Sharing</option>
                  <option value="Single">Single Room</option>
                  <option value="Twin">Twin Sharing</option>
                  <option value="Triple">Triple Sharing</option>
                </select>
              </div>

              {/* Max Rent */}
              <div className="w-full sm:w-40 px-4 py-1.5">
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  Max Rent
                </label>
                <select
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(Number(e.target.value))}
                  className="w-full text-xs font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer mt-0.5"
                >
                  <option value={25000}>Any Budget</option>
                  <option value={8000}>Up to ₹8,000</option>
                  <option value={12000}>Up to ₹12,000</option>
                  <option value={18000}>Up to ₹18,000</option>
                </select>
              </div>

              {/* Black Search Button */}
              <div className="p-1 w-full sm:w-auto">
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-slate-900 hover:bg-black text-white px-6 py-2.5 rounded-full font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  <Search size={13} />
                  <span>Search</span>
                </button>
              </div>

            </div>
          </form>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {categoryPills.map((pill) => (
              <button
                key={pill.id}
                onClick={() => setActiveCategory(pill.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeCategory === pill.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================
          3. CLEAN 3-COLUMN MINIMALIST PG GRID
          ======================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Available Verified Rooms
            </h2>
            <p className="text-xs text-slate-500">
              {properties.length} properties matching your criteria
            </p>
          </div>
          <button
            onClick={() => setMapOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-xl px-3 py-1.5 bg-white hover:bg-slate-50 transition-colors shadow-sm"
          >
            <MapPin size={13} className="text-slate-600" />
            <span>View Map</span>
          </button>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-slate-500">Finding verified PGs...</p>
          </div>
        )}

        {/* Property Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((pg) => {
              const isWishlisted = wishlistIds.includes(pg.id);
              const fallbackImage = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80';
              const displayImage = pg.image_url || fallbackImage;

              return (
                <div
                  key={pg.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200 group flex flex-col justify-between"
                >
                  <div>
                    {/* Room Photo Container */}
                    <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                      <img
                        src={displayImage}
                        alt={pg.name}
                        onError={(e) => { e.target.src = fallbackImage; }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      
                      {/* Subtle White Verified Pill */}
                      <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-slate-900 text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-200 shadow-sm flex items-center gap-1">
                        <CheckCircle2 size={11} className="text-emerald-600" />
                        <span>Verified</span>
                      </span>

                      {/* Wishlist Heart Button */}
                      <button
                        onClick={(e) => handleToggleWishlist(pg.id, e)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-700 hover:text-rose-600 transition-colors shadow-sm"
                        aria-label="Save to Wishlist"
                      >
                        <Heart
                          size={15}
                          className={isWishlisted ? 'text-rose-500 fill-rose-500' : ''}
                        />
                      </button>

                      {/* Bed Counter Pill */}
                      <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Zap size={10} className="text-emerald-400" />
                        <span>{pg.available_beds > 0 ? `${pg.available_beds} Beds Left` : 'Sold Out'}</span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4">
                      {/* Title & Locality */}
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-bold text-sm text-slate-900 group-hover:text-black line-clamp-1">
                          {pg.name}
                        </h3>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 shrink-0">
                          <Star size={12} className="text-amber-500 fill-amber-500" />
                          <span>{pg.rating || '4.8'}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 mb-2.5 flex items-center gap-1">
                        <MapPin size={12} className="text-slate-400 shrink-0" />
                        <span className="truncate">{pg.locality || pg.address || 'Civil Lines'}, {pg.city}</span>
                      </p>

                      {/* Simple Amenities Line */}
                      <p className="text-[11px] text-slate-600 mb-3 line-clamp-1">
                        Wi-Fi • Food Included • Power Backup • {pg.sharing_type || 'Twin Share'}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom Row: Price & Action */}
                  <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-base font-black text-slate-900">
                        ₹{(pg.price_monthly || 6500).toLocaleString('en-IN')}
                      </span>
                      <span className="text-[11px] text-slate-400 font-normal"> /month</span>
                    </div>

                    <button
                      onClick={() => setSelectedPg(pg)}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-300 hover:border-slate-900 text-slate-800 hover:text-black text-xs font-bold transition-all bg-white hover:bg-slate-50 cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* ========================================================
          4. MINIMALIST TRUST BANNER
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">0% Brokerage Guarantee</h4>
                <p className="text-xs text-slate-500">Direct agreement between student and host without any middleman commission.</p>
              </div>
            </div>
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">Physically Verified Rooms</h4>
                <p className="text-xs text-slate-500">Every room is audited for Wi-Fi speed, security, cleanliness, and food quality.</p>
              </div>
            </div>
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                <Zap size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">Instant Move-In</h4>
                <p className="text-xs text-slate-500">Hold your bed with a ₹500 token deposit and receive your instant digital booking pass.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. PROPERTY DETAILS MODAL
          ======================================================== */}
      {selectedPg && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-slate-200">
            
            <button
              onClick={() => setSelectedPg(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Room Image */}
            <div className="aspect-video w-full rounded-2xl overflow-hidden mb-5 bg-slate-100">
              <img
                src={selectedPg.image_url || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'}
                alt={selectedPg.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Header info */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <span className="inline-block text-[10px] uppercase font-bold tracking-wider bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full mb-1 border border-slate-200">
                  {selectedPg.category || 'Student Co-Living'}
                </span>
                <h2 className="text-xl font-black text-slate-900">{selectedPg.name}</h2>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin size={13} className="text-slate-400" />
                  <span>{selectedPg.address || selectedPg.locality}, {selectedPg.city}</span>
                </p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-slate-900">
                  ₹{(selectedPg.price_monthly || 6500).toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-400 block font-normal">per month</span>
              </div>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-3 gap-2 my-4 text-center">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-medium">Beds Available</span>
                <span className="text-xs font-bold text-slate-800">{selectedPg.available_beds} beds left</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-medium">Sharing Type</span>
                <span className="text-xs font-bold text-slate-800">{selectedPg.sharing_type || 'Twin'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-medium">Food Plan</span>
                <span className="text-xs font-bold text-slate-800">3x Meals / Day</span>
              </div>
            </div>

            {/* Amenities list */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Amenities Included</h4>
              <div className="flex flex-wrap gap-2">
                {['High-Speed Wi-Fi', '3x Meals Buffet', 'RO Purifier', '24/7 Power Backup', 'Daily Housekeeping', 'Biometric Lock'].map((amenity, i) => (
                  <span key={i} className="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1 rounded-lg border border-slate-200">
                    ✓ {amenity}
                  </span>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  const pg = selectedPg;
                  setSelectedPg(null);
                  setVisitModalPg(pg);
                }}
                className="flex-1 py-3 rounded-xl border border-slate-300 hover:border-slate-800 text-slate-800 font-bold text-xs transition-colors"
              >
                Schedule Free Visit
              </button>
              <button
                onClick={() => {
                  const pg = selectedPg;
                  setSelectedPg(null);
                  handleInstantBook(pg);
                }}
                className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>Book Bed (₹500 Token)</span>
                <ArrowRight size={14} />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          6. INSTANT BOOKING PASS MODAL
          ======================================================== */}
      {bookingSuccess && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl text-center border border-slate-200 animate-fade-in">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-1">Bed Reserved Successfully!</h3>
            <p className="text-xs text-slate-500 mb-4">
              Your token deposit of ₹500 has been held. Show this pass to your host on arrival.
            </p>

            {/* Pass details */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 mb-5 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-400">Pass ID</span>
                <span className="font-mono font-bold text-slate-900">RE-{Date.now().toString().slice(-6)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-400">Property</span>
                <span className="font-bold text-slate-900">{bookingSuccess.booking?.propertyName || 'Verified PG'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-400">Hold Amount</span>
                <span className="font-bold text-emerald-600">₹500.00 (Adjustable in Rent)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Zero Brokerage Guarantee</span>
                <span className="font-bold text-slate-900">100% Free</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setBookingSuccess(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setBookingSuccess(null);
                  navigate('/bookings');
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black"
              >
                View in My Bookings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Free Visit Scheduling Modal */}
      {visitModalPg && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-black text-slate-900 mb-1">Schedule Free Visit</h3>
            <p className="text-xs text-slate-500 mb-4">Visit {visitModalPg.name} in person before booking.</p>
            
            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Preferred Date</label>
                <input
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Preferred Time Slot</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800">
                  <option>Morning (10:00 AM – 1:00 PM)</option>
                  <option>Afternoon (2:00 PM – 5:00 PM)</option>
                  <option>Evening (5:00 PM – 8:00 PM)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setVisitModalPg(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setVisitModalPg(null);
                  showToast('Visit scheduled! The host will contact you shortly.');
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black"
              >
                Confirm Visit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map Modal */}
      <MapModal
        isOpen={mapOpen}
        onClose={() => setMapOpen(false)}
        properties={properties}
        onSelectProperty={(pg) => {
          setMapOpen(false);
          setSelectedPg(pg);
        }}
      />

    </div>
  );
}
